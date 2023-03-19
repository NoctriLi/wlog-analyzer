import client from "../apollo-client";
import { gql } from "@apollo/client";


const { data, loading, error } = performRankingDataQuery();

///////////////////
//////QUERIES//////
const QUERY = gql`
  query CharacterData($region: String!) {
    worldData {
      encounter(id: 2587) {
        characterRankings(
          serverRegion: $region
          className: "Paladin"
          metric: dps
          page: 10
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
function performRankingDataQuery()
{
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      region: "US",
    },
  });
  return {data, loading, error};
}
////////////////
///SUB-QUERY////
// Retrieve data for the top N characters in the rankings data
async function fetchTopCharacters(data, numChars, metric, charClass)
{
  const topRankings = data.worldData.encounter.characterRankings.rankings.slice(0, numChars);
  const characterPromises = topRankings.map((r) => {return getCharDataPromise(r,
                                                                              metric, 
                                                                              charClass)});
      
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
  const charQueryVars = {
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
  };

  return await client.query({query: CQUERY, variables: charQueryVars})
                     .then((data) => {return getCharacterData(data, 
                                                              rankingData.name, 
                                                              rankingData.server.name, 
                                                              rankingData.server.region,
                                                              metric, 
                                                              charClass)})
                     .catch((err) => console.error(err));
}







// Populate the CharacterData objects for the top ranking characters
export default function populateCharacterData(queryData, numChars, metric, className, setCharactersFunc)
{
  useEffect(() => { 
    if(queryData)
    {
      setCharactersList(queryData, numChars, metric, className, setCharactersFunc)
    } 
  }, [queryData]);
}

