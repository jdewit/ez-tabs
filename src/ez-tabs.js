angular.module('ez.tabs', [])

.constant('EzTabsConfig', {
  /**
   * Allow user to tie a promise into the selection of a tab
   */
  preSelectPromise: null
})

.directive('tabset', ['$sce', '$templateCache', '$compile', 'EzTabsConfig', function($sce, $templateCache, $compile, EzTabsConfig) {
  return {
    restrict: 'E',
    scope: {
      config: '=?'
    },
    compile: function(el, attr, tran) {
      var tabEls = el.find('tab').remove();

      el.addClass('ez-tabs');

      return function(scope, $el) {
        scope.tabs = [];

        scope.options = angular.extend({}, EzTabsConfig, scope.config);

        var addTab = function(tabEl) {
          scope.tabs.push({
            heading: $sce.trustAsHtml(tabEl.children[0].innerHTML),
            rawHtml: tabEl.children[1].innerHTML,
            src: tabEl.children[1].getAttribute('src')
          });
        };

        var removeTab = function(i) {
          scope.tabs.splice(i, 1);
        };

        tabEls.each(function(i) {
          var ngIf = tabEls[i].getAttribute('ng-if');

          if (ngIf) {
            scope.$parent.$watch(ngIf, function(newVal) {
              if (!!newVal) {
                addTab(tabEls[i]);
              } else {
                removeTab(i);
              }
            });
          } else {
            addTab(tabEls[i]);
          }
        });

        var select = function(tab) {
          if (scope.tab) {
            scope.tab.active = false;
          }

          scope.tab = tab;
          tab.active = true;

          if (tab.src) {
            tab.html = $compile($templateCache.get(tab.src))(scope.$parent);
          } else {
            tab.html = $compile('<div>' + tab.rawHtml + '</div>')(scope.$parent);
          }

          angular.element($el[0].children[0].children[1].children[0]).html(tab.html);
        };

        scope.select = function(tab) {
          if (scope.options.preSelectPromise) {
            scope.options.preSelectPromise(tab, $el).then(function() {
              select(tab);
            });
          } else {
            select(tab);
          }
        };

        // init
        $el.append($compile($templateCache.get('ez-tabs.html'))(scope));

        select(scope.tabs[0]);
      };
    }
  };
}]);
