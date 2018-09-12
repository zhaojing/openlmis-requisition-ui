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

describe('requisitionsForConvertFactory', function() {

    var requisitionsForConvertFactory, $rootScope, $q, requisitionService;

    beforeEach(function() {
        module('requisition-convert-to-order');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            requisitionService = $injector.get('requisitionService');
            requisitionsForConvertFactory = $injector.get('requisitionsForConvertFactory');
        });

        spyOn(requisitionService, 'forConvert');
        spyOn(requisitionService, 'convertToOrder').andReturn($q.resolve());
        spyOn(requisitionService, 'releaseWithoutOrder').andReturn($q.resolve());
    });

    describe('forConvert', function() {

        it('should not call endpoint for subsequent calls', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 21,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 1
            });
            $rootScope.$apply();
            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 1
            });

            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 30,
                page: 0
            });
        });

        it('should not call endpoint if enough requisitions are cached', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(22)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 7
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1
            });
        });

        it('should always call endpoint if sorting has changed', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(22)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5
            });
            $rootScope.$apply();

            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 65,
                totalPages: 2,
                sort: 'program',
                content: createDummyRequisitionsWithDates(22)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5,
                sort: 'program'
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1
            });
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1,
                sort: 'program'
            });
        });

        it('should always call endpoint if filterBy has changed', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 62,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(22)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5,
                filterBy: 'program'
            });
            $rootScope.$apply();

            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 25,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(25)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5,
                filterBy: 'all'
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1,
                filterBy: 'program'
            });
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1,
                filterBy: 'all'
            });
        });

        it('should always call endpoint if filterValue has changed', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 22,
                totalElements: 62,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(22)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5,
                filterValue: 'Bala'
            });
            $rootScope.$apply();

            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 25,
                totalElements: 65,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(25)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5,
                filterValue: 'B'
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1,
                filterValue: 'Bala'
            });
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1,
                filterValue: 'B'
            });
        });

        it('should return requested amount of requisitions if downloaded', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 20,
                numberOfElements: 20,
                totalElements: 65,
                totalPages: 4,
                sort: null,
                content: createDummyRequisitionsWithDates(20)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 2
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10));
        });

        it('should set last correctly if fetching last page', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 2,
                size: 21,
                numberOfElements: 14,
                totalElements: 56,
                totalPages: 3,
                sort: null,
                content: createDummyRequisitionsWithDates(14)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 7,
                page: 7
            })
                .then(function(page) {
                    result = page;
                });
            $rootScope.$apply();

            expect(result.last).toEqual(true);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 21,
                page: 2
            });
        });

        it('should set last correctly if the transformed is last but the original is not', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 60,
                numberOfElements: 31,
                totalElements: 91,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(31)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 15,
                page: 5
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.last).toEqual(false);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 60,
                page: 1
            });
        });

        it('should set first correctly if the transformed is first but the original is not', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: true,
                number: 0,
                size: 9,
                numberOfElements: 9,
                totalElements: 9,
                totalPages: 1,
                sort: null,
                content: createDummyRequisitionsWithDates(9)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 3,
                page: 1
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.first).toEqual(false);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 9,
                page: 0
            });
        });

        it('should set first correctly if original is first', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: true,
                number: 0,
                size: 6,
                numberOfElements: 6,
                totalElements: 6,
                totalPages: 1,
                sort: null,
                content: createDummyRequisitionsWithDates(6)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 3,
                page: 0
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.first).toEqual(true);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 6,
                page: 0
            });
        });

        it('should set pages correctly for full pages', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 33,
                numberOfElements: 33,
                totalElements: 44,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(33)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 11,
                page: 1
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.totalPages).toEqual(4);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 33,
                page: 0
            });
        });

        it('should set pages correctly for non full pages', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 36,
                numberOfElements: 36,
                totalElements: 37,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(36)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 12,
                page: 1
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.totalPages).toEqual(4);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 36,
                page: 0
            });
        });

        it('should set number of elements correctly for full pages', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 6,
                numberOfElements: 6,
                totalElements: 18,
                totalPages: 2,
                sort: null,
                content: createDummyRequisitionsWithDates(6)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 6,
                page: 2
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.numberOfElements).toEqual(6);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 12,
                page: 1
            });
        });

        it('should set number of elements correctly for non full pages', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 2,
                size: 1,
                numberOfElements: 1,
                totalElements: 33,
                totalPages: 3,
                sort: null,
                content: createDummyRequisitionsWithDates(1)
            }));

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 8,
                page: 4
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.numberOfElements).toEqual(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 16,
                page: 2
            });
        });

        it('should return cached requisitions', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 40,
                numberOfElements: 40,
                totalElements: 80,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(40)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 5
            });
            $rootScope.$apply();

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 6
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10, 20));
            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 40,
                page: 1
            });
        });

        it('should return cached requisition if the page is not complete but last', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: false,
                last: true,
                number: 1,
                size: 20,
                numberOfElements: 15,
                totalElements: 35,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(15)
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 2
            });
            $rootScope.$apply();

            var result;
            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 3
            })
                .then(function(requisitions) {
                    result = requisitions;
                });
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(5, 10));
            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 1
            });
        });

        it('should download requisitions from the server if there are none stored', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: true,
                number: 0,
                size: 20,
                numberOfElements: 0,
                totalElements: 0,
                totalPages: 0,
                content: []
            }));

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 0
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.forConvert({
                size: 10,
                page: 0
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert.calls.length).toBe(2);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 0
            });
        });

    });

    describe('releaseWithoutOrder interactions with forConvert', function() {

        it('should cause forConvert make a request if there is not enough data cached', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.forConvert({
                page: 1,
                size: 10
            });
            $rootScope.$apply();
            expect(requisitionService.forConvert.calls.length).toBe(1);

            requisitionsForConvertFactory.releaseWithoutOrder([createDummyRequisitionWithDate(19)]);
            $rootScope.$apply();

            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 30,
                numberOfElements: 30,
                totalElements: 59,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(30)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 1,
                size: 10
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert.calls.length).toBe(2);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 0
            });
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 30,
                page: 0
            });
        });

        it('should cause forConvert return cached data if there is enough', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.releaseWithoutOrder(createDummyRequisitionsWithDates(10));
            $rootScope.$apply();

            var result;
            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            })
                .then(function(response) {
                    result = response;
                });
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10, 10));
            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 0
            });
        });
    });

    describe('convertToOrder interaction with forConvert', function() {

        it('should cause forConvert make a request if there is not enough data cached', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.forConvert({
                page: 1,
                size: 10
            });
            $rootScope.$apply();
            expect(requisitionService.forConvert.calls.length).toBe(1);

            requisitionsForConvertFactory.convertToOrder([createDummyRequisitionWithDate(19)]);
            $rootScope.$apply();

            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 30,
                numberOfElements: 30,
                totalElements: 59,
                totalPages: 2,
                content: createDummyRequisitionsWithDates(30)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 1,
                size: 10
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert.calls.length).toBe(2);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 0
            });
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 30,
                page: 0
            });
        });

        it('should cause forConvert return cached data if there is enough', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.convertToOrder(createDummyRequisitionsWithDates(10));
            $rootScope.$apply();

            var result;
            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            })
                .then(function(response) {
                    result = response;
                });
            $rootScope.$apply();

            expect(result.content).toEqual(createDummyRequisitionsWithDates(10, 10));
            expect(requisitionService.forConvert.calls.length).toBe(1);
            expect(requisitionService.forConvert).toHaveBeenCalledWith({
                size: 20,
                page: 0
            });
        });

    });

    describe('clearCache', function() {

        it('should clear cache', function() {
            requisitionService.forConvert.andReturn($q.resolve({
                first: true,
                last: false,
                number: 0,
                size: 20,
                numberOfElements: 20,
                totalElements: 60,
                totalPages: 3,
                content: createDummyRequisitionsWithDates(20)
            }));

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            requisitionsForConvertFactory.clearCache();

            requisitionsForConvertFactory.forConvert({
                page: 0,
                size: 10
            });
            $rootScope.$apply();

            expect(requisitionService.forConvert.calls.length).toBe(2);
        });

    });

    function createDummyRequisitionsWithDates(count, startIndex) {
        var requisitions = [];

        for (var id = startIndex || 0; id < (startIndex || 0) + count; id++) {
            requisitions.push(createDummyRequisitionWithDate(id));
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

});
