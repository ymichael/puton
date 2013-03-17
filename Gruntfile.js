module.exports = function(grunt) {
    var sourceFiles = [
        'public/js/libs/jquery.js',
        'public/js/libs/jquery.tree.js',
        'public/js/libs/underscore.js',
        'public/js/libs/codemirror.js',
        'public/js/libs/backbone.js',
        'public/js/libs/pouch.js',

        // templates
        'public/js/templates/template.js',

        // scripts
        'public/js/scripts/utils.js',
        'public/js/scripts/app.js',
        'public/js/scripts/start.js'
    ];

    grunt.initConfig({
        clean: ['public/dist/'],
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: [
                "public/js/scripts/*.js"
            ]
        },
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: sourceFiles,
                dest: 'public/dist/debug/puton.js'
            }
        },
        uglify: {
            release: {
                files: {
                    "public/dist/release/puton.min.js": [
                        "public/dist/debug/puton.js"
                    ]
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    "public/dist/release/puton.css": [
                        "public/css/codemirror.css",
                        "public/dist/debug/style.css"
                    ]
                }
            }
        },
        less: {
            release: {
                files: {
                    'public/dist/debug/style.css': 'public/css/style.less'
                }
            }
        },
        jasmine: {
            all: {
              src: sourceFiles,
              options: {
                specs: 'spec/*.spec.js'
              }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: "spec",
                    keepalive: true,
                    middleware: function(connect, options) {
                        return [
                            connect.static('public'),
                            connect.static('spec'),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('lint', ['clean','jshint']);
    grunt.registerTask('test', ['connect']);
    grunt.registerTask('build', ['concat:dist', 'less:release']);
    grunt.registerTask("minify", ['uglify','cssmin']);
    grunt.registerTask("debug", ['test','build']);
    grunt.registerTask("release", ['debug', 'minify']);
    grunt.registerTask("default", "release");
};
