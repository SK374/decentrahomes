const House = ({setShowProperty, propertyId, propertyInfo, setPropertyOwner, setHasPropertyOwner, setPropertyId }) => {
    const clickHandler = () => {
        setPropertyId(propertyId)

        if (propertyInfo.owner === '0x0000000000000000000000000000000000000000') {
            setPropertyOwner('No Owner')
            setHasPropertyOwner(false)
        } else {
            setPropertyOwner(propertyInfo.owner)
            setHasPropertyOwner(true)
        }
        setShowProperty(true)
    }

    return (
        <li onClick={() => clickHandler()}
          ><h3>{propertyInfo.name}</h3></li>
          
    );
}

export default House;