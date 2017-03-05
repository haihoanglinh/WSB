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