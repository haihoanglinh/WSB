(function($) {// v5 namespace 
var MK = {
	api 		: {},
	ui 			: {},
	component 	: {},
};

// Global 
window.MK = MK;
// http://alistapart.com/article/container-queries-once-more-unto-the-breach
  var elementQuery = (function() {

    // implementations for testing actual element query properties
    var queryMatchers = {
      "min-width": function(element, value, units) {
        var el = element;
        var px = convertToPx(el, value, units);
        return value && el && el.offsetWidth >= px;
      },
      "max-width": function(element, value, units) {
        var el = element;
        var px = convertToPx(el, value, units);
        return value && el && el.offsetWidth < px;
      }
    };

    // convert an element query into a css class name we can replace it with
    var classNameForRules = function(rules) {
      var name = "query";
      for (var i = 0, len = rules.length; i < len; i++) {
        name += "_" + rules[i].property + "_" + rules[i].value + rules[i].units;
      }
      return name;
    };
    
    // determine the px value for a measurement (e.g. "5em") on a given element
    var convertToPx = function(element, value, units) {
      switch (units) {
        case "px": return value;
        case "em": return value * getEmSize(element);
        case "rem": return value * getEmSize();
        // Viewport units!
        // According to http://quirksmode.org/mobile/tableViewport.html
        // documentElement.clientWidth/Height gets us the most reliable info
        case "vw": return value * document.documentElement.clientWidth / 100;
        case "vh": return value * document.documentElement.clientHeight / 100;
        case "vmin":
        case "vmax":
          var vw = document.documentElement.clientWidth / 100;
          var vh = document.documentElement.clientHeight / 100;
          var chooser = Math[units === "vmin" ? "min" : "max"];
          return value * chooser(vw, vh);
        default: return value;
        // for now, not supporting physical units (since they are just a set number of px)
        // or ex/ch (getting accurate measurements is hard)
      }
    };
    
    // determine the size of an em in a given element
    var getEmSize = function(element) {
      if (!element) {
        element = document.documentElement;
      }
      if (window.getComputedStyle) {
        return parseFloat(getComputedStyle(element).fontSize) || 16;
      }
      // TODO: support IE?
      return 16;
    };

    // test whether an element matches a set of query rules
    var elementMatchesRules = function(element, rules) {
      for (var i = rules.length - 1; i > -1; i--) {
        var rule = rules[i];
        var matcher = queryMatchers[rule.property];
        if (matcher && !matcher(element, rule.value, rule.units)) {
          return false;
        }
      }
      return true;
    };

    var loader = {
      // parse an array of CSSStyleSheet objects for element queries
      loadStyleSheets: function(sheets, callback) {
        var completed = 0;
        for (var i = 0, len = sheets.length; i < len; i++) {

          // if( (sheets[i].href && sheets[i].href.indexOf('media.min.css') != -1) || (sheets[i].href && sheets[i].href.indexOf('media.css') != -1) ) {
            this.loadStyleSheet(sheets[i], function() {
              completed += 1;
              if (completed === len) {
                callback && callback();
              }
            });
          // }
        }
      },

      // parse a single CSSStyleSheet object for element queries
      loadStyleSheet: function(sheet, callback) {
        // if (sheet.ownerNode.nodeName === "STYLE") {
        //   if(sheet.ownerNode.id !== 'js-media-query') return;
        //   var result = elementQuery.parser.parseStyleText(sheet.ownerNode.innerHTML);
        //   sheet.ownerNode.innerHTML += result.newCss;
        //   elementQuery.queries = elementQuery.queries.concat(result.queries);
        //   callback && callback();
        // }
        // else if (sheet.href) {
        if (sheet.href && sheet.ownerNode.id === 'js-media-query-css') {
          console.log('element query css parsed');
          var xhr = new XMLHttpRequest();
          xhr.open("GET", sheet.href, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                var result = elementQuery.parser.parseStyleText(xhr.responseText);
                elementQuery.queries = elementQuery.queries.concat(result.queries);
                var style = document.createElement("style");
                style.innerHTML = result.newCss;
                document.body.appendChild(style);
              }
              else if (window.console) {
                console.log("Could not load stylesheet at " + sheet.href);
              }
              callback && callback();
            }
          }
          xhr.send(null);
        }
      },
    };

    // public API
    var elementQuery = {
      autoInit: true,

      init: function() {
        var evaluated = false;
        this.loader.loadStyleSheets(document.styleSheets, function() {
          evaluated = true;
          elementQuery.evaluateQueries();
        });

        // if we are still waiting for some asynchronous ones, go ahead and evaluate
        // any found queries now for minimum latency
        if (!evaluated) {
          elementQuery.evaluateQueries();
        }
      },

      // update the styling for all the elements that have queries
      evaluateQueries: function(context) {
        context = context || document;
        var queries = this.queries;
        for (var i = 0, len = queries.length; i < len; i++) {
          var elements = context.querySelectorAll(queries[i].selector);
          for (var j = 0; j < elements.length; j++) {
            var element = elements[j];
            if (elementMatchesRules(element, queries[i].rules)) {
              element.classList.add(queries[i].className);
            }
            else {
              element.classList.remove(queries[i].className);
            }
          }
        }
      },

      queryMatchers: queryMatchers,
      queries: [],
      classNameForRules: classNameForRules,
      loader: loader
    };

    // re-run all queries on resize
    window.addEventListener("resize", function() {
      elementQuery.evaluateQueries();
    }, false);

    // automatically look for things on window load
    window.addEventListener("load", function() {
      if (elementQuery.autoInit) {
        elementQuery.init();
      }
    });

    // TODO: re-run all queries... on an interval?
    // override setTimeout, addEventListener, etc to hit every possible JS entry
    // point? Not really an ideal solution to this.
    // Repaint events in Mozilla?
    
    return elementQuery;
    
  }());

  (function(elementQuery) {

    // Identifies comments in CSS
    var COMMENT_PATTERN = /(\/\*)[\s\S]*?(\*\/)/g;
    // $1 is the end of a block ("}")
    // $2 is all of a simple @rule ("@something ...;")
    // $3 is the start of a rule with a block, excluding the opening {
    //    this could be an @media rule or a simple style rule.
    var STATEMENT_END_OR_START_PATTERN = /\s*(?:(\})|(@\S+\s+[^;{]+;)|(?:([^{}]+)\{))/g;
    // element queries look like:
    // `:media(property: value)` or `:media((property: value) and (property: value))`
    var QUERY_PATTERN = /:media\s*\(([^)]*)\)/g;
    var QUERY_RULES_PATTERN = /\(?([^\s:]+):\s*(\d+(?:\.\d+)?)(px|em|rem|vw|vh|vmin|vmax)\)?/g;
    var WHITESPACE_PATTERN = /^\s*$/;

    // Parse CSS content for element queries
    elementQuery.parser = {
      /**
       * This the main entry point for parsing some CSS. Pass it a string of
       * CSS content and you'll get back an object like:
       *   {
       *     queries: [array of query objects]
       *     newCss: [string of new CSS]
       *   }
       * The `newCss` property contains new CSS rules to use in place of the
       * rules that have element queries -- they replace the queries in selectors
       * with classes you can turn on and off on the relevant elements. You'll 
       * want to insert the new CSS content into a <style> element on your page.
       * 
       * @param  {String} styleText The text of a style sheet
       * @return {Object}
       */
      parseStyleText: function(styleText) {
        var newText = "";
        var queries = [];

        this.parseText(styleText, {
          // TODO: don't write a media query to newText if it has no element 
          // queries. Unfortunately that means tracking nesting level :\
          mediaQuery: function(selector) {
            newText += "\n" + selector + "{";
          },

          endMediaQuery: function() {
            newText += "\n}";
          },

          rule: function(selector, properties) {
            // a selector is an array of selectors, which are arrays in the form:
            // [text, elementQuery, text, elementQuery, etc., optional text]
            // TODO: maybe have a callback for each? May simplify the logic here.
            for (var i = 0, len = selector.length; i < len; i++) {
              var single = selector[i];

              // we're going to build up a new selector in `selectorSoFar`, 
              // replacing the element queries with classes.
              var selectorSoFar = "";

              // jump by two since we are dealing with [text, query] pairs
              for (var j = 0, lenj = single.length; j < lenj; j += 2) {
                // add text content to the selector
                selectorSoFar += single[j];
                var rules = single[j + 1];
                // we may have trailing text at the end, in which case there will
                // be no associated query rules.
                if (rules) {
                  var queryClass = elementQuery.classNameForRules(rules);
                  // create and add a query object for this element query
                  queries.push({
                    selector: selectorSoFar,
                    rules: rules,
                    className: queryClass
                  });
                  // replace the query in the selector with a class
                  selectorSoFar += "." + queryClass;
                }
              }

              // Add this selector to our new CSS
              newText += selectorSoFar + (i < len - 1 ? "," : "");
            }

            // Add the actual style rule content
            newText += " {" + properties + "}";
          }
        });

        return {
          queries: queries,
          newCss: newText
        };
      },

      /**
       * Parse the text of a stylesheet. Usually, you'll want to use 
       * parseStyleText() instead; this is slightly lower-level. You should
       * provide an object with callbacks for the parsing events you are 
       * interested in:
       *   {
       *     mediaQuery: 
       *       The start of a media rule was encountered. Receives everything 
       *       from the "@" to the "{" as the first argument.
       *     endMediaQuery: 
       *       The end of a media rule was encountered. No arguments.
       *     rule: 
       *       A normal style rule was encountered. Receives the parsed selector
       *       as the first argument and the string of properties and values the
       *       rule would apply to matched elements as the second argument.
       *   }
       *
       * There is no return value for this function.
       * 
       * @param  {String} styleText The text of a stylesheet to parse.
       * @param  {Object} callbacks An object containing callbacks for the parsing
       *                            events you are interested in.
       */
      parseText: function(styleText, callbacks) {
        callbacks = callbacks || {};

        // remove comments
        var text = styleText.replace(COMMENT_PATTERN, "");
        
        // iterate through all the CSS rules
        while (match = STATEMENT_END_OR_START_PATTERN.exec(text)) {
          // we found the end of a block
          if (match[1]) {
            callbacks.endMediaQuery && callbacks.endMediaQuery();
            continue;
          }

          // if we hit a plain-jane @rule (i.e. match[2]), we don't care
          var selector = match[3];
          if (selector) {
            // Note @media rules specially, since they can contain other rules
            if (selector.slice(0, 6) === "@media") {
              callbacks.mediaQuery && callbacks.mediaQuery(selector);
            }
            // otherwise just parse the rule
            else {
              var closingIndex = text.indexOf("}", match.index);
              // don't parse other @rules with blocks, e.g. @font-face
              if (selector[0] !== "@") {
                var content = text.slice(match.index + match[0].length, closingIndex);
                this.parseRule(selector, content, callbacks.rule);
              }
              STATEMENT_END_OR_START_PATTERN.lastIndex = closingIndex + 1;
            }
          }
        }
      },
      
      /**
       * Parse a style rule. This just manages the parsing of a selector and the
       * callback for a rule.
       * @private
       * 
       * @param  {String}   selector The selector for the rule
       * @param  {String}   content  The properties and values of the rule.
       * @param  {Function} callback The callback for a parsed rule.
       */
      parseRule: function(selector, content, callback) {
        var parsedSelector = this.parseSelector(selector);
        if (parsedSelector) {
          callback && callback(parsedSelector, content);
        }
      },

      /**
       * Parse a selector string and return an array of parsed selectors (one for
       * each comma-separated sub-selector).
       * Individual sub-selectors are parsed as arrays of alternating text and
       * element queries, so this selector:
       *   body:media(...) div:media(...) a, body:media(...), a
       * returns:
       *   [["body", [rules], " div", [rules], " a"],
       *    ["body", [rules], " a"]]
       * @private
       * 
       * @param  {String} selector The selector to parse.
       * @return {Array}
       */
      parseSelector: function(selector) {
        var parsed = [];
        var parts = selector.split(",");
        for (var i = 0, len = parts.length; i < len; i++) {
          var result = this.parseSingleSelector(parts[i]);
          if (result.length > 1) {
            parsed.push(result);
          }
        }
        // return null if no selectors had element queries
        return parsed.length ? parsed : null;
      },
      
      /**
       * Parses a single sub-selector. This is used by parseSelector().
       * @private
       * @param  {String} selector The sub-selector to parse
       * @return {Array}           The parsed selector
       */
      parseSingleSelector: function(selector) {
        var parsed = [];
        var lastIndex = 0;
        while (queryMatch = QUERY_PATTERN.exec(selector)) {
          // get everything up to the element query
          var selectorChunk = selector.slice(lastIndex, queryMatch.index);
          lastIndex = QUERY_PATTERN.lastIndex;
          var queryData = this.parseQuery(queryMatch[1]);
          parsed.push(selectorChunk);
          parsed.push(queryData);
        }
        // get any remaining text in the selector
        var remaining = selector.slice(lastIndex);
        if (!WHITESPACE_PATTERN.test(remaining)) {
          parsed.push(remaining);
        }

        // reset QUERY_PATTERN
        QUERY_PATTERN.lastIndex = 0;

        return parsed;
      },

      /**
       * Parse an element query. Returns an array of objects like:
       *   {
       *     property: the property being queries, e.g. "max-available-width"
       *     value:    the actual value to test for as a number
       *     units:    the units the value is expressed in
       *   }
       *   
       * @param  {String} queryString The text of the element query.
       * @return {Array}
       */
      parseQuery: function(queryString) {
        var rules = [];
        var ruleMatch;
        while (ruleMatch = QUERY_RULES_PATTERN.exec(queryString)) {
          rules.push({
            property: ruleMatch[1],
            value: parseFloat(ruleMatch[2]),
            units: ruleMatch[3]
          });
        }
        return rules;
      }
    };

  }(elementQuery));
(function($) {
	'use strict';

	$.exists = function(selector) {
	    return ($(selector).length > 0);
	};

	/**
	 * Helper to enable caching async scripts
	 * https://api.jquery.com/jquery.getscript/
	 * http://www.vrdmn.com/2013/07/overriding-jquerygetscript-to-include.html
	 * 
	 * @param  {String}   script url
	 * @param  {Function} callback     
	 */
	$.getCachedScript = function( url ) {
		var options = {
			dataType: "script",
			cache: true,
			url: url
		};
	 
	    // Use $.ajax() since it is more flexible than $.getScript
	    // Return the jqXHR object so we can chain callbacks
	  	return $.ajax( options );
	};



	// Fn to allow an event to fire after all images are loaded
	// usage:
	// $.ajax({
	//     cache: false,
	//     url: 'ajax/content.php',
	//     success: function(data) {
	//         $('#divajax').html(data).imagesLoaded().then(function(){
	//             // do stuff after images are loaded here
	//         });
	//     }
	// });
	$.fn.imagesLoaded = function () {

	    // Edit: in strict mode, the var keyword is needed
	    var $imgs = this.find('img[src!=""]');
	    // if there's no images, just return an already resolved promise
	    if (!$imgs.length) {return $.Deferred().resolve().promise();}

	    // for each image, add a deferred object to the array which resolves when the image is loaded (or if loading fails)
	    var dfds = [];  
	    $imgs.each(function(){
	        var dfd = $.Deferred();
	        dfds.push(dfd);
	        var img = new Image();
	        img.onload = function(){dfd.resolve();};
	        img.onerror = function(){dfd.resolve();};
	        img.src = this.src;
	    });

	    // return a master promise object which will resolve when all the deferred objects have resolved
	    // IE - when all the images are loaded
	    return $.when.apply($,dfds);

	};

}(jQuery));
/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function () {
	var attachEvent = document.attachEvent,
		stylesCreated = false;
	
	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();
		
		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		function resetTriggers(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		};

		function checkTriggers(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}
		
		function scrollListener(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		};
		
		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }    
			
			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}
		
		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}
	
	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');
			
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}
	
	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);
				
				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};
	
	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	}
})();
/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document|DocumentFragment} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());

/*!
 * The MIT License
 *
 * Copyright (c) 2012 James Allardice
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

( function ( global ) {

  'use strict';

  //
  // Test for support. We do this as early as possible to optimise for browsers
  // that have native support for the attribute.
  //

  var test = document.createElement('input');
  var nativeSupport = test.placeholder !== void 0;

  global.Placeholders = {
    nativeSupport: nativeSupport,
    disable: nativeSupport ? noop : disablePlaceholders,
    enable: nativeSupport ? noop : enablePlaceholders
  };

  if ( nativeSupport ) {
    return;
  }

  //
  // If we reach this point then the browser does not have native support for
  // the attribute.
  //

  // The list of input element types that support the placeholder attribute.
  var validTypes = [
    'text',
    'search',
    'url',
    'tel',
    'email',
    'password',
    'number',
    'textarea'
  ];

  // The list of keycodes that are not allowed when the polyfill is configured
  // to hide-on-input.
  var badKeys = [

    // The following keys all cause the caret to jump to the end of the input
    // value.

    27, // Escape
    33, // Page up
    34, // Page down
    35, // End
    36, // Home

    // Arrow keys allow you to move the caret manually, which should be
    // prevented when the placeholder is visible.

    37, // Left
    38, // Up
    39, // Right
    40, // Down

    // The following keys allow you to modify the placeholder text by removing
    // characters, which should be prevented when the placeholder is visible.

    8, // Backspace
    46 // Delete
  ];

  // Styling variables.
  var placeholderStyleColor = '#ccc';
  var placeholderClassName = 'placeholdersjs';
  var classNameRegExp = new RegExp('(?:^|\\s)' + placeholderClassName + '(?!\\S)');

  // The various data-* attributes used by the polyfill.
  var ATTR_CURRENT_VAL = 'data-placeholder-value';
  var ATTR_ACTIVE = 'data-placeholder-active';
  var ATTR_INPUT_TYPE = 'data-placeholder-type';
  var ATTR_FORM_HANDLED = 'data-placeholder-submit';
  var ATTR_EVENTS_BOUND = 'data-placeholder-bound';
  var ATTR_OPTION_FOCUS = 'data-placeholder-focus';
  var ATTR_OPTION_LIVE = 'data-placeholder-live';
  var ATTR_MAXLENGTH = 'data-placeholder-maxlength';

  // Various other variables used throughout the rest of the script.
  var UPDATE_INTERVAL = 100;
  var head = document.getElementsByTagName('head')[ 0 ];
  var root = document.documentElement;
  var Placeholders = global.Placeholders;
  var keydownVal;

  // Get references to all the input and textarea elements currently in the DOM
  // (live NodeList objects to we only need to do this once).
  var inputs = document.getElementsByTagName('input');
  var textareas = document.getElementsByTagName('textarea');

  // Get any settings declared as data-* attributes on the root element.
  // Currently the only options are whether to hide the placeholder on focus
  // or input and whether to auto-update.
  var hideOnInput = root.getAttribute(ATTR_OPTION_FOCUS) === 'false';
  var liveUpdates = root.getAttribute(ATTR_OPTION_LIVE) !== 'false';

  // Create style element for placeholder styles (instead of directly setting
  // style properties on elements - allows for better flexibility alongside
  // user-defined styles).
  var styleElem = document.createElement('style');
  styleElem.type = 'text/css';

  // Create style rules as text node.
  var styleRules = document.createTextNode(
    '.' + placeholderClassName + ' {' +
      'color:' + placeholderStyleColor + ';' +
    '}'
  );

  // Append style rules to newly created stylesheet.
  if ( styleElem.styleSheet ) {
    styleElem.styleSheet.cssText = styleRules.nodeValue;
  } else {
    styleElem.appendChild(styleRules);
  }

  // Prepend new style element to the head (before any existing stylesheets,
  // so user-defined rules take precedence).
  head.insertBefore(styleElem, head.firstChild);

  // Set up the placeholders.
  var placeholder;
  var elem;

  for ( var i = 0, len = inputs.length + textareas.length; i < len; i++ ) {

    // Find the next element. If we've already done all the inputs we move on
    // to the textareas.
    elem = i < inputs.length ? inputs[ i ] : textareas[ i - inputs.length ];

    // Get the value of the placeholder attribute, if any. IE10 emulating IE7
    // fails with getAttribute, hence the use of the attributes node.
    placeholder = elem.attributes.placeholder;

    // If the element has a placeholder attribute we need to modify it.
    if ( placeholder ) {

      // IE returns an empty object instead of undefined if the attribute is
      // not present.
      placeholder = placeholder.nodeValue;

      // Only apply the polyfill if this element is of a type that supports
      // placeholders and has a placeholder attribute with a non-empty value.
      if ( placeholder && inArray(validTypes, elem.type) ) {
        newElement(elem);
      }
    }
  }

  // If enabled, the polyfill will repeatedly check for changed/added elements
  // and apply to those as well.
  var timer = setInterval(function () {
    for ( var i = 0, len = inputs.length + textareas.length; i < len; i++ ) {
      elem = i < inputs.length ? inputs[ i ] : textareas[ i - inputs.length ];

      // Only apply the polyfill if this element is of a type that supports
      // placeholders, and has a placeholder attribute with a non-empty value.
      placeholder = elem.attributes.placeholder;

      if ( placeholder ) {

        placeholder = placeholder.nodeValue;

        if ( placeholder && inArray(validTypes, elem.type) ) {

          // If the element hasn't had event handlers bound to it then add
          // them.
          if ( !elem.getAttribute(ATTR_EVENTS_BOUND) ) {
            newElement(elem);
          }

          // If the placeholder value has changed or not been initialised yet
          // we need to update the display.
          if (
            placeholder !== elem.getAttribute(ATTR_CURRENT_VAL) ||
            ( elem.type === 'password' && !elem.getAttribute(ATTR_INPUT_TYPE) )
          ) {

            // Attempt to change the type of password inputs (fails in IE < 9).
            if (
              elem.type === 'password' &&
              !elem.getAttribute(ATTR_INPUT_TYPE) &&
              changeType(elem, 'text')
            ) {
              elem.setAttribute(ATTR_INPUT_TYPE, 'password');
            }

            // If the placeholder value has changed and the placeholder is
            // currently on display we need to change it.
            if ( elem.value === elem.getAttribute(ATTR_CURRENT_VAL) ) {
              elem.value = placeholder;
            }

            // Keep a reference to the current placeholder value in case it
            // changes via another script.
            elem.setAttribute(ATTR_CURRENT_VAL, placeholder);
          }
        }
      } else if ( elem.getAttribute(ATTR_ACTIVE) ) {
        hidePlaceholder(elem);
        elem.removeAttribute(ATTR_CURRENT_VAL);
      }
    }

    // If live updates are not enabled cancel the timer.
    if ( !liveUpdates ) {
      clearInterval(timer);
    }
  }, UPDATE_INTERVAL);

  // Disabling placeholders before unloading the page prevents flash of
  // unstyled placeholders on load if the page was refreshed.
  addEventListener(global, 'beforeunload', function () {
    Placeholders.disable();
  });

  //
  // Utility functions
  //

  // No-op (used in place of public methods when native support is detected).
  function noop() {}

  // Avoid IE9 activeElement of death when an iframe is used.
  //
  // More info:
  //  - http://bugs.jquery.com/ticket/13393
  //  - https://github.com/jquery/jquery/commit/85fc5878b3c6af73f42d61eedf73013e7faae408
  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch ( err ) {}
  }

  // Check whether an item is in an array. We don't use Array.prototype.indexOf
  // so we don't clobber any existing polyfills. This is a really simple
  // alternative.
  function inArray( arr, item ) {
    for ( var i = 0, len = arr.length; i < len; i++ ) {
      if ( arr[ i ] === item ) {
        return true;
      }
    }
    return false;
  }

  // Cross-browser DOM event binding
  function addEventListener( elem, event, fn ) {
    if ( elem.addEventListener ) {
      return elem.addEventListener(event, fn, false);
    }
    if ( elem.attachEvent ) {
      return elem.attachEvent('on' + event, fn);
    }
  }

  // Move the caret to the index position specified. Assumes that the element
  // has focus.
  function moveCaret( elem, index ) {
    var range;
    if ( elem.createTextRange ) {
      range = elem.createTextRange();
      range.move('character', index);
      range.select();
    } else if ( elem.selectionStart ) {
      elem.focus();
      elem.setSelectionRange(index, index);
    }
  }

  // Attempt to change the type property of an input element.
  function changeType( elem, type ) {
    try {
      elem.type = type;
      return true;
    } catch ( e ) {
      // You can't change input type in IE8 and below.
      return false;
    }
  }

  function handleElem( node, callback ) {

    // Check if the passed in node is an input/textarea (in which case it can't
    // have any affected descendants).
    if ( node && node.getAttribute(ATTR_CURRENT_VAL) ) {
      callback(node);
    } else {

      // If an element was passed in, get all affected descendants. Otherwise,
      // get all affected elements in document.
      var handleInputs = node ? node.getElementsByTagName('input') : inputs;
      var handleTextareas = node ? node.getElementsByTagName('textarea') : textareas;

      var handleInputsLength = handleInputs ? handleInputs.length : 0;
      var handleTextareasLength = handleTextareas ? handleTextareas.length : 0;

      // Run the callback for each element.
      var len = handleInputsLength + handleTextareasLength;
      var elem;
      for ( var i = 0; i < len; i++ ) {

        elem = i < handleInputsLength ?
          handleInputs[ i ] :
          handleTextareas[ i - handleInputsLength ];

        callback(elem);
      }
    }
  }

  // Return all affected elements to their normal state (remove placeholder
  // value if present).
  function disablePlaceholders( node ) {
    handleElem(node, hidePlaceholder);
  }

  // Show the placeholder value on all appropriate elements.
  function enablePlaceholders( node ) {
    handleElem(node, showPlaceholder);
  }

  // Hide the placeholder value on a single element. Returns true if the
  // placeholder was hidden and false if it was not (because it wasn't visible
  // in the first place).
  function hidePlaceholder( elem, keydownValue ) {

    var valueChanged = !!keydownValue && elem.value !== keydownValue;
    var isPlaceholderValue = elem.value === elem.getAttribute(ATTR_CURRENT_VAL);

    if (
      ( valueChanged || isPlaceholderValue ) &&
      elem.getAttribute(ATTR_ACTIVE) === 'true'
    ) {

      elem.removeAttribute(ATTR_ACTIVE);
      elem.value = elem.value.replace(elem.getAttribute(ATTR_CURRENT_VAL), '');
      elem.className = elem.className.replace(classNameRegExp, '');

      // Restore the maxlength value. Old FF returns -1 if attribute not set.
      // See GH-56.
      var maxLength = elem.getAttribute(ATTR_MAXLENGTH);
      if ( parseInt(maxLength, 10) >= 0 ) {
        elem.setAttribute('maxLength', maxLength);
        elem.removeAttribute(ATTR_MAXLENGTH);
      }

      // If the polyfill has changed the type of the element we need to change
      // it back.
      var type = elem.getAttribute(ATTR_INPUT_TYPE);
      if ( type ) {
        elem.type = type;
      }

      return true;
    }

    return false;
  }

  // Show the placeholder value on a single element. Returns true if the
  // placeholder was shown and false if it was not (because it was already
  // visible).
  function showPlaceholder( elem ) {

    var val = elem.getAttribute(ATTR_CURRENT_VAL);

    if ( elem.value === '' && val ) {

      elem.setAttribute(ATTR_ACTIVE, 'true');
      elem.value = val;
      elem.className += ' ' + placeholderClassName;

      // Store and remove the maxlength value.
      var maxLength = elem.getAttribute(ATTR_MAXLENGTH);
      if ( !maxLength ) {
        elem.setAttribute(ATTR_MAXLENGTH, elem.maxLength);
        elem.removeAttribute('maxLength');
      }

      // If the type of element needs to change, change it (e.g. password
      // inputs).
      var type = elem.getAttribute(ATTR_INPUT_TYPE);
      if ( type ) {
        elem.type = 'text';
      } else if ( elem.type === 'password' && changeType(elem, 'text') ) {
        elem.setAttribute(ATTR_INPUT_TYPE, 'password');
      }

      return true;
    }

    return false;
  }

  // Returns a function that is used as a focus event handler.
  function makeFocusHandler( elem ) {
    return function () {

      // Only hide the placeholder value if the (default) hide-on-focus
      // behaviour is enabled.
      if (
        hideOnInput &&
        elem.value === elem.getAttribute(ATTR_CURRENT_VAL) &&
        elem.getAttribute(ATTR_ACTIVE) === 'true'
      ) {

        // Move the caret to the start of the input (this mimics the behaviour
        // of all browsers that do not hide the placeholder on focus).
        moveCaret(elem, 0);
      } else {

        // Remove the placeholder.
        hidePlaceholder(elem);
      }
    };
  }

  // Returns a function that is used as a blur event handler.
  function makeBlurHandler( elem ) {
    return function () {
      showPlaceholder(elem);
    };
  }

  // Returns a function that is used as a submit event handler on form elements
  // that have children affected by this polyfill.
  function makeSubmitHandler( form ) {
    return function () {

        // Turn off placeholders on all appropriate descendant elements.
        disablePlaceholders(form);
    };
  }

  // Functions that are used as a event handlers when the hide-on-input
  // behaviour has been activated - very basic implementation of the 'input'
  // event.
  function makeKeydownHandler( elem ) {
    return function ( e ) {
      keydownVal = elem.value;

      // Prevent the use of the arrow keys (try to keep the cursor before the
      // placeholder).
      if (
        elem.getAttribute(ATTR_ACTIVE) === 'true' &&
        keydownVal === elem.getAttribute(ATTR_CURRENT_VAL) &&
        inArray(badKeys, e.keyCode)
      ) {
        if ( e.preventDefault ) {
            e.preventDefault();
        }
        return false;
      }
    };
  }

  function makeKeyupHandler(elem) {
    return function () {
      hidePlaceholder(elem, keydownVal);

      // If the element is now empty we need to show the placeholder
      if ( elem.value === '' ) {
        elem.blur();
        moveCaret(elem, 0);
      }
    };
  }

  function makeClickHandler(elem) {
    return function () {
      if (
        elem === safeActiveElement() &&
        elem.value === elem.getAttribute(ATTR_CURRENT_VAL) &&
        elem.getAttribute(ATTR_ACTIVE) === 'true'
      ) {
        moveCaret(elem, 0);
      }
    };
  }

  // Bind event handlers to an element that we need to affect with the
  // polyfill.
  function newElement( elem ) {

    // If the element is part of a form, make sure the placeholder string is
    // not submitted as a value.
    var form = elem.form;
    if ( form && typeof form === 'string' ) {

      // Get the real form.
      form = document.getElementById(form);

      // Set a flag on the form so we know it's been handled (forms can contain
      // multiple inputs).
      if ( !form.getAttribute(ATTR_FORM_HANDLED) ) {
        addEventListener(form, 'submit', makeSubmitHandler(form));
        form.setAttribute(ATTR_FORM_HANDLED, 'true');
      }
    }

    // Bind event handlers to the element so we can hide/show the placeholder
    // as appropriate.
    addEventListener(elem, 'focus', makeFocusHandler(elem));
    addEventListener(elem, 'blur', makeBlurHandler(elem));

    // If the placeholder should hide on input rather than on focus we need
    // additional event handlers
    if (hideOnInput) {
      addEventListener(elem, 'keydown', makeKeydownHandler(elem));
      addEventListener(elem, 'keyup', makeKeyupHandler(elem));
      addEventListener(elem, 'click', makeClickHandler(elem));
    }

    // Remember that we've bound event handlers to this element.
    elem.setAttribute(ATTR_EVENTS_BOUND, 'true');
    elem.setAttribute(ATTR_CURRENT_VAL, placeholder);

    // If the element doesn't have a value and is not focussed, set it to the
    // placeholder string.
    if ( hideOnInput || elem !== safeActiveElement() ) {
      showPlaceholder(elem);
    }
  }

}(this) );
// IE spupport comes in IE10
(function rAFPolyfill() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ["webkit", "moz"];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    }
})();



(function($) {
	'use strict';

	/**
	 * MK.core holds most important methods that bootstraps whole application
	 * 
	 * @type {Object}
	 */
	MK.core = {};



	/**
	 * State for referance of already loaded script files
	 * @type {Array}
	 */
	var _loadedDependencies = [];

	/**
	 * State of queue represented as pairs of script ref => callback
	 * @type {Object}
	 */
	var _inQueue = {};
	
	/**
	 * Initializes all components in given scope (object or DOM reference) based on data attribute and 'pointer' css class '.js-el'.
	 * DOM work is reduced by single traversing for pointer class and later filtering through cached object. It expects init() method
	 * on every component. Component itself should be defined in MK.component namespace and assign to DOM element via data-mk-component.
	 * Use it once on DOM ready with document as a scope. For partial initialization after ajax operations pass as a scope element
	 * where new DOM was inserted.
	 * 
	 * @param  {string|object}
	 */
	MK.core.initAll = function( scope ) {
		var $el = $( scope ).find( '.js-el' ), // single traversing
			$components = $el.filter( '[data-mk-component]' ),
			component = null;


		// initialize  component
		var init = function init(name, el) {
			var $el = $(el);

			if( $el.data('init-' + name) ) return; // do not initialize the same module twice

			if( typeof MK.component[ name ] !== 'function' ) console.log('Component init error: ', name);

			component = new MK.component[ name ]( el );
			component.init();
			$el.data('init-' + name, true); // mark as initialised

			// TODO add name
			MK.utils.eventManager.publish('component-inited');
		};

		$components.each( function() {
			var self = this,
				$this = $( this ),
				names = $this.data( 'mk-component' );

			if( typeof names === 'string' ) {
				var name = names; // containes only single name. Keep it transparent.
				init(name, self);
			} else {
				names.forEach( function( name ) {
					init(name, self);
				});
			} 
		}); 
	};

	/**
	 * Async loader for 3rd party plugins available from within theme or external CDNs / APIs.
	 * Take one argument as callback which is run when loading is finished. Also keeps track of already loaded scripts 
	 * and prevent duplication. Holds in queue multiple callbacks that where defined in different places but depend on the 
	 * same plugin.
	 *
	 * TODO: heavy test for multiple dependencies and crosssharing one dependency and different one dependency in queue, 
	 * bulletproof with single dependency
	 *
	 * @example MK.core.loadDependencies([MK.core.path.plugins + 'plugin.js'], function() {
	 *          	// do something when plugin is loaded
	 * 			})
	 * 
	 * @param  {array}
	 * @param  {function}
	 */
	MK.core.loadDependencies = function( dependencies, callback ) {
		var _callback = callback || function() {};

        if( !dependencies ) {
        	// If no dependencies defined then run _callback imidietelly
        	_callback(); 
        	return;
        }

		// Check for new dependencies
        var newDeps = dependencies.map( function( dep ) {
            if( _loadedDependencies.indexOf( dep ) === -1 ) {
            	 if( typeof _inQueue[ dep ] === 'undefined' ) {
        			// console.log( dep );
                	return dep;
                } else {
                	_inQueue[ dep ].push( _callback );
                	return true;
                }
            } else {
            	return false;
            }
        });

        // The dependency is not new but it's not resolved either
        // Callback is added to queue that will be run after the script is loaded
        // Don't run callback just yet.
        if( newDeps[0] === true ) {
        	return;
        }

        // Dependency was loaded previously. We can run callback safely
        if( newDeps[0] === false ) {
        	_callback();
        	return;
        }

        // Create queue and relationship script -> callback array to track
        // all callbacks that waits for ths script
        var queue = newDeps.map( function( script ) {
        	// console.log( script );
        	_inQueue[ script ] = [ _callback ];
            return $.getCachedScript( script );
        });

        // Callbacks invoking
        var onLoad = function onLoad() {
        	var index;
        	newDeps.map( function( loaded ) {
        		_inQueue[ loaded ].forEach( function( callback ) {
        			callback();
        		});
        		delete _inQueue[ loaded ];
                _loadedDependencies.push( loaded );
        	});
        };

        // Run callback when promise is resolved
        $.when.apply( null, queue ).done( onLoad );
	};

	/**
	 * Single namespace for all paths recuired in application.
	 * @type {Object}
	 */
	MK.core.path = {
		// plugins: mk_theme_js_path + '/plugins/async/min/', // *Edited*
		// ajaxUrl: window.PHP.ajax  // *Edited*
	};


})(jQuery);
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

    /**
     * Enables to evaluate common methods through DOM JSON references by invoking from object with bracket notation MK.utils[var][var]
     * @type {Object}
     */
    MK.utils.actions = {};

    MK.utils.actions.activate = function (el) {
        $(el).addClass('is-active');
    };
        
    MK.utils.actions.deactivate = function (el) {
        $(el).removeClass('is-active');
    };

}(jQuery));
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

    /**
     * Gets user browser and its version
     * @return {Object} => {name, version}
     */
	MK.utils.browser = (function() {
        var dataBrowser = [
            {string: navigator.userAgent, subString: "Edge", identity: "Edge"},
            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
            {string: navigator.userAgent, subString: "MSIE", identity: "IE"},
            {string: navigator.userAgent, subString: "Trident", identity: "IE"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
        ];

		var versionSearchString = null;
        var searchString = function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        };
        
        var searchVersion = function (dataString) {
            var index = dataString.indexOf(versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf("rv:");
            if (versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + versionSearchString.length + 1));
            }
        };

        var name = searchString(dataBrowser) || "Other";
        var version = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "Unknown";

        // Expose for css
        $('html').addClass(name).addClass(name + version);


        return {
        	name : name,
        	version : version
        };
        
	})();

    /**
     * Gets user operating system
     * @return {String}
     */
	MK.utils.OS = (function() {
		if (navigator.appVersion.indexOf("Win")!=-1) return "Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) return "OSX";
		if (navigator.appVersion.indexOf("X11")!=-1) return "UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) return "Linux";
	})();
	
    /**
     * Check if mobile device.
     * @return {Boolean}
     */
	MK.utils.isMobile = function() {
        // Problems with bigger tablets as users raport differences with behaviour. Switch to navigator sniffing
		// return ('ontouchstart' in document.documentElement) && matchMedia( '(max-width: 1024px)' ).matches;
     
        // http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
        // if it still brings problem try to move to more sophisticated solution like
        // apachemobilefilter.org
        // detectright.com
        // web.wurfl.io
        // 
        // Seems as best solution here:
        // hgoebl.github.io/mobile-detect.js

        function android() {
            return navigator.userAgent.match(/Android/i);
        }

        function blackBerry() {
            return navigator.userAgent.match(/BlackBerry/i);
        }

        function iOS() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }

        function opera() {
            return navigator.userAgent.match(/Opera Mini/i);
        }

        function windows() {
            return navigator.userAgent.match(/IEMobile/i);
        }

        return (android() || blackBerry() || iOS() || opera() || windows() || matchMedia( '(max-width: 1024px)' ).matches); 
            
	};

    /**
     * Check if menu is switched to responsive state based on user width settings
     * @return {Boolean} 
     */
    MK.utils.isResponsiveMenuState = function() {
        return window.matchMedia( '(max-width: '+ 1140 +'px)').matches;
    };

}(jQuery));
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	/**
	 * Basic implementation of pub / sub pattern to avoid tight coupling with direct module communication
	 * @type {Object}
	 */
	MK.utils.eventManager = {};

	/**
	 * Subscribe to custom event and run callbacks
	 * @param  {String}
	 * @param  {Function}
	 *
	 * @usage MK.utils.eventManager.subscribe('event', function(e, params) {} )
	 */
	MK.utils.eventManager.subscribe = function(evt, func) {
		$(this).on(evt, func);
	};

	/**
	 * Unsubscribe from custom event
	 * @param  {String}
	 * @param  {Function}
	 */
	MK.utils.eventManager.unsubscribe = function(evt, func) {
		$(this).off(evt, func);
	};

	/**
	 * Publish custom event to notify appliaction about state change
	 * @param  {String}
	 * 
	 * @usage MK.utils.eventManager.publish('event', {
	 *        	param: val
	 *        })
	 */
	MK.utils.eventManager.publish = function(evt, params) {
		$(this).trigger(evt, [params]);
	};

}(jQuery));
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	/**
	 * Control browser fullscreen mode
	 * @type {Object}
	 */
	MK.utils.fullscreen = {};

	// TODO: move to namespace
	MK.utils.launchIntoFullscreen = function ( element ) {
	    if(element.requestFullscreen) {
	     	element.requestFullscreen();
	  	} else if(element.mozRequestFullScreen) {
	    	element.mozRequestFullScreen();
	  	} else if(element.webkitRequestFullscreen) {
	    	element.webkitRequestFullscreen();
	  	} else if(element.msRequestFullscreen) {
	    	element.msRequestFullscreen();
	  	}
	};

	MK.utils.exitFullscreen = function () {
	  	if(document.exitFullscreen) {
	    	document.exitFullscreen();
	  	} else if(document.mozCancelFullScreen) {
	    	document.mozCancelFullScreen();
	  	} else if(document.webkitExitFullscreen) {
	    	document.webkitExitFullscreen();
	  	}
	};

}(jQuery));
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	MK.utils.misc = {};
	// TODO: move to namespace

	/**
	 * Get all top offsets from jQuery collection
	 * 
	 * @param  {$Objects}
	 * @return {Aray}
	 */
	MK.utils.offsets = function( $els ) {
		return $.map( $els, function( el ) {
			return $( el ).offset().top;
		});
	};

	/**
	 * Retrive from array of numbers first number that is higher than given parameter
	 * 
	 * @param  {Number}
	 * @param  {Array}
	 * @return {Number}
	 */
	MK.utils.nextHigherVal = function( val, arr ) {
		var i = 0,
			higher = null;

		var check = function() {
			if( val > arr[ i ]) {
				i += 1;
				check();
			} else {
				higher = arr[ i ];
			}
		};
		check();

		return higher;
	};


    MK.utils.throttle = function( delay, fn ) {
        var last;
        var deferTimer;

        return function() {
            var context = this;
            var args = arguments;
            var now = +new Date;
            if( last && now < last + delay ) {
            	clearTimeout( deferTimer );
            	deferTimer = setTimeout( function() { 
            		last = now; fn.apply( context, args ); 
            	}, delay );
          	} else {
            	last = now;
            	fn.apply( context, args );
          	}
        };
    };

})(jQuery); 
(function($) {
	'use strict';

	MK.utils = window.MK.utils || {};

	/**
	 * Scrolls page to static pixel offset
	 * @param  {Number}
	 */
	MK.utils.scrollTo = function( offset ) {
		$('html, body').stop().animate({
			scrollTop: offset
			}, {
	  		duration: 1200,
	  		easing: "easeInOutExpo"
		});
	};

	/**
	 * Scrolls to element passed in as object or DOM reference
	 * @param  {String|Object}
	 */
	MK.utils.scrollToAnchor = function( hash ) {
		var $target = $( hash );
		// console.log( hash );

		if( ! $target.length ) return;

		var offset  = $target.offset().top;
		offset = offset - MK.val.offsetHeaderHeight( offset );

		if( hash === '#top-of-page' ) window.history.replaceState( undefined, undefined, ' ' );
		else window.history.replaceState( undefined, undefined, hash );

		MK.utils.scrollTo( offset );
	};

	/**
	 * Controls native scroll behaviour
	 * @return {Object} => {disable, enable}
	 */
	MK.utils.scroll = (function() {
        // 37 - left arror, 38 - up arrow, 39 right arrow, 40 down arrow
	    var keys = [38, 40];

        function preventDefault(e) {
          e = e || window.event;
          e.preventDefault();
          e.returnValue = false;  
        }

        function wheel(e) {
          preventDefault(e);
        }

        function keydown(e) {
            for (var i = keys.length; i--;) {
                if (e.keyCode === keys[i]) {
                    preventDefault(e);
                    return;
                }
            }
        }

        function disableScroll() {
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', wheel, false);
            }
          	window.onmousewheel = document.onmousewheel = wheel;
          	document.onkeydown = keydown;
        }

        function enableScroll() {            
          	if (window.removeEventListener) {
                window.removeEventListener('DOMMouseScroll', wheel, false);
            }
            window.onmousewheel = document.onmousewheel = document.onkeydown = null; 
        }	

        return {
        	disable : disableScroll,
        	enable  : enableScroll
        };

	})();

	/**
	 * Checks if passed link element has anchor inside current page. Returns string like '#anchor' if so or false
	 * @param  {String|Object}
	 * @return {String|Boolean}
	 */
	MK.utils.detectAnchor = function( el ) {
		var $this = $( el ),
			loc = window.location,
			currentPage = loc.origin + loc.pathname,
			href = $this.attr( 'href' ),
			linkSplit = (href) ? href.split( '#' ) : '',
			hrefPage  = linkSplit[0] ? linkSplit[0] : '', 
			hrefHash  = linkSplit[1] ? linkSplit[1] : '';

		if( (hrefPage === currentPage || hrefPage === '') && typeof hrefHash !== 'undefined' && hrefHash !== '' ) {
			return '#' + hrefHash;
		} else {
			return false;
		}
	};

	/**
	 * This should be invoked only on page load. 
	 * Scrolls to anchor from  address bar
	 */
	MK.utils.scrollToURLHash = function() {
		var loc = window.location,
			hash = loc.hash;

		if ( hash.length && hash.substring(1).length ) {
			// !loading is added early after DOM is ready to prevent native jump to anchor
			hash = hash.replace( '!loading', '' );

			// Wait for one second before animating 
			// Most of UI animations should be done by then and async operations complited
			setTimeout( function() {
				MK.utils.scrollToAnchor( hash );
			}, 1000 ); 

			// Right after reset back address bar
			setTimeout( function() {
				window.history.replaceState(undefined, undefined, hash);
			}, 1001);
		}
	};

	/**
	 * Scroll Spy implementation. Spy dynamic offsets of elements or static pixel offset
	 * @param  {Number|Element}
	 * @param  {Object} => callback object {before, active, after}
	 */
	MK.utils.scrollSpy = function( toSpy, config ) {
		var $window   = $( window ),
	        container = document.getElementById( 'wrapper' ),
	        isObj     = ( typeof toSpy === 'object' ),
	        offset    = (isObj) ? MK.val.dynamicOffset( toSpy, config.position, config.threshold ) : function() { return toSpy; },
	        height    = (isObj) ? MK.val.dynamicHeight( toSpy ) : function() { return 0; },
	        cacheVals = {},
	        _p 		  = 'before'; // current position

		var checkPosition = function() {
	    	var s = MK.val.scroll(), 
	    		o = offset(),
	    		h = height();

	        if( s < o && _p !== 'before' ) {
	        	// console.log( toSpy, 'before' );
	        	if( config.before ) config.before();
	        	_p = 'before';
	        } 
	        else if( s >= o && s <= o + h && _p !== 'active' ) {
	        	// console.log( toSpy, 'active' );
	        	if( config.active ) config.active( o );
	        	_p = 'active';
	        }
	        else if( s > o + h && _p !== 'after' ) {
	        	// console.log( toSpy, 'after' );
	        	if( config.after) config.after( o + h );
	        	_p = 'after';
	        }
		};

		var rAF = function() {
			window.requestAnimationFrame( checkPosition );
		};

		var exportVals = function() {
			return cacheVals;    
		};

		var updateCache = function() {
	    	var o = offset(),
	    		h = height();
	    		
	        cacheVals = {
	        	before : o - $window.height(),
	        	active : o,
	        	after : o + h
	        };
		};

		if( config.cache ) {
			config.cache( exportVals );
		}

	    checkPosition();
	    $window.on( 'load', checkPosition );
	    $window.on( 'resize', checkPosition );
	    $window.on( 'mouseup', checkPosition );
   		window.addResizeListener( container, checkPosition );

	    $window.on( 'scroll', rAF ); 

   		updateCache();
	    $window.on( 'load', updateCache );
	    $window.on( 'resize', updateCache );
   		window.addResizeListener( container, updateCache );
	};

}(jQuery));
// (function() {
//     'use strict';

//     // Make sure the video behaves like background-size: cover
//     window.videoCover = function( holderSelector, videoSelector ) {
//         var videos = document.querySelectorAll( videoSelector ),
//             holder = document.querySelectorAll( holderSelector )[0];

//         [].forEach.call(videos, function(video) {

//             var videoAspectRatio;

//             resizeBackground(); 

//             video.onloadedmetadata = function() {
//                 // get images aspect ratio
//                 videoAspectRatio = this.height / this.width;
//                 // attach resize event and fire it once
//                 window.onresize = resizeBackground;
//                 resizeBackground();
//             };

//             function resizeBackground() {
//                 // get window size and aspect ratio
//                 var holderWidth = holder.innerWidth,
//                     holderHeight = holder.innerHeight,
//                     holderAspectRatio = holderHeight / holderWidth;

//                 //compare holder ratio to image ratio so you know which way the image should fill
//                 if ( holderAspectRatio < videoAspectRatio ) {
//                     // we are fill width
//                     video.style.width = holderWidth + "px";
//                     // and applying the correct aspect to the height now
//                     video.style.height = (holderWidth * videoAspectRatio) + "px"; // this can be margin if your element is not positioned relatively, absolutely or fixed
//                     // make sure image is always centered
//                     video.style.left = "0px";
//                     video.style.top = (holderHeight - (holderWidth * videoAspectRatio)) / 2 + "px";
//                 } else { // same thing as above but filling height instead
//                     video.style.height = holderHeight + "px";
//                     video.style.width = (holderHeight / videoAspectRatio) + "px";
//                     video.style.left = (holderWidth - (holderHeight / videoAspectRatio)) / 2 + "px";
//                     video.style.top = "0px";
//                 }
//             }

//         });
//     };

// }());
// 
// 
// 
// TODO it is temp only. make it as a plugin

(function($) {
    'use strict';

    var $videoHolder = $('.mk-center-video'),
        $wrapper = $videoHolder.parent(),
        baseAspectRatio = 56.25;

    var wrapperHeight,
        wrapperWidth,
        wrapperAspectRatio;

    function calc() {
        wrapperHeight = $wrapper.height();
        wrapperWidth = $wrapper.width();
        wrapperAspectRatio = (wrapperHeight / wrapperWidth) * 100;
    } 

    function apply() {        
        var width = (wrapperAspectRatio / baseAspectRatio) * 100,
            widthOverflow = (width - 100);

        $videoHolder.css({
            'padding-top': wrapperAspectRatio + '%',
            'width': width + '%',
            'left': -(widthOverflow / 2) + '%'
        }); 
    }

    function reset() {
        $videoHolder.css({
            'padding-top': baseAspectRatio + '%',
            'width': 100 + '%',
            'left': 0
        });
    }

    function setCover() {
        reset();
        calc();
        if(wrapperAspectRatio > baseAspectRatio) apply();
    }

    $(window).on('load', setCover);
    $(window).on('resize', setCover);


}(jQuery));
(function($) {
	'use strict';

	/**
	 * 	MK.val is collection of Lambdas responsible for returning up to date values of method type like scrollY or el offset.
	 * 	The Lambda is responsible for keeping track of value of a particular property, usually takes as argument an object 
	 * 	(or DOM reference) and internally creates and updates data that is returned as primitive value - through variable reference.
	 *
	 *  Benefits of this approach:
	 *  - reduced DOM reads
	 *  - auto-updating values without need for additional logic where methods are called
	 *  - updating values when needed to be updated not read
	 *
	 *  Downsides:
	 *  - Memory overhead with closures and keeping state in memory ( still beter than read state from DOM, but use wisely - 
	 *    do not use it when you really need static value on runtime )
	 */
	MK.val = {};

	/**
	 * Current window offsetY position
	 *
	 * @uses   MK.val.scroll()
	 * @return {number}
	 */
	MK.val.scroll = (function() {
		var offset = 0,
			$window = $( window ),
			hasPageYOffset = ( window.pageYOffset !== undefined ),
			body = ( document.documentElement || document.body.parentNode || document.body ); // cross browser handling

		var update = function() {
			offset = hasPageYOffset ? window.pageYOffset : body.scrollTop;
		};

		var rAF = function() {
			window.requestAnimationFrame( update );
		}; 

		update();
		$window.on( 'load', update );
		$window.on( 'resize', update );
		$window.on( 'scroll', rAF ); 

		return function() {
			return offset; 
		};
	})();
	

	/**
	 * Changes number of percent to pixels based on viewport height
	 *
	 * @uses   MK.val.viewportPercentHeight({percent val})
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.viewportPercentHeight = function( percent ) {
		return $( window ).height() * ( percent / 100 );
	};


	/**
	 * Wordpress adminbar height based on wp media queries
	 * @return {Number}
	 */
    MK.val.adminbarHeight = function() {
        if( php.hasAdminbar ) {
        	// apply WP native media-query and sizes
        	return ( window.matchMedia( '( max-width: 782px )' ).matches ) ? 46 : 32;
        } else {
        	return 0;
        }
    };
    

    /**
     * Offset when header becomes sticky. Evaluates viewport % and header height to pixels for according options
     * @return {Number}
     */
    MK.val.stickyOffset = (function() {
	    var $header = $('.mk-header').not('.js-header-shortcode').first();

		// We need to have returning function even when header is disabled
		if(!$header.length) {
			return function() {
				return 0;
			};
		}

	    var $toolbar = $header.find( '.mk-header-toolbar' ),
			config = $header.data(),
			hasToolbar = $toolbar.length,
			toolbarHeight = (hasToolbar) ? $toolbar.height() : 0,
			isVertical = (config.headerStyle === 4),
			headerHeight = (isVertical) ? 0 : config.height;

        var type = ((typeof config.stickyOffset === 'number')   ? 'number' : false) ||
                   ((config.stickyOffset === 'header')          ? 'header' : false) ||
                                                                  'percent';

        var stickyOffset = 0;
        var setOffset = function() {

			// headerHeight = (isVertical) ? 0 : config.height;
			
	        if( type === 'number' ) {
	        	stickyOffset = config.stickyOffset;
	        }
	        else if( type === 'header' ) {
	        	stickyOffset = headerHeight + toolbarHeight + MK.val.adminbarHeight(); // add all header components here, make them 0 if needed
	        }
	        else if( type === 'percent' ) {
	        	stickyOffset = MK.val.viewportPercentHeight( parseInt(config.stickyOffset) );
	        }
        };

        setOffset();
        $(window).on('resize', setOffset);

        return function() {
        	return stickyOffset;
        };
    }());



	/**
	 * Gets header height on particular offsetY position. Use to determine logic for fullHeight, smooth scroll etc.
	 * Takes one parameter which is offset position we're interested in.
	 *
	 * @uses   MK.val.offsetHeaderHeight({offset val})
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.offsetHeaderHeight = (function() { // Closure avoids multiple DOM reads. We need to fetch header config only once.
	    var $header = $('.mk-header').not('.js-header-shortcode').first();

		// We need to have returning function even when header is disabled
		if(!$header.length) {
			return function() {
				return 0;
			};
		}

	    var $toolbar = $header.find( '.mk-header-toolbar' ),
			config = $header.data(),
			stickyHeight = config.stickyHeight,
			desktopHeight = config.height,
			mobileHeight = config.responsiveHeight,
			isTransparent = $header.hasClass( 'transparent-header' ),
			isSticky = config.stickyStyle.length,
			isStickyLazy = config.stickyStyle === 'lazy',
			isVertical = config.headerStyle === 4,
			hasToolbar = $toolbar.length,
			toolbarHeight = hasToolbar ? $toolbar.height() : 0,
			bufor = 5;

		var headerHeight = function( offset ) {
			var stickyOffset = MK.val.stickyOffset();

			if( MK.utils.isResponsiveMenuState() ) { // Header avaible only on top for mobile
				var totalHeight = mobileHeight + MK.val.adminbarHeight();
				if( offset <= totalHeight ) return totalHeight; 
				else return MK.val.adminbarHeight();
			} else {
				if( offset <= stickyOffset ) { 
					if( isVertical ) { 
						if( hasToolbar ) { return toolbarHeight + MK.val.adminbarHeight(); }
						else { return MK.val.adminbarHeight(); }
					}
					else if( isTransparent ) { return MK.val.adminbarHeight(); }
					else { return desktopHeight + MK.val.adminbarHeight(); } // For any other return regular desktop height
				}
				else if( offset > stickyOffset) { 
					if( isVertical ) { return MK.val.adminbarHeight(); }
					else if( ! isSticky ) { return MK.val.adminbarHeight(); }
					else if( isStickyLazy ) { return MK.val.adminbarHeight(); }	
					else if( isSticky ) { return stickyHeight + MK.val.adminbarHeight(); }
				}				
			}
			// default to 0 to prevent errors ( need to return number )
			// Anyway make sure all scenarios are covered in IFs
			return 0;
		};

		return function( offset ) {
			return headerHeight( offset - MK.val.adminbarHeight());
		};
	})();


	/**
	 * Gets current offset of given element (passed as object or DOM reference) from top or bottom (default to top) 
	 * of screen  with possible threshold (default to 0)
	 * 
	 * @uses   MK.val.dynamicOffset({obj reference}, {'top'|'bottom'}, {threshold val})
	 * @param  {string|object}
	 * @param  {string}
	 * @param  {number}
	 * @return {number}
	 */
	MK.val.dynamicOffset = function( el, position, threshold ) {
        var $window = $( window ),
	        $el = $( el ),
	        pos = position || 'top',
	        thr = threshold || 0,
	        container = document.getElementById( 'wrapper' ),
	        currentPos = 0;

	    var offset = 0,
	    	winH = 0,
	    	rect = 0,
	    	x = 0;

	    var update = function() {
	    	winH = $window.height();
	    	rect = $el[ 0 ].getBoundingClientRect();
    		offset = (rect.top + MK.val.scroll());
    		x = (pos === 'top') ? MK.val.offsetHeaderHeight( offset ) : winH + ( rect.height - thr );
	    	currentPos = offset - x - 1;
	    };

        update();
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );

        return function() {
        	return currentPos;
        };
	};

	/**
	 * Gets current height of given element (passed as object or DOM reference)
	 * 
	 * @uses   MK.val.dynamicHeight({obj reference})
	 * @param  {string|object}
	 * @return {number}
	 */
	MK.val.dynamicHeight = function( el ) {
        var $window = $( window ),
	        $el = $( el ),
	        container = document.getElementById( 'wrapper' ),
	        currentHeight = 0;

	    var update = function() {
	    	currentHeight = $el.outerHeight();
	    };

        update();
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );

        return function() {
        	return currentHeight;
        };
	};

})(jQuery);
MK.component.EdgeSlider = function( el ) {
    var self = this,
        $this = $( el ), 
        $window = $(window),
        $wrapper = $this.parent(),
        config = $this.data( 'edgeslider-config' );

    var callbacks = { 

        onInitialize : function( slides ) {
            self.$slides = $( slides );
            
            self.slideContents = $.map( self.$slides, function( slide ) {
                var $slide = $( slide ),
                    title = $slide.find('.edge-slide-content .edge-title').first().text(),
                    skin = $slide.attr("data-header-skin"),
                    image = $slide.find('.section-image').css('background-image') || 
                            $slide.find('.video-section-touch').css('background-image'),
                    bgColor = $slide.find('.section-image').css('background-color');

                return {
                    skin: skin,
                    title: title,
                    image: image,
                    bgColor: bgColor
                };
            });

            setNavigationContent( 1, self.$slides.length - 1 );
            setSkin( 0 );

            setTimeout( function() {
                $( '.edge-slider-loading' ).fadeOut( '100' );
            }, 1000 );
        },

        onAfterSlide : function( id ) {
            var currentId = id;

            var len = self.$slides.length,
                nextId = ( currentId + 1 === len ) ? 0 : currentId + 1,
                prevId = ( currentId - 1 === -1 ) ? len - 1 : currentId - 1; 

            setNavigationContent( nextId, prevId );
            setSkin( id );
        }
    };


    var $nav = $( config.nav ),
        $prev = $nav.find( '.edge-nav-prev' ),
        $prevTitle = $prev.find( '.edge-nav-item-caption' ),
        $prevBg = $prev.find('.edge-nav-bg'),
        $next = $nav.find( '.edge-nav-next' ),
        $nextTitle = $next.find( '.edge-nav-item-caption' ),
        $nextBg = $next.find('.edge-nav-bg');

    var setNavigationContent = function( nextId, prevId ) {

        if(self.slideContents[ prevId ]) {
            $prevTitle.text( self.slideContents[ prevId ].title );
            $prevBg.css( 'background', 
                self.slideContents[ prevId ].image !== 'none' ? 
                    self.slideContents[ prevId ].image :
                    self.slideContents[ prevId ].bgColor );
        }

        if(self.slideContents[ nextId ]) {
            $nextTitle.text( self.slideContents[ nextId ].title ); 
            $nextBg.css( 'background', 
                self.slideContents[ nextId ].image !== 'none' ? 
                    self.slideContents[ nextId ].image :
                    self.slideContents[ nextId ].bgColor );
        }
    };


    var $navBtns = $nav.find( 'a' ),  
        $pagination = $( '.swiper-pagination' ),
        $skipBtn = $( '.edge-skip-slider' ),
        currentSkin = null;

    var setSkin = function( id ) {  
        currentSkin = self.slideContents[ id ].skin;

        $navBtns.attr('data-skin', currentSkin);
        $pagination.attr('data-skin', currentSkin);
        $skipBtn.attr('data-skin', currentSkin); 

        if( self.config.firstEl ) {
            MK.utils.eventManager.publish( 'firstElSkinChange', currentSkin );
        }
    };


    var currentPoint;
    var $opacityLayer = $this.find('.edge-slide-content');
    var winH = null;
    var opacity = null;
    var offset = null;

    var onResize = function onResize() {
        var height = $wrapper.height();
        $this.height( height );

        var width = $wrapper.width();
        $this.width( width );

        winH = $window.height();
        offset = $this.offset().top;

        if(MK.utils.isResponsiveMenuState()) {
            $this.css({
                '-webkit-transform': 0,
                '-moz-transform': 0,
                '-ms-transform': 0,
                '-o-transform': 0,
                'transform': 0,
                'position': 'absolute'
            });
            $opacityLayer.css({
                'opacity': 1
            });
        } else {
            onScroll();
        }
    };

    var onScroll = function onScroll() {
        currentPoint = - MK.val.scroll();

        if( offset + currentPoint <= 0 ) {
            opacity = 1 + ((offset + currentPoint) / winH) * 2;
            opacity = Math.min(opacity, 1);
            opacity = Math.max(opacity, 0);

            $opacityLayer.css({
                opacity: opacity
            });
        }

        $this.css({
            '-webkit-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-moz-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-ms-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-o-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'position': 'fixed'
        });  
    };

    onResize();
    $window.on('load resize', onResize);
    window.addResizeListener( $wrapper.get(0), onResize );

    onScroll();
    $window.on('scroll', function() {
        if(MK.utils.isResponsiveMenuState()) return;
        window.requestAnimationFrame(onScroll);
    });

    this.el = el;
    this.config = $.extend( config, callbacks );
    this.slideContents = null; // cache slide contents
};

MK.component.EdgeSlider.prototype = {
    init : function() {
        // Inherit from Slider. add prototypes if needed
        var slider = new MK.ui.Slider( this.el, this.config );
        slider.init();
    }
};
var val = MK.val;

MK.component.FullHeight = function( el ) {
    var $window = $( window ),
        $this = $( el ),
        container = document.getElementById( 'wrapper' ),
        winH = null,
        height = null,
        update_count = 0,
        testing = getUrlParameter('testing'),
        offset = null;
    var update = function() {

        if(update_count == 0) {
            winH = $window.height();
            offset = $this.offset().top;
            height = winH - val.offsetHeaderHeight( offset );
            // set
            $this.css( 'min-height', height );
            if(testing !== undefined )
            update_count++;
        }

    };

    // TODO remove scroll listener by dynamic offset reader
    var init = function() {
        update();
        $window.on( 'resize', update );
        $window.on( 'scroll', update );
        window.addResizeListener( container, update );
    };

    return {
        init : init
    };
};



var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

(function($) {
    'use strict';

    MK.component.Grid = function( el ) {
    	var $container = $(el);
    	var config = $.parseJSON( $container.data( 'grid-config' ) );

        var init = function init(){
			create();
        };

        // // Remove el hidden without adding proper class
        var removeOddlyHidden = function removeOddlyHidden() {
            var $item = $(this);
            var isHidden = ($item.css('display') === 'none');
            if(isHidden) $item.remove();
        };

        var create = function create() {

	        function grid(item) { 
                var selector = (typeof item === 'string') ? item : config.item;

                // Prevent plugin breaking when feeding it with hidden elements
                var $items = $(selector);
                $items.each( removeOddlyHidden );

	            minigrid({
		            container: el,
		            item: selector,
		            gutter: 0 
	            });
	        }

	        grid(); 

            $(window).off('resize', grid);
            $(window).on('resize', grid);

            MK.utils.eventManager.subscribe('item-expanded', grid);
            MK.utils.eventManager.subscribe('ajaxLoaded', grid);
        };
 

        return {
         	init : init
        };
    };

})(jQuery);








(function ($) {
    'use strict';

    MK.component.Masonry = function (el) {
        var $container = $(el);
        var $window = $(window);
        var config = $container.data('masonry-config');
        var $masonryItems = $container.find(config.item);
        var cols = config.cols || 8;
        var $filterItems = null; // assign only when apply filter
        var wall = null;

        var init = function init() {
//        	MK.core.loadDependencies([ MK.core.path.plugins + 'freewall.js' ], onDepLoad);
            onDepLoad();
        };

        var onDepLoad = function onDepLoad() {
            
            masonry();

            // Events
            $window.on('resize', onResize);
            MK.utils.eventManager.subscribe('ajaxLoaded', onPostAddition);
        };

        var masonry = function masonry() {
            var newCols;
            if (window.matchMedia('(max-width:600px)').matches)
                newCols = 2;
            else if (window.matchMedia('(max-width:850px)').matches)
                newCols = 4;
            else
                newCols = cols;

            var colW = $container.width() / newCols;

            wall = new Freewall(config.container);

            // We need to pass settings to a plugin via reset method. Strange but works fine.
            wall.reset({
                selector: config.item + ':not(.is-hidden)',
                gutterX: 0, // set default gutter to 0 and again - apply margins to item holders in css
                gutterY: 0,
                cellW: colW,
                cellH: colW
            });

            wall.fillHoles();
            wall.fitWidth();

            $masonryItems.each(function () {
                $(this).data('loaded', true);
            });
        };


        // Clear attributes after the plugin. It's API method dosn't handle it properly
        var destroyContainer = function destroyContainer() {
            $container.removeAttr('style')
                    .removeData('wall-height')
                    .removeData('wall-width')
                    .removeData('min-width')
                    .removeData('total-col')
                    .removeData('total-row')
                    .removeAttr('data-wall-height')
                    .removeAttr('data-wall-width')
                    .removeAttr('data-min-width')
                    .removeAttr('data-total-col')
                    .removeAttr('data-total-row');
        };

        var destroyItem = function destroyItem() {
            var $item = $(this);
            $item.removeAttr('style')
                    .removeData('delay')
                    .removeData('height')
                    .removeData('width')
                    .removeData('state')
                    .removeAttr('data-delay')
                    .removeAttr('data-height')
                    .removeAttr('data-width')
                    .removeAttr('data-state');
        };

        var destroyAll = function destroyAll() {
            if (!wall)
                return;
            wall.destroy(); // API destroy
            destroyContainer();
            $masonryItems.each(destroyItem); // run our deeper destroy
        };

        var onResize = function onResize() {
            requestAnimationFrame(resize);
        };

        var refresh = function refresh() {
            if (!wall)
                return;
            setTimeout(wall.fitWidth.bind(wall), 5);
        };

        var resize = function resize() {
            destroyAll();
            masonry();
        };

        var onPostAddition = function onPostAddition() {
            $masonryItems = $container.find(config.item);

            $masonryItems.each(function () {
                var $item = $(this),
                        isLoaded = $item.data('loaded');

                if (!isLoaded)
                    $item.css('visibility', 'hidden');
            });


            $container.imagesLoaded().then(function () {
                destroyAll();
                masonry();
            });
        };

        return {
            init: init
        };
    };

}(jQuery));

var val = MK.val,
    utils = MK.utils;

mk_smooth_scroll = 'true';  // *Edited - Added*

MK.component.Parallax = function( el ) {
    var self = this,
        $this = $( el ),
        obj = $this[0],
        $window = $( window ),
        container = document.getElementById( 'wrapper' ),
        config = $this.data( 'parallax-config' ),
        $holder = $( config.holder ),
        headerHeight = null,
        offset = null,
        elHeight = null,
        ticking = false,
        isMobile = null;


    var clientRect = null;

    var update = function() {
        // Clear styles to check for natural styles
        // then apply position and size
        obj.style.transform = null;
        obj.style.top = null;
        obj.style.bottom = null;

        isMobile = MK.utils.isMobile();

        if( isMobile ) {
            $this.css( 'height', '' );
            return;
        }

        clientRect = $this[ 0 ].getBoundingClientRect();
        offset = clientRect.top;
        elHeight = clientRect.height;
        headerHeight = val.offsetHeaderHeight( offset );
        offset = offset - headerHeight + val.scroll(); 

        setPosition(); 
        setSize( ); 
    };


    var h = 0,
        winH = 0,
        proportion = 0,
        height = 0;

    // Position and background attachement should me moved to CSS but we repair it high specificity here as styles are not reliable currently
    var setSize = function() {
        $this.css( 'height', '' );
        winH = $window.height() - headerHeight;
        h = obj.getBoundingClientRect().height; 

        if( config.speed <= 1 && config.speed > 0 ) {
            if( offset === 0 ) {
                $this.css({
                    backgroundAttachment: 'scroll'
                });
            } else {
                $this.css({
                    height : h + ( (winH - h) * config.speed ),
                    backgroundAttachment: 'scroll'
                }); 
            }

        } else if ( config.speed > 1 && h <= winH ) {
            $this.css({
                // good for full heights - 2 because it's viewable by 2 screen heights
                height: ( winH  +  ( ( winH * config.speed ) - winH ) * 2 ),  
                top: -( ( winH * config.speed ) - winH ),
                backgroundAttachment: 'scroll'
            }); 

        } else if ( config.speed > 1 && h > winH ) {
            proportion = h / winH;
            height = ( winH  +  ( ( winH * config.speed ) - winH ) * (1 + proportion) );

            $this.css({
                height: height,
                top: -( height - (winH * config.speed) ),
                backgroundAttachment: 'scroll'
            }); 

        } else if ( config.speed < 0 && h >= winH ) {
            height = h * (1  - config.speed);
            $this.css({
                height: height + (height - h),
                top: h - height,
                backgroundAttachment: 'scroll'
            });   

        } else if ( config.speed < 0 && h < winH ) {
            // candidate to change
            var display = (winH + h) / winH;
            height = h * -config.speed * display;
            $this.css({
                height: h + (height * 2),
                top: -height,
                backgroundAttachment: 'scroll'
            });                 
        }
    };


    var currentPoint = null,
        progressVal = null,
        startPoint = null,
        endPoint = null,
        $opacityLayer = config.opacity ? $this.find( config.opacity ) : null,
        scrollY = null;

    var setPosition = function() {
        startPoint = offset - winH;
        endPoint = offset + elHeight + winH - headerHeight;
        scrollY = val.scroll();

        if( scrollY < startPoint || scrollY > endPoint ) { 
            ticking = false;
            return; 
        }

        currentPoint = (( -offset + scrollY ) * config.speed);

        $this.css({
            '-webkit-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-moz-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-ms-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            '-o-transform': 'translateY(' + currentPoint + 'px) translateZ(0)',
            'transform': 'translateY(' + currentPoint + 'px) translateZ(0)'
        });  

        ticking = false;
    };


    var requestTick = function() {
        if( !ticking && !isMobile ) {
            window.requestAnimationFrame( setPosition );
            ticking = true;
        }
    };


    var init = function() { 
        // Disable scroll effects when smooth scroll is disabled
        if( mk_smooth_scroll === 'false' ) { return; }

        update();
        setTimeout(update, 100);
        $window.on( 'load', update );
        $window.on( 'resize', update );
        window.addResizeListener( container, update );
        
        $window.on( 'scroll', requestTick );
    };
    

    return {
        init : init
    };
};
/**
 * Entry point of application. Runs all components
 */
$( window ).on( 'load', function() {
    MK.core.initAll( document );
});}(jQuery))