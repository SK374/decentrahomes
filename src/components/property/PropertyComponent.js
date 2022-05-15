import React, { useLayoutEffect } from "react";
import { init, animate } from "./piano";
import '../../App.css'

const PropertyComponent = ({setShowProperty}) => {

 useLayoutEffect(() => {
    init();
    animate();
  }, []);

  return (
    <>
    <button className="button back-btn" onClick={() => 
      setShowProperty(false)}>Back to properties</button>
      <div className="property-card">
        <ul>
          <li>3 Bedroom property</li>
          <li>Substantial Family Home Circa 3700 SqFt</li>
          <li>Stunning Family Kitchen / Dining Room</li>
          <li>Underfloor Heating</li>
          <li>Outbuilding</li>
          <li>Mature trees and shrubs</li>
          <li>Price: 5 ether</li>
          </ul>
  
  <p>A beautifully presented detached family home that has been the subject of much recent improvement 
	  and extension by the current vendors. The property affords a flexible and well planned layout 
	  arranged over two floors, offering a very high specification throughout which is complemented 
	  by a good size and established gardens. This superb home needs to be viewed to be appreciated. </p>    
  </div>
  <div id="container"></div>
  </>)
  }

export default PropertyComponent

