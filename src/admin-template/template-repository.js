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
     * @name admin-template.TemplateRepository
     * 
     * @description
     * Repository for managing Stock Reasons used throughout the system.
     */
    angular
        .module('admin-template')
        .factory('TemplateRepository', TemplateRepository);

    TemplateRepository.$inject = ['classExtender', 'OpenlmisRepository', 'Template', 'TemplateResource'];

    function TemplateRepository(classExtender, OpenlmisRepository, Template, TemplateResource) {

        classExtender.extend(TemplateRepository, OpenlmisRepository);

        return TemplateRepository;

        /**
         * @ngdoc method
         * @methodOf admin-template.TemplateRepository
         * @name TemplateRepository
         * @constructor
         * 
         * @description
         * Creates an instance of the TemplateRepository. If no implementation is given a default one will be use.
         * The default implementation is an instance of the TemplateRepositoryImpl class.
         * 
         * @param {Object} impl the implementation to be used by the repository, defaults to TemplateRepositoryImpl
         */
        function TemplateRepository(impl) {
            this.super(Template, impl || new TemplateResource());
        }
    }
})();