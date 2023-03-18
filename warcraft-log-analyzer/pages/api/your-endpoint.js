import axios from 'axios';


export default async function handler(req, res) {
  const { query } = req.query;

  try {
    const response = await axios.get('URL', {
      params: {query},
    })

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json( {error: 'An Error has occured during the fetching process'})
  }
}