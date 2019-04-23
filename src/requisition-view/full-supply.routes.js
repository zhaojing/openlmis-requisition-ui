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

    angular
        .module('requisition-view')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('openlmis.requisitions.requisition.fullSupply', {
            url: '/fullSupply?page&size',
            templateUrl: 'requisition-view-tab/requisition-view-tab.html',
            controller: 'ViewTabController',
            controllerAs: 'vm',
            isOffline: true,
            nonTrackable: true,
            resolve: {
                lineItems: function($filter, requisition) {
                    var filterObject = requisition.template.hideSkippedLineItems() ?
                        {
                            skipped: '!true',
                            $program: {
                                fullSupply: true
                            }
                        } : {
                            $program: {
                                fullSupply: true
                            }
                        };
                    var fullSupplyLineItems = $filter('filter')(requisition.requisitionLineItems, filterObject);

                    return $filter('orderBy')(fullSupplyLineItems, [
                        '$program.orderableCategoryDisplayOrder',
                        '$program.orderableCategoryDisplayName',
                        '$program.displayOrder',
                        'orderable.fullProductName'
                    ]);
                },
                items: function(paginationService, lineItems, $stateParams, requisitionValidator) {
                    return paginationService.registerList(
                        requisitionValidator.isLineItemValid, $stateParams, function() {
                            return lineItems;
                        }
                    );
                },
                columns: function(requisition) {
                    return requisition.template.getColumns(requisition.emergency);
                },
                fullSupply: function() {
                    return true;
                }
            }
        });
    }

})();
