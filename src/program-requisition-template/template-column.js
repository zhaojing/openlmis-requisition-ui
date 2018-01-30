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

    /**
     * @ngdoc service
     * @name program-requisition-template.TemplateColumn
     *
     * @description
     * Represents a single requisition template column.
     */
    angular
        .module('program-requisition-template')
        .factory('TemplateColumn', TemplateColumn);

    TemplateColumn.$inject = ['$filter', 'COLUMN_SOURCES', 'TEMPLATE_COLUMNS'];

    function TemplateColumn($filter, COLUMN_SOURCES, TEMPLATE_COLUMNS) {
        TemplateColumn.prototype.disableColumnsAndChangeSource = disableColumnsAndChangeSource;
        TemplateColumn.prototype.isStockDisabledColumn = isStockDisabledColumn;

        return TemplateColumn;

        function TemplateColumn(column) {
            angular.merge(this, column);
            fixColumnOptionModelReference(this);
        }

        /**
         * @ngdoc method
         * @methodOf program-requisition-template.TemplateColumn
         * @name disableColumnsAndChangeSource
         *
         * @description
         * Turns off display and changes user input source for column.
         */
        function disableColumnsAndChangeSource() {
            this.isDisplayed = false;

            if (this.source == COLUMN_SOURCES.USER_INPUT) {
                if (this.columnDefinition.sources.includes(COLUMN_SOURCES.REFERENCE_DATA)) {
                    this.source = COLUMN_SOURCES.REFERENCE_DATA;
                } else if (this.columnDefinition.sources.includes(COLUMN_SOURCES.CALCULATED)) {
                    this.source = COLUMN_SOURCES.CALCULATED;
                }
            }
        }

        /**
         * @ngdoc method
         * @methodOf program-requisition-template.TemplateColumn
         * @name isStockDisabledColumn
         *
         * @description
         * Checks if column is on stock disabled columns list.
         */
        function isStockDisabledColumn() {
            return TEMPLATE_COLUMNS.getStockDisabledColumns().includes(this.name);
        }

        function fixColumnOptionModelReference(column) {
            if (column.option) {
                column.option = $filter('filter')(column.columnDefinition.options, {
                    id: column.option.id
                })[0];
            }
        }
    }
})();
