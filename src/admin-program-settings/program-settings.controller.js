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
     * @name admin-program-settings.controller:ProgramSettingsController
     *
     * @description
     * Controller for program settings edit screen.
     */
    angular
        .module('admin-program-settings')
        .controller('ProgramSettingsController', ProgramSettingsController);

    ProgramSettingsController.$inject = ['$state', 'program', 'programService', 'confirmService', 'notificationService', 'loadingModalService'];

    function ProgramSettingsController($state, program, programService, confirmService, notificationService, loadingModalService) {

        var vm = this;

        vm.$onInit = onInit
        vm.saveProgram = saveProgram;

        /**
         * @ngdoc property
         * @propertyOf admin-program-settings.controller:ProgramSettingsController
         * @name program
         * @type {Object}
         *
         * @description
         * Holds program that can be edited and saved.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-program-settings.controller:ProgramSettingsController
         * @name onInit
         *
         * @description
         * Initialization method for ProgramSettingsController.
         */
        function onInit() {
            vm.program = angular.copy(program);
        }

        /**
         * @ngdoc property
         * @methodOf admin-program-settings.controller:ProgramSettingsController
         * @name saveProgram
         *
         * @description
         * Saves program to the server. Before action confirm modal will be shown.
         */
        function saveProgram() {
            confirmService.confirm('adminProgramSettings.saveProgramSettingsConfirm').then(function() {
                loadingModalService.open();
                programService.update(vm.program).then(function() {
                    notificationService.success('adminProgramSettings.programSettingsSavedSuccessfully');
                    $state.go('openlmis.administration.programs');
                }, function() {
                    notificationService.error('adminProgramSettings.programSettingsSaveFailed');
                }).finally(loadingModalService.close);
            });
        }


    }
})();
