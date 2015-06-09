# react-set-state-tween

</br>

Composable wrapper API for [react-tween-state](https://github.com/chenglou/react-tween-state), à la [bluebird promises](https://github.com/petkaantonov/bluebird).

</br>

#### *composable*

`this.setStateTween` returns a [bluebird](https://github.com/petkaantonov/bluebird) promise that resolves at the end of the tween.

</br>

#### *tries to seamlessly replaces React's* `this.setState`

Compare this...
```javascript
this.setStateTween({
    key1: value1,
    key2: value2
});
```
with this...
```javascript
this.setState({
    key1: value1,
    key2: value2
});
```





## Usage

#### Basic:
```javascript
this.setStateTween({a: 1});
```


#### Tween multiple state keys simultaneously:
```javascript
this.setStateTween({
    a: 1,
    b: 1,
});
```

#### Specify options supported by `react-tween-state`:
```javascript
this.setStateTween({a: 1}, {
    duration: 500,
    easing: tweenState.easingTypes.easeInOutQuad
});
```
`setStateTween` will ignore `onEnd` and `endValue` options.


#### Chain animations (and nonanimations!):
```javascript
this.setStateTween({
    a: 1,
    b: 1,
}).then(function() {
    console.log("finished!");
    console.log("jk lol...");
}).then(() => this.setStateTween({
    a: 0,
    b: 0,
})).then(function() {
    console.log("actually finished.");
});
```

#### Note: Promise will resolve immediately if tween is degenerate:

```javascript
// this expression will resolve in only 500 ms...

this.setStateTween( {a: 1}, {duration: 500} )
    then(() => setStateTween( {a: 1}, {duration: 1000} ));

//...because there's no effect tweening from 1 to 1
```

#### Don't just chain animations, orchestrate them!:
Check out the [bluebird API](https://github.com/petkaantonov/bluebird/blob/master/API.md) for more Promise sugar.
```javascript

// Promise.all resolves when all resolve. (parallel)
Promise.all([
    function() {

        // Promise.each waits until next one resolves. (sequential)
        return Promise.each([
            () => this.setStateTween( {a: 1} ),
            () => this.setStateTween( {a: 0} ),
            () => this.setStateTween( {a: 1} ),
            () => this.setStateTween( {a: 0} )
        ])
    },
    function() {
        return Promise.each([
            () => this.setStateTween( {b: 1}, {duration: 1000}),
            () => this.setStateTween( {b: 0}, {duration: 1000}),
            () => this.setStateTween( {b: 1}, {duration: 1000}),
            () => this.setStateTween( {b: 0}, {duration: 1000})
        ])
    },
]).then(() => this.tweenStateTo({
    a: 1,
    b: 1
}));
```

### Don't like promises?

Then you can use callbacks.

```javascript
this.setStateTween( {a: 1}, {duration: 1000},  function() {
    console.log("finished");
});

/*
// Compare to

this.setState( {a: 1}, function() {
    console.log("finished");
});
*/
```




## example

```javascript
import React from "react"
import Promise from "bluebird"
import tweenState from "react-tween-state"
import SetStateTweenMixin from "react-set-state-tween"

const App = React.createClass({
    mixins: [SetStateTweenMixin],
    getInitialState: function() {
        return {
            A: 1,
            B: 1,
            C: 1
        };
    },
    onClick: function() {

        // resolve each promise sequentially...

        Promise.each([
            () => this.setStateTween({A: 0}),
            () => this.setStateTween({B: 0}),
            () => this.setStateTween({C: 0}),
        ]).then(function() {

        // and then in parallel!

            return Promise.all([
                () => this.setStateTween({A: 1}),
                () => this.setStateTween({B: 1}),
                () => this.setStateTween({C: 1}),
            ]);
        })

    },
    render: function() {
        let styleA = { opacity: this.getTweeningValue("A") };
        let styleB = { opacity: this.getTweeningValue("B") };
        let styleC = { opacity: this.getTweeningValue("C") };
        return (
            <div>
                <div style={styleA} /> A </div>
                <div style={styleB} /> B </div>
                <div style={styleC} /> C </div>

                <div onClick={this.onClick}> Click me! </div>
            </div>
        )
    }
})
```

