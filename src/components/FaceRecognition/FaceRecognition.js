import React from 'react';
import './FaceRecognition.css'


const FaceRecogintion=({imageUrl,box})=>{
    return(
        <div className='center'>
            <div className='absolute ma2'>
                <img id='inputImage' alt='' src={imageUrl} width='500px' height='auto'/>
                <div className='bounding_box' style={{top:box.topRow,left:box.leftCol,right:box.rightCol,bottom:box.bottomRow}}></div>
            </div>
        </div>
    );
}

export default FaceRecogintion;