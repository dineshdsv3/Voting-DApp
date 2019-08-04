const Election = artifacts.require("./Election.sol");

contract('Election',(accounts) => {
    before(async() => {
        this.election = await Election.deployed();
    })


    it("Deployed Successfully",async() => {
        const address = await this.election.address;
        assert.notEqual(address,'0x0');
        assert.notEqual(address,'');
        assert.notEqual(address,null);
        assert.notEqual(address,null)
    });

    it("Candidates Added", async() => {
        const count = await this.election.candidatesCount();
        const candidates = await this.election.candidates(1);
        assert.equal(count.toNumber(),2,"Count is good");
        assert.equal(candidates[1],"Dinesh");
    })
})

