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
     * @name admin-template-add.TemplateRepositoryImpl
     *
     * @description
     * Implementation of the TemplateRepository interface. Communicates with the REST API of the OpenLMIS server.
     */
    angular
        .module('admin-template-add')
        .factory('TemplateRepositoryImpl', TemplateRepositoryImpl);

    TemplateRepositoryImpl.inject = ['TemplateResource'];

    function TemplateRepositoryImpl(TemplateResource) {

        TemplateRepositoryImpl.prototype.create = create;
        TemplateRepositoryImpl.prototype.update = update;

        return TemplateRepositoryImpl;

        /**
         * @ngdoc method
         * @methodOf admin-template-add.TemplateRepositoryImpl
         * @name TemplateRepositoryImpl
         * @constructor
         *
         * @description
         * Creates an instance of the TemplateRepositoryImpl class.
         */
        function TemplateRepositoryImpl() {
            this.templateResource = new TemplateResource();
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-add.TemplateRepositoryImpl
         * @name create
         * 
         * @description
         * Creates a new Template on the OpenLMIS server.
         * 
         * @param  {Object}  template the JSON representation of the Tempalte
         * @return {Promise}          the promise resolving to JSON representation of the created Template
         */
        function create(template) {
            return this.templateResource.create(template);
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-add.TemplateRepositoryImpl
         * @name update
         *
         * @description
         * Updates Template on the OpenLMIS server.
         *
         * @param  {Object}  template the JSON representation of the Tempalte
         * @return {Promise}          the promise resolving to a Template
         */
        function update(template) {
            return this.templateResource.update(template);
        }
    }
})();