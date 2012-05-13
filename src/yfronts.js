(function(exports, $) {

  "use strict";

  var defaults = {
    toolbar: "<div class='toolbar'>\
        <ul>\
          <li><a data-cmd='bold' href='#' tabindex='-1'>B</a></li>\
          <li><a data-cmd='italic' href='#' tabindex='-1'>I</a></li>\
          <li><a data-cmd='underline' href='#' tabindex='-1'>U</a></li>\
        </ul>\
        <ul class='headers'>\
          <li><a data-cmd='h2' href='#' tabindex='-1'>H2</a></li>\
          <li><a data-cmd='h3' href='#' tabindex='-1'>H3</a></li>\
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
      this.render();
      var _this = this;

      $toolbar.on('click', 'a', function(e) {
        $.proxy(_this.handleFormat(e), _this);
      });
    },

    /**
     * Append the toolbar to the body and set hasToolbar flag
     *
     * @method render
     */
    render : function() {
      $toolbar = $(this.options.toolbar).prependTo($body);
      hasToolbar = true;
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
        , btnCommand = $btn.attr('data-cmd')
        , fn = this['cmd_' + btnCommand]
        ;

      if (fn) {
        var el = fn.call(this);
      } else {
        this.exec(btnCommand);
      }
    },

    /**
     * Proxy to execCommand when the focussed region is contentEditable
     *
     * @method exec
     * @param {String} The command name
     * @param {String} The command argument
     */
    exec : function(type, arg) {
      document.execCommand(type, false, arg);
    },

    /**
     * Formatting for header level 2 elements.
     *
     * Ensures that the element is wrapped with paragaph tags when unformatted
     *
     * @method cmd_h2
     */
    cmd_h2 : function() {
      var formatType = 'h2';
      if (this.commandType('formatBlock') === formatType) {
        formatType = 'p';
      }
      this.exec('formatBlock', formatType);
    },

    /**
     * Formatting for header level 2 elements
     *
     * Ensures that the element is wrapped with paragaph tags when unformatted
     *
     * @method cmd_h3
     */
    cmd_h3 : function() {
      var formatType = 'h3';
      if (this.commandType('formatBlock') === formatType) {
        formatType = 'p';
      }
      this.exec('formatBlock', formatType);
    },

    /**
     * Creates a selection object from the passed in element
     *
     * The user will see that element highlighted
     *
     * @method setUserSelection
     * @param {DOMNode} The element being selected
     * @return {Range} The Range object that was created
     */
    setUserSelection : function(el) {
      var sel = document.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);

      return range;
    },

    /**
     * Returns the command argument for the currently selected element
     *
     * @method commandType
     * @param {String} The command name
     */
    commandType : function(cmd) {
      return document.queryCommandValue(cmd);
    },

    /**
     * Wraps or unwraps the current selection in strong tags
     *
     * Ensures the users selection is still highlighted
     *
     * @method cmd_bold
     */
    cmd_bold : function() {
      var range = this.selectionRange()
        , tag = 'strong'
        , node = document.createElement(tag)
        ;

      if (range.startContainer.parentNode.nodeName.toLowerCase() !== tag) {
        range.surroundContents(node);
      } else {
        // Undo strong
        var strong = range.startContainer.parentNode;
        node = this.unwrap(strong)[0];
      }

      this.setUserSelection(node);
    },

    /**
     * Wraps or unwraps the current selection in em tags
     *
     * Ensures the users selection is still highlighted
     *
     * @method cmd_italic
     */
    cmd_italic : function() {
      var range = this.selectionRange()
        , node = document.createElement('em')
        ;

      range.surroundContents(node);

      this.setUserSelection(node);
    },

    /**
     * Retrieve the first user selection Range object
     *
     * @method selectionRange
     * @return {Range} The first Range object
     */
    selectionRange : function() {
      return document.getSelection().getRangeAt(0);
    },

    /**
     * Utility function to unwrap the passed in element
     *
     * TODO: Use native functionality to achieve this
     *
     * @method unwrap
     */
    unwrap : function(el) {
      return $(el).contents().unwrap();
    }
  };

  exports.Yfronts = Yfronts;

})(window, jQuery);

