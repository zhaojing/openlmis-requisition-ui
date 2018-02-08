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

    var vm, template, program, ProgramDataBuilder, $controller;

    beforeEach(function() {
        module('admin-template-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        program = new ProgramDataBuilder().build();

        template = jasmine.createSpyObj('template', ['$save']);
        template.id = '1';
        template.programId = program.id;
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
    });

});
