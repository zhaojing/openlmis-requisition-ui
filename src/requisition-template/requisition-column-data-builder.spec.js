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
        .module('requisition-template')
        .factory('RequisitionColumnDataBuilder', RequisitionColumnDataBuilder);

    RequisitionColumnDataBuilder.$inject = ['COLUMN_TYPES', 'COLUMN_SOURCES', 'RequisitionColumn'];

    function RequisitionColumnDataBuilder(COLUMN_TYPES, COLUMN_SOURCES, RequisitionColumn) {

        RequisitionColumnDataBuilder.prototype.build = build;
        RequisitionColumnDataBuilder.prototype.buildProductCodeColumn = buildProductCodeColumn;
        RequisitionColumnDataBuilder.prototype.buildProductNameColumn = buildProductNameColumn;
        RequisitionColumnDataBuilder.prototype.buildStockOnHandColumn = buildStockOnHandColumn;
        RequisitionColumnDataBuilder.prototype.buildSkipColumn = buildSkipColumn;
        RequisitionColumnDataBuilder.prototype.buildRequestedQuantityColumn =
            buildRequestedQuantityColumn;
        RequisitionColumnDataBuilder.prototype.buildRequestedQuantityExplanationColumn =
            buildRequestedQuantityExplanationColumn;
        RequisitionColumnDataBuilder.prototype.buildBeginningBalanceColumn =
            buildBeginningBalanceColumn;
        RequisitionColumnDataBuilder.prototype.buildTotalLossesAndAdjustmentsColumn = buildTotalLossesAndAdjustmentsColumn;

        return RequisitionColumnDataBuilder;

        function RequisitionColumnDataBuilder() {
            RequisitionColumnDataBuilder.instanceNumber =
                (RequisitionColumnDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = RequisitionColumnDataBuilder.instanceNumber;

            this.name = 'columnName' + instanceNumber;
            this.label = 'Column ' + instanceNumber + ' Label';
            this.indicator = 'X';
            this.displayOrder = instanceNumber;
            this.isDisplayed = true;
            this.source = COLUMN_SOURCES.REFERENCE_DATA;
            this.option = null;
            this.definition = 'Column Definition';
            this.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.TEXT
            }
        }

        function build() {
            return new RequisitionColumn({
                name: this.name,
                label: this.label,
                indicator: this.indicator,
                displayOrder: this.displayOrder,
                isDisplayed: this.isDisplayed,
                source: this.source,
                option: this.option,
                definition: this.definition,
                columnDefinition: this.columnDefinition
            });
        }

        function buildProductCodeColumn() {
            var builder = this;
            builder.name = 'orderable.productCode';
            builder.label = 'Product code';
            builder.indicator = 'O';
            builder.displayOrder = 2;
            builder.isDisplayed = true;
            builder.source = 'REFERENCE_DATA';
            builder.option = null;
            builder.definition = 'Unique identifier for each commodity/product.';
            builder.columnDefinition = {
                canChangeOrder: false,
                columnType: COLUMN_TYPES.TEXT
            };
            return builder.build();
        }

        function buildProductNameColumn() {
            var builder = this;
            builder.name = 'orderable.fullProductName';
            builder.label = 'Product';
            builder.indicator = 'R';
            builder.displayOrder = 3;
            builder.isDisplayed = true;
            builder.source = 'REFERENCE_DATA';
            builder.option = null;
            builder.definition = 'Primary name of the product.';
            builder.columnDefinition = {
                canChangeOrder: false,
                columnType: COLUMN_TYPES.TEXT
            };
            return builder.build();
        }

        function buildRequestedQuantityColumn() {
            var builder = this;
            builder.name = 'requestedQuantity';
            builder.label = 'Requested quantity';
            builder.indicator = 'J';
            builder.displayOrder = 15;
            builder.isDisplayed = true;
            builder.source = 'USER_INPUT';
            builder.option = null;
            builder.definition = 'Requested override of calculated quantity. This is quantified in dispensing units.';
            builder.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.NUMERIC
            };
            return builder.build();
        }

        function buildRequestedQuantityExplanationColumn() {
            var builder = this;
            builder.name = 'requestedQuantityExplanation';
            builder.label = 'Requested quantity explanation';
            builder.indicator = 'W';
            builder.displayOrder = 16;
            builder.isDisplayed = true;
            builder.source = 'USER_INPUT';
            builder.option = null;
            builder.definition = 'Explanation of request for a quantity other than calculated order quantity.';
            builder.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.TEXT
            };
            return builder.build();
        }

        function buildStockOnHandColumn() {
            var builder = this;

            builder.name = 'stockOnHand';
            builder.label = 'Stock on hand';
            builder.indicator = 'E';
            builder.displayOrder = 9;
            builder.isDisplayed = true;
            builder.source = 'CALCULATED';
            builder.option = null;
            builder.definition = 'Current physical count of stock on hand. This is quantified in dispensing units.';
            builder.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.NUMERIC
            };
            return builder.build();
        }

        function buildBeginningBalanceColumn() {
            var builder = this;

            builder.name = "beginningBalance",
            builder.label = "Beginning balance",
            builder.indicator = "A",
            builder.displayOrder = 4,
            builder.isDisplayed = true,
            builder.source = "USER_INPUT",
            builder.option = null,
            builder.definition = "Based on the Stock On Hand from the previous period. This is quantified in dispensing units.",
            builder.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.NUMERIC
            };
            return builder.build();
        }

        function buildSkipColumn(hideOptionSelected) {
            var builder = this;

            builder.name = "skipped";
            builder.label = "Skip";
            builder.indicator = "S";
            builder.displayOrder = 1;
            builder.isDisplayed = true;
            builder.source = "USER_INPUT";
            if (hideOptionSelected !== undefined && hideOptionSelected === true) {
                builder.option = {optionName: 'hideSkippedLineItems'}
            } else {
                builder.option = {optionName: 'disableSkippedLineItems'}
            }
            builder.definition = "Select the check box below to skip a single product. Remove all data from the row prior to selection.";
            builder.columnDefinition = {
                canChangeOrder: false,
                columnType: "BOOLEAN"
            };
            return builder.build();
        }

        function buildTotalLossesAndAdjustmentsColumn() {
            var builder = this;

            builder.name = "totalLossesAndAdjustments";
            builder.label = "Total Losses and Adjustments";
            builder.indicator = "D";
            builder.displayOrder = 7;
            builder.isDisplayed = true;
            builder.source = "STOCK_CARDS";
            builder.option = null;
            builder.definition = "All kind of losses/adjustments made at the facility.";
            builder.columnDefinition = {
                canChangeOrder: true,
                columnType: COLUMN_TYPES.NUMERIC
            };
            return builder.build();
        }
    }

})();
