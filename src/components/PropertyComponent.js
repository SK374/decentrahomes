import React, { useLayoutEffect } from "react";
import { init, animate } from "./piano";
import '../App.css'

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
  <p>3 Bedroom property</p>
  <p>Substantial Family Home Circa 3700 SqFt</p>
  <p>Stunning Family Kitchen / Dining Room</p>
  <p>Underfloor Heating</p>
  <p>Outbuilding</p>
  <p>Mature trees and shrubs</p>
  <p>Price: 5 ether</p>
  <p>A beautifully presented detached family home that has been the subject of much recent improvement 
	  and extension by the current vendors. The property affords a flexible and well planned layout 
	  arranged over two floors, offering a very high specification throughout which is complemented 
	  by a good size and established gardens. This superb home needs to be viewed to be appreciated. </p>    
  </div>
  <div id="container"></div>
  </>)
  }

export default PropertyComponent

