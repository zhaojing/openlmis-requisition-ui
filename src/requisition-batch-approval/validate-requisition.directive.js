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
     * @ngdoc directive
     * @name requisition-batch-approval.invalidateRequisition
     *
     * @description
     * Validates requisition every time the error message is shown/hidden.
     */
    angular
        .module('requisition-batch-approval')
        .directive('validateRequisition', directive);

    directive.$inject = ['messageService'];

    function directive(messageService) {
        var directive = {
            link: link,
            scope: {
                requisition: '=validateRequisition'
            }
        }
        return directive;

        function link(scope, element, attrs) {
            var wrapper = element.parent(),
                requisition = scope.requisition;

            wrapper.on('openlmisInvalid.show', validateRequisition(requisition));
            wrapper.on('openlmisInvalid.hide', validateRequisition(requisition));

            function validateRequisition(requisition) {
                return function() {
                    var valid = true;

                    angular.forEach(requisition.requisitionLineItems, function(lineItem) {
                        valid = valid && lineItem.approvedQuantity !== undefined;
                    });

                    requisition.$error = !valid ?
                        messageService.get("requisitionBatchApproval.invalidRequisition") :
                        undefined;
                }
            }
        }
    }

})();
