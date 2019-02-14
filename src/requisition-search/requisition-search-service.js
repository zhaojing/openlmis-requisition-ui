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
     * @name requisition-search.RequisitionSearchService
     *
     * @description
     * Prepares data for the Requisition Search view.
     */
    angular
        .module('requisition-search')
        .factory('RequisitionSearchService', RequisitionSearchService);

    RequisitionSearchService.$inject = [
        'facilityFactory', 'authorizationService', 'currentUserService', 'SupervisoryNodeResource', 'RoleResource',
        'RequisitionGroupResource', '$q', 'OpenlmisArrayDecorator', 'REQUISITION_RIGHTS'
    ];

    function RequisitionSearchService(facilityFactory, authorizationService, currentUserService,
                                      SupervisoryNodeResource, RoleResource, RequisitionGroupResource, $q,
                                      OpenlmisArrayDecorator, REQUISITION_RIGHTS) {

        RequisitionSearchService.prototype.getFacilities = getFacilities;

        return RequisitionSearchService;

        function RequisitionSearchService() {}

        /**
         * @ngdoc method
         * @methodOf requisition-search.RequisitionSearchService
         * @name getFacilities
         *
         * @description
         * Prepares the list of facilities to be displayed on the Requisition Search view.
         * 
         * @return {Array}  the list of facilities based on both permission strings and role assignments for partner
         *                  nodes
         */
        function getFacilities() {
            var user = authorizationService.getUser();

            return $q
                .all([
                    facilityFactory.getAllUserFacilities(user.user_id),
                    getFacilitiesBasedOnPartnerNodes()
                ])
                .then(mergeFacilityLists)
                .then(getUniqueSortedByName);
        }

        function getFacilitiesBasedOnPartnerNodes() {
            return $q
                .all([
                    fetchSupervisoryNodes(),
                    new RequisitionGroupResource().query()
                ])
                .then(fetchFacilitiesForRequsitionGroupsRelatedWithSupervisoryNodes)
                .then(mergeFacilityLists);
        }

        function fetchSupervisoryNodes() {
            return $q
                .all([
                    getRoleIdsForRolesWithRequisitionViewRight(),
                    currentUserService.getUserInfo()
                ])
                .then(getSupervisoryNodeIdsForMatchingRoleAssignments)
                .then(fetchSupervisoryNodesByIds)
                .then(fetchSupervisoryNodesForPartners);
        }

        function getRoleIdsForRolesWithRequisitionViewRight() {
            return new RoleResource()
                .query()
                .then(function(roles) {
                    return roles
                        .filter(hasRequisitionViewRight)
                        .map(toProperty('id'));
                });
        }

        function hasRequisitionViewRight(role) {
            return role.rights.filter(function(right) {
                return right.name === REQUISITION_RIGHTS.REQUISITION_VIEW;
            }).length > 0;
        }

        function getSupervisoryNodeIdsForMatchingRoleAssignments(responses) {
            var roleIds = responses[0],
                user = responses[1];

            return user.roleAssignments
                .filter(outByUndefinedProperty('supervisoryNodeId'))
                .filter(filterOutNotInBy(roleIds, 'roleId'))
                .map(toProperty('supervisoryNodeId'));
        }

        function fetchSupervisoryNodesByIds(supervisoryNodeIds) {
            return new SupervisoryNodeResource()
                .query({
                    id: supervisoryNodeIds
                });
        }

        function fetchSupervisoryNodesForPartners(nodesPage) {
            return new SupervisoryNodeResource().query({
                id: getPartnerOfIdsFromNodes(nodesPage.content)
            });
        }

        function getPartnerOfIdsFromNodes(nodes) {
            return nodes
                .filter(outByUndefinedProperty('partnerNodeOf'))
                .map(toProperty('partnerNodeOf'))
                .map(toProperty('id'));
        }

        function fetchFacilitiesForRequsitionGroupsRelatedWithSupervisoryNodes(responses) {
            var nodes = responses[0].content,
                groups = responses[1];

            var requisitionGroupIds = getRequisitionGroupIdsFromNodes(nodes);

            return groups
                .filter(filterOutNotInBy(requisitionGroupIds, 'id'))
                .map(toProperty('memberFacilities'));
        }

        function filterOutNotInBy(array, propertyName) {
            return function(item) {
                return array.indexOf(item[propertyName]) > -1;
            };
        }

        function getRequisitionGroupIdsFromNodes(nodes) {
            return nodes
                .filter(outByUndefinedProperty('requisitionGroup'))
                .map(toProperty('requisitionGroup'))
                .map(toProperty('id'));
        }

        function mergeFacilityLists(facilityLists) {
            var facilities = [];

            facilityLists.forEach(function(facilityList) {
                facilityList.forEach(function(facility) {
                    facilities.push(facility);
                });
            });

            return facilities;
        }

        function getUniqueSortedByName(facilities) {
            var decoratedFacilityList = new OpenlmisArrayDecorator(facilities);

            decoratedFacilityList.sortBy('name');

            return decoratedFacilityList.getAllWithUniqueIds();
        }

        function outByUndefinedProperty(propertyName) {
            return function(item) {
                return item[propertyName];
            };
        }

        function toProperty(propertyName) {
            return function(item) {
                return item[propertyName];
            };
        }

    }

})();