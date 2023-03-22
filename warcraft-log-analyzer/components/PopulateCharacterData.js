import client from "../apollo-client";
import { ApolloClient, InMemoryCache, useQuery, useLazyQuery, gql } from "@apollo/client";
import { useTable } from 'react-table';
import { useEffect, useState, useMemo } from "react";
import styles from "../styles/Home.module.css";
import QueryBox from '../components/QueryBox'
import InformationDisplay from '../components/InformationDisplay'
import CharacterTable from '../components/CharacterTable'

///////////////////
//////QUERIES//////
const QUERY = gql`
  query CharacterData($region: String! $class: String! $metric: CharacterRankingMetricType!) {
    worldData {
      encounter(id: 2587) {
        characterRankings(
          serverRegion: $region
          className: $class
          metric: $metric
          page: 10
          partition: 1
        )
      }
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



///INITIAL QUERY///
// Execute the query to retrieve the rankings data

const grade = {"C-": 10, "C": 9, "C+": 8, "B-": 7, "B": 6, "B+": 5, "A-": 4, "A": 3, "A+": 2, "S": 1}

async function performRankingDataQuery(query) {
  const grade = {"C-": 10, "C": 9, "C+": 8, "B-": 7, "B": 6, "B+": 5, "A-": 4, "A": 3, "A+": 2, "S": 1};
  console.log("HIIIIIII", query)
  const result = await client.query({
    query: QUERY,
    variables: {
      region: query.region,
      metric: query.metric,
      class: query.class,
      page: grade[query.grade],
    },
    skip: !query.region || query.metric == '' || query.class == '' || !query.grade,
  });

  return result.data;
}
////////////////
///SUB-QUERY////
// Retrieve data for the top N characters in the rankings data
async function fetchTopCharacters(data, numChars, metric, charClass)
{
  const topRankings = data.worldData.encounter.characterRankings.rankings.slice(0, 10);
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
///

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

      this.wLogLink = "http://www.warcraftlogs.com/character/" + this.region + "/" + getServerName(this.server) + "/" + this.name;
      this.raiderIoLink = "http://www.raider.io/characters/" + this.region + "/" + getServerName(this.server) + "/" + this.name,

      this.ranking = {
        eranog: {
          rank: getMaxBossRank(cdata.eranog),
          spec: getBossSpec(cdata.eranog)
        },
        council: {
          rank: getMaxBossRank(cdata.primal_council),
          spec: getBossSpec(cdata.primal_council),
        },
        sennarth: {
          rank: getMaxBossRank(cdata.sennarth),
          spec: getBossSpec(cdata.sennarth),
        },
        kurog: {
          rank: getMaxBossRank(cdata.kurog),
          spec: getBossSpec(cdata.kurog),
        },
        raszageth: {
          rank: getMaxBossRank(cdata.raszageth),
          spec: getBossSpec(cdata.raszageth),
        },
        diurna: {
          rank: getMaxBossRank(cdata.diurna),
          spec: getBossSpec(cdata.diurna),
        },
        dathea: {
          rank: getMaxBossRank(cdata.dathea),
          spec: getBossSpec(cdata.dathea),
        },
        terros: {
          rank: getMaxBossRank(cdata.terros),
          spec: getBossSpec(cdata.terros),
        }
      }
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
/*
function getCharactersPageData({ data, onRowClick }) {
  data = data?data:[{name: "N/A"},{name: "N/A"}]
  const dataH = useMemo(() => data, [data]);
    const columns = useMemo(
      () => [
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Class",
          accessor: "className"
        },
        {
          Header: "Server",
          accessor: "server"
        },
        {
          Header: "Guild",
          accessor: "guild"
        },
        {
          Header: "Bosses Killed",
          accessor: "ranking"
        }
      ],
      []
    );
  
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });
  
  const results = (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        
          <tr {...headerGroups[0].getHeaderGroupProps()}>
            {headerGroups[0].headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )

  return results;
}
*/
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
// Get the HTML data to be displayed
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
const [query, setQuery] = useState({
  region: null,
  metric: null,
  class: null,
  grade: null,
});



const handleQuerySubmit = async (query) => {
  console.log(query)
  // Fetch Data Here
  
  performRankingDataQuery(query).then(d => setData(d))
}





const handleRowClick = (rowData) => {
  setInfo(rowData); //adjust this for information
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
    <div className={styles.maine}>

            <div className={styles.sideBar}>
              <QueryBox onQuerySubmit={handleQuerySubmit} query={query} setQuery={setQuery} />
              <InformationDisplay info={info}></InformationDisplay>
            </div>
            <div className={styles.tableScreen}>
              <CharacterTable data={characters} onRowClick={handleRowClick} />
            </div>
          </div>
  );
}