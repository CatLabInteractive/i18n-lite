define (
	[
		'sprintf'
	],
	function (
		sprintf
	) {

		var Translate = function () {

		};

		var p = Translate.prototype;

		p.initialize = function (options) {

			var callback;
			if (typeof (options) === 'function') {
				callback = options;
				this.options = options;
			}
			else {
				callback = options.callback || function () {};
				this.options = {};
			}

			callback ();

		};



		return Translate;
	}
);