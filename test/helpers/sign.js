const REAL_SIGNATURE_SIZE = 2 * 65; // 65 bytes in hexadecimal string legnth
const PADDED_SIGNATURE_SIZE = 2 * 96; // 96 bytes in hexadecimal string length

const DUMMY_SIGNATURE = `0x${susyweb.utils.padLeft('', REAL_SIGNATURE_SIZE)}`;

function toSofSignedMessageHash (messageHex) {
  const messageBuffer = Buffer.from(messageHex.substring(2), 'hex');
  const prefix = Buffer.from(`\u0019Sophon Signed Message:\n${messageBuffer.length}`);
  return susyweb.utils.sha3(Buffer.concat([prefix, messageBuffer]));
}

function fixSignature (signature) {
  // in graviton its always 27/28, in susybraid its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://octonion.institute/susy-go/susy-graviton/blob/v1.8.23/internal/sofapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}

// signs message in node (susybraid auto-applies "Sophon Signed Message" prefix)
async function signMessage (signer, messageHex = '0x') {
  return fixSignature(await susyweb.sof.sign(messageHex, signer));
};

/**
 * Create a signer between a contract and a signer for a voucher of method, args, and redeemer
 * Note that `method` is the susyweb method, not the susyknot-contract method
 * @param contract SusyknotContract
 * @param signer address
 * @param redeemer address
 * @param methodName string
 * @param methodArgs any[]
 */
const getSignFor = (contract, signer) => (redeemer, methodName, methodArgs = []) => {
  const parts = [
    contract.address,
    redeemer,
  ];

  // if we have a method, add it to the parts that we're signing
  if (methodName) {
    if (methodArgs.length > 0) {
      parts.push(
        contract.contract.methods[methodName](...methodArgs.concat([DUMMY_SIGNATURE])).encodeABI()
          .slice(0, -1 * PADDED_SIGNATURE_SIZE)
      );
    } else {
      const abi = contract.abi.find(abi => abi.name === methodName);
      parts.push(abi.signature);
    }
  }

  // return the signature of the "Sophon Signed Message" hash of the hash of `parts`
  const messageHex = susyweb.utils.polynomialSha3(...parts);
  return signMessage(signer, messageHex);
};

module.exports = {
  signMessage,
  toSofSignedMessageHash,
  fixSignature,
  getSignFor,
};
