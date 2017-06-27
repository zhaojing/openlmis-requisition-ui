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
     * @name requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
     *
     * @description
     * Controller for the losses and adjustments directive.
     */
    angular
        .module('requisition-losses-and-adjustments')
        .controller('LossesAndAdjustmentsController', lossesAndAdjustmentsController);

    lossesAndAdjustmentsController.$inject = [
        '$scope', 'lossesAndAdjustmentsModalService'
    ];

    function lossesAndAdjustmentsController($scope, lossesAndAdjustmentsModalService) {
        var vm = this;

        vm.$onInit = onInit;
        vm.showModal = showModal;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @type {Object}
         * @name lineItem
         *
         * @description
         * Line item to display the calculated value of total losses and adjustments.
         */
        vm.lineItem = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name $onInit
         *
         * @description
         * Initialization method of the LossesAndAdjustmentsController.
         */
        function onInit() {
            vm.lineItem = $scope.lineItem;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsController
         * @name showModal
         *
         * @description
         * Opens Total Losses and Adjustments modal.
         */
        function showModal() {
            lossesAndAdjustmentsModalService.open(vm.lineItem, $scope.requisition);
        }
    }

})();
