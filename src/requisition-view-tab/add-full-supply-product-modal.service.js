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
     * @name requisition-view-tab.addFullSupplyProductModalService
     *
     * @description
     * It shows modal with possibility to add full supply line item
     * with one or more products that were previously skipped.
     */
    angular
        .module('requisition-view-tab')
        .service('addFullSupplyProductModalService', service);

    service.$inject = [
        'openlmisModalService', 'paginationService', '$filter', '$stateParams'
    ];

    function service(openlmisModalService, paginationService, $filter, $stateParams) {
        var dialog;

        this.show = show;

        /**
         * @ngdoc method
         * @methodOf requisition-view-tab.addFullSupplyProductModalService
         * @name show
         *
         * @description
         * Opens a modal responsible for un-skipping full supply product.
         *
         * @param  {Array} requisitionLineItems from the requisition containing list of available products
         * @return {promise}            a promise that resolves line items user wants to un-skip
         */
        function show(requisitionLineItems) {
            if (dialog) {
                return dialog.promise;
            }

            dialog = openlmisModalService.createDialog({
                controller: 'AddFullSupplyProductModalController',
                controllerAs: 'vm',
                templateUrl: 'requisition-view-tab/add-full-supply-product-modal.html',
                show: true,
                resolve: {
                    requisitionLineItems: function() {
                        return paginationService.registerList(null, $stateParams,
                            function() {
                                return $filter('filter')(requisitionLineItems, {
                                    skipped: 'true',
                                    $program: {
                                        fullSupply: true
                                    }
                                });
                            }, {
                                customPageParamName: 'pPage',
                                customSizeParamName: 'pSize'
                            });
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
