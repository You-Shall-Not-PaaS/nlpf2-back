
const express = require('express');

import {PagedList} from 'propertyService';

const app = express();


///debug route
app.get('/', (req, res) => {
    res.send("hello World")
});

app.get('/list/:page', (req, res, next) => {
    let pagedlist = PagedList(page);
    return pagedlist.get_paginated_property();
});



module.exports = {
    app
};