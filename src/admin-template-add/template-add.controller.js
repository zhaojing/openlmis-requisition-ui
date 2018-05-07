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
     * @name admin-template-add.controller:TemplateAddController
     *
     * @description
     * Controller for Requisition Template Add screen.
     */
    angular
        .module('admin-template-add')
        .controller('TemplateAddController', TemplateAddController);

    TemplateAddController.$inject = ['$q', 'programs', 'facilityTypes', 'availableColumns', 'confirmService', 'requisitionTemplateService',
        'notificationService', 'loadingModalService', 'messageService'];

    function TemplateAddController($q, programs, facilityTypes, availableColumns, confirmService, requisitionTemplateService,
        notificationService, loadingModalService, messageService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.create = create;
        vm.addFacilityType = addFacilityType;
        vm.removeFacilityType = removeFacilityType;
        vm.validateFacilityType = validateFacilityType;
        vm.addColumn = addColumn;
        vm.removeColumn = removeColumn;
        vm.validateColumn = validateColumn;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name programs
         * @type {Array}
         *
         * @description
         * Holds list of available Programs.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name facilityTypes
         * @type {Array}
         *
         * @description
         * Holds list of available Facility Types.
         */
        vm.facilityTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name availableColumns
         * @type {Array}
         *
         * @description
         * Holds list of available Requsition Template Columns.
         */
        vm.availableColumns = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name template
         * @type {Object}
         *
         * @description
         * Holds Template that will be created.
         */
        vm.template = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * Holds selected Program for the new Template.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name selectedFacilityType
         * @type {Object}
         *
         * @description
         * Holds selected Facility Type that will be added to list of Facility Types.
         */
        vm.selectedFacilityType = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name selectedFacilityTypes
         * @type {Array}
         *
         * @description
         * Holds list of selected Facility Types for new Template.
         */
        vm.selectedFacilityTypes = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name selectedColumn
         * @type {Object}
         *
         * @description
         * Holds list of selected Facility Types for new Template.
         */
        vm.selectedColumn = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-add.controller:TemplateAddController
         * @name selectedColumns
         * @type {Array}
         *
         * @description
         * Holds list of selected Facility Types for new Template.
         */
        vm.selectedColumns = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name $onInit
         *
         * @description
         * Initialization method for TemplateAddController.
         */
        function onInit() {
            vm.programs = programs;
            vm.facilityTypes = facilityTypes;
            vm.availableColumns = availableColumns;
            vm.template = {};
            vm.selectedFacilityTypes = [];
            vm.selectedColumns = [];
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name saveProgram
         *
         * @description
         * Saves program to the server. Before action confirm modal will be shown.
         */
        function create() {
            var confirmMessage = messageService.get('adminTemplateAdd.createTemplate.confirm', {
                program: vm.program.name
            });
            confirmService.confirm(confirmMessage, 'adminProgramAdd.create')
            .then(function() {
                var loadingPromise = loadingModalService.open();

                // create template

                requisitionTemplateService.create(vm.template)
                .then(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.success('adminTemplateAdd.createTemplate.success')
                    });
                    $state.go('openlmis.administration.requisitionTemplates', $stateParams, {
                        reload: true
                    });
                })
                .catch(function() {
                    notificationService.error('adminTemplateAdd.createTemplate.failure');
                    loadingModalService.close();
                });
            });
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name addFacilityType
         *
         * @description
         * Adds new Facility Type to the list.
         * 
         * @return {Promise} resolved promise
         */
        function addFacilityType() {
            vm.selectedFacilityTypes.push(vm.selectedFacilityType);
            return $q.resolve();
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name removeFacilityType
         *
         * @description
         * Removes new Facility Type from the list.
         * 
         * @param {Object} facilityType Facility Type to be removed from list
         */
        function removeFacilityType(facilityType) {
            vm.selectedFacilityTypes.splice(vm.selectedFacilityTypes.indexOf(facilityType), 1);
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name validateFacilityType
         *
         * @description
         * Validates selected Facility Type, if it is already added returns error message, otherwise it returns nothing
         * 
         * @return {string} the validation error message
         */
        function validateFacilityType() {
            if (vm.selectedFacilityTypes.indexOf(vm.selectedFacilityType) > -1) {
                return 'adminTemplateAdd.facilityTypeAlreadyAdded';
            }
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name addColumn
         *
         * @description
         * Adds new Requisition Column to the list.
         * 
         * @return {Promise} resolved promise
         */
        function addColumn() {
            vm.selectedColumns.push(vm.selectedColumn);
            return $q.resolve();
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name removeColumn
         *
         * @description
         * Removes Requisition Column from the list of seleted columns.
         * 
         * @param {Object} column Requistion Column to be removed from
         */
        function removeColumn(column) {
            vm.selectedColumns.splice(vm.selectedColumns.indexOf(column), 1);
        }

        /**
         * @ngdoc property
         * @methodOf admin-template-add.controller:TemplateAddController
         * @name validateColumn
         *
         * @description
         * Validates selected Requisition Column if it is already added, returns error message, otherwise it returns nothing
         * 
         * @return {string} the validation error message if already added
         */
        function validateColumn() {
            if (vm.selectedColumns.indexOf(vm.selectedColumn) > -1) {
                return 'adminTemplateAdd.columnAlreadyAdded';
            }
        }
    }
})();
