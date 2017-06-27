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

describe('LossesAndAdjustmentsModalController', function() {

    var vm, $q, $controller, requisition, adjustments, reasons, lineItem, modalDeferred,
        requisitionValidator, calculationFactory;

    beforeEach(function() {
        module('requisition-losses-and-adjustments');

        inject(function($injector) {
            $q = $injector.get('$q');
            $controller = $injector.get('$controller');
            calculationFactory = $injector.get('calculationFactory');
            requisitionValidator = $injector.get('requisitionValidator');
        });

        adjustments = [];
        requisition = jasmine.createSpyObj('requisition', [
            '$stockAdjustmentReasons', '$isAuthorized', '$isApproved', '$isInApproval', '$isReleased', 'template'
        ]);
        requisition.template.columnsMap = {
            totalConsumedQuantity: {
              name: 'totalConsumedQuantity'
            },
            totalLossesAndAdjustments: {
              name: 'totalLossesAndAdjustments'
            }
        };
        reasons = requisition.$stockAdjustmentReasons;

        lineItem = {
            stockAdjustments: adjustments,
            updateDependentFields: function () {}
        };

        modalDeferred = $q.defer();

        vm = $controller('LossesAndAdjustmentsModalController', {
            lineItem: lineItem,
            requisition: requisition,
            modalDeferred: modalDeferred
        });
    });

    describe('$onInit', function() {

        it('should expose requisition', function() {
            vm.$onInit();

            expect(vm.requisition).toBe(requisition);
        });

        it('should expose adjustments', function() {
            vm.$onInit();

            expect(vm.adjustments).toBe(adjustments);
        });

        it('should fetch stock adjustment reasons', function() {
            vm.$onInit();

            expect(vm.reasons).toBe(reasons);
        });

    });

    describe('addAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustment = {
                reason: {
                    id: 2
                },
                quantity: 10
            };

            vm.adjustment = angular.merge({}, adjustment);

            spyOn(vm, 'getTotal').andReturn(10);

            vm.$onInit();
        });

        it('should add adjustment to stock adjustments', function() {
            vm.addAdjustment();

            expect(adjustments).toEqual([{
                reasonId: adjustment.reason.id,
                quantity: adjustment.quantity
            }]);
        });

        it('should clear form after adding adjustment', function() {
            expect(vm.adjustment.quantity).not.toBeUndefined();
            expect(vm.adjustment.reason).not.toBeUndefined();

            vm.addAdjustment();

            expect(vm.adjustment.quantity).toBeUndefined();
            expect(vm.adjustment.reason).toBeUndefined();
        });

        it('should update total losses and adjustments', function() {
            vm.addAdjustment();

            expect(vm.lineItem.totalLossesAndAdjustments).toBe(10);
        });

    });

    describe('removeAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustment = {
                reasonId: 321,
                quantity: 11
            };

            vm.adjustments = [
                {
                    reasonId: 123,
                    quantity: 10
                },
                adjustment
            ];

            spyOn(vm, 'recalculateTotal').andReturn();
        });

        it('should remove adjustment', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.adjustments).toEqual([{
                reasonId: 123,
                quantity: 10
            }]);
        });

        it('should update total losses and adjustments', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.recalculateTotal).toHaveBeenCalled();
        });
    });

    describe('getReasonName', function() {

        var filteredReasons;

        beforeEach(inject(function($controller) {
            vm.reasons = [{
                id: 1,
                name: 'reasonOne'
            }, {
                id: 2,
                name: 'reasonTwo'
            }];
        }));

        it('should get reason name if reason with the given id exists', function() {
            var result = vm.getReasonName(2);

            expect(result).toBe('reasonTwo');
        });

        it('should return undefined if no reason with the given id exists', function() {
            var result = vm.getReasonName(432);

            expect(result).toBe(undefined);
        });

    });

    it('getTotal should call calculationFactory', function() {
        vm.reasons = reasons;
        vm.lineItem = lineItem;
        spyOn(calculationFactory, 'totalLossesAndAdjustments').andReturn();

        var result = vm.getTotal();

        expect(calculationFactory.totalLossesAndAdjustments).toHaveBeenCalledWith(
            lineItem,
            reasons
        );
    });

    describe('recalculateTotal', function() {

        beforeEach(function() {
            lineItem = {
                totalConsumedQuantity: 10,
                updateDependentFields: function () {}
            };

            vm.requisition = requisition;
            vm.lineItem = lineItem;
        });

        it ('should recalculate total', function() {
            spyOn(vm, 'getTotal').andReturn(345);

            vm.recalculateTotal();

            expect(vm.lineItem.totalLossesAndAdjustments).toBe(345);
        });

        it ('should validate line item', function() {
            spyOn(requisitionValidator, 'validateLineItem').andReturn();

            vm.recalculateTotal();

            expect(requisitionValidator.validateLineItem)
                .toHaveBeenCalledWith(lineItem, requisition.template.columnsMap, requisition);
        });
    });

});
