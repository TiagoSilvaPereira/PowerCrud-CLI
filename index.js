'use strict';

var fs = require('fs');
var filter = require('./filter');
var database = require('./database');
var connector = require('./connector');

var fileName = String(process.argv[2] || '').replace(/[^a-z0-9\.\_]/gi, '');

if(!fileName) console.log('USAGE: node index.js name_project.json');

// Realiza a leitura do arquivo
fs.readFile(fileName, 'utf-8', function(err, data) {

    if (err) throw err;

    try{
        
        var project = JSON.parse(data);
        project = filter.filterAndOrganize(project);
        database.init(project);
        connector.init(project);

    }catch(e){
        console.log('ERROR: ', e);
    }

});
