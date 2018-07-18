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
        TemplateColumnDataBuilder.prototype.withTag = withTag;
        TemplateColumnDataBuilder.prototype.buildStockOnHandColumn = buildStockOnHandColumn;
        TemplateColumnDataBuilder.prototype.buildIdealStockAmountColumn = buildIdealStockAmountColumn;
        TemplateColumnDataBuilder.prototype.buildRequestedQuantityColumn = buildRequestedQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildAverageConsumptionColumn = buildAverageConsumptionColumn;
        TemplateColumnDataBuilder.prototype.buildMaximumStockQuantityColumn = buildMaximumStockQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildTotalConsumedQuantityColumn = buildTotalConsumedQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildAdditionalQuantityRequiredColumn = buildAdditionalQuantityRequiredColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityColumn = buildCalculatedOrderQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityIsaColumn = buildCalculatedOrderQuantityIsaColumn;
        TemplateColumnDataBuilder.prototype.buildBeginningBalanceColumn = buildBeginningBalanceColumn;
        TemplateColumnDataBuilder.prototype.buildRemarksColumn = buildRemarksColumn;
        TemplateColumnDataBuilder.prototype.buildTotalColumn = buildTotalColumn;

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

        function withTag(tag) {
            this.tag = tag;
            this.columnDefinition.supportsTag = true;
            return this;
        }

        function buildStockOnHandColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.STOCK_ON_HAND)
                .build();
        }

        function buildIdealStockAmountColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.IDEAL_STOCK_AMOUNT)
                .build();
        }

        function buildRequestedQuantityColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.REQUESTED_QUANTITY)
                .visible()
                .build();
        }

        function buildMaximumStockQuantityColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY)
                .build();
        }

        function buildCalculatedOrderQuantityColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY)
                .visible()
                .build();
        }

        function buildCalculatedOrderQuantityIsaColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.CALCULATED_ORDER_QUANTITY_ISA)
                .build();
        }

        function buildAdditionalQuantityRequiredColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.ADDITIONAL_QUANTITY_REQUIRED)
                .visible()
                .build();
        }

        function buildAverageConsumptionColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION)
                .build();
        }

        function buildTotalConsumedQuantityColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY)
                .build();
        }

        function buildBeginningBalanceColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.BEGINNING_BALANCE)
                .build();
        }

        function buildRemarksColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.REMARKS)
                .build();
        }

        function buildTotalColumn() {
            return this.withSource(COLUMN_SOURCES.REFERENCE_DATA)
                .withName(TEMPLATE_COLUMNS.TOTAL)
                .build();
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
