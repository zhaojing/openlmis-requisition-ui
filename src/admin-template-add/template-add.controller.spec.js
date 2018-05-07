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

    var $state, $controller, ProgramDataBuilder, vm, program, FacilityTypeDataBuilder,
        RequisitionColumnDataBuilder, productNameColumn, facilityTypes, productCodeColumn;

    beforeEach(function() {
        module('admin-template-add');
        module('referencedata-facility-type');
        module('requisition-template');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
        });

        program = new ProgramDataBuilder().build();
        productNameColumn = new RequisitionColumnDataBuilder().buildProductNameColumn();
        productCodeColumn = new RequisitionColumnDataBuilder().buildProductCodeColumn();
        facilityTypes = [
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build()
        ];

        vm = $controller('TemplateAddController', {
            programs: [program],
            facilityTypes: facilityTypes,
            availableColumns: [productCodeColumn]
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should resolve program', function() {
            expect(vm.programs).toEqual([program]);
        });

        it('should resolve facility types', function() {
            expect(vm.facilityTypes).toEqual(facilityTypes);
        });

        it('should resolve template', function() {
            expect(vm.template).toEqual({ facilityTypes: []});
        });

        it('should resolve available columns', function() {
            expect(vm.availableColumns).toEqual([productCodeColumn]);
        });

        it('should resolve selected columns', function() {
            expect(vm.selectedColumns).toEqual([]);
        });
    });

    describe('addFacilityType', function() {

        it('should add facility type', function() {
            vm.selectedFacilityType = facilityTypes[0];
            vm.addFacilityType();

            expect(vm.template.facilityTypes).toEqual([vm.selectedFacilityType]);
        });
    });

    describe('removeFacilityType', function() {

        beforeEach(function() {
            vm.template.facilityTypes = [facilityTypes[0]];
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

    describe('validateFacilityType', function() {

        beforeEach(function() {
            vm.selectedFacilityType = facilityTypes[0];
        });

        it('should return error if facility type is already added', function() {
            vm.template.facilityTypes = [vm.selectedFacilityType];
            var error = vm.validateFacilityType();

            expect(error).toEqual('adminTemplateAdd.facilityTypeAlreadyAdded');
        });

        it('should not return error if facility type does not exist', function() {
            vm.template.facilityTypes = [];
            var error = vm.validateFacilityType();

            expect(error).toEqual(undefined);
        });
    });

    describe('addColumn', function() {

        it('should add column', function() {
            vm.selectedColumn = productNameColumn;
            vm.addColumn();

            expect(vm.selectedColumn.isDisplayed).toEqual(true);
            expect(vm.selectedColumns).toEqual([productNameColumn]);
        });
    });

    describe('removeColumn', function() {

        beforeEach(function() {
            vm.selectedColumns = [productNameColumn];
        });

        it('should remove column', function() {
            vm.removeColumn(productNameColumn);

            expect(vm.selectedColumns).toEqual([]);
        });

        it('should not remove if facility type was not found', function() {
            vm.removeColumn(new RequisitionColumnDataBuilder().buildRequestedQuantityColumn());

            expect(vm.selectedColumns).toEqual([productNameColumn]);
        });
    });

    describe('validateColumn', function() {

        beforeEach(function() {
            vm.selectedColumn = productNameColumn;
        });

        it('should return error if column is already added', function() {
            vm.selectedColumns = [vm.selectedColumn];
            var error = vm.validateColumn();

            expect(error).toEqual('adminTemplateAdd.columnAlreadyAdded');
        });

        it('should not return error if column does not exist', function() {
            var error = vm.validateColumn();

            expect(error).toEqual(undefined);
        });
    });
});
