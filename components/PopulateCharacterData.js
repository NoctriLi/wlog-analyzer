import client from "../apollo-client";
import { ApolloClient, InMemoryCache, useQuery, useLazyQuery, gql } from "@apollo/client";
import { useTable } from 'react-table';
import { useEffect, useState, useMemo } from "react";
import styles from "../styles/Home.module.css";
import QueryBox from '../components/QueryBox'
import InformationDisplay from '../components/InformationDisplay'
import CharacterTable from '../components/CharacterTable'

const Bottleneck = require("bottleneck");

const limiter = new Bottleneck({
  maxConcurrent: 10,
  minTime: 5000,
});


///////////////////
//////QUERIES//////
const QUERY = gql`
  query CharacterData($region: String! $class: String! $metric: CharacterRankingMetricType! $page: Int!) {
    worldData {
      encounter(id: 2639) {
        characterRankings(
          serverRegion: $region
          className: $class
          metric: $metric
          page: $page
          partition: 1
        )
      }
    }
    rateLimitData {
      limitPerHour
      pointsResetIn
      pointsSpentThisHour
    }
  }
`;

const CQUERY = gql`
  query CharacterData(
    $region: String!
    $server: String!
    $characterName: String!
    $ID: Int!
    $ID2: Int!
    $ID3: Int!
    $ID4: Int!
    $ID5: Int!
    $ID6: Int!
    $ID7: Int!
    $ID8: Int!
    $metric: CharacterRankingMetricType
  ) {
    characterData {
      character(
        name: $characterName
        serverSlug: $server
        serverRegion: $region
      ) {
        guilds {
          name
          zoneRanking {
            progress {
              worldRank {
                number
              }
            }
          }
        }
        guildRank
        eranog: encounterRankings(encounterID: $ID metric: $metric difficulty: 5)
        primal_council: encounterRankings(encounterID: $ID2 metric: $metric difficulty: 5)
        sennarth: encounterRankings(encounterID: $ID3 metric: $metric difficulty: 5)
        kurog: encounterRankings(encounterID: $ID4 metric: $metric difficulty: 5)
        raszageth: encounterRankings(encounterID: $ID5 metric: $metric difficulty: 5)
        diurna: encounterRankings(encounterID: $ID6 metric: $metric difficulty: 5)
        dathea: encounterRankings(encounterID: $ID7 metric: $metric difficulty: 5)
        terros: encounterRankings(encounterID: $ID8 metric: $metric difficulty: 5)
      }
    }
  }
`;
/////END QUERIES////
////////////////////


/////////////////////
///INITIAL REQUEST///
// Execute the query to retrieve the rankings data

const grade = {"C-": 10, "C": 9, "C+": 8, "B-": 7, "B": 6, "B+": 5, "A-": 4, "A": 3, "A+": 2, "S": 1}

async function performRankingDataQuery(query) {
  const grade = {"C-": 10, "C": 9, "C+": 8, "B-": 7, "B": 6, "B+": 5, "A-": 4, "A": 3, "A+": 2, "S": 1};
  console.log("HIIIIIII", query, grade[query.grade])
  let page = grade[query.grade]


  const result = await limiter.schedule(async () => {

    const response = await client.query({
      query: QUERY,
      variables: {
        region: query.region,
        metric: query.metric,
        class: query.class,
        page: grade[query.grade],
      },
      skip: query.region == '' || query.metric == '' || query.class == '' || query.grade == '',
    });
    return response.data
  })
  return result;
}
////////////////
///SUB-REQUEST////
// Get the character data promise for the given ranking data
async function getCharDataPromise(rankingData, metric, charClass) 
{
  // The set of variables to be queried for on a character

  return await client.query({query: CQUERY, variables: {
    region: rankingData.server.region,
    server: rankingData.server.name,
    characterName: rankingData.name,
    ID: 2587,
    ID2: 2590,
    ID3: 2592,
    ID4: 2605,
    ID5: 2607,
    ID6: 2614,
    ID7: 2635,
    ID8: 2639,
    metric: metric,
  }})
                     .then((data) => {return getCharacterData(data, 
                                                              rankingData.name, 
                                                              rankingData.server.name, 
                                                              rankingData.server.region,
                                                              metric, 
                                                              charClass)})
                     .catch((err) => console.error(err));
}



// Retrieve data for the top N characters in the rankings data
async function fetchTopCharacters(data, numChars, metric, charClass)
{
  const topRankings = data.worldData.encounter.characterRankings.rankings;
  const characterPromises = topRankings.map((r) => {
    return getCharDataPromise(r,
      metric, 
      charClass
      )
    });
      
  return await Promise.all(characterPromises);
}
///
async function setCharactersList(data, numChars, metric, className, setCharactersFunc)
{
  const topChars = await fetchTopCharacters(data, numChars, metric, className);
  setCharactersFunc(topChars.filter( e => { return e !== undefined; } ));
}
///END-REQUEST///
/////////////////



////////////////////
/////CONTRUCTOR/////
// Class that contains the various data relevant for a character
class CharacterData 
{
    constructor(cdata, name, server, region, metric, className) 
    {
      this.name = name;
      this.className = className;
      this.metric = metric;
      
      this.guild = "N/A";
      this.guildRating = "N/A";
      if(cdata.guilds && cdata.guilds[0])
      {
        this.guild = cdata.guilds[0].name;
        this.guildRating = cdata.guilds[0].zoneRanking.progress.worldRank.number;
      }

      this.guildRank = cdata.guildRank ?? "N/A";
      this.server = server ?? "N/A";
      this.region = region ?? "N/A";

      this.wLogLink = "https://www.warcraftlogs.com/character/" + this.region + "/" + getServerName(this.server) + "/" + this.name;
      this.raiderIoLink = "https://raider.io/characters/" + this.region + "/" + getServerName(this.server) + "/" + this.name,

      this.ranking = [
        ['Eranog', {
          rank: getMaxBossRank(cdata.eranog),
          spec: getBossSpec(cdata.eranog)
        }],
        ['Council', {
          rank: getMaxBossRank(cdata.primal_council),
          spec: getBossSpec(cdata.primal_council),
        }],
        ['Sennarth', {
          rank: getMaxBossRank(cdata.sennarth),
          spec: getBossSpec(cdata.sennarth),
        }],
        ['Kurog', {
          rank: getMaxBossRank(cdata.kurog),
          spec: getBossSpec(cdata.kurog),
        }],
        ['Raszageth', {
          rank: getMaxBossRank(cdata.raszageth),
          spec: getBossSpec(cdata.raszageth),
        }],
        ['Diurna', {
          rank: getMaxBossRank(cdata.diurna),
          spec: getBossSpec(cdata.diurna),
        }],
        ['Dathea', {
          rank: getMaxBossRank(cdata.dathea),
          spec: getBossSpec(cdata.dathea),
        }],
        ['Terros', {
          rank: getMaxBossRank(cdata.terros),
          spec: getBossSpec(cdata.terros),
        }]
      ]
      
    }
}


function getRankPercentRounded(rankPercent) 
{
  return Math.round(rankPercent * 100) / 100;
}

function rankDataValid(bossData)
{
  return bossData.ranks && bossData.ranks[0];
}

function getMaxBossRank(bossData) 
{
  return rankDataValid(bossData) ? 
         Math.max(...bossData.ranks.map((d) => getRankPercentRounded(d.rankPercent))) : "";
}

function getBossSpec(bossData) 
{
  return rankDataValid(bossData) ? bossData.ranks[0].spec : "";
}

function getBossPageData(bossName, metric, bossData) 
{
  return (
    <p>
      {bossName} {metric} - {getRankPercentRounded(bossData.rank)} - {" "} {bossData.spec}
    </p>
  );
}

function getServerName(server)
{
  return server.replace(" ", "-");
}

// Construct and return a CharacterData object if the query data is valid
function getCharacterData(data, name, server, region, metric, charClass)
{
    const cdata = data.data.characterData.character;
    if(cdata != null)
    {
      return new CharacterData(cdata, 
                               name, 
                               server, 
                               region,
                               metric, 
                               charClass);
    }

    return;
}
////END CONSTRUCTOR HELPERS///
//////////////////////////////





function getLoadingPageData()
{
  return (
    <h2>
      <a
        href="#loading"
        aria-hidden="true"
        className="aal_anchor"
        id="loading"
      >
        <svg
          aria-hidden="true"
          className="aal_svg"
          height="16"
          version="1.1"
          viewBox="0 0 16 16"
          width="16"
        >
          <path
            fillRule="evenodd"
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
          ></path>
        </svg>
      </a>
      Loading...
    </h2>
  );
}

function getPageData(loading, error, characters, onRowClick)
{
  if (error) 
  {
    console.error(error);
    return null;
  }

  if (loading) 
  {
    return getLoadingPageData();
  }
  
  return getCharactersPageData(characters, onRowClick);
}





// Populate the CharacterData objects for the top ranking characters
function populateCharacterData(queryData, numChars, metric, className, setCharactersFunc)
{

    if(queryData)
    {
      setCharactersList(queryData, numChars, metric, className, setCharactersFunc)
    } 

}




export default function Characters() {


const [info, setInfo] = useState(null);
const [characters, setCharacters] = useState([]);
const [data, setData] = useState(null)
const [detailPressed, setDetailPressed] = useState(false)
const [query, setQuery] = useState({
  region: '',
  metric: '',
  class: '',
  grade: '',
});

////////////////////////////////////////////
///Gets form data then sets state of data///
const handleQuerySubmit = async (query) => {
  console.log(query);
  if (query.region && query.metric && query.class && query.grade) {
    performRankingDataQuery(query).then((d) => setData(d));
  } else {
    console.log("Incomplete query data");
  }
}


const handleRowClick = (rowData) => {
  setInfo(rowData); //adjust this for information
  setDetailPressed(true);
}


  // Establish storage and setter function for the 
  // characters data to be rendered to the HTML page
  

  // Query the rankings data to retrieve the list of top players
  
  // Populate the character data for the top N players for a given metric and class
  useEffect(() => {
    if(data){

      populateCharacterData(data, 20, query.metric, query.class, setCharacters);
    }
  }, [data])



  console.log(data)

  // Generate the HTML page data to be displayed
  return (
    <div>
      <div className="d-flex flex-nowrap">
      
        <div className={`${styles.ml} navbar navbar-expand-md navbar-dark bg-dark d-flex fixed-top border-bottom`}>
          <QueryBox onQuerySubmit={handleQuerySubmit} query={query} setQuery={setQuery} />
          <p>{data && (data.rateLimitData.pointsSpentThisHour + " / " + data.rateLimitData.limitPerHour) + " points used..."}</p>
          <p>{data && (Math.round(data.rateLimitData.pointsResetIn / 60)) + " min until reset"}</p>
        </div>
              
        <div id={styles.sidebar} className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark fixed-top border-end">             
          <InformationDisplay detailPressed={detailPressed} setDetailPressed={setDetailPressed} info={info}></InformationDisplay>
        </div>
              
        <div className={styles.tableScreen}>
          <CharacterTable  data={characters} onRowClick={handleRowClick} detailPressed={detailPressed} setDetailPressed={setDetailPressed} />
        </div>
      </div>
    </div>
  );
}