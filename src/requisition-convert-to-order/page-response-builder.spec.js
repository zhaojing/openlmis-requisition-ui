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
        .module('openlmis-pagination')
        .factory('PageResponseBuilder', PageResponseBuilder);

    PageResponseBuilder.$inject = ['PageResponse'];

    function PageResponseBuilder(PageResponse) {

        PageResponseBuilder.prototype.withNumber = withNumber;
        PageResponseBuilder.prototype.withSize = withSize;
        PageResponseBuilder.prototype.withLast = withLast;
        PageResponseBuilder.prototype.withFirst = withFirst;
        PageResponseBuilder.prototype.withNumberOfElements = withNumberOfElements;
        PageResponseBuilder.prototype.withTotalElements = withTotalElements;
        PageResponseBuilder.prototype.withTotalPages = withTotalPages;
        PageResponseBuilder.prototype.withContent = withContent;
        PageResponseBuilder.prototype.build = build;

        return PageResponseBuilder;

        function PageResponseBuilder() {
            this.first = true;
            this.last = true;
            this.number = 0;
            this.size = 10;
            this.numberOfElements = 0;
            this.totalElements = 0;
            this.totalPages = 0;
            this.content = [];
        }

        function withNumber(newNumber) {
            this.number = newNumber;
            return this;
        }

        function withSize(newSize) {
            this.number = newSize;
            return this;
        }

        function withFirst(newFirst) {
            this.first = newFirst;
            return this;
        }

        function withLast(newLast) {
            this.last = newLast;
            return this;
        }

        function withNumberOfElements(newNumberOfElements) {
            this.numberOfElements = newNumberOfElements;
            return this;
        }

        function withTotalElements(newTotalElements) {
            this.totalElements = newTotalElements;
            return this;
        }

        function withTotalPages(newTotalPages) {
            this.totalPages = newTotalPages;
            return this;
        }

        function withContent(newContent) {
            this.content = newContent;
            return this;
        }

        function build() {
            return new PageResponse(
                this.first,
                this.last,
                this.number,
                this.size,
                this.numberOfElements,
                this.totalElements,
                this.totalPages,
                this.content
            );
        }

    }

})();
