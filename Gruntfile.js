module.exports = function(grunt) {
    grunt.initConfig({
        clean: ['dist/'],
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
                src: [
                    'public/js/libs/jquery.js',
                    'public/js/libs/jquery.tree.js',
                    'public/js/libs/underscore.js',
                    'public/js/libs/codemirror.js',
                    'public/js/libs/backbone.js',
                    'public/js/libs/pouch.js',

                    // templates
                    'public/js/templates/template.js',

                    // scripts
                    'public/js/scripts/app.js',
                    'public/js/scripts/start.js'
                ],
                dest: 'dist/debug/puton.js'
            }
        },
        uglify: {
            release: {
                files: {
                    "dist/release/puton.min.js": [
                        "dist/debug/puton.js"
                    ]
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    "dist/release/puton.css": [
                        "public/css/codemirror.css",
                        "dist/debug/style.css"
                    ]
                }
            }
        },

        less: {
            release: {
                files: {
                    'dist/debug/style.css': 'public/css/style.less'
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

  
    grunt.registerTask('test', ['clean','jshint']);
    grunt.registerTask('build', ['concat:dist', 'less:release']);
    grunt.registerTask("minify", ['uglify','cssmin']);
    grunt.registerTask("debug", ['test','build']);
    grunt.registerTask("release", ['debug', 'minify']);
    grunt.registerTask("default", "release");
};
