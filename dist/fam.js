/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _fam = __webpack_require__(1);

	var _fam2 = _interopRequireDefault(_fam);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.FreeAllMedia = _fam2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var setDefaults = Symbol();
	var listenForEvents = Symbol();
	var detectAdblocker = Symbol();
	var showDialog = Symbol();
	var closeDialog = Symbol();
	var showAdblockerDialog = Symbol();
	var campaignURL = Symbol();

	var FreeAllMedia = function () {
	  function FreeAllMedia(options) {
	    _classCallCheck(this, FreeAllMedia);

	    this[setDefaults](options);
	    this[listenForEvents]();
	  }

	  _createClass(FreeAllMedia, [{
	    key: "iframe",
	    value: function iframe(domID, campaignName) {
	      if (!this[detectAdblocker]()) {
	        var container = window.document.getElementById(domID);

	        if (container) {
	          var iframeElement = window.document.createElement("iframe");
	          iframeElement.frameBorder = 0;
	          iframeElement.setAttribute("src", this[campaignURL](campaignName));
	          container.appendChild(iframeElement);
	          return iframeElement;
	        } else {
	          throw new Error("FAM: \"" + domID + "\" is not a valid DOM element ID.");
	        }
	      } else {
	        this[showAdblockerDialog]();
	        return false;
	      }
	    }
	  }, {
	    key: "dialog",
	    value: function dialog(campaignName) {
	      if (!this[detectAdblocker]()) {
	        var dialog = this[showDialog]();
	        dialog.className = "freeallmedia-dialog campaign";
	        this.iframe(dialog.id, campaignName);
	        this.on("end", function () {
	          var shadeElement = window.document.getElementById("freeallmedia-shade");
	          if (shadeElement) {
	            shadeElement.click();
	          }
	        });
	        return dialog;
	      } else {
	        this[showAdblockerDialog]();
	        return false;
	      }
	    }
	  }, {
	    key: "window",
	    value: function (_window) {
	      function window(_x) {
	        return _window.apply(this, arguments);
	      }

	      window.toString = function () {
	        return _window.toString();
	      };

	      return window;
	    }(function (campaignName) {
	      if (!this[detectAdblocker]()) {
	        var url = this[campaignURL](campaignName);
	        return window.open(url);
	      } else {
	        this[showAdblockerDialog]();
	        return false;
	      }
	    })
	  }, {
	    key: "on",
	    value: function on(eventName, eventHandler) {
	      var handlerWrapper = function handlerWrapper() {
	        eventHandler();
	      };

	      switch (eventName) {
	        case "start":
	        case "end":
	          break;
	        case "close":
	        case "video:play":
	        case "video:pause":
	        case "video:end":
	        case "video:mute":
	        case "video:unmute":
	        case "activity:start":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            eventHandler(activity);
	          };
	          break;
	        case "activity:end":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            var results = event.detail.results;
	            eventHandler(activity, results);
	          };
	          break;
	        case "image:impression":
	        case "image:clickthrough":
	          handlerWrapper = function handlerWrapper(event) {
	            var activity = event.detail.activity;
	            var creative = event.detail.creative;
	            eventHandler(activity, creative);
	          };
	          break;
	        default:
	          throw new Error("FAM: \"" + eventName + "\" is not a valid FAM event name. See README for full list of event names.");
	      }

	      window.document.addEventListener("fam:" + eventName, handlerWrapper);
	    }
	  }, {
	    key: setDefaults,
	    value: function value(options) {
	      this.adblocker = {
	        active: true,
	        header: "Hello!",
	        subheader: "The content you requested is ad-supported",
	        body: "You'll need to temporarily disable your adblocker to access it."
	      };
	      this.environment = options.environment || "production";
	      this.host = options.host || "https://cdn.freeallmedia.com/campaigns";
	    }
	  }, {
	    key: campaignURL,
	    value: function value(campaignName) {
	      return this.host + "/" + campaignName + "/index.html";
	    }
	  }, {
	    key: listenForEvents,
	    value: function value() {
	      var eventListenerName = window.addEventListener ? "addEventListener" : "attachEvent";
	      var eventListener = window[eventListenerName];
	      var eventName = eventListenerName === "attachEvent" ? "onmessage" : "message";

	      eventListener(eventName, function (event) {
	        if (event.data.origin && event.data.origin === "FreeAllMedia") {
	          var customEvent = new CustomEvent(event.data.event, { detail: event.data.payload });
	          document.dispatchEvent(customEvent);
	        }
	      }, false);
	    }
	  }, {
	    key: detectAdblocker,
	    value: function value() {
	      /* Adapted from npm package just-detect-adblock */
	      if (this.adblocker.active) {
	        var bait = document.createElement("div");
	        bait.setAttribute("class", "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links freeallmedia");
	        bait.setAttribute("style", "width: 1px ! important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;");
	        window.document.body.appendChild(bait);

	        var adblockerDetected = window.document.body.getAttribute("abp") !== null || bait.offsetParent === null || bait.offsetHeight === 0 || bait.offsetLeft === 0 || bait.offsetTop === 0 || bait.offsetWidth === 0 || bait.clientHeight === 0 || bait.clientWidth === 0;

	        if (window.getComputedStyle !== undefined) {
	          var baitTemp = window.getComputedStyle(bait, null);
	          if (baitTemp && (baitTemp.getPropertyValue("display") === "none" || baitTemp.getPropertyValue("visibility") === "hidden")) {
	            adblockerDetected = true;
	          }
	        }

	        window.document.body.removeChild(bait);

	        return adblockerDetected;
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: showAdblockerDialog,
	    value: function value() {
	      var dialogElement = this[showDialog]();

	      var header = window.document.createElement("h1");
	      var subheader = window.document.createElement("h2");
	      var body = window.document.createElement("p");
	      var howto = window.document.createElement("img");

	      header.innerText = this.adblocker.header;
	      subheader.innerText = this.adblocker.subheader;
	      body.innerText = this.adblocker.body;

	      dialogElement.appendChild(header);
	      dialogElement.appendChild(subheader);
	      dialogElement.appendChild(body);
	      dialogElement.appendChild(howto);

	      dialogElement.onclick = this[closeDialog];

	      howto.setAttribute("src", "https://cdn.freeallmedia.com/adblocker-instructions/disable-adblocker.gif");
	    }
	  }, {
	    key: showDialog,
	    value: function value() {
	      var _this = this;

	      var bodyElement = window.document.body;

	      var shadeElement = window.document.createElement("div");
	      shadeElement.className = "freeallmedia-shade";
	      shadeElement.id = "freeallmedia-shade";

	      var dialogElement = window.document.createElement("div");
	      dialogElement.className = "freeallmedia-dialog";
	      dialogElement.id = "freeallmedia-dialog";

	      shadeElement.appendChild(dialogElement);
	      bodyElement.appendChild(shadeElement);

	      window.onclick = function (event) {
	        // console.log(event.target.tagName);
	        if (event.target !== dialogElement && event.target.tagName !== "A") {
	          // console.log(event.target);
	          // console.log(dialogElement);
	          _this[closeDialog]();
	        }
	      };

	      return dialogElement;
	    }
	  }, {
	    key: closeDialog,
	    value: function value() {
	      var shadeElement = window.document.getElementById("freeallmedia-shade");
	      var dialogClassName = "freeallmedia-shade closing";
	      if (shadeElement.className !== dialogClassName) {
	        shadeElement.className = dialogClassName;
	        setTimeout(function () {
	          window.document.body.removeChild(shadeElement);
	        }, 500);
	      }
	    }
	  }]);

	  return FreeAllMedia;
	}();

	exports.default = FreeAllMedia;

/***/ }
/******/ ]);