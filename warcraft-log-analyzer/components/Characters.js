import { ApolloClient, InMemoryCache, useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import client from "../apollo-client";
/*TODO: 
create dict of encounterID
create array of classes
create array of pages to loop through (~10 seems to be about 70th)
create seperate query for hps
possibly store each character in a nested object with name-server as template
add in each character using eranog as means of getting the characters then searching their page for their encounters
check their guild and rank
generate url for raider.io
*/
/*
const bossID = {2587: "Eranog", 2590: "The Primal Council", 2592: "Sennarth, The Cold Breath", 2605: "Kurog Grimtotem", 2607: "Raszageth, the Storm-Eater", 2614: "Broodkeeper Diurna", 2635: "Dathea, Ascended", 2639: "Terros"}
const classes = ["Death Knight", "Demon Hunter", "Druid", "Evoker", "Hunter", "Mage", "Monk", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"]
const roles = ["dps", "hps"]
*/
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

//const characters = []

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

function getRankPercentRounded(rankPercent) {
  return Math.round(rankPercent * 100) / 100;
}

function getMaxBossRank(bossData) {
  return bossData.ranks && bossData.ranks[0]
    ? Math.max(
        ...bossData.ranks.map((d) => getRankPercentRounded(d.rankPercent))
      )
    : "N/A";
}

function getBossSpec(bossData) {
  return bossData.ranks && bossData.ranks[0] ? bossData.ranks[0].spec : "N/A";
}

function getBossPageData(bossName, metric, bossData) {
  return (
    <p>
      {bossName} Best {metric} - {getRankPercentRounded(bossData.rank)} -{" "}
      {bossData.spec}
    </p>
  );
}

function getServerName(server)
{
  return server.replace(" ", "-");
}

async function getCharData(name, server, region, metric, charClass) {
  //await sleep(200)

  return await client
    .query({
      query: CQUERY,
      variables: {
        region: region,
        server: server,
        characterName: name,
        ID: 2587,
        ID2: 2590,
        ID3: 2592,
        ID4: 2605,
        ID5: 2607,
        ID6: 2614,
        ID7: 2635,
        ID8: 2639,
        metric: metric,
      },
    })
    .then((data) => {
      const cdata = data.data.characterData.character;

      console.log("getchar", name, data);
      if (cdata != null) {
        const char = {
          name: name,
          class: charClass,
          metric: metric,
          server: server,
          region: region,
          wLogLink:
            "http://www.warcraftlogs.com/character/" + region + "/" + getServerName(server) + "/" + name,
          raiderIoLink:
            "http://www.raider.io/characters/" + region + "/" + getServerName(server) + "/" + name,
          ranking: {
            eranog: {
              rank: getMaxBossRank(cdata.eranog),
              spec: getBossSpec(cdata.eranog),
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
            },
          },
        };

        try {
          char.guildrank = cdata.guildRank;
        } catch {
          char.guildrank = "N/A";
        }

        try {
          char.guildrating =
            cdata.guilds[0].zoneRanking.progress.worldRank.number;
        } catch {
          char.guildrating = "N/A";
        }

        try {
          char.guild = cdata.guilds[0].name;
        } catch {
          char.guild = "N/A";
        }

        return char;
      } else return;
    })
    .catch((err) => console.error(err));
}

/////////////////////////////////////////////////////////////////////////////////
export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      region: "US",
    },
  });

  useEffect(() => {
    async function fetchData() {
      if (data) {
        console.log("useeffect", data);
        //const chars = [];
        const charDataPromises =
          data.worldData.encounter.characterRankings.rankings
            .slice(0, 50)
            .map((d) => {
              return getCharData(
                d.name,
                d.server.name,
                d.server.region,
                "dps",
                "Paladin"
              );
            });
        const chars = await Promise.all(charDataPromises);
        setCharacters(
          chars.filter(function (element) {
            return element !== undefined;
          })
        );
      }
    }

    fetchData();
  }, [data]);

  /*
    const {data, loading, error } = useQuery(QUERY, {
        variables: {
            "region": "US"
        }
    });
*/
  if (loading) {
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
  if (error) {
    console.error(error);
    return null;
  }

  /*
      console.log(data)
      data.worldData.encounter.characterRankings.rankings.slice(0, 5).forEach(d => {
        console.log(d.name, d.server.name, d.server.region, "dps", "Paladin")
        getCharData(d.name, d.server.name, d.server.region, "dps", "Paladin").then()
        

      })


      console.log("hi")

*/

  console.log(characters);
  const results = (
    <div className={styles.grid}>
      {characters.map((character) => (
        <div
          key={character.name + "_" + character.server}
          className={styles.card}
        >
          <h3>
            <a
              href="#character-name"
              aria-hidden="true"
              className="aal_anchor"
              id="character-name"
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
            {character.name}
          </h3>
          <p>
            {character.name} - {character.server} - {character.region}
          </p>
          <p>
            Guild - {character.guild} --- World Rank {character.guildrating}
          </p>
          <p>Rank in guild - {character.guildrank}</p>
          <p style={{ color: "red" }}>
            <a href={character.wLogLink}>Warcraft Logs</a>
          </p>
          <p style={{ color: "red" }}>
            <a href={character.raiderIoLink}>Raider.io</a>
          </p>
          {getBossPageData( "Eranog", character.metric, character.ranking.eranog)}
          {getBossPageData("Primal Council", character.metric, character.ranking.council)}
          {getBossPageData("Terros", character.metric, character.ranking.terros)}
          {getBossPageData("Dathea", character.metric, character.ranking.dathea)}
          {getBossPageData("Sennarth", character.metric, character.ranking.sennarth)}
          {getBossPageData("Kurog", character.metric, character.ranking.kurog)}
          {getBossPageData("Broodkeeper Diurna", character.metric, character.ranking.diurna)}
          {getBossPageData("Raszageth", character.metric, character.ranking.raszageth)}
        </div>
      ))}
    </div>
  );

  return results;
}
//{Math.max(...data.characterData.character.encounterRankings.ranks.map(d => Math.round(d.rankPercent * 100) / 100))}
