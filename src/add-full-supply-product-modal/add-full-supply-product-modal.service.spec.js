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

describe('addFullSupplyProductModalService', function() {

    beforeEach(function() {
        module('add-full-supply-product-modal');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.addFullSupplyProductModalService = $injector.get('addFullSupplyProductModalService');
            this.openlmisModalService = $injector.get('openlmisModalService');
            this.RequisitionLineItemDataBuilder = $injector.get('RequisitionLineItemDataBuilder');
        });

        this.dialogDeferred = this.$q.defer();
        this.dialog = {
            promise: this.dialogDeferred.promise
        };

        spyOn(this.openlmisModalService, 'createDialog').andReturn(this.dialog);

        this.requisitionLineItemDataBuilders = [
            new this.RequisitionLineItemDataBuilder().buildJson(),
            new this.RequisitionLineItemDataBuilder().buildJson()
        ];

        this.fullSupply = true;
    });

    describe('show', function() {

        it('it should not open second dialog if the first one is still open', function() {
            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);
            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);
        });

        it('should close modal if adding product succeeds', function() {
            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);
            this.dialogDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

        it('should close modal if adding product fails', function() {
            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);
            this.dialogDeferred.reject();
            this.$rootScope.$apply();

            expect(this.openlmisModalService.createDialog.calls.length).toBe(1);

            this.addFullSupplyProductModalService.show(this.requisitionLineItemDataBuilders, this.fullSupply);

            expect(this.openlmisModalService.createDialog.calls.length).toBe(2);
        });

    });

});
