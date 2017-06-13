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
        .module('openlmis-facility-program-select')
        .controller('OpenlmisFacilityProgramSelectController', controller);

    controller.$inject = [
        '$q', 'loadingModalService', 'facilityFactory', 'programService', 'authorizationService',
        'REQUISITION_RIGHTS', 'notificationService', 'facilityService'
    ];

    function controller($q, loadingModalService, facilityFactory, programService,
                        authorizationService, REQUISITION_RIGHTS, notificationService,
                        facilityService) {

        var createRightId, authorizeRightId, userId, homeFacility, vm = this;

        vm.$onInit = onInit;
        vm.updateForm = updateForm;
        vm.updateFacilities = updateFacilities;

        function onInit() {
            loadingModalService.open();

            createRightId = getRightId(REQUISITION_RIGHTS.REQUISITION_CREATE);
            authorizeRightId = getRightId(REQUISITION_RIGHTS.REQUISITION_AUTHORIZE);
            userId = authorizationService.getUser().user_id;

            $q.all([
                facilityFactory.getUserHomeFacility(),
                programService.getUserPrograms(userId, true),
                programService.getUserPrograms(userId, false)
            ]).then(function(responses) {
                vm.homePrograms = responses[1];
                vm.supervisedPrograms = responses[2];
                homeFacility = responses[0];

                vm.hasHomeFacility = !!homeFacility;
                vm.isSupervised = vm.isSupervised || !vm.hasHomeFacility;

                updateFacilities(true);
            }).finally(function() {
                loadingModalService.close();
            });
        }

        function updateForm() {
            vm.program = undefined;
            vm.facility = undefined;
        }

        function updateFacilities(keepSelection) {
            if (!keepSelection) {
                vm.facility = undefined;
            }

            if (!vm.isSupervised) {
                vm.facilities = [homeFacility];
                vm.facilityId = homeFacility.id;
            } else if (!vm.program) {
                vm.facilities = [];
            } else {
                loadingModalService.open();
                var promises = [];

                if(createRightId) {
                    promises.push(facilityService.getUserSupervisedFacilities(
                        userId,
                        vm.program,
                        createRightId
                    ));
                }
                if(authorizeRightId) {
                    promises.push(facilityService.getUserSupervisedFacilities(
                        userId,
                        vm.program,
                        authorizeRightId
                    ));
                }

                if(promises.length > 0) {
                    $q.all(promises).then(function (facilities) {

                        if(promises.length > 1) {
                            vm.facilities = facilities[0].concat(facilities[1]);
                        } else {
                            vm.facilities = facilities[0];
                        }
                    })
                    .catch(function (error) {
                        notificationService.error('requisitionInitiate.errorOccurred');
                    })
                    .finally(loadingModalService.close);
                } else {
                    notificationService.error('requisitionInitiate.noRightToPerformThisAction');
                }
            }
        }

        function getRightId(rightName) {
            var right = authorizationService.getRightByName(rightName);
            return right ? right.id : undefined;
        }
    }

})();
