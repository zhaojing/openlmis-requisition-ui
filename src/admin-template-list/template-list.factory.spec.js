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

describe('templateListFactory', function() {

    var template, program, ProgramDataBuilder, TemplateDataBuilder, FacilityTypeDataBuilder,
        programTwo, templateTwo, templateThree, districtHospital, healthCenter, districtStore,
        templateListFactory, facilityTypeService, templates, $q, $rootScope, result;

    beforeEach(function() {
        module('admin-template-list');

        inject(function($injector) {
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            templateListFactory = $injector.get('templateListFactory');
            facilityTypeService = $injector.get('facilityTypeService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        program = new ProgramDataBuilder().withId('program-1').build();
        programTwo = new ProgramDataBuilder().withId('program-2').build();

        districtHospital = new FacilityTypeDataBuilder().buildDistrictHospital();
        healthCenter = new FacilityTypeDataBuilder();
        districtStore = new FacilityTypeDataBuilder().buildDistrictStore();

        template = new TemplateDataBuilder()
            .withFacilityTypes([healthCenter, districtHospital])
            .build();

        templateTwo = new TemplateDataBuilder()
            .withProgram(program)
            .withFacilityTypes([healthCenter])
            .build();

        templateThree = new TemplateDataBuilder()
            .withProgram(programTwo)
            .withFacilityTypes([districtStore])
            .build();

        templates = [template, templateTwo, templateThree];
    });

    describe('getProgramTemplates', function() {

        it('should return programs with its templates', function() {
            result = templateListFactory.getProgramTemplates(templates, [program, programTwo]);

            expect(result[program.id]).toEqual([template, templateTwo]);
            expect(result[programTwo.id]).toEqual([templateThree]);
        });
    });

    describe('getTemplateFacilityTypes', function() {

        it('should return templates with its facility types', function() {
            spyOn(facilityTypeService, 'query').andReturn($q.when([districtHospital, districtStore, healthCenter]));

            templateListFactory.getTemplateFacilityTypes(templates).then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result[template.id]).toEqual([healthCenter, districtHospital]);
            expect(result[templateTwo.id]).toEqual([healthCenter]);
            expect(result[templateThree.id]).toEqual([districtStore]);
        });
    });

});
