'use strict';

var limperslider = (function(){
    function limperslider(selectors, options) {

        function F() {};
        F.prototype = (function() {
            var hideInputs = function(selectors) {
                for (var i = 0; i < this.inputs.length; i++) {
                    var input = this.inputs[i];
                    input.setAttribute('readonly', 'readonly');
                }
            };

            var addClass = function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += ' ' + className;
                }
            };

            var onMouseUp = function(e) {
                document.removeEventListener("mousemove", this.onMouseMove, false);
                document.removeEventListener("mouseup", this.onMouseUp, false);
            };

            var onMouseMove = function(e) {
                var handleIdx = this.beingMoved.getAttribute('limperidx');
                var percentage = getPercentage.call(this, e);
                setNewPosition.call(this, handleIdx, percentage);
                emitChange.call(this);
            };

            var onMouseDown = function(e) {
                document.removeEventListener("mousemove", this.onMouseMove, false);
                document.removeEventListener("mouseup", this.onMouseUpg, false);
                document.addEventListener("mousemove", this.onMouseMove, false);
                document.addEventListener("mouseup", this.onMouseUp, false);
                if(e.stopPropagation) e.stopPropagation();
                if(e.preventDefault) e.preventDefault();
                e.cancelBubble=true;
                e.returnValue=false;
                this.beingMoved = e.target;
                return false;
            };

            var setNewPosition = function(handleIdx, percentage) {
                this.values[handleIdx] = percentage;
                positionElements.call(this);
                setInputsFromPosition.call(this);
            };

            var setInputsFromPosition = function() {
                var prevVal = 0;
                for (var i = 0; i < this.inputs.length; i++) {
                    this.inputs[i].setAttribute('value', (this.values[i] - prevVal).toFixed(2));
                    prevVal = this.values[i];
                }
            };

            var getPercentage = function(e) {
                var eventPosition = e.pageX;
                var rect = this.el.getBoundingClientRect();
                var offset = rect.left;
                var size = rect.right - rect.left;
                var distanceToSlide = eventPosition - offset;
                var percentage = (distanceToSlide / size) * 100;
                var handleIdx = parseInt(this.beingMoved.getAttribute('limperidx'), 10);
                var maxPercentage = 100;
                if (handleIdx < this.handlers.length - 1) {
                    maxPercentage = this.values[handleIdx + 1];
                }
                var minPercentage = 0;
                if (handleIdx > 0) {
                    minPercentage = this.values[handleIdx - 1];
                }
                if (percentage < minPercentage) {
                    return minPercentage;
                } else if (percentage > maxPercentage) {
                    return maxPercentage;
                }
                return percentage;
            };

            var createHandlers = function (track) {
                for (var i = 0; i < this.inputs.length - 1; i++) {
                    var handle = document.createElement('div');
                    addClass(handle, 'limper-handle');
                    handle.setAttribute('limperidx', i);
                    track.appendChild(handle);
                    this.handlers.push(handle);
                    handle.addEventListener('mousedown', this.onMouseDown);
                }
            };

            var createZones = function (track) {
                var colors = ['red', 'yellow', 'green'];
                for (var i = 0; i < this.inputs.length; i++) {
                    var zone = document.createElement('div');
                    addClass(zone, 'limper-zone');
                    this.zones.push(track.appendChild(zone));
                    this.zones[i].style['background-color'] = colors[i];
                }
            };

            var createTooltips = function (track) {
                for (var i = 0; i < this.inputs.length; i++) {
                    var tooltip = document.createElement('div');
                    addClass(tooltip, 'limper-tooltip');
                    track.appendChild(tooltip);
                    this.tooltips.push(tooltip);
                }
            };

            var createElements = function() {
                var track = document.createElement('div');
                addClass(track, 'limper-track');
                this.el.appendChild(track);
                createZones.call(this, track);
                createTooltips.call(this, track);
                createHandlers.call(this, track);
            };

            var isNumeric = function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            };

            var computeInitialValues = function() {
                var aggregated = 0;
                var allValidValues = true;
                for (var i = 0; i < this.inputs.length; i++) {
                    var value = this.inputs[i].getAttribute('value');
                    if (!isNumeric(value)) {
                        allValidValues = false;
                    } else {
                        aggregated += parseFloat(value);
                        this.values.push(aggregated);
                    }
                }
                if (aggregated != this.total || !allValidValues) {
                    this.values = [];
                    var acc = 0;
                    for (var i = 0; i < this.inputs.length - 1; i++) {
                        var increment = (this.total / this.inputs.length).toFixed(2);
                        acc += parseFloat(increment);
                        this.inputs[i].setAttribute('value', increment);
                        this.values.push(acc);
                    }
                    this.inputs[this.inputs.length - 1].setAttribute('value', this.total - acc);
                    this.values.push(this.total);
                }
            };

            var positionZones = function() {
                var prevVal = 0;
                for (var i = 0; i < this.zones.length; i++) {
                    this.zones[i].style.left = prevVal + '%';
                    this.zones[i].style.width = (this.values[i] - prevVal) + '%';
                    prevVal = this.values[i];
                }
            };

            var positionHandlers = function() {
                for (var i = 0; i < this.values.length - 1; i++) {
                    this.handlers[i].style.left = this.values[i] + '%';
                }
            };

            var positionElements = function() {
                    positionZones.call(this);
                    positionHandlers.call(this);
            };

            var emitChange = function() {
                if (document.createEvent) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, false);
                    this.el.dispatchEvent(event);
                } else {
                    this.el.fireEvent('onchange');
                }
            }

            //Returns true if it is a DOM element
            function isElement(o){
                return (
                    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
                );
            }

            return {
                init: function (selectors, options) {
                    var idlimper = '';
                    var lastElement = null;
                    this.onMouseDown = onMouseDown.bind(this);
                    this.onMouseUp = onMouseUp.bind(this);
                    this.onMouseMove = onMouseMove.bind(this);
                    for (var i = 0; i < selectors.length; i++) {
                        var selector = selectors[i];
                        var selement = null;
                        if (isElement(selector)) {
                            selement = selector;
                        } else {
                            selement = document.querySelector(selector);
                        }
                        if (!selement) {
                            throw "element " + selector + " does not exist"
                        }
                        var id = selement.getAttribute('id');
                        if (i > 0) {
                            idlimper += "-";
                        }
                        idlimper += id;
                        this.inputs.push(selement);
                        lastElement = selement;
                    }

                    idlimper += "-limper";

                    this.el = document.createElement('div');
                    addClass(this.el, 'limperslider');

                    if (options && options.element) {
                        options.element.appendChild(this.el);
                        this.anchor = options.element;
                    } else if (options && options.selector) {
                        this.anchor = document.querySelector(options.selector);
                        this.anchor.appendChild(this.el);
                    } else {
                        lastElement.insertAdjacentElement('afterend', this.el);
                        this.anchor = lastElement;
                    }

                    this.el.setAttribute('id', idlimper);

                    hideInputs.call(this, selectors);
                    computeInitialValues.call(this);
                    createElements.call(this);
                    positionElements.call(this);

                },

                destroy: function() {
                    if (this.el && this.el.parentNode) {
                        this.el.parentNode.removeChild(this.el);
                    }
                }
            }
        })();

        var f = new F();
        f.anchor = null;
        f.el = null;
        f.inputs = [];
        f.handlers = [];
        f.zones = [];
        f.tooltips = [];
        f.values = [];
        f.total = 100;
        f.beingMoved = null;
        f.onMouseUp = null;
        f.onMouseDown = null;
        f.onMouseMove = null;

        f.init(selectors, options);
        return f;
    };
    return limperslider;
})();

/* AMD Compatibility */

if (typeof define === "function" && define.amd) {
  define("limperslider", [], function() {
    return window.limperslider;
  });
}
