require.config ({
	paths: {
		'sprintf' : "../vendor/sprintf/dist/sprintf.min",
		'jquery' : "../vendor/jquery/dist/jquery.min"
	},
	shim: {

	},
	packages: [

	]
});

define (
	[ 'i18n-lite' ],
	function (catlabremote) {
		return catlabremote;
	}
);