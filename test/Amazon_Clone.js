const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Amazon_Clone", () => {
  let amazon_clone;
  let deployer, buyer

  beforeEach(async () => {
    // setup accounts
    [deployer, buyer] = await ethers.getSigners()

    //deploy contract
    //creating instance of the smart contract
    const Amazon_Clone = await ethers.getContractFactory("Amazon_Clone");
    //deploy smart contract
    amazon_clone = await Amazon_Clone.deploy()
  })

  describe("Deployment", () => {
    it("sets the owner", async () => {
      expect(await amazon_clone.owner()).to.equal(deployer.address)
    })
  })

  describe("product Listing", () => {

    let transaction;

    beforeEach(async () => {
      transaction = await amazon_clone.connect(deployer).productList(
        1, "Shoes",
        "Clothing",
        "IMAGE",
        1, 4, 5
      )

      await transaction.wait()

    })

    it("returns the products", async () => {
      const item = await amazon_clone.Item(1);
      expect(item.id).to.equal(1)
    })

  })

})