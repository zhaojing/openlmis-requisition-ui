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
     * @name admin-program-add.controller:ProgramAddController
     *
     * @description
     * Controller for program add screen.
     */
    angular
        .module('admin-program-add')
        .controller('ProgramAddController', ProgramAddController);

    ProgramAddController.$inject = ['$stateParams', '$state', 'programService', 'confirmService', 'notificationService', 'loadingModalService', 'messageService'];

    function ProgramAddController($stateParams, $state, programService, confirmService, notificationService, loadingModalService, messageService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.saveProgram = saveProgram;
        vm.goToPreviousState = goToPreviousState;

        /**
         * @ngdoc property
         * @propertyOf admin-program-add.controller:ProgramAddController
         * @name program
         * @type {Object}
         *
         * @description
         * Holds program that will be created.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @methodOf admin-program-add.controller:ProgramAddController
         * @name onInit
         *
         * @description
         * Initialization method for ProgramAddController.
         */
        function onInit() {
            vm.program = {
                active: true
            };
        }

        /**
         * @ngdoc property
         * @methodOf admin-program-add.controller:ProgramAddController
         * @name saveProgram
         *
         * @description
         * Saves program to the server. Before action confirm modal will be shown.
         */
        function saveProgram() {
            var confirmMessage = messageService.get('adminProgramAdd.createProgram.confirm', {
                program: vm.program.name
            });
            confirmService.confirm(confirmMessage, 'adminProgramAdd.create')
            .then(function() {
                var loadingPromise = loadingModalService.open();
                programService.create(vm.program)
                .then(function() {
                    loadingPromise
                    .then(function() {
                        notificationService.success('adminProgramAdd.createProgram.success')
                    });
                    $state.go('openlmis.administration.programs', $stateParams, {
                        reload: true
                    });
                })
                .catch(function() {
                    notificationService.error('adminProgramAdd.createProgram.failure');
                    loadingModalService.close();
                });
            });
        }

        /**
         * @ngdoc property
         * @methodOf admin-program-add.controller:ProgramAddController
         * @name goToPreviousState
         *
         * @description
         * Redirects user to program list screen.
         */
        function goToPreviousState() {
            $state.go('openlmis.administration.programs');
        }
    }
})();
