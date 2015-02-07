EZ-TABS
=======

Bootstrap 3 tabs directive. 

###Features
- Lazy tab loading
- Load tab content via templates
- Pre selection control flow (decide if tab should be allowed to be selected)
- Styling for left & right side tabs

###Installation

```
$ bower install ez-tabs
```

```js
<script src="bower_components/ez-tabs/dist/ez-tabs.min.js"/>
```

```js
angular.module('yourApp', ['ez.tabs'])
```

###Usage
```html
  <tabset>
    <tab> 
      <tab-heading>Tab 1</tab-heading>
      <tab-content>some content</tab-content>
    </tab>
    <tab>
      <tab-heading>Tab 2</tab-heading>
      <tab-content src="some-template.html"></tab-content>
    </tab>
    <tab>
      <tab-heading>Tab 3</tab-heading>
      <tab-content>some content 3</tab-content>
    </tab>
  </tabset>
```

###Demo

View <a href="http://cdn.rawgit.com/jdewit/ez-tabs/master/index.html">DEMO</a>.
