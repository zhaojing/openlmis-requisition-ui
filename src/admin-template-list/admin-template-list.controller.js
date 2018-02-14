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
     * @name admin-template-list.controller:TemplateListAdminController
     *
     * @description
     * Controller for template view page.
     */
    angular
        .module('admin-template-list')
        .controller('TemplateListAdminController', TemplateListAdminController);

    TemplateListAdminController.$inject = [
        'templates', 'programs', '$filter', 'templateListFactory', 'templateFacilityTypes'
    ];

    function TemplateListAdminController(templates, programs, $filter, templateListFactory, templateFacilityTypes) {

        var vm = this;

        /**
         * @ngdoc property
         * @propertyOf admin-template-list.controller:TemplateListAdminController
         * @name templates
         * @type {Array}
         *
         * @description
         * Holds template.
         */
        vm.templates = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-list.controller:TemplateListAdminController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds program.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-list.controller:TemplateListAdminController
         * @name programTemplates
         * @type {Array}
         *
         * @description
         * Holds programs with its templates.
         */
        vm.programTemplates = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-list.controller:TemplateListAdminController
         * @name templateFacilityTypes
         * @type {Array}
         *
         * @description
         * Holds templates with its facility types.
         */
        vm.templateFacilityTypes = undefined;

        vm.$onInit = onInit;

        /**
         * @ngdoc method
         * @methodOf admin-template-list.controller:TemplateListAdminController
         * @name onInit
         *
         * @description
         * Prepares templates to display.
         *
         * @return {Array}  Programs with templates.
         */
        function onInit() {
            vm.templates = templates;
            vm.programs = programs;
            vm.programTemplates = templateListFactory.getProgramTemplates(vm.templates, vm.programs);
            vm.templateFacilityTypes = templateFacilityTypes;
        }
    }
})();
