const express = require('express');
var cors = require('cors')

const {get_paginated_property, filter_properties} = require('./propertyService');


const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

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


module.exports = app