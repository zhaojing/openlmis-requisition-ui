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
     * @name requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
     *
     * @description
     * Provides methods for Losses and Adjustments modal.
     */
    angular
        .module('requisition-losses-and-adjustments')
        .controller('LossesAndAdjustmentsModalController', lossesAndAdjustmentsController);

    lossesAndAdjustmentsController.$inject = [
        '$filter', 'calculationFactory', 'requisitionValidator', 'reasons', 'adjustments',
        'modalDeferred'
    ];

    function lossesAndAdjustmentsController($filter, calculationFactory, requisitionValidator,
                                            reasons, adjustments, modalDeferred) {
        var vm = this;

        vm.$onInit = onInit;
        vm.addAdjustment = addAdjustment;
        vm.removeAdjustment = removeAdjustment;
        vm.getReasonName = getReasonName;
        vm.getTotal = getTotal;
        vm.hideModal = modalDeferred.reject;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name adjustments
         * @type {Array}
         *
         * @description
         * Line item adjustments that will be updated.
         */
        vm.adjustments = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name reasons
         * @type {Array}
         *
         * @description
         * Possible reasons that user can choose from.
         */
        vm.reasons = undefined;

        /**
         * @ngdoc methodOf
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the LossesAndAdjustmentsModalController.
         */
        function onInit() {
            vm.adjustments = adjustments;
            vm.reasons = reasons;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name addAdjustment
         *
         * @description
         * Adds adjustment to line item.
         */
        function addAdjustment() {
            var adjustment = {
                reasonId: vm.adjustment.reason.id,
                quantity: vm.adjustment.quantity
            };

            vm.adjustments.push(adjustment);

            vm.adjustment.quantity = undefined;
            vm.adjustment.reason = undefined;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name removeAdjustment
         *
         * @description
         * Removes adjustment to line item.
         *
         * @param {Object}  adjustment  the adjustment to be removed
         */
        function removeAdjustment(adjustment) {
            var index = vm.adjustments.indexOf(adjustment);
            vm.adjustments.splice(index, 1);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name getReasonName
         *
         * @description
         * Returns reason name by given reason id.
         *
         * @param  {String} reasonId reason UUID
         * @return {String}          reason name
         */
        function getReasonName(reasonId) {
            var reason = $filter('filter')(vm.reasons, {
                id: reasonId}, true
            );

            if (reason && reason.length) {
                return reason[0].name;
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-losses-and-adjustments.controller:LossesAndAdjustmentsModalController
         * @name getTotal
         *
         * @description
         * Calculates total losses and adjustments for line item.
         *
         * @return {Number} total value of losses and adjustments
         */
        function getTotal() {
            return calculationFactory.totalLossesAndAdjustments(vm.adjustments, vm.reasons);
        }
    }

})();
