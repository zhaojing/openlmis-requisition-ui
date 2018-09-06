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

describe('requisitionViewFactory', function() {

    var requisitionViewFactory, $q, permissionService, UserDataBuilder, user, requisition;

    beforeEach(function() {
        module('requisition-view');

        inject(function($injector) {
            requisitionViewFactory = $injector.get('requisitionViewFactory');

            $q = $injector.get('$q');

            permissionService = $injector.get('permissionService');
            UserDataBuilder = $injector.get('UserDataBuilder');
            spyOn(permissionService, 'hasPermission').andReturn($q.resolve(true));
        });

        user = new UserDataBuilder()
            .withSupervisionRoleAssignment('1', '1', '2')
            .build();

        requisition = jasmine.createSpyObj('requisition', ['$isInitiated', '$isRejected', '$isSubmitted', '$isAuthorized', '$isInApproval', '$isSkipped', '$isApproved']);

        requisition.program = {
            id: '2'
        };

        requisition.facility = {
            id: '3',
        };

        requisition.emergency = false;
        requisition.supervisoryNode = '1';

        requisition.$isInitiated.andReturn(false);
        requisition.$isRejected.andReturn(false);
        requisition.$isSubmitted.andReturn(false);
        requisition.$isAuthorized.andReturn(false);
        requisition.$isInApproval.andReturn(false);
        requisition.$isSkipped.andReturn(false);
        requisition.$isApproved.andReturn(false);
    });

    describe('canSubmit', function() {

        it('should be true if requisition is initiated and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isInitiated.andReturn(true);

            requisitionViewFactory.canSubmit(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is rejected and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isRejected.andReturn(true);

            requisitionViewFactory.canSubmit(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is not initiated or rejected', function() {
            requisition.$isSubmitted.andReturn(true);

            requisitionViewFactory.canSubmit(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to create (initiate/submit) this requisition', function() {
            permissionService.hasPermission.andReturn($q.resolve(false));

            requisitionViewFactory.canSubmit(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

    });

    describe('canAuthorize', function() {

        it('should be true if requisition is submitted and user has right to authorize this requisition', function() {
            requisition.$isSubmitted.andReturn(true);

            requisitionViewFactory.canAuthorize(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is not submitted', function() {
            requisition.$isInitiated.andReturn(true);

            requisitionViewFactory.canAuthorize(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to authorize this requisition', function() {
            permissionService.hasPermission.andReturn($q.resolve(false));

            requisitionViewFactory.canAuthorize(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

    });

    describe('canApproveAndReject', function() {

        it('should be true if requisition is authorized and user has right to approve this requisition', function() {
            requisition.$isAuthorized.andReturn(true);

            requisitionViewFactory.canApproveAndReject(user, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is in approval and user has right to approve this requisition and has right to supervisory node', function() {
            requisition.$isInApproval.andReturn(true);

            requisitionViewFactory.canApproveAndReject(user, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is not authorized or in approval', function() {
            requisition.$isInitiated.andReturn(true);

            requisitionViewFactory.canApproveAndReject(user, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to approve this requisition', function() {
            permissionService.hasPermission.andReturn($q.resolve(false));

            requisitionViewFactory.canApproveAndReject(user, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to supervisory node in the requisition', function() {
            requisition.$isInApproval.andReturn(true);
            requisition.supervisoryNode = '2';

            requisitionViewFactory.canApproveAndReject(user, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

    });

    describe('canDelete', function() {

        it('should be true if requisition is initiated and user has right to create (initiate/submit) and delete this requisition', function() {
            requisition.$isInitiated.andReturn(true);

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is rejected and user has right to create (initiate/submit) and delete this requisition', function() {
            requisition.$isRejected.andReturn(true);

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is skipped and user has right to create (initiate/submit) and delete this requisition', function() {
            requisition.$isSkipped.andReturn(true);

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is submitted and user has right to authorize and delete this requisition', function() {
            requisition.$isSubmitted.andReturn(true);

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is initiated and user does not have right to create (initiate/submit) this requisition', function() {
            requisition.$isInitiated.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_CREATE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is submitted and user does not have right to authorize this requisition', function() {
            requisition.$isSubmitted.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_AUTHORIZE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to delete this requisition', function() {
            requisition.$isInitiated.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_DELETE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is not initiated, rejected, skipped or submitted', function() {
            requisition.$isApproved.andReturn(true);

            requisitionViewFactory.canDelete(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

    });

    describe('canSkip', function() {

        it('should be true if requisition is initiated, skippable periods are configured, requisition is not emergency, and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isInitiated.andReturn(true);
            requisition.program.periodsSkippable = true;
            requisition.emergency = false;

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is rejected, skippable periods are configured, requisition is not emergency, and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isRejected.andReturn(true);
            requisition.program.periodsSkippable = true;
            requisition.emergency = false;

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is not initiated or rejected', function() {
            requisition.$isSubmitted.andReturn(true);

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if skippable periods are not configured', function() {
            requisition.$isInitiated.andReturn(true);
            requisition.program.periodsSkippable = false;

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is emergency', function() {
            requisition.$isInitiated.andReturn(true);
            requisition.program.periodsSkippable = true;
            requisition.emergency = true;

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if user does not have right to create (initiate/submit) this requisition', function() {
            permissionService.hasPermission.andReturn($q.resolve(false));

            requisitionViewFactory.canSkip(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

    });

    describe('canSync', function() {

        it('should be true if requisition is initiated and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isInitiated.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_CREATE') {
                    return $q.resolve(true);
                } else {
                    return $q.resolve(false);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is rejected and user has right to create (initiate/submit) this requisition', function() {
            requisition.$isRejected.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_CREATE') {
                    return $q.resolve(true);
                } else {
                    return $q.resolve(false);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is submitted and user has right to authorize this requisition', function() {
            requisition.$isSubmitted.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_AUTHORIZE') {
                    return $q.resolve(true);
                } else {
                    return $q.resolve(false);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is authorized and user has right to approve this requisition', function() {
            requisition.$isAuthorized.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_APPROVE') {
                    return $q.resolve(true);
                } else {
                    return $q.resolve(false);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be true if requisition is in approval and user has right to approve this requisition', function() {
            requisition.$isInApproval.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_APPROVE') {
                    return $q.resolve(true);
                } else {
                    return $q.resolve(false);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(true);
            });
        });

        it('should be false if requisition is initiated and user does not have right to create (initiate/submit) this requisition', function() {
            requisition.$isInitiated.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_CREATE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is submitted and user does not have right to authorize this requisition', function() {
            requisition.$isSubmitted.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_AUTHORIZE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is authorized and user does not have right to approve this requisition', function() {
            requisition.$isAuthorized.andReturn(true);
            permissionService.hasPermission.andCallFake(function(userId, params) {
                if (params.rightName === 'REQUISITION_APPROVE') {
                    return $q.resolve(false);
                } else {
                    return $q.resolve(true);
                }
            });

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

        it('should be false if requisition is not initiated, rejected, submitted, authorized or in approval', function() {
            requisition.$isApproved.andReturn(true);

            requisitionViewFactory.canSync(user.id, requisition).then(function(response) {
                expect(response).toBe(false);
            });
        });

    });

});