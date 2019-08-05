app = {
    loading :false,
    contracts : {},

    load : async () => {
        await app.loadWeb3();
        await app.loadAccount();
        await app.loadContract();
        await app.renderingCandidates();
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            app.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            app.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount : async () => {
        app.account = web3.eth.accounts;
        console.log('the account associated is', app.account);
    },

    loadContract: async () => {
        const election = await $.getJSON('election.json');
        app.contracts.election = TruffleContract(election);
        app.contracts.election.setProvider(app.web3Provider);

        // Getting the values from blockchain by smart contract

        app.election = await app.contracts.election.deployed();
        console.log(app.election);
    },

    renderingCandidates : async () => {
        app.setLoading(true);

        $('#accountAddress').html('The account associated is '+ app.account);
        var can = await app.election.candidatesCount();
        var candidateCount = can.toNumber();
        
        console.log(candidateCount);
        for(let i=1; i<=candidateCount;i++) {
            var candidates = await app.election.candidates(i);
            var candId = candidates[0].toNumber();
            var candName = candidates[1];
            var candVote = candidates[2].toNumber();

            var candidateResults = $('#candidatesResults');
            // candidateResults.empty();
            
            var candidateSelect = $('#candidatesSelect');
            // candidateSelect.empty()

            var candidateTemplate =  `<tr><td>${candId}</td> <td>${candName}</td> <td>${candVote}</td></tr>`
            candidateResults.append(candidateTemplate);

            var candidateSelectTemplate = `<option value="${candId}">${candName}</option>`
            candidateSelect.append(candidateSelectTemplate);


        }
        app.setLoading(false);
    },

    castVote : async () => {
        var candidateID = $("#candidatesSelect").val();
        console.log(candidateID);
        $('button').hide();
        await app.election.addVote(candidateID);
        window.location.reload();
    },
    
    setLoading : (boolean) => {
        var loader = $('#loader');
        var content = $('#content');
        
        app.loading = boolean;
        
        if(boolean) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
        
    },

    listenForEvennts : () => {
        app.election.votedEvent({},{
            fromBlock: 0,
            toBlock: 'latest'
          }).watch(function(error, event) {
            console.log("event triggered", event)
            // Reload when a new vote is recorded
            App.render();
          });
    }


}


$(() => {
    $(window).load(() => {
        app.load()
    })
})