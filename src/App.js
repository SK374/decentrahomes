import Web3 from 'web3';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Link } from 'react-router-dom'

import './App.css';

import Navbar from './components/core/Navbar';
import Plane from './components/land/Plane';
import Plot from './components/land/Plot';
import Building from './components/land/Building';
import PropertyComponent from './components/property/PropertyComponent';
import BuyPropertyCard from './components/property/BuyPropertyCard';
import BuyLandCard from './components/land/BuyLandCard';
import House from './components/property/House';

import Land from './abis/Land.json';
import Property from './abis/Property.json';

const App = () => {
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)

	const [landContract, setLandContract] = useState(null)
	const [propertyContract, setPropertyContract] = useState(null)

	const [landCost, setLandCost] = useState(0)
	const [propertyCost, setPropertyCost] = useState(0)
	const [landParcels, setLandParcels] = useState(null)
	const [houses, setHouses] = useState(null)
	const [landId, setLandId] = useState(null)
	const [landName, setLandName] = useState(null)
	const [landOwner, setLandOwner] = useState(null)
	const [hasLandOwner, setHasLandOwner] = useState(false)
	const [hasPropertyOwner, setHasPropertyOwner] = useState(false)
	const [showListings, setShowListings] = useState(null)
	const [showProperty, setShowProperty] = useState(false)
	const [propertyId, setPropertyId] = useState(null)
	const [propertyName, setPropertyName] = useState(null)
	const [propertyOwner, setPropertyOwner] = useState(null)

	const loadBlockchainData = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			}

			const networkId = await web3.eth.net.getId()

			const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address)
			setLandContract(land)

			const property = new web3.eth.Contract(Property.abi, Property.networks[networkId].address)
			setPropertyContract(property)

			const landCost = await land.methods.cost().call()
			setLandCost(web3.utils.fromWei(landCost.toString(), 'ether'))

			const propertyCost = await property.methods.cost().call()
			setPropertyCost(web3.utils.fromWei(propertyCost.toString(), 'ether'))

			const landParcels = await land.methods.getBuildings().call()
			setLandParcels(landParcels)

			const houses = await property.methods.getBuildings().call()
			setHouses(houses)

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}

	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	useEffect(() => {
		loadBlockchainData()
	}, [account])

	const buyLandHandler = async _id => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' })

			const landParcels = await landContract.methods.getBuildings().call()
			setLandParcels(landParcels)

			setLandName(landParcels[_id - 1].name)
			setLandOwner(landParcels[_id - 1].owner)
			setHasLandOwner(true)
		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}
	
	const buyPropertyHandler = async _id => {
		try {
			await propertyContract.methods.mint(_id).send({ from: account, value: '5000000000000000000' })

			const houses = await propertyContract.methods.getBuildings().call()
			setHouses(houses)

			setPropertyName(houses[_id - 1].name)
			setPropertyOwner(houses[_id - 1].owner)
			setHasPropertyOwner(true)
		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}

	return (
		<>
			<Navbar web3Handler={web3Handler} account={account} />
	{/* Created anonymous function to use if-else statement inside return statement. */}
			{(() => {
				{/* If land map btn clicked, show land map */}
        if (showListings === 'land') {
          return (
			  <>
			 <button className="button back-btn" onClick={() => setShowListings(null)}>Back To Home</button>
            <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />
					<ambientLight intensity={0.5} />
					<Physics>
						  {/* if there's a landParcels array, map through each plot of land in array */}
						{landParcels && landParcels.map((landParcel, index) => {
							{/* if land parcel doesn't have an owner, return green plot */}
							if (landParcel.owner === '0x0000000000000000000000000000000000000000') {
								return (
									<Plot
										key={index}
										position={[landParcel.posX, landParcel.posY, 0.1]}
										size={[landParcel.sizeX, landParcel.sizeY]}
										landId={index + 1}
										landInfo={landParcel}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasLandOwner={setHasLandOwner}
										setLandId={setLandId}
									/>
								)
								{/* else if land parcel has an owner, return black sold plot */}
							} else {
								return (
									<Building
										key={index}
										position={[landParcel.posX, landParcel.posY, 0.1]}
										size={[landParcel.sizeX, landParcel.sizeY, landParcel.sizeZ]}
										landId={index + 1}
										landInfo={landParcel}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasLandOwner={setHasLandOwner}
										setLandId={setLandId}
									/>
								)
							}
						})}
					</Physics>
					<Plane />
				</Suspense>
				<MapControls />
			</Canvas>

			<BuyLandCard showListings={showListings}
					landId={landId}
					landOwner={landOwner}
					landName={landName}
					hasLandOwner={hasLandOwner}
					landCost={landCost}
					buyLandHandler={buyLandHandler}
					/>
			</>
          )
		  {/* Else if property listings btn clicked, show list of properties */}
        } else if (showListings === 'properties') {
			return (
				<>
				{!showProperty &&
				<>
				<div className="back-btn-container">
				 <button className="button back-btn" onClick={() => setShowListings(false)}>Back to Home</button>
				 </div>
				 <ul id="propertyListings">
					 <h1>Property Listings</h1>
					 {/* if there's a houses array, map through each house in array */}
					 {console.log(houses.name)}
					  {houses && houses.map((house, index) => {
						  if (house.owner === '0x0000000000000000000000000000000000000000') {
							  return (
								  <House 
								   key={index}
								   propertyId={index + 1}
								   setShowProperty={setShowProperty}
								   propertyInfo={house}
								   propertyName={propertyName}
								   setPropertyName={setPropertyName}
								   setPropertyOwner={setPropertyOwner}
								   setHasPropertyOwner={setHasPropertyOwner}
								   setPropertyId={setPropertyId} />
							  )
						  }
					  })}
					  </ul>
					  </>
				}
			    {showProperty && (
					<> 
				<PropertyComponent setShowProperty={setShowProperty} />
				
				<BuyPropertyCard showListings={showListings}
				propertyId={propertyId}
				propertyOwner={propertyOwner}
				propertyName={propertyName}
				hasPropertyOwner={hasPropertyOwner}
				propertyCost={propertyCost}
				buyPropertyHandler={buyPropertyHandler}
				/>
				</>
			)}		
				</>
          )
        } else {
          return (
			  <>
			<h1 id="app-title">Decentrahomes</h1>
			<div id="land-property-buttons-container">
			<button id="landmap-btn" onClick={() => setShowListings('land')}>View Land Map</button>
			<button id="properties-btn" onClick={() => setShowListings('properties')}>View Property Listings</button>
		</div>
		</>
          )
        }
      })()}
		</>
	);
}

export default App;