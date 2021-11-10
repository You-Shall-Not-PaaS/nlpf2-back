const express = require('express');

const {get_paginated_property, property_filter} = require('./propertyService');


const app = express();


//local debug
const PORT = 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//debug route
app.get('/', (req, res) => {
    res.send("hello World");
});

app.get('/list/:page/', async (req, res) => {
    const page = parseInt(req.params["page"]);
    const answer = await get_paginated_property(parseInt(page));
    res.send(answer);
});

app.get('/list/filter/:page/', async (req, res) => {
    const page = parseInt(req.params["page"]);
    const filter = req.query;
    const answer = await property_filter(page, filter);
    res.send(answer);
});


module.exports = {
    app
};