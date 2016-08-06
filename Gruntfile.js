module.exports = function(grunt) {

	var app = {
            // Application variables
			applicationJS: 'app/<%= grunt.config("pkg.name")%>_app_<%= grunt.config.get("buildDate") %>.js',
			libraryJS: 'libs/<%= grunt.config("pkg.name")%>_lib_<%= grunt.config.get("buildDate") %>.js',
			scripts: [
			  // JS files to be included by includeSource task into index.html
				'bower_components/**/angular.min.js',
				'bower_components/**/angular-ui-router.min.js',
				'bower_components/**/d3.min.js',
				'bower_components/**/nv.d3.min.js',
				'bower_components/**/angular-nvd3.min.js',

				'app/**/index-module.js',
				'app/**/index-config.js',
				'app/**/index-route.js',
				'app/**/index-run.js',
				'app/**/rainfallController.js',				
				'app/**/rainfallService.js',
				'app/**/dataService.js'
            ],
            styles: [
				'css/*.css'
            ]
        };
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
                  dev: {
                    options: {
                      variables: {
                        'environment': 'development',
                        'buildDate': "<%= grunt.template.today('yyyymmdd') %>",
						'buildVersion': "0.0.0.1"
                      }
                    }
                  },
                  test: {
                    options: {
                      variables: {
                        'environment': 'testing',
                        'buildDate': "<%= grunt.template.today('yyyymmdd') %>",
						'buildVersion': "0.0.0.1"
                      }
                    }
                  },
                  prod: {
                    options: {
                      variables: {
                        'environment': 'production',
                        'buildDate': "<%= grunt.template.today('yyyymmdd') %>",
						'buildVersion': "0.0.0.1"
                      }
                    }
                  }
                },
        app: app,
		
        cssmin: {
			onebyone:{
				files: [{
				  expand: true,
				  cwd: 'build/temp/css',
				  src: ['**/*.css'],
				  dest: 'build/css'
				}]
			}
        },
        clean: {
            build: ["build"],
			temp:["build/temp"],
			js: (function() {
					  var cwd = 'build/';
					  var arr = app.scripts;
					  // determine file order here and concat to arr
					  return arr.map(function(file) {
						return cwd + file;
					  });
					}()),
        },
		concat: {
			options: {
				stripBanners: true,
				separator: ';\n'
			},
			libraryFiles: {
				src:(function() {
					  var cwd = 'src/';
					  var arr = app.scripts;
					  var filteredArray = [];
					  // determine file order here and concat to arr
					  arr.map(function(file) {
						  if(file.indexOf('bower_components/') != -1){
							  filteredArray.push(cwd + file);
						  }
					  });
					  return filteredArray;
					}()) ,
				dest: 'build/<%= app.libraryJS %>',
			},
			applicationFiles: {
				src:(function() {
					  var cwd = 'src/';
					  var arr = app.scripts;
					  var filteredArray = [];
					  // determine file order here and concat to arr
					  arr.map(function(file) {
						  if(file.indexOf('app/') != -1){
							filteredArray.push(cwd + file);
						  }
					  });
					  return filteredArray;
					}()) ,
				dest: 'build/<%= app.applicationJS %>',
			}
		},
		ngAnnotate:{
			applicationFiles:{
				src:'build/<%= app.applicationJS %>',
				dest: 'build/<%= app.applicationJS %>'
			}
		},
		uglify:{
			options: {
				preserveComments:false,
				mangle: true,
			},
			applicationFiles: {
				src: 'build/<%= app.applicationJS %>' ,
				dest: 'build/<%= app.applicationJS %>',
			}
		},
        includeSource: {
            // Task to include files into index.html
            options: {
                basePath: 'build',
                baseUrl: '',
                ordering: 'top-down',
				templates: {
				  html: {
					js: '<script src="{filePath}"></script>',
					jsProd: '<script src="{filePath}"></script>',
					css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
				  }
				}
            },
            app: {
                files: {
                    'build/index.html': 'src/index.grunt.template.html'
                }
            },
			prod:{
				files: {
                    'build/index.html': 'src/index.grunt.prod.template.html'
                }
			}
        },
		sync:{
			appLibJS: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'src/', // Src matches are relative to this path.
                    src: ['**/*.js'], // Actual pattern(s) to match.
                    dest: 'build', // Destination path prefix.
                }, ],
            },
			json: {
                    //JSON data
                    files:[{
                        expand: true,
                        cwd: 'src',
                        src: ['assets/**/*.json','!assets/css/**/*.json'],
                        dest: 'build/'
                    },]

            },
			html:{
				// modules html templates
                    files:[{
                        expand: true,
                        cwd: 'src',
                        src: ['app/**/*.html'],
                        dest: 'build/'
                    },]
			}
		},
        copy: {
            assets: {
                files: [
                    // images
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/**/*.png'],
                        dest: 'build/'
                    }, {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/**/*.jpg'],
                        dest: 'build/'
                    }, {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/**/*.gif'],
                        dest: 'build/'
                    },
                    // modules html templates
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['app/**/*.html'],
                        dest: 'build/'
                    },
                    //JSON data
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/**/*.json','!assets/css/**/*.json'],
                        dest: 'build/'
                    },
	             ],
            },
            appLibJS: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'src/', // Src matches are relative to this path.
                    src: ['<%= app.scripts %>'], // Actual pattern(s) to match.
                    dest: 'build', // Destination path prefix.
                }, ],
            },
            cssfile: {
                files: [
                  {
					expand:true,
					flatten:true,
					cwd: 'src/',
                    src: ['assets/css/*.css'],
                    dest: 'build/css/'
                  }
              ]
            },
			cssfilemin: {
                files: [
                  {
					expand:true,
					flatten:true,
					cwd: 'src/',
                    src: ['assets/css/*.css'],
                    dest: 'build/temp/css/'
                  }
              ]
            }
		},
        htmlmin: { // Task
            build: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'build/', // Src matches are relative to this path.
                    src: ['**/*.html'], // Actual pattern(s) to match.
                    dest: 'build/', // Destination path prefix.
                }, ],
            },
            dev: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: 'build/', // Src matches are relative to this path.
                    src: ['**/*.html'], // Actual pattern(s) to match.
                    dest: 'build/', // Destination path prefix.
                }, ],
            }
        },
		replace: {
		  dist: {
			options: {
			  patterns: [
				{
				  match: 'wsdBuildVersion',
				  replacement: '<%=grunt.config.get("buildVersion")%>'
				}
			  ],
			},
			files: [
				{
					expand: true,
					flatten: true,
					src: ['src/app/template/footer.html'],
					dest: 'build/app/template/',
				}
			]
		  }
		},
        serve: {
            options: {
                port: 9191,
            }
        },
         watch: {
                options:
                {
                    interval: 5007, // Added because CPU was constantly running above 80%
                    livereload:true,
                    dateFormat: function(time) {
                        grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                        grunt.log.writeln('Waiting for more changes...');
                    }
                },
                scripts:{
                    files: ['./src/bower_components/**/*.js','./src/app/**/*.js'],
                    tasks:['config:dev','sync:appLibJS']
                },
                templates:{
                    files:['./src/app/**/*.html'],
                    tasks:['config:dev','sync:html']
                },
				json:{
                    files:['./src/**/*.json'],
                    tasks:['config:dev','sync:json']
                },
                css:{
                    files:['./src/**/*.css'],
                    tasks:['config:dev','copy:cssfile','copy:assets']
                }
        },
		express: {
            all: {
                options:{
                    port:9000,
                    hostname:'localhost',
                    bases:['./build'],
                    livereload:true,
                }
            }
       },
      open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= express.all.options.port%>',
				app: "%InternetExplorer%"
            }
      },
      connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    livereload: 35729,
                    open: true,
                    base: ['app']
                }
            },
            test: {
                options: {
                    base: ['app']
                }
            }
        },
		prompt: {
			qabuild: {
			  options: {
				questions: [
				  {
					config: 'isMinificationRequired',
					type: 'confirm',
					message: 'do you want to minify the javascript and css files?',
					default: true
				  }
				]
			  }
			}
		},
		jshint:{
			options:{
				"bitwise": true,
				"camelcase": false,
				"curly": false,
				"eqeqeq": false,
				"esversion": 5,
				"forin": true,
				"freeze": true,
				"immed": true,
				"indent": 4,
				"latedef": false,
				"newcap": false,
				"noarg": true,
				"noempty": true,
				"nonbsp": false,
				"nonew": true,
				"plusplus": false,
				"undef": false,
				"unused": false,
				"strict": false,
				"asi": true,
				"boss": false,
				"debug": false,
				"eqnull": true,
				"esnext": false,
				"evil": false,
				"expr": true,
				"funcscope": true,
				"globalstrict": false,
				"iterator": false,
				"lastsemic": false,
				"laxbreak": true,
				"laxcomma": false,
				"loopfunc": true,
				"moz": false,
				"multistr": false,
				"notypeof": false,
				"proto": false,
				"scripturl": false,
				"shadow": true,
				"sub": true,
				"supernew": false,
				"validthis": true,
				"noyield": false,

				"browser": true,
				"node": true,

				"globals": {
					"angular": false,
					"$": false,
					"enableLoading": false,
					"disableLoading": false
				},
				"maxerr": 20000,

				reporter: require('jshint-html-reporter'),
				reporterOutput:'report/checkstyle-report.html'
			},
			report:{
				files:{
					src:"src/app/**/*.js"
				}
			}
		}
    });
    // Load the plugin that provides the "concat","uglify","include" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-config');
	grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('jshint-html-reporter');

    grunt.registerTask('devbuild', ['clean:build','config:dev','copy:cssfile','copy:appLibJS','copy:assets','includeSource:app','express','open','watch']);
    grunt.registerTask('prodbuild', ['prompt:qabuild','buildwithpromptinput']);
	grunt.registerTask('buildwithpromptinput','perform custom build',function(){
		if(grunt.config('isMinificationRequired')){
			grunt.task.run(['clean:build','config:test','copy:cssfilemin', 'cssmin:onebyone', 'clean:temp', 'copy:assets', 'concat:libraryFiles', 'concat:applicationFiles','ngAnnotate:applicationFiles','uglify:applicationFiles','includeSource:prod','replace']);
		}
		else{
			grunt.task.run(['clean:build','config:test','copy:cssfile','copy:assets', 'concat:libraryFiles', 'concat:applicationFiles','ngAnnotate:applicationFiles','includeSource:prod', 'replace']);
		}
	});
	grunt.registerTask('checkstyle',['jshint:report']);
};
