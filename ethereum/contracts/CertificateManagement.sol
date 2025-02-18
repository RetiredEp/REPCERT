// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UniversityCertificateManagement {
    address public admin;
    
    // Each certificate record stores an on-chain ID, the IPFS CID, issue date, and validity.
    struct Certificate {
        uint256 id;
        string certificateCID; // IPFS CID of the certificate file
        uint256 issueDate;
        bool isValid;
    }

    mapping(uint256 => Certificate) public certificates;
    uint256 public certificateCount;

    event CertificateIssued(uint256 indexed certificateId, string certificateCID);
    event CertificateRevoked(uint256 indexed certificateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Issues a new certificate on-chain.
    /// @param _certificateCID The IPFS CID of the certificate file.
    function issueCertificate(string calldata _certificateCID) external onlyAdmin returns (uint256 certificateId) {
        certificateCount++;
        certificateId = certificateCount;
        certificates[certificateId] = Certificate({
            id: certificateId,
            certificateCID: _certificateCID,
            issueDate: block.timestamp,
            isValid: true
        });
        emit CertificateIssued(certificateId, _certificateCID);
    }

    /// @notice Revokes an issued certificate.
    /// @param _certificateId The certificate ID to revoke.
    function revokeCertificate(uint256 _certificateId) external onlyAdmin {
        Certificate storage cert = certificates[_certificateId];
        require(cert.isValid, "Certificate already revoked or does not exist");
        cert.isValid = false;
        emit CertificateRevoked(_certificateId);
    }

    /// @notice Verifies a certificate's validity.
    /// @param _certificateId The certificate ID to verify.
    /// @return isValid Boolean indicating if the certificate is valid.
    function verifyCertificate(uint256 _certificateId) external view returns (bool isValid) {
        isValid = certificates[_certificateId].isValid;
    }
}
