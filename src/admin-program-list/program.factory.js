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

(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name admin-program-list.programFactory
     *
     * @description
     * Allows the user to retrieve programs with additional information.
     */
    angular
        .module('admin-program-list')
        .factory('programFactory', factory);

    factory.$inject = ['openlmisUrlFactory', '$q', 'programService', 'templateFactory', '$filter'];

    function factory(openlmisUrlFactory, $q, programService, templateFactory, $filter) {

        return {
            getAllProgramsWithTemplates: getAllProgramsWithTemplates
        };

        /**
         * @ngdoc method
         * @methodOf admin-program-list.programFactory
         * @name getAllProgramsWithTemplates
         *
         * @description
         * Retrieves all programs and adds templates to them if one exists.
         *
         * @return {Promise} Array of programs with templates
         */
        function getAllProgramsWithTemplates() {
            var deferred = $q.defer();

            $q.all([
                programService.getAll(),
                templateFactory.getAll()
            ]).then(function(responses) {
                var programs = responses[0],
                    templates = responses[1];

                    angular.forEach(programs, function(program) {
                        var filtered = $filter('filter')(templates, {
                            programId: program.id
                        }, true);
                        if (filtered && filtered.length > 0) program.$template = filtered[0];
                    });

                    deferred.resolve(programs);
            }, deferred.reject);

            return deferred.promise;
        }
    }

})();
