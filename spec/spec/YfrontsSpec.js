describe("Yfronts", function() {
  var instance, $body, $toolbar;

  beforeEach(function() {
    $body = $(document.body);
    $toolbar = $body.find('.toolbar').first();
    if (!instance) {
      instance = new Yfronts($('[contenteditable]')[0]);
    }
  });

  describe("constructor", function() {
    it("should have an attribute of $input", function() {
      expect(instance.$input).toBeDefined();
    });

    it("should expect $input to have 1 element", function() {
      expect(instance.$input.length).toEqual(1);
    });

    it("should expect $input to be a jQuery object", function() {
      expect(instance.$input instanceof jQuery).toBeTruthy();
    });

    it("should have an attribute of options", function() {
      expect(instance.options).toBeDefined();
    });

    it("should expect options to be a JS object", function() {
      expect(typeof instance.options).toEqual('object');
    });
  });

  describe("event handlers", function() {
    describe("on focus", function() {

      beforeEach(function() {
        spyOn(instance, 'handleFocus').andCallThrough();
        spyOn(instance, 'initToolbar').andCallThrough();
        instance.$input.trigger('focus');
      });

      it("should call initToolbar the first time the area is focussed", function() {
        expect(instance.initToolbar).toHaveBeenCalled();
      });

      it("should ensure handleFocus is called", function() {
        expect(instance.handleFocus).toHaveBeenCalled();
      });

      it("should add a class to the body of has-toolbar", function() {
        expect($body.hasClass('has-toolbar')).toBeTruthy();
      });

      it("should not call initToolbar if the toolbar has already been initialised", function() {
        expect(instance.initToolbar).not.toHaveBeenCalled();
      });
    });

    describe("on click", function() {

      beforeEach(function() {
        spyOn(instance, 'handleBlur').andCallThrough();
        instance.$input.trigger('focus');
        $body.trigger('click');
      });

      it("should ensure handleBlur is called", function() {
        expect(instance.handleBlur).toHaveBeenCalled();
      });

      it("should remove the has-toolbar class on the body", function() {
        expect($body.hasClass('has-toolbar')).toBeFalsy();
      });
    });

    describe("on tab", function() {

      var ev;
      beforeEach(function() {
        ev = $.Event('focusin');
        ev.keyCode = 9; // Tab key
        spyOn(instance, 'handleBlur').andCallThrough();
        instance.$input.trigger('focus');
        $body.trigger(ev);
      });

      it("should ensure handleBlur is called", function() {
        expect(instance.handleBlur).toHaveBeenCalled();
      });

      it("should remove the has-toolbar class on the body", function() {
        expect($body.hasClass('has-toolbar')).toBeFalsy();
      });
    });
  });

  describe("content formatting", function() {
    var ev;

    beforeEach(function() {
      ev = $.Event('click');

      // Spies
      spyOn(instance, 'handleFormat').andCallThrough();
      spyOn(ev, 'preventDefault').andCallThrough();
      spyOn(instance, 'cmd_bold').andCallThrough();

      instance.$input.trigger('focus'); // Ensure the toolbar is shown
      var text = instance.$input.find('p')[0];
      instance.setUserSelection(text);

      $toolbar.find('a.bold').trigger(ev);
    });

    it("should ensure handleFormat is called", function() {
      expect(instance.handleFormat).toHaveBeenCalled();
    });

    it("should ensure the toolbar doesnt have a class of hidden", function() {
      expect($toolbar.hasClass('hidden')).toBeFalsy();
    });

    it("should ensure the body doesnt have a class of has-toolbar", function() {
      expect($body.hasClass('has-toolbar')).toBeTruthy();
    });

    it("should ensure the default event is prevented", function() {
      expect(ev.preventDefault).toHaveBeenCalled();
    });

    it("should call cmd_bold", function() {
      expect(instance.cmd_bold).toHaveBeenCalled();
    });

    it("should ensure the input is still focussed", function() {
      expect(instance.$input.is(':focus')).toBeTruthy();
    });

    // TODO: Ensure the user has selected some text
    // TODO: Ensure that we can apply a style across elements within the selection
    // TODO: Ensure we can only press the cmd buttons if we have a selection
    // TODO: Provide a hook for saving
  });

  describe("header formatting", function() {
    var ev;

    beforeEach(function() {
      ev = $.Event('click');

      spyOn(instance, 'cmd_h2').andCallThrough();

      instance.$input.trigger('focus'); // Ensure the toolbar is shown
      var text = instance.$input.find('p')[0];
      instance.setUserSelection(text);

      $toolbar.find('a.h2').trigger(ev);
    });

    it("should wrap the content in h2 tags", function() {
      expect($.trim(instance.$input.html())).toEqual('<h2>Hello world my name is Damian Nicholson</h2>');
    });

  });
});
