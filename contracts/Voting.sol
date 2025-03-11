// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;
    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(string[] memory _candidateNames, uint256 _timeDuration) {
        require(_candidateNames.length > 0, "At least one candidate required");
        require(_timeDuration > 0, "Time duration must be greater than 0");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }

        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = votingStart + (_timeDuration * 1 minutes); 
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
    }

    function vote(uint256 candidateIndex) public {
        require(!voters[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate index");
        require(block.timestamp >= votingStart, "Voting has not started yet");
        require(block.timestamp <= votingEnd, "Voting has ended");

        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;
    }

    function getAllVotesOfCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (string memory) {
        if (block.timestamp < votingStart) {
            return "Voting has not started yet";
        } else if (block.timestamp >= votingStart && block.timestamp <= votingEnd) {
            return "Voting is in progress";
        } else {
            return "Voting has ended";
        }
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) {
            return 0; 
        }
        return votingEnd - block.timestamp;
    }
}
