const Land = artifacts.require("Land")

module.exports = async function (deployer) {
    const NAME = 'Metaverse Buildings'
    const SYMBOL = 'MVB'
    const COST = web3.utils.toWei('1', 'ether')
    const MEMBERCOST = web3.utils.toWei('1', 'ether')

    await deployer.deploy(Land, NAME, SYMBOL, COST, MEMBERCOST)
}