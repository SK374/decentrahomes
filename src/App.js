import Web3 from 'web3';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';

import './App.css';

import Navbar from './components/Navbar';
import Plane from './components/Plane';
import Plot from './components/Plot';
import Building from './components/Building';
import Members from './components/Members.js';

// Import ABI
import Land from './abis/Land.json';
import { setMaxListeners } from 'process';

function App() {
	const [web3, setWeb3] = useState(null)
	const [account, setAccount] = useState(null)
	const [memberAccount, setMemberAccount] = useState(null)

	// Contract & Contract States
	const [landContract, setLandContract] = useState(null)

	const [cost, setCost] = useState(0)
	const [buildings, setBuildings] = useState(null)
	const [landId, setLandId] = useState(null)
	const [landName, setLandName] = useState(null)
	const [landOwner, setLandOwner] = useState(null)
	const [hasOwner, setHasOwner] = useState(false)
	const [members, setMembers] = useState(null)
	const [memberKey, setMemberKey] = useState(null)
	const [memberName, setMemberName] = useState(null)
	const [memberCost, setMemberCost] = useState(0)

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

			const cost = await land.methods.cost().call()
			setCost(web3.utils.fromWei(cost.toString(), 'ether'))

			const memberCost = await land.methods.memberCost().call()
			setMemberCost(web3.utils.fromWei(memberCost.toString(), 'ether'))

			const buildings = await land.methods.getBuildings().call()
			setBuildings(buildings)

			if (hasOwner === true) {
				setLandName(buildings.name)
				setMemberKey(members.pubkey)
				setMemberName(members.name)
				}

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	useEffect(() => {
		loadBlockchainData()
	}, [account, memberAccount])

	const buyHandler = async (_id) => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' })

			const buildings = await landContract.methods.getBuildings().call()
			setBuildings(buildings)

			setLandName(buildings[_id - 1].name)
			setLandOwner(buildings[_id - 1].owner)
			setHasOwner(true)
			setMembers(buildings.push(members))
			
		} catch (error) {
			window.alert('Error occurred when buying')
		}
	}

	const memberHandler = async (_id, pubkey, name) => {
		try {
			//await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' })
			await landContract.methods.memberMint(_id).send({ from: account, value: '1000000000000000000' })
			await landContract.methods.addMemberToBuilding(pubkey, name)

			const members = await landContract.methods.getMembers().call()

			setMembers(members)
			setMemberKey(members[pubkey].pubkey)
			setMemberName(members[name].name)

		} catch (error) {
			window.alert('Error occurred when adding member')
		}
	}

	return (
		<div>
			{console.log("OWNER = ", landOwner)}
			{console.log("BUILDING = ", landName)}
			{console.log("MEMBERS", members)}
			{console.log("MEMBERS LIST", members)}
			{console.log("MEMBERS KEY", memberKey)}
			{console.log("MEMBERS NAME", memberName)}
			<Navbar web3Handler={web3Handler} account={account} />
			<Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />

					<ambientLight intensity={0.5} />

					{/* Load in each cell */}
					<Physics>
						{buildings && buildings.map((building, index) => {
							if (building.owner === '0x0000000000000000000000000000000000000000') {
								return (
									<Plot
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
									/>
								)
							} else {
								return (
									<Building
										key={index}
										position={[building.posX, building.posY, 0.1]}
										size={[building.sizeX, building.sizeY, building.sizeZ]}
										landId={index + 1}
										landInfo={building}
										setLandName={setLandName}
										setLandOwner={setLandOwner}
										setHasOwner={setHasOwner}
										setLandId={setLandId}
										setMembers={setMembers}

									/>
								)
							}
						})}
					</Physics>

					<Plane />
				</Suspense>
				<MapControls />
			</Canvas>

			{landId && (
				<div className="info">
					<h1 className="flex">{landName}</h1>

					<div className='flex-left'>
						<div className='info--id'>
							<h2>ID</h2>
							<p>{landId}</p>
						</div>

						<div className='info--owner'>
							<h2>Owner</h2>
							<p>{landOwner}</p>
						</div>

						{!hasOwner && (
							<div className='info--owner'>
								<h2>Cost</h2>
								<p>{`${cost} ETH`}</p>
							</div>
						)}
					</div>

					{!hasOwner && (
						<>
						<button onClick={() => buyHandler(landId)} className='button info--buy'>Buy Property</button>
						</>
					)}
					{hasOwner && (
						<>
						<button onClick={() => memberHandler(landId)} className='button member--buy'>Become A Member</button>
						</>
					)}
				</div>
			)}
		</div>
	);
}

export default App;