﻿/**
@ngdoc directive
@name umbraco.directives.directive:umbColorSwatches
@restrict E
@scope
@description
Use this directive to generate color swatches to pick from.
<h3>Markup example</h3>
<pre>
    <umb-color-swatches
        colors="colors"
        selected-color="color"
        size="s">
    </umb-color-swatches>
</pre>
@param {array} colors (<code>attribute</code>): The array of colors.
@param {string} selectedColor (<code>attribute</code>): The selected color.
@param {string} size (<code>attribute</code>): The size (s, m).
@param {string} useLabel (<code>attribute</code>): Specify if labels should be used.
@param {string} useColorClass (<code>attribute</code>): Specify if color values are css classes.
@param {function} onSelect (<code>expression</code>): Callback function when the item is selected.
**/

(function () {
    'use strict';

    function ColorSwatchesDirective() {

        function link(scope, el, attr, ctrl) {

            // Set default to true if not defined
            if (angular.isUndefined(scope.useColorClass)) {
                scope.useColorClass = false;
            }
            
            scope.setColor = function (color, $index, $event) {

                if (scope.onSelect) {
                    // did the value change?
                    if (scope.selectedColor != null && scope.selectedColor === color) {
                        // User clicked the currently selected color
                        // to remove the selection, they don't want
                        // to select any color after all.
                        // Unselect the color
                        color = null;
                    }

                    scope.selectedColor = color;
                    scope.onSelect({color: color, $index: $index, $event: $event});
                    $event.stopPropagation();
                }
            };

            scope.isSelectedColor = function (color) {
                return scope.selectedColor && color === scope.selectedColor;
            }
        }

        var directive = {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'views/components/umb-color-swatches.html',
            scope: {
                colors: '=?',
                size: '@',
                selectedColor: '=',
                onSelect: '&',
                useLabel: '=',
                useColorClass: '=?'
            },
            link: link
        };

        return directive;

    }

    angular.module('umbraco.directives').directive('umbColorSwatches', ColorSwatchesDirective);

})();
