
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = new createHttpLink({
    uri: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5OGE4MjJjNy1jOTk1LTRiNTAtOWY0Yy1kMzJhY2ZkODJkNjMiLCJqdGkiOiJkZjUxMWRmMDQ1NjU2ZDQ5NzZiYWMxNDc5ZTFlYjMwZGMzMTM0NDgzZjA4MDUxNzY5NzhlMmM3N2E3MDNhYWJiY2U1ODEwZmMyMTkzZDZjYyIsImlhdCI6MTY3ODQ3OTgwNi42NDU0NDcsIm5iZiI6MTY3ODQ3OTgwNi42NDU0NDgsImV4cCI6MTcwOTU4MzgwNi42MzA4MDEsInN1YiI6IjE3Nzk0MTYiLCJzY29wZXMiOlsidmlldy11c2VyLXByb2ZpbGUiLCJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.AJrF9XAHKO3zN2aZU1m0xyTgpB0XiloOdCVavlaLIs9cEJir7xFiBLT1EfNgmndTY_9fWchXZa0QFt65HLN92bOSqWC_q9G_ci8kOM08p99eiDvgMGCq6fthX4vXBF6SFoQo8EO0LtTNoly-A4n_rYLrVLBwwXS2YHV3ENJB0R7rG2Vnwyjjx7u4Zdh91kMGBhvyOiqw1asjveWlVPxhI7f0xjl0rh0avlEmmHfconn4Cs2J0fmrsOLFCu7qL3rWiuRYJipq1mR17b96AfNmOsWkuJ_BXq-RLEdwTNtkoJkJFj90VazYxASlJPjj85-4UXT_8jVOQz8XR1AWACtOfEC6ne33R-qZP8EfROcAIOsW6AUvO9hYmMXWEzqZFw7Z4nzBm8X3supqiG5SohHdWbFN_sfNmlueBakofYg6SXMGDan_T0VYhsTK2zLXgoYfbOkxYOU__xS_maiGpwaC81muMU3rcwKOrtJaGeKAAGF_PedPPf6S5O57ahaGeA1RFRLfLefGWMDDFV_Z7zlr0FYwtGWNAnBdD2uAgPWPrKHUeOPfMsdWTS3IlBOzhY3Q6kT9tH-q9kMNrJcpq7yDXMWfe-KQ8D9b9IE-osWQNrHkr5fnTf5j789kJa2RVuainpJSoxFrTfk63dVDAYD0j4xrlAKflpXY-2C4mK1x_Zk"
    },
    fetchOptions: {
        method: "POST",
        mode: 'cors'
    },
});

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
    
})
export default apolloClient;