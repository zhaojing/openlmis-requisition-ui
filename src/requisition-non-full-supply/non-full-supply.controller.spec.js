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

describe('NonFullSupplyController', function() {

    var vm, addProductModalService, requisition, $q, requisitionValidator, $rootScope, $controller,
        LineItem, $state, alertService, canSubmit, canAuthorize, OrderableDataBuilder, columns,
        RequisitionColumnDataBuilder;

    beforeEach(function(){
        module('requisition-non-full-supply');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            alertService = $injector.get('alertService');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        addProductModalService = jasmine.createSpyObj('addProductModalService', ['show']);

        requisition = jasmine.createSpyObj('requisition', ['$isInitiated' , '$isRejected',
            '$isApproved', '$isSubmitted', '$isAuthorized', '$isInApproval', '$isReleased',
            '$isAfterAuthorize', '$getProducts', 'addLineItem', 'deleteLineItem']);
        requisition.template = jasmine.createSpyObj('RequisitionTemplate', ['getColumns',
            'hasSkipColumn']);
        requisition.requisitionLineItems = [
            lineItemSpy(0, 'One', true),
            lineItemSpy(1, 'Two', true),
            lineItemSpy(2, 'One', true),
            lineItemSpy(3, 'Two', true),
            lineItemSpy(4, 'Three', false)
        ];

        columns = [new RequisitionColumnDataBuilder().buildSkipColumn()];

        requisition.$getProducts.andReturn([]);

        requisition.program = {
            code: 'P01'
        };
    });

    describe('initialization', function() {

        beforeEach(function() {
            requisition.$isInitiated.andReturn(false);
            requisition.$isRejected.andReturn(false);
            requisition.$isSubmitted.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            requisition.$isInApproval.andReturn(false);
            requisition.$isApproved.andReturn(false);
            requisition.$isReleased.andReturn(false);
            requisition.$isAfterAuthorize.andReturn(false);
        });


        it('should bind requisitionValidator.isLineItemValid method to vm', function() {
            initController();

            expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
        });

        it('should bind requisition property to vm', function() {
            initController();

            expect(vm.requisition).toBe(requisition);
        });

        it('should display add product button if requisition is initiated and user has create right', function() {
            requisition.$isInitiated.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.displayAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is initiated and user has no create right', function() {
            requisition.$isInitiated.andReturn(true);
            canSubmit = false;

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is rejected and user has create right', function() {
            requisition.$isRejected.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.displayAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is rejected and user has no create right', function() {
            requisition.$isRejected.andReturn(true);
            canSubmit = false;

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is submitted and user has authorize rights', function() {
            requisition.$isSubmitted.andReturn(true);
            canAuthorize = true;

            initController();

            expect(vm.displayAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is submitted and user has no authorize rights', function() {
            requisition.$isSubmitted.andReturn(true);
            canAuthorize = false;

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is authorized', function() {
            requisition.$isAuthorized.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is approved', function() {
            requisition.$isApproved.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is in approval', function() {
            requisition.$isInApproval.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is released', function() {
            requisition.$isReleased.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

    });

    describe('$onInit', function() {

        it('should not show skip controls', function(){
            initController();

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

        it('should show skip controls if the requisition status is INITIATED', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition status is SUBMITTED and user has authorize right', function(){
            canAuthorize = true;
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition status is REJECTED', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isRejected.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });

        it('should show skip controls if the requisition template has a skip columm', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);
            columns[0].name = 'skipped';

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(true);
        });


        it('should not show skip controls if the requisition template doesnt have a skip columm', function(){
            initController();
            requisition.template.hasSkipColumn.andReturn(false);
            requisition.$isInitiated.andReturn(true);
            columns[0].name = 'foo';

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

        it('should not show skip controls if user does not authorize right and requisition is submitted', function() {
            canAuthorize = false;
            initController();
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            vm.$onInit();

            expect(vm.areSkipControlsVisible).toBe(false);
        });

    });

    describe('deleteLineItem', function() {

        beforeEach(function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            initController();
            spyOn($state, 'go').andReturn();
        });

        it('should delete line item if it exist', function() {
            var lineItem = requisition.requisitionLineItems[2];

            vm.deleteLineItem(lineItem);

            expect(requisition.deleteLineItem).toHaveBeenCalledWith(lineItem);
        });

    });

    describe('addProduct', function() {

        beforeEach(function() {
            LineItem = jasmine.createSpy();
            requisition.program = {
                id: 'program-id'
            };

            requisition.availableNonFullSupplyProducts = [{
                name: 'Column One',
                $visible: true
            }];

            spyOn(alertService, 'error');

            initController();
        });

        it('should add product', function() {
            var orderable = new OrderableDataBuilder().build();

            addProductModalService.show.andReturn($q.resolve({
                orderable: orderable,
                requestedQuantity: 16,
                requestedQuantityExplanation: 'explanation'
            }));

            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.addLineItem).toHaveBeenCalledWith(
                orderable,16, 'explanation'
            );
        });

        it('should not add product if modal was dismissed', function() {
            var deferred = $q.defer();
            spyOn(requisition.requisitionLineItems, 'push');
            addProductModalService.show.andReturn(deferred.promise);

            vm.addProduct();
            deferred.reject();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should open modal if $visible is undefined', function() {
            addProductModalService.show.andReturn($q.when());

            requisition.availableNonFullSupplyProducts = [{
                $visible: undefined
            }];

            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should not open add product modal if there are no products to add', function() {
            requisition.availableNonFullSupplyProducts = [];

            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).not.toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should not open add product modal if there are no additional products to add', function() {
            requisition.availableNonFullSupplyProducts = [{
                $visible: false
            }];

            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).not.toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should open alert if there are no products to add', function() {
            requisition.availableNonFullSupplyProducts = [];

            vm.addProduct();
            $rootScope.$apply();

            expect(requisition.addLineItem).not.toHaveBeenCalled();
            expect(alertService.error).toHaveBeenCalledWith(
                'requisitionNonFullSupply.noProductsToAdd.label',
                'requisitionNonFullSupply.noProductsToAdd.message'
            );
        });

    });

    describe('displayDeleteColumn', function() {

        beforeEach(function() {
            initController();
        });

        it('should return true if any line item is deletable', function() {
            requisition.requisitionLineItems[1].$deletable = true;

            var result = vm.displayDeleteColumn();

            expect(result).not.toBe(false);
        });

        it('should return false if none of the line items is deletable', function() {
            var result = vm.displayDeleteColumn();

            expect(result).not.toBe(true);
        });

    });

    function initController() {
        vm = $controller('NonFullSupplyController', {
            lineItems: [],
            columns: [],
            LineItem: LineItem,
            requisition: requisition,
            addProductModalService: addProductModalService,
            requisitionValidator: requisitionValidator,
            canSubmit: canSubmit,
            canAuthorize: canAuthorize
        });
        vm.$onInit();
    }

    function lineItemSpy(id, category, fullSupply) {
        var lineItem = jasmine.createSpyObj('lineItem', ['canBeSkipped']);
        lineItem.canBeSkipped.andReturn(true);
        lineItem.skipped = false;
        lineItem.$id = id;
        lineItem.orderable = {
            $visible: false
        };
        lineItem.$program = {
            orderableCategoryDisplayName: category,
            fullSupply: fullSupply
        };
        return lineItem;
    }

});
