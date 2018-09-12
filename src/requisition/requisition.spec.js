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

describe('Requisition', function() {

    var $rootScope, $httpBackend, REQUISITION_STATUS, requisitionUrlFactory, sourceRequisition,
        offlineRequisitions, authorizationServiceSpy, userHasApproveRight, userHasAuthorizeRight,
        userHasCreateRight, userHasDeleteRight, REQUISITION_RIGHTS, Requisition,
        RequisitionDataBuilder, requisition, calculatedOrderQuantity, OrderableDataBuilder,
        RequisitionLineItemDataBuilder, LineItem, UuidGenerator, key;

    beforeEach(function() {
        module('requisition', function($provide) {
            var template = jasmine.createSpyObj('template', ['getColumns', 'getColumn']),
                TemplateSpy = jasmine.createSpy('RequisitionTemplate').andReturn(template);

            template.getColumns.andCallFake(function(nonFullSupply) {
                return nonFullSupply ? nonFullSupplyColumns() : fullSupplyColumns();
            });

            calculatedOrderQuantity = {
                isDisplayed: true
            };
            template.getColumn.andReturn(calculatedOrderQuantity);

            offlineRequisitions = jasmine.createSpyObj('offlineRequisitions', ['put', 'remove', 'removeBy']);
            var offlineFlag = jasmine.createSpyObj('offlineRequisitions', ['getAll']);
            offlineFlag.getAll.andReturn([false]);

            $provide.service('RequisitionTemplate', function() {
                return TemplateSpy;
            });
            $provide.factory('localStorageFactory', function() {
                return function(name) {
                    if (name === 'offlineFlag') {
                        return offlineFlag;
                    }
                    return offlineRequisitions;
                };
            });

            authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['hasRight', 'isAuthenticated']);
            $provide.service('authorizationService', function() {
                return authorizationServiceSpy;
            });

            authorizationServiceSpy.hasRight.andCallFake(function(right) {
                if (userHasApproveRight && right === REQUISITION_RIGHTS.REQUISITION_APPROVE) {
                    return true;
                }
                if (userHasAuthorizeRight && right === REQUISITION_RIGHTS.REQUISITION_AUTHORIZE) {
                    return true;
                }
                if (userHasCreateRight && right === REQUISITION_RIGHTS.REQUISITION_CREATE) {
                    return true;
                }
                if (userHasDeleteRight && right === REQUISITION_RIGHTS.REQUISITION_DELETE) {
                    return true;
                }
                return false;
            });
        });

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            requisitionUrlFactory = $injector.get('requisitionUrlFactory');
            REQUISITION_STATUS = $injector.get('REQUISITION_STATUS');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            Requisition = $injector.get('Requisition');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');
            RequisitionLineItemDataBuilder = $injector.get('RequisitionLineItemDataBuilder');
            OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            LineItem = $injector.get('LineItem');
            UuidGenerator = $injector.get('UuidGenerator');
        });

        sourceRequisition = new RequisitionDataBuilder().buildJson();
        key = 'key';
        UuidGenerator.prototype.generate = function() {
            return key;
        };
        requisition = new Requisition(sourceRequisition);
    });

    describe('submit', function() {

        it('should submit requisition that is available offline', function() {
            var storedRequisition;

            offlineRequisitions.put.andCallFake(function(argument) {
                storedRequisition = argument;
            });

            key = 'new-key';

            expect(requisition.$isSubmitted()).toBe(false);

            requisition.status = REQUISITION_STATUS.SUBMITTED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/submit'))
                .respond(200, requisition);

            requisition.$availableOffline = true;
            requisition.$submit();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isSubmitted()).toBe(true);
            expect(offlineRequisitions.put).toHaveBeenCalled();
            expect(storedRequisition.$modified).toBe(false);
            expect(storedRequisition.$availableOffline).toBe(true);
            expect(storedRequisition.id).toEqual(requisition.id);
            expect(storedRequisition.idempotencyKey).toEqual(key);
        });

        it('should update modifiedDate, status and statusChanges of a requisition', function() {
            var storedRequisition, updatedRequisition;

            offlineRequisitions.put.andCallFake(function(argument) {
                storedRequisition = argument;
            });

            updatedRequisition = angular.copy(requisition);
            updatedRequisition.status = REQUISITION_STATUS.SUBMITTED;
            updatedRequisition.modifiedDate = [2016, 4, 31, 16, 25, 33];
            updatedRequisition.statusChanges = 'statusChanges';

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/submit'))
                .respond(200, updatedRequisition);

            requisition.$availableOffline = true;
            requisition.$submit();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(offlineRequisitions.put).toHaveBeenCalled();
            expect(storedRequisition.modifiedDate).toEqual(updatedRequisition.modifiedDate);
            expect(storedRequisition.status).toEqual(updatedRequisition.status);
            expect(storedRequisition.statusChanges).toEqual(updatedRequisition.statusChanges);
        });

        it('should save requisition to local storage after updating it', function() {
            var storedRequisition, updatedRequisition;

            offlineRequisitions.put.andCallFake(function(argument) {
                storedRequisition = argument;
            });

            updatedRequisition = angular.copy(requisition);

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/submit'))
                .respond(200, updatedRequisition);

            requisition.$availableOffline = true;
            requisition.$submit();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(offlineRequisitions.put).toHaveBeenCalled();
            expect(storedRequisition.id).toEqual(updatedRequisition.id);
        });

        it('should submit requisition that is not available offline', function() {
            expect(requisition.$isSubmitted()).toBe(false);

            requisition.status = REQUISITION_STATUS.SUBMITTED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/submit'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$submit();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isSubmitted()).toBe(true);
            expect(offlineRequisitions.put).not.toHaveBeenCalled();
        });
    });

    describe('authorize', function() {

        it('should authorize requisition that is available offline', function() {
            var storedRequisition;
            offlineRequisitions.put.andCallFake(function(argument) {
                storedRequisition = argument;
            });

            key = 'new-key';

            expect(requisition.$isAuthorized()).toBe(false);

            requisition.status = REQUISITION_STATUS.AUTHORIZED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
                .respond(200, requisition);

            requisition.$availableOffline = true;
            requisition.$authorize();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isAuthorized()).toBe(true);
            expect(offlineRequisitions.put).toHaveBeenCalled();
            expect(storedRequisition.$modified).toBe(false);
            expect(storedRequisition.$availableOffline).toBe(true);
            expect(storedRequisition.id).toEqual(requisition.id);
            expect(storedRequisition.idempotencyKey).toEqual(key);
        });

        it('should authorize requisition that is not available offline', function() {
            expect(requisition.$isAuthorized()).toBe(false);

            requisition.status = REQUISITION_STATUS.AUTHORIZED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$authorize();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isAuthorized()).toBe(true);
            expect(offlineRequisitions.put).not.toHaveBeenCalled();
        });

        it('should set approved quantity to requested quantity when requested quantity is not empty', function() {
            requisition.status = REQUISITION_STATUS.AUTHORIZED;
            requisition.template.getColumn('calculatedOrderQuantity').isDisplayed = true;
            requisition.requisitionLineItems[0].requestedQuantity = 10;
            requisition.requisitionLineItems[1].requestedQuantity = 15;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$authorize();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isAuthorized()).toBe(true);
            expect(requisition.requisitionLineItems[0].approvedQuantity)
                .toBe(requisition.requisitionLineItems[0].requestedQuantity);
            expect(requisition.requisitionLineItems[1].approvedQuantity)
                .toBe(requisition.requisitionLineItems[1].requestedQuantity);
        });

        it('should set approved quantity to calculated quantity when calculated quantity is displayed and requested' +
            ' quantity is empty', function() {
            requisition.status = REQUISITION_STATUS.AUTHORIZED;
            requisition.template.getColumn('calculatedOrderQuantity').isDisplayed = true;
            requisition.requisitionLineItems[0].requestedQuantity = null;
            requisition.requisitionLineItems[1].requestedQuantity = null;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$authorize();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isAuthorized()).toBe(true);
            expect(requisition.requisitionLineItems[0].approvedQuantity)
                .toBe(requisition.requisitionLineItems[0].calculatedOrderQuantity);
            expect(requisition.requisitionLineItems[1].approvedQuantity)
                .toBe(requisition.requisitionLineItems[1].calculatedOrderQuantity);
        });

        it('should set approved quantity to requested quantity when calculated quantity is not displayed', function() {
            requisition.status = REQUISITION_STATUS.AUTHORIZED;
            requisition.template.getColumn('calculatedOrderQuantity').isDisplayed = false;
            requisition.requisitionLineItems[0].requestedQuantity = 15;
            requisition.requisitionLineItems[1].requestedQuantity = null;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/authorize'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$authorize();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isAuthorized()).toBe(true);
            expect(requisition.requisitionLineItems[0].approvedQuantity)
                .toBe(requisition.requisitionLineItems[0].requestedQuantity);
            expect(requisition.requisitionLineItems[1].approvedQuantity)
                .toBe(requisition.requisitionLineItems[1].requestedQuantity);
        });
    });

    describe('approve', function() {

        it('should approve requisition that is available offline', function() {
            var storedRequisition;
            offlineRequisitions.put.andCallFake(function(argument) {
                storedRequisition = argument;
            });

            expect(requisition.$isApproved()).toBe(false);

            requisition.status = REQUISITION_STATUS.APPROVED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/approve'))
                .respond(200, requisition);

            requisition.$availableOffline = true;
            requisition.$approve();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isApproved()).toBe(true);
            expect(offlineRequisitions.put).toHaveBeenCalled();
            expect(storedRequisition.$modified).toBe(false);
            expect(storedRequisition.$availableOffline).toBe(true);
            expect(storedRequisition.id).toEqual(requisition.id);
            expect(storedRequisition.idempotencyKey).toEqual(key);
        });

        it('should approve requisition that is not available offline', function() {
            expect(requisition.$isApproved()).toBe(false);

            requisition.status = REQUISITION_STATUS.APPROVED;

            $httpBackend.when('POST', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/approve'))
                .respond(200, requisition);

            requisition.$availableOffline = false;
            requisition.$approve();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(requisition.$isApproved()).toBe(true);
            expect(offlineRequisitions.put).not.toHaveBeenCalled();
        });
    });

    describe('reject', function() {

        it('should reject requisition', function() {
            var data;

            $httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/reject'))
                .respond(200, requisition);

            requisition.$reject().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
        });
    });

    describe('skip', function() {

        it('should skip requisition', function() {
            var data;

            $httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id + '/skip'))
                .respond(200, requisition);

            requisition.$skip().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
        });
    });

    describe('remove', function() {

        it('should remove requisition', function() {
            var data;

            $httpBackend.when('DELETE', requisitionUrlFactory('/api/requisitions/' + requisition.id))
                .respond(200, requisition);

            requisition.$remove().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
        });

        it('should not approve requisition if request fails', function() {
            $httpBackend.when('DELETE', requisitionUrlFactory('/api/requisitions/' + requisition.id))
                .respond(500);

            var spy = jasmine.createSpy();
            requisition.$remove().then(spy);

            $httpBackend.flush();
            $rootScope.$apply();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('save', function() {

        it('should save requisition', function() {
            var data;

            $httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id))
                .respond(200, requisition);

            requisition.name = 'Saved requisition';

            requisition.$save().then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(requisition));
        });

        it('should remove offline when 403', function() {
            $httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id))
                .respond(403, requisition);

            requisition.$save();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(offlineRequisitions.removeBy).toHaveBeenCalledWith('id', requisition.id);
        });

        it('should remove offline when 409', function() {
            $httpBackend.when('PUT', requisitionUrlFactory('/api/requisitions/' + requisition.id))
                .respond(403, requisition);

            requisition.$save();

            $httpBackend.flush();
            $rootScope.$apply();

            expect(offlineRequisitions.removeBy).toHaveBeenCalledWith('id', requisition.id);
        });
    });

    describe('isInitiated', function() {

        it('should return true if requisition status is initiated', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isInitiated = requisition.$isInitiated();

            expect(isInitiated).toBe(true);
        });

        it('should return false if requisition status is not initiated', function() {
            requisition.status = REQUISITION_STATUS.SUBMITTED;

            var isInitiated = requisition.$isInitiated();

            expect(isInitiated).toBe(false);
        });
    });

    describe('isSubmitted', function() {

        it('should return true if requisition status is submitted', function() {
            requisition.status = REQUISITION_STATUS.SUBMITTED;

            var isSubmitted = requisition.$isSubmitted();

            expect(isSubmitted).toBe(true);
        });

        it('should return false if requisition status is not submitted', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isSubmitted = requisition.$isSubmitted();

            expect(isSubmitted).toBe(false);
        });
    });

    describe('isAuthorized', function() {

        it('should return true if requisition status is authorized', function() {
            requisition.status = REQUISITION_STATUS.AUTHORIZED;

            var isAuthorized = requisition.$isAuthorized();

            expect(isAuthorized).toBe(true);
        });

        it('should return false if requisition status is not authorized', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isAuthorized = requisition.$isAuthorized();

            expect(isAuthorized).toBe(false);
        });
    });

    describe('isApproved', function() {

        it('should return true if requisition status is approved', function() {
            requisition.status = REQUISITION_STATUS.APPROVED;

            var isApproved = requisition.$isApproved();

            expect(isApproved).toBe(true);
        });

        it('should return false if requisition status is not approved', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isApproved = requisition.$isApproved();

            expect(isApproved).toBe(false);
        });
    });

    describe('isReleased', function() {

        it('should return true if requisition status is released', function() {
            requisition.status = REQUISITION_STATUS.RELEASED;

            var isReleased = requisition.$isReleased();

            expect(isReleased).toBe(true);
        });

        it('should return false if requisition status is not released', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isReleased = requisition.$isReleased();

            expect(isReleased).toBe(false);
        });
    });

    describe('isRejected', function() {

        it('should return true if requisition status is rejected', function() {
            requisition.status = REQUISITION_STATUS.REJECTED;

            var isRejected = requisition.$isRejected();

            expect(isRejected).toBe(true);
        });

        it('should return false if requisition status is not rejected', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isRejected = requisition.$isRejected();

            expect(isRejected).toBe(false);
        });
    });

    describe('isSkipped', function() {

        it('should return true if requisition status is skipped', function() {
            requisition.status = REQUISITION_STATUS.SKIPPED;

            var isSkipped = requisition.$isSkipped();

            expect(isSkipped).toBe(true);
        });

        it('should return false if requisition status is not skipped', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;

            var isSkipped = requisition.$isRejected();

            expect(isSkipped).toBe(false);
        });
    });

    describe('isAfterAuthorize', function() {
        it('should return false for requisition status INITIATED', function() {
            requisition.status = REQUISITION_STATUS.INITIATED;
            expect(requisition.$isAfterAuthorize()).toBe(false);
        });

        it('should return false for requisition status SUBMITTED', function() {
            requisition.status = REQUISITION_STATUS.SUBMITTED;
            expect(requisition.$isAfterAuthorize()).toBe(false);
        });

        it('should return true for requisition status AUTHORIZED', function() {
            requisition.status = REQUISITION_STATUS.AUTHORIZED;
            expect(requisition.$isAfterAuthorize()).toBe(true);
        });

        it('should return true for requisition status IN_APPROVAL', function() {
            requisition.status = REQUISITION_STATUS.IN_APPROVAL;
            expect(requisition.$isAfterAuthorize()).toBe(true);
        });

        it('should return true requisition status APPROVED', function() {
            requisition.status = REQUISITION_STATUS.APPROVED;
            expect(requisition.$isAfterAuthorize()).toBe(true);
        });

        it('should return true requisition status RELEASED', function() {
            requisition.status = REQUISITION_STATUS.RELEASED;
            expect(requisition.$isAfterAuthorize()).toBe(true);
        });
    });

    describe('constructor', function() {

        beforeEach(function() {
            userHasApproveRight = false;
            userHasAuthorizeRight = false;
            userHasCreateRight = false;
            userHasDeleteRight = false;
        });

        it('should set isEditable to true if user has REQUISITION_CREATE right and requisition is initiated',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.INITIATED;
                userHasCreateRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_CREATE right and requisition is rejected',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.REJECTED;
                userHasCreateRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_APPROVE right and requisition is authorized',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.AUTHORIZED;
                userHasApproveRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_APPROVE right and requisition is in approval',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.IN_APPROVAL;
                userHasApproveRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_DELETE and REQUISITION_CREATE rights and' +
            ' requisition is initiated', function() {
            sourceRequisition.status = REQUISITION_STATUS.INITIATED;
            userHasDeleteRight = true;
            userHasCreateRight = true;

            requisition = new Requisition(sourceRequisition);

            expect(requisition.$isEditable).toBe(true);
        });

        it('should set isEditable to true if user has REQUISITION_DELETE and REQUISITION_CREATE rights and' +
            ' requisition is rejected', function() {
            sourceRequisition.status = REQUISITION_STATUS.REJECTED;
            userHasDeleteRight = true;
            userHasCreateRight = true;

            requisition = new Requisition(sourceRequisition);

            expect(requisition.$isEditable).toBe(true);
        });

        it('should set isEditable to true if user has REQUISITION_DELETE and REQUISITION_AUTHORIZE rights and' +
            'requisition is submitted', function() {
            sourceRequisition.status = REQUISITION_STATUS.SUBMITTED;
            userHasDeleteRight = true;
            userHasAuthorizeRight = true;

            requisition = new Requisition(sourceRequisition);

            expect(requisition.$isEditable).toBe(true);
        });

        it('should set isEditable to true if user has REQUISITION_AUTHORIZE right and requisition is initiated',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.INITIATED;
                userHasAuthorizeRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_AUTHORIZE right and requisition is rejected',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.REJECTED;
                userHasAuthorizeRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to true if user has REQUISITION_AUTHORIZE right and requisition is submitted',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.SUBMITTED;
                userHasAuthorizeRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(true);
            });

        it('should set isEditable to false if user does not have REQUISITION_CREATE right and requisition is initiated',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.INITIATED;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(false);
            });

        it('should set isEditable to false if user has REQUISITION_CREATE right and requisition is submitted',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.SUBMITTED;
                userHasCreateRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(false);
            });

        it('should set isEditable to false if user has REQUISITION_AUTHORIZE right and requisition is authorized',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.AUTHORIZED;
                userHasAuthorizeRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(false);
            });

        it('should set isEditable to false if user has REQUISITION_APPROVE right and requisition is approved',
            function() {
                sourceRequisition.status = REQUISITION_STATUS.APPROVED;
                userHasApproveRight = true;

                requisition = new Requisition(sourceRequisition);

                expect(requisition.$isEditable).toBe(false);
            });

        it('should set isEditable to false if requisition is released', function() {
            sourceRequisition.status = REQUISITION_STATUS.RELEASED;
            userHasAuthorizeRight = true;
            userHasCreateRight = true;
            userHasApproveRight = true;
            userHasDeleteRight = true;

            requisition = new Requisition(sourceRequisition);

            expect(requisition.$isEditable).toBe(false);
        });

        it('should set idempotency key if it is not set', function() {
            sourceRequisition.status = REQUISITION_STATUS.INITIATED;
            userHasCreateRight = true;

            requisition = new Requisition(sourceRequisition);

            expect(requisition.idempotencyKey).toBe(key);
        });

        it('should not set idempotency key if it is set', function() {
            sourceRequisition.status = REQUISITION_STATUS.INITIATED;
            userHasCreateRight = true;
            sourceRequisition.idempotencyKey = 'some-key';

            requisition = new Requisition(sourceRequisition);

            expect(requisition.idempotencyKey).toBe('some-key');
        });
    });

    describe('skipAllFullSupplyLineItems', function() {

        beforeEach(function() {
            var builder = new RequisitionDataBuilder(),
                program = builder.program;

            requisition = builder.withRequistionLineItems([
                new RequisitionLineItemDataBuilder()
                    .asSkipped()
                    .fullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .asSkipped()
                    .nonFullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .nonFullSupplyForProgram(program)
                    .buildJson()
            ])
                .build();
        });

        it('should skip all full supply line items', function() {
            requisition.skipAllFullSupplyLineItems();

            expect(requisition.requisitionLineItems[0].skipped).toBe(true);
            expect(requisition.requisitionLineItems[1].skipped).toBe(true);
        });

        it('should not touch non full supply line items', function() {
            requisition.skipAllFullSupplyLineItems();

            expect(requisition.requisitionLineItems[2].skipped).toBe(true);
            expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        });

        it('should respect line items ability to skip', function() {
            spyOn(requisition.requisitionLineItems[1], 'canBeSkipped').andReturn(false);

            requisition.skipAllFullSupplyLineItems();

            expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        });

    });

    describe('unskipAllFullSupplyLineItems', function() {

        beforeEach(function() {
            var builder = new RequisitionDataBuilder(),
                program = builder.program;

            requisition = builder.withRequistionLineItems([
                new RequisitionLineItemDataBuilder()
                    .asSkipped()
                    .fullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .fullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .asSkipped()
                    .nonFullSupplyForProgram(program)
                    .buildJson(),
                new RequisitionLineItemDataBuilder()
                    .nonFullSupplyForProgram(program)
                    .buildJson()
            ])
                .build();
        });

        it('should skip all full supply line items', function() {
            requisition.unskipAllFullSupplyLineItems();

            expect(requisition.requisitionLineItems[0].skipped).toBe(false);
            expect(requisition.requisitionLineItems[1].skipped).toBe(false);
        });

        it('should not touch non full supply line items', function() {
            requisition.unskipAllFullSupplyLineItems();

            expect(requisition.requisitionLineItems[2].skipped).toBe(true);
            expect(requisition.requisitionLineItems[3].skipped).toBe(false);
        });

    });

    describe('addLineItem', function() {

        var requisition, orderable;

        beforeEach(function() {
            orderable = new OrderableDataBuilder().buildJson();
        });

        it('should throw exception if status is AUTHORIZED', function() {
            requisition = new RequisitionDataBuilder().buildAuthorized();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is IN_APPROVAL', function() {
            requisition = new RequisitionDataBuilder().buildInApproval();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is APPROVED', function() {
            requisition = new RequisitionDataBuilder().buildApproved();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is SKIPPED', function() {
            requisition = new RequisitionDataBuilder().buildSkipped();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is RELEASED', function() {
            requisition = new RequisitionDataBuilder().buildReleased();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if line item for the given orderable already exist', function() {
            requisition = new RequisitionDataBuilder().buildRejected();

            var lineItemOrderable = requisition.requisitionLineItems[0].orderable;

            expect(function() {
                requisition.addLineItem(lineItemOrderable, 10, 'explanation');
            }).toThrow('Line item for the given orderable already exist');
        });

        it('should throw exception if trying to add product that is not available for the requisition', function() {
            requisition = new RequisitionDataBuilder().buildSubmitted();

            orderable = new OrderableDataBuilder()
                .withPrograms(requisition.availableFullSupplyProducts[0].programs)
                .buildJson();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('The given product is not available for this requisition');
        });

        it('should throw exception if orderable is not part of the requisition program', function() {
            requisition = new RequisitionDataBuilder().build();

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('The given product is not available for this requisition');
        });

        it('should throw exception if trying to add full supply product to regular requisition', function() {
            requisition = new RequisitionDataBuilder().build();

            orderable = requisition.availableFullSupplyProducts[0];

            expect(function() {
                requisition.addLineItem(orderable, 10, 'explanation');
            }).toThrow('Can not add full supply line items to regular requisition');
        });

        it('should add new available full supply line item to emergency requisition', function() {
            requisition = new RequisitionDataBuilder().buildEmergency();

            var orderable = requisition.availableFullSupplyProducts[0];

            requisition.addLineItem(orderable, 16, 'explanation');

            expect(requisition.requisitionLineItems.length).toBe(3);
            expect(requisition.requisitionLineItems[2].orderable).toEqual(orderable);
            expect(requisition.requisitionLineItems[2].requestedQuantity).toEqual(16);
            expect(requisition.requisitionLineItems[2].requestedQuantityExplanation)
                .toEqual('explanation');
        });

        it('should add new available non full supply line item', function() {
            requisition = new RequisitionDataBuilder().build();

            var orderable = requisition.availableNonFullSupplyProducts[0];

            requisition.addLineItem(orderable, 16, 'explanation');

            expect(requisition.requisitionLineItems.length).toBe(3);
            expect(requisition.requisitionLineItems[2].orderable).toEqual(orderable);
            expect(requisition.requisitionLineItems[2].requestedQuantity).toEqual(16);
            expect(requisition.requisitionLineItems[2].requestedQuantityExplanation)
                .toEqual('explanation');
        });

        it('should add instance of the LineItem class', function() {
            requisition = new RequisitionDataBuilder().buildSubmitted();

            var orderable = requisition.availableNonFullSupplyProducts[0];

            requisition.addLineItem(orderable, 16, 'explanation');

            expect(requisition.requisitionLineItems[2] instanceof LineItem).toBe(true);
        });

        it('should set correct pricePerPack based on program', function() {
            requisition = new RequisitionDataBuilder().buildRejected();

            var orderable = requisition.availableNonFullSupplyProducts[0];

            requisition.addLineItem(orderable, 16, 'explanation');

            expect(requisition.requisitionLineItems[2].pricePerPack)
                .toBe(orderable.programs[1].pricePerPack);
        });

    });

    describe('deleteLineItem', function() {

        var requisition;

        it('should throw exception if status is AUTHORIZED', function() {
            requisition = new RequisitionDataBuilder().buildAuthorized();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[1]);
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is IN_APPROVAL', function() {
            requisition = new RequisitionDataBuilder().buildInApproval();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[1]);
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is APPROVED', function() {
            requisition = new RequisitionDataBuilder().buildApproved();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[1]);
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is SKIPPED', function() {
            requisition = new RequisitionDataBuilder().buildSkipped();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[1]);
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if status is RELEASED', function() {
            requisition = new RequisitionDataBuilder().buildReleased();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[1]);
            }).toThrow('Can not add or remove line items past SUBMITTED status');
        });

        it('should throw exception if trying to remove non existent line item', function() {
            requisition = new RequisitionDataBuilder().build();

            var otherRequisition = new RequisitionDataBuilder().build();

            expect(function() {
                requisition.deleteLineItem(otherRequisition.requisitionLineItems[0]);
            }).toThrow('The given line item is not part of this requisition');
        });

        it('should throw exception if trying to remove full supply line item', function() {
            requisition = new RequisitionDataBuilder().buildRejected();

            expect(function() {
                requisition.deleteLineItem(requisition.requisitionLineItems[0]);
            }).toThrow('Can not delete full supply line items');
        });

        it('should remove valid line item', function() {
            requisition = new RequisitionDataBuilder().buildRejected();

            requisition.deleteLineItem(requisition.requisitionLineItems[1]);

            expect(requisition.requisitionLineItems.length).toBe(1);
        });

    });

    function nonFullSupplyColumns() {
        return [
            column('Three'),
            column('Four')
        ];
    }

    function fullSupplyColumns() {
        return [
            column('One'),
            column('Two')
        ];
    }

    function column(suffix) {
        return {
            name: 'Column' + suffix
        };
    }

});
