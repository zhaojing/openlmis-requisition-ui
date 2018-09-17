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

describe('openlmis.requisitions.approvalList', function() {

    var $state, $q, $rootScope, $filter, REQUISITION_RIGHTS,
        BATCH_APPROVE_SCREEN_FEATURE_FLAG, requisitionService, paginationService,
        authorizationService, programService, alertService, featureFlagService,
        state, requisitions, params, requisitionsPage, user, programs,
        UserDataBuilder, ProgramDataBuilder;

    beforeEach(function() {
        module('requisition-approval');
        module('openlmis-main-state');

        inject(function($injector) {
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            $filter = $injector.get('$filter');

            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            BATCH_APPROVE_SCREEN_FEATURE_FLAG = $injector.get('BATCH_APPROVE_SCREEN_FEATURE_FLAG');

            requisitionService = $injector.get('requisitionService');
            paginationService = $injector.get('paginationService');
            authorizationService = $injector.get('authorizationService');
            programService = $injector.get('programService');
            alertService = $injector.get('alertService');
            featureFlagService = $injector.get('featureFlagService');

            UserDataBuilder = $injector.get('UserDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        params = {
            page: 0,
            size: 10,
            sort: [
                'emergency,desc',
                'authorizedDate,desc'
            ]
        };

        requisitions = [
            {
                id: '1'
            }, {
                id: '2'
            }
        ];

        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        user = new UserDataBuilder().build();
        //eslint-disable-next-line camelcase
        user.user_id = user.id;

        requisitionsPage = {
            content: requisitions,
            last: true,
            totalElements: 2,
            totalPages: 1,
            sort: ['emergency,desc', 'authorizedDate,desc'],
            first: true,
            numberOfElements: 2,
            size: 10,
            number: 0
        };

        spyOn(requisitionService, 'forApproval').andReturn($q.when(requisitionsPage));

        state = $state.get('openlmis.requisitions.approvalList');
    });

    it('should fetch a list of requisitions', function() {
        var result;

        spyOn(paginationService, 'registerUrl').andCallFake(function(givenParams, method) {
            if (givenParams === params && angular.isFunction(method)) {
                return method(givenParams);
            }
        });

        state.resolve.requisitions(paginationService, requisitionService, params).then(function(requisitionList) {
            result = requisitionList;
        });

        $rootScope.$apply();

        expect(result).toEqual(requisitionsPage);
        expect(result.content).toEqual(requisitions);
        expect(requisitionService.forApproval).toHaveBeenCalledWith(params);
        expect(paginationService.registerUrl).toHaveBeenCalled();
    });

    it('should fetch a user', function() {
        var result;

        spyOn(authorizationService, 'getUser').andReturn($q.when(user));

        state.resolve.user(authorizationService).then(function(user) {
            result = user;
        });

        $rootScope.$apply();

        expect(result).toEqual(user);
        expect(authorizationService.getUser).toHaveBeenCalled();
    });

    it('should fetch a list of programs', function() {
        var result;

        spyOn(programService, 'getUserPrograms').andCallFake(function(givenParams) {
            if (givenParams === user.id) {
                return $q.when(programs);
            }
        });

        state.resolve.programs(programService, user, alertService, $q).then(function(programList) {
            result = programList;
        });

        $rootScope.$apply();

        expect(result).toEqual(programs);
        expect(programService.getUserPrograms).toHaveBeenCalledWith(user.user_id);
    });

    it('should fetch a selected program', function() {
        params.program = programs[0].id;
        var result = state.resolve.selectedProgram(params, $filter, programs);

        expect(result).toEqual(programs[0]);
    });

    it('should not fetch a selected program if user does not select any program', function() {
        delete params.program;

        var result = state.resolve.selectedProgram(params, $filter, programs);

        expect(result).toBe(undefined);
    });

    it('should check if batch approve screen flag is active', function() {
        spyOn(featureFlagService, 'get').andCallFake(function(givenParams) {
            if (givenParams === BATCH_APPROVE_SCREEN_FEATURE_FLAG) {
                return false;
            }
        });

        var result = state.resolve.isBatchApproveScreenActive(BATCH_APPROVE_SCREEN_FEATURE_FLAG, featureFlagService);

        expect(result).toEqual(false);
        expect(featureFlagService.get).toHaveBeenCalledWith(BATCH_APPROVE_SCREEN_FEATURE_FLAG);
    });

    it('should require REQUISITION_APPROVE right to enter', function() {
        expect(state.accessRights).toEqual([REQUISITION_RIGHTS.REQUISITION_APPROVE]);
    });

});
