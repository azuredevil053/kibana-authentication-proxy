/**
 * Hosts the latest kibana3 and elasticsearch behind Google OAuth2 Authentication
 * with nodejs and express.
 * License: MIT
 * Copyright: Funplus Game Inc.
 * Author: Fang Li.
 * Project: https://github.com/fangli/kibana-authentication-proxy
 */

var express = require('express');
var config = require('./config');
var app = express();

require('./lib/google-oauth').configureOAuth(express, app, config);
require('./lib/basic-auth').configureBasic(express, app, config);
require('./lib/es-proxy').configureESProxy(app, config.es_host, config.es_port,
          config.es_username, config.es_password);


// Serve config.js for kibana3
// We should use special config.js for the frontend and point the ES to __es/
app.get('/config.js', kibana3configjs);

// Serve all kibana3 frontend files
app.use('/', express.static(__dirname + '/kibana/src'));

app.listen(config.listen_port, function() {
  console.log('Server listening on ' + config.listen_port);
});


function kibana3configjs(request, response) {
  response.setHeader('Content-Type', 'application/javascript');
  response.end("define(['settings'], " +
    "function (Settings) {'use strict'; return new Settings({elasticsearch: 'http://'+window.location.host+'/__es', default_route     : '/dashboard/file/default.json'," +
      "kibana_index: 'kibana-int', panel_names: ['histogram', 'map', 'pie', 'table', 'filtering', 'timepicker', 'text', 'hits', 'column', 'trends', 'bettermap', 'query', 'terms', 'sparklines'] }); });");
}
