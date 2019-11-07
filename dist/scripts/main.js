require.config ({
	paths: {
		'sprintf' : "../vendor/sprintf/dist/sprintf.min",
		'jquery' : "../vendor/jquery/dist/jquery.min",
		'js-cookie' : "../vendor/js-cookie/src/js.cookie"
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