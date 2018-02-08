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
    var template, program, loadingModalService, message;

    //injects
    var q, $controller, state, notificationService, COLUMN_SOURCES, rootScope, TEMPLATE_COLUMNS, confirmService, requisitionTemplateService;

    beforeEach(function() {
        module('admin-template-configure-columns');

        template = jasmine.createSpyObj('template', ['moveColumn', 'findCircularCalculatedDependencies', 'isColumnDisabled', 'isValid']);
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
            TEMPLATE_COLUMNS = $injector.get('TEMPLATE_COLUMNS');
            q = $injector.get('$q');
            state = $injector.get('$state');
            notificationService = $injector.get('notificationService');
            COLUMN_SOURCES = $injector.get('COLUMN_SOURCES');
            loadingModalService = $injector.get('loadingModalService');
            rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            confirmService = $injector.get('confirmService');
            requisitionTemplateService = $injector.get('requisitionTemplateService');
        });

        vm = $controller('RequisitionTemplateAdminController', {
            program: program,
            template: template
        });
    });

    it('should set template and program', function() {
        expect(vm.program).toEqual(program);
        expect(vm.template).toEqual(template);
    });

    describe('save template', function() {

        var stateGoSpy = jasmine.createSpy(),
            successNotificationServiceSpy = jasmine.createSpy(),
            errorNotificationServiceSpy = jasmine.createSpy();

        beforeEach(function() {
            spyOn(notificationService, 'success').andCallFake(successNotificationServiceSpy);
            spyOn(notificationService, 'error').andCallFake(errorNotificationServiceSpy);

            spyOn(state, 'go').andCallFake(stateGoSpy);

            spyOn(loadingModalService, 'close');
            spyOn(loadingModalService, 'open');

            spyOn(confirmService, 'confirm').andReturn(q.resolve());

            spyOn(requisitionTemplateService, 'save').andReturn(q.resolve());

            template.isValid.andReturn(true);
        });

        it('should display error message when template is invalid', function() {
            template.isValid.andReturn(false);

            vm.saveTemplate();

            rootScope.$apply();

            expect(stateGoSpy).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(errorNotificationServiceSpy).toHaveBeenCalledWith('adminProgramTemplate.template.invalid');
            expect(confirmService.confirm).not.toHaveBeenCalled();
        });

        it('should not save template if confirm failed', function() {
            confirmService.confirm.andReturn(q.reject());

            vm.saveTemplate();

            rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'adminProgramTemplate.templateSave.description', 'adminProgramTemplate.save',
                undefined, 'adminProgramTemplate.templateSave.title');
            expect(stateGoSpy).not.toHaveBeenCalled();
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(successNotificationServiceSpy).not.toHaveBeenCalled();
        });

        it('should save template and then display success notification and change state', function() {
            vm.saveTemplate();

            rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'adminProgramTemplate.templateSave.description', 'adminProgramTemplate.save',
                undefined, 'adminProgramTemplate.templateSave.title');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(requisitionTemplateService.save).toHaveBeenCalledWith(template);
            expect(stateGoSpy).toHaveBeenCalled();
            expect(successNotificationServiceSpy).toHaveBeenCalledWith('adminProgramTemplate.templateSave.success');
        });

        it('should close loading modal if template save was unsuccessful', function() {
            requisitionTemplateService.save.andReturn(q.reject());

            vm.saveTemplate();
            rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'adminProgramTemplate.templateSave.description', 'adminProgramTemplate.save',
                undefined, 'adminProgramTemplate.templateSave.title');
            expect(loadingModalService.close).toHaveBeenCalled();
            expect(requisitionTemplateService.save).toHaveBeenCalledWith(template);
            expect(errorNotificationServiceSpy).toHaveBeenCalledWith('adminProgramTemplate.templateSave.failure');
        });
    });

    it('should call column drop method and display error notification when drop failed', function() {
        var notificationServiceSpy = jasmine.createSpy();

        template.moveColumn.andReturn(false);

        spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

        vm.dropCallback(null, 1, template.columnsMap.total);

        expect(notificationServiceSpy).toHaveBeenCalled();
    });

    it('can change source works correctly', function() {
        template.isColumnDisabled.andReturn(false);
        expect(vm.canChangeSource({
            columnDefinition: {
                name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
            }
        })).toBe(true);

        expect(vm.canChangeSource({
            columnDefinition: {
                sources: [COLUMN_SOURCES.USER_INPUT]
            }
        })).toBe(false);

        template.populateStockOnHandFromStockCards = true;
        expect(vm.canChangeSource({
            name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
            columnDefinition: {
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
            }
        })).toBe(false);

        template.isColumnDisabled.andReturn(true);
        template.populateStockOnHandFromStockCards = false;
        expect(vm.canChangeSource({
            columnDefinition: {
                name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                sources: [COLUMN_SOURCES.USER_INPUT, COLUMN_SOURCES.CALCULATED]
            }
        })).toBe(false);
    });
});
