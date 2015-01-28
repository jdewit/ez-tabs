'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        push: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        files: {
          src: ['src/**/*.js', 'test/**/*.js']
        },
      }
    },
    karma: {
      singleRun: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    less: {
      options: {
        compress: true
      },
      styles: {
        files: {
          'dist/ez-tabs.min.css': ['src/*.less']
        }
      }
    },
    ngtemplates:  {
      ezTabs:      {
        src:      'src/views/**/*.html',
        dest:     'dist/ez-tabs-tpl.min.js',
        options: {
          module: 'ez.tabs',
          url: function(url) { return url.replace('src/views/', ''); }
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/ez-tabs.min.js': ['src/ez-tabs.js'],
          'dist/ez-tabs-tpl.min.js': ['dist/ez-tabs-tpl.min.js'],
        }
      }
    },
    watch: {
      dev: {
        files: ['src/**/*'],
        tasks: ['default']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint', 'ngtemplates', 'uglify', 'less']);

  grunt.registerTask('test', ['karma:singleRun']);

};
