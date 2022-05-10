const Property = artifacts.require("Property")

module.exports = async function (deployer) {
    const NAME = 'Decentrahomes'
    const SYMBOL = 'DCH'
    const COST = web3.utils.toWei('5', 'ether') 

    await deployer.deploy(Property, NAME, SYMBOL, COST)
}