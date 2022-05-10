import React from "react";
import '../App.css'

const PropertyListings = ({showProperty, setShowProperty, setShowListings}) => {

    return (
        <>
      {!showProperty && (
          <>
          <div className="back-btn-container">
		   <button className="button back-btn" onClick={() => setShowListings(false)}>Back to Home</button>
           </div>
           <ul id="propertyListings">
					<li onClick={() => setShowProperty(true)}
					  /* key={index}*/
                      >Rosedale House</li>
					<hr/>
					<li onClick={() => setShowProperty(true)}
					  /* key={index}*/
					>Oakview</li>
					<hr/>
					<li onClick={() => setShowProperty(true)}
			        /*	key={index} */
					>Coxes Meadow</li>
				</ul>
                </>)}
                </>
    )
}

export default PropertyListings