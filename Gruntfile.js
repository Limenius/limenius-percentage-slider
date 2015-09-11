module.exports = function(grunt) {
  'use strict';

  var packageJSON = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: packageJSON,
    jasmine : {
      src : '<%= pkg.main %>',
      options : {
        specs : 'spec/**/*.js',
        styles : ['<%= pkg.GruntConfig.css.limperslider %>'],
        template : '<%= pkg.GruntConfig.tpl.SpecRunner %>'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    docco: {
        debug: {
            src: ['limperslider.js'],
            options: {
                output: 'doccos/'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['test', 'docco']);

};
