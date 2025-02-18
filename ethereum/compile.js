const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const certificatePath = path.resolve(__dirname, 'contracts', 'CertificateManagement.sol');
const source = fs.readFileSync(certificatePath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'CertificateManagement.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

for (let contract in output.contracts['CertificateManagement.sol']) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        output.contracts['CertificateManagement.sol'][contract]
    );
}