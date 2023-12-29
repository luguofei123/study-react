/*
 * @Descripttion: 报销标准
 * @version:
 * @Author: fulxa
 * @Date: 2023-05-29 16:52:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 09:59:20
 */
import commonMethod from '@/common/utils'
import service from "../../../common/const/service";
import agentTree from '@/common/agentTree'
import arBillCommonFun from "../../../common/bill/arBillCommonFun"; // 工具方法
export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([
            { code: 'openSeason', label: '打开城市旺季' },
            { code: 'deleteRow', label: '删除' },
            { code: 'save', label: '保存' }
        ], []),
        searchKey: '',
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        cswjCode: 'SZCSWJ',
        tableCode: '',
        searchCode: '',
        selectedTree: {}, // 选中的树节点
        settingData: {}, // 查询的费用标准
        entyKey: '', // 获取实体的key
        isStandard: '',
        moneyCtrlType: '',
        base: '',
        context: {}, // 查询上下文
        standSetting: '', // 培训费和会议费取值的key
        arBasicExpenseSetting: {},
        parentWrap: [],
        localStands: false, // 是否国内或者国外标准
        treeClick: false,
        agentTree: '20230802085121078180922229327965',
        agencyCode: '',
        mofDivCode: '',
        treeInfo: null,
        created () {

        },
        mounted () {
            result.treeInfo = viewModal.getNodeByCode('expenseTree').enty.info

            agentTree.getAgentTree(viewModal, result.agentTree).then(res => {
                result.agencyCode = res.agencyCode
                result.mofDivCode = res.mofDivCode
                result.base = viewModal.getNodeByCode('standard').children[0].key
                result.context = viewModal.getContext()
                result.selectTree()

                result.insertTreeData(viewModal)

                // 监听单位树
                viewModal.on(result.agentTree, 'onChange', (param) => {
                    result.agencyCode = param.data.agencyCode
                    result.mofDivCode = param.data.mofDivCode
                    let leftTreeModel = viewModal.get('expenseTree')



                    // 刷新左侧的树
                    result.leftTreeFresh(leftTreeModel)
                    // leftTreeModel.selectNode(result.selectedTree.data) // 默认选中第一个
                })

                if (viewModal.get('moneyCtrlTypeDiv')) {
                    viewModal.get('moneyCtrlTypeDiv').loadData([{ label: '不提醒', value: 1 }, { label: '保存时弹窗提醒', value: 2 }, { label: '禁止保存', value: 3 }])
                }
            })


        },
        // 调用参照接口刷新左侧树
        leftTreeFresh (leftTreeModel) {
            let params = {
                refCode: result.treeInfo.refCode,
                fullname: result.treeInfo.uri,
                "condition": {
                    "isExtend": true,
                    "simpleVOs": [
                        {
                            "field": "mofDivCode",
                            "op": "eq",
                            "value1": result.mofDivCode
                        },
                        {
                            "field": "agencyCode",
                            "op": "eq",
                            "value1": result.agencyCode
                        }
                    ]
                },
                "treeCondition": {
                    "isExtend": true,
                    "simpleVOs": [
                        {
                            "field": "mofDivCode",
                            "op": "eq",
                            "value1": result.mofDivCode
                        },
                        {
                            "field": "agencyCode",
                            "op": "eq",
                            "value1": result.agencyCode
                        }
                    ]
                }
            }

            viewModal.post({
                url: `/${service.BASE_BE_URL}/bill/ref/getRefData`,
                data: params,
                waitfor: true
            }).then(res => {
                if (res.code === 200) {
                    if (Array.isArray(res.data)) {
                        leftTreeModel.loadData(res.data)
                        leftTreeModel.selectNode(res.data[0]) // 默认选中第一个
                    } else {
                        leftTreeModel.loadData([])
                    }
                }
            })


        },
        // 因为树结构的数据是参照，该接口不归我们控制，需要轮询 目的是获取到数据，可以插入一条数据，或者是选择默认节点
        insertTreeData (viewModal) {
            let timeHander = null
            let func = (viewModal) => {
                let leftTreeModel = viewModal.get('expenseTree')
                let treeData = leftTreeModel?.state?.treeData || []
                if (treeData.length === 0) {
                    timeHander = setTimeout(() => {
                        func(viewModal)
                    }, 300)
                } else {
                    clearTimeout(timeHander)
                    // let obj = {
                    //     contactTitleContent: '默认系统',
                    //     mofDivCode: 'SYS',
                    //     nofDivName: '默认系统',
                    //     key: 'SYS',
                    //     title: '默认系统',
                    //     displayName: '默认系统',
                    //     expenseItemName: '默认系统',
                    //     expenseItemCode: 'SYS',
                    //     id: 'SYS'
                    // }
                    // treeData.unshift(obj)
                    // leftTreeModel.loadData(treeData)
                    leftTreeModel.selectNode(treeData[0]) // 默认选中第一个
                    result.selectedItem = treeData[0]
                }
            }
            func(viewModal)
        },
        selectTree () {
            let parentWrap = []
            viewModal.showNode('stand_wrap', true)

            viewModal.on('expenseTree', 'onSelect', param => {
                result.treeClick = true
                result.getSetting(param).then(res => {
                    if (res.error === false) {
                        result.settingData = res.data
                        result.selectedTree = param
                        result.total = res.data.stdLsCount
                        result.treeClick = false
                        result.arBasicExpenseSetting = res.data.arBasicExpenseSetting
                        result.isStandard = res.data.arBasicExpenseSetting ? res.data.arBasicExpenseSetting.isStandard : ''
                        result.moneyCtrlType = res.data.arBasicExpenseSetting ? res.data.arBasicExpenseSetting.moneyCtrlType : ''
                        // divCode = 'standard'是标准的表单，standard_detail是国内标准外层容器，standard_table是国内表格，int_standard_detail是国外标准外层容器，init_standard_table是国外表格
                        if (param.data.expenseItemCode.includes('INT')) {
                            // 国际费用
                            /*result.tableCode = 'init_standard_table'
                            result.searchCode = 'int_standard_search'*/
                            parentWrap = viewModal.getNodeByCode('int_standard_detail').children
                            result.getKey(parentWrap)
                            result.localStands = true
                            viewModal.showNode('standard', true)

                            viewModal.showNode('int_standard_detail', true)
                            viewModal.showNode('stand_wrap', true)
                            viewModal.showNode('standard_detail', false)
                            viewModal.showNode('meetingStand', false)
                            viewModal.showNode('cultivateStand', false)
                        } else if (param.data.expenseItemCode === 'MEETING') {
                            // 会议费
                            result.tableCode = 'meetingStand'
                            result.searchCode = ''
                            result.standSetting = 'meetingStandardSetting'
                            result.localStands = false
                            viewModal.showNode('meetingStand', true)
                            viewModal.showNode('cultivateStand', false)
                            viewModal.showNode('stand_wrap', false)

                        } else if (param.data.expenseItemCode === 'CULTIVATE') {
                            // 培训费
                            result.tableCode = 'cultivateStand'
                            result.searchCode = ''
                            result.standSetting = 'cultivateStandardSetting'
                            result.localStands = false
                            viewModal.showNode('cultivateStand', true)
                            viewModal.showNode('meetingStand', false)
                            viewModal.showNode('stand_wrap', false)

                        } else {
                            // 国内费用
                            // result.tableCode = 'standard_table'
                            // result.searchCode = 'standard_search'
                            parentWrap = viewModal.getNodeByCode('standard_detail').children
                            result.getKey(parentWrap)
                            result.localStands = true
                            viewModal.showNode('standard_detail', true)
                            viewModal.showNode('standard', true)
                            viewModal.showNode('stand_wrap', true)
                            viewModal.showNode('int_standard_detail', false)
                            viewModal.showNode('meetingStand', false)
                            viewModal.showNode('cultivateStand', false)



                        }
                        result.entyKey = viewModal.getNodeByCode(result.tableCode).key
                        // 住宿费时，显示城市旺季按钮
                        if (param.data.expenseItemCode === 'HOUSE_FEE') {
                            viewModal.showNode('standard_search', true)   // // 住宿地点 只有住宿费才显示
                            viewModal.showNode('cityBusySeason', true)
                        } else {
                            viewModal.showNode('standard_search', false)     // 住宿地点 只有住宿费才显示
                            viewModal.showNode('cityBusySeason', false)

                        }
                        result.setColuns()
                        result.addListen()

                    }

                })

            })
        },
        // 获取的实体key
        getKey (data) {
            data.forEach(item => {
                const { divCode, children, dataType, nodeType } = item
                if (dataType === 'refer' || dataType === 'enty') {
                    if (nodeType === 'form') {
                        result.searchCode = item.key
                    }
                    if (nodeType === 'table') {
                        result.tableCode = item.key
                    }
                } else if (children && children.length) {
                    result.getKey(children)
                }
            })
        },
        // 查询费用标准配置
        getSetting (param) {
            if (result.treeClick) {
                result.pageIndex = 1
            }
            return new Promise((resolve, reject) => {
                let params = new FormData()
                params.append('expenseType', param.data.expenseItemCode)
                params.append('searchKey', result.searchKey)
                params.append('pageIndex', result.pageIndex)
                params.append('pageSize', result.pageSize)
                params.append('key', '')
                params.append('type', '')
                params.append('ytenantId', result.context.env.tenantid)
                params.append('agencyCode', result.agencyCode)
                params.append('mofDivCode', result.mofDivCode)
                params.append('fiscalYear', result.context.env.fiscalYear || result.context.env.setYear)
                const res = viewModal.post({
                    url: `/${service.BASE_BE_URL}/ar/basicset/setting/query`,
                    data: params,
                    waitfor: true,
                })
                resolve(res)
            })
        },
        // 动态设置列
        setColuns () {
            const infoColumns = result.settingData.infoIdSet // 显示列
            const tableData = result.settingData.stdLs // 数据
            const data = result.settingData
            const expenseItemCode = result.selectedTree.data.expenseItemCode
            const allChildren = viewModal.getNodeByCode(result.tableCode).children
            let expenseCri = allChildren.find(ele => ele.dataField === 'expenseCri') // 标准
            let seatLevel = allChildren.find(ele => ele.dataField === 'seatLevel') // 席别 seatLevel
            let newColumns = []
            if (result.localStands) {
                // 标准费用
                if (infoColumns && infoColumns.length > 0) {
                    allChildren.forEach(item => {
                        const filterItem = infoColumns.find(i => i === item.dataField)
                        if (filterItem) {
                            newColumns.push(item)
                        }
                    })
                }
            }
            if (expenseItemCode === 'TRAVEL') {
                // 城市间交通费时，标准列显示为：席别
                newColumns.push(seatLevel)
            } else if (expenseItemCode !== 'INT_HOUSE_FEE' && expenseItemCode !== 'INT_MEAL_FEE' && expenseItemCode !== 'INT_MISCELLANEOUS_FEE') {
                // 费用类型!=国外住宿费/国外伙食费/国外公杂费，显示标准列
                newColumns.push(expenseCri)
            }

            if (result.localStands) {
                result.total = data.stdLsCount
                // 填充控制方式数据
                setTimeout(() => {
                    viewModal.get('moneyCtrlTypeDiv').loadData([{ label: '不提醒', value: 1 }, { label: '保存时弹窗提醒', value: 2 }, { label: '禁止保存', value: 3 }])
                }, 300)
                viewModal.setEntyValues(result.base, { isStandard: result.isStandard, moneyCtrlType: result.moneyCtrlType })
                if (viewModal.get(result.tableCode)) {
                    viewModal.get(result.tableCode).loadColumns(newColumns)
                    //viewModal.loadTableData(result.tableCode, tableData, result.total)
                    viewModal.get(result.tableCode).loadData(tableData, { total: result.total, resetActivePage: true })
                    //viewModal.setEntyValues(result.tableCode, tableData || [], true)
                } else {
                    viewModal.on(result.tableCode, 'onMount', param => {
                        viewModal.get(result.tableCode).loadColumns(newColumns)
                        viewModal.get(result.tableCode).loadData(tableData, {
                            total: result.total,
                            resetActivePage: true
                        })
                        //viewModal.setEntyValues(result.tableCode, tableData || [], true)
                        //viewModal.loadTableData(result.tableCode, tableData, result.total)
                    })
                }
            } else {
                result.setTable(result.tableCode, data)
            }


        },
        // 给表格刷数据
        setTable (code, data) {
            let tableData = []
            if (result.localStands) {
                tableData = data.stdLs ? data.stdLs : []
            } else {
                tableData = data[result.standSetting] ? data[result.standSetting] : []
            }
            let total = 0
            if (data.stdLs !== null) {
                total = data.stdLsCount
            }
            viewModal.setEntyValues(result.base, { isStandard: result.isStandard, moneyCtrlType: result.moneyCtrlType })
            if (viewModal.get(code)) {
                // viewModal.loadTableData(code, tableData, total)
                viewModal.get(code).loadData(tableData, { total: result.total })
                // viewModal.setEntyValues(code, tableData || [], true)
            } else {
                viewModal.on(code, 'onMount', param => {
                    // viewModal.loadTableData(code, tableData, total)
                    viewModal.get(code).loadData(tableData, { total: result.total })
                    // viewModal.setEntyValues(code, tableData || [], true)
                })
            }
        },
        // 打开城市旺季的弹框
        openSeason () {
            viewModal.showModal({
                pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${result.cswjCode}&cacheUI=0`,
                title: '城市旺季',
                margintop: 80,
                pageId: result.cswjCode, // 关闭时的key
                "props": {
                    // 同 上面的参数 pageUrl，此处可不写
                    "width": 900,
                    "height": 545,
                    "unit_type": {
                        // 此处加上这个属性，width和height就是px，否则是百分比
                        "label": "px",
                        "value": "px"
                    }
                },

            })
            // 监听行程弹框的确定事件
            window.closeDialog = function (type) {
                result.confirmData(type)
            }
        },
        confirmData (type) {
            viewModal.closePageModal(result.cswjCode) // 关闭弹框，key是打开弹框的pageId
        },
        // 切换分页
        addListen () {
            viewModal.on(result.searchCode, 'onQuery', (item) => {
                // 搜索
                if (result.searchCode) {
                    if (item.data.length > 0) {
                        result.searchKey = item.data[0].v1
                    } else {
                        result.searchKey = ''
                    }
                    result.getTableData()
                }

            })

            viewModal.on(result.tableCode, 'onPageChange', ({ activeKey, pageSize }) => {
                result.pageIndex = activeKey || 1
                result.pageSize = pageSize
                result.getTableData()
            })
            // 分页事件绑定
            viewModal.on(result.tableCode, 'onPageSizeChange', ({ activeKey, pageSize }) => {
                result.pageIndex = activeKey || 1
                result.pageSize = pageSize
                result.getTableData()
            })
        },
        // 查询费用标准
        getTableData () {
            const param = result.selectedTree
            const code = result.tableCode
            result.getSetting(param).then(res => {
                if (res.data.arBasicExpenseSetting) {
                    result.isStandard = res.data.arBasicExpenseSetting.isStandard
                    result.moneyCtrlType = res.data.arBasicExpenseSetting.moneyCtrlType
                }
                result.setTable(code, res.data)
            })
        },
        // 删除
        deleteRow (btn, rowData) {
            let id = rowData.id
            const data = {
                id: id
            }
            viewModal.Modal.confirm({
                title: '删除',
                content: ('请确认是否删除数据？'),
                onOk () {
                    viewModal.post({
                        url: `/${service.BASE_BE_URL}/ar/basicset/standard/delete`,
                        data: data,
                        waitfor: false,
                    }).then(res => {
                        if (res.error === false) {
                            viewModal.Message.info('删除成功');
                            result.getTableData()
                        } else {
                            viewModal.Message.error(res.message);
                        }
                    })
                },
            })
        },
        save () {
            const expenseItemCode = result.selectedTree.data.expenseItemCode
            let dataList = ''
            if (expenseItemCode.includes('INT')) {
                // 国际费用
                dataList = 'countryStandardList'
            } else if (expenseItemCode === 'MEETING') {
                // 会议费
                dataList = 'meetingStandardList'
            } else if (expenseItemCode === 'CULTIVATE') {
                // 培训费
                dataList = 'cultivateStandardList'
            } else {
                // 国内费用
                dataList = 'expenseStandardList'
            }
            const entyValues = viewModal.getEntyValues()
            let data = {}
            if (result.arBasicExpenseSetting) {
                result.arBasicExpenseSetting.isStandard = entyValues[result.base].data.isStandard
                result.arBasicExpenseSetting.moneyCtrlType = entyValues[result.base].data.moneyCtrlType
            }
            data['arBasicExpenseSetting'] = result.arBasicExpenseSetting
            data['expenseType'] = expenseItemCode
            data[dataList] = entyValues[result.entyKey].data

            data[dataList].forEach(item => {
                item['ytenantId'] = result.context.env.tenantid
                item['agencyCode'] = result.agencyCode
                item['mofDivCode'] = result.mofDivCode
                item['fiscalYear'] = result.context.env.fiscalYear || result.context.env.setYear
            })

            viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/basicset/setting/save`,
                data: data,
                waitfor: true,
            }).then(res => {
                if (res.error === false) {
                    viewModal.Message.success('保存成功！')
                    result.getTableData()
                } else {
                    viewModal.Message.error('保存失败！')
                }
            })
        }

    }
    return result
}
