'use strict';

var fs = require('fs');
var filter = require('./utils/filter');
var structure = require('./starters/structure');
var database = require('./starters/database');
var connector = require('./starters/connector');
var spa = require('./starters/spa');

var fileName = String(process.argv[2] || '');
if(!fileName) console.log('USAGE: node index.js name_project.json');

// Realiza a leitura do arquivo
fs.readFile(fileName, 'utf-8', function(err, data) {

    if (err) throw err;

    try{
        
        // Get Project
        var project = JSON.parse(data);
        project = filter.filterAndOrganize(project);

        //Start creating the Project
        structure.init(project, function(){
            database.init(project);
            connector.init(project);
            spa.init(project);
        });

    }catch(e){
        console.log('ERROR: ', e);
    }

});
