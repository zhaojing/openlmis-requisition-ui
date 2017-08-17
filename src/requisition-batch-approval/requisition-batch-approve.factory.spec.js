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


describe('RequisitionBatchApproveFactory', function() {

	var $rootScope, $httpBackend, requisitionBatchApproveFactory, requisitionSaveSpy, requisitions;

	beforeEach(function() {
        module('requisition-batch-approval');

		requisitions = [{
			id: "requisition-1"
		}, {
			id: "requisition-2"
		}];

        module(function($provide) {
            requisitionSaveSpy = {
                'save': function(requisitions){
                    return [];
                }
            };
            $provide.factory('requisitionBatchSaveFactory', function(){
                return requisitionSaveSpy.save;
            });

            $provide.factory('requisitionUrlFactory', function(){
                return function(url){
                    return url;
                }
            });
		});

        inject(function($injector){
            $q = $injector.get('$q');

            spyOn(requisitionSaveSpy, 'save').andCallFake(function(requisitions){
                return $q.resolve(requisitions);
            });

            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            requisitionBatchApproveFactory = $injector.get('requisitionBatchApproveFactory');
        });
	});

	it('returns an empty array if input is invalid', function() {
		var response;

		requisitionBatchApproveFactory([]).catch(function(requisitions){
			response = requisitions;
		});
		$rootScope.$apply();

		expect(Array.isArray(response)).toBe(true);
		expect(response.length).toEqual(0);

		requisitionBatchApproveFactory(false).catch(function(requisitions){
			response = requisitions;
		});
		$rootScope.$apply();

		expect(Array.isArray(response)).toBe(true);
		expect(response.length).toEqual(0);

	});

	it('always saves all requisitions', function() {
		requisitionBatchApproveFactory(requisitions);
		$rootScope.$apply();

		expect(requisitionSaveSpy.save).toHaveBeenCalledWith(requisitions);
	});

	it('when successful, it returns an array of all requisitions', function() {
		var response;

		$httpBackend.whenPOST('/api/requisitions?approveAll&id=requisition-1,requisition-2').respond(200, {requisitionDtos: requisitions});

		requisitionBatchApproveFactory(requisitions).then(function(returnedRequisitions){
			response = returnedRequisitions;
		});

		$rootScope.$apply();
		$httpBackend.flush();

		expect(response.length).toEqual(requisitions.length);
		expect(response[0].id).toEqual(requisitions[0].id);
	});

	it('unapproved requisitions are not returned, and have error message applied', function() {
		var unapprovableRequisition = {
			id: 'requisition-dontapprove'
		};
		requisitions.push(unapprovableRequisition);

        $httpBackend.whenPOST('/api/requisitions?approveAll&id=requisition-1,requisition-2,requisition-dontapprove').respond(400, {
            requisitionDtos: [requisitions[0], requisitions[1]],
            requisitionErrors: [{
                requisitionId: requisitions[2].id,
                errorMessage: {
                    message: 'This requisition is invalid!'
                }
            }]
        });

		var response;
		requisitionBatchApproveFactory(requisitions).then(function(returnedRequisitions){
			response = returnedRequisitions;
		});

		$rootScope.$apply();
		$httpBackend.flush();

		expect(response.length).toEqual(requisitions.length - 1);

		// We mutated the original object...
		expect(unapprovableRequisition.$error).toBeTruthy();
	});

});
