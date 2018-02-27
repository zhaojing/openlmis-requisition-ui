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
        RequisitionColumnDataBuilder, fullSupply, categoryFactory;

    beforeEach(function() {
        module('requisition-non-full-supply');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            alertService = $injector.get('alertService');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
            categoryFactory = $injector.get('categoryFactory');
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        addProductModalService = jasmine.createSpyObj('addProductModalService', ['show']);

        requisition = jasmine.createSpyObj('requisition', ['$isInitiated' , '$isRejected',
            '$isApproved', '$isSubmitted', '$isAuthorized', '$isInApproval', '$isReleased',
            '$isAfterAuthorize', '$getProducts', 'addLineItem', 'deleteLineItem',
            'getAvailableFullSupplyProducts', 'getAvailableNonFullSupplyProducts']);
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
        fullSupply = false;

        requisition.program = {
            code: 'P01'
        };

        canSubmit = false;
        canAuthorize = false;

        requisition.$isInitiated.andReturn(false);
        requisition.$isRejected.andReturn(false);
        requisition.$isSubmitted.andReturn(false);
        requisition.$isAuthorized.andReturn(false);
        requisition.$isInApproval.andReturn(false);
        requisition.$isApproved.andReturn(false);
        requisition.$isReleased.andReturn(false);
        requisition.$isAfterAuthorize.andReturn(false);

        spyOn(categoryFactory, 'groupProducts');

        vm = undefined;
    });

    describe('initialization', function() {

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

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is initiated and user has no create right', function() {
            requisition.$isInitiated.andReturn(true);
            canSubmit = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is rejected and user has create right', function() {
            requisition.$isRejected.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is rejected and user has no create right', function() {
            requisition.$isRejected.andReturn(true);
            canSubmit = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is submitted and user has authorize rights', function() {
            requisition.$isSubmitted.andReturn(true);
            canAuthorize = true;

            initController();

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is submitted and user has no authorize rights', function() {
            requisition.$isSubmitted.andReturn(true);
            canAuthorize = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is authorized', function() {
            requisition.$isAuthorized.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is approved', function() {
            requisition.$isApproved.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is in approval', function() {
            requisition.$isInApproval.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is released', function() {
            requisition.$isReleased.andReturn(true);
            requisition.$isAfterAuthorize.andReturn(true);

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

    });

    describe('$onInit', function() {

        beforeEach(function() {
            fullSupply = true;
        });

        it('should not show skip controls', function() {
            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition status is INITIATED', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should not show skip controls if requisition status is INITIATED but user does not have right to submit', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition status is SUBMITTED and user has authorize right', function() {
            canAuthorize = true;
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should show skip controls if the requisition status is REJECTED', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isRejected.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should not show skip controls if the requisition status is REJECTED and user can not submit', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isRejected.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition template has a skip column', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isInitiated.andReturn(true);
            canSubmit = true;
            columns[0].name = 'skipped';

            initController();

            expect(vm.showSkipControls).toBe(true);
        });


        it('should not show skip controls if the requisition template does not have a skip column', function() {
            requisition.template.hasSkipColumn.andReturn(false);
            requisition.$isInitiated.andReturn(true);
            columns[0].name = 'foo';
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should not show skip controls if user does not authorize right and requisition is submitted', function() {
            canAuthorize = false;
            requisition.template.hasSkipColumn.andReturn(true);
            requisition.$isSubmitted.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
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

        var orderable;

        beforeEach(function() {
            LineItem = jasmine.createSpy();
            requisition.program = {
                id: 'program-id'
            };

            requisition.availableNonFullSupplyProducts = [
                new OrderableDataBuilder().build(),
                new OrderableDataBuilder().build()
            ];

            requisition.availableFullSupplyProducts = [
                new OrderableDataBuilder().build(),
                new OrderableDataBuilder().build()
            ];

            requisition.getAvailableNonFullSupplyProducts
                .andReturn(requisition.availableNonFullSupplyProducts);

            requisition.getAvailableFullSupplyProducts
                .andReturn(requisition.availableFullSupplyProducts);

            spyOn(alertService, 'error');

            categoryFactory.groupProducts.andReturn([{
                name: 'Group 1',
                products: requisition.availableNonFullSupplyProducts
            }]);

            orderable = new OrderableDataBuilder().build();

            addProductModalService.show.andReturn($q.resolve({
                orderable: orderable,
                requestedQuantity: 16,
                requestedQuantityExplanation: 'explanation'
            }));
        });

        it('should add product', function() {

            initController();
            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.addLineItem).toHaveBeenCalledWith(
                orderable, 16, 'explanation'
            );
        });

        it('should not add product if modal was dismissed', function() {
            var deferred = $q.defer();
            spyOn(requisition.requisitionLineItems, 'push');
            addProductModalService.show.andReturn(deferred.promise);

            initController();
            vm.addProduct();
            deferred.reject();
            $rootScope.$apply();

            expect(addProductModalService.show).toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should not open add product modal if there are no products to add', function() {
            requisition.getAvailableNonFullSupplyProducts.andReturn([]);

            initController();
            vm.addProduct();
            $rootScope.$apply();

            expect(addProductModalService.show).not.toHaveBeenCalled();
            expect(requisition.addLineItem).not.toHaveBeenCalled();
        });

        it('should open alert if there are no products to add', function() {
            requisition.getAvailableNonFullSupplyProducts.andReturn([]);

            initController();
            vm.addProduct();
            $rootScope.$apply();

            expect(requisition.addLineItem).not.toHaveBeenCalled();
            expect(alertService.error).toHaveBeenCalledWith(
                'requisitionNonFullSupply.noProductsToAdd.label',
                'requisitionNonFullSupply.noProductsToAdd.message'
            );
        });

        it('should use non full supply products', function() {
            fullSupply = false;

            initController();
            vm.addProduct();

            expect(categoryFactory.groupProducts).toHaveBeenCalledWith(
                requisition.availableNonFullSupplyProducts,
                requisition.program.id
            );
        });

        it('should use full supply products', function() {
            fullSupply = true;

            initController();
            vm.addProduct();

            expect(categoryFactory.groupProducts).toHaveBeenCalledWith(
                requisition.availableFullSupplyProducts,
                requisition.program.id
            );
        });

    });

    describe('showDeleteColumn', function() {

        beforeEach(function() {
            fullSupply = false;
            requisition.$isInitiated.andReturn(true);
            canSubmit = true;
            canAuthorize = true;
            requisition.requisitionLineItems[1].$deletable = true;

        });

        it('should return false if viewing full supply tab', function() {
            fullSupply = true;

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if user has no right to submit initiated requisition', function() {
            canSubmit = false;

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if user has not right to submit rejected requisition', function() {
            canSubmit = false;
            requisition.$isInitiated.andReturn(false);
            requisition.$isRejected.andReturn(true);

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if user has no right to authorize submitted requisition', function() {
            canAuthorize = false;
            requisition.$isInitiated.andReturn(false);
            requisition.$isSubmitted.andReturn(true);

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if there is no deletable line items', function() {
            requisition.requisitionLineItems[1].$deletable = false;

            initController();

            expect(vm.showDeleteColumn()).toBeFalsy();
        });

        it('should return false if there is no line items', function() {
            requisition.requisitionLineItems = [];

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if requisition status is after authorized', function() {
            requisition.$isInitiated.andReturn(false);
            requisition.$isInApproval.andReturn(true);

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return true if user has right to authorize submitted requisition', function() {
            requisition.$isInitiated.andReturn(false);
            requisition.$isSubmitted.andReturn(true);

            initController();

            expect(vm.showDeleteColumn()).toBe(true);
        });

        it('should return true if use has right to submit rejected requisition', function() {
            requisition.$isInitiated.andReturn(false);
            requisition.$isRejected.andReturn(true);

            initController();

            expect(vm.showDeleteColumn()).toBe(true);
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
            canAuthorize: canAuthorize,
            fullSupply: fullSupply
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
