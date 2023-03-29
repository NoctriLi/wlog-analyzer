
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = new createHttpLink({
    uri: "https://www.warcraftlogs.com/api/v2/client",
    headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5OGE4MjJjNy1jOTk1LTRiNTAtOWY0Yy1kMzJhY2ZkODJkNjMiLCJqdGkiOiI0NWZhNDIyYWVkMWY4ZTM4OTIzMTIzODdlMjg2N2E4NDZiNzYzNDM5MTk3YzA5NjA4NWMwYWI5YmRiYTEzNjlhYmJlMjg3ODNmN2EwYTIwOSIsImlhdCI6MTY4MDEyNjEyMC45NTg4MDgsIm5iZiI6MTY4MDEyNjEyMC45NTg4MTEsImV4cCI6MTcxMTIzMDEyMC45Mzg4MjMsInN1YiI6IjE3Nzk0MTYiLCJzY29wZXMiOlsidmlldy11c2VyLXByb2ZpbGUiLCJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.SNaFiIso7iF93MctfYbiPchduJ9b1IgFkGBsDkp3QkFmoJ1JkTeMX-l_UzILatMygxt778lpz3fnkD4vNf3GCSd6E6L9DlcKqk00RLFmm1bKN-AEP4i2-S1MBwXsS0lN3d_dNJbxjmASUJ_DNz-aksU2rj9-9HkGlEbPwQnEGw3tKRb_XrPWaql0trqjATIX74u2AChtRf61b4g9SKAMGm3kEA4HCkPRD93eVRRFUc-r4a0McfoQvyLmcMf5LbNnyZj3XZg_SY9SHD43UmztkBDgUO_pTDPJ0Vim31JhCAe2cWKOF1-LazDa82ZMfGacBNInVjtd0KTAEbcJhMsGdwXjWogOHoOmXvS3HjDBCu81kEO83XWq1JAvVT1VaCguG44RGrnJL9DPzsvXT35mvFFB0tKN6PzmafSQLU5YCrEy6z3yOm9wBQGlGJAUwpvjL8IeQxz7ciQrlkJ7XI4AdNWLTybMeN5M4N1zaKXTKt9pVWQOEa0LH4ZomdXnXa69Mxz5Pppt3mcVYDeOwBVQEfofemcjQG68oNg4GRUkjtXs_wdURs29aSxAhW820g0F4f6PnAgE8LDDPqpUUD1v4-6vO9quZflKxzQRpXr7hoaEKI8wBpGGHHS9-cbJTJ0SU5z0yaBeIH262sxAZFFROsWaAq3biBf6aFZS1z5sS1E'
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