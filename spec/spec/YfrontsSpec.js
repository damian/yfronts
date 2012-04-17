describe("Yfronts", function() {
  var instance
    , div
    ;

  beforeEach(function() {
    div = $('[contenteditable]').first();
    if (div.data('yfronts')) {
      instance = div.data('yfronts');
    } else {
      instance = new Yfronts(div);
      div.data('yfronts', instance);
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
      it("should ensure handleFocus is called", function() {
        spyOn(instance, 'handleFocus');
        instance.$input.trigger('focus');
        expect(instance.handleFocus).toHaveBeenCalled();
      });

      it("should add a class to the body of has-toolbar", function() {
        instance.$input.trigger('focus');
        expect($(document.body).hasClass('has-toolbar')).toBeTruthy();
      });

      it("should not call setupToolbar if hasToolbar is true", function() {
        spyOn(instance, 'setupToolbar');
        instance.$input.trigger('focus');
        expect(instance.setupToolbar).not.toHaveBeenCalled();
      });

      it("should remove the hidden class on the toolbar if hasToolbar is true", function() {
        Yfronts.$toolbar.addClass('hidden');
        instance.$input.trigger('focus');
        expect(Yfronts.$toolbar.hasClass('hidden')).toBeFalsy();
      });

      it("should call setupToolbar if hasToolbar is false", function() {
        Yfronts.hasToolbar = false;
        Yfronts.$toolbar = null;

        spyOn(instance, 'setupToolbar');
        instance.$input.trigger('focus');
        expect(instance.setupToolbar).toHaveBeenCalled();
      });

      describe("content formatting", function() {
        beforeEach(function() {
          Yfronts.$toolbar = $('.toolbar').first();
          Yfronts.hasToolbar = true;
          spyOn(instance, 'handleFormat').andCallThrough();
          Yfronts.$toolbar.find('a:first').trigger('click');
        });

        it("should ensure handleFormat is called", function() {
          expect(instance.handleFormat).toHaveBeenCalled();
        });

        it("should ensure the input is still focussed", function() {
          expect(instance.$input.is(':focus')).toBeTruthy();
        });

        it("should ensure the toolbar is not hidden", function() {
          expect(Yfronts.$toolbar.hasClass('hidden')).toBeFalsy();
        });
      });

    });

    describe("on blur", function() {
    });
  });

});
