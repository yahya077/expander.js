# expander.js
This package makes your HTML elements increase and decrease in an animated way. The best features are toggle elements, increase element, decrease element and reset elements.

This package is still in development.
I welcome suggestions for changes that will bring it closer to compliance without overly complicating the code, or useful test cases to add to the test suite.

## Contents
+ [Features](#features)
+ [Install](#install)
+ [Usage](#usage)
+ [Options](#options)
+ [Methods](#methods)
+ [License](#license)

## Features

<table class="table">
    <thead>
    <tr>
        <th rowspan="3">Features</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Collapse All</td>
    </tr>
    <tr>
        <td>Toggle Items</td>
    </tr>
    <tr>
        <td>Increase Item</td>
    </tr>
    <tr>
        <td>Decrease Item</td>
    </tr>
    </tbody>
</table>

## Install

npm install expander.js

## Usage

#### 1. Add markup (your wrapper has to be relative position <br> and add hidden style as display none)

```html
<style>
  .hidden
   {
    display: none;
   }
  .cs-expander-items
  {
    position: relative;
  }
</style>
<div class="cs-expander">
    <div class="cs-expander-items">
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
        <div class="item"></div>
    </div>
</div>

```

#### 2. Initialize your class

```html
<script src="expander.js/dist/expander.js"></script>
<script>
    let expander = new Expander('.cs-expander-items',{toggle:true,resetable:true})
</script>

```

## Options

| Option | Type | Description |
| --- | --- | --- |
| `show` | Number | Default: 4. <br> Number of items initially shown. |
| `increase` | Number | Default: 3. <br> Number of items to add per click. |
| `decrease` | Number | Default: 3. <br> Number of items to remove per click, <br> if it is zero it will use increase variable. |
| `toggle` | Boolean | Default: false. <br> Append a toggle button, and functionality. |
| `resetable` | Boolean | Default: false. <br> Append a reset button, and functionality. |
| `unary` | Boolean | Default: false. <br> Removes increase and decrease buttons <br> if toggle is true |
| `increaseBtn` | String | Default: `'.cs-expander-increase-btn'`. <br> Button container for increasing items |
| `increaseBtnValue` | String | Default: `'Increase Items'`. <br> Increase button text |
| `toggleBtn` | String | Default: `'.cs-expander-toggle-btn'`. <br> Button container for toggling |
| `toggleBtnValue` | String | Default: `'Toggle Items'`. <br> Toggle button text |
| `decreaseBtn` | String | Default: `'.cs-expander-decrease-btn'`. <br> Button container for decreasing items |
| `decreaseBtnValue` | String | Default: `'Decrease Items'`. <br> Decrease button text |
| `resetBtn` | String | Default: `'.cs-expander-reset-btn'`. <br> Button container for reset expander |
| `resetBtnValue` | String | Default: `'Collapse'`. <br> Reset button text |
| `animationDuration` | Number | Default: 1. <br> Animation Duration |

## Methods

The slider returns a slider object with some properties and methods once it's initialized:
```javascript
{
  collapse: collapse(),
  increaseItem: increaseItem(),
  decreaseItem: decreaseItem(),
  getActiveItems: getActiveItems, // Array
  getHiddenItems: getHiddenItems, // Array
}
```

#### collapse
Resets expander
```javascript
expander.collapse();
```

#### increaseItem, decreaseItem
Increase or decrease items by number or default.
```javascript
expander.increaseItem();
expander.increaseItem(5);

expander.decreaseItem();
expander.decreaseItem(5);
```

#### getActiveItems
Get all shown elements as an node array
```javascript
expander.getActiveItems();
```

#### getHiddenItems
Get all hidden elements as an node array
```javascript
expander.getHiddenItems();
```

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.