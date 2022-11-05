import React from "react"
import "./ImageLinkForm.css"


const ImageLinkForm=({onInputChange,onButtonSubmit})=>{
    return(
        <div>
            <p className="f3 white">This smart application will detect face on your image when you click button detect.Try it!</p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input className="f4 pa2 w-70" type='text' placeholder="Copy url of the img" onChange={onInputChange}/>
                    <button className='f4 grow link pa2 w-30 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
};

export default ImageLinkForm;