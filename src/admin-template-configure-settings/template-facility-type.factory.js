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
     * @name admin-template-configure-settings.templateFacilityTypeFactory
     *
     * @description
     * Provides filtering methods for facility types.
     */
    angular
        .module('admin-template-configure-settings')
        .factory('templateFacilityTypeFactory', factory);

    function factory() {

        var factory = {
            getAvailableFacilityTypesForProgram: getAvailableFacilityTypesForProgram
        };

        return factory;

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-settings.templateFacilityTypeFactory
         * @name getAvailableFacilityTypesForProgram
         *
         * @description
         * Returns available facility types for program.
         *
         * @param   {Array}     programTemplates    all programs with their templates
         * @param   {Array}     facilityTypes       all facility types
         * @return  {Array}                         array of available facility types
         */
        function getAvailableFacilityTypesForProgram(programTemplates, facilityTypes) {
            programTemplates.forEach(function(template) {
                removeAssignedFacilityTypes(facilityTypes, template.facilityTypes);
            });

            return facilityTypes;
        }

        function removeAssignedFacilityTypes(facilityTypes, templateFacilityTypes) {
            templateFacilityTypes.forEach(function(type) {
                var filtered = getFacilityTypeById(facilityTypes, type.id);
                if (filtered) {
                    var index = facilityTypes.indexOf(filtered);
                    facilityTypes.splice(index, 1);
                }
            });
        }

        function getFacilityTypeById(facilityTypes, id) {
            return facilityTypes.filter(function(facilityType) {
                return facilityType.id === id;
            })[0];
        }
    }
})();
