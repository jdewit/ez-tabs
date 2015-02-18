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

.directive('tabset', ['$templateCache', '$compile', 'EzTabsConfig', function($templateCache, $compile, EzTabsConfig) {
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

      $tabs = $tpl.find('ul');
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
          rawHtml: $tabEls[i].children[1].innerHTML
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

        $tpl.find('.nav.nav-tabs').on('click', 'a', function() {
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

        // compile all tabs if we're feeling wasteful
        if (!scope.options.lazy || attrs.lazy === 'false') {
          for (var i = 0; i < tabs.length; i++) {
            compileTab(i);
          }
        }

        select = function(i) {
          tab = scope.tabs[i];

          if (!tab.compiled) {
            compileTab(i);
          }

          $tpl.find('.active').removeClass('active');
          $tpl.find('.tab-pane[data-index="'+ i +'"]').addClass('active');
          $tpl.find('li[data-index="'+ i +'"]').addClass('active');

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
        select(0);
      };
    }
  };
}])
;
