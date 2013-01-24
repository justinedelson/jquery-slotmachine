/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#slotMachine', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.slotMachine({height:250, width:300}), this.elems, 'should be chaninable');
  });
/*
  test('is slotMachine', 1, function() {
    strictEqual(this.elems.slotMachine().text(), 'slotMachineslotMachineslotMachine', 'should be thoroughly slotMachine');
  });
*/
  module('jQuery.slotMachine');
/*
  test('is slotMachine', 1, function() {
    strictEqual($.slotMachine(), 'slotMachine', 'should be thoroughly slotMachine');
  });

  module(':slotMachine selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is slotMachine', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':slotMachine').get(), this.elems.last().get(), 'knows slotMachine when it sees it');
  });
*/
}(jQuery));
