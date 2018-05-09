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

describe('TemplateAddController', function () {

    var $rootScope, $q, $state, $controller, ProgramDataBuilder, vm, program, FacilityTypeDataBuilder, TemplateDataBuilder,
        TemplateColumnDataBuilder, productNameColumn, facilityTypes, productCodeColumn,
        confirmService, loadingModalService, requisitionTemplateService, notificationService, messageService,
        templateOne, templateTwo, healthCenter, districtHospital, programTemplates, programTwo,
        Template;

    beforeEach(function() {
        module('admin-template-add');
        module('referencedata-facility-type');
        module('requisition-template');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            TemplateColumnDataBuilder = $injector.get('TemplateColumnDataBuilder');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
            confirmService = $injector.get('confirmService');
            loadingModalService = $injector.get('loadingModalService');
            requisitionTemplateService = $injector.get('requisitionTemplateService');
            notificationService = $injector.get('notificationService');
            messageService = $injector.get('messageService');
            Template = $injector.get('Template');
        });

        program = new ProgramDataBuilder().withId('program-1').build();
        programTwo = new ProgramDataBuilder().withId('program-2').build();
        
        productNameColumn = new TemplateColumnDataBuilder().build();
        productCodeColumn = new TemplateColumnDataBuilder().build();
        
        districtHospital = new FacilityTypeDataBuilder.buildDistrictHospital();
        healthCenter = new FacilityTypeDataBuilder().build();

        templateOne = new TemplateDataBuilder()
            .withFacilityTypes([healthCenter, districtHospital])
            .build();

        templateTwo = new TemplateDataBuilder()
            .withFacilityTypes([healthCenter])
            .build();

        programTemplates = {};
        programTemplates[program.id] = [templateOne];
        programTemplates[programTwo.id] = [templateTwo];

        facilityTypes = [
            districtHospital,
            healthCenter
        ];

        vm = $controller('TemplateAddController', {
            programs: [program, programTwo],
            facilityTypes: facilityTypes,
            availableColumns: [productCodeColumn.columnDefinition],
            programTemplates: programTemplates
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should resolve program', function() {
            expect(vm.programs).toEqual([program, programTwo]);
        });

        it('should resolve template', function() {
            expect(vm.template instanceof Template).toBe(true);
        });

        it('should resolve available columns', function() {
            expect(vm.availableColumns).toEqual([productCodeColumn.columnDefinition]);
        });
    });

    describe('addFacilityType', function() {

        it('should add facility type', function() {
            vm.facilityTypes = facilityTypes;
            vm.selectedFacilityType = facilityTypes[0];
            vm.addFacilityType();

            expect(vm.template.facilityTypes).toEqual([vm.selectedFacilityType]);
        });
    });

    describe('removeFacilityType', function() {

        beforeEach(function() {
            vm.template.facilityTypes = [facilityTypes[0]];
            vm.facilityTypes = facilityTypes;
        });

        it('should remove facility type', function() {
            vm.removeFacilityType(facilityTypes[0]);

            expect(vm.template.facilityTypes).toEqual([]);
        });

        it('should not remove if facility type was not found', function() {
            vm.removeFacilityType(new FacilityTypeDataBuilder().build());

            expect(vm.template.facilityTypes).toEqual([facilityTypes[0]]);
        });
    });

    describe('addColumn', function() {

        it('should add column', function() {
            vm.selectedColumn = productNameColumn.columnDefinition;
            vm.addColumn();

            expect(vm.availableColumns.indexOf(vm.selectedColumn)).toEqual(-1);
            expect(vm.template.columnsMap[vm.selectedColumn.name]).not.toBeUndefined();
        });
    });

    describe('removeColumn', function() {

        it('should remove column', function() {
            vm.template.addColumn(productNameColumn.columnDefinition);

            vm.removeColumn(productNameColumn.columnDefinition.name);
            $rootScope.$apply();

            expect(vm.template.columnsMap[vm.availableColumns[0].name]).toBeUndefined();
            expect(vm.availableColumns.length).toBe(2);
        });

        it('should not remove if facility type was not found', function() {
            vm.removeColumn(productNameColumn.columnDefinition.name);
            $rootScope.$apply();

            expect(vm.availableColumns.length).toBe(1);
        });
    });

    describe('create', function() {

        beforeEach(function() {
            spyOn(confirmService, 'confirm').andReturn($q.resolve());
            spyOn(loadingModalService, 'open').andReturn($q.resolve());
            spyOn(loadingModalService, 'close').andReturn($q.resolve());
            spyOn(requisitionTemplateService, 'create').andReturn($q.resolve());
            spyOn(notificationService, 'success').andReturn($q.resolve());
            spyOn(notificationService, 'error').andReturn($q.resolve());
            spyOn(messageService, 'get').andCallFake(function(messageKey) {
                return messageKey;
            });

            vm.template.program = program;
        });

        it('should create a template and display success notification', function() {
            vm.create();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminTemplateAdd.createTemplate.confirm', 'adminTemplateAdd.create');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(requisitionTemplateService.create).toHaveBeenCalledWith(vm.template);
            expect(notificationService.success).toHaveBeenCalledWith('adminTemplateAdd.createTemplate.success');
            expect($state.go).toHaveBeenCalledWith('openlmis.administration.requisitionTemplates', {}, {
                reload: true
            });
        });

        it('should not call any service when confirmation fails', function() {
            confirmService.confirm.andReturn($q.reject());

            vm.create();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminTemplateAdd.createTemplate.confirm', 'adminTemplateAdd.create');
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(requisitionTemplateService.create).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalledWith();
            expect($state.go).not.toHaveBeenCalled();
        });

        it('should display error notification when template creation fails', function() {
            requisitionTemplateService.create.andReturn($q.reject());

            vm.create();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminTemplateAdd.createTemplate.confirm', 'adminTemplateAdd.create');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(requisitionTemplateService.create).toHaveBeenCalledWith(vm.template);
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('adminTemplateAdd.createTemplate.failure');
            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.go).not.toHaveBeenCalledWith();
        });
    });
});
