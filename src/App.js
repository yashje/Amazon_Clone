import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import ABIAmazon_Clone from './abis/Amazon_Clone.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [amazonClone, setAmazonClone] = useState(null)
  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)
  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
    console.log(toggle)
  }

  useEffect(() => {

    const loadBlockchainData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)

      const network = await provider.getNetwork()

      const amazonClone = new ethers.Contract(
        config[network.chainId].Amazon_Clone.address,
        ABIAmazon_Clone,
        provider
      )

      setAmazonClone(prev => amazonClone);

      const items = []

      for (let i = 0; i < 9; i++) {
        const item = await amazonClone.Item(i + 1)
        items.push(item)
      }

      const electronics = items.filter((Items) => Items.category === "electronics")
      const clothing = items.filter((Items) => Items.category === "clothing")
      const toys = items.filter((Items) => Items.category === "toys")

      setElectronics(electronics)
      setClothing(clothing)
      setToys(toys)

    }

    loadBlockchainData();
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>best Sellers</h2>
      {electronics && clothing && toys && (<>
        <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
        <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
        <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
      </>
      )}
      {toggle && (
        <Product item={item} provider={provider} account={account} amazonClone={amazonClone} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
