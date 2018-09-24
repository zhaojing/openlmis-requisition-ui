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

describe('addProductModalService', function() {

    beforeEach(function() {
        module('requisition-view-tab');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.addProductModalService = $injector.get('addProductModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.CategoryDataBuilder = $injector.get('CategoryDataBuilder');
        });

        this.dialogDeferred = this.$q.defer();
        this.dialog = {
            promise: this.dialogDeferred.promise
        };

        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialog);

        this.categories = [
            new this.CategoryDataBuilder().build(),
            new this.CategoryDataBuilder().build()
        ];

        this.fullSupply = true;
    });

    describe('show', function() {

        it('it should not open second dialog if the first one is still open', function() {
            this.addProductModalService.show(this.categories, this.fullSupply);
            this.addProductModalService.show(this.categories, this.fullSupply);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);
        });

        it('should close modal if adding product succeeds', function() {
            this.addProductModalService.show(this.categories, this.fullSupply);
            this.dialogDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.addProductModalService.show(this.categories, this.fullSupply);
            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

        it('should close modal if adding product fails', function() {
            this.addProductModalService.show(this.categories, this.fullSupply);
            this.dialogDeferred.reject();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.addProductModalService.show(this.categories, this.fullSupply);
            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

    });

});
