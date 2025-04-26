// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

contract MedicalRecord {
    struct Record {
        bytes32 dataHash;
        uint256 timestamp;
        address updater;
        string role;
    }

    mapping(address => Record[]) public records;

    function storeRecord(address _patient, bytes32 _dataHash, string calldata _role) external {
        records[_patient].push(Record({
            dataHash: _dataHash,
            timestamp: block.timestamp,
            updater: msg.sender,
            role: _role
        }));
    }

    function getRecords(address _patient) external view returns (Record[] memory) {
        return records[_patient];
    }
}