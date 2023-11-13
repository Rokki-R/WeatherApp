const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;

app.use(express.json());
app.use(cors());

app.get('/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const nodeFetch = await import('node-fetch');
    const response = await nodeFetch.default(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from the API');
  }
});

app.get('/places', async (req, res) => {
  try {
    const nodeFetch = await import('node-fetch');
    const response = await nodeFetch.default('https://api.meteo.lt/v1/places');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching places data from the API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
