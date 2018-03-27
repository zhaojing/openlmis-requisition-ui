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

describe('requisitionInitiateFactory', function() {

    var requisitionInitiateFactory, $q, permissionService, $rootScope, authorizationService,
        REQUISITION_RIGHTS, FacilityDataBuilder, PermissionDataBuilder, ProgramDataBuilder,
        facility, program, permissions;

    beforeEach(function() {
        module('requisition-initiate');

        inject(function($injector) {
            requisitionInitiateFactory = $injector.get('requisitionInitiateFactory');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            permissionService = $injector.get('permissionService');
            authorizationService = $injector.get('authorizationService');
            REQUISITION_RIGHTS = $injector.get('REQUISITION_RIGHTS');

            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            PermissionDataBuilder = $injector.get('PermissionDataBuilder');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        facility = new FacilityDataBuilder().build();
        program = new ProgramDataBuilder().build();

        permissions = [
            new PermissionDataBuilder()
                .withRight(REQUISITION_RIGHTS.REQUISITION_CREATE)
                .withFacilityId(facility.id)
                .withProgramId(program.id).build(),
            new PermissionDataBuilder()
                .withRight(REQUISITION_RIGHTS.REQUISITION_DELETE)
                .withFacilityId(facility.id)
                .withProgramId(program.id).build(),
            new PermissionDataBuilder()
                .withRight(REQUISITION_RIGHTS.REQUISITION_CREATE)
                .withFacilityId(facility.id)
                .withProgramId('invalid-id').build()
        ];
    });

    describe('canInitiate', function() {
        beforeEach(function() {
            spyOn(authorizationService, 'getUser').andReturn({
                user_id: 'user-id'
            });
        });

        it('should return true if permission was found', function() {
            spyOn(permissionService, 'load').andReturn($q.resolve(permissions));
            var result;

            requisitionInitiateFactory.canInitiate(program.id, facility.id).then(function() {
                result = true;
            });
            $rootScope.$apply();

            expect(result).toBe(true);
        });

        it('should return false if rights in permission string are different', function() {
            spyOn(permissionService, 'load').andReturn($q.resolve([permissions[1]]));
            var result;

            requisitionInitiateFactory.canInitiate(program.id, facility.id).catch(function() {
                result = false;
            });
            $rootScope.$apply();

            expect(result).toBe(false);
        });

        it('should return false if permission was not found', function() {
            spyOn(permissionService, 'load').andReturn($q.resolve([permissions[2]]));
            var result;

            requisitionInitiateFactory.canInitiate(program.id, facility.id).catch(function() {
                result = false
            });
            $rootScope.$apply();

            expect(result).toBe(false);
        });
    });

});