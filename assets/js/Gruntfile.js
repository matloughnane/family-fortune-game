module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    babel_multi_files: {
      files_array_format: {
        options: {
          sourceMaps: false,
          presets: [
            ["@babel/preset-env", {
              targets: "ie 11, > 5%"
            }]
          ]
        },
        files: [
          // {
          //   src: ["campaigns.min.js"],
          //   dest: "campaigns.babel.js"
          // }
          // , {
          //   src: ["test/fixtures/nested/*.js", "!test/fixtures/nested/*_a.js"],
          //   dest: "temp/files_array_format_b.js"
          // }
        ]
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'common.min.js': ['common.js'],
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          // '../css/styles.min.css': ['../css/styles.css']
        }
      }
    },
    htmlmin: { // Task
      dist: { // Target
        options: { // Target options
          removeComments: true,
          // collapseWhitespace: true
        },
        files: { // Dictionary of files
          //TO: FROM
          // '../../dist/index.html': '../../index.html',
          'dist/index.html': '../../index.html',
          // COPY TO HBS
          // COPY OTHER VENDOR FILES
        }
      }
    },
    watch: {
      scripts: {
        // files: ['*.js', '../css/partials/*.scss', '../../*.html', '../../partials/*.html'],
        files: ['*.js', '../css/partials/*.scss', '../../*.html', '../../partials/*.html'],
        tasks: ['babel_multi_files', 'uglify', 'htmlmin', 'sass'],
        options: {
          spawn: false,
        },
      },
    },
    sass: {
      dist: {
        options: { // Target options
          style: 'compressed'
        },
        files: {
          '../css/c-styles.css': '../css/c-styles.scss',
          // '../css/coreui-icons.min.css': '../css/partials/coreui/coreui-icons.min.css',
          // '../css/style.min.css': '../css/partials/coreui/style.min.css',
          // '../css/pace.min.css': '../css/partials/coreui/pace.min.css',
          // '../css/sweetalert2.css': '../css/partials/coreui/sweetalert2.css',
          // '../css/toastr.min.css': '../css/partials/coreui/toastr.min.css'
        }
      }
    }
  });

  // require('load-grunt-tasks')(grunt);
  // These plugins provide necessary tasks.
  // grunt.loadNpmTasks('load-grunt-tasks');
  grunt.loadNpmTasks('grunt-babel-multi-files');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['babel_multi_files', 'cssmin', 'htmlmin', 'uglify', 'sass']);

};
