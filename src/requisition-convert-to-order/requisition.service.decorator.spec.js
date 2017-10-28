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

ddescribe('requisitionService', function() {

    var requisitionService, database, $httpBackend, $rootScope, $q, requisitionUrlFactory, cached,
        $filter;

    beforeEach(function() {
        module('requisition-convert-to-order');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            requisitionService = $injector.get('requisitionService');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            requisitionUrlFactory = $injector.get('requisitionUrlFactory');
            $filter = $injector.get('$filter');
        });
    });

    describe('forConvert', function() {

        it('should not call endpoint for subsequent calls', function() {
            var params = {
                size: 10,
                page: 1
            };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=30&page=0'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 21,
                totalPages: 2,
                content: createDummyRequisitions(20)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();

            requisitionService.forConvert(params);
            expect($httpBackend.flush).toThrow();
        });

        it('should not call endpoint if enough requisitions are cached', function() {
            var params = {
                size: 10,
                page: 5
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();

            var newParams = {
                size: 10,
                page: 7
            };

            requisitionService.forConvert(newParams);
            expect($httpBackend.flush).toThrow();
        });



        it('should always call endpoint if sorting has changed', function() {
            var params = {
                size: 10,
                page: 5
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();

            params = {
                size: 10,
                page: 5,
                sort: 'program'
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1&sort=program'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: 'program',
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();
        });

        it('should always call endpoint if filterBy has changed', function() {
            var params = {
                size: 10,
                page: 5,
                filterBy: 'program'
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1&filterBy=program'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();

            params = {
                size: 10,
                page: 5,
                filterBy: 'all'
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1&filterBy=all'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();
        });

        it('should always call endpoint if filterValue has changed', function() {
            var params = {
                size: 10,
                page: 5,
                filterValue: 'Bala'
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1&filterValue=Bala'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();

            params = {
                size: 10,
                page: 5,
                filterValue: 'B'
            };

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1&filterValue=B'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 62,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(22)
            });

            requisitionService.forConvert(params);
            $httpBackend.flush();
        });

        it('should return requested amount of requisitions if downloaded', function() {
            var result,
                params = {
                    size: 10,
                    page: 2
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=20&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 20,
                numberOfElements: 20,
                totalElements: 65,
                totalPages: 4,
                sort: null,
                content: createDummyRequisitions(20)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10));
        });

        it('should set last correctly if fetching last page', function() {
            var result,
                params = {
                    size: 7,
                    page: 7
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=21&page=2'))
            .respond(200, {
                first: false,
                last: true,
                number: 2,
                size: 21,
                numberOfElements: 14,
                totalElements: 56,
                totalPages: 3,
                sort: null,
                content: createDummyRequisitions(14)
            });

            requisitionService.forConvert(params)
            .then(function(page) {
                result = page;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.last).toEqual(true);
        });

        it('should set last correctly if the transformed is last but the original is not', function() {
            var result,
                params = {
                    size: 15,
                    page: 5
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=60&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 60,
                numberOfElements: 31,
                totalElements: 91,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(31)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.last).toEqual(false);
        });

        it('should set first correctly if the transformed is first but the original is not', function() {
            var result,
                params = {
                    size: 3,
                    page: 1
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=9&page=0'))
            .respond(200, {
                first: true,
                last: true,
                number: 0,
                size: 9,
                numberOfElements: 9,
                totalElements: 9,
                totalPages: 1,
                sort: null,
                content: createDummyRequisitions(9)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.first).toEqual(false);
        });

        it('should set first correctly if original is first', function() {
            var result,
                params = {
                    size: 3,
                    page: 0
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=6&page=0'))
            .respond(200, {
                first: true,
                last: true,
                number: 0,
                size: 6,
                numberOfElements: 6,
                totalElements: 6,
                totalPages: 1,
                sort: null,
                content: createDummyRequisitions(6)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.first).toEqual(true);
        });

        it('should set pages correctly for full pages', function() {
            var result,
                params = {
                    size: 11,
                    page: 1
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=33&page=0'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 33,
                numberOfElements: 33,
                totalElements: 44,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(33)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.totalPages).toEqual(4);
        });

        it('should set pages correctly for non full pages', function() {
            var result,
                params = {
                    size: 12,
                    page: 1
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=36&page=0'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 36,
                numberOfElements: 36,
                totalElements: 37,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(36)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.totalPages).toEqual(4);
        });

        it('should set number of elements correctly for full pages', function() {
            var result,
                params = {
                    size: 6,
                    page: 2
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=12&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 6,
                numberOfElements: 6,
                totalElements: 18,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitions(6)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.numberOfElements).toEqual(6);
        });

        it('should set number of elements correctly for non full pages', function() {
            var result,
                params = {
                    size: 8,
                    page: 4
                };

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=16&page=2'))
            .respond(200, {
                first: false,
                last: true,
                number: 2,
                size: 1,
                numberOfElements: 1,
                totalElements: 33,
                totalPages: 3,
                sort: null,
                content: createDummyRequisitions(1)
            });

            requisitionService.forConvert(params)
            .then(function(requisitions) {
                result = requisitions;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.numberOfElements).toEqual(1);
        });

        it('should return cached requisitions', function() {
            var result;

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=40&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 40,
                totalElements: 80,
                totalPages: 2,
                content: createDummyRequisitions(40)
            });

            requisitionService.forConvert({
                size: 10,
                page: 5
            });
            $httpBackend.flush();

            requisitionService.forConvert({
                size: 10,
                page: 6
            })
            .then(function(requisitions) {
                result = requisitions;
            });

            expect($httpBackend.flush).toThrow();
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10, 20));
        });

        it('should return cached requisition if the page is not complete but last', function() {
            var result;

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=20&page=1'))
            .respond(200, {
                first: false,
                last: true,
                number: 1,
                size: 20,
                numberOfElements: 15,
                totalElements: 35,
                totalPages: 2,
                content: createDummyRequisitions(15)
            });

            requisitionService.forConvert({
                size: 10,
                page: 2
            })

            $httpBackend.flush();
            $rootScope.$apply();

            requisitionService.forConvert({
                size: 10,
                page: 3
            })
            .then(function(requisitions) {
                result = requisitions;
            })

            expect($httpBackend.flush).toThrow();
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(5, 10));
        });

        it('should download requisitions from the server if there are none stored', function() {
            var result;

            $httpBackend
            .whenGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?size=20&page=0'))
            .respond(200, {
                first: true,
                last: true,
                number: 0,
                size: 20,
                numberOfElements: 0,
                totalElements: 0,
                totalPages: 0,
                content: []
            });

            requisitionService.forConvert({
                size: 10,
                page: 0
            });
            $httpBackend.flush();

            requisitionService.forConvert({
                size: 10,
                page: 0
            });
            $httpBackend.flush();
        });

    });

    ddescribe('convertToOrder interaction with forConvert', function() {

        it('should cause forConvert make a request if there is not enough data in the database', function() {
            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?page=0&size=20'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitions(20)
            });

            requisitionService.forConvert({
                page: 0,
                size: 10
            });
            $httpBackend.flush();

            requisitionService.forConvert({
                page: 1,
                size: 10
            });
            expect($httpBackend.flush).toThrow();

            $httpBackend
            .expectPOST(requisitionUrlFactory('/api/requisitions/convertToOrder'))
            .respond(200);

            requisitionService.convertToOrder([createDummyRequisitionWithDate(19)]);
            $httpBackend.flush();

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?page=0&size=30'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 30,
                numberOfElements: 30,
                totalElements: 59,
                totalPages: 2,
                content: createDummyRequisitions(30)
            });

            requisitionService.forConvert({
                page: 1,
                size: 10
            });
            $httpBackend.flush();
        });

        it('should cause forConvert return data from the database if there is enough', function() {
            var result;

            $httpBackend
            .expectGET(requisitionUrlFactory('/api/requisitions/requisitionsForConvert?page=0&size=20'))
            .respond(200, {
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitions(20)
            });

            requisitionService.forConvert({
                page: 0,
                size: 10
            });
            $httpBackend.flush();
            $rootScope.$apply();

            requisitionService.forConvert({
                page: 0,
                size: 10
            });
            expect($httpBackend.flush).toThrow();
            $rootScope.$apply();

            $httpBackend
            .expectPOST(requisitionUrlFactory('/api/requisitions/convertToOrder'))
            .respond(200);

            requisitionService.convertToOrder(createDummyRequisitionsWithDates(10));
            $httpBackend.flush();
            $rootScope.$apply();

            requisitionService.forConvert({
                page: 0,
                size: 10
            })
            .then(function(response) {
                result = response;
            });
            expect($httpBackend.flush).toThrow();
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10, 10));
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

    function createDummyRequisitionsWithDates(count, startIndex) {
        var requisitions = [];

        for (var id = startIndex || 0; id < (startIndex || 0) + count; id++) {
            requisitions.push(createDummyRequisitionWithDate(id));
        }

        return requisitions;
    }

    function createDummyRequisitions(count, startIndex) {
        var requisitions = [];

        for (var id = startIndex || 0; id < (startIndex || 0) + count; id++) {
            requisitions.push(createDummyRequisition(id));
        }

        return requisitions;
    }

    function createDummyRequisitionWithDate(id) {
        return {
            requisition: {
                id: 'requisition-' + id + '-id',
                processingPeriod: {
                    startDate: new Date(2016, 3, 30, 16, 21, 33),
                    endDate: new Date(2016, 3, 30, 16, 21, 33)
                }
            }
        };
    }

    function createDummyRequisition(id) {
        return {
            requisition: {
                id: 'requisition-' + id + '-id',
                processingPeriod: {
                    startDate: [2016, 4, 30, 16, 21, 33],
                    endDate: [2016, 4, 30, 16, 21, 33]
                }
            }
        };
    }

});
