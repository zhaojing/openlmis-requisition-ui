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
describe('ProductGridCell', function() {

    beforeEach(function() {
        this.getCompiledElement = getCompiledElement;

        module('requisition-product-grid', function($compileProvider) {
            $compileProvider.directive('lossesAndAdjustments', function() {
                var def = {
                    priority: 100,
                    terminal: true,
                    restrict: 'EAC',
                    template: '<a></a>'
                };
                return def;
            });
        });

        inject(function($injector) {
            this.$compile = $injector.get('$compile');
            this.scope = $injector.get('$rootScope').$new();
            this.requisitionValidator = $injector.get('requisitionValidator');
            this.authorizationService = $injector.get('authorizationService');
            this.RequisitionColumnDataBuilder = $injector.get('RequisitionColumnDataBuilder');
            this.COLUMN_TYPES = $injector.get('COLUMN_TYPES');
            this.COLUMN_SOURCES = $injector.get('COLUMN_SOURCES');
        });

        this.fullSupplyColumns = [{
            type: this.COLUMN_TYPES.NUMERIC,
            name: 'beginningBalance',
            source: this.COLUMN_SOURCES.USER_INPUT
        }];

        this.nonFullSupplyColumns = [{
            name: 'col3'
        }, {
            name: 'col4'
        }];

        this.requisition = jasmine.createSpyObj('this.requisition', [
            '$getStockAdjustmentReasons',
            '$isInitiated',
            '$isRejected',
            '$isSubmitted',
            '$isApproved',
            '$isReleased',
            '$isAuthorized',
            '$isInApproval'
        ]);
        this.requisition.template = jasmine.createSpyObj('template', ['getColumns']);

        var fullSupplyColumns = this.fullSupplyColumns,
            nonFullSupplyColumns = this.nonFullSupplyColumns;
        this.requisition.template.getColumns.andCallFake(function(nonFullSupply) {
            return nonFullSupply ? nonFullSupplyColumns : fullSupplyColumns;
        });
        this.requisition.program = {
            id: '1'
        };
        this.requisition.facility = {
            id: '2'
        };

        this.scope.requisition = this.requisition;

        this.scope.column = this.fullSupplyColumns[0];

        this.scope.lineItem = jasmine.createSpyObj('lineItem', [
            'getFieldValue', 'updateDependentFields', 'canBeSkipped', 'isReadOnly'
        ]);

        this.scope.lineItem.$program = {
            fullSupply: true
        };

        this.scope.lineItem.getFieldValue.andCallFake(function() {
            return 'readOnlyFieldValue';
        });

        this.scope.lineItem.$errors = {};

        spyOn(this.requisitionValidator, 'validateLineItem');
        spyOn(this.authorizationService, 'isAuthenticated').andReturn(true);
        spyOn(this.authorizationService, 'hasRight').andReturn(true);
    });

    it('should produce read-only cell if line item is readonly', function() {
        this.scope.lineItem.isReadOnly.andReturn(true);

        this.directiveElem = this.getCompiledElement();

        expect(this.directiveElem.html()).toContain('readOnlyFieldValue');
        expect(this.directiveElem.find('input').length).toEqual(0);
    });

    it('should produce editable cell if line item is not readonly', function() {
        this.scope.lineItem.isReadOnly.andReturn(false);

        this.directiveElem = this.getCompiledElement();

        expect(this.directiveElem.html()).not.toContain('readOnlyFieldValue');
        expect(this.directiveElem.find('input').length).toEqual(1);
    });

    it('should produce losesAndAdjustment cell', function() {
        this.scope.requisition.$isApproved.andReturn(false);
        this.scope.requisition.$isReleased.andReturn(false);
        this.scope.requisition.$isAuthorized.andReturn(false);
        this.scope.column.name = 'totalLossesAndAdjustments';

        this.directiveElem = this.getCompiledElement();

        expect(this.directiveElem.html()).not.toContain('readOnlyFieldValue');
        expect(this.directiveElem.find('a').length).toEqual(1);
    });

    it('should produce read only for losesAndAdjustment and stock based this.requisition', function() {
        this.scope.requisition.$isApproved.andReturn(false);
        this.scope.requisition.$isReleased.andReturn(false);
        this.scope.requisition.$isAuthorized.andReturn(false);
        this.scope.column.name = 'totalLossesAndAdjustments';
        this.scope.lineItem.isReadOnly.andReturn(true);
        this.scope.requisition.template.populateStockOnHandFromStockCards = true;

        this.directiveElem = this.getCompiledElement();

        expect(this.directiveElem.html()).toContain('readOnlyFieldValue');
        expect(this.directiveElem.find('input').length).toEqual(0);
    });

    it('should validate full supply line item columns after updating fields', function() {
        this.scope.requisition.$isInitiated.andReturn(true);
        var element = this.getCompiledElement(),
            input = element.find('input');

        input.controller('ngModel').$setViewValue('1000');
        this.scope.$apply();

        expect(this.requisitionValidator.validateLineItem).toHaveBeenCalledWith(
            this.scope.lineItem, this.fullSupplyColumns, this.requisition
        );

        expect(this.scope.lineItem.updateDependentFields).toHaveBeenCalledWith(
            this.scope.column, this.requisition
        );
    });

    it('should validate non full supply line item columns after updating fields', function() {
        this.scope.requisition.$isInitiated.andReturn(true);
        var element = this.getCompiledElement(),
            input = element.find('input');

        this.scope.lineItem.$program.fullSupply = false;

        input.controller('ngModel').$setViewValue('1000');
        this.scope.$apply();

        expect(this.requisitionValidator.validateLineItem).toHaveBeenCalledWith(
            this.scope.lineItem, this.nonFullSupplyColumns, this.requisition
        );

        expect(this.scope.lineItem.updateDependentFields).toHaveBeenCalledWith(
            this.scope.column, this.requisition
        );
    });

    describe('Skip Column', function() {

        var skipColumn, element;

        beforeEach(function() {
            skipColumn = new this.RequisitionColumnDataBuilder().buildSkipColumn();
            this.scope.column = skipColumn;
        });

        it('should be always disabled if user can not edit', function() {
            this.scope.userCanEdit = false;
            this.scope.lineItem.canBeSkipped.andReturn(true);

            element = this.getCompiledElement();

            expect(getSkipInput().attr('disabled')).toBe('disabled');

            this.scope.lineItem.canBeSkipped.andReturn(false);
            this.scope.$digest();

            expect(getSkipInput().attr('disabled')).toBe('disabled');

            this.scope.lineItem.canBeSkipped.andReturn(true);
            this.scope.$digest();

            expect(getSkipInput().attr('disabled')).toBe('disabled');
        });

        it('should change disabled state if lineItem changes its skipability and user has right to edit', function() {
            this.scope.userCanEdit = true;
            this.scope.lineItem.canBeSkipped.andReturn(true);

            element = this.getCompiledElement();

            expect(getSkipInput().attr('disabled')).toBe(undefined);

            this.scope.lineItem.canBeSkipped.andReturn(false);
            this.scope.$digest();

            expect(getSkipInput().attr('disabled')).toBe('disabled');

            this.scope.lineItem.canBeSkipped.andReturn(true);
            this.scope.$digest();

            expect(getSkipInput().attr('disabled')).toBe(undefined);
        });

        function getSkipInput() {
            return element.find('input.skip');
        }

    });

    function getCompiledElement() {
        var rootElement = angular.element('<div><div product-grid-cell requisition="requisition" column="column"' +
            ' line-item="lineItem" user-can-edit="userCanEdit"></div></div>');
        var compiledElement = this.$compile(rootElement)(this.scope);
        angular.element('body').append(compiledElement);
        this.scope.$digest();
        return compiledElement;
    }
});
