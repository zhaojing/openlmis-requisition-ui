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

describe('convert-to-order run block', function() {

    var $state, $rootScope, requisitionsForConvertFactory;

    beforeEach(function() {

        module('requisition-convert-to-order');

        inject(function($injector) {
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            requisitionsForConvertFactory = $injector.get('requisitionsForConvertFactory');
        });

        spyOn(requisitionsForConvertFactory, 'forConvert');
        spyOn(requisitionsForConvertFactory, 'clearCache');
    });

    it('should clear requisitionsForConvertFactory when leaving the convertToOrder state', function() {
        $state.go('openlmis.requisitions.convertToOrder');
        $rootScope.$apply();
        expect(requisitionsForConvertFactory.clearCache).not.toHaveBeenCalled();

        $state.go('openlmis');
        $rootScope.$apply();
        expect(requisitionsForConvertFactory.clearCache).toHaveBeenCalled();

        $state.go('openlmis.requisitions.convertToOrder');
        $rootScope.$apply();
    });

    it('should not clear requisitionsForConvertFactory if reloading the convertToOrder state', function() {
        $state.go('openlmis.requisitions.convertToOrder');
        $rootScope.$apply();

        $state.go('openlmis.requisitions.convertToOrder', {}, {
            reload: true
        });
        $rootScope.$apply();


        expect(requisitionsForConvertFactory.clearCache).not.toHaveBeenCalled();
    });

});
