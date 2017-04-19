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

describe('RequisitionApprovalListController', function () {

    //injects
    var vm, $state, $stateParams;

    //variables
    var requisitions, programs;

    beforeEach(function() {
        module('requisition-approval');

        inject(function ($controller, _$state_, _$stateParams_) {

            $state = _$state_;
            $stateParams = _$stateParams_;

            programs = [
                {
                    id: '1',
                    code: 'PRG001',
                    name: 'Family Planning'
                },
                {
                    id: '2',
                    code: 'PRG002',
                    name: 'Essential Meds'
                }
            ];

            requisitions = [
                {
                    id: 1,
                    facility: {
                        name: 'first facility',
                        code: 'first code'
                    },
                    program: programs[0]

                },
                {
                    id: 2,
                    facility: {
                        name: 'second facility',
                        code: 'second code'
                    },
                    program: programs[1]

                }
            ];

            spyOn($state, 'go');

            vm = $controller('RequisitionApprovalListController', {
                requisitions: requisitions,
                programs: programs
            });
        });
    });

    describe('$onInit', function() {

        it('should expose requisitions', function() {
            vm.$onInit();
            expect(vm.requisitions).toBe(requisitions);
        });

        it('should expose programs', function() {
            vm.$onInit();
            expect(vm.programs).toBe(programs);
        });

        it('should set selectedProgram if program ID was passed the URL', function() {
            $stateParams.program = '1';

            vm.$onInit();

            expect(vm.selectedProgram).toBe(programs[0]);
        });

        it('should not set selectedProgram if program ID was passed the URL', function() {
            $stateParams.program = undefined;

            vm.$onInit();

            expect(vm.selectedProgram).toBe(undefined);
        });

    });

    describe ('search', function() {

        it('should set program', function() {
            vm.selectedProgram = programs[0];

            vm.search();

            expect($state.go).toHaveBeenCalledWith('requisitions.approvalList', {
                program: vm.selectedProgram.id
            }, {reload: true});
        });


        it('should reload state', function() {
            vm.search();

            expect($state.go).toHaveBeenCalled();
        });
    });


    describe ('openRnr', function() {

        it('should go to fullSupply state', function () {
            vm.openRnr(requisitions[0].id);

            expect($state.go).toHaveBeenCalledWith('requisitions.requisition.fullSupply', {rnr: requisitions[0].id});
        });
    });
});
