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

    angular
        .module('requisition')
        .factory('RequisitionLineItemDataBuilder', RequisitionLineItemDataBuilder);

    RequisitionLineItemDataBuilder.$inject = ['LineItem', 'OrderableDataBuilder'];

    function RequisitionLineItemDataBuilder(LineItem, OrderableDataBuilder) {

        RequisitionLineItemDataBuilder.prototype.build = build;
        RequisitionLineItemDataBuilder.prototype.buildJson = buildJson;
        RequisitionLineItemDataBuilder.prototype.withOrderable = withOrderable;
        RequisitionLineItemDataBuilder.prototype.buildForProgram = buildForProgram;
        RequisitionLineItemDataBuilder.prototype.buildNonFullSupplyForProgram =
            buildNonFullSupplyForProgram;

        return RequisitionLineItemDataBuilder;

        function RequisitionLineItemDataBuilder() {
            RequisitionLineItemDataBuilder.instanceNumber =
                (RequisitionLineItemDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = RequisitionLineItemDataBuilder.instanceNumber;

            this.id = 'requisition-line-item-id-' + instanceNumber;
            this.orderable = new OrderableDataBuilder().buildJson();
            this.beginningBalance = 50;
            this.totalReceivedQuantity = 0;
            this.totalLossesAndAdjustments = -5;
            this.stockOnHand = 45;
            this.requestedQuantity = 0;
            this.totalConsumedQuantity = 0;
            this.requestedQuantityExplanation = 'we need more';
            this.totalStockoutDays = 0;
            this.pricePerPack = 5.23;
            this.skipped = false;
            this.adjustedConsumption = 0;
            this.previousAdjustedConsumptions = [50];
            this.averageConsumption = 25;
            this.maxPeriodsOfStock = 5.00;
            this.stockAdjustments = [{
                id: '120557a7-1354-47b5-9579-8717324a3179',
                reasonId: 'e3fc3cf3-da18-44b0-a220-77c985202e06',
                quantity: 15
            }, {
                id: 'ce50aa66-9465-4a0a-94c5-e389ecd97d45',
                reasonId: '5b09202e-b8a7-4f77-9e0e-8156f8efc613',
                quantity: 20
            }];
        }

        function build() {
            return new LineItem(this.buildJson());
        }

        function buildJson() {
            var builder = this;
            return {
                id: builder.id,
                orderable: builder.orderable,
                beginningBalance: builder.beginningBalance,
                totalReceivedQuantity: builder.totalReceivedQuantity,
                totalLossesAndAdjustments: builder.totalLossesAndAdjustments,
                stockOnHand: builder.stockOnHand,
                requestedQuantity: builder.requestedQuantity,
                totalConsumedQuantity: builder.totalConsumedQuantity,
                requestedQuantityExplanation: builder.requestedQuantityExplanation,
                totalStockoutDays: builder.totalStockoutDays,
                pricePerPack: builder.pricePerPack,
                skipped: builder.skipped,
                adjustedConsumption: builder.adjustedConsumption,
                previousAdjustedConsumptions: builder.previousAdjustedConsumptions,
                averageConsumption: builder.averageConsumption,
                maxPeriodsOfStock: builder.maxPeriodsOfStock,
                stockAdjustments: builder.stockAdjustments
            };
        }

        function withOrderable(orderable) {
            this.orderable = orderable;
            return this;
        }

        function buildForProgram(program) {
            var instanceNumber = RequisitionLineItemDataBuilder.instanceNumber;
            this.orderable = new OrderableDataBuilder()
                .withPrograms([{
                    programId: program.id,
                    orderableDisplayCategoryId: 'orderable-display-category-id-' + instanceNumber,
                    orderableCategoryDisplayName: 'Category ' + instanceNumber,
                    orderableCategoryDisplayOrder: instanceNumber,
                    fullSupply: true,
                    displayOrder: 5,
                    pricePerPack: 4.34
                }])
                .buildJson();
            return this.build();
        }

        function buildNonFullSupplyForProgram(program) {
            var instanceNumber = RequisitionLineItemDataBuilder.instanceNumber;
            this.orderable = new OrderableDataBuilder()
                .withPrograms([{
                    programId: program.id,
                    orderableDisplayCategoryId: 'orderable-display-category-id-' + instanceNumber,
                    orderableCategoryDisplayName: 'Category ' + instanceNumber,
                    orderableCategoryDisplayOrder: instanceNumber,
                    fullSupply: false,
                    displayOrder: 6,
                    pricePerPack: 20.00
                }])
                .buildJson();
            return this.build();
        }
    }

})();
