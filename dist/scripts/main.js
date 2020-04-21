require.config ({
	paths: {
		'sprintf' : "../vendor/sprintf/dist/sprintf.min",
		'simply-deferred': '../vendor/simply-deferred/deferred',
		'js-cookie' : "../vendor/js-cookie/src/js.cookie",
		'axios': '../vendor/axios/dist/axios'
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
