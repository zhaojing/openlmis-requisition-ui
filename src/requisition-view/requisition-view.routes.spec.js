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

    beforeEach(function() {
        module('requisition-view');

        var $state, UserDataBuilder, RequisitionDataBuilder;
        inject(function($injector) {
            UserDataBuilder = $injector.get('UserDataBuilder');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');
            $state = $injector.get('$state');

            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.currentUserService = $injector.get('currentUserService');
            this.requisitionViewFactory = $injector.get('requisitionViewFactory');
            this.requisitionService = $injector.get('requisitionService');
        });

        this.user = new UserDataBuilder().build();
        this.$stateParams = {};
        this.requisition = new RequisitionDataBuilder().build();

        spyOn(this.currentUserService, 'getUserInfo').andReturn(this.$q.resolve(this.user));
        spyOn(this.requisitionService, 'get').andReturn(this.$q.resolve(this.requisition));
        spyOn(this.requisitionViewFactory, 'canSubmit').andReturn(this.$q.resolve(true));
        spyOn(this.requisitionViewFactory, 'canAuthorize').andReturn(this.$q.resolve(true));
        spyOn(this.requisitionViewFactory, 'canApproveAndReject').andReturn(this.$q.resolve(true));
        spyOn(this.requisitionViewFactory, 'canDelete').andReturn(this.$q.resolve(true));
        spyOn(this.requisitionViewFactory, 'canSkip').andReturn(this.$q.resolve(true));
        spyOn(this.requisitionViewFactory, 'canSync').andReturn(this.$q.resolve(true));

        this.state = $state.get('openlmis.requisitions.requisition');
    });

    it('should fetch this.user', function() {
        var result;

        this.state.resolve.user(this.currentUserService).then(function(response) {
            result = response;
        });

        this.$rootScope.$apply();

        expect(result).toBe(this.user);
    });

    it('should fetch this.requisition', function() {
        var result;

        this.state.resolve.requisition(this.$stateParams, this.requisitionService).then(function(response) {
            result = response;
        });

        this.$rootScope.$apply();

        expect(result).toBe(this.requisition);
    });

    it('should resolve if this.user has right to submit', function() {
        var result;

        this.state.resolve.canSubmit(this.requisitionViewFactory, this.user, this.requisition).then(function(response) {
            result = response;
        });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

    it('should resolve if this.user has right to authorize', function() {
        var result;

        this.state.resolve.canAuthorize(this.requisitionViewFactory, this.user, this.requisition)
            .then(function(response) {
                result = response;
            });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

    it('should resolve if this.user has right to approve or reject', function() {
        var result;

        this.state.resolve.canApproveAndReject(this.requisitionViewFactory, this.user, this.requisition)
            .then(function(response) {
                result = response;
            });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

    it('should resolve if this.user has right to delete', function() {
        var result;

        this.state.resolve.canDelete(this.requisitionViewFactory, this.user, this.requisition)
            .then(function(response) {
                result = response;
            });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

    it('should resolve if this.user has right to skip', function() {
        var result;

        this.state.resolve.canSkip(this.requisitionViewFactory, this.user, this.requisition).then(function(response) {
            result = response;
        });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

    it('should resolve if this.user has right to sync', function() {
        var result;

        this.state.resolve.canSync(this.requisitionViewFactory, this.user, this.requisition).then(function(response) {
            result = response;
        });

        this.$rootScope.$apply();

        expect(result).toBe(true);
    });

});