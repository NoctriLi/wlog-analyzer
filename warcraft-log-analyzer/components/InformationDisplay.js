import React from 'react';
import createHttpLink from "@apollo/client"


//from a webpage get the text from within <div title="Blizzard Profile" and title="Discord Profile"
function getProfiles   (htmlDocument) {

    const regex = /"profile_banner":(.*?)"isClaimed":true/g;
    const result = regex.exec(htmlDocument)[1];

    console.log(result)



    const combinedRegex = /"discord_profile":"(.*?)"|"bnet_battletag":"(.*?)"/g;
    let match;
    let profiles = ['N/A', 'N/A'];
    while ((match = combinedRegex.exec(result)) !== null) {
      if (match[1]) {
        console.log('Discord profile:', match[1]);
        profiles[0] = match[1];
      } else if (match[3]) {
        console.log('Battle.net Battletag:', match[3]);
        profiles[1] = match[3];
      }
    }

    
    return profiles;
}


//scan a webpage from a link and return the data
async function getWebPageData(info) {
    



    return await fetch('http://localhost:3001/api/raiderio/' + info.region + '/' + info.server + '/' + info.name)
        .then(response => response.json())
        .then(text => {
            console.log("TEXT", text)
            return text;
        });
}


const InformationDisplay = ({ info }) => {
    console.log("HILOKOKOK", info)
    const [profiles, setProfiles] = React.useState([]);
    React.useEffect(() => {
        if (info) {
            console.log('Fetching URL:', info.raiderIoLink);
            getWebPageData(info)
                .then(htmlDocument => {
                    const profiles = getProfiles(htmlDocument);
                    setProfiles(profiles);
                });
        }
    }, [info]);
    console.log("PROFILES", profiles)



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
            <p>_</p>
            <p>_</p>
            <p>_</p>
            {<p>Discord: {profiles[0]}</p>}
            {<p>B-Net: {profiles[1]}</p>}
            
            
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