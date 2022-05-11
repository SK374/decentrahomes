const House = ({setShowProperty, propertyId, propertyInfo, propertyName, setPropertyName, setPropertyOwner, 
    setHasPropertyOwner, setPropertyId }) => {
    setPropertyName(propertyInfo.name)
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
          >{propertyName}</li>
    );
}

export default House;