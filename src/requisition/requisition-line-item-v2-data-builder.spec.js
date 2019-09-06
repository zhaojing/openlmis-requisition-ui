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
        .factory('RequisitionLineItemV2DataBuilder', RequisitionLineItemV2DataBuilder);

    RequisitionLineItemV2DataBuilder.$inject = ['LineItem', 'OrderableDataBuilder',
        'FacilityTypeApprovedProductDataBuilder', 'VersionObjectReferenceDataBuilder'];

    function RequisitionLineItemV2DataBuilder(LineItem, OrderableDataBuilder, FacilityTypeApprovedProductDataBuilder,
                                              VersionObjectReferenceDataBuilder) {

        RequisitionLineItemV2DataBuilder.prototype.build = build;
        RequisitionLineItemV2DataBuilder.prototype.buildJson = buildJson;
        RequisitionLineItemV2DataBuilder.prototype.withOrderable = withOrderable;
        RequisitionLineItemV2DataBuilder.prototype.buildForProgram = buildForProgram;
        RequisitionLineItemV2DataBuilder.prototype.buildNonFullSupplyForProgram =
            buildNonFullSupplyForProgram;
        RequisitionLineItemV2DataBuilder.prototype.nonFullSupplyForProgram = nonFullSupplyForProgram;
        RequisitionLineItemV2DataBuilder.prototype.fullSupplyForProgram = fullSupplyForProgram;
        RequisitionLineItemV2DataBuilder.prototype.asSkipped = asSkipped;
        RequisitionLineItemV2DataBuilder.prototype.withTotalLossesAndAdjustments = withTotalLossesAndAdjustments;
        RequisitionLineItemV2DataBuilder.prototype.withBeginningBalance = withBeginningBalance;
        RequisitionLineItemV2DataBuilder.prototype.withTotalReceivedQuantity = withTotalReceivedQuantity;
        RequisitionLineItemV2DataBuilder.prototype.withTotalConsumedQuantity = withTotalConsumedQuantity;
        RequisitionLineItemV2DataBuilder.prototype.withStockOnHand = withStockOnHand;

        return RequisitionLineItemV2DataBuilder;

        function RequisitionLineItemV2DataBuilder() {
            RequisitionLineItemV2DataBuilder.instanceNumber =
                (RequisitionLineItemV2DataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = RequisitionLineItemV2DataBuilder.instanceNumber;

            this.id = 'requisition-line-item-id-' + instanceNumber;
            this.orderable = new VersionObjectReferenceDataBuilder().build();
            this.beginningBalance = 50;
            this.totalReceivedQuantity = 0;
            this.totalLossesAndAdjustments = -5;
            this.stockOnHand = 45;
            this.requestedQuantity = 0;
            this.totalConsumedQuantity = 0;
            this.requestedQuantityExplanation = 'we need more';
            this.totalStockoutDays = 0;
            this.skipped = false;
            this.adjustedConsumption = 0;
            this.previousAdjustedConsumptions = [50];
            this.averageConsumption = 25;
            this.stockAdjustments = [{
                id: '120557a7-1354-47b5-9579-8717324a3179',
                reasonId: 'e3fc3cf3-da18-44b0-a220-77c985202e06',
                quantity: 15
            }, {
                id: 'ce50aa66-9465-4a0a-94c5-e389ecd97d45',
                reasonId: '5b09202e-b8a7-4f77-9e0e-8156f8efc613',
                quantity: 20
            }];
            this.approvedProduct = new VersionObjectReferenceDataBuilder()
                .build();
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
                stockAdjustments: builder.stockAdjustments,
                approvedProduct: builder.approvedProduct
            };
        }

        function withOrderable(orderable) {
            this.orderable = new VersionObjectReferenceDataBuilder()
                .withId(orderable.id)
                .withVersionNumber(orderable.meta.versionNumber)
                .build();
            return this;
        }

        function buildForProgram(program) {
            this.orderable = buildOrderable(program, true);
            return this.build();
        }

        function buildNonFullSupplyForProgram(program) {
            this.orderable = buildOrderable(program, false);
            return this.build();
        }

        function fullSupplyForProgram(program) {
            this.orderable = buildOrderable(program, true);
            return this;
        }

        function nonFullSupplyForProgram(program) {
            this.orderable = buildOrderable(program, false);
            return this;
        }

        function asSkipped() {
            this.skipped = true;
            return this;
        }

        function withTotalLossesAndAdjustments(totalLossesAndAdjustments) {
            this.totalLossesAndAdjustments = totalLossesAndAdjustments;
            return this;
        }

        function withBeginningBalance(beginningBalance) {
            this.beginningBalance = beginningBalance;
            return this;
        }

        function withTotalConsumedQuantity(totalConsumedQuantity) {
            this.totalConsumedQuantity = totalConsumedQuantity;
            return this;
        }

        function withTotalReceivedQuantity(totalReceivedQuantity) {
            this.totalReceivedQuantity = totalReceivedQuantity;
            return this;
        }

        function withStockOnHand(stockOnHand) {
            this.stockOnHand = stockOnHand;
            return this;
        }

        function buildOrderable(program, fullSupply) {
            var instanceNumber = RequisitionLineItemV2DataBuilder.instanceNumber;
            var orderable = new OrderableDataBuilder()
                .withPrograms([{
                    programId: program.id,
                    orderableDisplayCategoryId: 'orderable-display-category-id-' + instanceNumber,
                    orderableCategoryDisplayName: 'Category ' + instanceNumber,
                    orderableCategoryDisplayOrder: instanceNumber,
                    fullSupply: fullSupply,
                    displayOrder: 6,
                    pricePerPack: 20.00
                }])
                .buildJson();

            return new VersionObjectReferenceDataBuilder()
                .withId(orderable.id)
                .withVersionNumber(orderable.meta.versionNumber)
                .build();
        }
    }

})();
