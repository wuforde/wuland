const { response } = require('express');
const dbConfig = require('../../../config/db_config.json');
const config = require('../../config/config.json')
const mysql = require('mysql2');

module.exports.Get = function(id,response) {
    let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, connectTimeout:100});
    dbConnection.config.namedPlaceholders = true;
    dbConnection.connect(function(err) {
        if (err)
        {
            response.status(500).send("db connection error \n");
            console.error(err.message);
            dbConnection.end();
            throw err;
        }
        else {
            dbConnection.query(config.user.get, {id:id},function (err,result) {
                if(err)
                {
                    response.status(500).send("query failed \n");
                    console.error(err.message);
                    throw err;
                }
                else
                {
                    if(result.length == 1) 
                    {
                        response.status(200).send(result);
                    }
                    else
                    {
                        if(result.length > 1)
                            response.status(500).send("more than 1 result found");
                        else
                            response.status(404).send('user not found with id = ' + id);
                        
                    }
                    dbConnection.end();
                }
            });
        }
    });
}

module.exports.GetAll = function(response){
    let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, connectTimeout:100});
    dbConnection.connect(function(err) {
        if (err)
        {
            response.status(500).send("db connection error \n");
            console.error(err.message);
            throw err;
        }
        else {
            dbConnection.query(config.user.getAll, function (err,result) {
                if(err)
                {
                    response.status(500).send("query failed \n");
                    console.error(err.message);
                    throw err;
                }
                else
                {
                    response.status(200).send(result);
                }

                dbConnection.end();
            });
        }
    });
}

module.exports.Add = function(userObj, response){
    let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password});
    dbConnection.config.namedPlaceholders = true;
    dbConnection.connect(function(err) {
        if (err)
        {
            response.status(500).send("db connection error \n");
            console.error(err.message);
            dbConnection.end();
            throw err;
        }
        else {
            console.log(userObj);
            dbConnection.query(config.user.insert, {name : userObj.name},function (err,result) {
                if(err)
                {
                    response.status(500).send("insert failed\n");
                    console.error(err.message);
                    throw err;
                }
                else
                {
                    dbConnection.query(config.user.insert_after,function (err,result){
                        if(err)
                        {
                            response.status(500).send("error get object after user insert");
                            console.error("error getting object after insert");
                        }
                        else
                        {
                            response.status(200).send(result);
                        }
                    });
                }
                dbConnection.end();
            });
        }
    });
}

module.exports.Update = function(userObj, response){
    let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password});
    dbConnection.config.namedPlaceholders = true;
    dbConnection.connect(function(err) {
        if (err)
        {
            response.status(500).send("db connection error \n");
            console.error(err.message);
            dbConnection.end();
            throw err;
        }
        else {
            console.log(userObj);
            dbConnection.query(config.user.update, {name : userObj.name, id : userObj.id },function (err,result) {
                if(err)
                {
                    response.status(500).send("update failed\n");s
                    console.error(err.message);
                    throw err;
                }
                else
                {
                    console.log({userid:userObj.id});
                    dbConnection.query(config.user.get, {id:userObj.id},function (err,result) {
                        if(err)
                        {
                            response.status(500).send("query failed \n");
                            console.error(err.message);
                            throw err;
                        }
                        else
                        {
                            response.status(200).send(result);
  
                        }
                    });
                }
                dbConnection.end();
            });
        }
    });
}

module.exports.Delete = function(userId, response) {
    let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password});
    dbConnection.config.namedPlaceholders = true;
    dbConnection.connect(function(err) {
        if (err)
        {
            response.status(500).send("db connection error \n");
            console.error(err.message);
            dbConnection.end();
            throw err;
        }
        else {
            console.log(userId);
            dbConnection.query(config.user.delete, {id: userId},function (err,result) {
                if(err)
                {
                    console.error(err.message);
                    response.status(500).send("delete failed\n");
                    
                    throw err;
                }
                else
                {
                    response.status(200).send({id: userId});
                }
                dbConnection.end();
            });
        }
    });
}