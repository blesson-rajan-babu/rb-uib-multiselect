'use strict'

angular.module('rb-uib-multiselect', ['ui.bootstrap'])

angular.module('rb-uib-multiselect').directive('rbUibMultiselect', function () {
  return {
    restrict: 'AE',
    scope: {
      inputOptions: '=',
      outputOptions: '=',
      maxLabels: '@',
      menuClass: '@',
      onChange: '&'
    },
    templateUrl: 'rb-uib-multiselect.html',
    link: function (scope, element, attrs) {
      // set options
      scope.options = []
      angular.forEach(scope.inputOptions, function (o) {
        scope.options.push({ id: o.id, label: o.label, selected: false, source: o })
      })

      // set max labels
      if (scope.maxLabels === undefined) {
        scope.maxLabels = scope.options.length
      }

      // on item click
      scope.onItemClick = function (o, $event) {
        $event.preventDefault()
        o.selected = !o.selected
        scope.updateOutput()
      }

      // on select all checkbox change
      scope.selectAll = false

      scope.onSelectAllClick = function ($event) {
        $event.preventDefault()
        scope.selectAll = !scope.selectAll
        scope.onSelectAllChange()
      }

      scope.onSelectAllChange = function () {
        angular.forEach(scope.options, function (o) {
          o.selected = scope.selectAll
        })
        scope.updateOutput()
      }

      scope.onCheckboxChange = function () {
        scope.updateOutput()
      }

      scope.updateOutput = function () {
        var output = []
        angular.forEach(scope.options, function (o) {
          if (o.selected === true) {
            output.push(o.source)
          }
        })
        scope.outputOptions = output
      }

      // display label
      scope.displayLabel = function () {
        var label = []
        angular.forEach(scope.outputOptions, function (o) {
          label.push(o.label)
        })

        if (label.length === 0) {
          return 'Select'
        }

        var i = 0
        var labelFinal = []
        for (i = 0; i < scope.maxLabels && i < label.length; i++) {
          labelFinal.push(label[i])
        }

        if (scope.maxLabels < label.length) {
          // labelFinal.push('...')
          return '(' + label.length + ') Selected'
        }

        return labelFinal.join(', ')
      }
    }
  }
})

angular.module('rb-uib-multiselect').run(['$templateCache', function ($templateCache) {
  var template = '' +
  '<div class="btn-group" uib-dropdown auto-close="outsideClick" ng-class="dropdownClass">' +
    '<button type="button" class="btn btn-primary" uib-dropdown-toggle>' +
      '{{displayLabel()}} <span class="caret"></span>' +
    '</button>' +
    '<ul class="dropdown-menu" uib-dropdown-menu role="menu" ng-class="[menuClass]">' +
      '<li role="menuitem">' +
        '<a href="#" ng-click="onSelectAllClick($event)">' +
          '<input type="checkbox" ng-model="selectAll" ng-change="onSelectAllChange()" ng-click="$event.stopPropagation()">' +
          '&nbsp;Select All' +
        '</a>' +
      '</li>' +
      '<li class="divider"></li>' +
      '<li role="menuitem" ng-repeat="o in options">' +
          '<a href="#" ng-click="onItemClick(o, $event)">' +
            '<input type="checkbox" ng-model="o.selected" ng-change="onCheckboxChange()" ng-click="$event.stopPropagation()">' +
            '&nbsp;{{o.label}}' +
          '</a>' +
      '</li>' +
    '</ul>' +
  '</div>'

  $templateCache.put('rb-uib-multiselect.html', template)
}])
