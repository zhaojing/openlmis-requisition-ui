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

describe('ViewTabController', function() {

    var vm, addProductModalService, addFullSupplyProductModalService, requisition, $q, requisitionValidator, $rootScope, $controller,
        LineItem, $state, alertService, canSubmit, canAuthorize, OrderableDataBuilder, columns,
        RequisitionColumnDataBuilder, fullSupply, categoryFactory, messageService;

    beforeEach(function() {
        module('requisition-view-tab');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            alertService = $injector.get('alertService');
            messageService = $injector.get('messageService');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
            categoryFactory = $injector.get('categoryFactory');
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        addProductModalService = jasmine.createSpyObj('addProductModalService', ['show']);
        addFullSupplyProductModalService = jasmine.createSpyObj('addFullSupplyProductModalService', ['show']);

        requisition = jasmine.createSpyObj('requisition', ['$isInitiated' , '$isRejected',
            '$isApproved', '$isSubmitted', '$isAuthorized', '$isInApproval', '$isReleased',
            '$isAfterAuthorize', '$getProducts', 'addLineItem', 'deleteLineItem',
            'getAvailableFullSupplyProducts', 'getAvailableNonFullSupplyProducts']);
        requisition.template = jasmine.createSpyObj('RequisitionTemplate', ['getColumns',
            'hasSkipColumn', 'hideSkippedLineItems' ]);
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

        spyOn(categoryFactory, 'groupProducts');
        spyOn(messageService, 'get').andCallFake(function(param) {
            return param;
        });

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
            canSubmit = true;

            initController();

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is initiated and user has no create right', function() {
            canSubmit = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is rejected and user has create right', function() {
            canSubmit = true;

            initController();

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is rejected and user has no create right', function() {
            canSubmit = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should display add product button if requisition is submitted and user has authorize rights', function() {
            canAuthorize = true;

            initController();

            expect(vm.showAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is submitted and user has no authorize rights', function() {
            canAuthorize = false;

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is authorized', function() {

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is approved', function() {

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is in approval', function() {

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });


        it('should not display add product button if requisition is released', function() {

            initController();

            expect(vm.showAddProductButton).toBe(false);
        });

        it('should not display add full supply product button if view is not full supply', function() {
            fullSupply = false;

            initController();

            expect(vm.showAddFullSupplyProductControls).toBe(false);
        });

        it('should not display add full supply product button if requisition is in approval', function() {
            canSubmit = false;

            initController();

            expect(vm.showAddFullSupplyProductControls).toBe(false);
        });


        it('should not display add full supply product button if requisition configured to disable skipped option', function() {

            requisition.template.hideSkippedLineItems.andReturn(false);

            initController();

            expect(vm.showAddFullSupplyProductControls).toBe(false);
        });

        it('should set correct noProductsMessage for full supply tab', function() {
            fullSupply = true;

            initController();

            expect(vm.noProductsMessage).toBe('requisitionViewTab.noFullSupplyProducts');
        });

        it('should set correct noProductsMessage for non full supply tab', function() {
            fullSupply = false;

            initController();

            expect(vm.noProductsMessage).toBe('requisitionViewTab.noNonFullSupplyProducts');
        });

        it('should set userCanEdit if canAuthorize is true', function() {
            canAuthorize = true;

            initController();

            expect(vm.userCanEdit).toBe(true);
        });

        it('should set userCanEdit if canSubmit is true', function() {
            canSubmit = true;

            initController();

            expect(vm.userCanEdit).toBe(true);
        });

        it('should set userCanEdit to false if canAuthorize and canSubmit are false', function() {
            initController();

            expect(vm.userCanEdit).toBe(false);
        });

    });

    describe('$onInit', function() {

        beforeEach(function() {
            requisition.template.hideSkippedLineItems.andReturn(true);
            fullSupply = true;
        });

        it('should not show skip controls', function() {
            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition status is INITIATED', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should not show skip controls if requisition status is INITIATED but user does not have right to submit', function() {
            requisition.template.hasSkipColumn.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition status is SUBMITTED and user has authorize right', function() {
            canAuthorize = true;
            requisition.template.hasSkipColumn.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should show skip controls if the requisition status is REJECTED', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(true);
        });

        it('should not show skip controls if the requisition status is REJECTED and user can not submit', function() {
            requisition.template.hasSkipColumn.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should show skip controls if the requisition template has a skip column', function() {
            requisition.template.hasSkipColumn.andReturn(true);
            canSubmit = true;
            columns[0].name = 'skipped';

            initController();

            expect(vm.showSkipControls).toBe(true);
        });


        it('should not show skip controls if the requisition template does not have a skip column', function() {
            requisition.template.hasSkipColumn.andReturn(false);
            columns[0].name = 'foo';
            canSubmit = true;

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

        it('should not show skip controls if user does not authorize right and requisition is submitted', function() {
            canAuthorize = false;
            requisition.template.hasSkipColumn.andReturn(true);

            initController();

            expect(vm.showSkipControls).toBe(false);
        });

    });

    describe('deleteLineItem', function() {

        beforeEach(function() {
            initController();
            spyOn($state, 'go').andReturn();
        });

        it('should delete line item if it exist', function() {
            var lineItem = requisition.requisitionLineItems[2];

            vm.deleteLineItem(lineItem);

            expect(requisition.deleteLineItem).toHaveBeenCalledWith(lineItem);
        });

    });

    describe('addFullSupplyProduct', function() {

        beforeEach(function(){
            addFullSupplyProductModalService.show.andReturn($q.resolve({
               items: [lineItemSpy(1,'one',true)]
            }));
        });

        it('should show the full supply add product modal', function(){
            initController();
            vm.addFullSupplyProduct();
            $rootScope.$apply();

            expect(addFullSupplyProductModalService.show).toHaveBeenCalled();
        });

        it('should insert selected products to the beginning of full supply table', function(){
            initController();

            vm.items = jasmine.createSpyObj('items', ['unshift']);

            vm.addFullSupplyProduct();
            $rootScope.$apply();

            expect(vm.items.unshift).toHaveBeenCalled();
        });


    });

    describe('addProduct', function() {

        var orderable, categories;

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

            categories = [{
                name: 'Group 1',
                products: requisition.availableNonFullSupplyProducts
            }];

            categoryFactory.groupProducts.andReturn(categories);

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

            expect(addProductModalService.show).toHaveBeenCalledWith(
                categories,
                fullSupply
            );
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

            expect(addProductModalService.show).toHaveBeenCalledWith(
                categories,
                fullSupply
            );
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
                'requisitionViewTab.noProductsToAdd.label',
                'requisitionViewTab.noProductsToAdd.message'
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
            canSubmit = false;
            canAuthorize = false;
            requisition.requisitionLineItems[1].$deletable = true;

        });

        it('should return false if viewing full supply tab', function() {
            fullSupply = true;

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if there is no deletable line items', function() {
            canSubmit = true;
            requisition.requisitionLineItems[1].$deletable = false;

            initController();

            expect(vm.showDeleteColumn()).toBeFalsy();
        });

        it('should return false if there is no line items', function() {
            requisition.requisitionLineItems = [];

            initController();

            expect(vm.showDeleteColumn()).toBe(false);
        });

        it('should return true if user has right to authorize submitted requisition', function() {
            canSubmit = true;

            initController();

            expect(vm.showDeleteColumn()).toBe(true);
        });

    });

    describe('skippedFullSupplyProductCountMessage', function(){
       it('should count the number of skipped line items and return the right message', function(){
           initController();
           messageService.get.isSpy = false;
           spyOn(messageService, 'get').andCallFake(function(p1, p2){
               return p2;
           });
           requisition.requisitionLineItems[0].skipped = true;

           expect(vm.skippedFullSupplyProductCountMessage().skippedProductCount).toBe(1)
       })
    });

    describe('skippedFullSupplyProductCountMessage', function(){
       it('should not count the number of skipped line items that are not full supply', function(){
           initController();

           messageService.get.isSpy = false;
           spyOn(messageService, 'get').andCallFake(function(p1, p2){
               return p2;
           });
           requisition.requisitionLineItems[0].skipped = true;
           requisition.requisitionLineItems[0].$program.fullSupply = false;

           expect(vm.skippedFullSupplyProductCountMessage().skippedProductCount).toBe(0);
       })
    });

    describe('getDescriptionForColumn', function() {

        it('should return column definition for regular columns', function() {
            initController();
            
            expect(vm.getDescriptionForColumn(columns[0])).toEqual(columns[0].definition);
        });

        it('should return info about disabled total losses and adjustments modal', function() {
            columns.push(new RequisitionColumnDataBuilder().buildTotalLossesAndAdjustmentsColumn());
            requisition.template.populateStockOnHandFromStockCards = true;

            initController();

            expect(vm.getDescriptionForColumn(columns[1])).toEqual(columns[1].definition + ' ' + 'requisitionViewTab.totalLossesAndAdjustment.disabled');
        });
    });

    function initController() {
        vm = $controller('ViewTabController', {
            lineItems: [],
            columns: [],
            LineItem: LineItem,
            requisition: requisition,
            addProductModalService: addProductModalService,
            addFullSupplyProductModalService: addFullSupplyProductModalService,
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
