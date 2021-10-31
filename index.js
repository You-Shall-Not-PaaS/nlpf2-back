const express = require('express');

const PagedList = require('./propertyService');

const app = express();

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




module.exports = {
    app
};