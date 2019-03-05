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
        module('openlmis-main-state');
        module('requisition-view');

        var UserDataBuilder, RequisitionDataBuilder;
        inject(function($injector) {
            UserDataBuilder = $injector.get('UserDataBuilder');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');

            this.$state = $injector.get('$state');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.currentUserService = $injector.get('currentUserService');
            this.requisitionViewFactory = $injector.get('requisitionViewFactory');
            this.requisitionService = $injector.get('requisitionService');
            this.$location = $injector.get('$location');
        });

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;

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

        this.state = this.$state.get('openlmis.requisitions.requisition');
    });

    it('should fetch user', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('user')).toEqual(this.user);
    });

    it('should fetch requisition', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('requisition')).toEqual(this.requisition);
    });

    it('should resolve if user has right to submit', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canSubmit')).toEqual(true);
    });

    it('should resolve if user has right to authorize', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canAuthorize')).toEqual(true);
    });

    it('should resolve if user has right to approve or reject', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canApproveAndReject')).toEqual(true);
    });

    it('should resolve if user has right to delete', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canDelete')).toEqual(true);
    });

    it('should resolve if user has right to skip', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canSkip')).toEqual(true);
    });

    it('should resolve if user has right to sync', function() {
        this.goToUrl('/requisition/requisition-id');

        expect(this.getResolvedValue('canSync')).toEqual(true);
    });

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

});