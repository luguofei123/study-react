/*
 * @Descripttion:
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-25 18:35:19
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-31 16:49:19
 */
import arBillCommonFun from "./arBillCommonFun"
import settlementFun from './settlementFun'
import travelFun from "./travelFun"
import service from "../const/service"
import utils from "../utils"
import billUtils from "../billUtils"
import abroadCostSummary from './abroadCostSummary' // 外币汇总区域

export default {
    relateAllAreaCode: '', // 关联区域所有区域code
    allDataField: {}, // 获取所有实体表字段
    // 初始化整理所有关联区域code
    initRelateAllAreaCde (children) {
        let allAreaCode = []
        children.forEach(ele => {
            const arr = ele.divCode.split('-')
            let code = ''
            arr.forEach((item, index) => {
                if (index > 0 && index < 2) {
                    code += item
                }
                if (index >= 2) {
                    code += '_' + item
                }
            })
            allAreaCode.push(code.toUpperCase())
        })
        this.relateAllAreaCode = allAreaCode.join(',')
    },
    // 初始化整理所有实体字段
    initRelateAllDataField (viewModal, divCodeList) {
        divCodeList.forEach(ele => {
            if (ele.data.length) {
                if (ele.type === 'RELATION' || ele.type === 'SETTLEMENT') {
                    this.allDataField[ele.type.toLowerCase()] = {}
                    this.allDataField[ele.type.toLowerCase()] = this.getFieldData(ele)
                } else {
                    this.allDataField[ele.type.toLowerCase()] = []
                    this.allDataField[ele.type.toLowerCase()] = this.getFieldList(ele)
                }
            }
        })
        // 初始化时候判断表格显示或者隐藏
        this.showOrHiddenTable(viewModal)

        // 初始化获取借款金额的合计
        arBillCommonFun.loadBillTotalMoney = this.getRelateBillDataTotalMoney(viewModal, 'LOAN')

        // 初始化判断借款isUseBgExe 是否作为
        arBillCommonFun.isUseBgExe = this.getIsUseBgExe(viewModal, 'LOAN')
    },
    getIsUseBgExe (viewModal, relationType) {
        let result = ''
        const relateBillData = arBillCommonFun.getAreaData(viewModal, 'RELATION')
        const arr = relateBillData.filter(item => item.relBillTypeCode.includes(relationType))
        let isUseBgExe = arr.map(i => i.isUseBgExe)
        isUseBgExe = Array.from(new Set(isUseBgExe))
        if (isUseBgExe.length === 1 && isUseBgExe[0] === 1) {
            result = 'Y'
        }
        return result
    },
    getFieldData (ele) {
        let fieldData = {}
        const data = ele.data
        data.forEach(item => {
            const children = item.children
            const settleCode = settlementFun.settleCode
            let rCode = item.rCode
            if (ele.type === 'SETTLEMENT') {
                rCode = settleCode.find(ele => ele.code === item.rCode).type
            }
            if (ele.type === 'RELATION') {
                const { enty } = item
                const { queryParams } = enty
                if (queryParams && queryParams.vops) {
                    const { items } = queryParams.vops
                    items.forEach(t => {
                        if (t.field === 'relBillTypeCode' || t.field === 'relBillType') {
                            rCode = t.value1
                        }
                    })
                }
            }
            fieldData[rCode.toLowerCase()] = []
            children.forEach(it => {
                if (it.dataField) {
                    const fieldArr = this.getReplaceItems(it)
                    fieldData[rCode.toLowerCase()].push(it.dataField)
                    fieldData[rCode.toLowerCase()] = [...fieldData[rCode.toLowerCase()], ...fieldArr]
                }
            })
            fieldData[rCode.toLowerCase()] = Array.from(new Set(fieldData[rCode.toLowerCase()]))
        })
        return fieldData
    },
    getFieldList (ele) {
        let fieldData = []
        const data = ele.data
        data.forEach(item => {
            const children = item.children
            children.forEach(it => {
                if (it.dataField) {
                    const fieldArr = this.getReplaceItems(it)
                    fieldData.push(it.dataField)
                    fieldData = [...fieldData, ...fieldArr]
                }
            })
        })
        return Array.from(new Set(fieldData))
    },
    // 获取带入关系的属性值
    getReplaceItems (it) {
        let fieldArr = []
        if (it.enty && it.enty.replaceItems) {
            const replaceItems = it.enty.replaceItems
            replaceItems.forEach(item => {
                if (item.to.fieldname && !item.to.fieldname.includes('displayname')) {
                    fieldArr.push(item.to.fieldname)
                }
            })
        }
        return fieldArr
    },
    // viewModal 当前模型数据
    // args 关联单据参照数据
    // billType 关联的单据类型 申请单:arApp  借款单:arLoan
    // 关联单据，逻辑处理赋值
    // billType 关联的单据类型 申请单:arApp  借款单:arLoan
    relateHandle (viewModal) {
        // 关联单据-选择申请
        viewModal.on('btn-apply', 'onChange', (args) => {
            // if (this.isRepeat(viewModal, args.data)) {
            //     return false
            // }
            this.relateChange(viewModal, args, 'APPLY')
        })
        // 关联单据-选择借款
        viewModal.on('btn-loan', 'onChange', (args) => {
            // if (this.isRepeat(viewModal, args.data)) {
            //     return false
            // }
            this.relateChange(viewModal, args, 'LOAN')

        })
        // 关联单据-选择事项申请
        viewModal.on('btn-apply-item', 'onChange', (args) => {
            // if (this.isRepeat(viewModal, args.data)) {
            //     return false
            // }
            this.relateChange(viewModal, args, 'APPLY_ITEM')

        })
    },
    // 关联单据重复判断
    isRepeat (viewModal, list) {
        debugger
        let isExist = false
        let existList = arBillCommonFun.getAreaData(viewModal, 'RELATION')
        existList.forEach(item => {
            if (Array.isArray(list)) {
                list.forEach(item1 => {
                    if (item.relBillId === item1.id) {
                        isExist = true
                    }
                })
            }
        })
        if (isExist) {
            viewModal.Message.info('单据已经关联过了！')
        }

        return isExist
    },
    // 判断关联区域显示方法抽取
    relationText (viewModal, relationData, type) {
        let arrText = []
        relationData.forEach(item => {
            if (item[type].includes('APPLY_') && item.isItemApply !== 1) {
                arrText.push('申请信息')
            }
            if (item[type].includes('LOAN_')) {
                arrText.push('借款信息')
            }
            if (item[type].includes('APPLY_') && item.isItemApply === 1) {
                arrText.push('事项申请')
            }
        })

        if ('relBillTypeCode' === type) {
            this.showOrHiddenTable(viewModal, arrText, 'relation', relationData)
        } else {
            this.showOrHiddenTable(viewModal, arrText)
        }

    },

    // 选择关联单据查询单据详情，进行单据赋值
    relateChange (viewModal, args, areaCode) {

        if (!(args.data)) {
            return false
        }
        if (viewModal.editMod() === 'view') {
            return false
        }



        // this.relationText(viewModal, args.data, 'billTypeCode')
        // if (this.isRepeat(viewModal, args.data)) {
        //     return false
        // }


        this.relateBill(viewModal, args, areaCode).then((resData) => {
            const treeData = viewModal.getNodeByCode('root').children
            const billData = resData.data || {}
            const billObj = arBillCommonFun.getAreaDataObj(viewModal)

            // 以下是显示关联区域的代码
            let relationData = [...billData['applyList'], ...billData['itemApplyList'], ...billData['loanList'], ...billObj['RELATION']]
            this.relationText(viewModal, relationData, 'relBillTypeCode')

            // 结算区域显示的代码

            // 以上是显示关联区域的代码
            setTimeout(() => {
                this.setVal(viewModal, treeData, billData, billObj) // 关联单据赋值
                // 行程归集初始化
                let allTravelRow = billData.tripList || []
                let allTripExpenseList = billData.expenseList.filter(i => i.travelId)
                if (allTravelRow.length) {
                    travelFun.tripInit(viewModal, allTravelRow, allTripExpenseList)
                }

                // 外币汇总初始化
                // if (billData?.sumInfo?.head && billData?.sumInfo?.data && billData?.sumInfo?.data?.length > 0) {
                //     abroadCostSummary.generalWaibiTable(viewModal, billData.sumInfo.head, billData.sumInfo.data)
                // }

                // this.getSchTravelData(viewModal, args.data)
            }, 500)


        })
    },
    //获取行程归集数据
    async getSchTravelData (viewModal, arr) {
        let allTravelRow = [];
        let allExpenseList = [];
        let funArr = []
        for (let i = 0; i < arr.length; i++) {
            let data = await this.getTransData(viewModal, arr[i].id, arr[i].billTypeCode);
            funArr.push(data)
        }
        // 所有接口返回后拼接数据
        Promise.all(funArr).then((res) => {
            console.log(res)
            for (var j = 0; j < res.length; j++) {
                allTravelRow.push(...res[j].travelRow)
                allExpenseList = [...allExpenseList, ...res[j].expenseList]
            }
            // 回写数据
            travelFun.tripInit(viewModal, allTravelRow, allExpenseList)
        }).catch(error => {
        })
    },
    // 调取后端接口获取行程数据
    async getTransData (viewModal, id, billTypeCode) {
        return new Promise(resolve => {
            // 请求接口
            const str = `billId=${id}&billTypeCode=${billTypeCode}`
            const res = viewModal.request({
                url: `/${service.BASE_BE_URL}/${'ar/travelbill/getTransformTravelParams'}?${str}`,
                waitfor: false,
            }).then(function (res) {
                resolve(res.data)
            })
        });
    },
    // 关联单据赋值
    setVal (viewModal, data, billData, billObj) {
        data.forEach(item => {
            const { dataType, name, enty, children, key: formKey } = item
            if (name !== 'root' && dataType === 'enty' && enty) {
                const { code } = enty.info
                const divCodeItem = arBillCommonFun.divCodeList.find(ele => ele.entyCode === code)
                if (divCodeItem && divCodeItem.type === 'BASE') {
                    this.relateBaseSetVal(viewModal, billData, children, formKey)
                } else {
                    // 当前区域数据
                    let values = this.relateAddUpData(viewModal, billObj, billData, divCodeItem) // 关联数据赋值，数据累加组装数据
                    const widget = viewModal.get(formKey)
                    //此处应该加上条件过滤
                    if (enty.queryParams && values) {
                        values = values.filter(rw => {
                            //这里应该合上主表信息
                            return arBillCommonFun.getEntyFormulaResult({
                                formula: enty.queryParams.items,
                                lvalues: rw,
                                rvalues: billData
                            })
                        })
                    }
                    if (widget && widget.loadData && values && values.length > 0) {
                        widget.loadData(values || [])
                        viewModal.setEntyValues(formKey, values || [])
                    }
                }
            } else {
                if (children && children.length) {
                    this.setVal(viewModal, children, billData, billObj)
                }
            }
        })
        return true
    },
    // 基本信息赋值
    relateBaseSetVal (viewModal, billData, children, formKey) {
        let data = {}
        children.forEach(ele => {
            if (!ele.displayValue) { // 数据为空时，数据带入
                data[ele.dataField] = billData.arBill[ele.dataField]
            }
            // 部门名字代入
            if (ele.dataField === 'internalDepCode' && billData.arBill[ele.dataField]) {
                data['internalDepName'] = billData.arBill['internalDepName']
            }
            // 出差人是多人的名称和code
            if (billData.arBill['travelerCode']) {
                data['travelerCode'] = billData.arBill['travelerCode']
                data['travelerName'] = billData.arBill['travelerName']
                data['posGradCode'] = billData.arBill['posGradCode']
                data['posGradName'] = billData.arBill['posGradName']
            }

        })
        // 关联区域处理多人员
        // let manyPerson = this.dealWithPersonInfo(viewModal, data, billData)
        viewModal.setEntyValues(formKey, data) // 更新基本信息
        viewModal.reloadWidgetData(formKey)
    },
    // 基本信息区域的字段
    // posGradCode 职级code
    // posGradName 职级name
    // travelerCode 人员code
    // travelerName 人员name
    // 陪同人员区域的字段
    // posGradCode
    // posGradName
    // person
    // personName


    dealWithPersonInfo (viewModal, data, billData) {
        let baseDataObj = arBillCommonFun.getAreaData(viewModal, 'BASE')?.[0]
        let { posGradCode, posGradName, travelerCode, travelerName } = baseDataObj
        let personList = billData?.personList || []
        let p1 = [posGradCode]
        let p2 = [posGradName]
        let p3 = [travelerCode]
        let p4 = [travelerName]
        personList.forEach((item, index) => {
            p1.push(item.posGradCode)
            p2.push(item.posGradName)
            p3.push(item.person)
            p4.push(item.personName)

        })
        data.posGradCode = p1.join(',')
        data.posGradName = p2.join(',')
        data.travelerCode = p3.join(',')
        data.travelerName = p4.join(',')

        return data
    },
    // 调取接口，获取关联数据
    relateBill (viewModal, params, areaCode) {
        return new Promise((resolve, reject) => {
            const dataList = params.data
            let isBringInCurrentBill = params.isBringInCurrentBill === 1 ? 1 : 2  // 1 是 2 否
            let relateData = {}
            if (Array.isArray(dataList)) {
                dataList.forEach(ele => {
                    relateData[ele.id] = ele.ele40Code || ''
                })
            } else {
                if (dataList.id) {
                    relateData[dataList.id] = dataList.ele40Code || '' // ele40Code余额
                } else {
                    reject('没有id')
                    return
                }

            }
            const data = {
                relationBillMap: relateData,
                areaCode: areaCode,
                allAreaCode: this.relateAllAreaCode,
                billTypeCode: arBillCommonFun.billContext.billTypeCode,
                selectAttrsMap: this.allDataField,
                isBringInCurrentBill: isBringInCurrentBill
            }
            const res = viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/bill/relateBill`,
                data,
                waitfor: false,
            })
            resolve(res)
        })

    },
    // 关联单据数据累加赋值
    relateAddUpData (viewModal, billObj, billData, divCodeItem) {
        let itemList = []
        const keys = divCodeItem.keys
        keys.forEach(ele => {
            if (billData[ele] && ele !== 'arBill') {
                itemList = [...itemList, ...billData[ele]]
            }
        })
        switch (divCodeItem.type) {
            case 'RELATION':
                // 关联区域需要将该区域先显示出来
                itemList = [...billObj[divCodeItem.type], ...itemList]
                // itemList = utils.filterData(itemList, 'relBillId')   // 去重复
                //  itemList[0]['relBillNo_url'] = 'https://yondif.yonyougov.top/yondif-pvdf-fe/#/BillRender?billId=20230829110133031251964044&status=0&editMod=view&code=CCSQDDR&appCode=ADK'
                break
            case 'DETAIL': // 费用明细
                // 目前费用数据累加，后续优化
                itemList = [...billObj[divCodeItem.type], ...itemList]
                break
            case 'FILE': // 附件信息
                itemList = [...billObj[divCodeItem.type], ...itemList] // 累加
                itemList = utils.filterData(itemList, 'attachFileId')   // 去重复
                break
            case 'BUDGET': // 指标信息
                itemList = [...billObj[divCodeItem.type], ...itemList] // 累加
                itemList = utils.filterData(itemList, 'bgtCode')   // 去重复
                break
            case 'SETTLEMENT': // 结算信息
                // 替换数据
                break
            case 'EMP': // 人员清单
                itemList = [...billObj[divCodeItem.type], ...itemList] // 累加
                break
            default:
                break
        }
        // 关联的数据id需要重新生成
        itemList.forEach(i => {
            //  if (!i.id) {
            i.id = viewModal.tools.guid()
            // }
        })

        return itemList

    },
    // 获取关联区域数据 relationType 为LOAN/APPLY
    getRelateBillDataTotalMoney (viewModal, relationType) {
        // 获取关联区域所有数据
        let total = 0
        const relateBillData = arBillCommonFun.getAreaData(viewModal, 'RELATION')
        const arr = relateBillData.filter(item => item.relBillTypeCode.includes(relationType))
        if (Array.isArray(arr)) {
            total = arr.reduce((total, next) => {
                return total + next.amt || 0
            }, 0)
        }
        return total
    },
    // 关联申请单，本次使用金额取“费用合计”与“可用余额”最小值min
    expAndApplyMinToAmt (viewModal) {
        // 浏览状态下，返回
        if (viewModal.editMod() === 'view') {
            return false
        }
        const relateUi = arBillCommonFun.getAreaDivCode('RELATION')
        if (relateUi.length) {
            const applyUi = billUtils.judgmentApply(relateUi, this.relateAllAreaCode)
            if (applyUi) {
                const { key } = applyUi
                if (!viewModal.get(key)) {
                    return false
                }
                //  const applyData = viewModal.get(key).getTableData().data
                const applyData = viewModal.get(key).state.data
                if (applyData && applyData.length === 1) {
                    const detailTotal = arBillCommonFun.detailTotal
                    // 关联申请单，本次使用金额取“费用合计”与“可用余额”最小值min
                    applyData[0].amt = detailTotal < utils.deStr(applyData[0].relBillBalAmt) ? detailTotal : utils.deStr(applyData[0].relBillBalAmt)
                    viewModal.get(key).loadData(applyData)
                    viewModal.setEntyValues(key, applyData)
                }
            }
            this.showOrHiddenTable(viewModal)
        }
    },
    // 有数据的时候才显示关联表格,没有数据就不显示
    showOrHiddenTable (viewModal, arr, type, list) {
        const relateUi = arBillCommonFun.getAreaDivCode('RELATION')
        let relateDt = arBillCommonFun.getAreaData(viewModal, 'RELATION')
        if (list) {
            relateDt = list
        }

        if (!arr && relateDt) {
            arr = []
            relateDt.forEach(item => {
                if (item.relBillTypeCode.includes('APPLY_') && item.isItemApply !== 1) {
                    arr.push('申请信息')
                }
                if (item.relBillTypeCode.includes('LOAN_')) {
                    arr.push('借款信息')
                }
                if (item.relBillTypeCode.includes('APPLY_') && item.isItemApply === 1) {
                    arr.push('事项申请')
                }
            })
        }

        let parentKey = ''
        relateUi.forEach(item => {
            parentKey = item.parentKey
            let itemModel = viewModal.get(item.divCode)
            if (itemModel) {

                if (itemModel.state.data.length === 0) {
                    viewModal.showNode(item.divCode, false)
                } else {
                    viewModal.showNode(item.divCode, true)
                }
            }
            if (arr) {
                if (arr && arr.indexOf(item.label) !== -1) {
                    viewModal.showNode(item.divCode, true)
                }
            }
        })
        let relationCollapse = viewModal.get(parentKey)
        // collapseflag true 折叠    false 展开
        if (relationCollapse?.state?.collapseflag === true) {
            if (relateDt.length > 0) {
                relationCollapse.collapseChange()
            }

        } else {

            if (relateDt.length === 0) {
                relationCollapse?.collapseChange()

            }
        }
        let number = relateDt.length
        // 还需要判断有几个事项申请单，因为事项申请单的高度不一样
        if (number > 0) {
            let APPLY_NUMBER = relateDt.filter(item => item.relBillTypeCode.includes('APPLY_') && item.isItemApply !== 1).length
            let LOAN__NUMBER = relateDt.filter(item => item.relBillTypeCode.includes('LOAN_')).length
            let APPLY_ITEM_NUMBER = relateDt.filter(item => item.relBillTypeCode.includes('APPLY_') && item.isItemApply === 1).length


            let height = APPLY_ITEM_NUMBER * 40 + APPLY_NUMBER * 80 + LOAN__NUMBER * 80
            if (number > 3) {
                viewModal.setHeight(parentKey, 250)
            } else {
                viewModal.setHeight(parentKey, 80 + height)
            }

        }

        if (arr && arr.length > 0 && type === 'copy') {
            viewModal.setHeight(parentKey, 80 + 100)
            relationCollapse.collapseChange()
        }

    }

}
