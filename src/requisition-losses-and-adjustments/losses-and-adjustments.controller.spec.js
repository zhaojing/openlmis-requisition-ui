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

describe('LossesAndAdjustmentsController', function() {

    var vm, $scope, adjustmentsModalService, lineItem;

    beforeEach(function() {
        module('requisition-losses-and-adjustments');

        inject(function($injector) {
            adjustmentsModalService = $injector.get('adjustmentsModalService');
            $q = $injector.get('$q');

            $scope = $injector.get('$rootScope').$new();

            vm = $injector.get('$controller')('LossesAndAdjustmentsController', {
                $scope: $scope
            });
        });

        lineItem = {
            id: 'line-item-id'
        };

        $scope.requisition = {
            id: 'requisition-id',
            $stockAdjustments: []
        };
    });

    it('$onInit should expose lineItem', function() {
        $scope.lineItem = lineItem;

        vm.$onInit();

        expect(vm.lineItem).toEqual($scope.lineItem);
    });

    it('showModal should call adjustmentsModalService', function() {
        spyOn(adjustmentsModalService, 'open').andReturn($q.when());

        vm.lineItem = lineItem;

        vm.showModal();

        expect(adjustmentsModalService.open).toHaveBeenCalled();
    });

});
