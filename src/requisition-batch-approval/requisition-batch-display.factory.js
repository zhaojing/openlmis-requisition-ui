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
     * @name requisition-batch-approval.requisitionBatchDisplayFactory
     *
     * @description
     * Takes a list of requisitions and will try to prepare them to display.
     *
     */
    angular
        .module('requisition-batch-approval')
        .factory('requisitionBatchDisplayFactory', factory);

    factory.$inject = ['$q', '$http', '$filter', 'openlmisUrlFactory', 'localStorageFactory', 'calculationFactory'];

    function factory($q, $http, $filter, openlmisUrlFactory, localStorageFactory, calculationFactory) {

        var requisitionBatchDisplayFactory = {
            prepareDataToDisplay: prepareDataToDisplay,
            calculateRequisitionTotalCost: calculateRequisitionTotalCost
        }

        return requisitionBatchDisplayFactory;

        /**
         * @ngdoc method
         * @methodOf requisition-batch-approval.requisitionBatchDisplayFactory
         * @name prepareDataToDisplay
         *
         * @param  {Object} requisitions the requisitions to display on batch approval view
         * @return {Object} dataToDisplay needed to display requisition on batch approval view
         *
         * @description
         * Prepares selected requisitions to be displayed on batch approval view.
         * Added columns, calculates total approved quantity and total cost of product in all facilities
         * and also calculates total cost of a requisition.
         *
         */
        function prepareDataToDisplay(requisitions) {
            var totalCost = 0,
                requisitionsList = [],
                products = {},
                lineItems = [],
                errors = [],
                columns = [],
                requisitionsCopy = [];

            addNewColumn(columns, true, false, ['requisitionBatchApproval.productCode']);
            addNewColumn(columns, true, false, ['requisitionBatchApproval.product']);

            angular.forEach(requisitions, function(requisition) {
                addNewColumn(columns, false, false, ['requisitionBatchApproval.approvedQuantity', 'requisitionBatchApproval.cost'], requisition);
                lineItems[requisition.id] = [];

                //method used in calculation factory
                requisition.$isAfterAuthorize = isAfterAuthorize;

                angular.forEach(requisition.requisitionLineItems, function(lineItem) {
                    lineItems[requisition.id][lineItem.orderable.id] = lineItem;
                    lineItem.totalCost = calculationFactory.totalCost(lineItem, requisition);
                    lineItem.approvedQuantity = lineItem.approvedQuantity ? lineItem.approvedQuantity : 0;

                    totalCost += lineItem.totalCost;

                    products[lineItem.orderable.id] = prepareProductDetails(products[lineItem.orderable.id], lineItem, requisition);
                });

                calculateRequisitionTotalCost(requisition);

                requisitionsList.push(requisition);

            });

            addNewColumn(columns, true, true, ['requisitionBatchApproval.totalQuantityForAllFacilities']);
            addNewColumn(columns, true, true, ['requisitionBatchApproval.totalCostForAllFacilities']);

            //save copy to provide revert functionality
            requisitionsCopy = angular.copy(requisitions);

            var dataToDisplay = {
                totalCost: totalCost,
                requisitions: requisitionsList,
                products: products,
                lineItems: lineItems,
                errors: errors,
                columns: columns,
                requisitionsCopy: requisitionsCopy
            }
            return dataToDisplay;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-batch-approval.requisitionBatchDisplayFactory
         * @name calculateRequisitionTotalCost
         *
         * @param  {Object} requisition the requisition with line items to calculate the value from
         * @return {Number} the value of calculated total cost
         *
         * @description
         * Calculates the value of the total cost column based on the given line item.
         *
         */
        function calculateRequisitionTotalCost(requisition) {
            requisition.$totalCost = 0;
            angular.forEach(requisition.requisitionLineItems, function(lineItem) {
                requisition.$totalCost += lineItem.totalCost;
            });

            return requisition.$totalCost;
        }

        // Requisitions in this view are always IN_APPROVAL or AUTHORIZED so always return true
        function isAfterAuthorize() {
            return true;
        }

        function addNewColumn(columns, isSticky, isStickyRight, names, requisition) {
            columns.push({
                id: requisition ? requisition.id : columns.length,
                requisition: requisition,
                sticky: isSticky,
                right: isStickyRight,
                names: names
            });
        }

        function prepareProductDetails(product, lineItem, requisition) {
            if (product !== undefined) {
                product.requisitions.push(requisition.id);
                product.totalCost += lineItem.totalCost;
                product.totalQuantity += lineItem.approvedQuantity;
            } else {
                product = {
                    code: lineItem.orderable.productCode,
                    name: lineItem.orderable.fullProductName,
                    totalCost: lineItem.totalCost,
                    totalQuantity: lineItem.approvedQuantity,
                    requisitions: [requisition.id]
                };
            }
        return product;
        }
    }

})();
