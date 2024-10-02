const config = require('../config/config.json');
const wulib = require('../lib/lib.js');
const express = require('express');
const querystring = require('querystring');
const app = express();

app.use(express.json());

app.get('/login',(request,response) => {
console.log('login');
response.send('login');
});

app.get('/*',(request,response) => {
    let pathParts = request.path.split('/');
    let apiName = pathParts[1];
    let api = require('./apis/' + wulib.getApiName(request) + '.js');

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
    let api = require('./apis/' + wulib.getApiName(request) + '.js');
    api.Add(request.body,response)
})

app.put('/*', (request,response) =>{
    let api = require('./apis/' + wulib.getApiName(request) + '.js');
    api.Update(request.body,response)
});

app.delete("/*",(request,response) => {
    let api = require('./apis/' + wulib.getApiName(request) + '.js');
    let pathParts = request.path.split('/');

    api.Delete(pathParts[2],response)
})



app.listen(config.server.port,()=>console.log('server up and listening on' + config.server.port));