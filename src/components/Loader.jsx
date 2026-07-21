import React from 'react'
import image from '../assets/Logoicon.png'
import './Loader.css'

function Loader() {
    return (
        <div className="loader-wrapper">
            <img src={image} alt="loader" className="loader-logo" />
        </div>
    )
}

export default Loader