module.exports = function(grunt) {

    grunt.initConfig({
      sass: {                              // Task
        dist: {                            // Target
          options: {                       // Target options
            style: 'compact'
          },
          files: {                         // Dictionary of files
            'css/main.min.css': 'sass/main.scss',       // 'destination': 'source'
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['sass']);

};