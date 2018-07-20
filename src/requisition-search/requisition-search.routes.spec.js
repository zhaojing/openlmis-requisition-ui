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

    var $state, $q, $rootScope, requisitionService, paginationService, REQUISITION_RIGHTS,
        state, requisitions, params, requisitionsPage;

    beforeEach(function() {
        module('requisition-search');
        module('openlmis-main-state');

        inject(function($injector) {
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');
            requisitionService = $injector.get('requisitionService');
            paginationService = $injector.get('paginationService');
        });

        params = {
            param: 'param',
            page: 0,
            size: 10,
            sort: "status",
            facility: "1"
        };

        requisitions = [
            {
                id: '1'
            }, {
                id: '2'
            }
        ];

        requisitionsPage = {
            content: requisitions,
            last: true,
            totalElements: 2,
            totalPages: 1,
            sort: "status",
            first: true,
            numberOfElements: 2,
            size: 10,
            number: 0
        };

        spyOn(requisitionService, 'search').andReturn($q.when(requisitionsPage));

        state = $state.get('openlmis.requisitions.search');
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
        expect(requisitionService.search).toHaveBeenCalledWith(false, params);
        expect(paginationService.registerUrl).toHaveBeenCalled();
    });

    it('should require REQUISITION_VIEW right to enter', function() {
        expect(state.accessRights).toEqual([REQUISITION_RIGHTS.REQUISITION_VIEW]);
    });

});
