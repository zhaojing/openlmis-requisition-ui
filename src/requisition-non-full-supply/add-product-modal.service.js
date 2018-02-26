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
     * @ngdoc service
     * @name requisition-non-full-supply.addProductModalService
     *
     * @description
     * It shows modal with possibility to add non-full supply line item
     * with one of given products.
     */
    angular
        .module('requisition-non-full-supply')
        .service('addProductModalService', service);

    service.$inject = [
        'openlmisModalService'
    ];

    function service(openlmisModalService) {
        var dialog;

        this.show = show;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.addProductModalService
         * @name show
         *
         * @description
         * Opens a modal responsible for adding new non full supply available product.
         *
         * @param  {Object} requisition the requisition containing list of available products
         * @return {Object}             the new product
         */
        function show(categories) {
            if (dialog) return dialog.promise;

            dialog = openlmisModalService.createDialog({
                controller: 'AddProductModalController',
                controllerAs: 'vm',
                templateUrl: 'requisition-non-full-supply/add-product-modal.html',
                show: true,
                resolve: {
                    categories: function() {
                        return categories;
                    }
                }
            });

            dialog.promise.finally(function() {
                dialog = undefined;
            });

            return dialog.promise;
        }
    }

})();
