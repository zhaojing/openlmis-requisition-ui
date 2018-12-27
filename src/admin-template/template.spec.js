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

describe('Template', function() {

    var $rootScope, template, Template, TemplateColumn, COLUMN_SOURCES, TEMPLATE_COLUMNS,
        TemplateDataBuilder;

    beforeEach(function() {
        module('admin-template');

        this.originalIncludes = Array.prototype.includes;
        Array.prototype.includes = function(entry) {
            return this.indexOf(entry) > -1;
        };

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            Template = $injector.get('Template');
            TemplateColumn = $injector.get('TemplateColumn');
            COLUMN_SOURCES = $injector.get('COLUMN_SOURCES');
            TEMPLATE_COLUMNS = $injector.get('TEMPLATE_COLUMNS');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
            this.TemplateDataBuilder = TemplateDataBuilder;
            this.RequisitionColumn = $injector.get('RequisitionColumn');
            this.TemplateColumnDataBuilder = $injector.get('TemplateColumnDataBuilder');
        });

        this.templateJson = new this.TemplateDataBuilder()
            .withColumn(
                new this.TemplateColumnDataBuilder()
                    .withName('someColumn')
                    .build()
            )
            .buildJson();

        spyOn(this.RequisitionColumn, 'columnDependencies').andCallFake(function(column) {
            if (column.name === 'remarks') {
                return ['total'];
            } else if (column.name === 'totalCost') {
                return ['pricePerPack', 'packsToShip'];
            } else if (column.name === 'packsToShip') {
                return ['requestedQuantity', 'approvedQuantity'];
            } else if (column.name === 'pricePerPack') {
                return [];
            } else if (column.name === 'stockOnHand') {
                return ['beginningBalance', 'totalConsumedQuantity'];
            } else if (column.name === 'totalConsumedQuantity') {
                return ['beginningBalance', 'stockOnHand'];
            }
            return null;
        });
    });

    describe('constructor', function() {

        it('should copy all possible fields', function() {
            template = new Template(this.templateJson);

            expect(template.createdDate).toEqual(this.templateJson.createdDate);
            expect(template.id).toEqual(this.templateJson.id);
            expect(template.numberOfPeriodsToAverage).toEqual(this.templateJson.numberOfPeriodsToAverage);
            expect(template.program.id).toEqual(this.templateJson.program.id);
            expect(template.populateStockOnHandFromStockCards)
                .toEqual(this.templateJson.populateStockOnHandFromStockCards);

            expect(template.name).toEqual(this.templateJson.name);
        });

        it('should wrap columns with class', function() {
            template = new Template(this.templateJson);

            for (var columnName in template.columnsMap) {
                expect(template.columnsMap[columnName] instanceof TemplateColumn).toBe(true);
            }
        });
    });

    describe('move', function() {

        beforeEach(function() {
            template = new this.TemplateDataBuilder()
                .withoutColumns()
                .withTotalColumn()
                .withRemarksColumn()
                .withAverageConsumptionColumn()
                .withRequestedQuantityColumn()
                .withRequestedQuantityExplanationColumn()
                .build();
        });

        it('should move total column below remarks column', function() {
            var requisitionTemplate, columnCopy;

            requisitionTemplate = new Template(template);
            $rootScope.$apply();

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

            columnCopy = angular.copy(requisitionTemplate.columnsMap.total);

            expect(requisitionTemplate.moveColumn(columnCopy, 2)).toBe(true);

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
        });

        it('should move remarks column above total column', function() {
            var requisitionTemplate, columnCopy;

            requisitionTemplate = new Template(template);
            $rootScope.$apply();

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

            columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);

            expect(requisitionTemplate.moveColumn(columnCopy, 0)).toBe(true);

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
        });

        it('should not move column if canChangeOrder is set to false', function() {
            var requisitionTemplate, columnCopy;

            requisitionTemplate = new Template(template);
            $rootScope.$apply();

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

            requisitionTemplate.columnsMap.remarks.columnDefinition.canChangeOrder = false;

            columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);

            expect(requisitionTemplate.moveColumn(columnCopy, 0)).toBe(false);

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
        });

        it('should not move column if it is not between the same pinned columns', function() {
            var requisitionTemplate, columnCopy;

            template.columnsMap.beginningBalance = new this.TemplateColumnDataBuilder().buildBeginningBalanceColumn();

            template.columnsMap.remarks.displayOrder = 3;

            requisitionTemplate = new Template(template);
            $rootScope.$apply();

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

            columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);

            expect(requisitionTemplate.moveColumn(columnCopy, 0)).toBe(false);

            expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
            expect(requisitionTemplate.columnsMap.beginningBalance.displayOrder).toBe(2);
            expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
        });
    });

    describe('changePopulateStockOnHandFromStockCards', function() {

        it('should change stock based columns sources to stock cards', function() {
            this.RequisitionColumn.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withPopulateStockOnHandFromStockCards()
                .withColumn({
                    name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                    source: COLUMN_SOURCES.USER_INPUT
                })
                .withColumn({
                    name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                    source: COLUMN_SOURCES.USER_INPUT
                })
                .build();

            template.changePopulateStockOnHandFromStockCards();

            expect(template.columnsMap.stockOnHand.source).toEqual(COLUMN_SOURCES.STOCK_CARDS);
            expect(template.columnsMap.beginningBalance.source).toEqual(COLUMN_SOURCES.STOCK_CARDS);
        });

        it('should change stock based columns sources to user input', function() {
            this.RequisitionColumn.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withColumn({
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                source: COLUMN_SOURCES.USER_INPUT
            })
                .withColumn({
                    name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                    source: COLUMN_SOURCES.USER_INPUT
                })
                .build();

            template.changePopulateStockOnHandFromStockCards();

            expect(template.columnsMap.stockOnHand.source).toEqual(COLUMN_SOURCES.USER_INPUT);
            expect(template.columnsMap.beginningBalance.source).toEqual(COLUMN_SOURCES.USER_INPUT);
        });
    });

    describe('hasColumns', function() {

        beforeEach(function() {
            template = new Template(this.templateJson);
        });

        it('should return true if template has columns', function() {
            expect(template.hasColumns()).toBe(true);
        });

        it('should return false if template has no columns', function() {
            template.columnsMap = {};

            expect(template.hasColumns()).toBe(false);
        });
    });

    describe('removeColumn', function() {

        beforeEach(function() {
            template = new Template(this.templateJson);
        });

        it('should resolve if column removal was successful', function() {
            var spy = jasmine.createSpy();

            template.removeColumn('someColumn').then(spy);
            $rootScope.$apply();

            expect(spy).toHaveBeenCalled();
            expect(template.columnsMap.someColumn).toBe(undefined);
        });

        it('should reject if column removal was not successful', function() {
            var spy = jasmine.createSpy();

            template.removeColumn('notExistingColumn').catch(spy);
            $rootScope.$apply();

            expect(spy).toHaveBeenCalled();
            expect(template.columnsMap.someColumn).not.toBe(undefined);
        });
    });

    describe('addColumn', function() {

        beforeEach(function() {
            template = new this.TemplateDataBuilder()
                .withoutColumns()
                .build();

            this.newColumn = {
                name: 'newColumn',
                label: 'new column',
                indicator: 'newColumn',
                sources: ['USER_INPUT'],
                options: ['OPTION_1'],
                definition: 'definition'
            };
        });

        it('should add displayed column', function() {
            template.addColumn(this.newColumn, true);

            expect(template.columnsMap.newColumn).toEqual({
                name: this.newColumn.name,
                label: this.newColumn.label,
                indicator: this.newColumn.indicator,
                displayOrder: 0,
                isDisplayed: true,
                source: this.newColumn.sources[0],
                columnDefinition: this.newColumn,
                option: this.newColumn.options[0],
                definition: this.newColumn.definition
            });
        });

        it('should add hidden column', function() {
            template.addColumn(this.newColumn, false);

            expect(template.columnsMap.newColumn).toEqual({
                name: this.newColumn.name,
                label: this.newColumn.label,
                indicator: this.newColumn.indicator,
                displayOrder: 0,
                isDisplayed: false,
                source: this.newColumn.sources[0],
                columnDefinition: this.newColumn,
                option: this.newColumn.options[0],
                definition: this.newColumn.definition
            });
        });

        it('should not add column if parameter is undefined', function() {
            template.addColumn(undefined);

            expect(template.columnsMap).toEqual({});
        });

        it('should set USER_INPUT as source if possible', function() {
            template.addColumn(this.newColumn, false);

            expect(template.columnsMap.newColumn).toEqual({
                name: this.newColumn.name,
                label: this.newColumn.label,
                indicator: this.newColumn.indicator,
                displayOrder: 0,
                isDisplayed: false,
                source: COLUMN_SOURCES.USER_INPUT,
                columnDefinition: this.newColumn,
                option: this.newColumn.options[0],
                definition: this.newColumn.definition
            });
        });

        it('should fallback to the first source option', function() {
            this.newColumn.sources = [COLUMN_SOURCES.CALCULATED, COLUMN_SOURCES.STOCK_CARDS];

            template.addColumn(this.newColumn, false);

            expect(template.columnsMap.newColumn).toEqual({
                name: this.newColumn.name,
                label: this.newColumn.label,
                indicator: this.newColumn.indicator,
                displayOrder: 0,
                isDisplayed: false,
                source: COLUMN_SOURCES.CALCULATED,
                columnDefinition: this.newColumn,
                option: this.newColumn.options[0],
                definition: this.newColumn.definition
            });
        });
    });

    describe('create', function() {
        var repository;

        beforeEach(function() {
            repository = jasmine.createSpyObj('TemplateRepository', ['create']);
            repository.create.andReturn(true);

            template = new Template(this.templateJson, repository);
        });

        it('should call repository', function() {
            template.create();

            expect(repository.create).toHaveBeenCalledWith(template);
        });
    });

    describe('canAssignTag', function() {

        beforeEach(function() {
            this.templateJson.columnsMap.someColumn.columnDefinition.supportsTag = true;
            this.templateJson.populateStockOnHandFromStockCards = true;
            template = new Template(this.templateJson);
        });

        it('should return false if template has populateStockOnHandFromStockCards set to false', function() {
            template.populateStockOnHandFromStockCards = false;

            expect(template.canAssignTag('someColumn')).toBe(false);
        });

        it('should return false if column does not support tag', function() {
            template.columnsMap.someColumn.columnDefinition.supportsTag = false;

            expect(template.canAssignTag('someColumn')).toBe(false);
        });

        it('should return true if template has populateStockOnHandFromStockCards set to true and column supports tag',
            function() {
                expect(template.canAssignTag('someColumn')).toBe(true);
            });

        it('should return undefined if column with given name does not exist', function() {
            expect(template.canAssignTag('someNotExistingColumn')).toBeUndefined();
        });
    });

    afterEach(function() {
        Array.prototype.includes = this.originalIncludes;
    });

});
