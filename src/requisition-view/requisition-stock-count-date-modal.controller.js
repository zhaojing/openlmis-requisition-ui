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
     * @name requisition-view.controller:RequisitionStockCountDateModalController
     *
     * @description
     * Manages stock count date modal.
     */
    angular
        .module('requisition-view')
        .controller('RequisitionStockCountDateModalController', controller);

    controller.$inject = [
        'requisition', 'modalDeferred', 'messageService'
    ];

    function controller(requisition, modalDeferred, messageService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.submit = submit;

        /**
         * @ngdoc property
         * @propertyOf requisition-view.controller:RequisitionStockCountDateModalController
         * @name requsition
         * @type {Object}
         *
         * @description
         * Requisition object which will be updated with new datePhysicalStockCountCompleted.
         */
        vm.requisition = {};

        /**
         * @ngdoc property
         * @propertyOf requisition-view.controller:RequisitionStockCountDateModalController
         * @name maxDate
         * @type {Date}
         *
         * @description
         * Object that store max date.
         */
        vm.maxDate = undefined;

        /**
         * @ngdoc property
         * @propertyOf requisition-view.controller:RequisitionStockCountDateModalController
         * @name invalidMessage
         * @type {String}
         *
         * @description
         * Holds form error message.
         */
        vm.invalidMessage = undefined;

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionStockCountDateModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the RequisitionStockCountDateModalController.
         */
        function onInit() {
            vm.requisition = requisition;
            if (vm.requisition.datePhysicalStockCountCompleted) {
                vm.requisition.datePhysicalStockCountCompleted =
                    new Date(vm.requisition.datePhysicalStockCountCompleted);
            }
            vm.maxDate = new Date();
        }

        /**
         * @ngdoc method
         * @methodOf requisition-view.controller:RequisitionStockCountDateModalController
         * @name submit
         *
         * @description
         * validate date and resolve modal.
         *
         * @return {Promise} resolves if date is not after today.
         */
        function submit() {
            if (vm.requisition.datePhysicalStockCountCompleted <= new Date()) {
                modalDeferred.resolve();
            } else {
                vm.invalidMessage = messageService.get('requisitionView.datePhysicalStockCountCompleted.inFuture');
            }
        }
    }
})();
