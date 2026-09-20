// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AcademiChainRegistry {
    struct Credential {
        bytes32 credentialHash;
        address issuer;
        uint256 issuedAt;
        bool active;
        bool exists;
    }

    struct ProvenanceEvent {
        string eventType;
        address actor;
        uint256 timestamp;
    }

    mapping(bytes32 => Credential) private credentials;
    mapping(bytes32 => ProvenanceEvent[]) private provenance;
    mapping(address => bool) public issuers;
    address public admin;

    event CredentialRegistered(bytes32 indexed credentialHash, address indexed issuer, uint256 timestamp);
    event CredentialRevoked(bytes32 indexed credentialHash, address indexed actor, uint256 timestamp);
    event IssuerUpdated(address indexed issuer, bool enabled);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(issuers[msg.sender], "Not an authorized issuer");
        _;
    }

    constructor() {
        admin = msg.sender;
        issuers[msg.sender] = true;
        emit IssuerUpdated(msg.sender, true);
    }

    function setIssuer(address issuer, bool enabled) external onlyAdmin {
        issuers[issuer] = enabled;
        emit IssuerUpdated(issuer, enabled);
    }

    function registerCredential(bytes32 credentialHash) external onlyIssuer {
        require(credentialHash != bytes32(0), "Invalid credential hash");
        require(!credentials[credentialHash].exists, "Credential already registered");

        credentials[credentialHash] = Credential(
            credentialHash,
            msg.sender,
            block.timestamp,
            true,
            true
        );

        provenance[credentialHash].push(
            ProvenanceEvent("ISSUED", msg.sender, block.timestamp)
        );

        emit CredentialRegistered(credentialHash, msg.sender, block.timestamp);
    }

    function revokeCredential(bytes32 credentialHash) external {
        require(credentials[credentialHash].exists, "Credential not found");
        require(
            msg.sender == credentials[credentialHash].issuer || msg.sender == admin,
            "Not authorized to revoke"
        );
        require(credentials[credentialHash].active, "Credential already inactive");

        credentials[credentialHash].active = false;

        provenance[credentialHash].push(
            ProvenanceEvent("REVOKED", msg.sender, block.timestamp)
        );

        emit CredentialRevoked(credentialHash, msg.sender, block.timestamp);
    }

    function verifyCredential(bytes32 credentialHash)
        external
        view
        returns (bool exists, bool active, address issuer, uint256 issuedAt)
    {
        Credential memory credential = credentials[credentialHash];
        return (credential.exists, credential.active, credential.issuer, credential.issuedAt);
    }

    function getProvenanceCount(bytes32 credentialHash) external view returns (uint256) {
        return provenance[credentialHash].length;
    }

    function getProvenanceEvent(bytes32 credentialHash, uint256 index)
        external
        view
        returns (string memory eventType, address actor, uint256 timestamp)
    {
        require(index < provenance[credentialHash].length, "Invalid event index");
        ProvenanceEvent memory eventRecord = provenance[credentialHash][index];
        return (eventRecord.eventType, eventRecord.actor, eventRecord.timestamp);
    }
}
