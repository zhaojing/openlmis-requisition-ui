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
     * @ngdoc controller
     * @name requisition-full-supply.controller:FullSupplyController
     *
     * @description
     * Responsible for managing product grid for full supply products.
     */
    angular
        .module('requisition-full-supply')
        .controller('FullSupplyController', controller);

    controller.$inject = ['$controller', 'requisitionValidator', 'TEMPLATE_COLUMNS', 'requisition', 'columns', 'lineItems', 'REQUISITION_RIGHTS', 'canAuthorize'];

    function controller($controller, requisitionValidator, TEMPLATE_COLUMNS, requisition, columns, lineItems, REQUISITION_RIGHTS, canAuthorize) {

        var vm = this;

        vm.$onInit = onInit;
        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.controller:FullSupplyController
         * @name lineItems
         * @type {Array}
         *
         * @description
         * Holds all requisition line items.
         */
        vm.lineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.controller:FullSupplyController
         * @name items
         * @type {Array}
         *
         * @description
         * Holds current page of items.
         */
        vm.items = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.controller:FullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and nonFullSupply states.
         */
        vm.requisition = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.controller:FullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.controller:FullSupplyController
         * @name skippedAll
         * @type {Boolean}
         *
         * @description
         * Indicates if the skip all button has been clicked.
         */
        vm.skippedAll = undefined;

        function onInit() {
            vm.lineItems = lineItems;
            vm.requisition = requisition;
            vm.columns = columns;
            vm.skippedAll = false;
            vm.areSkipControlsVisible = areSkipControlsVisible();
        }

        /**
         *
         * @ngdoc method
         * @methodOf requisition-full-supply.controller:FullSupplyController
         * @name isLineItemValid
         *
         * @description
         * Checks whether any field of the given line item has any error. It does not perform any
         * validation. It is an exposure of the isLineItemValid method of the requisitionValidator.
         *
         * @param  {Object}  lineItem the line item to be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        vm.isLineItemValid = requisitionValidator.isLineItemValid;

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.controller:FullSupplyController
         * @name areSkipControlsVisible
         *
         * @description
         * Checks if the current requisition template has a skip column, and if the requisition state allows for skipping.
         */
        function areSkipControlsVisible() {
            if (!requisition.$isInitiated() && !requisition.$isRejected() &&
                !(canAuthorize && requisition.$isSubmitted())) {
                return false;
            }

            var hasSkipColumn = false;
            columns.forEach(function(column){
                if (column.isSkipColumn()){
                    hasSkipColumn = true;
                }
            });
            return hasSkipColumn;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.controller:FullSupplyController
         * @name skipAll
         *
         * @description
         * Sets all line items that are skippable from a requisition as skipped.
         */
        function skipAll() {
            setSkipAll(true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.controller:FullSupplyController
         * @name unskipAll
         *
         * @description
         * Sets all line items from a requisition as not skipped.
         */
        function unskipAll() {
            setSkipAll(false);
        }

        function setSkipAll(value) {
            angular.forEach(vm.lineItems, function(lineItem) {
                if (lineItem.canBeSkipped(vm.requisition)) {
                    lineItem.skipped = value;
                }
            });
            vm.skippedAll = value;
        }
    }

})();
