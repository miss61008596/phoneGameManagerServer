/**
 * Created by zhubg on 2017/4/14.
 */

'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _graphqlServerExpress = require('graphql-server-express');

var _schema = require('./schema/schema');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use('/', _express2.default.static(_path2.default.join(__dirname, './manager')));
// app.use('/manager',express.static(path.join(__dirname, '../admin')));

var corsOptions = {
    origin: function origin(_origin, callback) {
        var originIsWhitelisted = true;
        callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
    },
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//test


app.get('/tokentest', function (req, res, next) {
    (0, _nodeFetch2.default)('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify({
            "query": 'query {\n                              getToken(id:"1234") {\n                                  code\n                                  type\n                                  content\n                              }\n                            }'
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        console.log(json);
        res.send(json);
    });
});

app.get('/test1', function (req, res, next) {
    var Test_Query = 'query  getLotteryRecordListFunc($additionPoints: Int!,$user_fid: String!,$approvalUser_fid: String!) {\n                             insertPointAddAndSubtractRecord(additionPoints:$additionPoints,user_fid:$user_fid,approvalUser_fid:$approvalUser_fid) {\n                                  code\n                                  type\n                                  content\n                                }\n                             }';
    (0, _nodeFetch2.default)('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify({
            "query": Test_Query,
            "variables": {
                "additionPoints": -200,
                "user_fid": '10',
                "approvalUser_fid": '20'
            }
        }),
        headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
        return res.json();
    }).then(function (json) {
        res.send(json);
    });
});

app.use('/graphql', (0, _cors2.default)(corsOptions), _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({ schema: _schema.schema }));

app.listen(4000, function () {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});