define("CatLab/i18n-lite/Translate",["jquery","sprintf","js-cookie"],function(t,n,e){var i,a,r,s=function(){this.defaultLanguage="en",this.language="en",this.translations={},this.cookie="language"},o=s.prototype;return o.initialize=function(n){"undefined"==typeof n&&(n={}),this.defaultLanguage=n.defaultLanguage||"en",this.tracker=n.tracker||null,this.cookie=n.cookie||"language",this.language=this.getLanguage();var e=t.Deferred();return this.deferred=e,$.getJSON("locales/languages.json").done(function(){this.translations=[],this.tryLoadTranslations([this.language,this.language.substr(0,2)])}.bind(this)).fail(function(){e.resolve()}.bind(this)),e},o.getLanguage=function(){var t;return t=this.cookie&&e.get(this.cookie)?e.get(this.cookie):"undefined"!=typeof navigator.language?navigator.language:this.defaultLanguage},o.tryLoadTranslations=function(t){var n=t.shift();$.getJSON("locales/"+n+".json",function(t){this.setTranslation(t)}.bind(this)).fail(function(){t.length>0?this.tryLoadTranslations(t):this.noTranslation()}.bind(this))},o.setTranslation=function(t){this.translations=t,this.deferred.resolve()},o.noTranslation=function(){this.deferred.resolve()},o.translate=function(t){if(""===t)return t;for(i=[],a=0;a<arguments.length;a++)i.push(arguments[a]);return t=i.shift(),r=null,i.length>0&&(r=this.getArgumentNumericValue(i[0])),null!==r?(this.track(t,!0),t=this.getTranslation(t,r)):(this.track(t,!1),t=this.getTranslation(t)),n.vsprintf(t,i)},o.track=function(t,e){var i=new Image;i.src=n.vsprintf(this.tracker,[encodeURIComponent(t),e?1:0])},o.getPluralized=function(t,n){if(0===n||n>1){if("undefined"!=typeof t.plural)return t.plural}else if("undefined"!=typeof t.single)return t.single;for(var e in t)return t[e]},o.getTranslation=function(t,n){if("undefined"==typeof this.translations.resources)return t;var e=this.translations.resources[t];return"undefined"==typeof e?t:"object"==typeof e?this.getPluralized(e,n):e},o.changeLanguage=function(t){e.set(this.cookie,t,{expires:365})},o.getArgumentNumericValue=function(t){return $.isNumeric(t)?parseFloat(t):null},s}),define("i18n-lite",["CatLab/i18n-lite/Translate"],function(t){return new t});
//# sourceMappingURL=i18n-lite.js
//# sourceMappingURL=i18n-lite.js.map