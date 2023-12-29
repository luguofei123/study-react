/*
 * @Descripttion: 费用设置
 * @version:
 * @Author: fulxa
 * @Date: 2023-05-29 16:52:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 09:56:55
 */
import commonMethod from '@/common/utils'
import service from "../../../common/const/service";
import agentTree from '@/common/agentTree'

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([
            { code: 'addTree', label: '新增树' },
            { code: 'addNodes', label: '新增下级' },
            { code: 'deleteTree', label: '删除' },
            { code: 'save', label: '保存' }
        ], []),
        selectedItem: {},
        context: {}, // 查询的系统信息
        addCode: 'XZFY',
        treeInfo: {},
        addType: false,
        tabCode: '', // 页签的code
        tabChild: [], // 费用设置的ui
        setKey: '', // 是否保存费用设置
        standKey: '', // 是否保存标准影响因素
        agentTree: '20230802085011463081490270326',
        agencyCode: '',
        mofDivCode: '',
        created () {

        },
        mounted () {
            agentTree.getAgentTree(viewModal, result.agentTree).then(res => {
                result.agencyCode = res.agencyCode
                result.mofDivCode = res.mofDivCode
                result.init()
            })
        },
        init () {
            result.context = viewModal.getContext()
            result.treeInfo = viewModal.getNodeByCode('expenseTree').enty.info
            result.tabChild = viewModal.getNodeByCode('fyTab').children
            result.getKey(result.tabChild)
            result.initSelet()
            result.selectTree()
            result.addListen()
            result.insertTreeData(viewModal)
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
        // 初始化默认选中节点
        initSelet () {
            viewModal.on('expenseTree', 'onDataLoaded', param => {
                if (result.selectedItem) {
                    const selectedItem = result.selectedItem
                    viewModal.get('expenseTree').selectNode(selectedItem)
                } else {
                    const firstNode = param.data[0]
                    viewModal.get('expenseTree').selectNode(firstNode)
                }

            })


        },
        // 选择树
        selectTree () {
            viewModal.on('expenseTree', 'onSelect', param => {
                result.selectedItem = param.data
                if (result.tabCode === 'stand_tab') {
                    // 标准影响因素
                    if (result.selectedItem.parent === null) {
                        viewModal.post({
                            url: `/${service.BASE_BE_URL}/ar/basicset/sysinfo/flush`,
                            data: {},
                            waitfor: true,
                        }).then(res => {
                            if (res.error === false) {
                                viewModal.showNode('add_stand', true)
                            }
                        })

                    } else {
                        viewModal.showNode('add_stand', false)
                    }
                } else {
                    // 费用设置

                    viewModal.showNode('add_stand', false)
                }
                if (result.selectedItem.parent === null) {
                    // 一级节点，标准影响因素必填
                    viewModal.setRequired(result.standKey, true)
                    viewModal.get('fyTab').showOrhideTitle('stand_tab', true)
                } else {
                    viewModal.setRequired(result.standKey, false)
                    viewModal.get('fyTab').showOrhideTitle('stand_tab', false)
                }
                result.getInfo()

            })
        },
        // 获取费用设置的数据
        getInfo () {
            const params = {
                ytenantId: result.context.env.tenantid,
                agencyCode: result.agencyCode,
                mofDivCode: result.mofDivCode,
                fiscalYear: result.context.env.fiscalYear || result.context.env.setYear,
                expenseItemCode: result.selectedItem.expenseItemCode
            }
            // 费用类型为空的时候 不要调用
            if (!result.selectedItem.expenseItemCode) {
                return
            }
            viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/sysset/arSysExpenseType/getInfo`,
                data: params,
                waitfor: true,
            }).then(res => {
                if (res.error === false) {
                    result.setData(res.data.expType)
                    const tableData = res.data.expTypeInfoList ? res.data.expTypeInfoList : []
                    if (result.selectedItem.parent === null) {
                        if (viewModal.get(result.standKey)) {
                            viewModal.get(result.standKey).loadData(tableData)
                        } else {
                            viewModal.on(result.standKey, 'onMount', param => {
                                viewModal.get(result.standKey).loadData(tableData)
                            })
                        }
                        viewModal.setEntyValues(result.standKey, tableData || [], true)
                    }

                }
            })
        },
        // 费用设置数据
        setData (data) {
            viewModal.setEntyValues(result.setKey, data)

            if (viewModal.get('displayName') && data.displayName) {
                // viewModal.setEntyValues(result.setKey, data)
                setTimeout(() => {
                    viewModal.get('displayName').update({ value: data.displayName })
                }, 100)

            }
        },
        // 新增树
        addTree () {
            result.openSeason()
        },
        // 新增下级
        addNodes () {
            if (JSON.stringify(result.selectedItem) == "{}") {
                viewModal.Message.info('请选择树节点!')
                return
            }
            result.openSeason('addNode')
        },
        // 删除树
        deleteTree () {
            if (JSON.stringify(result.selectedItem) == "{}") {
                viewModal.Message.info('请选择树节点!')
                return
            }
            const params = {
                ytenantId: result.context.env.tenantid,
                agencyCode: result.agencyCode,
                mofDivCode: result.mofDivCode,
                fiscalYear: result.context.env.fiscalYear || result.context.env.setYear,
                expenseItemCode: result.selectedItem.expenseItemCode
            }
            viewModal.Modal.confirm({
                title: '删除',
                content: ('请确认是否删除数据？'),
                onOk () {
                    viewModal.post({
                        url: `/${service.BASE_BE_URL}/ar/sysset/arSysExpenseType/delete`,
                        data: params,
                        waitfor: false,
                    }).then(res => {
                        if (res.error === false) {
                            viewModal.Message.info('删除成功');
                            result.addType = true
                            result.refreshTree()
                        } else {
                            viewModal.Message.error(res.message);
                        }
                    })
                },
            })
        },
        // 打开城市旺季的弹框
        openSeason (type) {
            result.addType = true
            if (type && type === 'addNode') {
                window.expenseItemCode = result.selectedItem.expenseItemCode
                window.agencyCode = result.agencyCode
                window.mofDivCode = result.mofDivCode
            } else {
                window.expenseItemCode = 'none'
                window.agencyCode = result.agencyCode
                window.mofDivCode = result.mofDivCode
            }
            viewModal.showModal({
                pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${result.addCode}&cacheUI=0`,
                title: '新增费用',
                margintop: 80,
                pageId: result.addCode, // 关闭时的key
                "props": {
                    // 同 上面的参数 pageUrl，此处可不写
                    "width": 900,
                    "height": 466,
                    "unit_type": {
                        // 此处加上这个属性，width和height就是px，否则是百分比
                        "label": "px",
                        "value": "px"
                    }
                },

            })
            // 监听新增费用的确定事件
            window.closeDialog = function (type) {
                result.confirmData(type)
            }
        },
        // 新增费用确认、取消
        confirmData (type) {
            if (type === 'save') {
                // 点击了树节点才查接口
                if (result.selectedItem.expenseItemCode) {
                    result.getInfo()
                }
                result.refreshTree()
            }
            viewModal.closePageModal(result.addCode)
        },
        // 刷新树
        refreshTree () {
            // 新增费用后刷新树
            if (result.addType) {
                let treeParams = {
                    refCode: result.treeInfo.refCode,
                    fullname: result.treeInfo.uri,
                    condition: {
                        isExtend: true, "simpleVOs": [
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
                    treeCondition: {
                        isExtend: true,
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
                    data: treeParams,
                    waitfor: false,
                }).then(res => {

                    if (Array.isArray(res.data)) {
                        viewModal.get('expenseTree').loadData(res.data)
                        result.initSelet()
                        result.addType = false
                    } else {
                        viewModal.get('expenseTree').loadData([])
                    }


                })
            }
        },
        // 切换页签
        addListen () {
            let tabList = []
            viewModal.on('fyTab', 'onChange', (item) => {
                if (item.data.divCode === 'stand_tab') {
                    if (result.selectedItem.parent === null) {
                        viewModal.showNode('add_stand', true)
                    } else {
                        viewModal.showNode('add_stand', false)
                    }
                    result.tabCode = 'stand_tab'
                } else {
                    result.tabCode = 'set_tab'
                    viewModal.showNode('add_stand', false)
                }
            })
            viewModal.on('add_stand', 'onChange', param => {
                let tableData = viewModal.get(result.standKey).getTableData().data
                tableData.forEach(item => {
                    const filterItem = param.data.find(ele => ele.infoCode === item.fieldCode)
                    if (filterItem) {
                        item.arField = item.arField ? item.arField : filterItem.fieldName
                    }
                })
                viewModal.get(result.standKey).loadData(tableData)
                viewModal.setEntyValues(result.standKey, tableData || [], true)
            })

            // 监听单位树
            // viewModal.on(result.agentTree, 'onChange', (param) => {
            //     debugger
            //     result.agencyCode = param.data.agencyCode
            //     result.mofDivCode = param.data.mofDivCode
            //     result.getInfo()

            // })
            // 监听单位树
            viewModal.on(result.agentTree, 'onChange', (param) => {
                result.agencyCode = param.data.agencyCode
                result.mofDivCode = param.data.mofDivCode
                result.addType = true
                result.refreshTree()
                result.getInfo()


            })
        },
        // 保存
        save () {
            const entyValues = viewModal.getEntyValues()
            let data = {}
            let tabData = {}
            let setData = {}
            let standData = []
            let url = ''
            const contextData = {
                ytenantId: result.context.env.tenantid,
                agencyCode: result.agencyCode,
                mofDivCode: result.mofDivCode,
                fiscalYear: result.context.env.fiscalYear || result.context.env.setYear,
            }
            const checkList = viewModal.validateCheck()
            checkList.then(errorList => {
                if (errorList.length && errorList.indexOf('标准影响') !== -1) {
                    viewModal.Modal.error({
                        title: '单据检查未通过',
                        content: (errorList.map(items => <p key={items}>{items}</p>)),
                        onOk () {

                        },
                    });
                    return false
                }
                setData = entyValues[result.setKey].data
                tabData = { ...contextData, ...setData }
                standData = result.standKey ? entyValues[result.standKey].data : []
                standData.forEach(item => {
                    item.ytenantId = result.context.env.tenantid
                    item.agencyCode = result.agencyCode
                    item.mofDivCode = result.mofDivCode
                    item.fiscalYear = result.context.env.fiscalYear || result.context.env.setYear
                    item.expenseItemCode = result.selectedItem.expenseItemCode
                })
                data.expType = tabData
                if (result.selectedItem.parent === null) {
                    data.expTypeInfoList = standData
                } else {
                    data.expTypeInfoList = []
                }

                result.saveBill(data)
            })
        },
        // 获取页签下的实体key
        getKey (data) {
            data.forEach(item => {
                const { divCode, children, dataType } = item
                if (dataType === 'enty') {
                    if (divCode === 'stand_table') {
                        result.standKey = item.key
                    } else {
                        result.setKey = item.key
                    }

                } else if (children && children.length) {
                    result.getKey(children)
                }
            })
        },
        saveBill (data) {
            viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/sysset/arSysExpenseType/save`,
                data: data,
                waitfor: true,
            }).then(res => {
                if (res.error === false) {
                    result.addType = true
                    result.refreshTree()
                    viewModal.Message.success('保存成功！')
                }
            })
        }


    }
    return result
}
