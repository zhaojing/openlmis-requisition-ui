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
     * @name requisition-view-tab.controller:AddFullSupplyProductModalController
     *
     * @description
     * Manages Add Product Modal and provides method for
     * and adding skipped products back to the requisition table.
     */
    angular
        .module('requisition-view-tab')
        .controller('AddFullSupplyProductModalController', controller);

    controller.$inject = ['modalDeferred', 'requisitionLineItems'];

    function controller(modalDeferred, requisitionLineItems) {
        var vm = this;
        vm.$onInit = onInit;
        vm.addProducts = addProducts;
        vm.close = modalDeferred.reject;
        vm.toggleAddLineItem = toggleAddLineItem;
        vm.refreshList = refreshList;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name requisitionLineItems
         * @type {Array}
         *
         * @description
         * Holds a list of skipped line items that are available to be un-skipped.
         */
        vm.requisitionLineItems = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name lineItemsToAdd
         * @type {Array}
         *
         * @description
         * Holds a list of full supply line items the user selected to un-skip.
         * These line items will not be un-skipped until the addProducts is triggered.
         */
        vm.lineItemsToAdd = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name searchText
         * @type {String}
         *
         * @description
         * Holds text entered in product search box.
         */
        vm.searchText = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name searchTextLowerCase
         * @type {String}
         *
         * @description
         * Holds text entered in product search box in lower case.
         */
        vm.searchTextLowerCase = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AddFullSupplyProductModalController.
         */
        function onInit() {
            vm.requisitionLineItems = requisitionLineItems;
            vm.lineItemsToAdd = [];
            vm.searchText = '';
            vm.refreshList();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name toggleAddLineItem
         *
         * @description
         * Adds or removes the line item to/from the list of items that will be un-skipped.
         */
        function toggleAddLineItem(item) {
            if (vm.lineItemsToAdd.indexOf(item) >= 0) {
                vm.lineItemsToAdd.splice(vm.lineItemsToAdd.indexOf(item), 1);
            } else {
                vm.lineItemsToAdd.push(item);
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name addProducts
         *
         * @description
         * Resolves promise with line items selected in the modal.
         */
        function addProducts() {
            modalDeferred.resolve({
                items: vm.lineItemsToAdd
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name searchByCodeAndName
         *
         * @description
         * Returns true if the product code starts with the search text or true if product full name contains the search text.
         */
        function searchByCodeAndName(item){
            return (item.orderable.fullProductName.toLowerCase().contains(vm.searchTextLowerCase) ||
                item.orderable.productCode.toLowerCase().startsWith(vm.searchTextLowerCase));
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddFullSupplyProductModalController
         * @name refreshList
         *
         * @description
         * Refreshes the product list so the add product dialog box shows only relevant products.
         */
        function refreshList(){
            if (vm.searchText === '') {
                vm.filteredLineItems = vm.requisitionLineItems;
            }else{
                vm.searchTextLowerCase = vm.searchText.toLowerCase();
                vm.filteredLineItems = vm.requisitionLineItems.filter(searchByCodeAndName);
            }
        }
    }

})();
