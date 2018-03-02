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

describe('RequisitionStockCountDateModalController', function() {

    var $controller, $q, $rootScope, messageService, vm, requisition, modalDeferred,
    alertService, message;

    beforeEach(function() {
        module('requisition-view');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            messageService = $injector.get('messageService');
            alertService = $injector.get('alertService');
        });

        message = 'some-message';
        spyOn(messageService, 'get').andReturn(message);
        spyOn(alertService, 'error');

        requisition = {
            datePhysicalStockCountCompleted: "2017-08-11"
        };
        modalDeferred = $q.defer();

        vm = $controller('RequisitionStockCountDateModalController', {
            requisition: requisition,
            modalDeferred: modalDeferred
        });

        vm.$onInit();
    });

    describe('init', function() {

        it('should expose submit method', function() {
            expect(angular.isFunction(vm.submit)).toBe(true);
        });

        it('should set requisition', function() {
            expect(vm.requisition).toBe(requisition);
        });

        it('should set datePhysicalStockCountCompleted', function() {
            expect(vm.datePhysicalStockCountCompleted).toEqual("2017-08-11");
        });
    });

    describe('submit', function() {
        beforeEach(function() {
            var currentDate = new Date();
            var date = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + 1, 0, 0, 0, 0);

            vm.datePhysicalStockCountCompleted = convertToISOLocalDateString(date);
        });

        it('should set invalidMessage if date is after UTC current date', function () {
            vm.submit();
            $rootScope.$apply();

            expect(vm.invalidMessage).toEqual(message);
        });

        it('should call alertService error with proper parameter if date is after UTC current date', function () {
            vm.submit();
            $rootScope.$apply();

            expect(alertService.error).toHaveBeenCalledWith(message);
        });

        it('should resolve modalDeffered if date is at UTC current date', function () {
            var currentDate = new Date();
            var date = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0, 0);

            vm.datePhysicalStockCountCompleted = convertToISOLocalDateString(date);

            var isDeffered = false;
            modalDeferred.promise.then(function () {
                isDeffered = true;
            });

            vm.submit();
            $rootScope.$apply();

            expect(isDeffered).toBe(true);
        });

        it('should resolve modalDeffered if date is before UTC current date', function () {
            var currentDate = new Date();
            var date = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, currentDate.getUTCDate(), 0, 0, 0, 0);

            vm.datePhysicalStockCountCompleted = convertToISOLocalDateString(date);

            var isDeffered = false;
            modalDeferred.promise.then(function () {
                isDeffered = true;
            });

            vm.submit();
            $rootScope.$apply();

            expect(isDeffered).toBe(true);
        });

        it('should resolve modalDeffered if date is in past', function () {
            vm.datePhysicalStockCountCompleted = '2017-08-10';

            var isDeffered = false;
            modalDeferred.promise.then(function () {
                isDeffered = true;
            });

            vm.submit();
            $rootScope.$apply();

            expect(isDeffered).toBe(true);
        });
    });

    function convertToISOLocalDateString(date) {
        return date.toISOString().slice(0, 10);
    }

});
