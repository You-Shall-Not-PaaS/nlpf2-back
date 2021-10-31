
const express = require('express');

import {PagedList} from 'propertyService';

const app = express();

const PORT = 5555;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

///debug route
app.get('/', (req, res) => {
    res.send("hello World");
});

app.get('/list/:page', (req, res) => {
    let pagedlist = PagedList(page);
    return pagedlist.get_paginated_property();
});




module.exports = {
    app
};