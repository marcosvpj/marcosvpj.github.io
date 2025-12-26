/**
 * Sets up Justified Gallery.
 */
// if (!!$.prototype.justifiedGallery) {
//   var options = {
//     rowHeight: 140,
//     margins: 4,
//     lastRow: "justify"
//   };
//   $(".article-gallery").justifiedGallery(options);
// }

function DOMContentLoaded() {
  "use strict";

  var ael = 'addEventListener', rel = 'removeEventListener', aev = 'attachEvent', dev = 'detachEvent';
  var alreadyRun = false,
    funcs = arguments; // for use in the idempotent function `ready()`, defined later.

  function microtime() { return + new Date() } // new Date().valueOf();

  /* The vast majority of browsers currently in use now support both addEventListener
     and DOMContentLoaded. However, 2% is still a significant portion of the web, and
     graceful degradation is still the best design approach.

     `document.readyState === 'complete'` is functionally equivalent to `window.onload`.
     The events fire within a few tenths of a second, and reported correctly in every
     browser that was tested, including IE6. But IE6 to 10 did not correctly return the other
     readyState values as per the spec:
     In IE6-10, readyState was sometimes 'interactive', even when the DOM wasn't accessible,
     so it's safe to assume that listening to the `onreadystatechange` event
     in legacy browsers is unstable. Should readyState be undefined, accessing undefined properties
     of a defined object (document) will not throw.

     The following statement checks for IE < 11 via conditional compilation.
     `@_jscript_version` is a special String variable defined only in IE conditional comments,
     which themselves only appear as regular comments to other browsers.
     Browsers not named IE interpret the following code as
     `Number( new Function("")() )` => `Number(undefined)` => `NaN`.
     `NaN` is neither >, <, nor = to any other value.
     Values: IE5: 5?, IE5.5: 5.5?, IE6/7: 5.6/5.7, IE8: 5.8, IE9: 9, IE10: 10,
     (IE11 older doc mode*): 11, IE11 / NOT IE: undefined
  */

  var jscript_version = Number(new Function("/*@cc_on return @_jscript_version; @*\/")());

  // check if the DOM has already loaded
  // If it has, send null as the readyTime, since we don't know when the DOM became ready.

  if (document.readyState === 'complete') { ready(null); return; } // execute ready()

  // For IE<9 poll document.documentElement.doScroll(), no further actions are needed.
  if (jscript_version < 9) { doIEScrollCheck(); return; }

  // ael: addEventListener, rel: removeEventListener, aev: attachEvent, dev: detachEvent

  if (document[ael]) {
    document[ael]("DOMContentLoaded", ready, false);

    // fallback to the universal load event in case DOMContentLoaded isn't supported.
    window[ael]("load", ready, false);
  } else
    if (aev in window) {
      window[aev]('onload', ready);
      // Old Opera has a default of window.attachEvent being falsy, so we use the in operator instead.
      // https://dev.opera.com/blog/window-event-attachevent-detachevent-script-onreadystatechange/
    } else {
      // fallback to window.onload that will always work.
      addOnload(ready);
    }

  // addOnload: Allows us to preserve any original `window.onload` handlers,
  // in ancient (prehistoric?) browsers where this is even necessary, while providing the
  // option to chain onloads, and dequeue them later.

  function addOnload(fn) {

    var prev = window.onload; // old `window.onload`, which could be set by this function, or elsewhere.

    // Here we add a function queue list to allow for dequeueing.
    // Should we have to use window.onload, `addOnload.queue` is the queue of functions
    // that we will run when when the DOM is ready.

    if (typeof addOnload.queue !== 'object') { // allow loose comparison of arrays
      addOnload.queue = [];
      if (typeof prev === 'function') {
        addOnload.queue.push(prev); // add the previously defined event handler, if any.
      }
    }

    if (typeof fn === 'function') { addOnload.queue.push(fn) } // add the new function

    window.onload = function () { // iterate through the queued functions
      for (var i = 0; i < addOnload.queue.length; i++) { addOnload.queue[i]() }
    };
  }

  // dequeueOnload: remove a queued `addOnload` function from the chain.

  function dequeueOnload(fn, all) {

    // Sort backwards through the queued functions in `addOnload.queue` (if it's defined)
    // until we find `fn`, and then remove `fn` from its place in the array.

    if (typeof addOnload.queue === 'object') { // array
      for (var i = addOnload.queue.length - 1; i >= 0; i--) { // iterate backwards
        if (fn === addOnload.queue[i]) {
          addOnload.queue.splice(i, 1); if (!all) { break }
        }
      }
    }
  }

  // ready: idempotent event handler function

  function ready(ev) {
    if (alreadyRun) { return } alreadyRun = true;

    // This time is when the DOM has loaded, or, if all else fails,
    // when it was actually possible to inference that the DOM has loaded via a 'load' event.

    var readyTime = microtime();

    detach(); // detach any event handlers

    // run the functions (`funcs` is arguments of DOMContentLoaded)
    for (var i = 0; i < funcs.length; i++) {

      var func = funcs[i];

      if (typeof func === 'function') {

        // force set `this` to `document`, for consistency.
        func.call(document, {
          'readyTime': (ev === null ? null : readyTime),
          'funcExecuteTime': microtime(),
          'currentFunction': func
        });
      }
    }
  }

  // detach: detach all the currently registered events.

  function detach() {
    if (document[rel]) {
      document[rel]("DOMContentLoaded", ready); window[rel]("load", ready);
    } else
      if (dev in window) { window[dev]("onload", ready); }
      else {
        dequeueOnload(ready);
      }
  }

  // doIEScrollCheck: poll document.documentElement.doScroll until it no longer throws.

  function doIEScrollCheck() { // for use in IE < 9 only.
    if (window.frameElement) {
      /* We're in an `iframe` or similar.
         The `document.documentElement.doScroll` technique does not work if we're not
         at the top-level (parent document).
         Attach to onload if we're in an <iframe> in IE as there's no way to tell otherwise
      */
      try { window.attachEvent("onload", ready); } catch (e) { }
      return;
    }
    // if we get here, we're not in an `iframe`.
    try {
      // when this statement no longer throws, the DOM is accessible in old IE
      document.documentElement.doScroll('left');
    } catch (error) {
      setTimeout(function () {
        (document.readyState === 'complete') ? ready() : doIEScrollCheck();
      }, 50);
      return;
    }
    ready();
  }
};
function getWidth(el) {
  var d = /^\d+(px)?$/i;
  if (window.getComputedStyle) el = parseFloat(getComputedStyle(el, null).width.replace("px", ""));
  else {
    var c = el.currentStyle.width;
    if (d.test(c)) el = parseInt(c);
    else {
      d = el.style.left;
      var e = el.runtimeStyle.left;
      el.runtimeStyle.left = el.currentStyle.left;
      el.style.left = c || 0;
      c = el.style.pixelLeft;
      el.style.left = d;
      el.runtimeStyle.left = e;
      el = c;
    }
  }
  return el
};
function toggleVisibility(el){
      if(el.style.display === "none") el.style.display = '';
      else el.style.display = "none";
}

DOMContentLoaded(function () {

  /**
   * Shows the responsive navigation menu on mobile.
   */
  var hamburger = document.querySelector("#header > #nav > ul > .icon");
  if (!!hamburger) {
    hamburger.addEventListener("click", function () {
      var element = document.querySelector("#header > #nav > ul");
      if (element.classList) {
        element.classList.toggle("responsive");
      } else {
        // For IE9
        var classes = element.className.split(" ");
        var i = classes.indexOf("responsive");

        if (i >= 0)
          classes.splice(i, 1);
        else
          classes.push("responsive");
        element.className = classes.join(" ");
      }
    });
  }

  /**
   * Controls the different versions of  the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if (!!document.querySelector(".post")) {
    var menu = document.getElementById("menu");
    var nav = document.querySelector("#menu > #nav");
    var menuIcon = document.querySelector("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if (getWidth(document.body) >= 1440) {
      menu.style.visibility = "visible";
      if (menuIcon.classList) {
        menuIcon.classList.add("active");
      } else {
        var current = menuIcon.className, found = false;
        var all = current.split(' ');
        for (var i = 0; i < all.length, !found; i++) found = all[i] === "active";
        if (!found) {
          if (current === '') menuIcon.className = "active";
          else menuIcon.className += ' ' + "active";
        }
      }
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.addEventListener("click", function () {
      if (menu.style.visibility === "hidden") {
        menu.style.visibility = "visible";
        if (menuIcon.classList) {
          menuIcon.classList.add("active");
        } else {
          var current = menuIcon.className, found = false;
          var all = current.split(' ');
          for (var i = 0; i < all.length, !found; i++) found = all[i] === "active";
          if (!found) {
            if (current === '') menuIcon.className = "active";
            else menuIcon.className += ' ' + "active";
          }
        }
      } else {
        menu.style.visibility = "hidden";
        if (menuIcon.classList)
          menuIcon.classList.remove("active");
        else
          menuIcon.className = menuIcon.className.replace(new RegExp('(^|\\b)' + "active".split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (!!menu) {
      document.addEventListener("scroll", function () {
        var rect = menu.getBoundingClientRect();
        var topDistance = rect.top + document.body.scrollTop;

        // hide only the navigation links on desktop
        if (!(nav.offsetWidth > 0 || nav.offsetHeight > 0) && topDistance < 50) {
          nav.style.display = '';
        } else if ((nav.offsetWidth > 0 || nav.offsetHeight > 0) && topDistance > 100) {
          nav.style.display = 'none';
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if (!(menuIcon.offsetWidth > 0 || menuIcon.offsetHeight > 0) && topDistance < 50) {
          document.getElementById("menu-icon-tablet").style.display = '';
          document.getElementById("top-icon-tablet").style.display = 'none';
        } else if (!(menuIcon.offsetWidth > 0 || menuIcon.offsetHeight > 0) && topDistance > 100) {
          document.getElementById("menu-icon-tablet").style.display = 'none';
          document.getElementById("top-icon-tablet").style.display = '';
        }
      }, false);
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if (!!document.getElementById("footer-post")) {
      var lastScrollTop = 0;
      document.addEventListener("scroll", function () {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

        var topDistance = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

        if (topDistance > lastScrollTop) {
          // downscroll -> show menu
          document.getElementById("footer-post").style.display = 'none';
        } else {
          // upscroll -> hide menu
          document.getElementById("footer-post").style.display = '';
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        document.getElementById("nav-footer").style.display = 'none';
        document.getElementById("toc-footer").style.display = 'none';
        document.getElementById("share-footer").style.display = 'none';

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          document.querySelector("#actions-footer > #top").style.display = 'none';
        } else if (topDistance > 100) {
          document.querySelector("#actions-footer > #top").style.display = '';
        }
      }, false);
    }
  }
});