# REPCERT

A web application for academic certificate issuance and verification using Ethereum blockchain and IPFS, built as a final-year senior design project.

## Overview

REPCERT lets a university issue tamper-proof digital certificates. Certificate records are anchored on the Ethereum blockchain via a Solidity smart contract, with certificate files stored on IPFS, so authenticity can be verified independently of the issuing institution's own database.

## Roles

- **Student** — submits a certificate request, tracks its status, and views the approved certificate once issued
- **Admin** — reviews and approves/rejects submitted certificate requests
- **Verifier** — verifies the authenticity of an issued certificate against the blockchain record

## Tech Stack

- **Blockchain:** Solidity smart contract (`CertificateManagement.sol`) deployed to Ethereum
- **Storage:** IPFS for certificate file storage
- **Backend:** Node.js
- **Database:** (see `config/db.js`)
- **Frontend:** Server-rendered views (EJS) for Admin, Student, and Verifier dashboards

## Project Structure

```
ethereum/
  ├── contracts/CertificateManagement.sol   # Smart contract
  ├── compile.js                            # Compiles the contract
  ├── deploy.js                             # Deploys the contract
  ├── build/UniversityCertificateManagement.json
  └── ADDRESS                               # Deployed contract address

src/
  ├── config/
  │   ├── db.js                             # Database connection
  │   └── ipfs.js                           # IPFS client config
  ├── controllers/
  │   └── studentController.js
  ├── models/
  │   └── submissionModel.js
  ├── routes/
  │   ├── adminRoutes.js
  │   ├── studentRoutes.js
  │   └── verifierRoutes.js
  └── views/
      ├── admin/
      ├── student/                           # submit, dashboard, status, approved
      └── verifier/
```

## Setup

1. Install dependencies: `npm install`
2. Configure environment variables in `.env` (database and IPFS connection details)
3. Compile the smart contract: `node ethereum/compile.js`
4. Deploy the smart contract: `node ethereum/deploy.js`
5. Start the server: `npm start` (or `node src/index.js`)

## Status

Final-year academic senior design project.
