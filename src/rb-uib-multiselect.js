'use strict'

angular.module('rb-uib-multiselect', ['ui.bootstrap'])

angular.module('rb-uib-multiselect').directive('rbUibMultiselect', function () {
  return {
    restrict: 'AE',
    scope: {
      inputOptions: '=',
      outputOptions: '=',
      maxLabels: '@',
      buttonClass: '@',
      menuClass: '@',
      selectText: '@',
      selectAllText: '@',
      clearAllText: '@',
      showSelectAll: '@',
      itemLabel: '&',
      buttonLabel: '&'
    },
    templateUrl: 'rb-uib-multiselect.html',
    link: function (scope, element, attrs) {
      // reset input, output
      scope.reset = function () {
        scope.options = []
        scope.outputOptions = []
        scope.selectAll = false
      }
      scope.reset()

      // set defaults
      scope.setDefaults = function () {
        if (scope.maxLabels === undefined) {
          scope.maxLabels = 0
        }
        scope._itemLabel = scope.itemLabel()
        if (scope._itemLabel === undefined) {
          scope._itemLabel = function (item) {
            return ' ' + item.label
          }
        }
        scope._buttonLabel = scope.buttonLabel()
        if (scope._buttonLabel === undefined) {
          scope._buttonLabel = function () {
            if (scope.outputOptions.length === 0) {
              return scope.selectText
            }
            if (scope.maxLabels > 0 && scope.maxLabels < scope.outputOptions.length) {
              return '(' + scope.outputOptions.length + ') Selected'
            }
            var labels = []
            angular.forEach(scope.outputOptions, function (o) {
              labels.push(scope._itemLabel(o))
            })
            return labels.join(',')
          }
        }
        if (scope.selectText === undefined) {
          scope.selectText = 'Select'
        }
        if (scope.selectAllText === undefined) {
          scope.selectAllText = ' Select All'
        }
        if (scope.clearAllText === undefined) {
          scope.clearAllText = ' Clear All'
        }
        if (scope.showSelectAll === 'false') {
          scope._showSelectAll = false
        } else {
          scope._showSelectAll = true
        }
      }
      scope.setDefaults()

      // prepares input options from input model
      scope.prepareOptions = function () {
        scope.reset()
        angular.forEach(scope.inputOptions, function (o) {
          scope.options.push({ id: o.id, label: scope._itemLabel(o), selected: o.selected || false, source: o })
        })
        scope.updateOutput()
      }

      // watch for input changes
      scope.$watch('inputOptions', function (newInput) {
        if (newInput) {
          scope.prepareOptions()
        }
      })

      // on menu item click
      scope.onItemClick = function (o, $event) {
        $event.preventDefault()
        o.selected = !o.selected
        scope.updateOutput()
      }

      // on menu item checkbox change
      scope.onItemSelectionChange = function () {
        scope.updateOutput()
      }

      // on select-all click
      scope.onSelectAllClick = function ($event) {
        $event.preventDefault()
        scope.selectAll = !scope.selectAll
        angular.forEach(scope.options, function (o) {
          o.selected = scope.selectAll
        })
        scope.updateOutput()
      }

      // updates output model
      scope.updateOutput = function () {
        var output = []
        var allSelected = true
        angular.forEach(scope.options, function (o) {
          if (o.selected === true) {
            output.push(o.source)
          } else {
            allSelected = false
          }
        })
        scope.selectAll = allSelected
        scope.outputOptions = output
      }
    }
  }
})

angular.module('rb-uib-multiselect').run(['$templateCache', function ($templateCache) {
  var template = '' +
    '<div class="btn-group btn-block" uib-dropdown auto-close="outsideClick">' +
    '<button type="button" class="btn btn-block" uib-dropdown-toggle ng-class="[buttonClass]">' +
    '{{ _buttonLabel() }}' +
    '</button>' +
    '<ul class="dropdown-menu" style="width: 100%;" uib-dropdown-menu role="menu" ng-class="[menuClass]">' +
    '<li role="menuitem" ng-if="_showSelectAll && options.length > 0">' +
    '<a href="#" ng-click="onSelectAllClick($event)">' +
    '{{ selectAll ? clearAllText : selectAllText }}' +
    '</a>' +
    '</li>' +
    '<li class="divider" ng-if="_showSelectAll && options.length > 0"></li>' +
    '<li role="menuitem" ng-repeat="o in options">' +
    '<a href="#" ng-click="onItemClick(o, $event)">' +
    '<input type="checkbox" ng-model="o.selected" ng-change="onItemSelectionChange()" ng-click="$event.stopPropagation()">' +
    '{{ o.label }}' +
    '</a>' +
    '</li>' +
    '</ul>' +
    '</div>'

  $templateCache.put('rb-uib-multiselect.html', template)
}])
