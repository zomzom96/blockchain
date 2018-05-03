const Wallet = require('../wallet');

const Transaction = require('../wallet/transaction');

class Miner {
	constructor(blockchain, transactionPool, wallet, p2pServer){
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	//Grabs transactions from the Transaction pool 
	//Then it creates the block and tells the p2pServer to sync the blockchain
	mine (){
		// include a reward for the miner
		const validTransactions = this.transactionPool.validTransactions();
		// create a block consisting of the valid transactions
		validTransactions.push(
			Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
		);
		
		const block = this.blockchain.addBlock(validTransactions);
		
		// synchronize chains in the p2p server
		this.p2pServer.syncChains();
		
		// clear the transactionPool
		this.transactionPool.clear();
		
		// broadcast to every miner to clear their tx pools
		this.p2pServer.broadcastClearTransactions();
		
		return block;
	}
}

module.exports = Miner;