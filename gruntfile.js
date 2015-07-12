module.exports = function (grunt) {
  grunt.initConfig({
    bower: {
      dev: {
        base: 'bower_components',
        dest: 'build/styles/lib',
        options: {
          checkExistence: true,
          debugging: true,
          paths: {
            bowerDirectory: 'bower_components',
            bowerJson: 'bower.json'
          },
          filter: '**/*.css'
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          src: ['src/**/*.scss'],
          dest: 'build/styles/app',
          ext: '.css'
        }]
      }
    },
    injector: {
      options: {
        relative: true
      },
      dev: {
        files: {
          'build/index.html': ['build/**/*.css']
        }
      }
    },
    copy: {
      main: {
        files: [{
          src: ['src/index.html'],
          dest: 'build/',
          expand: true,
          flatten: true
        }]
      }
    },
    cssmin: {
      options: {},
      target: {
        files: {
          'build/site.css': ['build/styles/**/*.css']
        }
      }
    },
    clean: {
      build: {
        src: ['build/**/*']
      },
      temp: {
        src: ['build/styles/**/*.css', '!build/site.css']
      }
    }
  })

  grunt.loadNpmTasks('main-bower-files')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-injector')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('build-dev', ['clean:build', 'copy', 'bower', 'sass', 'injector'])
  grunt.registerTask('build', ['clean:build', 'copy', 'bower', 'sass', 'cssmin', 'clean:temp', 'injector'])
  grunt.registerTask('default', ['build-dev'])
}
