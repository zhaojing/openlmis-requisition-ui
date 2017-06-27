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
     * @name requisition-losses-and-adjustments.lossesAndAdjustmentsModalService
     *
     * @description
     * Manages Total Losses and Adjustments modal.
     */
    angular
        .module('requisition-losses-and-adjustments')
        .service('lossesAndAdjustmentsModalService', lossesAndAdjustmentsModalService);

    lossesAndAdjustmentsModalService.$inject = [
        'openlmisModalService'
    ];

    function lossesAndAdjustmentsModalService(openlmisModalService) {
        var dialog;

        this.open = open;

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.lossesAndAdjustmentsModalService
         * @name open
         *
         * @description
         * Open Total Losses and Adjustmnets modal.
         */
        function open(lineItem, requisition) {
            openlmisModalService.createDialog({
                controller: 'LossesAndAdjustmentsModalController',
                controllerAs: 'vm',
                templateUrl: 'requisition-losses-and-adjustments/losses-and-adjustments-modal.html',
                show: true,
                resolve: {
                    lineItem: function() {
                        return lineItem;
                    },
                    requisition: function() {
                        return requisition;
                    }
                }
            });
        }
    }

})();
