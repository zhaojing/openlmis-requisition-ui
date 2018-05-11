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

describe('TemplateRepositoryImpl', function() {

    var templateRepositoryImpl, TemplateRepositoryImpl, $q, $rootScope, TemplateDataBuilder,
        templateResourceMock, templateWithId, templateWithoutId;

    beforeEach(function() {
        module('admin-template-add', function($provide) {
            templateResourceMock = jasmine.createSpyObj('templateResource', ['create', 'update']);
            $provide.factory('TemplateResource', function() {
                return function() {
                    return templateResourceMock;
                };
            });
        });

        inject(function($injector) {
            TemplateRepositoryImpl = $injector.get('TemplateRepositoryImpl');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
        });

        templateRepositoryImpl = new TemplateRepositoryImpl();

        templateWithoutId = new TemplateDataBuilder()
            .withoutId()
            .build();
        templateWithId = new TemplateDataBuilder()
            .build();

        templateResourceMock.create.andReturn($q.resolve(templateWithoutId));
        templateResourceMock.update.andReturn($q.resolve(templateWithId));
    });

    describe('create', function() {

        it('should reject if template create fails', function() {
            templateResourceMock.create.andReturn($q.reject());

            var rejected;
            templateRepositoryImpl.create(templateWithoutId)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(templateResourceMock.create).toHaveBeenCalled();
        });

        it('should create template', function() {
            var result;
            templateRepositoryImpl.create(templateWithoutId)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result).toEqual(templateWithoutId);
            expect(templateResourceMock.create).toHaveBeenCalled();
        });
    });

    describe('update', function() {

        it('should reject if template update fails', function() {
            templateResourceMock.update.andReturn($q.reject());

            var rejected;
            templateRepositoryImpl.update(templateWithId)
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBe(true);
            expect(templateResourceMock.update).toHaveBeenCalled();
        });

        it('should update template', function() {
            var result;
            templateRepositoryImpl.update(templateWithId)
            .then(function(response) {
                result = response;
            });
            $rootScope.$apply();

            expect(result).toEqual(templateWithId);
            expect(templateResourceMock.update).toHaveBeenCalled();
        });
    });
});