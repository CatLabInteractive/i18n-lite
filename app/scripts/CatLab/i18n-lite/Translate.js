define (
	[
		'jquery',
		'sprintf'
	],
	function (
		jquery,
		sprintf
	) {

		var Translate = function () {

		};

		var p = Translate.prototype;

		p.initialize = function (options) {

			var deferred = jquery.Deferred();
			deferred.done ();

			return deferred;

		};



		return Translate;
	}
);