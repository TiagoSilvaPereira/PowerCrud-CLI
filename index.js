'use strict';

var fs = require('fs');
var filter = require('./filter');
var structure = require('./structure');
var database = require('./database');
var connector = require('./connector');

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
        });

    }catch(e){
        console.log('ERROR: ', e);
    }

});
