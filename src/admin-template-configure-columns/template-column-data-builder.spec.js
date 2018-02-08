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
        .module('admin-template-configure-columns')
        .factory('TemplateColumnDataBuilder', TemplateColumnDataBuilder);

    TemplateColumnDataBuilder.$inject = ['TemplateColumn', 'COLUMN_SOURCES'];

    function TemplateColumnDataBuilder(TemplateColumn, COLUMN_SOURCES) {

        TemplateColumnDataBuilder.prototype.build = build;

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

        function createOption(number) {
            return {
                id: 'option-id-' + number,
                optionName: 'option' + number + 'Name',
                optionLabel: 'Option ' + number
            };
        }

    }

})();
