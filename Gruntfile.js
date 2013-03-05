module.exports = function(grunt) {
    grunt.initConfig({
        clean: ['dist/'],
        jshint: {
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
                        "public/css/*.css"
                    ],
                    "dist/debug/puton.css": [
                        "public/css/*.css"
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('test', ['clean','jshint']);
    grunt.registerTask('build', ['concat:dist']);
    grunt.registerTask("minify", ['uglify','cssmin']);
    grunt.registerTask("debug", ['test','build']);
    grunt.registerTask("release", ['debug', 'minify']);
    grunt.registerTask("default", ["release"]);
};
