const {Web3} = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(
    'quarter stereo inflict sad rail rapid trophy visa hawk uniform fault roof',
    'https://sepolia.infura.io/v3/c2281a3456fd46fda8164cd9c8606f44'
);
const web3 = new Web3(provider);
const compiledCertificate = require('./build/UniversityCertificateManagement.json');

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(compiledCertificate.abi)
        .deploy({ data: compiledCertificate.evm.bytecode.object })
        .send({ from: accounts[0], gas: '1000000' });

    console.log('Contract deployed to', result.options.address);
};

deploy();