'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');

const fs = require("fs");

const Sequelize = require('sequelize');



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


var Juice = sequelize.define('Juice', {
    Name: {
        type: Sequelize.STRING
    },
    Size: {
        type: Sequelize.STRING
    },
    Ingredients: {
        type: Sequelize.STRING
    },
    Comments: {
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

    method: 'POST',
    path: '/form',
    handler: function (request, reply) {
        var formresponse = JSON.stringify(request.payload);
        var parsing = JSON.parse(formresponse);
        //console.log(parsing);

        Juice.create(parsing).then(function (currentJuice) {
            Juice.sync();
            console.log("...syncing");
            console.log(currentJuice);
            return (currentJuice);
        }).then(function (currentJuice) {

            reply.view('formresponse', {
                formresponse: currentJuice
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/createDB',
    handler: function (request, reply) {
        // force: true will drop the table if it already exists
        Juice.sync({
            force: true
        })
        reply("Database Created")
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

});
