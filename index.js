const express = require('express');

const {get_paginated_property} = require('./propertyService');
const FilteredList = require('./propertyService');

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
    const page = req.params["page"];
    answer = await get_paginated_property(30, parseInt(page));
    res.send(answer);
});

app.get('/list/filtred/:page/', (req, res) => {
    const page = req.params["page"];
    const filter = req.query
    filteredlist = new FilteredList(page);
    res.send(filteredlist.filter());
});


module.exports = {
    app
};