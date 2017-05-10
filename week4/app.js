'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const Handlebars = require('handlebars');

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

server.register([Blipp, Inert, Vision], () => {});

server.views({
    engines: {
        html: Handlebars
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'layout',
    helpersPath: 'views/helpers'
        //partialsPath: 'views/partials'
});



server.route({
    method: 'GET',
    path: '/',
    handler: {
        view: {
            template: 'index',
            context: {
                title: 'Tom and His Family',
                menu: [
                    {
                        item: 'HaveBreakfast'
                    },
                    {
                        item: 'HaveLunch'
                    },
                    {
                        item: 'HaveDinner'
                    }
                    ],
                message: 'It is Sunday and Tom wants to do something fun with his family, they would like to go to....'
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: './',
            listing: true,
            index: false,
            redirectToSlash: true
        }
    }
});


server.route({
    method: 'GET',
    path: '/dynamic',
    handler: {
        view: {
            template: 'dynamic',
            context: {
                title: "Tom and His Family",
                message: 'It is Sunday and Tom wants to do something fun with his family, they would like to go to....',
                nav: [
                    {
                        url: "/page2/squirrel",
                        title: "HaveBreakfast"
                    },
                    {
                        url: "/page2/kite",
                        title: "HaveLunch"
                    },
                    {
                        url: "/page2/computer",
                        title: "HaveDinner"
                    }
                ]
            }

            //
        }
    }
});

server.route({
    method: 'GET',
    path: '/page2/{played*}',
    handler: function (request, reply) {

        var played = encodeURIComponent(request.params.played);
        var message = "They go to " + played;


        reply.view('page2', {
            title: "Phil's Adventure",
            message: message,
            pic: played,
            nav: [
                    {
                        url: "/page3/Chinese-Food",
                        title: "Chinese-Food"
                    },
                    {
                        url: "/page3/American-Food",
                        title: "American-Food"
                    },
                    {
                        url: "/page3/Korean-Food",
                        title: "Korean-Food"
                    }
                ]

        });
    }
});


server.route({
    method: 'GET',
    path: '/page3/{played*}',
    handler: function (request, reply) {
         var played = encodeURIComponent(request.params.played);
        var message = "Having" + played ;
        reply.view('page2', {
            title: "Phil's Adventure",
            message: message,
            pic: played

        });
    }
});

server.route({
    method: 'GET',
    path: '/basicHandler',
    handler: {
        view:{
            template: 'basic',
            context: {
               title: "Basic Handler",
                message: "More information"
            }

        }
    }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

});
