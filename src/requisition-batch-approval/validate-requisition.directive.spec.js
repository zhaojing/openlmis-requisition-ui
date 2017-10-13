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

describe('validateRequisition directive', function() {

    var $scope, div;

    beforeEach(function() {
        module('requisition-batch-approval');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $compile = $injector.get('$compile');
        });

        $scope = $rootScope.$new();

        $scope.requisition = {
            $error: undefined,
            requisitionLineItems: [{
                approvedQuantity: 10
            }, {
                approvedQuantity: 11
            }, {
                approvedQuantity: 12
            }, {
                approvedQuantity: 13
            }]
        };

        div = compileMarkup(
            '<div>' +
                '<div ng-repeat="lineItem in requisition.requisitionLineItems">' +
                    '<input validate-requisition="requisition"/>' +
                '</div>' +
            '</div>'
        );
    });

    describe('on openlmisInvalid.hide', function() {

        it('should set error if any of the inputs is empty', function() {
            $scope.requisition.requisitionLineItems[2].approvedQuantity = undefined;
            $scope.$apply();

            div.find('div:nth-child(1)').trigger('openlmisInvalid.hide');

            expect($scope.requisition.$error).not.toBeUndefined();
        });

        it('should unset error if all inputs are filled', function() {
            $scope.requisition.requisitionLineItems[2].approvedQuantity = undefined;
            $scope.$apply();

            $scope.requisition.requisitionLineItems[2].approvedQuantity = 15;
            $scope.$apply();

            div.find('div:nth-child(1)').trigger('openlmisInvalid.hide');

            expect($scope.requisition.$error).toBeUndefined();
        });

    });

    describe('on openlmisInvalid.show', function() {

        it('should set error if any of the inputs is empty', function() {
            $scope.requisition.requisitionLineItems[3].approvedQuantity = undefined;
            $scope.$apply();

            div.find('div:nth-child(1)').trigger('openlmisInvalid.show');

            expect($scope.requisition.$error).not.toBeUndefined();
        });

        it('should unset error if all inputs are filled', function() {
            $scope.requisition.requisitionLineItems[3].approvedQuantity = undefined;
            $scope.$apply();

            $scope.requisition.requisitionLineItems[3].approvedQuantity = 15;
            $scope.$apply();

            div.find('div:nth-child(1)').trigger('openlmisInvalid.show');

            expect($scope.requisition.$error).toBeUndefined();
        });

    });


    function compileMarkup(markup) {
        var element = $compile(markup)($scope);

        angular.element('body').append(element);
        $scope.$apply();

        return element;
    }

});
