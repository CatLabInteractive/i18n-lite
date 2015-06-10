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
					optimize: 'uglify2',
					optimizeCss: "standard",
					removeCombined: true,
					generateSourceMaps : true,
					preserveLicenseComments : false,
					exclude: [
						'jquery',
						'sprintf'
					]
				}
			}
		},

		'clean' : [
			'dist/package.json',
			'dist/scripts/CatLab/',
			'dist/vendor/',
			'dist/examples'
		]
	});

	// Requirejs
	grunt.loadNpmTasks('grunt-contrib-requirejs');


	// Cleaner
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Copy
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.loadNpmTasks('grunt-bower-requirejs');

	grunt.registerTask('default', ['requirejs', 'copy', 'clean' ]);
};