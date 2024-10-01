const config = require('../config/config.json');
const express = require('express');
const querystring = require('querystring');
const app = express();

app.use(express.json());

app.get('/login',(request,response) => {
console.log('login');
response.send('login');
});

app.get('/*',(request,response) => {
    var pathParts = request.path.split('/');
    var apiName = pathParts[1];
    let api = require('./apis/' + apiName+'.js');

    if(pathParts.length >= 2)
    {
        if(pathParts.length == 2)
        {
            console.log('get all');
            api.GetAll(response);
        }    
        else
        {
            console.log('get by id');
            api.Get(pathParts[2],response);
        }
    }
    else
    {
        response.status(500).send("api path incorrect");
    }
});

app.post("/*", (request,response) => {
    var pathParts = request.path.split('/');
    var apiName = pathParts[1];
    let api = require('./apis/' + apiName+'.js');

    api.Add(request.body,response)
})

app.put('/*', (request,response) =>{
response.send('put');
});

app.delete("/*",(request,response) => {
    response.send('delete');
})

app.listen(config.server.port,()=>console.log('server up and listening on' + config.server.port));