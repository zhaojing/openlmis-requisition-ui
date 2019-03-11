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

describe('requisitionService', function() {

    beforeEach(function() {
        module('requisition');

        this.startDate = [2016, 4, 30, 16, 21, 33];
        this.endDate = [2016, 4, 30, 16, 21, 33];
        this.startDate1 = new Date();
        this.endDate1 = new Date();
        this.modifiedDate = [2016, 4, 30, 16, 21, 33];
        this.createdDate = [2016, 4, 30, 16, 21, 33];
        this.createdDate2 = [2016, 10, 30, 16, 21, 33];
        this.processingSchedule = {
            modifiedDate: this.modifiedDate
        };
        this.facility = {
            id: '1',
            name: 'facility1'
        };
        this.program = {
            id: '1',
            name: 'program1'
        };
        this.period = {
            id: '1',
            startDate: this.startDate,
            endDate: this.endDate,
            processingSchedule: this.processingSchedule
        };
        this.emergency = false;
        this.reasonNotHidden = {
            id: 'reason-id',
            hidden: false
        };
        this.reasonHidden = {
            id: 'hidden-id',
            hidden: true
        };
        this.reasonWithoutHidden = {
            id: 'without-hidden-id'
        };
        this.requisition = {
            id: '1',
            name: 'requisition',
            status: 'INITIATED',
            facilityId: this.facility.id,
            programId: this.program.id,
            processingPeriod: this.period,
            createdDate: this.createdDate,
            supplyingFacility: '2',
            template: '1',
            program: {
                id: 'program-id'
            },
            facility: {
                id: 'facility-id'
            },
            stockAdjustmentReasons: [this.reasonNotHidden, this.reasonHidden, this.reasonWithoutHidden]
        };
        this.requisitionDto = {
            id: '2',
            name: 'requisitionDto',
            status: 'INITIATED',
            facility: this.facility,
            program: this.program,
            processingPeriod: this.period,
            createdDate: this.createdDate
        };
        this.requisitionDto2 = {
            id: '3',
            name: 'requisitionDto',
            status: 'RELEASED',
            facility: this.facility,
            program: this.program,
            processingPeriod: this.period,
            createdDate: this.createdDate2
        };
        this.statusMessage = {
            id: '123'
        };

        var context = this;
        module(function($provide) {
            var RequisitionSpy = jasmine.createSpy('Requisition').andCallFake(function(requisition) {
                    return requisition;
                }),
                confirmServiceMock = jasmine.createSpyObj('confirmService', ['confirm']);

            confirmServiceMock.confirm.andCallFake(function() {
                return context.$q.when(true);
            });

            $provide.service('Requisition', function() {
                return RequisitionSpy;
            });

            $provide.service('confirmService', function() {
                return confirmServiceMock;
            });

            context.requisitionsStorage = jasmine
                .createSpyObj('requisitionsStorage', ['search', 'put', 'getBy', 'removeBy']);

            context.batchRequisitionsStorage = jasmine
                .createSpyObj('batchRequisitionsStorage', ['search', 'put', 'getBy', 'removeBy']);
            context.statusMessagesStorage = jasmine
                .createSpyObj('statusMessagesStorage', ['search', 'put', 'getBy', 'removeBy']);

            var offlineFlag = jasmine.createSpyObj('offlineRequisitions', ['getAll']);
            offlineFlag.getAll.andReturn([false]);
            context.onlineOnlyRequisitions = jasmine.createSpyObj('onlineOnly', ['contains']);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function(resourceName) {
                if (resourceName === 'offlineFlag') {
                    return offlineFlag;
                }
                if (resourceName === 'onlineOnly') {
                    return context.onlineOnlyRequisitions;
                }
                if (resourceName === 'batchApproveRequisitions') {
                    return context.batchRequisitionsStorage;
                }
                if (resourceName === 'statusMessages') {
                    return context.statusMessagesStorage;
                }
                return context.requisitionsStorage;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.requisitionService = $injector.get('requisitionService');
            this.allStatuses = $injector.get('REQUISITION_STATUS').$toList();
            this.dateUtils = $injector.get('dateUtils');
            this.requisitionUrlFactory = $injector.get('requisitionUrlFactory');
            this.offlineService = $injector.get('offlineService');
            this.$templateCache = $injector.get('$templateCache');

            this.$templateCache.put('common/notification-modal.html', 'something');
        });

        spyOn(this.offlineService, 'isOffline').andReturn(false);

        this.formatDatesInRequisition = formatDatesInRequisition;
    });

    describe('get', function() {

        var getRequisitionUrl,
            getStatusMessagesUrl,
            headers = {
                eTag: 'W/1'
            };

        beforeEach(function() {
            getStatusMessagesUrl = '/api/requisitions/' + this.requisition.id + '/statusMessages';
            getRequisitionUrl = '/api/requisitions/' + this.requisition.id;
        });

        it('should return eTag for requisition', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getStatusMessagesUrl))
                .respond(200, [this.statusMessage]);

            var data = {};
            this.requisitionService.get('1').then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.id).toBe(this.requisition.id);
            expect(data.eTag).toBe(headers['eTag']);
            expect(this.requisitionsStorage.put).toHaveBeenCalled();
            expect(this.statusMessagesStorage.put).toHaveBeenCalled();
        });

        it('should get requisition by id', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getStatusMessagesUrl))
                .respond(200, [this.statusMessage]);

            var data = {};
            this.requisitionService.get('1').then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.id).toBe(this.requisition.id);
            expect(this.requisitionsStorage.put).toHaveBeenCalled();
            expect(this.statusMessagesStorage.put).toHaveBeenCalled();
        });

        it('should get requisition by id from offline resources', function() {
            this.offlineService.isOffline.andReturn(true);
            var requisition = this.requisition;
            this.requisitionsStorage.getBy.andCallFake(function(param, value) {
                if (param === 'id' && value === requisition.id) {
                    return requisition;
                }

                return undefined;
            });

            var data = {};
            this.requisitionService.get('1').then(function(response) {
                data = response;
            });

            this.$rootScope.$apply();

            expect(data.id).toBe(this.requisition.id);
            expect(this.requisitionsStorage.put).not.toHaveBeenCalled();
            expect(this.statusMessagesStorage.put).not.toHaveBeenCalled();
        });

        it('should filter out hidden reasons', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getStatusMessagesUrl))
                .respond(200, [this.statusMessage]);

            var data = {};
            this.requisitionService.get('1').then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.id).toBe(this.requisition.id);
            expect(data.stockAdjustmentReasons).toEqual([this.reasonNotHidden, this.reasonWithoutHidden]);
        });

        it('should try to fetch requisition from the backend if it is not stored in the local storage', function() {
            this.offlineService.isOffline.andReturn(true);
            this.requisitionsStorage.getBy.andReturn(undefined);
            this.$httpBackend

                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))

                .respond(418, this.requisition);

            this.requisitionService.get(this.requisition.id);
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();
            expect(this.requisitionsStorage.getBy).toHaveBeenCalledWith('id', '1');
        });

        it('should retrieve requisition from the local storage if it was modified locally', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);

            this.requisition.$modified = true;
            this.requisitionsStorage.getBy.andReturn(this.requisition);
            this.statusMessagesStorage.search.andReturn([this.statusMessage]);

            var result;
            this.requisitionService.get(this.requisition.id)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.id).toEqual(this.requisition.id);
        });

        //eslint-disable-next-line jasmine/missing-expect
        it('should retrieve requisition from the server if it is not modified', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getStatusMessagesUrl))
                .respond(200, [this.statusMessage]);

            this.requisition.$modified = false;
            this.requisitionsStorage.getBy.andReturn(this.requisition);

            this.requisitionService.get(this.requisition.id);
            this.$httpBackend.flush();
            this.$rootScope.$apply();
        });

        it('should retrieve requisition from the server to check if the cached one is outdated', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);

            var offlineRequisition = angular.copy(this.requisition);
            offlineRequisition.modifiedDate = [2016, 4, 30, 15, 20, 33];
            offlineRequisition.$modified = true;
            this.requisitionsStorage.getBy.andReturn(offlineRequisition);

            this.requisition.modifiedDate = [2016, 4, 30, 16, 21, 33];

            var result;
            this.requisitionService.get(this.requisition.id)
                .then(function(requisition) {
                    result = requisition;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.$outdated).toBe(true);
        });

        it('should mark requisition as outdated if it does not have modified date', function() {
            this.$httpBackend
                .expectGET(this.requisitionUrlFactory(getRequisitionUrl))
                .respond(200, this.requisition, headers);

            var offlineRequisition = angular.copy(this.requisition);
            offlineRequisition.$modified = true;
            this.requisitionsStorage.getBy.andReturn(offlineRequisition);

            this.requisition.modifiedDate = [2016, 4, 30, 16, 21, 33];

            var result;
            this.requisitionService.get(this.requisition.id)
                .then(function(requisition) {
                    result = requisition;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(result.$outdated).toBe(true);
        });
    });

    it('should initiate requisition', function() {
        var data;

        this.$httpBackend
            .whenPOST(this.requisitionUrlFactory(
                '/api/requisitions/initiate'
                + '?emergency=' + this.emergency
                + '&facility=' + this.facility.id
                + '&program=' + this.program.id
                + '&suggestedPeriod=' + this.period.id
            ))
            .respond(200, this.requisition);

        this.requisitionService
            .initiate(this.facility.id, this.program.id, this.period.id, this.emergency)
            .then(function(response) {
                data = response;
            });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        this.requisition.$modified = true;
        this.requisition.$availableOffline = true;

        expect(angular.toJson(data.id)).toEqual(angular.toJson(this.requisition.id));
        expect(this.requisitionsStorage.put).toHaveBeenCalled();
        expect(data.stockAdjustmentReasons).toEqual([this.reasonNotHidden, this.reasonWithoutHidden]);
    });

    it('should get requisitions for convert', function() {
        var data,
            requisitionCopy = this.formatDatesInRequisition(angular.copy(this.requisitionDto)),
            params = {
                filterBy: 'filterBy',
                filterValue: 'filterValue',
                sortBy: 'sortBy',
                descending: 'true'
            };

        this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/requisitionsForConvert?descending=' +
            params.descending + '&filterBy=' + params.filterBy + '&filterValue=' + params.filterValue + '&sortBy=' +
            params.sortBy))

            .respond(200, {
                content: [{
                    requisition: this.requisitionDto
                }]
            });

        this.requisitionService.forConvert(params).then(function(response) {
            data = response;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [{
                requisition: requisitionCopy
            }]
        }));
    });

    it('should release a batch of requisitions with order', function() {
        var callback = jasmine.createSpy();

        this.$httpBackend.whenPOST(this.requisitionUrlFactory('/api/requisitions/batchReleases'))

            .respond(function() {
                return [200, angular.toJson({})];
            });

        this.requisitionService.convertToOrder([{
            requisition: this.requisition
        }]).then(callback);

        this.$rootScope.$apply();
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(callback).toHaveBeenCalled();
        expect(this.requisitionsStorage.removeBy).toHaveBeenCalledWith('id', '1');
    });

    it('should release a batch of requisitions without order', function() {
        var callback = jasmine.createSpy();

        this.$httpBackend.whenPOST(this.requisitionUrlFactory('/api/requisitions/batchReleases'))

            .respond(function() {
                return [200, angular.toJson({})];
            });

        this.requisitionService.releaseWithoutOrder([{
            requisition: this.requisition
        }]).then(callback);

        this.$rootScope.$apply();
        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(callback).toHaveBeenCalled();
        expect(this.requisitionsStorage.removeBy).toHaveBeenCalledWith('id', '1');
    });

    it('should search requisitions with all params', function() {
        var data,
            params = {
                facility: this.facility.id,
                program: this.program.id,
                initiatedDateFrom: this.startDate1.toISOString(),
                initiatedDateTo: this.endDate1.toISOString(),
                requisitionStatus: [this.allStatuses[0].label, this.allStatuses[1].label],
                emergency: true,
                sort: 'createdDate,desc'
            },
            requisitionCopy = this.formatDatesInRequisition(angular.copy(this.requisitionDto));

        this.$httpBackend
            .whenGET(
                this.requisitionUrlFactory('/api/requisitions/search'
                + '?initiatedDateFrom=' + this.startDate1.toISOString()
                + '&initiatedDateTo=' + this.endDate1.toISOString()
                + '&emergency=' + params.emergency
                + '&facility=' + this.facility.id
                + '&program=' + this.program.id
                + '&requisitionStatus=' + this.allStatuses[0].label
                + '&requisitionStatus=' + this.allStatuses[1].label
                + '&sort=' + params.sort)
            )
            .respond(200, {
                content: [this.requisitionDto]
            });

        this.requisitionsStorage.getBy.andReturn(false);

        this.requisitionService.search(false, params).then(function(response) {
            data = response;
        }, function() {
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [
                requisitionCopy
            ]
        }));
    });

    it('should search requisitions only with this.facility paramter', function() {
        var data,
            requisitionCopy = this.formatDatesInRequisition(angular.copy(this.requisitionDto2)),
            params = {
                facility: this.facility.id
            };

        this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search?facility=' + this.facility.id))

            .respond(200, {
                content: [this.requisitionDto2]
            });

        this.requisitionsStorage.getBy.andReturn(false);

        this.requisitionService.search(false, params).then(function(response) {
            data = response;
        });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [
                requisitionCopy
            ]
        }));
    });

    it('should search requisitions offline', function() {
        var data,
            params = {
                facility: this.facility.id,
                page: 0,
                size: 10,
                sort: 'createdDate,desc'
            };

        this.requisitionsStorage.search.andReturn([this.requisitionDto2, this.requisitionDto]);

        this.requisitionService.search(true, params).then(function(response) {
            data = response;
        });

        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [this.requisitionDto2, this.requisitionDto],
            number: 0,
            totalElements: 2,
            size: 10,
            sort: 'createdDate,desc'
        }));

        expect(this.requisitionsStorage.search).toHaveBeenCalledWith(params, 'requisitionSearch');
    });

    it('should count batch requisitions in search total elements if showBatchRequisitions is true', function() {
        var data,
            params = {
                showBatchRequisitions: true,
                program: this.program.id,
                page: 0,
                size: 10
            };

        this.requisitionsStorage.search.andReturn([this.requisitionDto]);
        this.batchRequisitionsStorage.search.andReturn([this.requisitionDto, this.requisitionDto2]);

        this.requisitionService.search(true, params).then(function(response) {
            data = response;
        });

        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [this.requisitionDto, this.requisitionDto2],
            number: 0,
            totalElements: 2,
            size: 10
        }));

        expect(this.batchRequisitionsStorage.search).toHaveBeenCalledWith(params.program, 'requisitionSearch');
    });

    it('should not count batch requisitions in search total elements if showBatchRequisitions is false', function() {
        var data,
            params = {
                showBatchRequisitions: false,
                program: this.program.id,
                page: 0,
                size: 10
            };

        this.requisitionsStorage.search.andReturn([this.requisitionDto]);
        this.batchRequisitionsStorage.search.andReturn([this.requisitionDto, this.requisitionDto2]);

        this.requisitionService.search(true, params).then(function(response) {
            data = response;
        });

        this.$rootScope.$apply();

        expect(angular.toJson(data)).toEqual(angular.toJson({
            content: [this.requisitionDto],
            number: 0,
            totalElements: 1,
            size: 10
        }));

        expect(this.batchRequisitionsStorage.search).not.toHaveBeenCalled();
    });

    describe('transformRequisition', function() {

        it('should not require this.createdDate to be set', function() {
            var data;

            this.requisition.createdDate = null;

            this.$httpBackend.when(
                'GET', this.requisitionUrlFactory('/api/requisitions/search?facility=' + this.facility.id)
            )
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search(false, {
                facility: this.facility.id
            }).then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.content[0].createdDate).toEqual(null);
        });

        it('should not require this.processingSchedule to be set', function() {
            var data;

            this.requisition.processingPeriod.processingSchedule = null;

            this.$httpBackend.when(
                'GET', this.requisitionUrlFactory('/api/requisitions/search?facility=' + this.facility.id)
            )
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search(false, {
                facility: this.facility.id
            }).then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.content[0].processingPeriod.processingSchedule).toEqual(null);
        });

        it('will mark the offline version of the requisition as $outdated, if modifiedDates do not match', function() {
            var offlineRequisition = {
                id: '1',
                modifiedDate: [2016, 4, 30, 16, 21, 33]
            };
            this.requisitionsStorage.getBy.andReturn(offlineRequisition);

            this.requisition.modifiedDate = [2016, 4, 30, 16, 21, 33];

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search();
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(this.requisitionsStorage.getBy).toHaveBeenCalled();
            expect(offlineRequisition.$outdated).toBeUndefined();

            this.requisition.modifiedDate = [2000, 9, 1, 1, 1, 1];

            this.requisitionService.search();
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(offlineRequisition.$outdated).toBe(true);

            // The offline requisition should have been updated twice (once as $outdated, and once not)
            expect(this.requisitionsStorage.put.calls.length).toBe(2);
        });

        it('will put requisition to the batch requisitions storage if modifiedDates do not match', function() {
            this.requisition.modifiedDate = [2016, 4, 30, 16, 21, 33];

            this.batchRequisitionsStorage.getBy.andReturn(this.requisition);

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search();
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(this.batchRequisitionsStorage.put).toHaveBeenCalled();
            expect(this.requisitionsStorage.put).not.toHaveBeenCalled();
        });

        it('will put requisition to the requisitions storage if modifiedDates do not match', function() {
            this.requisition.modifiedDate = [2016, 4, 30, 16, 21, 33];

            this.requisitionsStorage.getBy.andReturn(this.requisition);

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search();
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(this.requisitionsStorage.put).toHaveBeenCalled();
            expect(this.batchRequisitionsStorage.put).not.toHaveBeenCalled();
        });

        it('will set requisition as available offline if was found the batch requisitions storage', function() {
            this.batchRequisitionsStorage.getBy.andReturn(this.requisition);

            var data = {};

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search().then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.content[0].$availableOffline).toBe(true);
        });

        it('will set requisition as available offline if was found the requisitions storage', function() {
            this.requisitionsStorage.getBy.andReturn(this.requisition);

            var data = {};

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search().then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(data.content[0].$availableOffline).toBe(true);
        });

        it('will not set requisition as available offline if was not found in any storage', function() {
            var data = {};

            this.$httpBackend.whenGET(this.requisitionUrlFactory('/api/requisitions/search'))
                .respond(200, {
                    content: [
                        this.requisition
                    ]
                });

            this.requisitionService.search().then(function(response) {
                data = response;
            });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(this.requisitionsStorage.getBy).toHaveBeenCalled();
            expect(this.batchRequisitionsStorage.getBy).toHaveBeenCalled();
            expect(data.content[0].$availableOffline).toBe(undefined);
        });

    });

    function formatDatesInRequisition(requisition) {
        requisition.processingPeriod.processingSchedule.modifiedDate = this.dateUtils
            .toDate(requisition.processingPeriod.processingSchedule.modifiedDate);
        requisition.processingPeriod.endDate = this.dateUtils.toDate(requisition.processingPeriod.endDate);
        requisition.processingPeriod.startDate = this.dateUtils.toDate(requisition.processingPeriod.startDate);
        requisition.createdDate = this.dateUtils.toDate(requisition.createdDate);
        return requisition;
    }

});
