module.exports = {
    norpc: true,
    testCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/susyknot test --network coverage',
    compileCommand: 'node --max-old-space-size=4096 ../node_modules/.bin/susyknot compile --network coverage',
    skipFiles: [
        'lifecycle/Migrations.pol',
        'mocks'
    ]
}
