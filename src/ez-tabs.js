angular.module('ez.tabs', [])

.constant('EzTabsConfig', {

  /**
   * Allow user to tie a promise into the selection of a tab
   */
  preSelectPromise: null,

  /**
   * Only compile tab content if tab has been selected
   */
  lazy: true

})

.directive('tabset', [
  '$templateCache',
  '$compile',
  '$parse',
  'EzTabsConfig',
  function(
    $templateCache,
    $compile,
    $parse,
    EzTabsConfig
  ) {
  return {
    restrict: 'E',
    scope: {
      config: '=?',
      tabIndex: '=?'
    },
    compile: function($el, attrs) {
      var $tabEls = $el.find('tab').remove();
      var tabs = [];
      var $pane;
      var $li;
      var $tabs;
      var $panes;
      var tabAttrs;
      var $tpl = angular.element('<div><ul class="nav nav-tabs"></ul><div class="tab-content"></div></div>');

      // copy over any attributes set on the tabset
      for (var k in attrs.$attr) {
        if (k !== 'config' && k !== 'tabIndex') {
          $tpl.attr(k, attrs[k]);
        }
      }

      $tpl.addClass('ez-tabs');

      $tabs = $tpl.find('ul.nav-tabs');
      $panes = $tpl.find('.tab-content');

      $tabEls.each(function(i) {
        $li = angular.element('<li data-index="'+ i +'"><a>' + $tabEls[i].children[0].innerHTML + '</a></li>');
        $pane = angular.element('<div data-index="'+ i +'" class="tab-pane"><div class="tab-pane-content"></div></div>');

        // copy over any attributes set on the tab
        tabAttrs = $tabEls[i].attributes;
        for (var j = 0; j < tabAttrs.length; j++) {
          $li.find('a').attr(tabAttrs[j].nodeName, tabAttrs[j].value);
          $pane.find('.tab-pane-content').attr(tabAttrs[j].nodeName, tabAttrs[j].value);
        }

        tabs.push({
          src: $tabEls[i].children[1].getAttribute('src'),
          rawHtml: $tabEls[i].children[1].innerHTML,
          lazy: $tabEls[i].getAttribute('lazy')
        });

        $tabs.append($li);
        $panes.append($pane);
      });

      return function(scope, $el, attrs) {
        var tab;
        var $html;
        var select;

        scope.tabs = tabs;

        scope.options = angular.extend({}, EzTabsConfig, scope.config);

        // overide lazy option from tab attrs
        if (attrs.lazy === 'false') {
          scope.options.lazy = false;
        }

        $tabs.on('click', 'a', function() {
          scope.select($(this).parent().data('index'));
          scope.$apply();
        });

        var compileTab = function(i) {
          tab = scope.tabs[i];

          if (tab.src) {
            $html = $templateCache.get(tab.src);
          } else {
            $html = tab.rawHtml;
          }

          $tpl.find('.tab-pane[data-index="'+ i +'"]').html($html);

          $compile($tpl.find('.tab-pane[data-index="'+ i +'"]'))(scope.$parent);

          tab.compiled = true;
        };

        select = function(i) {
          tab = scope.tabs[i];

          if (!tab.compiled) {
            compileTab(i);
          }

          $tabs.find('.active').removeClass('active');
          $panes.find('.tab-pane.active').removeClass('active');
          $panes.find('.tab-pane[data-index="'+ i +'"]').addClass('active');
          $tabs.find('li[data-index="'+ i +'"]').addClass('active');

          scope.$parent.$broadcast('ez_tabs.selected', i);

          scope.tabIndex = i;
        };

        scope.select = function(i) {
          if (scope.options.preSelectPromise) {
            scope.options.preSelectPromise(scope.tabs[i], $tpl, i).then(function() {
              select(i);
            });
          } else {
            select(i);
          }
        };

        //init
        $el.replaceWith($tpl);
        $compile($tpl)(scope.$parent);

        for (var i = 0, l = tabs.length; i < l; i++) {
           // compile tabs if necessary
          if (
            scope.options.lazy === false ||
            tabs[i].lazy !== null && (tabs[i].lazy === 'false' || $parse(tabs[i].lazy)(scope.$parent) === false)
          ) {
            compileTab(i);
          }
        }

        select(0);
      };
    }
  };
}])
;
