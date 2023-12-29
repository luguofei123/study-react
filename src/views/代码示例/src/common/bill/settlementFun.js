/*
 * @Descripttion: 结算信息事件
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-27 09:52:47
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-31 11:18:56
 */
import arBillCommonFun from "./arBillCommonFun"
import service from '../const/service'
import arLoanCommonFun from "./arLoanCommonFun"
import AccountTabDialog from '@/components/AccountTabDialog'
import travelFun from './travelFun'

export default {
    settleCode: [
        { type: 'EXCHANGE', code: '4', name: '退换汇' },
        { type: 'PAY', code: '5', name: '汇款转账' },
        { type: 'BUSINESS', code: '1', name: '公务卡' },
        { type: 'CHECK', code: '3', name: '支票' },
        { type: 'CASH', code: '2', name: '现金' }
    ], // 结算方式数据
    settlemenTypeSize: 0,  // 有几种显示的结算方式
    // 监听结算表格列Blur事件
    onListenDetailCellBlur (viewModal, item, children) {
        children.forEach(ele => {
            if (ele.dataField) {
                viewModal.on(ele.divCode, 'onCellBlur', (param) => {
                    arLoanCommonFun.quotaCheckHandle(viewModal, param) // 借款单是否限额支票逻辑
                    // 公务卡 刷卡金额带入到消费金额
                    let colFieldName = param.colFieldName
                    let index = param.index
                    if (colFieldName === 'consumeAmt') {
                        let tableData = viewModal.get(ele.parentKey)?.getTableData()?.data || [] // 获取表格数据
                        let obj = param.data
                        obj.amt = obj.consumeAmt
                        tableData[index] = obj
                        viewModal.get(ele.parentKey).loadData(tableData)
                        viewModal.setEntyValues(ele.parentKey, tableData)


                    }
                })
            }
        })
    },
    // 结算区域只有一条数据时，获取当前表格的divCode
    getOneDataDivCode (viewModal) {
        const entyValues = viewModal.getEntyValues()
        const data = arBillCommonFun.divCodeList.find(ele => ele.type === 'SETTLEMENT')
        const settleData = {
            key: '',
            data: []
        }
        data.data.forEach(ele => {
            if (entyValues[ele.key].data && entyValues[ele.key].data.length === 1) {
                settleData.key = ele.key
                settleData.data = entyValues[ele.key].data
            }
        })
        return settleData
    },
    // 01 费用合计汇总生成结算
    generalSettlementByTypeOne (viewModal) {
        const settleNum = arBillCommonFun.judgmentDataNum(viewModal, 'SETTLEMENT') // 判断结算数据条数
        const drCr = arBillCommonFun.ToSettmentTotal < 0 ? '2' : '1'
        const amt = arBillCommonFun.ToSettmentTotal < 0 ? arBillCommonFun.ToSettmentTotal * -1 : arBillCommonFun.ToSettmentTotal
        const flag = arLoanCommonFun.isBillQuotaCheck(viewModal)
        if (settleNum === 0 && amt > 0) { // 结算数据0条
            // 判断是否限额支票借款，是则不生成结算
            if (flag) {
                return false
            }
            // setModeCode 1:公务卡，2:现金，3:支票，4:退换汇，5:汇款转账
            const setModeCode = '5' // 默认结算方式
            const param = [
                {
                    id: viewModal.tools.guid(),
                    drCr: drCr,
                    amt: amt, // 合计
                    setModeCode: setModeCode // 汇款转账
                }
            ]
            const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
            const item = divCodeArr.find(ele => ele.rCode === setModeCode)
            if (item) {

                this.showOrHiddenTableByDate(viewModal, param)
                setTimeout(() => {
                    const widget = viewModal.get(item.key)
                    if (widget && widget.loadData) {
                        widget.loadData(param)
                        viewModal.setEntyValues(item.key, param)
                    }
                }, 300)
            }
        }
        if (settleNum === 1) { // 结算数据1条
            const settleData = this.getOneDataDivCode(viewModal)
            settleData.data[0].drCr = drCr
            settleData.data[0].amt = amt
            if (flag) { // 是否限额支票=是，限额金额=借款金额
                settleData.data[0].eachQuotaAmount = amt
            }
            this.showOrHiddenTableByDate(viewModal, settleData.data)
            setTimeout(() => {
                viewModal.get(settleData.key).loadData(settleData.data)
                viewModal.setEntyValues(settleData.key, settleData.data)
            }, 300)

        }
    },
    // 02 费用明细按汇总要素汇总生成
    generalSettlementByTypeTwo (viewModal, param, divCode, type) {
        viewModal.post({
            url: `/${service.BASE_BE_URL}/ar/bill/getSettlementsByConfig`,
            data: param,
            waitfor: false,
        }).then(res => {
            if (res.code === 200) {
                if (divCode) {
                    viewModal.get(divCode).loadData(res.data.expList || [])
                }
                // 刷新行程数据，更新结算id
                if (type === 'trip') {
                    travelFun.detailList = res.data.expList
                    // 行程归集初始化 res.data.expList

                    travelFun.detailList.forEach(item => {
                        item[arBillCommonFun.expenseDetailCode] = item.expenseDetailList
                    })

                    // let allTravelRow = billData.tripList || []
                    // let allTripExpenseList = billData.expenseList.filter(i => i.travelId)
                    // if (allTravelRow.length) {
                    //     travelFun.tripInit(viewModal, allTravelRow, allTripExpenseList)
                    // }
                }
                this.showOrHiddenTableByDate(viewModal, res.data.settlementList)
                setTimeout(() => {
                    this.loadSettleData(viewModal, res.data.settlementList)
                }, 300)
            }
        })
    },
    // 结算表格刷新
    loadSettleData (viewModal, data) {
        const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
        divCodeArr.forEach(item => {
            const { enty, key: formKey } = item
            const widget = viewModal.get(formKey)
            let values = []
            //此处应该加上条件过滤
            if (enty.queryParams && data) {
                values = data.filter(rw => {
                    //这里应该合上主表信息
                    return arBillCommonFun.getEntyFormulaResult({
                        formula: enty.queryParams.items,
                        lvalues: rw,
                        rvalues: {}
                    })
                })
            }
            if (widget && widget.loadData) {
                widget.loadData(values || [])
                viewModal.setEntyValues(formKey, values || [])
            }
        })
    },
    // 02 费用要素汇总生成-更新金额、户名、开户行等
    updateSettleByConfig (viewModal, data, dataField) {
        const flag = this.isDataFieldFlag(viewModal, data, dataField)
        if (flag) {
            let settleData = arBillCommonFun.getAreaData(viewModal, 'SETTLEMENT')
            settleData.forEach(ele => {
                if (ele.id === data.settlementId) {
                    ele[dataField] = data[dataField]
                }
            })
            this.showOrHiddenTableByDate(viewModal, settleData)
            setTimeout(() => {
                this.loadSettleData(viewModal, settleData)
            }, 300)
        }
    },
    // 更新结算数据，判断当前字段是否存在
    isDataFieldFlag (viewModal, data, dataField) {
        let flag = false
        const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
        let dataFieldData = []
        const payItem = divCodeArr.find(ele => ele.rCode === data.setModeCode)
        if (payItem) {
            dataFieldData = payItem.children
            flag = dataFieldData.some(ele => ele.dataField === dataField)
        }
        return flag
    },
    onRowDeleteSettlement (viewModal, bSumAmtData, children, enty, divCode, code, item) {

        if (!viewModal.get('settlementWrapper')) return
        let dataList = viewModal.get(divCode).getTableData().data
        if (dataList && dataList.length === 0) {
            this.settlemenTypeSize -= 1
            viewModal.showNode(item.parentKey, false)
            if (enty.queryParams) { // 当前节点是否配置过滤条件，获取过滤的变量
                let rCode = []
                const items = enty.queryParams.items
                items.forEach(it => {
                    rCode.push(it.r.code)
                })
                let rCodeStr = rCode.join(',')
                this.setllementBtn(viewModal, rCodeStr, true)

            }
            this.setSettleHeight(viewModal, this.settlemenTypeSize)
        }


    },
    initTableClick (viewModal) {
        const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
        divCodeArr.forEach(item => {
            viewModal.on(item.key, 'onCellClick', (param) => {
                if (viewModal.editMod() === 'view') {
                    return false
                }
                let dataField = param.col.dataField
                if (dataField === 'payeeAcctName' || dataField === 'payeeAcctBankName') {
                    this.openModal(viewModal, param, item.key)
                }
            })
        })
        // 结算按钮点击
        this.settleButtonClick(viewModal)
        this.showOrHiddenTableByDate(viewModal, [])
    },
    // 结算付款人弹窗
    AccountTabDialog: null,
    openModal (viewModal, props, Pkey) {
        this.AccountTabDialog = React.createRef('AccountTabDialog')
        const div = document.createElement('div')
        document.body.appendChild(div)
        let param = {
            record: props.record

        }
        ReactDOM.render(<AccountTabDialog ref={this.AccountTabDialog} confirm={this.accountTabDialogConfirm.bind(this, viewModal, props, Pkey)}  {...param} />, div)

    },
    accountTabDialogConfirm (viewModal, props, Pkey, obj) {
        let oldObj = JSON.parse(JSON.stringify(props.record))
        // 获取当前表格的数据
        let tableData = viewModal.get(Pkey)?.getTableData()?.data || [] // 获取表格数据
        tableData.forEach((item, index) => {
            if (item.id === oldObj.id) {
                // 带入值

                // oldObj.payeeAcctName = obj.payeeAcctName
                // oldObj.payeeAcctNo = obj.payeeAcctNo
                // oldObj.payeeAcctBankName = obj.payeeAcctBankName
                delete obj.id
                delete oldObj.payeeAcctName_displayValue

                oldObj = { ...oldObj, ...obj }
                tableData[index] = oldObj
            }
        })

        viewModal.get(Pkey).loadData(tableData)
        viewModal.setEntyValues(Pkey, tableData)
    },
    // 结算区域显示或隐藏控制
    // 显示的逻辑  手动点击/该区域有数据 显示该区域
    // 隐藏的逻辑  该区域无数据
    // 按钮区域和表格区域显示刚好相反
    // 计算高度
    settleButtonClick (viewModal) {
        if (!viewModal.get('settlementWrapper')) return
        const settlementBtns = viewModal.getNodeByCode('settlement-btn-tools').children
        const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
        settlementBtns.forEach(item => {
            viewModal.on(item.key, 'onClick', param => {
                divCodeArr.forEach(ele => {
                    if (ele.rCode === '1' && item.divCode === 'settlement_btn_bus') {
                        this.settlemenTypeSize += 1
                        viewModal.showNode(ele.parentKey, true)
                        viewModal.showNode('settlement_btn_bus', false)
                    }
                    if (ele.rCode === '2' && item.divCode === 'settlement_btn_cash') {
                        this.settlemenTypeSize += 1
                        viewModal.showNode(ele.parentKey, true)
                        viewModal.showNode('settlement_btn_cash', false)
                    }
                    if (ele.rCode === '3' && item.divCode === 'settlement_btn_check') {
                        this.settlemenTypeSize += 1
                        viewModal.showNode(ele.parentKey, true)
                        viewModal.showNode('settlement_btn_check', false)
                    }
                    if (ele.rCode === '4' && item.divCode === 'settlement_btn_exc') {
                        this.settlemenTypeSize += 1
                        viewModal.showNode(ele.parentKey, true)
                        viewModal.showNode('settlement_btn_exc', false)
                    }
                    if (ele.rCode === '5' && item.divCode === 'settlement_btn_pay') {
                        this.settlemenTypeSize += 1
                        viewModal.showNode(ele.parentKey, true)
                        viewModal.showNode('settlement_btn_pay', false)
                    }
                })

                this.setSettleHeight(viewModal, this.settlemenTypeSize)

            })
        })
    },
    // 关联的时候 复制的时候 自动带出结算的时候，需要先显示表格后，然后在填充数据 数据中一定要含有结算类型
    showOrHiddenTableByDate (viewModal, list) {
        // 获取数据中所有的结算类型，并去重
        if (!viewModal.get('settlementWrapper')) return
        this.settlemenTypeSize = 0
        const setlementBillData = arBillCommonFun.getAreaData(viewModal, 'SETTLEMENT')
        if (list) {
            list = [...setlementBillData, ...list]
        }
        let setModeCodes = list.map(item => item.setModeCode)
        setModeCodes = Array.from(new Set(setModeCodes))
        const divCodeArr = arBillCommonFun.getAreaDivCode('SETTLEMENT') // 获取结算区域容器编码
        if (setModeCodes.length) {
            divCodeArr.forEach(ele => {
                viewModal.showNode(ele.parentKey, false)
                this.setllementBtn(viewModal, ele.rCode, true)
                setModeCodes.forEach(value => {
                    if (ele.rCode === value) {
                        viewModal.showNode(ele.parentKey, true)
                        this.settlemenTypeSize += 1
                        this.setllementBtn(viewModal, ele.rCode, false)
                    }
                })
            })
        } else {
            divCodeArr.forEach(ele => {
                viewModal.showNode(ele.parentKey, false)
                this.setllementBtn(viewModal, ele.rCode, true)
            })
        }
        this.setSettleHeight(viewModal, this.settlemenTypeSize)

    },

    setSettleHeight (viewModal, size) {
        debugger
        if (!viewModal.get('settlementWrapper')) return
        let height = 200
        let parentkey = 'settlementWrapper'

        let btns = viewModal.getNodeByCode('settlement-btn-tools').children

        if (viewModal.editMod() === 'view') {
            viewModal.showNode('settlement-btn-tools', false)
        } else {

            if (this.settlemenTypeSize === btns.length) {
                viewModal.showNode('settlement-btn-tools', false)
            } else {
                viewModal.showNode('settlement-btn-tools', true)
            }
        }
        viewModal.setHeight(parentkey, height + size * 200)
    },
    setllementBtn (viewModal, code, bool) {
        if (!viewModal.get('settlementWrapper')) return
        if (code === '1') {
            viewModal.showNode('settlement_btn_bus', bool)
        }
        if (code === '2') {
            viewModal.showNode('settlement_btn_cash', bool)
        }
        if (code === '3') {
            viewModal.showNode('settlement_btn_check', bool)
        }
        if (code === '4') {
            viewModal.showNode('settlement_btn_exc', bool)
        }
        if (code === '5') {
            viewModal.showNode('settlement_btn_pay', bool)
        }
    }


}

