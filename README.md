EZ-TABS
=======

This is a fork of the <a href="https://github.com/angular-ui/bootstrap">angular-ui bootstrap tabs</a>. 

The angular-ui-bootstrap project is too complicated. I think it would be better suited to split all of the components into individual repos. 

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
      some content
    </tab>
    <tab heading="Tab 2">
      Other content
    </tab>
    <tab heading="Tab 3">
      More content
    </tab>
  </tabset>
```

###Demo

View <a href="http://cdn.rawgit.com/jdewit/ez-tabs/master/index.html">DEMO</a>.
