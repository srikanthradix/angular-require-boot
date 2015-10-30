module.exports = function (grunt) {
    //do grunt related tasks in here.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ['Gruntfile.js', 'src/main/resources/app/js/**/*.js'],
            options: {
                "asi": true,
                "expr": true
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/main/resources/app/js/**/*.js',
                    'src/main/resources/app/config/*.js',
                    'src/main/resources/app/app/js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'src/main/resources/app/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }
    });

    // load the Grunt task
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", ["concat", "uglify"]);
};