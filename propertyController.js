
const express = require('express');
const app = express();


///debug route
app.get('/', (req, res) => {
    res.send("hello World")
});

app.get('/list/:page', (req, res, next) => {
    
});



module.exports = {
    app
};