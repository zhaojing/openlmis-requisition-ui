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

        var OrderableDataBuilder;
        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        this.modalDeferred = this.$q.defer();

        this.products = [
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

        this.vm = this.$controller('SelectProductsModalController', {
            modalDeferred: this.modalDeferred,
            products: this.products
        });

        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose requisitionLineItems', function() {
            expect(this.vm.products).toEqual(this.products);
        });

        it('should expose this.modalDeferred.reject method', function() {
            expect(this.vm.close).toBe(this.modalDeferred.reject);
        });

        it('should initialize selection object', function() {
            expect(this.vm.selections).toEqual({});
        });
    });

    describe('selectProducts', function() {

        it('should resolve to selected this.products', function() {
            this.vm.selections[this.products[0].id] = true;
            this.vm.selections[this.products[2].id] = true;

            var result;
            this.modalDeferred.promise
                .then(function(response) {
                    result = response;
                });

            this.vm.selectProducts();
            this.$rootScope.$apply();

            expect(result).toEqual([
                this.products[0],
                this.products[2]
            ]);
        });

    });

    describe('search', function() {

        it('should show all for empty filter', function() {
            this.vm.searchText = '';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should show all for undefined', function() {
            this.vm.searchText = undefined;

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should show all for null', function() {
            this.vm.searchText = null;

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual(this.products);
        });

        it('should only return codes starting with the search text', function() {
            this.vm.searchText = 'Ps';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([this.products[1]]);

            this.vm.searchText = '1';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([]);
        });

        it('should search by both code and full product name', function() {
            this.vm.searchText = 'pC';

            this.vm.search();

            expect(this.vm.filteredProducts).toEqual([this.products[0], this.products[1]]);
        });

    });

});
