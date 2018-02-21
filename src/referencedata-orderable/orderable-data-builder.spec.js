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
        .module('referencedata-orderable')
        .factory('OrderableDataBuilder', OrderableDataBuilder);

    OrderableDataBuilder.$inject = ['Orderable'];

    function OrderableDataBuilder(Orderable) {

        OrderableDataBuilder.prototype.withFullProductName = withFullProductName;
        OrderableDataBuilder.prototype.withId = withId;
        OrderableDataBuilder.prototype.withPrograms = withPrograms;
        OrderableDataBuilder.prototype.build = build;
        OrderableDataBuilder.prototype.buildJson = buildJson;

        return OrderableDataBuilder;

        function OrderableDataBuilder() {
            OrderableDataBuilder.instanceNumber = (OrderableDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = OrderableDataBuilder.instanceNumber;
            this.id = 'orderable-id-' + instanceNumber;
            this.productCode = 'C' + instanceNumber;
            this.fullProductName = 'Product ' + instanceNumber;;
            this.dispensable = {
                dispensingUnit: ''
            };
            this.description = 'Product ' + instanceNumber + ' description';
            this.netContent = instanceNumber + 1;
            this.packRoundingThreshold = 2;
            this.roundToZero = false;
            this.identifiers = {};

            this.programs = [{
                programId: 'program-id-1' + instanceNumber,
                orderableDisplayCategoryId: 'orderable-display-category-id-1' + instanceNumber,
                orderableCategoryDisplayName: 'Category 1' + instanceNumber,
                orderableCategoryDisplayOrder: 2,
                fullSupply: true,
                displayOrder: 6,
                pricePerPack: 4.34
            }, {
                programId: 'program-id-2' + instanceNumber,
                orderableDisplayCategoryId: 'orderable-display-category-id-2' + instanceNumber,
                orderableCategoryDisplayName: 'Category 2' + instanceNumber,
                orderableCategoryDisplayOrder: 1,
                fullSupply: false,
                displayOrder: 6,
                pricePerPack: 20.77
            }]
        }

        function withFullProductName(fullProductName) {
            this.fullProductName = fullProductName;
            return this;
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withPrograms(programs) {
            this.programs = programs;
            return this;
        }

        function build() {
            return new Orderable(
                this.id,
                this.productCode,
                this.fullProductName,
                this.dispensable
            );
        }

        function buildJson() {
            return {
                id: this.id,
                programs: this.programs,
                roundToZero: this.roundToZero,
                identifiers: this.identifiers,
                productCode: this.productCode,
                fullProductName: this.fullProductName,
                dispensable: this.dispensable,
                description: this.description,
                netContent: this.netContent,
                packRoundingThreshold: this.packRoundingThreshold
            }
        }

    }

})();
