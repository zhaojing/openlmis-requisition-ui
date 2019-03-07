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
     * @name requisition.requisitionCacheService
     *
     * @description
     * Stores requisitions locally, deals with returning correct list of requisitions for the current user.
     */
    angular
        .module('requisition')
        .service('requisitionCacheService', requisitionCacheService);

    requisitionCacheService.$inject = ['localStorageFactory', '$q', '$filter', 'paginationFactory'];

    function requisitionCacheService(localStorageFactory, $q, $filter, paginationFactory) {
        var offlineRequisitions = localStorageFactory('requisitions'),
            offlineBatchRequisitions = localStorageFactory('batchApproveRequisitions');

        this.cacheRequisition = cacheRequisition;
        this.cacheBatchRequisition = cacheBatchRequisition;
        this.search = search;
        this.removeById = removeById;
        this.getRequisition = getRequisition;
        this.getBatchRequisition = getBatchRequisition;

        function cacheRequisition(requisition) {
            offlineRequisitions.put(requisition);
        }

        function cacheBatchRequisition(requisition) {
            offlineBatchRequisitions.put(requisition);
        }

        function search(searchParams) {
            var requisitions = offlineRequisitions.search(searchParams, 'requisitionSearch'),
                batchRequisitions = searchParams.showBatchRequisitions ?
                    offlineBatchRequisitions.search(searchParams.program, 'requisitionSearch') : [],
                page = searchParams.page,
                size = searchParams.size,
                sort = searchParams.sort;

            angular.forEach(batchRequisitions, function(batchRequisition) {
                if ($filter('filter')(requisitions, {
                    id: batchRequisition.id
                }).length === 0) {
                    requisitions.push(batchRequisition);
                }
            });

            var items = paginationFactory.getPage(requisitions, page, size);

            return $q.resolve({
                content: items,
                number: page,
                totalElements: requisitions.length,
                size: size,
                sort: sort
            });
        }

        function removeById(requisitionId) {
            offlineRequisitions.removeBy('id', requisitionId);
        }

        function getRequisition(id) {
            return offlineRequisitions.getBy('id', id);
        }

        function getBatchRequisition(id) {
            return offlineBatchRequisitions.getBy('id', id);
        }
    }
})();
