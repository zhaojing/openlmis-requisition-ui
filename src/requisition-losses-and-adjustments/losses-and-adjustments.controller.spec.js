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

describe('LossesAndAdjustmentsController', function() {

    var vm;

    var rootScope, scope, $controller;

    var requisition, adjustments, reasons, requisitionValidatorMock;

    beforeEach(function() {

        module('requisition-losses-and-adjustments');
        module(function($provide) {
            requisitionValidatorMock = jasmine.createSpyObj('requisitionValidator', [
                'validateLineItem'
            ]);

            $provide.factory('requisitionValidator', function() {
                return requisitionValidatorMock;
            });
        });

        adjustments = jasmine.createSpyObj('stockAdjustments', ['push', 'indexOf', 'splice']);
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

        inject(function($injector) {
            rootScope = $injector.get('$rootScope');
            $controller = $injector.get('$controller');
        });

        scope = rootScope.$new();
        scope.requisition = requisition;
        scope.lineItem = {
            stockAdjustments: adjustments,
            updateDependentFields: function () {}
        };

    });

    describe('initialization', function() {

        beforeEach(inject(function() {
            rootScope.$apply();
        }));

        it('should expose requisition', function() {
            initController();

            expect(vm.requisition).toBe(requisition);
        });

        it('should expose adjustments', function() {
            initController();

            expect(vm.adjustments).toBe(adjustments);
        });

        it('should fetch stock adjustment reasons', function() {
            initController();

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

            inject(function($controller) {
                vm = $controller('LossesAndAdjustmentsController', {
                    $scope: scope
                });
            });

            rootScope.$apply();

            vm.adjustment = angular.merge({}, adjustment);

            spyOn(vm, 'getTotal').andReturn(10);
        })

        it('should add adjustment to stock adjustments', function() {
            vm.addAdjustment();

            expect(adjustments.push).toHaveBeenCalledWith({
                reasonId: adjustment.reason.id,
                quantity: adjustment.quantity
            });
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

        it('should return promise resolving to new adjustment', function() {
            var result;

            vm.addAdjustment().then(function(adjustment) {
                result = adjustment;
            });

            rootScope.$apply();

            expect(result).toEqual({
                reasonId: adjustment.reason.id,
                quantity: adjustment.quantity
            });
        });

    });

    describe('removeAdjustment', function() {

        var adjustment;

        beforeEach(function() {
            adjustments.indexOf.andReturn(123);
            adjustment = jasmine.createSpy();

            inject(function($controller) {
                vm = $controller('LossesAndAdjustmentsController', {
                    $scope: scope
                });
            });

            spyOn(vm, 'getTotal').andReturn(321);
        });

        it('should remove adjustment', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.adjustments.indexOf).toHaveBeenCalledWith(adjustment);
            expect(vm.adjustments.splice).toHaveBeenCalledWith(123, 1);
        });

        it('should update total losses and adjustments', function() {
            vm.removeAdjustment(adjustment);

            expect(vm.lineItem.totalLossesAndAdjustments).toBe(321);
        });
    });

    describe('getReasonName', function() {

        var filter, filteredReasons;

        beforeEach(inject(function($controller) {
            filteredReasons = [
                {
                    name: 'reasonOne'
                }
            ];

            filter = jasmine.createSpy().andCallFake(function() {
                return arguments[1].id === 234 ? filteredReasons : [];
            });

            vm = $controller('LossesAndAdjustmentsController', {
                $scope: scope,
                $filter: jasmine.createSpy().andReturn(filter)
            });

            rootScope.$apply();
        }));

        it('should get reason name if reason with the given id exists', function() {
            var result = vm.getReasonName(234);

            expect(result).toBe('reasonOne');
            expect(filter).toHaveBeenCalledWith(reasons, {
                id: 234
            }, true);
        });

        it('should return undefined if no reason with the given id exists', function() {
            var result = vm.getReasonName(432);

            expect(result).toBe(undefined);
            expect(filter).toHaveBeenCalledWith(reasons, {
                id: 432
            }, true);
        });

    });

    describe('getTotal', function() {

        var calculationFactory;

        beforeEach(inject(function($controller) {
            calculationFactory = jasmine.createSpyObj('calculationFactory', ['totalLossesAndAdjustments']);
            calculationFactory.totalLossesAndAdjustments.andReturn(345);

            vm = $controller('LossesAndAdjustmentsController', {
                $scope: scope,
                calculationFactory: calculationFactory
            });

            rootScope.$apply();
        }));

        it('should calculate total losses and adjustments', function() {
            var result = vm.getTotal();

            expect(result).toBe(345);
            expect(calculationFactory.totalLossesAndAdjustments).toHaveBeenCalledWith(
                scope.lineItem,
                reasons
            );
        })

    });

    describe('recalculateTotal', function() {
        it ('should recalculate total', function() {
            vm.recalculateTotal();
            expect(vm.lineItem.totalLossesAndAdjustments).toBe(345);
        });

        it ('should validate line item', function() {
            scope.lineItem = {
                totalConsumedQuantity: 10,
                updateDependentFields: function () {}
            };
            spyOn(scope.lineItem, 'updateDependentFields');

            initController();
            rootScope.$apply();

            vm.recalculateTotal();

            expect(requisitionValidatorMock.validateLineItem)
                .toHaveBeenCalledWith(scope.lineItem, requisition.template.columnsMap, requisition);
            expect(scope.lineItem.updateDependentFields)
                .toHaveBeenCalledWith(requisition.template.columnsMap.totalLossesAndAdjustments, requisition);
        });
    });

    function initController() {
        vm = $controller('LossesAndAdjustmentsController', {
            $scope: scope
        });
    }

});
