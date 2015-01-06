

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
        thePolyGlot: {
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
                    '<%= thePolyGlot.buildPath %>/views/**/*.{hbs,json}'
                ],
                tasks: ['assemble']
            },
            compass: {
                files: '<%= thePolyGlot.buildPath %>/assets/sass/**/*.scss',
                tasks: ['compass', 'autoprefixer']
            },
            browserify: {
                files: ['<%= thePolyGlot.buildPath %>/assets/js/**/*.js'], 
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
                    base: '<%= thePolyGlot.distributionPath %>'
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
                    src: ['<%= thePolyGlot.distributionPath %>/*']
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
                '<%= thePolyGlot.buildPath %>/assets/js/{,*/}*.js',
                '!<%= thePolyGlot.buildPath %>/assets/js/vendor/*'
            ]
        },
        // Compass
        // https://github.com/gruntjs/grunt-contrib-compass
        compass: {
            options: {
                generatedImagesDir: '<%= thePolyGlot.distributionPath %>',
                httpImagesPath: '<%= thePolyGlot.distributionPath %>/assets/img',
                httpGeneratedImagesPath: '<%= thePolyGlot.distributionPath %>/assets/img',
                httpFontsPath: '<%= thePolyGlot.distributionPath %>/assets/fonts',
                relativeAssets: false
            },
            build: {
                options: {
                    cssDir: '<%= thePolyGlot.distributionPath %>/assets/css',
                    specify: ['<%= thePolyGlot.buildPath %>/assets/sass/main.scss'],
                    sassDir: '<%= thePolyGlot.buildPath %>/assets/sass',
                    imagesDir: '<%= thePolyGlot.distributionPath %>/assets/img',
                    javascriptDir: '<%= thePolyGlot.buildPath %>/assets/js',
                    fontsDir: '<%= thePolyGlot.buildPath %>/assets/fonts',
                    relativeAssets: false
                }
            }
        },
        // Browserify
        // https://github.com/jmreidy/grunt-browserify
        browserify: {
            build: {
                files: {
                    '<%= thePolyGlot.distributionPath %>/assets/js/main.min.js': ['<%= thePolyGlot.buildPath %>/assets/js/main.js']
                },
                options: {
                    alias: browserifySiteConfig,
                    debug: true
                }
            },
            dist: {
                files: {
                    '<%= thePolyGlot.distributionPath %>/assets/js/main.min.js': ['<%= thePolyGlot.buildPath %>/assets/js/main.js']
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
                    cwd: '<%= thePolyGlot.distributionPath %>/assets/css/',
                    src: '{,*/}*.css',
                    dest: '<%= thePolyGlot.distributionPath %>/assets/css/'
                }]
            }
        },
        // CSSmin
        // Minifies css files
        // https://github.com/gruntjs/grunt-contrib-cssmin
        cssmin: {
            dist: {
                files: {
                    '<%= thePolyGlot.distributionPath %>/assets/css/main.css': ['<%= thePolyGlot.distributionPath %>/assets/css/main.css']
                }
            }
        },
        // Uglify
        // Minifies JS files
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            dist: {
                files: {
                    '<%= thePolyGlot.distributionPath %>/assets/js/main.min.js': ['<%= thePolyGlot.distributionPath %>/assets/js/main.min.js']
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
                    cwd: '<%= thePolyGlot.buildPath %>',
                    dest: '<%= thePolyGlot.distributionPath %>',
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
                partials: ['<%= thePolyGlot.buildPath %>/views/partials/**/*.hbs'],
                helpers: ['<%= thePolyGlot.buildPath %>/views/helpers/*.js']
            },
            build: {
                options: {
                    layout: '<%= thePolyGlot.buildPath %>/views/layouts/default.hbs',
                    data: ['<%= thePolyGlot.buildPath %>/views/data/**/*.json'],
                    flatten: true
                },
                files: {
                    '<%= thePolyGlot.distributionPath %>/': ['<%= thePolyGlot.buildPath %>/views/pages/**/*.hbs'],
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