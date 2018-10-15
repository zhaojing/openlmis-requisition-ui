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

describe('selectProductsModalService', function() {

    beforeEach(function() {
        module('referencedata-orderable');
        module('select-products-modal');

        var OrderableDataBuilder;
        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.selectProductsModalService = $injector.get('selectProductsModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
        });

        this.products = [
            new OrderableDataBuilder().buildJson(),
            new OrderableDataBuilder().buildJson()
        ];
        this.dialogDeferred = this.$q.defer();
        this.dialog = {
            promise: this.dialogDeferred.promise
        };

        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialog);
    });

    describe('show', function() {

        it('it should not open second dialog if the first one is still open', function() {
            this.selectProductsModalService.show(this.products);
            this.selectProductsModalService.show(this.products);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);
        });

        it('should close modal if adding product succeeds', function() {
            this.selectProductsModalService.show(this.products);
            this.dialogDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.selectProductsModalService.show(this.products);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

        it('should close modal if adding product fails', function() {
            this.selectProductsModalService.show(this.products);
            this.dialogDeferred.reject();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.selectProductsModalService.show(this.products);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

    });

});
