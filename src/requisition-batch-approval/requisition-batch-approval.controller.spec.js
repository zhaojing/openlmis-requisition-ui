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

describe('RequisitionBatchApprovalController', function() {

    //injects
    var vm, $stateParams, $rootScope, $q, confirmService, $controller, calculationFactory, confirmDeferred, $scope,
        requisitionService, alertService, $state, requisitionsStorage, batchRequisitionsStorage, notificationService,
        requisitionBatchSaveFactory, notificationServiceSpy, requisitionBatchApproveFactory, loadingModalService,
        batchDeferred;

    //variables
    var requisitions, products, lineItems;

    beforeEach(function() {
        module('requisition-batch-approval');

        var requisitionLineItems = [
            {
                id: 1,
                skipped: false,
                approvedQuantity: 10,
                totalCost: 100,
                orderable: {
                    id: '1',
                    productCode: 'Code 1',
                    fullProductName: 'Product name 1'
                }
            },
            {
                id: 2,
                skipped: false,
                approvedQuantity: 1,
                totalCost: 10,
                orderable: {
                    id: '2',
                    productCode: 'Code 2',
                    fullProductName: 'Product name 2'
                }
            }
        ];

        var requisition = {
            id: 1,
            status: 'AUTHORIZED',
            requisitionLineItems: requisitionLineItems,
            processingPeriod: {
                name: 'Period name 1'
            },
            facility: {
                name: 'Facility name 1'
            }
        };

        requisitions = [requisition];

        products = {};
        products[requisitionLineItems[0].orderable.id] = {
            code: requisitionLineItems[0].orderable.productCode,
            name: requisitionLineItems[0].orderable.fullProductName,
            totalCost: requisitionLineItems[0].totalCost,
            totalQuantity: requisitionLineItems[0].approvedQuantity,
            requisitions: [requisition.id],
            productId: requisitionLineItems[0].orderable.id
        };
        products[requisitionLineItems[1].orderable.id] = {
            code: requisitionLineItems[1].orderable.productCode,
            name: requisitionLineItems[1].orderable.fullProductName,
            totalCost: requisitionLineItems[1].totalCost,
            totalQuantity: requisitionLineItems[1].approvedQuantity,
            requisitions: [requisition.id],
            productId: requisitionLineItems[1].orderable.id
        };

        lineItems = [];
        lineItems[requisition.id] = [];
        lineItems[requisition.id][requisitionLineItems[0].orderable.id] = requisitionLineItems[0];
        lineItems[requisition.id][requisitionLineItems[1].orderable.id] = requisitionLineItems[1];

        var requisitionWatcherMock = jasmine.createSpy('RequisitionWatcher');
        module(function($provide) {
            $provide.factory('RequisitionWatcher', function() {
                return function() {
                    this.enableWatcher = requisitionWatcherMock;
                };
            });

            requisitionsStorage = jasmine.createSpyObj('requisitionsStorage', ['search', 'put', 'getBy', 'removeBy']);
            batchRequisitionsStorage = jasmine.createSpyObj('batchRequisitionsStorage', ['search', 'put', 'getBy',
                'removeBy']);

            var offlineFlag = jasmine.createSpyObj('offlineRequisitions', ['getAll']);
            offlineFlag.getAll.andReturn([false]);
            var localStorageFactory = jasmine.createSpy('localStorageFactory').andCallFake(function(resourceName) {
                if (resourceName === 'offlineFlag') {
                    return offlineFlag;
                }
                if (resourceName === 'batchApproveRequisitions') {
                    return batchRequisitionsStorage;
                }
                return requisitionsStorage;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactory;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            confirmService = $injector.get('confirmService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
            requisitionService = $injector.get('requisitionService');
            notificationService = $injector.get('notificationService');
            $stateParams = $injector.get('$stateParams');
            alertService = $injector.get('alertService');
            $state = $injector.get('$state');
            requisitionBatchSaveFactory = $injector.get('requisitionBatchSaveFactory');
            requisitionBatchApproveFactory = $injector.get('requisitionBatchApproveFactory');
            calculationFactory = $injector.get('calculationFactory');
            loadingModalService = $injector.get('loadingModalService');
        });

        $stateParams.errors = {};
        spyOn(requisitionService, 'get').andReturn($q.when(requisition));
    });

    describe('$onInit', function() {

        beforeEach(function() {
            $stateParams.errors[requisitions[0].id] = 'There was an error';

            vm = $controller('RequisitionBatchApprovalController', {
                requisitions: requisitions,
                $scope: $scope,
                $stateParams: $stateParams
            });

            spyOn(calculationFactory, 'totalCost').andCallFake(function(lineItem) {
                if (lineItem.id === 1) {
                    return requisitions[0].requisitionLineItems[0].totalCost;
                }
                if (lineItem.id === 2) {
                    return requisitions[0].requisitionLineItems[1].totalCost;
                }
                return null;
            });
        });

        it('should expose requisitions', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.requisitions).toEqual(requisitions);
        });

        it('should assign errors to requisitions', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.requisitions[0].$error).toEqual('There was an error');
        });

        it('should calculate total cost of requisition', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.requisitions[0].$totalCost).toEqual(110);
        });

        it('should calculate total cost of all requisitions', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.totalCost).toEqual(110);
        });

        it('should expose list of products', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.products).toEqual(products);
        });

        it('should expose list of line items', function() {
            vm.$onInit();
            $rootScope.$apply();

            expect(vm.lineItems).toEqual(lineItems);
        });
    });

    describe('updateLineItem', function() {

        beforeEach(function() {
            initController();
            spyOn(calculationFactory, 'totalCost').andReturn(100);
        });

        it('should call calculation factory method', function() {
            vm.updateLineItem(lineItems[1][1], requisitions[0]);

            expect(calculationFactory.totalCost).toHaveBeenCalled();
        });

        it('should change total cost value', function() {
            vm.updateLineItem(lineItems[1][1], requisitions[0]);

            expect(lineItems[1][1].totalCost).toBe(100);
        });
    });

    describe('revert', function() {

        beforeEach(function() {
            initController();

            confirmDeferred = $q.defer();
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        });

        it('should ask user for confirmation', function() {
            vm.revert();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'requisitionBatchApproval.revertConfirm', 'requisitionBatchApproval.revert'
            );
        });

        it('should revert requisitions to original state', function() {
            vm.requisitions[0].requisitionLineItems[0].approvedQuantity = 1000;

            vm.revert();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(vm.requisitions[0].requisitionLineItems[0].approvedQuantity).toBe(10);
            expect(vm.requisitions).toEqual(vm.requisitionsCopy);
        });

        it('should not revert requisitions if modal was dismissed', function() {
            vm.requisitions[0].requisitionLineItems[0].approvedQuantity = 1000;

            vm.revert();
            confirmDeferred.reject();
            $rootScope.$apply();

            expect(vm.requisitions[0].requisitionLineItems[0].approvedQuantity).toBe(1000);
        });
    });

    describe('updateRequisitions', function() {
        var isOffline;

        beforeEach(function() {
            isOffline = false;
            initController();

            spyOn($state, 'reload');
            spyOn(alertService, 'error');

            spyOn(vm, 'isOffline').andCallFake(function() {
                return isOffline;
            });

            confirmDeferred = $q.defer();
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
        });

        it('should display alert if offline', function() {
            isOffline = true;
            vm.updateRequisitions();

            expect(alertService.error).toHaveBeenCalledWith('requisitionBatchApproval.updateOffline');
        });

        it('should ask user for confirmation to update', function() {
            vm.updateRequisitions();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith(
                'requisitionBatchApproval.updateWarning', 'requisitionBatchApproval.update'
            );
        });

        it('should reload current state', function() {
            vm.updateRequisitions();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should not reload current state if modal was dismissed', function() {
            vm.updateRequisitions();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should clear local storage', function() {
            vm.updateRequisitions();

            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(batchRequisitionsStorage.removeBy).toHaveBeenCalledWith('id', requisitions[0].id);
            expect(requisitionsStorage.removeBy).toHaveBeenCalledWith('id', requisitions[0].id);
        });

        it('should not clear local storage if modal was dismissed', function() {
            vm.updateRequisitions();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(batchRequisitionsStorage.removeBy).not.toHaveBeenCalled();
            expect(requisitionsStorage.removeBy).not.toHaveBeenCalled();
        });
    });

    describe('areRequisitionsOutdated', function() {

        beforeEach(function() {
            initController();
        });

        it('should return true if at least one requisition is marked as outdated', function() {
            vm.requisitions[0].$outdated = true;

            expect(vm.areRequisitionsOutdated()).toBeTruthy();
        });

        it('should return false if all requisitions are up to date', function() {
            expect(vm.areRequisitionsOutdated()).toBeFalsy();
        });

    });

    describe('sync', function() {

        beforeEach(function() {
            initController();

            confirmDeferred = $q.defer();
            notificationServiceSpy = jasmine.createSpy();

            spyOn($state, 'go').andReturn();
            spyOn(requisitionBatchSaveFactory, 'saveRequisitions').andReturn(confirmDeferred.promise);
        });

        it('should show success notification if successfully save', function() {
            spyOn(notificationService, 'success').andCallFake(notificationServiceSpy);

            vm.sync();
            confirmDeferred.resolve(requisitions);
            $rootScope.$apply();

            expect(notificationServiceSpy).toHaveBeenCalledWith('requisitionBatchApproval.syncSuccess');
        });

        it('should show error notification if unsuccessfully save', function() {
            spyOn(notificationService, 'error').andCallFake(notificationServiceSpy);

            vm.sync();
            confirmDeferred.reject(requisitions);
            $rootScope.$apply();

            expect(notificationServiceSpy).toHaveBeenCalledWith('requisitionBatchApproval.syncError');
        });

        it('should reload current state', function() {
            vm.sync();
            confirmDeferred.reject(requisitions);
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalled();
        });
    });

    describe('approve', function() {

        beforeEach(function() {
            initController();

            confirmDeferred = $q.defer();
            batchDeferred = $q.defer();

            spyOn($state, 'go').andReturn();
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
            spyOn(requisitionBatchApproveFactory, 'batchApprove').andReturn(batchDeferred.promise);
            spyOn(loadingModalService, 'close').andReturn();
        });

        it('should ask user for confirmation to approve', function() {
            vm.approve();

            confirmDeferred.resolve();
            batchDeferred.resolve();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('requisitionBatchApproval.approvalConfirm');
        });

        it('should close loading modal if an error occurs', function() {
            vm.approve();

            confirmDeferred.resolve();
            batchDeferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });
    });

    function initController() {
        vm = $controller('RequisitionBatchApprovalController', {
            requisitions: requisitions,
            calculationFactory: calculationFactory,
            $scope: $scope,
            $stateParams: $stateParams
        });
        vm.$onInit();
        $rootScope.$apply();
    }
});
