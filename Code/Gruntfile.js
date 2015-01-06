

module.exports = function(grunt) {
    "use strict";
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Doesn't follow the grunt-* naming scheme and therefor isn't loaded automatically
    grunt.loadNpmTasks('assemble');
    //Browserify Configuration
    var browserifySiteConfig = require('./browserify.config.js');

    grunt.initConfig({
        // Package Info
        pkg: {
            name: 'The Polyglot',
            description: 'The Polyglot',
            version: '0.0.0',
            homepage: 'http://owzzz.github.io/The_Polyglot'
        },
        // Configurable App Directories
        rewletka: {
            buildPath: 'Build',
            distributionPath: 'Dist',
            sassPath: 'Build/assets/sass',
            imgPath: 'Build/assets/img',
            iconsPath: 'Build/assets/img/icons',
            jsPath: 'Build/assets/js',
            root: ''
        },
        // Grunt Watch
        // https://github.com/gruntjs/grunt-contrib-watch
        // Used to watch for changes in the files specified below
        watch: {
            miscFiles: {
                files: ['Gruntfile.js'],
                tasks: ['build']
            },
            assemble: {
            	files: [
                    '<%= rewletka.buildPath %>/views/**/*.{hbs,json}'
                ],
                tasks: ['assemble']
            },
            compass: {
                files: '<%= rewletka.buildPath %>/assets/sass/**/*.scss',
                tasks: ['compass', 'autoprefixer']
            },
            browserify: {
                files: ['<%= rewletka.buildPath %>/assets/js/**/*.js'], 
                tasks: ['browserify:build']
            }
        }, 
        // Grunt Connect
        // https://github.com/gruntjs/grunt-contrib-connect
        // Used to create a static web server for dev
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: true
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= rewletka.distributionPath %>'
                }
            }
        },
        // Grunt Clean
        // https://github.com/gruntjs/grunt-contrib-clean
        // Clear files and folders
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= rewletka.distributionPath %>/*']
                }]
            }
        },
        // Grunt jshint
        // https://github.com/gruntjs/grunt-contrib-jshint
        // Validate files with JSHint
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= rewletka.buildPath %>/assets/js/{,*/}*.js',
                '!<%= rewletka.buildPath %>/assets/js/vendor/*'
            ]
        },
        // Compass
        // https://github.com/gruntjs/grunt-contrib-compass
        compass: {
            options: {
                generatedImagesDir: '<%= rewletka.distributionPath %>',
                httpImagesPath: '<%= rewletka.distributionPath %>/assets/img',
                httpGeneratedImagesPath: '<%= rewletka.distributionPath %>/assets/img',
                httpFontsPath: '<%= rewletka.distributionPath %>/assets/fonts',
                relativeAssets: false
            },
            build: {
                options: {
                    cssDir: '<%= rewletka.distributionPath %>/assets/css',
                    specify: ['<%= rewletka.buildPath %>/assets/sass/main.scss'],
                    sassDir: '<%= rewletka.buildPath %>/assets/sass',
                    imagesDir: '<%= rewletka.distributionPath %>/assets/img',
                    javascriptDir: '<%= rewletka.buildPath %>/assets/js',
                    fontsDir: '<%= rewletka.buildPath %>/assets/fonts',
                    relativeAssets: false
                }
            }
        },
        // Browserify
        // https://github.com/jmreidy/grunt-browserify
        browserify: {
            build: {
                files: {
                    '<%= rewletka.distributionPath %>/assets/js/main.min.js': ['<%= rewletka.buildPath %>/assets/js/main.js']
                },
                options: {
                    alias: browserifySiteConfig,
                    debug: true
                }
            },
            dist: {
                files: {
                    '<%= rewletka.distributionPath %>/assets/js/main.min.js': ['<%= rewletka.buildPath %>/assets/js/main.js']
                },
                options: {
                    alias: browserifySiteConfig,
                    debug: false
                }
            }
        },
        // Autoprefixer
        // Adds vendor prefixes to css properties
        // https://github.com/nDmitry/grunt-autoprefixer
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 9']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= rewletka.distributionPath %>/assets/css/',
                    src: '{,*/}*.css',
                    dest: '<%= rewletka.distributionPath %>/assets/css/'
                }]
            }
        },
        // CSSmin
        // Minifies css files
        // https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
            dist: {
                files: {
                    '<%= rewletka.distributionPath %>/assets/css/main.css': ['<%= rewletka.distributionPath %>/assets/css/main.css']
                }
            }
        },
        // Uglify
        // Minifies JS files
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            dist: {
                files: {
                    '<%= rewletka.distributionPath %>/assets/js/main.min.js': ['<%= rewletka.distributionPath %>/assets/js/main.min.js']
                }
            }
        },
        // Grunt Copy
        // Copies files and folders
        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= rewletka.buildPath %>',
                    dest: '<%= rewletka.distributionPath %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'assets/img/**/*.{jpg,png,gif,svg}',
                        'assets/js/vendor/modernizr/modernizr.js',
                        'assets/fonts/**',
                        'assets/videos/**/*.{mov,mp4}'
                    ]
                }]
            }
        },
        // Assemble
        // Assemble HTML files from partials
        // http://www.assemble.io
        assemble: {
            options: {
                flatten: true,
                partials: ['<%= rewletka.buildPath %>/views/partials/**/*.hbs'],
                helpers: ['<%= rewletka.buildPath %>/views/helpers/*.js']
            },
            build: {
                options: {
                    layout: '<%= rewletka.buildPath %>/views/layouts/default.hbs',
                    data: ['<%= rewletka.buildPath %>/views/data/**/*.json'],
                    flatten: true
                },
                files: {
                    '<%= rewletka.distributionPath %>/': ['<%= rewletka.buildPath %>/views/pages/**/*.hbs'],
                }
            }
        },
    });

    // Development & prod build tasks
    grunt.registerTask('build', [
        // Cleanup Previously Generated Files
        'clean:dist',

        // Copy HTML and assets
        'copy',

        // Assemble Handlebar Partials
        'assemble',

        // Run jshint on js files, if pass continue
        'jshint',

        // Concat Required Browserify Modules
        'browserify:build',

        // Sass compilation and sprite generation
        'compass',

        // Add Vendor Specific Prefixes to CSS
        'autoprefixer'
    ]);

     // Development grunt task
    grunt.registerTask('dev', [
        // shared build tasks
        'build',
        
        // Live Local Server
        'connect:dist',

        // Watch for file changes
        'watch'
    ]);

    grunt.registerTask('dist', [
        // shared build tasks
        'build'
        
    ]);
};