/**
 * 基本区域事件
 * @param {*} viewModal
 * @returns
 */
import service from '../const/service'
import commonMethod from '../utils'
import arBillCommonFun from "./arBillCommonFun"
import budgetFun from './budgetFun'
import empFun from './empFun'
import relationFun from './relationFun'
import rightFun from './rightFun'
import settlementFun from './settlementFun'
import travelFun from './travelFun'
import billUtils from '../billUtils'

export default {
    arBillBaseTem: [], // 基本信息元数据模板
    // 初始化默认赋值,
    initHandleData (viewModal) {
        const arBillData = arBillCommonFun.getAreaDivCode('BASE') // 获取基本信息数据
        this.arBillBaseTem = arBillData
        // 新增的单据有些字段需要赋默认值
        if (viewModal.editMod() === 'new') {
            // 给基本信息赋默认值
            let baseInitObj = this.getDefaultBaseData(viewModal)
            viewModal.setDMValue(arBillData[0].divCode, {
                billTypeCode: arBillCommonFun.billContext.billTypeCode, // 单据类型编码
                billTypeName: arBillCommonFun.billContext.billTypeName, // 单据类型名称
                billDate: commonMethod.formatDates(new Date()),         // 单据日期
                ...baseInitObj
            })
            // viewModal.reloadWidgetData(arBillData[0].divCode)
            // viewModal.on('202304041421520041678155477275', 'onChange', (param) => {
            //     debugger
            // })

        }

        this.initExRate(viewModal)   // 基本信息加载汇率

    },
    getDefaultBaseData (viewModal) {
        let yondifEnv = localStorage.getItem('yondifEnv')
        if (yondifEnv) {
            yondifEnv = JSON.parse(yondifEnv)
        }
        // 给部门赋值
        const deptCodeString = yondifEnv?.full?.dept?.deptCode
        const deptCodeArr = deptCodeString?.split('-') || []
        const internalDepCode = deptCodeArr[deptCodeArr.length - 1]
        const internalDepName = yondifEnv?.full?.dept?.deptName

        // 给报销人赋值 判断单据类型，报销单 expenserCode 申请单 proposerCode
        let personCode = ''
        let personName = ''
        let displayValue = ''
        let personObj = {}
        if (arBillCommonFun.billContext && arBillCommonFun.billContext.billTypeCode) {
            if (arBillCommonFun.billContext.billTypeCode.includes('APPLY')) {
                personCode = 'proposerCode'
                personName = 'proposer'
                // displayValue = 'proposerCode_displayValue'
            } else {
                personCode = 'expenserCode'
                personName = 'expenser'
                // displayValue = 'expenserCode_displayValue'
            }
        }
        // 给报销人或申请人赋值
        const personCodeString = yondifEnv?.full?.user?.userCode
        const personCodeArr = personCodeString?.split('-') || []
        const userCode = personCodeArr[personCodeArr.length - 1]
        const userName = yondifEnv?.full?.user?.userName
        personObj[personCode] = userCode
        personObj[personName] = userName
        // personObj[displayValue] = '00001818 王五'

        return {
            internalDepCode, internalDepName, ...personObj

        }
    },
    // 监听币种人民币金额，值变化带入指标、结算
    onRmbCurrencyAmtListener (viewModal) {
        // 监听基本信息币种人民币金额，带入指标和结算
        const arBillData = arBillCommonFun.getAreaDivCode('BASE') // 获取基本信息数据
        if (arBillData && arBillData.length) {
            const baseChildren = arBillData[0].children // 获取基本信息信息项
            baseChildren.forEach(item => {
                const { dataField, divCode } = item
                if (dataField === 'rmbCurrencyAmt' || dataField === 'amt') {
                    // 监听金额数据变化，带入到指标信息和结算信息
                    viewModal.on(divCode, 'onChange', (param) => {
                        if (dataField === 'rmbCurrencyAmt') {
                            viewModal.setEntyValues(arBillData[0].divCode, {
                                amt: param.data
                            })
                        }
                        arBillCommonFun.ToBudgetTotal = param.data // 带入到指标金额
                        arBillCommonFun.ToSettmentTotal = param.data // 带入到结算金额
                        arBillCommonFun.detailTotal = param.data
                        budgetFun.changeBudgetTotal(viewModal)  // 金额代入指标
                        settlementFun.generalSettlementByTypeOne(viewModal) // 金额带入到结算
                        relationFun.expAndApplyMinToAmt(viewModal) // 金额和申请可用金额取最小值

                        billUtils.showFootInfo(viewModal)
                    })
                }
            })
        }
    },
    onBaseLister (viewModal) {
        const billTypeCode = arBillCommonFun.billContext.billTypeCode // 单据类型
        if (billTypeCode.includes('TRIP')) { // 差旅费，出国费获取费用标准
            const arBillData = arBillCommonFun.getAreaDivCode('BASE')
            if (arBillData && arBillData.length) {
                const children = arBillData[0].children
                children.forEach(item => {
                    const { dataField, divCode } = item
                    if (dataField === 'arriPlaceCode' || dataField === 'vehicleCode') {
                        viewModal.on(divCode, 'onChange', param => {
                            const data = arBillCommonFun.getAreaData(viewModal, 'BASE')?.[0]
                            if (data.arriPlaceCode) {
                                const obj = {
                                    billTypeCode: billTypeCode,
                                    vehicleCode: data.vehicleCode ? data.vehicleCode.split(',')[0] : '2',
                                    vehicleName: data.vehicleName ? data.vehicleName.split(',')[0] : '火车',
                                    arriPlaceCode: data.arriPlaceCode.split(',')[0],
                                    arriPlaceName: data.arriPlaceName.split(',')[0],
                                    meetingType: ''
                                }
                                rightFun.getExpenseStandard(viewModal, obj, '04') // 差旅费获取右侧费用标准
                            }
                        })

                        // 查看或编辑的时候
                        const data = arBillCommonFun.getAreaData(viewModal, 'BASE')?.[0]
                        if (data.arriPlaceCode) {
                            const obj = {
                                billTypeCode: billTypeCode,
                                vehicleCode: data.vehicleCode ? data.vehicleCode.split(',')[0] : '2',
                                vehicleName: data.vehicleName ? data.vehicleName.split(',')[0] : '火车',
                                arriPlaceCode: data.arriPlaceCode.split(',')[0],
                                arriPlaceName: data.arriPlaceName.split(',')[0],
                                meetingType: ''
                            }
                            rightFun.getExpenseStandard(viewModal, obj, '04') // 差旅费获取右侧费用标准
                        }
                    }
                })
            }
        }
    },
    // 费用区域有数据时，基本信息相同字段带入费用明细
    setBaseToDetailItem (viewModal, divCodeList) {
        const sameArr = arBillCommonFun.getBaseData(viewModal, divCodeList).sameArr
        const sameObj = arBillCommonFun.getBaseData(viewModal, divCodeList).sameObj
        const base = divCodeList.filter(item => item.type === 'BASE')[0].data // 获取基本信息的字段
        const allData = viewModal.getEntyValues()
        let changeObj = {}
        base.forEach(item => {
            const { divCode, nodeType } = item
            viewModal.on(divCode, 'onChange', (param) => {
                debugger
                sameArr.forEach(item => {
                    for (const i in param.data) {
                        if (item.dataField === i) {
                            item.value = param.data[i]
                        }
                    }
                })
                for (const j in allData) {
                    for (const z in sameObj) {
                        // divCode一致的情况才赋值
                        if (j === z && allData[j].data.length > 0) {
                            changeObj[j] = allData[j].data
                        }
                    }
                }
                if (JSON.stringify(changeObj) !== '{}') {
                    for (const l in changeObj) {
                        changeObj[l].forEach(item => {
                            sameArr.forEach(ele => {
                                if (!item[ele.dataField]) {
                                    item[ele.dataField] = ele.value
                                }
                            })
                        })
                        viewModal.loadTableData(l, changeObj[l]);
                    }
                }

            })
        })
    },
    // 费用合计导入到基本信息币种人民币金额和核定人民币金额
    sendBaseAssignAmt (viewModal) {
        const arBillData = arBillCommonFun.getAreaDivCode('BASE') // 获取基本信息数据
        viewModal.setEntyValues(arBillData[0].divCode, {
            amt: arBillCommonFun.ToBaseAmt,
            rmbCurrencyAmt: arBillCommonFun.ToBaseRmbCurrencyAmt,
            visitNum: empFun.visitNum,
            accomNum: empFun.accomNum
        })
        viewModal.reloadWidgetData(arBillData[0].divCode)
    },
    // 接收发送的数据给基本信息赋值, data为对象
    sendDataUpdateBase (viewModal, data) {
        const arBillData = arBillCommonFun.getAreaDivCode('BASE') // 获取基本信息模板数据
        viewModal.setEntyValues(arBillData[0].divCode, data) // 更新基本信息
        viewModal.reloadWidgetData(arBillData[0].divCode) // 刷新
    },
    // 判断基本信息区域有没有汇率，有的话需要加载数据
    initExRate (viewModal) {
        if (viewModal.get('ExRate')) {
            viewModal.request({
                url: `/${service.BASE_BE_URL}/${'ar/basedata/getCurrencyExRate?billTypeCode='}${arBillCommonFun.billContext.billTypeCode}`,
                method: 'GET',
                waitfor: false,
            }).then(res => {
                if (res.error === false) {
                    debugger
                    const data = res.data
                    const list = data.map((item, index) => {
                        return {
                            currencyName: item.currencyName,
                            currencyCode: item.currencyCode,
                            exRate: item.exRate,
                            opacity: 0,
                            isCheck: false
                        }
                    })
                    const baseDataObj = arBillCommonFun.getAreaData(viewModal, 'BASE')?.[0]
                    let exRate = baseDataObj?.exRate
                    this.updateExrate(viewModal, exRate, list)


                } else {
                    viewModal.Message.error(`${res.message}`)
                }
            })
        }
    },
    // 更新汇率
    updateExrate (viewModal, exRate, list) {
        if (exRate && typeof exRate === 'string' && exRate.includes('{')) {
            exRate = JSON.parse(exRate)
            list.forEach(item => {
                Object.keys(exRate).forEach(key => {
                    if (item.currencyCode === key) {
                        item.exRate = exRate[key]
                        item.isCheck = true
                    }
                })
            })

        }
        viewModal.get('ExRate').updateExrate(list)
        viewModal.on('ExRate', 'onClick', param => {
            this.saveExRateForBaseData(viewModal, param)


        })
    },
    // 保存汇率
    saveExRateForBaseData (viewModal, param) {
        let resultList = viewModal.get('ExRate').getExrateData() || []
        this.setExRateForBaseData(viewModal, resultList, param.data.data, param)

    },
    // 汇率转换格式
    setExRateForBaseData (viewModal, list, selectList, param) {
        let obj = {}
        selectList.forEach(item => {
            obj[item['currencyCode']] = item['exRate']
        })
        obj = JSON.stringify(obj)
        const arBillData = arBillCommonFun.getAreaDivCode('BASE') // 获取基本信息模板数据
        viewModal.setEntyValues(arBillData[0].divCode, { exRate: obj }) // 更新基本信息汇率
        viewModal.reloadWidgetData(arBillData[0].divCode) // 刷新

        // 行程更新
        travelFun.updataByBaseExRate(viewModal, param)

    },
    // 基本信息培训计划改变，查询额度 trainOrMeetingType
    changeTrainOrMeetingType (viewModal) {
        setTimeout(() => {

            const baseDivCode = arBillCommonFun.getAreaDivCode('BASE')
            let baseDataObj = arBillCommonFun.getAreaData(viewModal, 'BASE')[0]
            let quotaCriDivCode = ''
            let isInterDiv = '';
            let meetingTypeCode = '';
            let filterDataAll = []
            baseDivCode.forEach(ele => {
                if (ele.children && ele.children.length) {
                    const children = ele.children
                    children.forEach(item => {
                        if (item.dataField === 'trainingTypeCode' || item.dataField === 'meetingTypeCode') {
                            let meetingTypeModel = viewModal.get(item.divCode)
                            filterDataAll = meetingTypeModel.state.options || []
                            if (baseDataObj?.isInter === 1) {
                                let filterData = filterDataAll.filter(i => {
                                    i.customLabelContent = i.eleName
                                    return i.eleCode >= 5
                                })
                                meetingTypeModel.loadData(filterData)
                            }
                            if (baseDataObj?.isInter === 0) {
                                let filterData = filterDataAll.filter(i => {
                                    i.customLabelContent = i.eleName
                                    return i.eleCode < 5
                                })
                                meetingTypeModel.loadData(filterData)
                            }

                            viewModal.on(item.key, 'onChange', data => {

                                if (item.dataField === 'meetingTypeCode' && data.data?.eleCode < 5 && viewModal.get(isInterDiv).state.value == 1) {
                                    viewModal.get(item.divCode).update({ value: '' })
                                    viewModal.Message.warn('国际会议仅可选择国际会议类别', 2)
                                }
                                let expenseType = ''
                                const billTypeCode = arBillCommonFun.billContext.billTypeCode
                                if (billTypeCode.includes('MEETING')) {
                                    expenseType = 'MEETING'
                                } else if (billTypeCode.includes('CULTIVATE')) {
                                    expenseType = 'CULTIVATE'
                                } else {
                                    expenseType = ''
                                }
                                let param = new FormData()
                                param.append('expenseType', expenseType)
                                param.append('searchKey', '')
                                param.append('pageIndex', 1)
                                param.append('pageSize', 1)
                                if (!billTypeCode.includes('CULTIVATE')) {
                                    param.append('type', data?.data?.eleCode || data?.data?.value || 'M01')
                                } else {
                                    param.append('type', data?.data?.eleCode || data?.data?.value || '1')
                                }
                                viewModal.post({
                                    url: `/${service.BASE_BE_URL}/ar/basicset/setting/query`,
                                    data: param,
                                    waitfor: false,
                                }).then(res => {
                                    if (res.error === false) {
                                        if (quotaCriDivCode) {
                                            let result = {}
                                            if (quotaCriDivCode && expenseType === 'MEETING') {
                                                result = res.data.meetingStandardSetting[0] || {}

                                            }
                                            if (quotaCriDivCode && expenseType === 'CULTIVATE') {
                                                result = res.data.cultivateStandardSetting[0] || {}
                                            }

                                            if (viewModal.get(isInterDiv) != null && viewModal.get(isInterDiv).state.value != 1) {
                                                viewModal.get(quotaCriDivCode).update({ value: commonMethod.toThousandFix(result.quotaTotal || 0) })
                                            } else if (viewModal.get(isInterDiv) == null) {
                                                viewModal.get(quotaCriDivCode).update({ value: commonMethod.toThousandFix(result.quotaTotal || 0) })
                                            }
                                        }
                                    } else {
                                        viewModal.Message.error(`${res.message}`)
                                    }
                                })
                                const params = {
                                    billTypeCode: billTypeCode,
                                    meetingType: data?.data?.eleCode || ''
                                }
                                rightFun.getExpenseStandard(viewModal, params, '03') // 根据培训类型、会议类型获取右侧费用标准
                            })
                        }
                        if (item.dataField === 'isInter') {
                            isInterDiv = item.divCode
                            viewModal.on(item.divCode, 'onChange', data => {
                                if (data.data == 1) {
                                    let filterData = filterDataAll.filter(i => {
                                        i.customLabelContent = i.eleName
                                        return i.eleCode >= 5
                                    })
                                    viewModal.get(meetingTypeCode).loadData(filterData)
                                    viewModal.get(meetingTypeCode).update({ value: '' })

                                }
                                if (data.data == 0) {
                                    let filterData = filterDataAll.filter(i => {
                                        i.customLabelContent = i.eleName
                                        return i.eleCode < 5
                                    })
                                    viewModal.get(meetingTypeCode).loadData(filterData)
                                    viewModal.get(meetingTypeCode).update({ value: '' })

                                }
                            })
                        }
                        // 综合额定标准divcode
                        if (item.dataField === 'quotaCri') {
                            quotaCriDivCode = item.divCode
                        }
                        // 综合额定标准divcode
                        if (item.dataField === 'meetingTypeCode') {
                            meetingTypeCode = item.divCode
                        }
                    })
                }
            })

        }, 300)
    },
    // 单据回显时，根据培训类型和会议类型获取右侧费用标准
    initTrainOrMeetingType (viewModal) {
        if (viewModal.editMod() === 'view' || viewModal.editMod() === 'edit') {
            let expenseType = ''
            let meetingType = ''
            const billTypeCode = arBillCommonFun.billContext.billTypeCode
            const baseDivCode = arBillCommonFun.getAreaDivCode('BASE')
            const formKey = baseDivCode[0].key
            const entyValues = viewModal.getEntyValues()
            const formData = entyValues[formKey].data
            if (billTypeCode.includes('MEETING')) {
                expenseType = 'MEETING'
                meetingType = formData.meetingTypeCode
            } else if (billTypeCode.includes('CULTIVATE')) {
                expenseType = 'CULTIVATE'
                meetingType = formData.trainingTypeCode
            } else {
                return false
            }
            if (meetingType) {
                const params = {
                    billTypeCode: billTypeCode,
                    meetingType: meetingType,
                }
                rightFun.getExpenseStandard(viewModal, params, '03')
            }
        }
    },
}
