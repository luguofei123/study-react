// Umbrella JS  http://umbrellajs.com/
// -----------
// Small, lightweight jQuery alternative
// @author Francisco Presencia Fandos https://francisco.io/
// @inspiration http://youmightnotneedjquery.com/

// Initialize the library
var u = function (parameter, context) {
  // Make it an instance of u() to avoid needing 'new' as in 'new u()' and just
  // use 'u().bla();'.
  // @reference http://stackoverflow.com/q/24019863
  // @reference http://stackoverflow.com/q/8875878
  if (!(this instanceof u)) {
    return new u(parameter, context);
  }

  // No need to further processing it if it's already an instance
  if (parameter instanceof u) {
    return parameter;
  }

  // Parse it as a CSS selector if it's a string
  if (typeof parameter === 'string') {
    parameter = this.select(parameter, context);
  }

  // If we're referring a specific node as in on('click', function(){ u(this) })
  // or the select() function returned a single node such as in '#id'
  if (parameter && parameter.nodeName) {
    parameter = [parameter];
  }

  // Convert to an array, since there are many 'array-like' stuff in js-land
  this.nodes = this.slice(parameter);
};

// Map u(...).length to u(...).nodes.length
u.prototype = {
  get length () {
    return this.nodes.length;
  }
};

// This made the code faster, read "Initializing instance variables" in
// https://developers.google.com/speed/articles/optimizing-javascript
u.prototype.nodes = [];

// Add class(es) to the matched nodes
u.prototype.addClass = function () {
  return this.eacharg(arguments, function (el, name) {
    el.classList.add(name);
  });
};


// [INTERNAL USE ONLY]

// Normalize the arguments to an array of strings
// Allow for several class names like "a b, c" and several parameters
u.prototype.args = function (args, node, i) {
  if (typeof args === 'function') {
    args = args(node, i);
  }

  // First flatten it all to a string http://stackoverflow.com/q/22920305
  // If we try to slice a string bad things happen: ['n', 'a', 'm', 'e']
  if (typeof args !== 'string') {
    args = this.slice(args).map(this.str(node, i));
  }

  // Then convert that string to an array of not-null strings
  return args.toString().split(/[\s,]+/).filter(function (e) {
    return e.length;
  });
};


// Merge all of the nodes that the callback return into a simple array
u.prototype.array = function (callback) {
  callback = callback;
  var self = this;
  return this.nodes.reduce(function (list, node, i) {
    var val;
    if (callback) {
      val = callback.call(self, node, i);
      if (!val) val = false;
      if (typeof val === 'string') val = u(val);
      if (val instanceof u) val = val.nodes;
    } else {
      val = node.innerHTML;
    }
    return list.concat(val !== false ? val : []);
  }, []);
};

// Find the first ancestor that matches the selector for each node
u.prototype.closest = function (selector) {
  return this.map(function (node) {
    // Keep going up and up on the tree. First element is also checked
    do {
      if (u(node).is(selector)) {
        return node;
      }
    } while ((node = node.parentNode) && node !== document);
  });
};

// Loops through every node from the current call
u.prototype.each = function (callback) {
  // By doing callback.call we allow "this" to be the context for
  // the callback (see http://stackoverflow.com/q/4065353 precisely)
  this.nodes.forEach(callback.bind(this));

  return this;
};


// [INTERNAL USE ONLY]
// Loop through the combination of every node and every argument passed
u.prototype.eacharg = function (args, callback) {
  return this.each(function (node, i) {
    this.args(args, node, i).forEach(function (arg) {
      // Perform the callback for this node
      // By doing callback.call we allow "this" to be the context for
      // the callback (see http://stackoverflow.com/q/4065353 precisely)
      callback.call(this, node, arg);
    }, this);
  });
};

// .filter(selector)
// Delete all of the nodes that don't pass the selector
u.prototype.filter = function (selector) {
  // The default function if it's a CSS selector
  // Cannot change name to 'selector' since it'd mess with it inside this fn
  var callback = function (node) {
    // Make it compatible with some other browsers
    node.matches = node.matches || node.msMatchesSelector || node.webkitMatchesSelector;

    // Check if it's the same element (or any element if no selector was passed)
    return node.matches(selector || '*');
  };

  // filter() receives a function as in .filter(e => u(e).children().length)
  if (typeof selector === 'function') callback = selector;

  // filter() receives an instance of Umbrella as in .filter(u('a'))
  if (selector instanceof u) {
    callback = function (node) {
      return (selector.nodes).indexOf(node) !== -1;
    };
  }

  // Just a native filtering function for ultra-speed
  return u(this.nodes.filter(callback));
};


// Find all the nodes children of the current ones matched by a selector
u.prototype.find = function (selector) {
  return this.map(function (node) {
    return u(selector || '*', node);
  });
};

// [INTERNAL USE ONLY]
// Generate a fragment of HTML. This irons out the inconsistences
u.prototype.generate = function (html) {
  // Table elements need to be child of <table> for some f***ed up reason
  if (/^\s*<tr[> ]/.test(html)) {
    return u(document.createElement('table')).html(html).children().children().nodes;
  } else if (/^\s*<t(h|d)[> ]/.test(html)) {
    return u(document.createElement('table')).html(html).children().children().children().nodes;
  } else if (/^\s*</.test(html)) {
    return u(document.createElement('div')).html(html).children().nodes;
  } else {
    return document.createTextNode(html);
  }
};

// Find out whether the matched elements have a class or not
u.prototype.hasClass = function () {
  // Check if any of them has all of the classes
  return this.is('.' + this.args(arguments).join('.'));
};

// Check whether any of the nodes matches the selector
u.prototype.is = function (selector) {
  return this.filter(selector).length > 0;
};

// Merge all of the nodes that the callback returns
u.prototype.map = function (callback) {
  return callback ? u(this.array(callback)).unique() : this;
};

// Removes the callback to the event listener for each node
u.prototype.off = function (events, cb, cb2) {
  var cb_filter_off = (cb == null && cb2 == null);
  var sel = null;
  var cb_to_be_removed = cb;
  if (typeof cb === 'string') {
    sel = cb;
    cb_to_be_removed = cb2;
  }

  return this.eacharg(events, function (node, event) {
    u(node._e ? node._e[event] : []).each(function (ref) {
      if (cb_filter_off || (ref.orig_callback === cb_to_be_removed && ref.selector === sel)) {
        node.removeEventListener(event, ref.callback);
      }
    });
  });
};


// Attach a callback to the specified events
u.prototype.on = function (events, cb, cb2) {
  function overWriteCurrent (e, value) {
    try {
      Object.defineProperty(e, 'currentTarget', {
        value: value,
        configurable: true
      });
    } catch (err) { }
  }

  var selector = null;
  var orig_callback = cb;
  if (typeof cb === 'string') {
    selector = cb;
    orig_callback = cb2;
    cb = function (e) {
      var args = arguments;
      u(e.currentTarget)
        .find(selector)
        .each(function (target) {
          // The event is triggered either in the correct node, or a child
          // of the node that we are interested in
          // Note: .contains() will also check itself (besides children)
          if (!target.contains(e.target)) return;

          // If e.g. a child of a link was clicked, but we are listening
          // to the link, this will make the currentTarget the link itself,
          // so it's the "delegated" element instead of the root target. It
          // makes u('.render a').on('click') and u('.render').on('click', 'a')
          // to have the same currentTarget (the 'a')
          var curr = e.currentTarget;
          overWriteCurrent(e, target);
          cb2.apply(target, args);
          // Need to undo it afterwards, in case this event is reused in another
          // callback since otherwise u(e.currentTarget) above would break
          overWriteCurrent(e, curr);
        });
    };
  }

  var callback = function (e) {
    return cb.apply(this, [e].concat(e.detail || []));
  };

  return this.eacharg(events, function (node, event) {
    node.addEventListener(event, callback);

    // Store it so we can dereference it with `.off()` later on
    node._e = node._e || {};
    node._e[event] = node._e[event] || [];
    node._e[event].push({
      callback: callback,
      orig_callback: orig_callback,
      selector: selector
    });
  });
};

// Delete the matched nodes from the DOM
u.prototype.remove = function () {
  // Loop through all the nodes
  return this.each(function (node) {
    // Perform the removal only if the node has a parent
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
};


// Removes a class from all of the matched nodes
u.prototype.removeClass = function () {
  // Loop the combination of each node with each argument
  return this.eacharg(arguments, function (el, name) {
    // Remove the class using the native method
    el.classList.remove(name);
  });
};

// Scroll to the first matched element
u.prototype.scroll = function () {
  this.nodes[0].scrollIntoView({ behavior: 'smooth' });
  return this;
};


// [INTERNAL USE ONLY]
// Select the adecuate part from the context
u.prototype.select = function (parameter, context) {
  // Allow for spaces before or after
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (/^</.test(parameter)) {
    return u().generate(parameter);
  }

  return (context || document).querySelectorAll(parameter);
};

// Find the size of the first matched element
u.prototype.size = function () {
  let size = this.nodes[0].getBoundingClientRect();
  size.clientWidth = this.nodes[0].clientWidth
  size.clientHeight = this.nodes[0].clientHeight
  return size
};


// [INTERNAL USE ONLY]

// Force it to be an array AND also it clones them
// http://toddmotto.com/a-comprehensive-dive-into-nodelists-arrays-converting-nodelists-and-understanding-the-dom/
u.prototype.slice = function (pseudo) {
  // Check that it's not a valid object
  if (!pseudo ||
    pseudo.length === 0 ||
    typeof pseudo === 'string' ||
    pseudo.toString() === '[object Function]') return [];

  // Accept also a u() object (that has .nodes)
  return pseudo.length ? [].slice.call(pseudo.nodes || pseudo) : [pseudo];
};

// Create a string from different things
u.prototype.str = function (node, i) {
  return function (arg) {
    // Call the function with the corresponding nodes
    if (typeof arg === 'function') {
      return arg.call(this, node, i);
    }

    // From an array or other 'weird' things
    return arg.toString();
  };
};
// Set or retrieve the text content from the matched node(s)
u.prototype.text = function (text) {
  // Needs to check undefined as it might be ""
  if (text === undefined) {
    return this.first().textContent || '';
  }

  // If we're attempting to set some text
  // Loop through all the nodes
  return this.each(function (node) {
    // Set the text content to the node
    node.textContent = text;
  });
};

// Call an event manually on all the nodes
u.prototype.trigger = function (events) {
  var data = this.slice(arguments).slice(1);

  return this.eacharg(events, function (node, event) {
    var ev;

    // Allow the event to bubble up and to be cancelable (as default)
    var opts = { bubbles: true, cancelable: true, detail: data };

    try {
      // Accept different types of event names or an event itself
      ev = new window.CustomEvent(event, opts);
    } catch (e) {
      ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(event, true, true, data);
    }

    node.dispatchEvent(ev);
  });
};

// [INTERNAL USE ONLY]

// Removed duplicated nodes, used for some specific methods
u.prototype.unique = function () {
  return u(this.nodes.reduce(function (clean, node) {
    var istruthy = node !== null && node !== undefined && node !== false;
    return (istruthy && clean.indexOf(node) === -1) ? clean.concat(node) : clean;
  }, []));
};

// [INTERNAL USE ONLY]

// Take the arguments and a couple of callback to handle the getter/setter pairs
// such as: .css('a'), .css('a', 'b'), .css({ a: 'b' })
u.prototype.pairs = function (name, value, get, set) {
  // Convert it into a plain object if it is not
  if (typeof value !== 'undefined') {
    var nm = name;
    name = {};
    name[nm] = value;
  }

  if (typeof name === 'object') {
    // Set the value of each one, for each of the { prop: value } pairs
    return this.each(function (node, i) {
      for (var key in name) {
        if (typeof name[key] === 'function') {
          set(node, key, name[key](node, i));
        } else {
          set(node, key, name[key]);
        }
      }
    });
  }

  // Return the style of the first one
  return this.length ? get(this.first(), name) : '';
};

// Handle attributes for the matched elements
u.prototype.attr = function (name, value, data) {
  data = data ? 'data-' : '';

  // This will handle those elements that can accept a pair with these footprints:
  // .attr('a'), .attr('a', 'b'), .attr({ a: 'b' })
  return this.pairs(name, value, function (node, name) {
    return node.getAttribute(data + name);
  }, function (node, name, value) {
    if (value) {
      node.setAttribute(data + name, value);
    } else {
      node.removeAttribute(data + name);
    }
  });
};
// Export it for webpack
// if (typeof module === 'object' && module.exports) {
//   // Avoid breaking it for `import { u } from ...`. Add `import u from ...`
//   module.exports = u;
//   module.exports.u = u;
// }
export default u