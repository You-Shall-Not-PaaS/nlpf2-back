const express = require('express');

const PagedList = require('./propertyService');
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

app.get('/list/:page/', (req, res) => {
    const page = req.params["page"];
    pagedlist = new PagedList(page);
    res.send(pagedlist.get_paginated_property());
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