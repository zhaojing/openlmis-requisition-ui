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

describe('RequisitionWatcher', function() {

    var RequisitionWatcher, requisitionsStorage, scope, watcher, $timeout, $rootScope;

    beforeEach(function() {
        module('requisition-view', function($provide) {
            requisitionsStorage = jasmine.createSpyObj('requisitionsStorage', ['put']);
            var offlineFlag = jasmine.createSpyObj('offlineRequisitions', ['getAll', 'clearAll', 'put']);
            offlineFlag.getAll.andReturn([false]);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function(name) {
                if(name === 'offlineFlag') return offlineFlag;
                return requisitionsStorage;
            });
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            RequisitionWatcher = $injector.get('RequisitionWatcher');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        scope = $rootScope.$new();
        scope.requisition = {
            requisitionLineItems: [
                {
                    value: 1
                }
            ],
            draftStatusMessage: 'message'
        };

        watcher = new RequisitionWatcher(scope, scope.requisition);
        scope.$digest();
    });

    describe('line items watcher', function() {

        it('should save requisition after changes', function() {
            scope.requisition.requisitionLineItems[0].value = 2;
            scope.$digest();
            $timeout.flush();

            expect(requisitionsStorage.put).toHaveBeenCalledWith(scope.requisition);
            expect(scope.requisition.$modified).toBe(true);
        });

        it('should not save requisition if value has not changed', function() {
            scope.requisition.requisitionLineItems[0].value = 1;
            scope.$digest();
            $timeout.flush();

            expect(requisitionsStorage.put).not.toHaveBeenCalled();
            expect(scope.requisition.$modified).toBe(undefined);
        });
    });

    describe('comment watcher', function() {

        it('should save requisition after changes', function() {
            scope.requisition.draftStatusMessage = 'newMessage';
            scope.$digest();
            $timeout.flush();

            expect(requisitionsStorage.put).toHaveBeenCalledWith(scope.requisition);
            expect(scope.requisition.$modified).toBe(true);
        });

        it('should not save requisition if value has not changed', function() {
            scope.requisition.draftStatusMessage = 'message';
            scope.$digest();
            $timeout.flush();

            expect(requisitionsStorage.put).not.toHaveBeenCalled();
            expect(scope.requisition.$modified).toBe(undefined);
        });
    });
});
