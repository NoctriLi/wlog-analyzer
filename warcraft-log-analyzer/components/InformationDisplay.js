import React from 'react';


const InformationDisplay = ({ info }) => {
    console.log("HILOKOKOK", info)


    if(info)
    return (
        <div>
            <p>_</p>
            <p>_</p>
            <p>_</p>
            <p>_</p>
            {<p>{info.name}</p>}
            {<p>Server: {info.server}-{info.region}</p>}
            {<p>Guild: {info.guild}</p>}
            {<p>Guild Rank: {info.guildRank}</p>}
            {<p>Guild World Ranking: {info.guildRating}</p>}
            <p>_</p>
            <p>_</p>
            <p>_</p>
            {info.ranking.map(d =>  <p> {d[0]}: {d[1].rank || 'N/A'} - {d[1].spec}</p>)}
            <p>_</p>
            <p>_</p>
            <p>_</p>
            {<p><a href={info.wLogLink}>WarcraftLogs Link</a> </p>}
            <p>_</p>
            {<p><a href={info.raiderIoLink}>Raider.io Link</a> </p>}
            
            
            
        </div>
    )
    else return (
        <div>
            <p></p>
        </div>
    )
}

export default InformationDisplay;

/*
            {<p>Guild: {info.guild}</p>}
            {<p>Guild Rank: {info.guildRank}</p>}
            {<p>Guild World Ranking{info.guildRating}</p>}
            
            {<p><a href={info.wLogLink}>WarcraftLogs Link</a> </p>}
            {<p><a href={info.raiderIoLink}>Raider.io Link</a> </p>}
            {info.ranking.map(d => {
                return <p>{d.rank} - {d.spec}</p
            })}
            {<p>Server: {info.server}-{info.region}</p>}
            
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}
            {<p>{info.}</p>}*/