
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
require('dotenv').config();


const httpLink = new createHttpLink({
    uri: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.WLOGS_KEY
    },
    fetchOptions: {
        method: "POST",
        mode: 'cors'
    },
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
    
})
export default client;