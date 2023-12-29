/*
 * @Descripttion: 指标区域事件
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-27 18:48:27
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 09:40:17
 */
import arBillCommonFun from "./arBillCommonFun"
import utils from "../utils" // 工具方法

export default {
    budgetValList: [], // 指标值集要素
    budgetValObj: {
        value: '',
        label: '',
        bgItemId: '',
        bgItemCode: '', // 指标编码
        bgtTypeCode: '', // 指标类型
        bgtTypeName: '',
        fundTypeCode: '', // 资金性质
        fundTypeName: '',
        expFuncCode: '', // 支出功能分类
        expFuncName: '',
        depBgtEcoCode: '', // 部门支出经济分类
        depBgtEcoName: '',
        govBgtEcoCode: '', // 政府支出经济分类
        govBgtEcoName: ''
    },
    budgetHandle (viewModal) {
        // 选择指标
        viewModal.on('btn-bgitem', 'onChange', (args) => {
            let data = args.data
            data = this.convertBudget(viewModal, data)
            this.budgetChange(viewModal, data)
        })

        // this.budgetTest(viewModal)
    },
    // 指标带入，字段属性转换
    convertBudget (viewModal, data) {
        let budgetArr = []
        data.forEach(item => {
            let obj = {
                amt: 0,
                bgtCode: item.bgtCode, // 指标编码
                totalAmt: item.totalAmt, // 指标金额
                bgtCurAmt: item.curAmt, // 指标余额
                bgtDec: '',
                bgtId: '',
                billId: '',
                ctrlTempCode: '',
                depBgtEcoCode: item.depBgtEcoCode, // 部门支出经济分类
                depBgtEcoName: item.depBgtEcoName,
                expFuncCode: item.expFuncCode, // 部门支出经济分类
                expFuncName: item.expFuncName,
                expenseId: '',
                fiscalYear: '',
                internalDepCode: item.internalDepCode, // 单位内部机构
                internalDepName: item.internalDepName,
                mofDivCode: '',
                proCode: item.proCode, // 项目
                proName: item.proName,
                qtaId: item.id, // 额度主键
                relBillId: '',
                bgtTypeCode: item.bgtTypeCode, // 指标类型
                bgtTypeName: item.bgtTypeName,
                fundTypeCode: item.fundTypeCode, // 资金性质
                fundTypeName: item.fundTypeName,
                govBgtEcoCode: item.gov_bgt_eco_code, // 政府支出经济分类
                govBgtEcoName: item.gov_bgt_eco_name,
                id: viewModal.tools.guid()
            }
            budgetArr.push(obj)
        })
        return budgetArr
    },
    // 选择指标后，指标赋值
    budgetChange (viewModal, data) {
        const budgetUi = arBillCommonFun.getAreaDivCode('BUDGET')
        let budgetList = arBillCommonFun.getAreaData(viewModal, 'BUDGET') || []
        let allBudgetList = [...budgetList, ...data]
        allBudgetList = utils.filterData(allBudgetList, 'id') // 数据去重
        if (budgetUi.length) {
            if (allBudgetList.length === 1) { // 如果只有一条指标时，费用合计带入到指标本次申请金额
                allBudgetList[0].amt = arBillCommonFun.ToBudgetTotal
            }
            viewModal.get(budgetUi[0].key).loadData(allBudgetList)
            viewModal.setEntyValues(budgetUi[0].key, allBudgetList)
        }
        this.sendBudgetItemToSettle(viewModal)
    },
    // 费用合计代入指标合计赋值
    // 一条指标数据的时候 修改指标金额
    changeBudgetTotal (viewModal) {
        const budgetNum = arBillCommonFun.judgmentDataNum(viewModal, 'BUDGET')
        const budgetTable = arBillCommonFun.getAreaDivCode('BUDGET')
        const ToBudgetTotal = arBillCommonFun.ToBudgetTotal
        // 指标没有的时候暂时不用处理
        if (budgetNum === 0) {
            // let budgetList = [{ amt: ToBudgetTotal, id: '' }]
            // if (Array.isArray(budgetTable) && budgetTable[0] && budgetTable[0].divCode) {
            //     viewModal.get(budgetTable[0].divCode).loadData(budgetList)
            // }
        }
        if (budgetNum === 1) {
            const budgetList = arBillCommonFun.getAreaData(viewModal, 'BUDGET') || []
            budgetList[0].amt = ToBudgetTotal
            if (Array.isArray(budgetTable) && budgetTable[0] && budgetTable[0].divCode) {
                viewModal.get(budgetTable[0].divCode).loadData(budgetList)
            }
        }
    },
    // 指标删除
    budgetDelete (viewModal, btn, rowData) {
        // 判断是否有relBillId
        if (rowData.relBillId) {
            return viewModal.warning('上游单据带入的指标，不允许删除!')
        } else {
            // 删除
            const budgetUi = arBillCommonFun.getAreaDivCode('BUDGET')
            let budgetList = arBillCommonFun.getAreaData(viewModal, 'BUDGET') || []
            budgetList = budgetList.filter(item => item.id !== rowData.id)
            if (budgetUi.length) {
                if (budgetList.length === 1) { // 如果只有一条指标时，费用合计带入到指标本次申请金额
                    budgetList[0].amt = arBillCommonFun.ToBudgetTotal
                }
                viewModal.get(budgetUi[0].key).loadData(budgetList)
                viewModal.setEntyValues(budgetUi[0].key, budgetList)
            }
        }

    },
    // 指标要素带入支付
    sendBudgetItemToSettle (viewModal) {
        const payUi = arBillCommonFun.getAreaDivCode('PAY')
        if (!payUi) { // 没有支付明细区域，返回
            return false
        }
        this.budgetValList = [] // 指标要素，下拉值集
        let budgetList = arBillCommonFun.getAreaData(viewModal, 'BUDGET') || []
        budgetList.forEach(item => {
            if (item.bgtCode) {
                let obj = {
                    value: item.bgtCode,
                    label: item.bgtCode,
                    bgItemId: item.bgId,
                    bgItemCode: item.bgtCode, // 指标编码
                    bgtTypeCode: item.bgtTypeCode, // 指标类型
                    bgtTypeName: item.bgtTypeName,
                    fundTypeCode: item.fundTypeCode, // 资金性质
                    fundTypeName: item.fundTypeName,
                    expFuncCode: item.expFuncCode, // 支出功能分类
                    expFuncName: item.expFuncName,
                    depBgtEcoCode: item.depBgtEcoCode, // 部门支出经济分类
                    depBgtEcoName: item.depBgtEcoName,
                    govBgtEcoCode: item.govBgtEcoCode, // 政府支出经济分类
                    govBgtEcoName: item.govBgtEcoName
                }
                this.budgetValList.push(obj)
            }
        })
        let payList = arBillCommonFun.getAreaData(viewModal, 'PAY') || []
        if (this.budgetValList.length > 1) { // 指标数据大于一条时
            payList.forEach(item => {
                let flag = this.budgetValList.some(ele => ele.bgItemCode === item.bgItemCode)
                if (!flag) {
                    item = Object.assign(item, this.budgetValObj)
                }
            })
        } else if (this.budgetValList.length === 1) { // 指标数据只有一条时
            if (payList.length) {
                const budgetObj = this.budgetValList[0]
                payList.forEach(item => {
                    item = Object.assign(item, budgetObj)
                })
            }
        } else { // 指标数据为空，清空支付数据中指标要素
            if (payList.length) { // 支付明细存在数据
                payList.forEach(item => {
                    item = Object.assign(item, this.budgetValObj)
                })
            }
        }
        if (payList.length) {
            viewModal.get(payUi[0].key).loadData(payList)
            viewModal.setEntyValues(payUi[0].key, payList)
        }
    },
    budgetTest (viewModal) {
        let budgetList = [
            {
                "seqNo": 0,
                "bgtCurAmt": 974555.5,
                "id": "2023082116541291430724814511230",
                "expFuncName": "人大立法",
                "_status": 0,
                "bgtCode": "DWZB-0021",
                "fundTypeCode": "111",
                "qtaId": "726584989029763121",
                "serializeNullFields": [],
                "fiscalYear": "2023",
                "proCode": "360000049002000002280",
                "agencyCode": "601001",
                "depBgtEcoName": "办公费",
                "proName": "移民管理经常性业务费",
                "pubts": "2023-08-21 16:56:11",
                "creator": "报销人1",
                "createTime": "2023-08-21 16:56:12",
                "bgtTypeName": "当年预算",
                "modifier": "报销人1",
                "agencyBizKey": "880200000_601001",
                "dr": 2,
                "modifyTime": "2023-08-21 16:56:12",
                "metaFullName": "AR.AR.AARBillBudget",
                "expFuncCode": "2010105",
                "checkItemMap": {},
                "extendData": {},
                "bgtTypeCode": "21",
                "ytenantId": "fcd9i0b7",
                "depBgtEcoCode": "30201",
                "totalAmt": 1000000,
                "billId": "2023082116495572280563777",
                "amt": 6953,
                "fundTypeName": "一般公共预算资金",
                "aArBillBudgetExt": {
                    "id": "2023082116541291430724814511230",
                    "_status": 0,
                    "serializeNullFields": [],
                    "pubts": "2023-08-21 16:56:11",
                    "creator": "报销人1",
                    "createTime": "2023-08-21 16:56:12",
                    "modifier": "报销人1",
                    "dr": 2,
                    "modifyTime": "2023-08-21 16:56:12",
                    "metaFullName": "AR.AR.AARBillBudget",
                    "checkItemMap": {},
                    "extendData": {},
                    "ytenantId": "fcd9i0b7",
                    "billId": "2023082116495572280563777",
                    "fullName": "com.yonyougov.ar.i12e.po.ar.bill.AARBillBudgetExt"
                },
                "mofDivCode": "880200000",
                "fullName": "com.yonyougov.ar.i12e.po.ar.bill.AARBillBudget"
            }
        ]

        const budgetUi = arBillCommonFun.getAreaDivCode('BUDGET')
        viewModal.get(budgetUi[0].key).loadData(budgetList)
    }
}
