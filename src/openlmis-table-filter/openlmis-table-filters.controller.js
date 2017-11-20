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

    angular
        .module('openlmis-table-filter')
        .controller('OpenlmisTableFiltersController', OpenlmisTableFiltersController);

    OpenlmisTableFiltersController.$inject = ['$scope', '$compile']

    function OpenlmisTableFiltersController($scope, $compile) {
        var form, forms, submitButton, filterButton, ngModels,
            SUBMIT_ELEMENT = '[type="submit"]',
            NGMODEL_ELEMENT = '[ng-model]',
            vm = this;

        vm.$onInit = onInit;
        vm.registerElement = registerElement;
        vm.getFormElement = getFormElement;
        vm.getFilterButton = getFilterButton;
        vm.$onDestroy = onDestroy;

        function onInit() {
            vm.elements = [];
            ngModels = {};
            vm.filledInputs = [];

            form = compileForm();
            filterButton = compileFilterButton();

            form.on('submit', onFormSubmit);

            submitButton = form.find(SUBMIT_ELEMENT);

            openPopoverIfFormIsInvalidAndPristine();
        }

        function onFormSubmit() {
            if (forms) {
                forms.each(function(index, form) {
                    angular.element(form).trigger('submit');
                });
            }
            broadcastEvent();
        }

        function registerElement(element) {
            var submit = element.find(SUBMIT_ELEMENT);
            if (submit.length ) {
                submitButton.replaceWith(submit);
            }

            if (element.is('form')) {
                if (!forms) {
                    forms = element;
                } else {
                    forms.push(element);
                }
                form.prepend(element.children().not(SUBMIT_ELEMENT));
                element.detach();
            } else if (element.is(SUBMIT_ELEMENT)) {
                submitButton.replaceWith(element);
            } else {
                form.prepend(element);
            }

            if (element.is(NGMODEL_ELEMENT)) {
                watchNgModel(null, element);
            }
            element.find(NGMODEL_ELEMENT).each(watchNgModel)
        }

        function watchNgModel(index, ngModelElement) {
            var name = ngModelElement.attr('name'),
                ngModelCtrl = ngModelElement.controller('ngModel');

            $scope.$watch(
            function() {
                return ngModelCtrl.$isEmpty();
            },
            function(isEmpty) {
                var index = vm.filledInputs.indexOf(name);
                if (isEmpty) {
                    if (index > -1) {
                        vm.filledInputs.splice(index, 1);
                    }
                } else {
                    if (index === -1) {
                        vm.filledInputs.push(name);
                    }
                }
            });
        }

        function getFormElement() {
            return form;
        }

        function getFilterButton() {
            return filterButton;
        }

        function onDestroy() {
            filterButton.popover('hide');

            submitButton.remove();
            filterButton.remove();
            form.remove();

            submitButton = undefined;
            filterButton = undefined;
            form = undefined;
        }

        function broadcastEvent() {
            var modelValues = {};
            form.find(NGMODEL_ELEMENT).each(function(index, ngModelElement) {
                var element = angular.element(ngModelElement),
                    name = element.attr('name'),
                    modelValue = element.controller('ngModel').$modelValue;

                modelValues[name] = modelValue;
            });
            $scope.$broadcast('openlmis-table-filter', modelValues);
        }

        function openPopoverIfFormIsInvalidAndPristine() {
            var formCtrl = form.controller('form');
            var stopWatching = $scope.$watch(function() {
                return formCtrl.$invalid && formCtrl.$pristine;
            }, function(invalid) {
                if (invalid) {
                    filterButton.popover('show');
                    stopWatching();
                }
            }, true);
        }

        function compileForm() {
            return compileElement(
                '<form>' +
                    '<input id="close-filters" type="button" value="{{\'openlmisTableFilter.cancel\' | message}}"/>' +
                    '<input type="submit" value="{{\'openlmisTableFilter.update\' | message}}"/>' +
                '</form>'
            );
        }

        function compileFilterButton() {
            var filterButton = compileElement('<button class="filters">{{\'openlmisTableFilter.filter\' | message}}: {{vm.filledInputs.length}}</button>');

            filterButton.popover({
                html: true,
                container: 'body',
                placement: 'auto top',
                content: form
            })
            .data('bs.popover')
            .tip()
            .addClass('openlmis-table-filters');

            form.on('submit', hidePopover);
            form.find('#close-filters').on('click', hidePopover);

            return filterButton;
        }

        function compileElement(markup) {
            return $compile(angular.element(markup))($scope);
        }

        function hidePopover() {
            filterButton.popover('hide');
        }
    }

})();
