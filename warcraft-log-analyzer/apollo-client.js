
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = new createHttpLink({
    uri: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.MY_SECRET_KEY
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