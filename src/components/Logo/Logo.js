import React from "react";
import Tilt from 'react-parallax-tilt';
import Brain from "./brain.png"
import './Logo.css'

const Logo=()=>{
    return(
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2 " style={{width:'100px'}}>
                <div style={{ height: '100', backgroundColor: 'darkgreen' }}>
                <div className="Tilt-inner pa2">
                    <img  alt="logo" src={Brain}/>
                </div>
            </div>
        </Tilt>
        </div>
    );
};

export default Logo;