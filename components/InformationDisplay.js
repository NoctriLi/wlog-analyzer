import {useState, useEffect} from 'react';
import createHttpLink from "@apollo/client"


//from a webpage get the text from within <div title="Blizzard Profile" and title="Discord Profile"
function getProfiles  (htmlDocument) {



    const regex = /"profile_banner":(.*?)"isClaimed":/g;

    try {

    
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
    } catch (error) {
        console.log('Error fetching data from Raider.io', error);
        
    } 
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


const InformationDisplay = ({ info, detailPressed, setDetailPressed }) => {
    console.log("HILOKOKOK", info)
    const [profiles, setProfiles] = useState(['N/A', 'N/A']);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (info && detailPressed) {
            console.log('Fetching URL:', info.raiderIoLink);
            try{

                getWebPageData(info)
                .then(htmlDocument => {
                   
                    setProfiles(getProfiles(htmlDocument) || ['N/A', 'N/A']);
                });
            } catch (error) {
                console.log('Error fetching data from Raider.io', error);
                setErrorMessage('Error fetching data from Raider.io, try again')
                setTimeout(() => {
                    setErrorMessage('')
                }, 2000);
            } finally {          
                setDetailPressed(false);
                
            }
        }
    }, [info, detailPressed, setDetailPressed]);
    console.log("PROFILES", profiles)



    if(info)
    return (
        <div className=' text-center'>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <ul className='list-group list-group-flush border'>

                {<li className='list-group-item bg-dark text-bg-dark fs-3 pb-0'>{info.name}</li>}
                {<li className='list-group-item bg-dark text-bg-dark pt-0'>{info.server}-{info.region}</li>}
                {<li className='list-group-item bg-dark text-bg-dark m-0 p-0 fs-4'>{"<" + info.guild + ">"}</li>}
                {<li className='list-group-item bg-dark text-bg-dark p-0'>Guild Rank: {info.guildRank}</li>}
                {<li className='list-group-item bg-dark text-bg-dark pt-0 pb-2'>Guild World Ranking: {info.guildRating}</li>}
            </ul>    
                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Boss</th>
                            <th scope="col">Rank</th>
                            <th scope="col">Spec</th>                   
                        </tr>
                    </thead>
                    <tbody>

                    {info.ranking.map((d, index) =>  (

                        
                        <tr key={index}>
                            <td scope="row">{d[0]}</td>
                            <td> {d[1].rank || 'N/A'}</td>
                            <td>{d[1].spec}</td>
                        </tr>
                        ) )}
                    </tbody>
                </table>
            
                <li className='list-group-item text-danger pt-2'><a target="_blank" href={info.wLogLink}>WarcraftLogs Link</a> </li>
                <li className='list-group-item text-danger'><a target="_blank" href={info.raiderIoLink}>Raider.io Link</a> </li>

                <li className='list-group-item bg-dark text-bg-dark'>Discord: {profiles[0]}</li>
                <li className='list-group-item bg-dark text-bg-dark'>B-Net: {profiles[1]}</li>
            
            
            
        </div>
    )
    else return (
        <div>
            <li></li>
        </div>
    )
}

export default InformationDisplay;

/*
            {<li>Guild: {info.guild}</li>}
            {<li>Guild Rank: {info.guildRank}</li>}
            {<li>Guild World Ranking{info.guildRating}</li>}
            
            {<li><a href={info.wLogLink}>WarcraftLogs Link</a> </li>}
            {<li><a href={info.raiderIoLink}>Raider.io Link</a> </li>}
            {info.ranking.map(d => {
                return <li>{d.rank} - {d.spec}</li
            })}
            {<li>Server: {info.server}-{info.region}</li>}
            
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}
            {<li>{info.}</li>}*/