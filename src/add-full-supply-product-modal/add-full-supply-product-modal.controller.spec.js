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

describe('AddFullSupplyProductModalController', function() {

    var vm, $controller, RequisitionLineItemDataBuilder, ProgramDataBuilder, program,
        $q, $rootScope, modalDeferred, requisitionLineItems;

    beforeEach(function() {
        module('add-full-supply-product-modal');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            RequisitionLineItemDataBuilder = $injector.get('RequisitionLineItemDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        program = new ProgramDataBuilder().build();
        requisitionLineItems = [new RequisitionLineItemDataBuilder()
            .asSkipped()
            .fullSupplyForProgram(program)
            .buildJson()];

        modalDeferred = $q.defer();

        vm = $controller('AddFullSupplyProductModalController', {
            modalDeferred: modalDeferred,
            requisitionLineItems: requisitionLineItems
        });
    });

    describe('$onInit', function() {

        it('should expose requisitionLineItems', function() {
            vm.$onInit();

            expect(vm.requisitionLineItems).toEqual(requisitionLineItems);
        });

        it('should expose modalDeferred.reject method', function() {
            vm.$onInit();

            expect(vm.close).toBe(modalDeferred.reject);
        });

        it('should initialize the lineItemsToAdd as empty array ', function() {
            vm.$onInit();

            expect(vm.lineItemsToAdd.length).toBe(0);
        });
    });

    describe('toggleAddLineItem', function() {

        it('should add a line item if it does not exist in the to add list', function() {
            vm.$onInit();
            var line = vm.requisitionLineItems[0];
            vm.toggleAddLineItem(line);

            expect(vm.lineItemsToAdd.length).toBe(1);
            expect(vm.lineItemsToAdd[0]).toBe(line);
        });

        it('should remove a line item if it does not exist in the to add list', function() {
            vm.$onInit();
            var line = vm.requisitionLineItems[0];
            vm.toggleAddLineItem(line);
            vm.toggleAddLineItem(line);

            expect(vm.lineItemsToAdd.length).toBe(0);
        });
    });

    describe('addProducts', function() {
        it('should add resolve with lineItems', function() {
            vm.$onInit();
            var line = vm.requisitionLineItems[0];
            vm.toggleAddLineItem(line);

            var result;
            modalDeferred.promise
                .then(function(response) {
                    result = response;
                });

            vm.addProducts();
            $rootScope.$apply();

            expect(result.items[0]).toEqual(line);
        });
    });

    describe('refreshList', function() {

        it('should filter by filter function when search text is different from empty string', function() {
            vm.$onInit();
            vm.requisitionLineItems = jasmine.createSpyObj('requisitionLineItems', ['filter']);
            vm.searchText = 'xxx';

            vm.refreshList();

            expect(vm.requisitionLineItems.filter).toHaveBeenCalled();

        });

        it('should not filter for empty filter', function() {
            vm.$onInit();
            vm.requisitionLineItems = jasmine.createSpyObj('requisitionLineItems', ['filter']);
            vm.searchText = '';

            vm.refreshList();

            expect(vm.requisitionLineItems.filter).not.toHaveBeenCalled();

        });
    });

});
