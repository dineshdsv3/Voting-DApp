pragma solidity 0.5.0;

contract election{

    string public candidate;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    constructor() public {
        addCandidate("Dinesh");
        addCandidate("Sheki");
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }

}