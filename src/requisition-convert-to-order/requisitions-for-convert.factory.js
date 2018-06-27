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

(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name requisition-convert-to-order.requisitionsForConvertFactory
     *
     * @description
     * Responsible for caching and returning requisitions for convert. It will call the
     * requisitionService and request at least twice the amount of requested requisitions. Only the
     * requested page will be returned and the rest of the requisitions will be cached for later
     * use. The last page returned by the requisitionService will be stored in memory and it will
     * get shrunk every time we call convertToOrder method (the page will be shrunk by the amount of
     * requisitions we have converted to orders). Every time we try to get a page we don't have
     * stored the requisitionService will be called. The requisitionService will also be called when
     * the last page will show that there should be no more requisitions on the server.
     */
    angular
        .module('requisition-convert-to-order')
        .factory('requisitionsForConvertFactory', requisitionsForConvertFactory);

    requisitionsForConvertFactory.$inject = ['requisitionService', '$q'];

    function requisitionsForConvertFactory(requisitionService, $q) {
        var factory = {
            forConvert: forConvert,
            convertToOrder: convertToOrder,
            releaseWithoutOrder: releaseWithoutOrder,
            clearCache: clearCache
        };

        return factory;

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.requisitionsForConvertFactory
         * @name forConvert
         *
         * @description
         * Returns the requested page. If we have enough requisitions cached in memory, the cached
         * requisitions will be returned, if we don't we will call the server and download at least
         * twice as much requisitions and cache them.
         *
         * @param   {Object}    params  the parameters for downloading the page
         * @return  {Object}            the requested page
         */
        function forConvert(params) {
            var newParams = convertParams(params);

            var factory = this;
            if (shouldFetchFromServer(params, this.lastParams, this.lastPage)) {
                return requisitionService.forConvert(newParams)
                .then(function(page) {
                    factory.lastParams = params;
                    factory.lastPage = page;
                    return getRequestedPage(page, params, newParams);
                });
            }
            return getRequestedPage(this.lastPage, params, this.lastPage);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.requisitionsForConvertFactory
         * @name convertToOrder
         *
         * @description
         * Converts the the given list of requisitions to orders. Every requisition that is
         * converted will be removed from the cache and the stored page will be shrunk.
         *
         * @param  {Array}      requisitions    the list of arrays to be converted to order
         * @return {Promise}                    the promise resolved when the requisitions hass been
         *                                      successfully converted to order
         */
        function convertToOrder(requisitions) {
            var lastPage = this.lastPage;
            return requisitionService.convertToOrder(requisitions)
            .then(function() {
                removeConvertedRequisitions(requisitions, lastPage);
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.requisitionsForConvertFactory
         * @name releaseWithoutOrder
         *
         * @description
         * Releases the the given list of requisitions without creating orders. Every requisition that is
         * converted will be removed from the cache and the stored page will be shrunk.
         *
         * @param  {Array}      requisitions    the list of arrays to be released without order
         * @return {Promise}                    the promise resolved when the requisitions has been
         *                                      successfully released
         */
        function releaseWithoutOrder(requisitions) {
            var lastPage = this.lastPage;
            return requisitionService.releaseWithoutOrder(requisitions)
                .then(function() {
                    removeConvertedRequisitions(requisitions, lastPage);
                });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-convert-to-order.requisitionsForConvertFactory
         * @name clearCache
         *
         * @description
         * Removes all the cached requisitions from memory.
         */
        function clearCache() {
            this.lastPage = undefined;
        }

        function removeConvertedRequisitions(requisitions, lastPage) {
            if (lastPage) {
                requisitions.forEach(function(requisition) {
                    var id = requisition.requisition.id;
                    lastPage.content = lastPage.content.filter(function(requisition) {
                        return requisition.requisition.id !== id;
                    });
                    shrinkLastPage(lastPage);
                });
            }
        }

        function shrinkLastPage(lastPage) {
            if (lastPage) {
                lastPage.totalElements--;
                lastPage.numberOfElements--;
                lastPage.last = lastPage.totalElements - 1 <= calculateTo(lastPage);
                lastPage.totalPages = Math.ceil(parseInt(lastPage.totalElements) / parseInt(lastPage.size));

                if (!lastPage.totalElements) {
                    lastPage = undefined;
                }
            }
        }

        function getRequestedPage(page, params, pageable) {
            var originalFrom = calculateFrom(params),
                from = calculateFrom(pageable),
                offset = originalFrom - from,
                contentPromise,
                newPage = {
                    first: originalFrom === 0,
                    last: page.totalElements - 1 <= calculateTo(params),
                    number: parseInt(params.page),
                    size: parseInt(params.size),
                    totalPages: Math.ceil(parseInt(page.totalElements) / parseInt(params.size)),
                    totalElements: parseInt(page.totalElements),
                    content: page.content.slice(offset, offset + parseInt(params.size))

                };

            newPage.numberOfElements = newPage.content.length;

            return $q.resolve(newPage);
        }

        function shouldFetchFromServer(params, lastParams, lastPage) {
            if (!lastPage) {
                return true;
            }

            if (!lastPage.numberOfElements) {
                return true;
            }

            if (calculateFrom(lastPage) > calculateFrom(params)) {
                return true;
            }

            if (calculateTo(lastPage) < calculateTo(params) && !lastPage.last) {
                return true;
            }

            if (!angular.equals(lastParams.sort, params.sort)) {
                return true;
            }

            if (!angular.equals(lastParams.filterBy, params.filterBy)) {
                return true;
            }

            if (!angular.equals(lastParams.filterValue, params.filterValue)) {
                return true;
            }

            return false;
        }

        function convertParams(params) {
            var newParams = angular.copy(params);
            newParams.size = undefined;

            if (params.page == 0) {
                newParams.size = params.size * 2;
                return newParams;
            }

            var newSize;
            do {
                var newPage = 0;

                do {
                    var from = ((params.page * params.size) + (2 * params.size))/(newPage + 1),
                        roundedFrom = Math.ceil(from / params.size) * params.size,
                        to = (params.page * params.size) / newPage;

                    newSize = undefined;

                    if (roundedFrom <= to) {
                        newSize = roundedFrom;
                        if (!newParams.size || newParams.size > newSize) {
                            newParams.size = newSize;
                            newParams.page = newPage;
                        }
                    }
                    newPage++;
                } while (newSize);
            } while (newSize);
            return newParams;
        }

        function calculateFrom(params) {
            var size = parseInt(params.size);
            return getPage(params) * size;
        }

        function calculateTo(pageable) {
            var size = parseInt(pageable.size),
                page = getPage(pageable),
                numberOfElements = getNumberOfElements(pageable);

            return (page * size) + numberOfElements - 1;
        }

        function getPage(pageable) {
            if (pageable.page !== undefined && pageable.page !== null) {
                return parseInt(pageable.page);
            }
            return parseInt(pageable.number);
        }

        function getNumberOfElements(pageable) {
            if (pageable.numberOfElements != undefined && pageable.page !== null) {
                return parseInt(pageable.numberOfElements);
            }
            return parseInt(pageable.size);
        }
    }

})();
