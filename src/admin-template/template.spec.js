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

    var $rootScope, template, templateJson, Template, TemplateColumn, COLUMN_SOURCES, TEMPLATE_COLUMNS, TemplateDataBuilder, RequisitionColumnSpy;

    beforeEach(function() {
        module('admin-template', function($provide) {
            RequisitionColumnSpy =  jasmine.createSpyObj('RequisitionColumn', [
                'columnDependencies'
            ]);

            RequisitionColumnSpy.columnDependencies.andCallFake(function(column) {
                if(column.name === 'remarks') {
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

            $provide.factory('RequisitionColumn', function(){
        		return RequisitionColumnSpy;
        	});
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            Template = $injector.get('Template');
            TemplateColumn = $injector.get('TemplateColumn');
            COLUMN_SOURCES = $injector.get('COLUMN_SOURCES');
            TEMPLATE_COLUMNS = $injector.get('TEMPLATE_COLUMNS');
            TemplateDataBuilder = $injector.get('TemplateDataBuilder');
        });

        templateJson = {
            createdDate: new Date(),
            id: 'template-1',
            numberOfPeriodsToAverage: 3,
            program: { id: 'program-1' },
            name: 'template-name',
            populateStockOnHandFromStockCards: false,
            columnsMap: {
                someColumn: {
                    name: 'someColumn',
                    option: {
                        id: 'A'
                    },
                    columnDefinition: {
                        options: [{
                            id: 'B'
                        }, {
                            id: 'A'
                        }],
                        sources: jasmine.createSpyObj('sources', ['includes'])
                    },
                    displayOrder: 0
                }
            }
        };
    });

    describe('constructor', function() {

        it('should copy all possible fields', function() {
            template = new Template(templateJson);

            expect(template.createdDate).toEqual(templateJson.createdDate);
            expect(template.id).toEqual(templateJson.id);
            expect(template.numberOfPeriodsToAverage).toEqual(templateJson.numberOfPeriodsToAverage);
            expect(template.program.id).toEqual(templateJson.program.id);
            expect(template.populateStockOnHandFromStockCards).toEqual(templateJson.populateStockOnHandFromStockCards);
            expect(template.name).toEqual(templateJson.name);
        });

        it('should wrap columns with class', function() {
            template = new Template(templateJson);

            for (var columnName in template.columnsMap) {
                expect(template.columnsMap[columnName] instanceof TemplateColumn).toBe(true);
            }
        });
    });

    describe('move', function() {

        beforeEach(function() {
            template = {
                id: '1',
                programId: '2',
                numberOfPeriodsToAverage: 2,
                columnsMap : {
                    total: {
                        isDisplayed: true,
                        displayOrder: 1,
                        name: 'total',
                        label: 'Total',
                        columnDefinition: {
                            canChangeOrder: true,
                            sources: ['USER_INPUT'],
                            isDisplayRequired: false,
                            options: [
                                {
                                    id: '1',
                                    optionLabel: 'option1'
                                },
                                {
                                    id: '2',
                                    optionLabel: 'option2'
                                },
                            ]
                        },
                        source: 'USER_INPUT',
                        option: {
                            'id': '1',
                            'optionLabel': 'option1'
                        }
                    },
                    remarks: {
                        isDisplayed: true,
                        displayOrder: 2,
                        name: 'remarks',
                        label: 'Remarks',
                        columnDefinition: {
                            canChangeOrder: true,
                            sources: ['USER_INPUT', 'CALCULATED'],
                            isDisplayRequired: false,
                            options: []
                        },
                        source: 'USER_INPUT'
                    },
                    averageConsumption: {
                        isDisplayed: true,
                        displayOrder: 3,
                        name: 'averageConsumption',
                        source: 'CALCULATED',
                        label: 'Average Consumption',
                        columnDefinition: {
                            canChangeOrder: true,
                            sources: ['CALCULATED'],
                            isDisplayRequired: false,
                            options: [ ]
                        }
                    },
                    requestedQuantity: {
                        name: 'requestedQuantity',
                        displayOrder: 4,
                        isDisplayed: true,
                        label: "Requested Quantity",
                        source: 'USER_INPUT',
                        columnDefinition: {
                            canChangeOrder: true,
                            sources: ['USER_INPUT'],
                            isDisplayRequired: false,
                            options: [ ]
                        }
                    },
                    requestedQuantityExplanation: {
                        name: 'requestedQuantityExplanation',
                        displayOrder: 5,
                        isDisplayed: true,
                        label: "Requested Quantity Explanation",
                        source: 'USER_INPUT',
                        columnDefinition: {
                            canChangeOrder: true,
                            sources: ['USER_INPUT'],
                            isDisplayRequired: false,
                            options: [ ]
                        }
                    }
                }
            };
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

            template.columnsMap.beginningBalance = {
                isDisplayed: true,
                displayOrder: 2,
                name: 'beginningBalance',
                label: 'Beginning Balance',
                columnDefinition: {
                    canChangeOrder: false,
                    sources: ['USER_INPUT', 'CALCULATED'],
                    isDisplayRequired: false
                },
                source: 'USER_INPUT'
            };
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
            RequisitionColumnSpy.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withPopulateStockOnHandFromStockCards().withColumn({
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                source: COLUMN_SOURCES.USER_INPUT
            }).withColumn({
                name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                source: COLUMN_SOURCES.USER_INPUT
            }).build();

            spyOn(template.columnsMap.stockOnHand, 'isStockDisabledColumn').andReturn(false);
            spyOn(template.columnsMap.stockOnHand, 'isStockBasedColumn').andReturn(true);
            spyOn(template.columnsMap.beginningBalance, 'isStockDisabledColumn').andReturn(false);
            spyOn(template.columnsMap.beginningBalance, 'isStockBasedColumn').andReturn(true);
            spyOn(template.columnsMap.column1, 'isStockDisabledColumn').andReturn(false);
            spyOn(template.columnsMap.column1, 'isStockBasedColumn').andReturn(false);

            template.changePopulateStockOnHandFromStockCards();

            expect(template.columnsMap.stockOnHand.source).toEqual(COLUMN_SOURCES.STOCK_CARDS);
            expect(template.columnsMap.beginningBalance.source).toEqual(COLUMN_SOURCES.STOCK_CARDS);
        });

        it('should disable stock columns', function() {
            RequisitionColumnSpy.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withPopulateStockOnHandFromStockCards().withColumn({
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                source: COLUMN_SOURCES.USER_INPUT
            }).build();

            spyOn(template.columnsMap.stockOnHand, 'isStockDisabledColumn').andReturn(true);
            spyOn(template.columnsMap.stockOnHand, 'disableColumnsAndChangeSource').andReturn(true);
            spyOn(template.columnsMap.stockOnHand, 'isStockBasedColumn').andReturn(false);
            spyOn(template.columnsMap.column1, 'isStockDisabledColumn').andReturn(true);
            spyOn(template.columnsMap.column1, 'disableColumnsAndChangeSource').andReturn(true);
            spyOn(template.columnsMap.column1, 'isStockBasedColumn').andReturn(false);

            template.changePopulateStockOnHandFromStockCards();

            expect(template.columnsMap.stockOnHand.disableColumnsAndChangeSource).toHaveBeenCalled();
            expect(template.columnsMap.column1.disableColumnsAndChangeSource).toHaveBeenCalled();
        });

        it('should change stock based columns sources to user input', function() {
            RequisitionColumnSpy.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withColumn({
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                source: COLUMN_SOURCES.USER_INPUT
            }).withColumn({
                name: TEMPLATE_COLUMNS.BEGINNING_BALANCE,
                source: COLUMN_SOURCES.USER_INPUT
            }).build();

            spyOn(template.columnsMap.stockOnHand, 'isStockBasedColumn').andReturn(true);
            spyOn(template.columnsMap.beginningBalance, 'isStockBasedColumn').andReturn(true);
            spyOn(template.columnsMap.column1, 'isStockBasedColumn').andReturn(false);

            template.changePopulateStockOnHandFromStockCards();

            expect(template.columnsMap.stockOnHand.source).toEqual(COLUMN_SOURCES.USER_INPUT);
            expect(template.columnsMap.beginningBalance.source).toEqual(COLUMN_SOURCES.USER_INPUT);
        });
    });

    describe('isColumnDisabled', function() {

        it('should return true if column is disabled', function() {
            RequisitionColumnSpy.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withPopulateStockOnHandFromStockCards().build();

            spyOn(template.columnsMap.column1, 'isStockDisabledColumn').andReturn(true);

            expect(template.isColumnDisabled(template.columnsMap.column1)).toBe(true);
        });

        it('should return false if column is not disabled', function() {
            RequisitionColumnSpy.columnDependencies.andReturn([]);
            template = new TemplateDataBuilder().withPopulateStockOnHandFromStockCards().build();
            spyOn(template.columnsMap.column1, 'isStockDisabledColumn').andReturn(false);

            expect(template.isColumnDisabled(template.columnsMap.column1)).toBe(false);

            template.populateStockOnHandFromStockCards = false;
            template.columnsMap.column1.isStockDisabledColumn.andReturn(true);

            expect(template.isColumnDisabled(template.columnsMap.column1)).toBe(false);
        });
    });

    describe('hasColumns', function() {

        beforeEach(function() {
            template = new Template(templateJson);
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
            template = new Template(templateJson);
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
            template = new Template(templateJson);
        });

        it('should add column', function() {
            var availableColumn = {
                    name: 'newColumn',
                    label: 'new column',
                    indicator: 'newColumn',
                    sources: ['USER_INPUT'],
                    options: ['OPTION_1'],
                    definition: 'definition'
                };
            
            template.addColumn(availableColumn);

            expect(template.columnsMap.newColumn).toEqual({
                name: availableColumn.name,
                label: availableColumn.label,
                indicator: availableColumn.indicator,
                displayOrder: 1,
                isDisplayed: true,
                source: availableColumn.sources[0],
                columnDefinition: availableColumn,
                option: availableColumn.options[0],
                definition: availableColumn.definition
            });
        });

        it('should not add column if parameter is undefined', function() {
            template.columnsMap = {};
            
            template.addColumn(undefined);

            expect(template.columnsMap).toEqual({});
        });
    });

    describe('create', function() {
        var repository;

        beforeEach(function() {
            repository = jasmine.createSpyObj('TemplateRepository', ['create']);
            repository.create.andReturn(true);

            template = new Template(templateJson, repository);
        });

        it('should call repository', function() {
            template.create();
            expect(repository.create).toHaveBeenCalledWith(template);
        });
    });

    describe('canAssignTag', function() {

        beforeEach(function() {
            templateJson.columnsMap.someColumn.columnDefinition.supportsTag = true;
            templateJson.populateStockOnHandFromStockCards = true;
            template = new Template(templateJson);
        });

        it('should return false if template has populateStockOnHandFromStockCards set to false', function() {
            template.populateStockOnHandFromStockCards = false;
            expect(template.canAssignTag('someColumn')).toBe(false);
        });

        it('should return false if column does not support tag', function() {
            template.columnsMap.someColumn.columnDefinition.supportsTag = false;
            expect(template.canAssignTag('someColumn')).toBe(false);
        });

        it('should return true if template has populateStockOnHandFromStockCards set to true and column supports tag', function() {
            expect(template.canAssignTag('someColumn')).toBe(true);
        });

        it('should return undefined if column with given name does not exist', function() {
            expect(template.canAssignTag('someNotExistingColumn')).toBeUndefined();
        });
    });
});
