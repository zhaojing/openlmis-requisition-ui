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

describe('RequisitionTemplateAdminController', function() {

    //tested
    var vm;

    //mocks
    var template, program, loadingModalService;

    //injects
    var q, state, notificationService, COLUMN_SOURCES, rootScope, MAX_COLUMN_DESCRIPTION_LENGTH;

    beforeEach(function() {
        module('program-requisition-template');

        template = jasmine.createSpyObj('template', ['$save', '$moveColumn', '$findCircularCalculatedDependencies']);
        template.id = '1';
        template.programId = '1';
        template.columnsMap = {
            remarks: {
                displayOrder: 1,
                isDisplayed: true,
                label: 'Remarks'
            },
            total: {
                displayOrder: 2,
                isDisplayed: true,
                label: 'Total'
            },
            stockOnHand: {
                displayOrder: 3,
                isDisplayed: true,
                label: "Stock on Hand"
            },
            averageConsumption: {
                name: 'averageConsumption',
                displayOrder: 4,
                isDisplayed: true,
                label: "Average Consumption"
            }
        };
        template.numberOfPeriodsToAverage = 3;
        program = {
            id: '1',
            name: 'program1'
        };

        inject(function($injector) {

            q = $injector.get('$q');
            state = $injector.get('$state');
            notificationService = $injector.get('notificationService');
            COLUMN_SOURCES = $injector.get('COLUMN_SOURCES');
            MAX_COLUMN_DESCRIPTION_LENGTH = $injector.get('MAX_COLUMN_DESCRIPTION_LENGTH');
            loadingModalService = $injector.get('loadingModalService');
            message = $injector.get('messageService');
            rootScope = $injector.get('$rootScope');

            vm = $injector.get('$controller')('RequisitionTemplateAdminController', {
                program: program,
                template: template
            });
        });
    });

    it('should set template and program', function() {
        expect(vm.program).toEqual(program);
        expect(vm.template).toEqual(template);
    });

    it('should save template and then display success notification and change state', function() {
        var stateGoSpy = jasmine.createSpy(),
            notificationServiceSpy = jasmine.createSpy();

        template.$save.andReturn(q.when(true));

        spyOn(state, 'go').andCallFake(stateGoSpy);
        spyOn(notificationService, 'success').andCallFake(notificationServiceSpy);

        vm.saveTemplate();

        rootScope.$apply();

        expect(stateGoSpy).toHaveBeenCalled();
        expect(notificationServiceSpy).toHaveBeenCalled();
    });

    it('should open loading modal when when saving template', function() {
        spyOn(loadingModalService, 'open');
        template.$save.andReturn(q.when(true));

        vm.saveTemplate();

        expect(loadingModalService.open).toHaveBeenCalled();
    });

    it('should close loading modal if template save was successful', function() {
        spyOn(loadingModalService, 'close');
        template.$save.andReturn(q.when(true));

        vm.saveTemplate();
        rootScope.$apply();

        expect(loadingModalService.close).toHaveBeenCalled();
    });

    it('should close loading modal if template save was unsuccessful', function() {
        spyOn(loadingModalService, 'close');
        template.$save.andReturn(q.reject());

        vm.saveTemplate();
        rootScope.$apply();

        expect(loadingModalService.close).toHaveBeenCalled();
    });

    it('should call column drop method and display error notification when drop failed', function() {
        var notificationServiceSpy = jasmine.createSpy();

        template.$moveColumn.andReturn(false);

        spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

        vm.dropCallback(null, 1, template.columnsMap.total);

        expect(notificationServiceSpy).toHaveBeenCalled();
    });

    it('can change source works correctly', function() {
        expect(vm.canChangeSource({
            sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
        })).toBe(true);
        expect(vm.canChangeSource({
            sources: [COLUMN_SOURCES.USER_INPUT]
        })).toBe(false);
    });

});
