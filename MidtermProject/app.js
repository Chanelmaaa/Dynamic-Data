'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');
const fs = require("fs");
const Sequelize = require('sequelize');
const Fetch = require("node-fetch");
const FormData = require("form-data");

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({
    port: 3000
});

var sequelize = new Sequelize('db', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: 'db.sqlite'
});



var Events = sequelize.define('events', {
     EventName: {
        type: Sequelize.STRING
    },
        Time: {
        type: Sequelize.STRING
    },
        Days: {
        type: Sequelize.STRING
    },
        UserName: {
        type: Sequelize.STRING
    },
});


server.register([Blipp, Inert, Vision], () => {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers',
    //partialsPath: 'views/partials'
});



server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: {
            template: 'index'
        }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: false,
            index: false
        }
    }
});

server.route({
    method: 'GET',
    path: '/createDB',
    handler: function (request, reply) {
        // force: true will drop the table if it already exists
        Events.sync({
            force: true
        })
        reply("Database Created")
    }
});


server.route({
    method: 'GET',
    path: '/createEvent',
    handler: {
        view: {
            template: 'createevent'
        }
    }
});


server.route({

    method: 'POST',
    path: '/formEvent',
    handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);

        Events.create(parsing).then(function (currentEvents) {
            Events.sync();
            console.log("...syncing");
            console.log(currentEvents);
            return (currentEvents);
        }).then(function (currentEvents) {

            reply.view('createEvent', {
                formresponse: currentEvents
            });
        });
    }
});





server.route({
    method: 'GET',
    path: '/displayAll/{UserName}',
    handler: function (request, reply) {
        Events.findAll({
            where: {
                UserName: encodeURIComponent(request.params.UserName),
            }
        }).then(function (user) {
          
            var currentUser = JSON.stringify(user);
            reply.view('dbresponse', {
                dbresponse: currentUser
            });

        });
    }
});




server.route({
    method: 'GET',
    path: '/destroyAll',
    handler: function (request, reply) {

        Events.drop();

        reply("destroy all");
    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

});














