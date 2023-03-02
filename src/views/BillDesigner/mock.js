const dataUi = {
    "version": 1.2,
    "label": "页面视图层级",
    "showLayoutBorder": true,
    "key": "root",
    "nodeType": "root",
    "name": "root",
    "dataType": "enty",
    "rowHeight": 20,
    "defaultHeight": 10,
    "cols": 3,
    "children": [
        {
            "key": "20230301100059080300991006903328",
            "name": "ARPanel",
            "label": "面板",
            "nodeType": "form",
            "dataType": "enty",
            "rowHeight": 20,
            "GridX": 0,
            "GridY": 0,
            "w": 24,
            "h": 10,
            "flowX": true,
            "autoHeight": false,
            "showDel": true,
            "showMove": true,
            "parentName": "root",
            "used": [
                "card"
            ],
            "level": 1,
            "divCode": "202303011000590782780910521713",
            "parentKey": "root",
            "locked": 0,
            "GridW": 973,
            "outFixedH": 2.4,
            "percentH": 0.47619047619047616,
            "cacheH": 10,
            "children": [
                {
                    "key": "2023030110005907822474058475580",
                    "name": "ARInput",
                    "props": {
                        "show_label": 1
                    },
                    "nodeType": "formItem",
                    "dataField": "deptPlace",
                    "label": "出发地点",
                    "hide": 0,
                    "length": "100",
                    "nullable": 0,
                    "precise": "2",
                    "tablename": "ar_bill_detail",
                    "isParallel": 0,
                    "GridX": 0,
                    "GridY": 0,
                    "h": 2,
                    "w": 8,
                    "locked": 0,
                    "parentKey": "20230301100059080300991006903328",
                    "parentName": "ARPanel",
                    "refuri": "",
                    "level": 2,
                    "divCode": "2023030110005907822474058475580",
                    "GridW": 257
                }
            ],
            "expanded": true,
            "selected": false,
            "checked": false,
            "loaded": false,
            "loading": false,
            "halfChecked": false,
            "dragOver": false,
            "dragOverGapTop": false,
            "dragOverGapBottom": false,
            "pos": "0-0-8-0",
            "active": false,
            "enty": {
                "info": {
                    "code": "arBillDetail",
                    "name": "报销单据明细表",
                    "uri": "arbusi.arbusi.arBillDetail",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_detail",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据明细表"
            },
            "cols": 3,
            "GridH": 200,
            "fixedHeight": 0,
            "heightType": "fullscreen",
            "props": {
                "font": {
                    "fontSize": 12,
                    "fontWeight": "normal",
                    "fontStyle": "normal",
                    "color": "#333",
                    "background": "#fff",
                    "borderColor": "#d1d1d1"
                }
            }
        }
    ],
    "level": 0,
    "divCode": "root",
    "parentKey": "",
    "GridW": 975,
    "locked": 0,
    "enty": {
        "info": {
            "code": "arBill",
            "name": "报销单据主表",
            "uri": "arbusi.arbusi.arBill",
            "domain": "yondif-ar",
            "appCode": "arbusi",
            "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
            "children": [
                {
                    "code": "arBillPerson",
                    "name": "报销单据人员表",
                    "uri": "arbusi.arbusi.arBillPerson",
                    "tableName": "ar_bill_person",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                },
                {
                    "code": "arBillRelation",
                    "name": "报销单据关联表",
                    "uri": "arbusi.arbusi.arBillRelation",
                    "tableName": "ar_bill_relation",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                },
                {
                    "code": "arBillDetail",
                    "name": "报销单据明细表",
                    "uri": "arbusi.arbusi.arBillDetail",
                    "tableName": "ar_bill_detail",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                },
                {
                    "code": "arBillSettlement",
                    "name": "报销单据结算表",
                    "uri": "arbusi.arbusi.arBillSettlement",
                    "tableName": "ar_bill_settlement",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                },
                {
                    "code": "arBillAttachment",
                    "name": "报销单据附件表",
                    "uri": "arbusi.arbusi.arBillAttachment",
                    "tableName": "ar_bill_attachment",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                },
                {
                    "code": "arBillBudget",
                    "name": "报销单据指标表",
                    "uri": "arbusi.arbusi.arBillBudget",
                    "tableName": "ar_bill_budget",
                    "domain": "yondif-ar",
                    "tenantId": "bpjferf0",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "bizObjCode": "arBill"
                }
            ],
            "tableName": "ar_bill",
            "tenantId": "bpjferf0"
        },
        "title": "报销单据主表",
        "children": [
            {
                "tableId": "arbusi.arbusi.arBillPerson",
                "value": "arbusi.arbusi.arBillPerson",
                "label": "报销单据人员表",
                "info": {
                    "code": "arBillPerson",
                    "name": "报销单据人员表",
                    "uri": "arbusi.arbusi.arBillPerson",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_person",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据人员表"
            },
            {
                "tableId": "arbusi.arbusi.arBillRelation",
                "value": "arbusi.arbusi.arBillRelation",
                "label": "报销单据关联表",
                "info": {
                    "code": "arBillRelation",
                    "name": "报销单据关联表",
                    "uri": "arbusi.arbusi.arBillRelation",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_relation",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据关联表"
            },
            {
                "tableId": "arbusi.arbusi.arBillDetail",
                "value": "arbusi.arbusi.arBillDetail",
                "label": "报销单据明细表",
                "info": {
                    "code": "arBillDetail",
                    "name": "报销单据明细表",
                    "uri": "arbusi.arbusi.arBillDetail",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_detail",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据明细表"
            },
            {
                "tableId": "arbusi.arbusi.arBillSettlement",
                "value": "arbusi.arbusi.arBillSettlement",
                "label": "报销单据结算表",
                "info": {
                    "code": "arBillSettlement",
                    "name": "报销单据结算表",
                    "uri": "arbusi.arbusi.arBillSettlement",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_settlement",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据结算表"
            },
            {
                "tableId": "arbusi.arbusi.arBillAttachment",
                "value": "arbusi.arbusi.arBillAttachment",
                "label": "报销单据附件表",
                "info": {
                    "code": "arBillAttachment",
                    "name": "报销单据附件表",
                    "uri": "arbusi.arbusi.arBillAttachment",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_attachment",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据附件表"
            },
            {
                "tableId": "arbusi.arbusi.arBillBudget",
                "value": "arbusi.arbusi.arBillBudget",
                "label": "报销单据指标表",
                "info": {
                    "code": "arBillBudget",
                    "name": "报销单据指标表",
                    "uri": "arbusi.arbusi.arBillBudget",
                    "domain": "yondif-ar",
                    "appCode": "arbusi",
                    "ObjBusId": "125acc1f-9617-4c73-b2f6-988a1d35bcbd",
                    "tableName": "ar_bill_budget",
                    "tenantId": "bpjferf0"
                },
                "title": "报销单据指标表"
            }
        ]
    },
    "outFixedH": 0,
    "h": 0
}

export default dataUi