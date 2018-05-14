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
        .factory('StockAdjustmentDataBuilder', StockAdjustmentDataBuilder);

    function StockAdjustmentDataBuilder() {

        StockAdjustmentDataBuilder.prototype.withReasonId = withReasonId;
        StockAdjustmentDataBuilder.prototype.withQuantity = withQuantity;
        StockAdjustmentDataBuilder.prototype.build = build;

        return StockAdjustmentDataBuilder;

        function StockAdjustmentDataBuilder() {
            StockAdjustmentDataBuilder.instanceNumber = (StockAdjustmentDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = StockAdjustmentDataBuilder.instanceNumber;
            this.reasonId = "reason-id-" + instanceNumber;
            this.quantity = 10 + instanceNumber;
        }

        function withReasonId(reasonId) {
            this.reasonId = reasonId;
            return this;
        }

        function withQuantity(quantity) {
            this.quantity = quantity;
            return this;
        }

        function build() {
            return {
                reasonId: this.reasonId,
                quantity: this.quantity
            };
        }

    }

})();
