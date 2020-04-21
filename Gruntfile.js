module.exports = function(grunt) {

	grunt.initConfig
	({

		bowerRequirejs: {
			target: {
				rjsConfig: 'app/scripts/main.js'
			}
		},

		'requirejs' : {
			'compile' : {
				'options' : {
					appDir: "app/",
					baseUrl: "scripts",
					dir: "dist/",
					mainConfigFile: "app/scripts/main.js",
					name: "i18n-lite",
					optimize: 'none',
					optimizeCss: "standard",
					removeCombined: true,
					generateSourceMaps : true,
					preserveLicenseComments : false,
					exclude: [
						'sprintf',
						'js-cookie',
						'axios',
						'simply-deferred'
					]
				}
			}
		},

		'clean' : [
			'dist/package.json',
			'dist/scripts/CatLab/',
			'dist/vendor/',
			'dist/examples'
		],

		i18n_downloader: {
			default_options : {
				options: {
					'dest': 'app/examples/locales',
					'src': {
						'host': 'translate.catlab.eu',
						'project': 'library',
						'port': 80
					},
					'format' : 'i18nlite'
				}
			}
		}
	});

	// Requirejs
	grunt.loadNpmTasks('grunt-contrib-requirejs');


	// Cleaner
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Copy
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadNpmTasks('grunt-bower-requirejs');

	grunt.loadNpmTasks ('grunt-i18n-downloader');

	grunt.registerTask('default', [ 'i18n_downloader', 'requirejs', 'clean' ]);
};
