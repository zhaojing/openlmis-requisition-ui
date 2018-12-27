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
        TemplateColumnDataBuilder.prototype.buildAdditionalQuantityRequiredColumn =
            buildAdditionalQuantityRequiredColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityColumn = buildCalculatedOrderQuantityColumn;
        TemplateColumnDataBuilder.prototype.buildCalculatedOrderQuantityIsaColumn =
            buildCalculatedOrderQuantityIsaColumn;
        TemplateColumnDataBuilder.prototype.buildBeginningBalanceColumn = buildBeginningBalanceColumn;
        TemplateColumnDataBuilder.prototype.buildRemarksColumn = buildRemarksColumn;
        TemplateColumnDataBuilder.prototype.buildTotalColumn = buildTotalColumn;
        TemplateColumnDataBuilder.prototype.buildSkipped = buildSkipped;
        TemplateColumnDataBuilder.prototype.buildRequestedQuantityExplanationColumn =
            buildRequestedQuantityExplanationColumn;

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
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: false,
                columnType: 'NUMERIC',
                definition: 'Requested override of calculated quantity. This is quantified in dispensing units.',
                id: '4a2e9fd3-1127-4b68-9912-84a5c00f6999',
                indicator: 'J',
                isDisplayRequired: false,
                label: 'Requested quantity',
                mandatory: false,
                name: 'requestedQuantity',
                options: [],
                sources: ['USER_INPUT'],
                supportsTag: false
            };
            this.definition = 'Requested override of calculated quantity. This is quantified in dispensing units.';
            this.displayOrder = 15;
            this.indicator = 'J';
            this.isDisplayed = true;
            this.label = 'Requested quantity';
            this.name = 'requestedQuantity';
            this.option = null;
            this.source = 'USER_INPUT';
            this.tag = null;

            return this.build();
        }

        function buildRequestedQuantityExplanationColumn() {
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: true,
                columnType: 'TEXT',
                definition: 'Explanation of request for a quantity other than calculated order quantity.',
                id: '6b8d331b-a0dd-4a1f-aafb-40e6a72ab9f5',
                indicator: 'W',
                isDisplayRequired: false,
                label: 'Requested quantity explanation',
                mandatory: false,
                name: 'requestedQuantityExplanation',
                options: [],
                sources: ['USER_INPUT'],
                supportsTag: false
            };
            this.definition = 'Explanation of request for a quantity other than calculated order quantity.';
            this.displayOrder = 16;
            this.indicator = 'W';
            this.isDisplayed = true;
            this.label = 'Requested quantity explanation';
            this.name = 'requestedQuantityExplanation';
            this.option = null;
            this.source = 'USER_INPUT';
            this.tag = null;

            return this.build();
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
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: true,
                columnType: 'NUMERIC',
                definition: 'Average consumption over a specified number of periods/months. Quantified in dispensing ' +
                    'units.',
                id: '89113ec3-40e9-4d81-9516-b56adba7f8cd',
                indicator: 'P',
                isDisplayRequired: false,
                label: 'Average consumption',
                mandatory: false,
                name: 'averageConsumption',
                options: [],
                sources: [COLUMN_SOURCES.CALCULATED, 'STOCK_CARDS'],
                supportsTag: false
            };
            this.definition = 'Average consumption over a specified number of periods/months. Quantified in ' +
                'dispensing units.';
            this.displayOrder = 10;
            this.indicator = 'P';
            this.isDisplayed = true;
            this.label = 'Average consumption';
            this.name = 'averageConsumption';
            this.option = null;
            this.source = 'CALCULATED';
            this.tag = null;

            return this.build();
        }

        function buildTotalConsumedQuantityColumn() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.TOTAL_CONSUMED_QUANTITY)
                .build();
        }

        function buildBeginningBalanceColumn() {
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: false,
                columnType: 'NUMERIC',
                definition: 'Based on the Stock On Hand from the previous period. This is quantified in dispensing ' +
                    'units.',
                id: '33b2d2e9-3167-46b0-95d4-1295be9afc22',
                indicator: 'A',
                isDisplayRequired: false,
                label: 'Beginning balance',
                mandatory: false,
                name: 'beginningBalance',
                options: [],
                sources: ['USER_INPUT', 'STOCK_CARDS'],
                supportsTag: false
            };
            this.definition = 'Based on the Stock On Hand from the previous period. This is quantified in dispensing ' +
                'units.';
            this.displayOrder = 2;
            this.indicator = 'A';
            this.isDisplayed = true;
            this.label = 'Beginning balance';
            this.name = 'beginningBalance';
            this.option = null;
            this.source = 'USER_INPUT';
            this.tag = null;

            return this.build();
        }

        function buildTotalColumn() {
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: true,
                columnType: 'NUMERIC',
                definition: 'Total of beginning balance and quantity received.',
                id: 'ef524868-9d0a-11e6-80f5-76304dec7eb7',
                indicator: 'Y',
                isDisplayRequired: false,
                label: 'Total',
                mandatory: false,
                name: 'total',
                options: [],
                sources: [COLUMN_SOURCES.CALCULATED],
                supportsTag: false
            };
            this.definition = 'Total of beginning balance and quantity received.';
            this.displayOrder = 1;
            this.indicator = 'Y';
            this.isDisplayed = false;
            this.label = 'Total';
            this.name = 'total';
            this.option = null;
            this.source = 'CALCULATED';
            this.tag = null;

            return this.build();
        }

        function buildRemarksColumn() {
            this.columnDefinition = {
                canBeChangedByUser: false,
                canChangeOrder: true,
                columnType: 'TEXT',
                definition: 'Any additional remarks.',
                id: '2ed8c74a-f424-4742-bd14-cfbe67b6e7be',
                indicator: 'L',
                isDisplayRequired: false,
                label: 'Remarks',
                mandatory: false,
                name: 'remarks',
                options: [],
                sources: ['USER_INPUT'],
                supportsTag: false
            };
            this.definition = 'Any additional remarks.';
            this.displayOrder = 2;
            this.indicator = 'L';
            this.isDisplayed = true;
            this.label = 'Remarks';
            this.name = 'remarks';
            this.option = null;
            this.source = 'USER_INPUT';
            this.tag = null;

            return this.build();
        }

        function buildSkipped() {
            return this.withSource(COLUMN_SOURCES.USER_INPUT)
                .withName(TEMPLATE_COLUMNS.SKIPPED)
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
