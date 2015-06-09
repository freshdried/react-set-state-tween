var ObjectAssign = require("object-assign");
var assert = require("assert");
var tweenState = require("react-tween-state");
var Promise = require("bluebird");


//A composable wrapper for react-tween-state a la promises
//
module.exports = {
    mixins: [tweenState.Mixin],


    // Takes a state object
    // Returns a promise that is resolved at the end of the tween.
    // Optionally takes a callback
    
    tweenStateTo: function (stateObj, options, optionalCallback) {
        if (options) {
            assert(!options.endValue, "Do not specify end value with tweenStates");
        }

        var _tweenStates = function(callback) {
            return Promise.all(Object.keys(stateObj).map(function(stateKey) {
                console.log(stateKey);
                var stateValue = stateObj[stateKey];

                // Short-circuit if not tweenable (aka not number)
                if (typeof stateValue !== "number") return;

                // Short circuit if values are the same;
                if (this.getTweeningValue(stateKey) === stateValue) return;


                var tweenState = Promise.promisify(function(cb) {
                    console.log("tweening " + stateKey + " from " + this.getTweeningValue(stateKey) + " to " + stateValue);

                    var opts = ObjectAssign({}, options);
                    opts.onEnd = cb;
                    opts.endValue = stateValue;

                    this.tweenState(stateKey, opts);
                }.bind(this))
                return tweenState();

            }.bind(this))).nodeify(callback);
        }.bind(this);

        if (callback) 
            return _tweenStates(optionalCallback); 
        else return _tweenStates();
    }
}
