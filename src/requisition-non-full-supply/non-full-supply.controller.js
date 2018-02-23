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
     * @name requisition-non-full-supply.controller:NonFullSupplyController
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('NonFullSupplyController', nonFullSupplyController);

    nonFullSupplyController.$inject = [
        '$filter', 'addProductModalService', 'LineItem', 'requisitionValidator',
        'requisition', 'columns', 'lineItems', '$state', '$stateParams', 'alertService',
        'REQUISITION_RIGHTS', 'canSubmit', 'canAuthorize'
    ];

    function nonFullSupplyController($filter, addProductModalService, LineItem, requisitionValidator,
                                    requisition, columns, lineItems, $state, $stateParams,
                                    alertService, REQUISITION_RIGHTS, canSubmit, canAuthorize) {

        var vm = this;

        vm.$onInit = onInit;
        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;
        vm.isLineItemValid = requisitionValidator.isLineItemValid;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name lineItems
         * @type {Array}
         *
         * @description
         * Holds all requisition line items.
         */
        vm.lineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name items
         * @type {Array}
         *
         * @description
         * Holds all items that will be displayed.
         */
        vm.items = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = undefined;

        /**
         * @ngdoc property
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Method responsible for hiding/showing the Add Product button based on the requisition status
         * and user rights.
         */
        vm.displayAddProductButton = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = undefined;

        function onInit() {
            vm.lineItems = lineItems;
            vm.requisition = requisition;
            vm.columns = columns;
            vm.displayAddProductButton = displayAddProductButton();
            vm.areSkipControlsVisible = areSkipControlsVisible();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name deleteLineItem
         *
         * @description
         * Deletes the given line item, removing it from the grid and returning the product to the
         * list of approved products.
         *
         * @param {Object} lineItem the line item to be deleted
         */
        function deleteLineItem(lineItem) {
            vm.requisition.deleteLineItem(lineItem);
            reload();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid. If there are no products to
         * be added an alert will be shown.
         */
        function addProduct() {
            if (hasProductsToAdd(vm.requisition)) {
                addProductModalService.show(
                    vm.requisition
                ).then(function(lineItem) {
                    vm.requisition.addLineItem(
                        lineItem.orderable,
                        lineItem.requestedQuantity,
                        lineItem.requestedQuantityExplanation
                    );
                    reload();
                });
            } else {
                alertService.error(
                    'requisitionNonFullSupply.noProductsToAdd.label',
                    'requisitionNonFullSupply.noProductsToAdd.message'
                );
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name displayDeleteColumn
         *
         * @description
         * Checks whether the delete column should be displayed. The column is visible only if any
         * of the line items is deletable.
         *
         * @return {Boolean} true if the delete column should be displayed, false otherwise
         */
        function displayDeleteColumn() {
            var display = false;
            vm.requisition.requisitionLineItems.forEach(function(lineItem) {
                display = display || lineItem.$deletable;
            });
            return display;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.controller:NonFullSupplyController
         * @name areSkipControlsVisible
         *
         * @description
         * Checks if the current requisition template has a skip column, and if the requisition
         * state allows for skipping.
         */
        function areSkipControlsVisible() {
            if (!requisition.$isInitiated() && !requisition.$isRejected() &&
                !(canAuthorize && requisition.$isSubmitted())) {
                return false;
            }

            return requisition.template.hasSkipColumn();
        }

        function filterRequisitionLineItems() {
            var nonFullSupplyLineItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:false
                }
            });

            return $filter('orderBy')(nonFullSupplyLineItems, [
                '$program.orderableCategoryDisplayOrder',
                '$program.orderableCategoryDisplayName',
                '$program.displayOrder',
                'orderable.fullProductName'
            ]);
        }

        function reload() {
            vm.lineItems = filterRequisitionLineItems();
        }

        function hasProductsToAdd(requisition) {
            var hasProducts = false;

            angular.forEach(requisition.availableNonFullSupplyProducts, function(product) {
                hasProducts = hasProducts || ((product.$visible || product.$visible === undefined)
                && $filter('filter')(requisition.$getProducts(true), {
                    orderable: {
                        id: product.id
                    }
                }).length === 0);
            });

            return hasProducts;
        }

        function displayAddProductButton() {
            if (vm.requisition.$isInitiated() || vm.requisition.$isRejected()) {
                // only people with create rights should be able to edit new/rejected
                // requisitions
                return canSubmit;
            } else if (vm.requisition.$isSubmitted()) {
                // only authorizers should be able to edit submitted requisitions
                return canAuthorize;
            } else {
                return false;
            }
        }
    }

})();
