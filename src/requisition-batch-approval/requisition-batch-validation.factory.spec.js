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


describe('RequisitionBatchValidationFactory', function() {

	var $rootScope, $httpBackend, requisitions, deferred, saveDeferred, requisitionBatchSaveFactory;

	beforeEach(function() {
        module('requisition-batch-approval');

        var requisitionLineItems = [
            {
                id: 1,
                skipped: false,
                approvedQuantity: 10
            },
            {
                id: 2,
                skipped: false,
                approvedQuantity: 1
            }
        ];

        var requisitionLineItems2 = [
            {
                id: 3,
                skipped: false,
                approvedQuantity: 90,
            },
            {
                id: 4,
                skipped: false,
                approvedQuantity: 50
            }
        ];

        var requisition = {
            id: 1,
            status: 'AUTHORIZED',
            requisitionLineItems: requisitionLineItems
        };

        var requisition2 = {
            id: 2,
            status: 'AUTHORIZED',
            requisitionLineItems: requisitionLineItems2
        };

        requisitions = [requisition, requisition2];

        inject(function($injector){
            $q = $injector.get('$q');
        });

        inject(function($injector){
            $rootScope = $injector.get('$rootScope');
            requisitionBatchValidationFactory = $injector.get('requisitionBatchValidationFactory');
        });

	});

	it('when successful, it returns an array of all requisitions', function() {
		var response;

		requisitionBatchValidationFactory.validateRequisitions(requisitions).then(function(returnedRequisitions){
			response = returnedRequisitions;
		});
		$rootScope.$apply();

		expect(response.length).toEqual(requisitions.length);
		expect(response[0].id).toEqual(requisitions[0].id);
	});

	it('returns only valid requisitions', function() {
		var response;

		requisitions[1].requisitionLineItems[1].approvedQuantity = null;

		requisitionBatchValidationFactory.validateRequisitions(requisitions).catch(function(returnedRequisitions){
			response = returnedRequisitions;
		});
		$rootScope.$apply();

		expect(response.length).toEqual(requisitions.length - 1);
	});

	it('skipped requisitions are always valid', function() {
		var response;

		requisitions[1].requisitionLineItems[1].skipped = true;

		requisitionBatchValidationFactory.validateRequisitions(requisitions).then(function(returnedRequisitions){
			response = returnedRequisitions;
		});
		$rootScope.$apply();

		expect(response.length).toEqual(requisitions.length);
		expect(response[1].id).toEqual(requisitions[1].id);
	});

});
