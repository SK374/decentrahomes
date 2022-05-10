const BuyLandCard = ({showListings, landId, landName, landOwner, hasLandOwner, landCost, buyLandHandler}) => {

    return (
        <>
        {showListings === 'land' && landId && (
            <div className="info" id="buy-land-card">
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
        
                    {!hasLandOwner && (
                        <div className='info--owner'>
                            <h2>Cost</h2>
                            <p>{`${landCost} ETH`}</p>
                        </div>
                    )}
                </div>
        
                {!hasLandOwner ? (
                    <button onClick={() => buyLandHandler(landId)} className='button info--buy'>Buy Land</button>
                ) : (
                    <div className="buy-card-sold"><p>Sold</p></div>
                )}	
                </div>
        )}
  </>  
  )
}
        
export default BuyLandCard