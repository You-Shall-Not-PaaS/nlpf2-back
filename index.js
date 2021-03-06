const express = require('express');
const cors = require('cors')
const app = express();

const Property = require('./service/properties');
const Estimation = require('./service/estimation')

app.use(cors());

// Parse requests of content-type: application/json
app.use(express.json({ limit: '50mb' }));

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//local debug
const PORT = 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//debug route
app.get('/', (req, res) => {
  res.send("hello NLPF");
});

app.get('/properties/estimation/:commune/:type/:surface/:rooms/:garden', Estimation.get_estimation);

app.get('/properties/:page/', Property.get_paginated_properties);

app.get('/properties-filter/:page/', Property.filter_properties)

app.get('/properties/town/average-price/:id', Property.get_average_price)

app.get('/properties-grade/:id', Property.get_grade);

app.get('/properties/similar/:id', Property.get_similar_properties);

module.exports = {
  app
};
