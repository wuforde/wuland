module.exports.getApiName = function (request)
{
    let pathParts = request.path.split('/');
    let apiName = pathParts[1];
    return apiName;
}