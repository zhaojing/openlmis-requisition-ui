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

describe('SelectProductsModalController', function() {

    var vm, $controller, products, $q, $rootScope, modalDeferred, OrderableDataBuilder;

    beforeEach(function() {
        module('referencedata-orderable');
        module('select-products-modal');

        //Polyfill snippet as our version of PhantomJS doesn't support startsWith yet
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(search, pos) {
                return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
            };
        }

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        modalDeferred = $q.defer();

        products = [
            new OrderableDataBuilder()
                .withFullProductName('Product One')
                .withProductCode('PC1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Two pc2')
                .withProductCode('PS1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Three')
                .withProductCode('XB1')
                .build(),
            new OrderableDataBuilder()
                .withFullProductName('Product Four')
                .withProductCode('N64')
                .build()
        ];

        vm = $controller('SelectProductsModalController', {
            modalDeferred: modalDeferred,
            products: products
        });

        vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose requisitionLineItems', function() {
            expect(vm.products).toEqual(products);
        });

        it('should expose modalDeferred.reject method', function() {
            expect(vm.close).toBe(modalDeferred.reject);
        });

        it('should initialize selection object', function() {
            expect(vm.selections).toEqual({});
        });
    });

    describe('selectProducts', function() {

        it('should resolve to selected products', function() {
            vm.selections[products[0].id] = true;
            vm.selections[products[2].id] = true;

            var result;
            modalDeferred.promise
                .then(function(response) {
                    result = response;
                });

            vm.selectProducts();
            $rootScope.$apply();

            expect(result).toEqual([
                products[0],
                products[2]
            ]);
        });

    });

    describe('search', function() {

        it('should show all for empty filter', function() {
            vm.searchText = '';

            vm.search();

            expect(vm.filteredProducts).toEqual(products);
        });

        it('should show all for undefined', function() {
            vm.searchText = undefined;

            vm.search();

            expect(vm.filteredProducts).toEqual(products);
        });

        it('should show all for null', function() {
            vm.searchText = null;

            vm.search();

            expect(vm.filteredProducts).toEqual(products);
        });

        it('should only return codes starting with the search text', function() {
            vm.searchText = 'Ps';

            vm.search();

            expect(vm.filteredProducts).toEqual([products[1]]);

            vm.searchText = '1';

            vm.search();

            expect(vm.filteredProducts).toEqual([]);
        });

        it('should search by both code and full product name', function() {
            vm.searchText = 'pC';

            vm.search();

            expect(vm.filteredProducts).toEqual([products[0], products[1]]);
        });

    });

});
