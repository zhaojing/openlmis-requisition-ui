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

describe('AdminTemplateConfigureController', function() {

    var vm, template, program, $controller, ProgramDataBuilder, TemplateDataBuilder;

    beforeEach(function() {
        module('admin-template-configure');
        module('admin-template-configure-columns');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
        });

        template = new TemplateDataBuilder().build();
        program = new ProgramDataBuilder().build();

        vm = $controller('AdminTemplateConfigureController', {
            template: template,
            program: program
        });
    });

    describe('init', function() {

        it('should expose program and template', function() {
            expect(vm.program).toEqual(program);
            expect(vm.template).toEqual(template);
        });
    });
});
