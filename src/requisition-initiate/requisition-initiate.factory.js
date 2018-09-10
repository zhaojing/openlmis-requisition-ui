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

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-initiate.requisitionInitiateFactory
     *
     * @description
     * Determines what the user is able to view.
     */
    angular
        .module('requisition-initiate')
        .factory('requisitionInitiateFactory', factory);

    factory.$inject = ['$q', 'permissionService', 'REQUISITION_RIGHTS', 'authorizationService'];

    function factory($q, permissionService, REQUISITION_RIGHTS, authorizationService) {

        var factory = {
            canInitiate: canInitiate
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-initiate.requisitionInitiateFactory
         * @name canInitiate
         *
         * @description
         * Returns true if user can initiate requisition for the provided facility and program.
         *
         * @param  {string}  programId  UUID of the program to search permissions for
         * @param  {string}  facilityId UUID of the facility to search permissions for
         * @return {Promise} supervised facilities based on given rights
         */
        function canInitiate(programId, facilityId) {
            var user = authorizationService.getUser();

            return permissionService.hasPermission(user.user_id, {
                right: REQUISITION_RIGHTS.REQUISITION_CREATE,
                programId: programId,
                facilityId: facilityId
            })
                .then(function() {
                    return $q.resolve(true);
                })
                .catch(function() {
                    return $q.resolve(false);
                });
        }
    }

})();
