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

    beforeEach(function() {
        module('requisition-view-tab');

        var RequisitionLineItemDataBuilder, RequisitionDataBuilder, RequisitionColumnDataBuilder, OrderableDataBuilder;
        inject(function($injector) {
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
            RequisitionLineItemDataBuilder = $injector.get('RequisitionLineItemDataBuilder');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');

            this.$controller = $injector.get('$controller');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.alertService = $injector.get('alertService');
            this.messageService = $injector.get('messageService');
            this.requisitionValidator = $injector.get('requisitionValidator');
            this.selectProductsModalService = $injector.get('selectProductsModalService');
        });

        var requisitionDataBuilder = new RequisitionDataBuilder();
        this.requisition = requisitionDataBuilder
            .withRequisitionLineItems([
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(requisitionDataBuilder.program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(requisitionDataBuilder.program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(requisitionDataBuilder.program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(requisitionDataBuilder.program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .nonFullSupplyForProgram(requisitionDataBuilder.program)
                    .buildJson()
            ])
            .build();

        this.initController = initController;

        this.availableFullSupplyProducts = [
            new OrderableDataBuilder().build(),
            new OrderableDataBuilder().build()
        ];

        this.availableNonFullSupplyProducts = [
            new OrderableDataBuilder().build(),
            new OrderableDataBuilder().build()
        ];

        this.skippedFullSupplyProducts = [
            new OrderableDataBuilder().build(),
            new OrderableDataBuilder().build(),
            new OrderableDataBuilder().build()
        ];

        this.totalLossesAndAdjustmentsColumn = new RequisitionColumnDataBuilder()
            .buildTotalLossesAndAdjustmentsColumn();

        this.columns = [
            new RequisitionColumnDataBuilder().buildSkipColumn()
        ];

        this.fullSupply = false;
        this.canSubmit = false;
        this.canAuthorize = false;

        spyOn(this.alertService, 'error');
        spyOn(this.selectProductsModalService, 'show');
        spyOn(this.messageService, 'get').andCallFake(function(param) {
            return param;
        });
    });

    describe('$onInit', function() {

        beforeEach(function() {
            this.requisition.template.hideSkippedLineItems.andReturn(true);
            this.fullSupply = true;
        });

        it('should bind requisitionValidator.isLineItemValid method to vm', function() {
            this.initController();

            expect(this.vm.isLineItemValid).toBe(this.requisitionValidator.isLineItemValid);
        });

        it('should bind requisition property to vm', function() {
            this.initController();

            expect(this.vm.requisition).toBe(this.requisition);
        });

        describe('Add (Full Supply) Products button', function() {

            beforeEach(function() {
                this.canSubmit = true;
                this.canAuthorize = true;
                this.fullSupply = true;
                this.requisition.emergency = true;
            });

            it('should be visible', function() {
                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only submit', function() {
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only authorize', function() {
                this.canSubmit = false;

                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(true);
            });

            it('should be hidden if user can\'t submit and authorize', function() {
                this.canSubmit = false;
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if requisition is not emergency', function() {
                this.requisition.emergency = false;

                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if showing non-full supply tab', function() {
                this.fullSupply = false;

                this.initController();

                expect(this.vm.showAddFullSupplyProductsButton).toBe(false);
            });

        });

        describe('Add (Non-Full Supply) Products button', function() {

            beforeEach(function() {
                this.canSubmit = true;
                this.canAuthorize = true;
                this.fullSupply = false;
            });

            it('should be visible', function() {
                this.initController();

                expect(this.vm.showAddNonFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only submit', function() {
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showAddNonFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only authorize', function() {
                this.canSubmit = false;

                this.initController();

                expect(this.vm.showAddNonFullSupplyProductsButton).toBe(true);
            });

            it('should be hidden if user can\'t submit and authorize', function() {
                this.canSubmit = false;
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showAddNonFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if showing full supply tab', function() {
                this.fullSupply = true;

                this.initController();

                expect(this.vm.showAddNonFullSupplyProductsButton).toBe(false);
            });

        });

        describe('Unskip (Full Supply) Products button', function() {

            beforeEach(function() {
                this.canSubmit = true;
                this.canAuthorize = true;
                this.fullSupply = true;
                this.requisition.emergency = false;
                this.requisition.template.hideSkippedLineItems.andReturn(true);
            });

            it('should be visible', function() {
                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only submit', function() {
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(true);
            });

            it('should be visible if user can only authorize', function() {
                this.canSubmit = false;

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(true);
            });

            it('should be hidden if user can\'t submit and authorize', function() {
                this.canSubmit = false;
                this.canAuthorize = false;

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if showing non-full supply tab', function() {
                this.fullSupply = false;

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if requisition is emergency', function() {
                this.requisition.emergency = true;

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(false);
            });

            it('should be hidden if skipped line items are disabled', function() {
                this.requisition.template.hideSkippedLineItems.andReturn(false);

                this.initController();

                expect(this.vm.showUnskipFullSupplyProductsButton).toBe(false);
            });

        });

        describe('noProductMessage', function() {

            it('should set correct for full supply tab', function() {
                this.fullSupply = true;

                this.initController();

                expect(this.vm.noProductsMessage).toBe('requisitionViewTab.noFullSupplyProducts');
            });

            it('should set correct for non full supply tab', function() {
                this.fullSupply = false;

                this.initController();

                expect(this.vm.noProductsMessage).toBe('requisitionViewTab.noNonFullSupplyProducts');
            });

        });

        describe('userCanEdit', function() {

            it('should be true if canAuthorize is true', function() {
                this.canAuthorize = true;

                this.initController();

                expect(this.vm.userCanEdit).toBe(true);
            });

            it('should be true if canSubmit is true', function() {
                this.canSubmit = true;

                this.initController();

                expect(this.vm.userCanEdit).toBe(true);
            });

            it('should be false if canAuthorize and canSubmit are false', function() {
                this.initController();

                expect(this.vm.userCanEdit).toBe(false);
            });

        });

        describe('showSkipControls', function() {

            it('should be hidden', function() {
                this.initController();

                expect(this.vm.showSkipControls).toBe(false);
            });

            it('should be shown if the requisition status is INITIATED', function() {
                this.requisition.template.hasSkipColumn.andReturn(true);
                this.canSubmit = true;

                this.initController();

                expect(this.vm.showSkipControls).toBe(true);
            });

            it('should be hidden if requisition status is INITIATED but user does not have right to submit',
                function() {
                    this.requisition.template.hasSkipColumn.andReturn(true);

                    this.initController();

                    expect(this.vm.showSkipControls).toBe(false);
                });

            it('should be shown if the requisition status is SUBMITTED and user has authorize right', function() {
                this.canAuthorize = true;
                this.requisition.template.hasSkipColumn.andReturn(true);

                this.initController();

                expect(this.vm.showSkipControls).toBe(true);
            });

            it('should be shown if the requisition status is REJECTED', function() {
                this.requisition.template.hasSkipColumn.andReturn(true);
                this.canSubmit = true;

                this.initController();

                expect(this.vm.showSkipControls).toBe(true);
            });

            it('should be hidden if the requisition status is REJECTED and user can not submit', function() {
                this.requisition.template.hasSkipColumn.andReturn(true);

                this.initController();

                expect(this.vm.showSkipControls).toBe(false);
            });

            it('should be shown if the requisition template has a skip column', function() {
                this.requisition.template.hasSkipColumn.andReturn(true);
                this.canSubmit = true;
                this.columns[0].name = 'skipped';

                this.initController();

                expect(this.vm.showSkipControls).toBe(true);
            });

            it('should be hidden if the requisition template does not have a skip column', function() {
                this.requisition.template.hasSkipColumn.andReturn(false);
                this.columns[0].name = 'foo';
                this.canSubmit = true;

                this.initController();

                expect(this.vm.showSkipControls).toBe(false);
            });

            it('should be hidden if user does not authorize right and requisition is submitted', function() {
                this.canAuthorize = false;
                this.requisition.template.hasSkipColumn.andReturn(true);

                this.initController();

                expect(this.vm.showSkipControls).toBe(false);
            });

        });

    });

    describe('deleteLineItem', function() {

        beforeEach(function() {
            this.initController();
            this.requisition.deleteLineItem.andReturn();
            spyOn(this.$state, 'go').andReturn();
        });

        it('should delete line item if it exist', function() {
            var lineItem = this.requisition.requisitionLineItems[2];

            this.vm.deleteLineItem(lineItem);

            expect(this.requisition.deleteLineItem).toHaveBeenCalledWith(lineItem);
        });

    });

    describe('addFullSupplyProducts', function() {

        beforeEach(function() {
            this.requisition.getAvailableFullSupplyProducts.andReturn(this.availableFullSupplyProducts);
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.availableFullSupplyProducts[0],
                this.availableFullSupplyProducts[2]
            ]));
        });

        it('should show alert if there are no skipped full supply products', function() {
            this.requisition.getAvailableFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.addFullSupplyProducts();

            expect(this.alertService.error).toHaveBeenCalledWith(
                'requisitionViewTab.noProductsToAdd.label',
                'requisitionViewTab.noProductsToAdd.message'
            );
        });

        it('should not open modal if there no skipped full supply products to add', function() {
            this.requisition.getAvailableFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.addFullSupplyProducts();

            expect(this.selectProductsModalService.show).not.toHaveBeenCalled();
        });

        it('should open modal', function() {
            this.initController();
            this.vm.addFullSupplyProducts();

            expect(this.selectProductsModalService.show).toHaveBeenCalledWith(this.availableFullSupplyProducts);
        });

        it('should do nothing if modal was dismissed', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            this.initController();
            this.vm.addFullSupplyProducts();

            expect(this.requisition.addLineItems).not.toHaveBeenCalled();
            expect(this.requisition.addLineItems).not.toHaveBeenCalled();
        });

        it('should unskip full supply products', function() {
            this.initController();
            this.vm.addFullSupplyProducts();
            this.$rootScope.$apply();

            expect(this.requisition.addLineItems).toHaveBeenCalledWith([
                this.availableFullSupplyProducts[0],
                this.availableFullSupplyProducts[2]
            ]);
        });

    });

    describe('addNonFullSupplyProducts', function() {

        beforeEach(function() {
            this.requisition.getAvailableNonFullSupplyProducts.andReturn(this.availableNonFullSupplyProducts);
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.availableNonFullSupplyProducts[0],
                this.availableNonFullSupplyProducts[2]
            ]));
        });

        it('should show alert if there are no available non-full supply products', function() {
            this.requisition.getAvailableNonFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.addNonFullSupplyProducts();

            expect(this.alertService.error).toHaveBeenCalledWith(
                'requisitionViewTab.noProductsToAdd.label',
                'requisitionViewTab.noProductsToAdd.message'
            );
        });

        it('should not open modal if there no available non-full supply products', function() {
            this.requisition.getAvailableNonFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.addNonFullSupplyProducts();

            expect(this.selectProductsModalService.show).not.toHaveBeenCalled();
        });

        it('should open modal', function() {
            this.initController();
            this.vm.addNonFullSupplyProducts();

            expect(this.selectProductsModalService.show).toHaveBeenCalledWith(this.availableNonFullSupplyProducts);
        });

        it('should do nothing if modal was dismissed', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            this.initController();
            this.vm.addNonFullSupplyProducts();

            expect(this.requisition.unskipFullSupplyProducts).not.toHaveBeenCalled();
            expect(this.requisition.addLineItems).not.toHaveBeenCalled();
        });

        it('should add non-full supply products', function() {
            this.initController();
            this.vm.addNonFullSupplyProducts();
            this.$rootScope.$apply();

            expect(this.requisition.addLineItems).toHaveBeenCalledWith([
                this.availableNonFullSupplyProducts[0],
                this.availableNonFullSupplyProducts[2]
            ]);
        });

    });

    describe('unskipFullSupplyProducts', function() {

        beforeEach(function() {
            this.requisition.getSkippedFullSupplyProducts.andReturn(this.skippedFullSupplyProducts);
            this.selectProductsModalService.show.andReturn(this.$q.resolve([
                this.skippedFullSupplyProducts[0],
                this.skippedFullSupplyProducts[2]
            ]));
            this.fullSupply = true;
        });

        it('should show alert if there are no skipped full supply products', function() {
            this.requisition.getSkippedFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.unskipFullSupplyProducts();

            expect(this.alertService.error).toHaveBeenCalledWith(
                'requisitionViewTab.noProductsToAdd.label',
                'requisitionViewTab.noProductsToAdd.message'
            );
        });

        it('should not open modal if there no skipped full supply products to add', function() {
            this.requisition.getSkippedFullSupplyProducts.andReturn([]);

            this.initController();
            this.vm.unskipFullSupplyProducts();

            expect(this.selectProductsModalService.show).not.toHaveBeenCalled();
        });

        it('should open modal', function() {
            this.initController();
            this.vm.unskipFullSupplyProducts();

            expect(this.selectProductsModalService.show).toHaveBeenCalledWith(this.skippedFullSupplyProducts);
        });

        it('should do nothing if modal was dismissed for skipped products', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            this.initController();
            this.vm.unskipFullSupplyProducts();

            expect(this.requisition.unskipFullSupplyProducts).not.toHaveBeenCalled();
            expect(this.requisition.addLineItems).not.toHaveBeenCalled();
        });

        it('should unskip full supply products', function() {
            this.initController();
            this.vm.unskipFullSupplyProducts();
            this.$rootScope.$apply();

            expect(this.requisition.unskipFullSupplyProducts)
                .toHaveBeenCalledWith([
                    this.skippedFullSupplyProducts[0],
                    this.skippedFullSupplyProducts[2]
                ]);
        });

    });

    describe('showDeleteColumn', function() {

        beforeEach(function() {
            this.fullSupply = false;
            this.canSubmit = false;
            this.canAuthorize = false;
            this.requisition.requisitionLineItems[1].$deletable = true;
        });

        it('should return false if viewing full supply tab', function() {
            this.fullSupply = true;

            this.initController();

            expect(this.vm.showDeleteColumn()).toBe(false);
        });

        it('should return false if there is no deletable line items', function() {
            this.canSubmit = true;
            this.requisition.requisitionLineItems[1].$deletable = false;

            this.initController();

            expect(this.vm.showDeleteColumn()).toBeFalsy();
        });

        it('should return false if there is no line items', function() {
            this.requisition.requisitionLineItems = [];

            this.initController();

            expect(this.vm.showDeleteColumn()).toBe(false);
        });

        it('should return true if user has right to authorize submitted requisition', function() {
            this.canSubmit = true;

            this.initController();

            expect(this.vm.showDeleteColumn()).toBe(true);
        });

    });

    describe('skippedFullSupplyProductCountMessage', function() {

        it('should count the number of skipped line items and return the right message', function() {
            this.initController();
            this.messageService.get.isSpy = false;
            spyOn(this.messageService, 'get').andCallFake(function(p1, p2) {
                return p2;
            });
            this.requisition.requisitionLineItems[0].skipped = true;

            expect(this.vm.skippedFullSupplyProductCountMessage().skippedProductCount).toBe(1);
        });

        it('should not count the number of skipped line items that are not full supply', function() {
            this.initController();

            this.messageService.get.isSpy = false;
            spyOn(this.messageService, 'get').andCallFake(function(p1, p2) {
                return p2;
            });
            this.requisition.requisitionLineItems[0].skipped = true;
            this.requisition.requisitionLineItems[0].$program.fullSupply = false;

            expect(this.vm.skippedFullSupplyProductCountMessage().skippedProductCount).toBe(0);
        });
    });

    describe('getDescriptionForColumn', function() {

        it('should return column definition for regular columns', function() {
            this.initController();

            expect(this.vm.getDescriptionForColumn(this.columns[0])).toEqual(this.columns[0].definition);
        });

        it('should return info about disabled total losses and adjustments modal', function() {
            this.columns.push(this.totalLossesAndAdjustmentsColumn);
            this.requisition.template.populateStockOnHandFromStockCards = true;

            this.initController();

            expect(this.vm.getDescriptionForColumn(this.columns[1]))
                .toEqual(this.columns[1].definition + ' ' + 'requisitionViewTab.totalLossesAndAdjustment.disabled');
        });
    });

    function initController() {
        this.vm = this.$controller('ViewTabController', {
            lineItems: [],
            columns: [],
            requisition: this.requisition,
            canSubmit: this.canSubmit,
            canAuthorize: this.canAuthorize,
            fullSupply: this.fullSupply
        });
        this.vm.$onInit();
    }

});
