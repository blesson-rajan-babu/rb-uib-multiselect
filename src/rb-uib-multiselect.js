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
      itemLabel: '&'
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
          scope.maxLabels = scope.options.length
        }
        scope.label = scope.itemLabel()
        if (scope.label === undefined) {
          scope.label = function (item) {
            return ' ' + item.label
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
      }
      scope.setDefaults()

      // prepare input options from input model
      scope.prepareOptions = function () {
        scope.reset()
        angular.forEach(scope.inputOptions, function (o) {
          scope.options.push({ id: o.id, label: scope.label(o), selected: o.selected || false, source: o })
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

      // button label
      // TODO customize label
      scope.buttonLabel = function () {
        var label = []
        angular.forEach(scope.outputOptions, function (o) {
          label.push(scope.label(o))
        })
        if (label.length === 0) {
          return scope.selectText
        }
        var i = 0
        var labelFinal = []
        for (i = 0; i < scope.maxLabels && i < label.length; i++) {
          labelFinal.push(label[i])
        }
        if (scope.maxLabels < label.length) {
          return '(' + label.length + ') Selected'
        }
        return labelFinal.join(', ')
      }
    }
  }
})

angular.module('rb-uib-multiselect').run(['$templateCache', function ($templateCache) {
  var template = '' +
  '<div class="btn-group btn-block" uib-dropdown auto-close="outsideClick">' +
    '<button type="button" class="btn btn-block" uib-dropdown-toggle ng-class="[buttonClass]">' +
      '{{ buttonLabel() }}' +
    '</button>' +
    '<ul class="dropdown-menu" style="width: 100%;" uib-dropdown-menu role="menu" ng-class="[menuClass]">' +
      '<li role="menuitem" ng-if="options.length > 0">' +
        '<a href="#" ng-click="onSelectAllClick($event)">' +
          '{{ selectAll ? clearAllText : selectAllText }}' +
        '</a>' +
      '</li>' +
      '<li class="divider" ng-if="options.length > 0"></li>' +
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
