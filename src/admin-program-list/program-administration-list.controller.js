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
     * @ngdoc controller
     * @name admin-program-list.controller:ProgramAdministrationListController
     *
     * @description
     * Controller for template list view page.
     */
    angular
        .module('admin-program-list')
        .controller('ProgramAdministrationListController', controller);

    controller.$inject = ['programList', 'authorizationService', 'REQUISITION_RIGHTS'];

    function controller(programList, authorizationService, REQUISITION_RIGHTS) {
        var vm = this;

        /**
         * @ngdoc property
         * @name programs
         * @propertyOf admin-program-list.controller:ProgramAdministrationListController
         * @type {Array}
         *
         * @description
         * Holds list of all programs with templates.
         */
        vm.programs = programList;
    }
})();