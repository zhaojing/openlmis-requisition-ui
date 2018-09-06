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

describe('openlmis.requisitions.requisition state', function() {

    var $state, $stateParams, $rootScope, $q,
        currentUserService, requisitionService, requisitionViewFactory,
        UserDataBuilder, RequisitionDataBuilder,
        user, state, requisition;

    beforeEach(function() {
        loadModules();
        injectServices();
        prepareTestData();
        prepareSpies();

        state = $state.get('openlmis.requisitions.requisition');
    });

    it('should fetch user', function() {
        var result;

        state.resolve.user(currentUserService).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(user);
    });

    it('should fetch requisition', function() {
        var result;

        state.resolve.requisition($stateParams, requisitionService).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(requisition);
    });

    it('should resolve if user has right to submit', function() {
        var result;

        state.resolve.canSubmit(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    it('should resolve if user has right to authorize', function() {
        var result;

        state.resolve.canAuthorize(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    it('should resolve if user has right to approve or reject', function() {
        var result;

        state.resolve.canApproveAndReject(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    it('should resolve if user has right to delete', function() {
        var result;

        state.resolve.canDelete(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    it('should resolve if user has right to skip', function() {
        var result;

        state.resolve.canSkip(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    it('should resolve if user has right to sync', function() {
        var result;

        state.resolve.canSync(requisitionViewFactory, user, requisition).then(function(response) {
            result = response;
        })

        $rootScope.$apply();
        expect(result).toBe(true);
    });

    function loadModules() {
        module('openlmis-main-state');
        module('requisition');
        module('requisition-view');
    }

    function injectServices() {
        inject(function($injector) {
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');

            currentUserService = $injector.get('currentUserService');
            requisitionViewFactory = $injector.get('requisitionViewFactory');
            requisitionService = $injector.get('requisitionService');

            UserDataBuilder = $injector.get('UserDataBuilder');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');
        });
    }

    function prepareTestData() {
        user = new UserDataBuilder().build();
        $stateParams = {};
        requisition = new RequisitionDataBuilder().build();
    }

    function prepareSpies() {
        spyOn(currentUserService, 'getUserInfo').andReturn($q.resolve(user));

        spyOn(requisitionService, 'get').andReturn($q.resolve(requisition));

        spyOn(requisitionViewFactory, 'canSubmit').andReturn($q.resolve(true));
        spyOn(requisitionViewFactory, 'canAuthorize').andReturn($q.resolve(true));
        spyOn(requisitionViewFactory, 'canApproveAndReject').andReturn($q.resolve(true));
        spyOn(requisitionViewFactory, 'canDelete').andReturn($q.resolve(true));
        spyOn(requisitionViewFactory, 'canSkip').andReturn($q.resolve(true));
        spyOn(requisitionViewFactory, 'canSync').andReturn($q.resolve(true));
    }

});