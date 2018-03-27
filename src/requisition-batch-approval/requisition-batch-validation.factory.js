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
     * @name requisition-batch-approval.requisitionBatchValidationFactory
     *
     * @description
     * Takes a list of requisitions and will try to validate all of them.
     */
    angular
        .module('requisition-batch-approval')
        .factory('requisitionBatchValidationFactory', factory);

    factory.$inject = ['$q', 'messageService', 'MAX_INTEGER_VALUE'];

    function factory($q, messageService, MAX_INTEGER_VALUE) {

        var factory = {
            validateRequisitions: validateRequisitions
        }
        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-batch-approval.requisitionBatchValidationFactory
         * @name validateRequisitions
         *
         * @param {Array} requisitions A list of requisition objects to validate
         *
         * @description
         * Main function of factory, which takes a list of requisitions
         * and validate them. If approved quantity is to large or empty it rejects promise,
         * otherwise promise will be resolved.
         */
        function validateRequisitions(requisitions) {
            var successfulRequisitions = [];

            requisitions.forEach(function(requisition) {
                if(validateRequisition(requisition)){
                    successfulRequisitions.push(requisition);
                }
            });

            if(successfulRequisitions.length < requisitions.length) {
                return $q.reject(successfulRequisitions);
            } else {
                return $q.resolve(successfulRequisitions);
            }
        }

        function validateRequisition(requisition) {
            var valid = true;
            angular.forEach(requisition.requisitionLineItems, function (lineItem) {
               valid = validateApprovedQuantity(lineItem) && valid;
            });

            return valid;
        }

        function validateApprovedQuantity(lineItem) {
            var error;

            if (lineItem.skipped) return true;
            if (isEmpty(lineItem.approvedQuantity)) {
                error = messageService.get('requisitionBatchApproval.required');
            } else if (lineItem.approvedQuantity > MAX_INTEGER_VALUE) {
                error = messageService.get('requisitionBatchApproval.numberTooLarge');
            }

            return isEmpty(error);
        }

        function isEmpty(value) {
            return value === null || value === undefined || value === '';
        }

        function removeFromStorage(requisition, storage) {
            storage.removeBy('id', requisition.id);
        }
    }

})();
