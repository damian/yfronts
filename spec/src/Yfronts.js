$(document).ready(function() {

  (function(exports, $) {

    "use strict";

    var defaults = {
      toolbar: "<div class='toolbar'>\
          <ul>\
            <li><a class='bold' href='#' tabindex='-1'>B</a></li>\
            <li><a class='italic' href='#' tabindex='-1'>I</a></li>\
            <li><a class='underline' href='#' tabindex='-1'>U</a></li>\
          </ul>\
        </div>\
      "
    };

    // Private variables
    var $html = $('html')
      , $body = $(document.body)
      , hasToolbar = false
      , $toolbar
      ;

    /**
     * Instantiates a new instance of Yfronts on the given element
     *
     * @class Yfronts
     * @constructor
     * @param {DOMNode} A Node
     * @param {Object} A JavaScript object of configuration options
     */
    function Yfronts(el, options) {
      this.$input = $(el);
      this.options = $.extend({}, defaults, options);
      var _this = this;

      // Setup event handlers
      this.$input.on('focus', function(e) {
        $.proxy(_this.handleFocus(e), _this);
      });
    }

    Yfronts.prototype = {
      /**
       * Initializes the toolbar by attaching it to the body and setting up its event handlers
       *
       * @method initToolbar
       */
      initToolbar : function() {
        $toolbar = $(this.options.toolbar).prependTo($body);
        hasToolbar = true;
        var _this = this;

        $toolbar.on('click', 'a', function(e) {
          $.proxy(_this.handleFormat(e), _this);
        });
      },

      /**
       * Callback function for when a contenteditable region is focussed
       *
       * @method handleFocus
       * @param {EventObject} An event object
       */
      handleFocus : function(e) {
        var _this = this;
        $body.addClass('has-toolbar');

        if (!hasToolbar) this.initToolbar();

        // Event handler for
        $html.on('click focusin', function(e) {
          $.proxy(_this.handleBlur(e), _this);
        });
      },

      /**
       * Callback function for when a contenteditable region is blurred
       *
       * @method handleFocus
       * @param {EventObject} An event object
       */
      handleBlur : function(e) {
        var $target = $(e.target)
          , isFromToolbar = $target.closest('.toolbar')
          , isFromEditable = $target.closest('[contenteditable]')
          ;

        if (isFromToolbar.length || isFromEditable.length) return;

        // Unbind the body click handler
        $html.off('click focusin');
        $body.removeClass('has-toolbar');
      },

      /**
       * Proxy function for all formatting actions contained within the toolbar
       *
       * @method handleFormat
       * @param {EventObject} An event object
       */
      handleFormat : function(e) {
        e.preventDefault();

        var $btn = $(e.target)
          , btnClass = $btn.attr('class')
          , fn = this['cmd_' + btnClass]
          ;

        if (fn) {
          var el = fn.call(this);
          this.setUserSelection(el);
        } else {
          document.execCommand(btnClass, false, true);
        }
      },

      setUserSelection : function(el) {
        var sel = document.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);

        return range;
      },

      cmd_bold : function() {
        var range = this.selectionRange()
          , tag = 'strong'
          , node = document.createElement(tag)
          ;

        if (range.startContainer.parentNode.nodeName.toLowerCase() != tag) {
          range.surroundContents(node);
        } else {
          // Undo strong
          console.log('Undo parent tag');
          document.execCommand('removeFormat', false, true);
        }

        return node;
      },

      cmd_italic : function() {
        var range = this.selectionRange()
          , node = document.createElement('em')
          ;

        range.surroundContents(node);

        return node;
      },

      selectionRange : function() {
        return document.getSelection().getRangeAt(0);
      }
    };

    exports.Yfronts = Yfronts;

  })(window, jQuery);

  var $editable = $('[contenteditable]').first();
  var yf = new Yfronts($editable);
  $editable.data('yfronts', yf);
});
