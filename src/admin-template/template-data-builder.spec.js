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
        .module('admin-template')
        .factory('TemplateDataBuilder', TemplateDataBuilder);

    TemplateDataBuilder.$inject = ['Template', 'TemplateColumnDataBuilder', 'ObjectReferenceDataBuilder'];

    function TemplateDataBuilder(Template, TemplateColumnDataBuilder, ObjectReferenceDataBuilder) {

        TemplateDataBuilder.prototype.build = build;
        TemplateDataBuilder.prototype.buildJson = buildJson;
        TemplateDataBuilder.prototype.withColumn = withColumn;
        TemplateDataBuilder.prototype.withFacilityTypes = withFacilityTypes;
        TemplateDataBuilder.prototype.withPopulateStockOnHandFromStockCards = withPopulateStockOnHandFromStockCards;
        TemplateDataBuilder.prototype.withProgram = withProgram;
        TemplateDataBuilder.prototype.withoutId = withoutId;
        TemplateDataBuilder.prototype.withoutColumns = withoutColumns;
        TemplateDataBuilder.prototype.withTotalColumn = withTotalColumn;
        TemplateDataBuilder.prototype.withRemarksColumn = withRemarksColumn;
        TemplateDataBuilder.prototype.withAverageConsumptionColumn = withAverageConsumptionColumn;
        TemplateDataBuilder.prototype.withRequestedQuantityColumn = withRequestedQuantityColumn;
        TemplateDataBuilder.prototype.withRequestedQuantityExplanationColumn = withRequestedQuantityExplanationColumn;
        TemplateDataBuilder.prototype.withBeginningBalanceColumn = withBeginningBalanceColumn;

        return TemplateDataBuilder;

        function TemplateDataBuilder() {
            TemplateDataBuilder.instanceNumber = (TemplateDataBuilder.instanceNumber || 0) + 1;

            this.createdDate = new Date();
            this.id = 'template-' + TemplateDataBuilder.instanceNumber;
            this.numberOfPeriodsToAverage = 3;
            this.program = new ObjectReferenceDataBuilder()
                .withId('program-' + TemplateDataBuilder.instanceNumber)
                .build();
            this.populateStockOnHandFromStockCards = false;
            this.columnsMap = {};
            this.facilityTypes = [];

            var column = new TemplateColumnDataBuilder().build();
            this.columnsMap[column.name] = column;
        }

        function build() {
            return new Template(this.buildJson());
        }

        function buildJson() {
            return {
                createdDate: this.createdDate,
                id: this.id,
                numberOfPeriodsToAverage: this.numberOfPeriodsToAverage,
                program: this.program,
                populateStockOnHandFromStockCards: this.populateStockOnHandFromStockCards,
                columnsMap: this.columnsMap,
                facilityTypes: this.facilityTypes
            };
        }

        function withColumn(column) {
            this.columnsMap[column.name] = column;
            return this;
        }

        function withFacilityTypes(types) {
            this.facilityTypes = types;
            return this;
        }

        function withPopulateStockOnHandFromStockCards() {
            this.populateStockOnHandFromStockCards = true;
            return this;
        }

        function withProgram(program) {
            this.program = program;
            return this;
        }

        function withoutId() {
            this.id = undefined;
            return this;
        }

        function withoutColumns() {
            this.columnsMap = {};
            return this;
        }

        function withTotalColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildTotalColumn());
            return this;
        }

        function withRemarksColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildRemarksColumn());
            return this;
        }

        function withAverageConsumptionColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildAverageConsumptionColumn());
            return this;
        }

        function withRequestedQuantityColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildRequestedQuantityColumn());
            return this;
        }

        function withRequestedQuantityExplanationColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildRequestedQuantityExplanationColumn());
            return this;
        }

        function withBeginningBalanceColumn() {
            this.withColumn(new TemplateColumnDataBuilder().buildBeginningBalanceColumn());
            return this;
        }
    }
})();
