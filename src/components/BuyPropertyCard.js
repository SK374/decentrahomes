const BuyPropertyCard = ({showListings, propertyId, propertyName, propertyOwner, hasPropertyOwner, 
    propertyCost, buyPropertyHandler}) => {

return (
    <>
{showListings === 'properties' && (
    <div className="info buy-property-card">
        <h1 className="flex">{propertyName}</h1>

        <div className='flex-left'>
            <div className='info--id'>
                <h2>ID</h2>
                <p>{propertyId}</p>
            </div>

            <div className='info--owner'>
                <h2>Owner</h2>
                <p>{propertyOwner}</p>
            </div>

            {!hasPropertyOwner && (
                <div className='info--owner'>
                    <h2>Cost</h2>
                    <p>{`${propertyCost} ETH`}</p>
                </div>
            )}
        </div>

        {!hasPropertyOwner ? (
            <button onClick={() => buyPropertyHandler(propertyId)} className='button info--buy'>Buy Property</button>
        ) : (
        <div className="buy-card-sold"><p>Sold</p></div>
        )}	
        </div>
    )}
    </>
)
}

export default BuyPropertyCard