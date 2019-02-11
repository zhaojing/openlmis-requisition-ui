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

describe('openlmis.requisitions.search', function() {

    beforeEach(function() {
        module('openlmis-navigation');
        module('requisition-search');

        var AuthUserDataBuilder, FacilityDataBuilder, RequisitionDataBuilder, PageDataBuilder;
        inject(function($injector) {
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.requisitionService = $injector.get('requisitionService');
            this.authorizationService = $injector.get('authorizationService');
            this.$location = $injector.get('$location');
            this.facilityFactory = $injector.get('facilityFactory');
            AuthUserDataBuilder = $injector.get('AuthUserDataBuilder');
            RequisitionDataBuilder = $injector.get('RequisitionDataBuilder');
            PageDataBuilder = $injector.get('PageDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
        });

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;
        this.goToThePage = goToThePage;

        this.user = new AuthUserDataBuilder().build();

        this.facilities = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];

        this.requisitions = [
            new RequisitionDataBuilder().build(),
            new RequisitionDataBuilder().build()
        ];

        this.requisitionsPage = new PageDataBuilder()
            .withContent(this.requisitions)
            .build();

        this.program = 'program-id';
        this.facility = 'facility-id';
        this.initiatedDateFrom = '2019-02-21';
        this.initiatedDateTo = '2019-05-21';
        this.page = '10';
        this.size = '0';
        this.offline = 'false';
        this.sort = 'createdDate';

        spyOn(this.authorizationService, 'getUser').andReturn(this.$q.resolve(this.user));
        spyOn(this.facilityFactory, 'getAllUserFacilities').andReturn(this.$q.resolve(this.facilities));
        spyOn(this.requisitionService, 'search').andReturn(this.$q.resolve(this.requisitionsPage));
    });

    it('should show the list of facilities', function() {
        this.goToThePage();

        expect(this.getResolvedValue('facilities')).toEqual(this.facilities);
        expect(this.facilityFactory.getAllUserFacilities).toHaveBeenCalledWith(this.user.user_id);
    });

    it('should show the list of requisitions', function() {
        this.goToThePage();

        expect(this.getResolvedValue('requisitions')).toEqual(this.requisitions);
        expect(this.requisitionService.search).toHaveBeenCalledWith(false, {
            program: this.program,
            facility: this.facility,
            initiatedDateFrom: this.initiatedDateFrom,
            initiatedDateTo: this.initiatedDateTo,
            page: this.page,
            size: this.size,
            sort: this.sort
        });
    });

    it('should show the list of offline requisitions if offline flag is set', function() {
        this.offline = 'true';

        this.goToThePage();

        expect(this.getResolvedValue('requisitions')).toEqual(this.requisitions);
        expect(this.requisitionService.search).toHaveBeenCalledWith(true, {
            program: this.program,
            facility: this.facility,
            initiatedDateFrom: this.initiatedDateFrom,
            initiatedDateTo: this.initiatedDateTo,
            page: this.page,
            size: this.size,
            sort: this.sort
        });
    });

    it('should not be accessible if fetching requisitions fails', function() {
        this.requisitionService.search.andReturn(this.$q.reject());

        this.goToThePage();

        expect(this.$state.$current.name).not.toEqual('openlmis.requisitions.search');
    });

    it('should show empty list of facilities if fetching facilities fails', function() {
        this.facilityFactory.getAllUserFacilities.andReturn(this.$q.reject());

        this.goToThePage();

        expect(this.getResolvedValue('facilities')).toEqual([]);
    });

    function goToThePage() {
        this.goToUrl(
            '/requisitions/view?program=' + this.program + '&facility=' + this.facility + '&initiatedDateFrom=' +
            this.initiatedDateFrom + '&initiatedDateTo=' + this.initiatedDateTo + '&page=' + this.page +
            '&size=' + this.size + '&offline=' + this.offline + '&sort=' + this.sort
        );
    }

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

});