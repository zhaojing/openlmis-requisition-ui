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

    var RequisitionWatcher, requisitionsStorage, notificationService, scope, watcher, $timeout;

    beforeEach(function() {
        module('requisition-view', function($provide) {
            requisitionsStorage = jasmine.createSpyObj('requisitionsStorage', ['put']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andReturn(requisitionsStorage);
            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            RequisitionWatcher = $injector.get('RequisitionWatcher');
            notificationService = $injector.get('notificationService');
            $rootScope = $injector.get('$rootScope');
            $timeout = $injector.get('$timeout');
        });

        spyOn(notificationService, 'success');

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

    describe('init', function() {

        it('should expose makeLoud method', function() {
            expect(angular.isFunction(watcher.makeLoud)).toBe(true);
        });

        it('should expose makeSilent method', function() {
            expect(angular.isFunction(watcher.makeLoud)).toBe(true);
        });
    });

    describe('line items watcher', function() {

        it('should not send notifications after watcher starts', function() {
            scope.requisition.requisitionLineItems[0].value = 2;
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });

        it('should not send notifications after silencing', function() {
            watcher.makeSilent();
            scope.requisition.requisitionLineItems[0].value = 2;
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });

        it('should send notifications after making watcher loud', function() {
            watcher.makeLoud();
            scope.requisition.requisitionLineItems[0].value = 2;
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).toHaveBeenCalledWith('msg.requisitionSaved');
        });

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

        it('should not send notifications if value has not changed', function() {
            watcher.makeLoud();
            scope.requisition.requisitionLineItems[0].value = 1;
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });

    describe('comment watcher', function() {

        it('should not send notifications after watcher starts', function() {
            scope.requisition.draftStatusMessage = 'newMessage';
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });

        it('should not send notifications after silencing', function() {
            watcher.makeSilent();
            scope.requisition.draftStatusMessage = 'newMessage';
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });

        it('should send notifications after making watcher loud', function() {
            watcher.makeLoud();
            scope.requisition.draftStatusMessage = 'newMessage';
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).toHaveBeenCalledWith('msg.requisitionCommentSaved');
        });

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

        it('should not send notifications if value has not changed', function() {
            watcher.makeLoud();
            scope.requisition.draftStatusMessage = 'message';
            scope.$digest();
            $timeout.flush();

            expect(notificationService.success).not.toHaveBeenCalled();
        });
    });
});
