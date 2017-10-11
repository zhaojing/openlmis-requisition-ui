/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table.th
     *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .directive('openlmisInvalid', directive);

    directive.$inject = [];

    function directive() {
        var directive = {
            compile: compile,
            require: [
                'openlmisInvalid',
                '?popover'
            ],
            priority: -1
        };
        return directive;

        function compile(element, attrs) {
            if (element.is('th')) {
                return link;
            }
        }

        function link(scope, header, attrs, ctrls) {
            var columns, subHeaders, stopWatcher, startIndex, endIndex, wasFocused, messageDiv,
                table = header.parents('table').first(),
                indexes = calculateIndexes(header),
                openlmisInvalidCtrl = ctrls[0]

            openlmisInvalidCtrl.suppress();
            openlmisInvalidCtrl.hide();

            scope.$on('$destroy', clear);
            header.on('$destroy', clear);

            messageDiv = angular.element('<div></div>');

            attrs.$observe('openlmisInvalid', function(message) {
                console.log(message);
                messageDiv.html(message);
                console.log(messageDiv);
            });

            stopWatcher = scope.$watch(function() {
                return getFocusedInvalidInputsCount(table, indexes);
            }, function(count) {
                if (!wasFocused) {
                    wasFocused = true;
                } else if(count) {
                    stopWatcher();
                    columns = findColumns(table, indexes);
                    subHeaders = findSubHeaders(header, indexes);
                    watchColumnsForInvalidInputs();
                }
            }, true);

            function clear() {
                subHeaders = undefined;
                columns = undefined;
                messageDiv = undefined;
            }

            var lastValue;
            function watchColumnsForInvalidInputs() {
                scope.$watch(function() {
                    return hasInvalidInputsInColumns(columns);
                }, function(hasInvalidInputsInColumns) {
                    if (hasInvalidInputsInColumns) {
                        header.addClass('is-invalid');
                        header.controller('popover').addElement(messageDiv);
                        subHeaders.addClass('is-invalid');
                    } else {
                        header.removeClass('is-invalid');
                        header.controller('popover').removeElement(messageDiv);
                        subHeaders.removeClass('is-invalid');
                    }
                }, true);
            }
        }

        function getFocusedInvalidInputsCount(table, indexes) {
            var selector =
                'tr.is-focused > ' +
                'td:nth-child(n + ' + indexes.startIndex + ')' +
                  ':nth-child(-n + ' + indexes.endIndex + ') > ' +
                'div > ' +
                'input.ng-invalid';

            return table.find(selector).length;
        }

        function hasInvalidInputsInColumns(columns) {
            return columns.find('.is-invalid').length > 0;
        }

        function findSubHeaders(header, indexes) {
            var selector =
                'tr:nth-child(n + ' + (header.parent().index() + 2) + ') > ' +
                'th:nth-child(n + ' + indexes.startIndex + ')' +
                  ':nth-child(-n + ' + indexes.endIndex + ')';

            return header.parents('thead').find(selector);

        }

        function findColumns(table, indexes) {
            var selector =
                'td:nth-child(n + ' + indexes.startIndex + ')' +
                  ':nth-child(-n + ' + indexes.endIndex + ')';

            return table.find(selector);
        }

        function calculateIndexes(element) {
            var indexes = {};

            if (element.prev().length) {
                indexes.startIndex = calculateIndexes(element.prev()).endIndex + 1;
            } else {
                indexes.startIndex = 1;
            }

            indexes.endIndex = indexes.startIndex + parseInt(element.attr('colspan') || 1) - 1;
            return indexes;
        }
    }
})();
