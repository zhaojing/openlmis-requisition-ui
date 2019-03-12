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
        .factory('StockAdjustmentReasonDataBuilder', StockAdjustmentReasonDataBuilder);

    function StockAdjustmentReasonDataBuilder() {

        StockAdjustmentReasonDataBuilder.prototype.buildHidden = buildHidden;
        StockAdjustmentReasonDataBuilder.prototype.build = build;
        StockAdjustmentReasonDataBuilder.prototype.withHidden = withHidden;

        return StockAdjustmentReasonDataBuilder;

        function StockAdjustmentReasonDataBuilder() {
            StockAdjustmentReasonDataBuilder.instanceNumber = (StockAdjustmentReasonDataBuilder.instanceNumber || 0)
                + 1;

            var instanceNumber = StockAdjustmentReasonDataBuilder.instanceNumber;
            this.name = 'stock-adjustment-reason' + instanceNumber;
            this.description = 'Stock Adjustment Reason ' + instanceNumber + ' Description';
            this.reasonType = 'CREDIT';
            this.reasonCategory = 'TRANSFER';
            this.isFreeTextAllowed = true;
            this.hidden = false;
        }

        function withHidden(hidden) {
            this.hidden = hidden;
            return this;
        }

        function buildHidden() {
            return this
                .withHidden(true)
                .build();
        }

        function build() {
            return {
                name: this.name,
                description: this.description,
                reasonType: this.reasonType,
                reasonCategory: this.reasonCategory,
                isFreeTextAllowed: this.isFreeTextAllowed,
                hidden: this.hidden
            };
        }

    }

})();
