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

describe('AddProductModalController', function() {

    var vm, $controller, OrderableDataBuilder, $q, $rootScope, modalDeferred, categories;

    beforeEach(function() {
        module('requisition-view-tab');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
        });

        categories = [{
            category: 'Category One',
            products: [
                new OrderableDataBuilder().build(),
                new OrderableDataBuilder().build()
            ]
        }, {
            category: 'Category Two',
            products: [
                new OrderableDataBuilder().build(),
                new OrderableDataBuilder().build()
            ]
        }];

        modalDeferred = $q.defer();

        vm = $controller('AddProductModalController', {
            modalDeferred: modalDeferred,
            categories: categories
        });
    });

    describe('$onInit', function() {

        it('should expose categories', function() {
            vm.$onInit();

            expect(vm.categories).toEqual(categories);
        });

        it('should expose modalDeferred.reject method', function() {
            vm.$onInit();

            expect(vm.close).toBe(modalDeferred.reject);
        });

    });

    describe('addProduct', function() {

        it('should resolve modal deferred with selected product', function() {
            vm.selectedProduct = categories[0].products[0];
            vm.requestedQuantity = 125;
            vm.requestedQuantityExplanation = 'Some test explanation';

            var result;
            modalDeferred.promise
            .then(function(response) {
                result = response;
            });

            vm.addProduct();
            $rootScope.$apply();

            expect(result.orderable).toEqual(categories[0].products[0]);
            expect(result.requestedQuantity).toEqual(125);
            expect(result.requestedQuantityExplanation).toEqual('Some test explanation');
        });

    });

});
