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
        .factory('RequisitionDataBuilder', RequisitionDataBuilder);

    RequisitionDataBuilder.$inject = [
        'RequisitionLineItemDataBuilder', 'FacilityDataBuilder', 'ProgramDataBuilder',
        'PeriodDataBuilder', 'RequisitionTemplateDataBuilder', 'OrderableDataBuilder',
        'REQUISITION_STATUS', 'ReasonDataBuilder', 'Requisition'
    ];

    function RequisitionDataBuilder(RequisitionLineItemDataBuilder, FacilityDataBuilder,
                                    ProgramDataBuilder, PeriodDataBuilder,
                                    RequisitionTemplateDataBuilder, OrderableDataBuilder,
                                    REQUISITION_STATUS, ReasonDataBuilder, Requisition) {

        RequisitionDataBuilder.prototype.build = build;
        RequisitionDataBuilder.prototype.buildJson = buildJson;
        RequisitionDataBuilder.prototype.withRequistionLineItems = withRequistionLineItems;

        return RequisitionDataBuilder;

        function RequisitionDataBuilder() {
            RequisitionDataBuilder.instanceNumber =
                (RequisitionDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = RequisitionDataBuilder.instanceNumber;

            this.id = 'requisition-id-' + instanceNumber;
            this.createdDate = '2016-06-14T12:00:00Z';
            this.modifiedDate = '2016-06-14T12:00:00Z';
            this.program = new ProgramDataBuilder().build();
            this.requisitionLineItems = [
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(this.program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .nonFullSupplyForProgram(this.program)
                    .buildJson()
            ];
            this.draftStatusMessage = 'Requisition ' + instanceNumber + 'status message draft';
            this.facility = new FacilityDataBuilder().build();
            this.processingPeriod = new PeriodDataBuilder().build();
            this.status = REQUISITION_STATUS.INITIATED;
            this.emergency = false;
            this.supplyingFacility = 'supplying-facility-id-' + instanceNumber;
            this.supervisoryNode = 'supervisory-node-id-' + instanceNumber;
            this.template = new RequisitionTemplateDataBuilder().build();
            this.availableFullSupplyProducts = [];
            this.availableNonFullSupplyProducts = [
                new OrderableDataBuilder().buildJson(),
                new OrderableDataBuilder().buildJson(),
                new OrderableDataBuilder().buildJson()
            ];
            this.statusChange = {
                INITIATED: {
                    authorId: 'author-id-' + instanceNumber,
                    changeDate: '2018-02-21T10:59:02.758Z'
                }
            };
            this.statusHistory = [{
                status: REQUISITION_STATUS.INITIATED,
                statusMessageDto: null,
                authorId: 'author-id-' + instanceNumber,
                previousStatusChangeId: null,
                createdDate: '2018-02-21T10:59:02.758Z'
            }];
            this.datePhysicalStockCountCompleted = null;
            this.stockAdjustmentReasons = [
                new ReasonDataBuilder().build(),
                new ReasonDataBuilder().build(),
                new ReasonDataBuilder().build(),
                new ReasonDataBuilder().build()
            ];
        }

        function buildJson() {
            var builder = this;
            return {
                id: builder.id,
                createdDate: builder.createdDate,
                modifiedDate: builder.modifiedDate,
                requisitionLineItems: builder.requisitionLineItems,
                draftStatusMessage: builder.draftStatusMessage,
                facility: builder.facility,
                program: builder.program,
                processingPeriod: builder.processingPeriod,
                status: builder.status,
                emergency: builder.emergency,
                supplyingFacility: builder.supplyingFacility,
                supervisoryNode: builder.supervisoryNode,
                template: builder.template,
                availableFullSupplyProducts: builder.availableFullSupplyProducts,
                availableNonFullSupplyProducts: builder.availableNonFullSupplyProducts,
                statusChange: builder.statusChange,
                statusHistory: builder.statusHistory,
                datePhysicalStockCountCompleted: builder.datePhysicalStockCountCompleted,
                stockAdjustmentReasons: builder.stockAdjustmentReasons
            };
        }

        function build() {
            return new Requisition(this.buildJson());
        }

        function withRequistionLineItems(requisitionLineItems) {
            this.requisitionLineItems = requisitionLineItems;
            return this;
        }
    }

})();
