'use strict';

describe("events", function() {
    /**
     * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
     * by testing for a 'synthetic=true' property on the event object
     * @param {HTMLNode} node The node to fire the event handler on.
     * @param {String} eventName The name of the event without the "on" (e.g., "focus")
     */
    var fireEvent = function(node, eventName) {
        // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
        var doc;
        if (node.ownerDocument) {
            doc = node.ownerDocument;
        } else if (node.nodeType == 9){
            // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
            doc = node;
        } else {
            throw new Error("Invalid node passed to fireEvent: " + node.id);
        }
    
         if (node.dispatchEvent) {
            // Gecko-style approach (now the standard) takes more work
            var eventClass = "";
    
            // Different events have different event classes.
            // If this switch statement can't map an eventName to an eventClass,
            // the event firing is going to fail.
            switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mousedown":
                case "mouseup":
                case "mousemove":
                    eventClass = "MouseEvents";
                    break;

                case "touchstart":
                case "touchend":
                case "touchmove":
                    eventClass = "UIEvents";
                    break;
    
                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;
    
                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
            }
            var event = doc.createEvent(eventClass);
    
            var bubbles = eventName == "change" ? false : true;
            event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.
    
            event.synthetic = true; // allow detection of synthetic events
            // The second parameter says go ahead with the default action
            node.dispatchEvent(event, true);
        } else  if (node.fireEvent) {
            // IE-old school style
            var event = doc.createEventObject();
            event.synthetic = true; // allow detection of synthetic events
            node.fireEvent("on" + eventName, event);
        }
    };
        var slider;
    var hasClass = function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    beforeEach(function() {
        slider = new limperslider(["#percentage1", "#percentage2", "#percentage3"], { selector: '#slider-holder'});
    });

    afterEach(function() {
        slider.destroy();
    });

    it("Mouse down - mousemove emits change", function() {
        var element = document.querySelector('#slider-holder');
        var handler = element.querySelector('.limper-handle');
        var spy = {
            changed : function() {
            }
        };
        spyOn(spy, 'changed') 
        element.addEventListener('change', spy.changed, false);
        fireEvent(handler, 'mousedown');
        fireEvent(handler, 'mousemove');
        fireEvent(handler, 'mouseup');
        expect(spy.changed).toHaveBeenCalled()
    });

    it("touchdown - touchmove emits change", function() {
        var element = document.querySelector('#slider-holder');
        var handler = element.querySelector('.limper-handle');
        var spy = {
            changed : function() {
            }
        };
        spyOn(spy, 'changed') 
        element.addEventListener('change', spy.changed, false);
        fireEvent(handler, 'touchstart');
        fireEvent(handler, 'touchmove');
        fireEvent(handler, 'touchend');
        expect(spy.changed).toHaveBeenCalled()
    });
});
