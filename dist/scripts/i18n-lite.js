define(
    'CatLab/i18n-lite/Translate', [
        'simply-deferred',
        'sprintf',
        'js-cookie',
        'axios'
    ],
    function (
        Deferred,
        sprintf,
        Cookies,
        axios
    ) {
        "use strict";

        var Translate = function () {

            this.defaultLanguage = 'en';
            this.language = null;
            this.translations = {};
            this.cookie = 'language';
            this.path = '/locales/';

            this.overrides = {};

            this.otherBundles = [];
        };

        var p = Translate.prototype;

        var args;
        var i;
        var tmp;

        p.initialize = function (options) {
            if (typeof (options) === 'undefined') {
                options = {};
            }

            if (typeof (options.path) !== 'undefined') {
                this.path = options.path;
            }

            this.defaultLanguage = options.defaultLanguage || 'en';
            this.tracker = options.tracker || null;
            this.cookie = options.cookie || 'language';

            if (typeof(options.language) !== 'undefined') {
                this.language = options.language;
            }

            if (this.language === null) {
                this.language = this.getLanguage();
            }

            var deferred = new Deferred();
            this.deferred = deferred;

            axios.get(this.path + 'languages.json')
                .then(function (response) {
                        this.translations = [];
                        this.tryLoadTranslations([this.language ]);
                    }.bind(this)
                )

                .catch(function () {
                    deferred.resolve();
                }.bind(this));

            return deferred;
        };

        /**
         * Get a bundle (pre-initialized) by a locale.
         * @param locale
         * @returns {Translate|*}
         */
        p.getBundle = function(locale) {
            if (this.language === locale) {
                var deferred = new Deferred();
                deferred.resolve(this);
                return deferred;
            }

            if (typeof(this.otherBundles[locale]) !== 'undefined') {
                return this.otherBundles[locale];
            }

            this.otherBundles[locale] = new Deferred();

            // create a new translation, load it and resolve the deferred state.
            var language = new Translate();
            language.initialize({
                defaultLanguage: this.defaultLanguage,
                language: locale,
                path: this.path
            }).then(function() {
                this.otherBundles[locale].resolve(language);
            }.bind(this));

            return this.otherBundles[locale];
        };

        /**
         * Get current language
         * @returns string
         */
        p.getLanguage = function () {
            var language;

            if (this.cookie && Cookies.get(this.cookie)) {
                language = Cookies.get(this.cookie);
            } else if (typeof(navigator) !== 'undefined' && typeof (navigator.language) !== 'undefined') {
                language = navigator.language.substr(0, 2);
            } else {
                language = this.defaultLanguage;
            }

            return language;
        };

        /**
         * Go trough all provided translations and stop as soon
         * as we have succesfully loaded one.
         * @param locales
         */
        p.tryLoadTranslations = function (locales) {

            var locale = locales.shift();

            axios.get(this.path + locale + ".json").then(function (response) {
                this.setTranslation(response.data);
            }.bind(this)).catch(function () {
                if (locales.length > 0) {
                    this.tryLoadTranslations(locales);
                } else {
                    this.noTranslation();
                }
            }.bind(this));

        };

        p.setTranslation = function (bundle) {
            this.translations = bundle;
            this.deferred.resolve();
        };

        p.noTranslation = function () {
            this.deferred.resolve();
        };

        p.translate = function (string) {
            if (string === "") {
                return string;
            }

            args = [];
            for (i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            string = args.shift();

            // Also check first variable
            tmp = null;

            if (args.length > 0) {
                tmp = this.getArgumentNumericValue(args[0]);
            }

            if (tmp !== null) {
                this.track(string, true);
                string = this.getTranslation(string, tmp);
            } else {
                this.track(string, false);
                string = this.getTranslation(string);
            }

            return sprintf.vsprintf(string, args);
        };

        // Alias.
        p.t = p.translate;
        p._ = p.translate;

        p.track = function (string, isPluralizable) {
            if (typeof(window) === 'undefined') {
                return;
            }

            var img = new Image();
            img.src = sprintf.vsprintf(
                this.tracker,
                [
                    encodeURIComponent(string),
                    isPluralizable ? 1 : 0
                ]
            );
        };

        p.getPluralized = function (options, amount) {
            if (amount === 0 || amount > 1) {
                if (typeof (options.plural) !== 'undefined') {
                    return options.plural;
                }
            } else {
                if (typeof (options.single) !== 'undefined') {
                    return options.single;
                }
            }

            // Not found? Return first value.
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    return options[key];
                }
            }
        };

        /**
         * Translate a string.
         * @param string
         * @param amount
         * @returns {*|boolean}
         */
        p.getTranslation = function (string, amount) {
            var value = this.getResourceProperty(string);

            if (value === null) {
                return string;
            }

            if (typeof (value) === 'object') {
                return this.getPluralized(value, amount);
            }

            return value;
        };

        /**
         * Check if we do have a stranslation for a certain string.
         * @param key
         * @returns {boolean}
         */
        p.hasTranslation = function(key) {
            return this.hasResourceProperty(key);
        };

        /**
         * Check if a property / translation is found.
         * @param key
         * @returns {boolean}
         */
        p.hasResourceProperty = function(key) {
            if (key === "") {
                return false;
            }

            if (typeof(this.overrides[key]) !== 'undefined') {
                return true;
            }

            if (typeof (this.translations.resources) === 'undefined') {
                return false;
            }

            return typeof (this.translations.resources[key]) !== 'undefined';
        };

        /**
         * @param key
         * @returns {boolean|*}
         */
        p.getResourceProperty = function(key) {
            if (typeof(this.overrides[key]) !== 'undefined') {
                return this.overrides[key];
            }

            if (typeof (this.translations.resources) === 'undefined') {
                return null;
            }

            if (typeof (this.translations.resources[key]) === 'undefined') {
                return null;
            }

            return this.translations.resources[key];
        };

        p.changeLanguage = function (language) {
            this.language = language.substr(0, 2);
            Cookies.set(this.cookie, language, {expires: 365});
        };

        p.getArgumentNumericValue = function (argument) {
            if (this.isNumeric(argument)) {
                return parseFloat(argument);
            }
            return null;
        };

        p.isNumeric = function(obj) {
            var type = typeof obj;
            return ( type === "number" || type === "string" ) &&
                !isNaN( obj - parseFloat( obj ) );
        };

        /**
         * Override a given key with a (temporary) custom value.
         * @param key
         * @param value
         */
        p.override = function(key, value) {
            this.overrides[key] = value;
        }

        return Translate;
    }
);

define (
	'i18n-lite',
	[
		'CatLab/i18n-lite/Translate'
	],
	function (Translate) {
		return new Translate ();
	}
);

//# sourceMappingURL=i18n-lite.js.map