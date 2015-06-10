define (
	[],
	function () {

		var Translate = function () {

		};

		var p = Translate.prototype;

		p.initialize = function (callback) {
			callback ();
		};

		return Translate;
	}
);