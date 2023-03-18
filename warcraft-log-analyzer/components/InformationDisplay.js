import React from 'react';


const InformationDisplay = ({ info }) => {
    return (
        <div>
            {info && <p>{info}</p>}
        </div>
    )
}

export default InformationDisplay;