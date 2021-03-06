/**
 * Created by zhubg on 2017/4/14.
 */

'use strict';

import express from 'express';
import cors from 'cors';
import bodyParser from'body-parser';
import {graphqlExpress} from 'graphql-server-express';
import {schema} from'./schema/schema';
const app = express();

import path from 'path';
app.use('/manager',express.static(path.join(__dirname, './manager')));
// app.use('/manager',express.static(path.join(__dirname, '../admin')));

const corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = true;
        callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
    },
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


//test
import fetch from 'node-fetch';

app.get('/tokentest', function (req, res, next) {
    fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(
            {
                "query": `query {
                              getToken(id:"1234") {
                                  code
                                  type
                                  content
                              }
                            }`
            }
        ),
        headers: {'Content-Type': 'application/json'}
    })
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        console.log(json);
        res.send(json);
    });
});

app.get('/test1', function (req, res, next) {
    let Test_Query = `query  getLotteryRecordListFunc($additionPoints: Int!,$user_fid: String!,$approvalUser_fid: String!) {
                             insertPointAddAndSubtractRecord(additionPoints:$additionPoints,user_fid:$user_fid,approvalUser_fid:$approvalUser_fid) {
                                  code
                                  type
                                  content
                                }
                             }`;
    fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(
            {
                "query": Test_Query,
                "variables": {
                    "additionPoints": -200,
                    "user_fid": '10',
                    "approvalUser_fid": '20'
                }
            }
        ),
        headers: {'Content-Type': 'application/json'}
    })
        .then(function (res) {
            return res.json();
        }).then(function (json) {
        res.send(json);
    });
});

app.use('/graphql', cors(corsOptions), bodyParser.json(), graphqlExpress({schema: schema}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});