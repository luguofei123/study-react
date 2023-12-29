/*
 * @Descripttion:
 * @version:
 * @Author: lugfa
 * @Date: 2023-04-27 18:26:27
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-02 16:38:20
 * @FilePath: /yondif-a-ar-fe/yondif/src/common/bill/detailFun.js
 */
/**
 * 费用区域事件
 * @param {*} viewModal
 * @returns
 */
import arBillCommonFun from "./arBillCommonFun"
import travelFun from './travelFun'

export default {
    // 四个金额赋值
    // currencyAmt 币种金额
    // rmbCurrencyAmt 币种人民币金额
    // checkAmt 核定币种金额
    // amt 核定人民币金额
    // extRat 汇率
    schDivcode: '',
    schData: {}, // 新增后的行程的数据
    schCardData: [], // 所有行程的数据
    expData: {}, // 整个行程和费用的数据
    editData: {}, // 点击修改的行程数据
    btnAddOtherExp: 'btn-addOtherExp', // 下拉按钮容器编码
    expBlurItem: ['currencyAmt', 'checkAmt', 'expenseCri', 'peopleNum', 'days', 'num'],
    onListenDetailCellBlur (viewModal, item, children, expItem, bSumAmtData) {
        const { key: formKey, enty, divCode } = item
        const { code } = enty.info
        children.forEach(ele => {
            const { key } = ele
            viewModal.on(key, 'onCellBlur', param => {
                const { colFieldName, index } = param
                if (this.expBlurItem.includes(colFieldName)) {
                    setTimeout(() => {
                        let data = viewModal.get(formKey).getTableData().data
                        let obj = data[index]
                        this.calculateAmount(viewModal, param, obj, formKey)
                        arBillCommonFun.expenseTotal(viewModal, bSumAmtData, children, enty, divCode, code, expItem, item) // 计算费用金额合计
                    }, 500)
                }
                return true
            })
        })
    },
    calculateAmount (viewModal, param, obj, formKey) {
        const dataField = param.colFieldName // 当前修改信息项
        let item = obj
        const extRat = item['extRat'] || 1
        const currencyAmt = item['currencyAmt'] || 0
        if (dataField === 'currencyAmt') {
            // 修改币种金额，其他三个金额赋值
            item['rmbCurrencyAmt'] = currencyAmt * extRat
            item['checkAmt'] = currencyAmt
            item['amt'] = item['checkAmt'] * extRat
            this.setTableData(viewModal, param, item, formKey)
        }
        if (dataField === 'checkAmt') {
            // 校验，修改核定币种金额时需要控制必须小于等于当前行上的币种金额,核定币种金额大于核定币种金额时，核定币种金额默认等于bi'zhong金额
            if (item['checkAmt'] && item['currencyAmt'] && item['checkAmt'] > item['currencyAmt']) {
                item['checkAmt'] = item['currencyAmt']
                viewModal.Message.info('核定金额必须小于等于当前行上的报销金额！')
            }
            // 修改核定币种金额，只给核定人民币金额赋值
            item['amt'] = (item['checkAmt'] || 0) * extRat
            this.setTableData(viewModal, param, item, formKey)
        }
        if (dataField === 'expenseCri' || dataField === 'peopleNum' || dataField === 'days' || dataField === 'num') {
            // 修改币种金额，其他三个金额赋值
            item['rmbCurrencyAmt'] = currencyAmt * extRat
            item['checkAmt'] = currencyAmt
            item['amt'] = item['checkAmt'] * extRat
            this.setTableData(viewModal, param, item, formKey)
        }
    },
    // 更新表格数据
    setTableData (viewModal, param, item, formKey) {
        let data = viewModal.get(formKey).getTableData().data
        data[param.index] = item
        viewModal.get(formKey).loadData(data)
        viewModal.setEntyValues(formKey, data)

    },
    // 费用区域无数据时，基本信息相同字段带入费用明细
    setBaseToDetail (viewModal, data, param, divCodeList) {
        const sameArr = arBillCommonFun.getBaseData(viewModal, divCodeList).sameArr
        let item = param.data
        sameArr.forEach(ele => {
            if (!item[ele.dataField]) {
                item[ele.dataField] = ele.value
            }
        })
    },
    // 行程归集初始化
    initSch (viewModal, that) {
        let expTravelList = []
        const expAreaData = arBillCommonFun.expAreaData
        for (const i in expAreaData) {
            if (i.includes('04')) {
                expTravelList = expAreaData[i]
            }
        }
        travelFun.initDetailListener(viewModal) // 监听行程归集费用表单
        travelFun.initTravel(viewModal, expTravelList, that)
    }
}
