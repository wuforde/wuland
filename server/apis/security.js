const config = require('../../config/config.json');
const securityConfig = require('../../../config/security_config.json');
const crypto = require('crypto');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

module.exports.login = function(request, response)
{
    
}

function getToken(userObj)
{
    return jwt.sign({user:userObj},securityConfig.securityToken, {expiresIn: securityConfig.expiresIn});
}

function hasAccess(request)
{
    let allow = false;
    let tokenHash = request.header('Authorization');
    let decodedToken = verifyToken(tokenHash);

    if(decodedToken.valid)
    {
        let dbConnection = mysql.createConnection({host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, connectTimeout:100});
        try
        {
            dbConnection.connect();
            let result = dbConnection.query(config.security.hasAccess);
            allow = result.allow;
        }
        catch(ex)
        {
            console.error(ex);
        }
        
    }

    return allow;
}


function verifyToken(tokenHash)
{
    let retObj = {valid:false, decodedToken:{}};
    let ticks = Math.floor(Date.now() / 1000);

    try
    {
        if(tokenHash == null)
            return retObj;

        let decodedToken = jwt.verify(tokenHash, securityConfig.securityToken);
    
        if(ticks > decodedToken.exp)
        {
            retObj.valid = true;
            retObj.decodedToken = decodedToken;
            return retObj;
        }
    }
    catch(exp)
    {
        console.error(exp);
    }

    return retObj;//should never get here but just in case...
}

module.exports = hasAccess;