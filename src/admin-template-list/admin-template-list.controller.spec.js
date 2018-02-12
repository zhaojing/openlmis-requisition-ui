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

describe('TemplateListAdminController', function() {

    var vm, template, program, ProgramDataBuilder, TemplateDataBuilder, $controller,
        FacilityTypeDataBuilder;

    beforeEach(function() {
        module('admin-template-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
        });

        program = new ProgramDataBuilder().withId('program-1').build();

        template = new TemplateDataBuilder()
            .withFacilityTypes([
                new FacilityTypeDataBuilder().build(),
                new FacilityTypeDataBuilder().buildDistrictHospital().build()
            ]).build();

        vm = $controller('TemplateListAdminController', {
            programs: [program],
            templates: [template]
        });
    });

    describe('init', function() {

        it('should set templates and programs', function() {
            vm.$onInit();
            expect(vm.programs).toEqual([program]);
            expect(vm.templates).toEqual([template]);
        });

        it('should add templates to program', function() {
            vm.$onInit();
            expect(vm.programs[0].templates).toEqual([template]);
        });
    });

});
