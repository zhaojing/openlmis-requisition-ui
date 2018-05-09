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
     * @ngdoc object
     * @name admin-template-add.NewTemplate
     *
     * @description
     * Represents a Requisition NewTemplate.
     */
    angular
        .module('admin-template-add')
        .factory('NewTemplate', NewTemplate);

        NewTemplate.$inject = ['$q'];

    function NewTemplate($q) {

        NewTemplate.prototype.addColumn = addColumn;
        NewTemplate.prototype.removeColumn = removeColumn;
        NewTemplate.prototype.hasColumns = hasColumns;

        return NewTemplate;

        /**
         * @ngdoc method
         * @methodOf admin-template-add.NewTemplate
         * @name NewTemplate
         *
         * @description
         * Adds all needed methods and information to requisition template.
         *
         * @return {Object} the requisition template with methods
         */
        function NewTemplate() {
            this.populateStockOnHandFromStockCards = false;
            this.columnsMap = {};
            this.facilityTypes = [];
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-add.NewTemplate
         * @name hasColumns
         *
         * @description
         * 
         *
         * @return {Array}                 the matching columns
         */
        function hasColumns() {
            for (var prop in this.columnsMap) {
                if (this.columnsMap.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        }


        /**
         * @ngdoc method
         * @methodOf admin-template-add.NewTemplate
         * @name addFacilityType
         *
         * @description
         * 
         *
         * @param  {Boolean} columnName indicates if user wants to get full/non-full supply columns
         * @return {Array}                 the matching columns
         */
        function removeColumn(columnName) {
            if (this.columnsMap.hasOwnProperty(columnName)) {
                var removedDisplayOrder = this.columnsMap[columnName].displayOrder;
                delete this.columnsMap[columnName];
                Object.keys(this.columnsMap).forEach(function(column) {
                    if (this.columnsMap[column].displayOrder >= removedDisplayOrder) {
                        this.columnsMap[column].displayOrder--;
                    }
                });
                return $q.resolve();
            }
            return $q.reject();
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-add.NewTemplate
         * @name addFacilityType
         *
         * @description
         * 
         *
         * @param  {Boolean} nonFullSupply indicates if user wants to get full/non-full supply columns
         * @return {Array}                 the matching columns
         */
        function addColumn(availableColumn) {
            this.columnsMap[availableColumn.name] = {
                name: availableColumn.name,
                label: availableColumn.label,
                indicator: availableColumn.indicator,
                displayOrder: getNewDisplayOrder(this),
                isDisplayed: true,
                source: availableColumn.sources[0],
                columnDefinition: availableColumn,
                option: availableColumn.options[0],
                definition: availableColumn.definition
            };
        }

        function getNewDisplayOrder(template) {
            var newDisplayOrder = 0;
            Object.keys(template.columnsMap).forEach(function(templateName) {
                if (template.columnsMap[templateName].displayOrder >= newDisplayOrder) {
                    newDisplayOrder = template.columnsMap[templateName].displayOrder + 1;
                }
            });
            return newDisplayOrder;
        }
    }
})();
