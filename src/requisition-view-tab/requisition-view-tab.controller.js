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

(function () {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-view-tab.controller:ViewTabController
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-view-tab')
        .controller('ViewTabController', ViewTabController);

    ViewTabController.$inject = [
        '$filter', 'addProductModalService', 'addFullSupplyProductModalService',
        'requisitionValidator', 'requisition', 'columns', 'messageService',
        'lineItems', 'alertService', 'canSubmit', 'canAuthorize', 'fullSupply', 'categoryFactory',
        'TEMPLATE_COLUMNS'
    ];


    function ViewTabController($filter, addProductModalService, addFullSupplyProductModalService,
                               requisitionValidator, requisition, columns, messageService,
                               lineItems, alertService, canSubmit, canAuthorize, fullSupply,
                               categoryFactory, TEMPLATE_COLUMNS) {

        var vm = this;

        vm.$onInit = onInit;
        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.addFullSupplyProduct = addFullSupplyProduct;
        vm.showDeleteColumn = showDeleteColumn;
        vm.isLineItemValid = requisitionValidator.isLineItemValid;
        vm.getDescriptionForColumn = getDescriptionForColumn;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:ViewTabController
         * @name lineItems
         * @type {Array}
         *
         * @description
         * Holds all requisition line items.
         */
        vm.lineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:ViewTabController
         * @name items
         * @type {Array}
         *
         * @description
         * Holds all items that will be displayed.
         */
        vm.items = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:ViewTabController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = undefined;

        /**
         * @ngdoc property
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name showAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag defining whether to show or hide the Add Product button based on the requisition
         * status and user rights.
         */
        vm.showAddProductButton = undefined;

        /**
         * @ngdoc property
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name showAddFullSupplyProductButton
         * @type {Boolean}
         *
         * @description
         * Flag defining whether to show or hide the Add Product button based on the requisition
         * status and user rights and requisition template configuration.
         */
        vm.showAddFullSupplyProductButton = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:ViewTabController
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
            vm.userCanEdit = canAuthorize || canSubmit;
            vm.showAddProductButton = showAddProductButton();
            vm.showSkipControls = showSkipControls();
            vm.noProductsMessage = getNoProductsMessage();
            vm.showAddFullSupplyProductButton = showAddFullSupplyProductButton();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:ViewTabController
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
            refreshLineItems();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name showDeleteColumn
         *
         * @description
         * Checks whether the delete column should be displayed. The column is visible only if any
         * of the line items is deletable.
         *
         * @return {Boolean} true if the delete column should be displayed, false otherwise
         */
        function showDeleteColumn() {
            return !fullSupply &&
                vm.userCanEdit &&
                hasDeletableLineItems();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid. If there are no products to
         * be added an alert will be shown.
         */
        function addProduct() {
            var availableProducts = getAvailableProducts();

            if (availableProducts.length) {
                var categories = categoryFactory.groupProducts(
                    availableProducts,
                    requisition.program.id
                );

                addProductModalService.show(categories, fullSupply)
                    .then(function (lineItem) {
                        vm.requisition.addLineItem(
                            lineItem.orderable,
                            lineItem.requestedQuantity,
                            lineItem.requestedQuantityExplanation
                        );
                        refreshLineItems();
                    });
            } else {
                alertService.error(
                    'requisitionViewTab.noProductsToAdd.label',
                    'requisitionViewTab.noProductsToAdd.message'
                );
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name getDescriptionForColumn
         *
         * @description
         * Opens modal that lets the user add new product to the grid. If there are no products to
         * be added an alert will be shown.
         */
        function getDescriptionForColumn(column) {
            if (requisition.template.populateStockOnHandFromStockCards &&
                column.name === TEMPLATE_COLUMNS.TOTAL_LOSSES_AND_ADJUSTMENTS) {
                return column.definition + ' ' + messageService.get('requisitionViewTab.totalLossesAndAdjustment.disabled');
            }
            return column.definition;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:ViewTabController
         * @name addFullSupplyProduct
         *
         * @description
         * Opens modal that lets the user add new full supply product to the grid.
         * If there are no products to
         * be added an alert will be shown.
         */
        function addFullSupplyProduct() {
            addFullSupplyProductModalService.show(vm.requisition.requisitionLineItems)
                .then(function (result) {
                    result.items.forEach(function(item) {
                        item.skipped = false;
                        vm.items.unshift(item);
                    });
                });
        }

        function refreshLineItems() {
            var filterObject = (fullSupply &&
                                    vm.requisition.template.hasSkipColumn() &&
                                    vm.requisition.template.hideSkippedLineItems()) ?
                                                                {
                                                                    skipped: "!true",
                                                                    $program: {
                                                                        fullSupply: fullSupply
                                                                    }
                                                                } : {
                                                                    $program: {
                                                                        fullSupply: fullSupply
                                                                    }
                                                                };

            var lineItems = $filter('filter')(vm.requisition.requisitionLineItems, filterObject);


            vm.lineItems = $filter('orderBy')(lineItems, [
                '$program.orderableCategoryDisplayOrder',
                '$program.orderableCategoryDisplayName',
                '$program.displayOrder',
                'orderable.fullProductName'
            ]);
        }

        function showSkipControls() {
            return fullSupply &&
                !requisition.emergency &&
                vm.userCanEdit &&
                requisition.template.hasSkipColumn();
        }

        function showAddProductButton() {
            return vm.userCanEdit &&
                (!fullSupply || requisition.emergency);
        }

        function showAddFullSupplyProductButton() {
            return (vm.userCanEdit &&
                        fullSupply &&
                        !requisition.emergency &&
                        requisition.template.hideSkippedLineItems());
        }

        function hasDeletableLineItems() {
            var hasDeletableLineItems = false;

            vm.requisition.requisitionLineItems.forEach(function(lineItem) {
                hasDeletableLineItems = hasDeletableLineItems || lineItem.$deletable;
            });

            return hasDeletableLineItems;
        }

        function getAvailableProducts() {
            if (fullSupply) {
                return requisition.getAvailableFullSupplyProducts();
            }
            return requisition.getAvailableNonFullSupplyProducts();
        }

        function getNoProductsMessage() {
            return fullSupply ?
                'requisitionViewTab.noFullSupplyProducts' :
                'requisitionViewTab.noNonFullSupplyProducts';
        }
    }

})();
