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
     * @name requisition-view-tab.controller:AddProductModalController
     *
     * @description
     * Manages Add Product Modal and provides method for checking categories/products visibility
     * and adding products.
     */
    angular
        .module('requisition-view-tab')
        .controller('AddProductModalController', controller);

    controller.$inject = ['modalDeferred', 'categories', 'fullSupply'];

    function controller(modalDeferred, categories, fullSupply) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addProduct = addProduct;
        vm.close = modalDeferred.reject;

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddProductModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the AddProductModalController.
         */
        function onInit() {
            vm.categories = categories;
            vm.fullSupply = fullSupply;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.controller:AddProductModalController
         * @name addProduct
         *
         * @description
         * Resolves promise with line item created from parameters.
         */
        function addProduct() {
            modalDeferred.resolve({
                requestedQuantity: vm.requestedQuantity,
                requestedQuantityExplanation: vm.requestedQuantityExplanation,
                orderable: vm.selectedProduct
            });
        }
    }

})();
