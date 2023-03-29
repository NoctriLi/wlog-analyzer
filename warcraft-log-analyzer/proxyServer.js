const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/raiderio/:region/:realm/:character', async (req, res) => {
  const { region, realm, character } = req.params;
  try {
    const response = await axios.get(
      `https://raider.io/characters/${region}/${realm}/${character}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from Raider.io' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});