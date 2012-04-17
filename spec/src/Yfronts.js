(function(exports, $) {

  var defaults = {
    toolbar: "\
      <div class='toolbar'>\
        <ul>\
          <li><a class='bold' href='#'>B</a></li>\
          <li><a class='italic' href='#'>I</a></li>\
          <li><a class='underline' href='#'>U</a></li>\
        </ul>\
      </div>\
    "
  };

  Yfronts.hasToolbar = false;
  Yfronts.$toolbar = null;

  function Yfronts(el, options) {
    this.$body = $(document.body);
    this.$input = $(el);
    this.options = $.extend({}, defaults, options);

    // Setup event handlers
    var _this = this;
    this.$input.on('focus', function(e) {
      $.proxy(_this.handleFocus(e), _this);
    });
  };

  Yfronts.prototype = {
    handleFocus : function(e) {
      this.$body.addClass('has-toolbar');

      if (Yfronts.hasToolbar) {
        Yfronts.$toolbar.removeClass('hidden');
      } else {
        this.setupToolbar();
      }
      //this.handleBlur();
    },
    setupToolbar : function() {
      Yfronts.$toolbar = $(this.options.toolbar).prependTo(this.$body);
      Yfronts.hasToolbar = true;
      var _this = this;

      Yfronts.$toolbar.on('click', 'a', function(e) {
        $.proxy(_this.handleFormat(e), _this);
      });
    },
    handleFormat : function(e) {
      e.preventDefault();

      var $btn = $(e.target)
        , btnClass = $btn.attr('class')
        ;

      document.execCommand($btn.attr('class'), false, true);
//    var selection = document.getSelection().toString();
//    console.log(selection);
//    console.log(selection.length);
//    this['handleFormat' + btnClass.capitalize()](selection);
    },

    handleFormatBold : function(selection) {
      document.execCommand('inserthtml', false, '<strong>' + selection + '</strong>');
    },

    handleFormatItalic : function(selection) {
      document.execCommand('inserthtml', false, '<em>' + selection + '</em>');
    },

    handleBlur : function() {
      var _this = this;
      $('body').on('click focusin', function(e) {
        var $target = $(e.target)
          , inToolbar = $target.closest('.toolbar').length
          , inContentEditable = $target.closest('div[contenteditable]').length
          ;

        if (inToolbar || inContentEditable) return;
        Yfronts.$toolbar.addClass('hidden');
        $(document.body).removeClass('has-toolbar');
      });
    }
  };

  exports.Yfronts = Yfronts;

})(window, jQuery);


//$(document).ready(function() {
//  $('[contenteditable]').on('focus', function() {
//    var $this = $(this)
//      , hasY = $this.data('yfronts')
//      ;
//
//    if (!hasY) {
//      var yf = new Yfronts(this);
//      $this.data('yfronts', yf);
//      //$this.trigger('focus');
//    }
//  });
//});

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
