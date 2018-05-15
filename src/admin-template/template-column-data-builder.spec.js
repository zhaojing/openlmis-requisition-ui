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
        .factory('TemplateColumnDataBuilder', TemplateColumnDataBuilder);

    TemplateColumnDataBuilder.$inject = ['TemplateColumn', 'COLUMN_SOURCES', 'TEMPLATE_COLUMNS'];

    function TemplateColumnDataBuilder(TemplateColumn, COLUMN_SOURCES, TEMPLATE_COLUMNS) {

        TemplateColumnDataBuilder.prototype.build = build;
        TemplateColumnDataBuilder.prototype.withSource = withSource;
        TemplateColumnDataBuilder.prototype.withName = withName;
        TemplateColumnDataBuilder.prototype.visible = visible;
        TemplateColumnDataBuilder.prototype.buildStockOnHandColumn = buildStockOnHandColumn;
        TemplateColumnDataBuilder.prototype.buildIdealStockAmountColumn = buildIdealStockAmountColumn;
        TemplateColumnDataBuilder.prototype.buildRequestedQuantityColumn = buildRequestedQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildAverageConsumptionColumn = buildAverageConsumptionColumn;
        TemplateColumnDataBuilder.prototype.buildMaximumStockQuantityColumn = buildMaximumStockQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildTotalConsumedQuantityColumn = buildTotalConsumedQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityColumn = buildCalculatedOrderQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityIsaColumn =
            buildCalculatedOrderQuantityIsaColumn;
        TemplateColumnDataBuilder.prototype.buildBeginningBalanceColumn =
            buildBeginningBalanceColumn;

        return TemplateColumnDataBuilder;

        function TemplateColumnDataBuilder() {
            TemplateColumnDataBuilder.instanceNumber =
                (TemplateColumnDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = TemplateColumnDataBuilder.instanceNumber;

            this.columnDefinition = {
                id: 'id-' + instanceNumber,
                name: 'column' + instanceNumber,
                sources: [
                    COLUMN_SOURCES.CALCULATED,
                    COLUMN_SOURCES.USER_INPUT
                ],
                options: [
                    createOption(1000 + instanceNumber),
                    createOption(2000 + instanceNumber),
                    createOption(3000 + instanceNumber)
                ],
                label: 'Column ' + instanceNumber,
                indicator: 'indicator' + instanceNumber,
                mandatory: true,
                isDisplayRequired: true,
                canBeChangedByUser: true,
                definition: 'Column ' + instanceNumber + ' definition'
            };

            this.name = this.columnDefinition.name;
            this.label = this.columnDefinition.label;
            this.indicator = this.columnDefinition.indicator;
            this.definition = this.columnDefinition.definition;
            this.displayOrder = instanceNumber;

            this.source = this.columnDefinition.sources[0];
            this.option = this.columnDefinition.options[0];
        }

        function build() {
            return new TemplateColumn(this);
        }

        function withSource(source) {
            this.source = source;
            return this;
        }

        function withName(name) {
            this.name = name;
            this.columnDefinition.name = name;
            return this;
        }

        function visible() {
            this.$display = true;
            this.isDisplayed = true;
            return this;
        }

        function buildStockOnHandColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.STOCK_ON_HAND);
            return this.build();
        }

        function buildIdealStockAmountColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.IDEAL_STOCK_AMOUNT);
            return this.build();
        }

        function buildRequestedQuantityColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.REQUESTED_QUANTITY);
            this.visible();
            return this.build();
        }

        function buildMaximumStockQuantityColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY);
            return this.build();
        }

        function buildCalculatedOrderQuantityColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY);
            this.visible();
            return this.build();
        }

        function buildCalculatedOrderQuantityIsaColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY_ISA);
            return this.build();
        }

        function buildAverageConsumptionColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION);
            return this.build();
        }

        function buildTotalConsumedQuantityColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY);
            return this.build();
        }

        function buildBeginningBalanceColumn() {
            this.withSource(COLUMN_SOURCES.USER_INPUT);
            this.withName(TEMPLATE_COLUMNS.BEGINNING_BALANCE);
            return this.build();
        }

        function createOption(number) {
            return {
                id: 'option-id-' + number,
                optionName: 'option' + number + 'Name',
                optionLabel: 'Option ' + number
            };
        }

    }

})();
