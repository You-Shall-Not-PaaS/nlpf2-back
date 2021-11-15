const express = require('express');
var cors = require('cors')

const { get_paginated_property, filter_properties, get_average_price } = require('./propertyService');


const app = express();

app.use(cors({
  origin: '*'
}));


//local debug
const PORT = 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//debug route
app.get('/', (req, res) => {
  res.send("hello NLPF");
});

app.get('/properties/:page/', get_paginated_property);

app.get('/properties-filter/:page/', filter_properties)

app.get('/properties/town/average-price/:id', get_average_price)


module.exports = {
  app
};
