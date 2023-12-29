/*
 * @Descripttion: 票据类型与费用对照
 * @version: 
 * @Author: guohx
 * @Date: 2023-06-14 19:32:21
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-09 15:20:19
 */

import commonMethod from '@/common/utils' // 工具方法 
import service from '../../../common/const/service'
import agentTree from '@/common/agentTree'
export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        tableContainer: 'tableContainer',
        searchContainer: 'searchContainer',
        api: [
            { code: 'addBilltype', label: '新增' },
            { code: 'deleteBilltype', label: '删除' },
            { code: 'importBilltype', label: '导入' },
            { code: 'exportBilltype', label: '导出' },
            { code: 'editBilltype', label: '编辑' }
        ],
        agentTree: '202308020852095327889589201356',
        agencyCode: '',
        mofDivCode: '',
        treeInfo: null,
        created () {

        },
        mounted () {
            let yondifEnv = localStorage.getItem('yondifEnv')
            if (yondifEnv) {
                result.yondifEnv = JSON.parse(yondifEnv)
                result.agencyCode = result.yondifEnv.unitCode
            }
            result.treeInfo = viewModal.getNodeByCode('billTypeTree').enty.info

            agentTree.getAgentTree(viewModal, result.agentTree).then(res => {
                result.agencyCode = res.agencyCode
                result.mofDivCode = res.mofDivCode


                result.initTable(viewModal);
                // 监听单位树
                viewModal.on(result.agentTree, 'onChange', (param) => {
                    result.agencyCode = param.data.agencyCode
                    result.mofDivCode = param.data.mofDivCode
                    result.leftTreeFresh()

                })
            })


            // 监听交易类型树，点击节点查询数据
            viewModal.on('billTypeTree', 'onSelect', param => {
                result.treeNode = param.data
                result.initTable(viewModal);
            })

            result.insertTreeData(viewModal)
        },
        // 因为树结构的数据是参照，该接口不归我们控制，需要轮询 目的是获取到数据，可以插入一条数据，或者是选择默认节点
        insertTreeData (viewModal) {
            let timeHander = null
            let func = (viewModal) => {
                let leftTreeModel = viewModal.get('billTypeTree')
                let treeData = leftTreeModel?.state?.treeData || []
                if (treeData.length === 0) {
                    timeHander = setTimeout(() => {
                        func(viewModal)
                    }, 300)
                } else {
                    clearTimeout(timeHander)
                    leftTreeModel.selectNode(treeData[0]) // 默认选中第一个
                    result.treeNode = treeData[0]
                }
            }
            func(viewModal)
        },
        // 调用参照接口刷新左侧树
        leftTreeFresh () {
            let params = {
                "refCode": result.treeInfo.refCode,
                "fullname": result.treeInfo.uri,
                "condition": {
                    "isExtend": true,
                    "simpleVOs": [
                        {
                            "field": "eleCatalogCode",
                            "op": "eq",
                            "value1": "VDVM00001"
                        },
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
                "correlation": ""
            }
            let leftTreeModel = viewModal.get('billTypeTree')

            viewModal.post({
                url: `/fbdi-be/ybill/ref/getYonDifRefData?terminalType=1&serviceCode=&busiObj=&designPreview=true`,
                data: params,
                waitfor: true
            }).then(res => {
                let result = res?.gridData?.recordList || ''
                if (result && Array.isArray(result)) {
                    leftTreeModel.loadData(result)
                    leftTreeModel.selectNode(result[0]) // 默认选中第一个
                } else {
                    leftTreeModel.loadData([])
                    viewModal.loadTableData(result.tableContainer, [], { clearSelected: true, total: 0 })
                }
            }).catch(err => {
                leftTreeModel.loadData([])
                viewModal.loadTableData(result.tableContainer, [], { clearSelected: true, total: 0 })
            })


        },
        // 初始化表格
        initTable (viewModal, search) {
            const url = `/${service.BASE_BE_URL}/ar/api/invoice/queryLikeList`
            result.searchData = {
                keyword: search ? search.keyword : '',
                invoiceTypeCode: result.treeNode ? result.treeNode.eleCode : '',
                expenseTypeCode: "",
                agencyCode: result.agencyCode,
                mofDivCode: result.mofDivCode,
                pageIndex: "1",
                pageSize: "50"
            }
            viewModal.post({ url, data: result.searchData }).then(res => {
                if (res.error === false) {
                    viewModal.loadTableData(result.tableContainer, res.data.content, { clearSelected: true, total: res.data.totalElements })
                } else {
                    viewModal.Message.error(res.message);
                }
            })
            // 绑定搜索事件
            viewModal.on(result.searchContainer, 'onQuery', (item) => {
                var searchData = {
                    keyword: item.data[0].v1,
                }
                result.initTable(viewModal, searchData);
            })
            // 分页事件绑定
            viewModal.on(this.tableContainer, 'onPageChange', ({ activeKey, pageSize }) => {
                result.searchData.pageIndex = activeKey || 1
                result.searchData.pageSize = pageSize
                this.getTableList(viewModal, result.searchData)
            })
            // 分页事件绑定
            viewModal.on(this.tableContainer, 'onPageSizeChange', ({ activeKey, pageSize }) => {
                result.searchData.pageIndex = activeKey || 1
                result.searchData.pageSize = pageSize
                this.getTableList(viewModal, result.searchData)
            })
        },
        // 新增弹窗
        addBilltype () {
            if (commonMethod.isNull(result.treeNode)) {
                viewModal.Message.info('请先选择一个票据类型');
                return false
            }
            const pageId = 'PJLXYFYDZXZTC'
            window.colloctDataCallback = function (type, list) {
                if (type === 'cancel') {
                    viewModal.closePageModal(pageId)
                }
                if (type === 'confirm') {
                    result.initTable(viewModal);
                    viewModal.closePageModal(pageId)
                }
            }
            viewModal.showModal({
                pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${'PJLXYFYDZXZTC'}&cacheUI=0&invoiceTypeCode=${result.treeNode.eleCode}&invoiceTypeName=${result.treeNode.eleName}&actionCode=${'add'}`,
                title: '票据类型与费用对照',
                margintop: 80,
                pageId: pageId, // 关闭时的key
                "props": {
                    // 同 上面的参数 pageUrl，此处可不写
                    "width": 600,
                    "height": 400,
                    "unit_type": {
                        // 此处加上这个属性，width和height就是px，否则是百分比
                        "label": "px",
                        "value": "px"
                    }
                }
            })
        },

        // 行操作打开编辑弹窗
        editBilltype (btn, rowData) {
            const pageId = 'PJLXYFYDZXZTC'
            window.colloctData = rowData
            window.colloctDataCallback = function (type, list) {
                if (type === 'cancel') {
                    viewModal.closePageModal(pageId)
                }
                if (type === 'confirm') {
                    result.initTable(viewModal);
                    viewModal.closePageModal(pageId)
                }
            }
            viewModal.showModal({
                pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${'PJLXYFYDZXZTC'}&cacheUI=0&actionCode=${'eidt'}`,
                title: '票据类型与费用对照',
                margintop: 80,
                pageId: pageId, // 关闭时的key
                "props": {
                    "width": 600,
                    "height": 400,
                    "unit_type": {
                        "label": "px",
                        "value": "px"
                    }
                }
            })
        },
        // 删除
        deleteBilltype (btn, rowData) {
            let ids = []
            if (rowData) {
                ids.push(rowData.id)
                // ids = rowData.id
            } else {
                const selectRows = viewModal.get(result.tableContainer).getSelectRow();
                if (selectRows.length === 0) {
                    viewModal.Message.info('请至少选择一条数据!')
                    return
                } else {
                    ids = selectRows.map(item => item.id)
                }
            }
            // 请求接口
            const url = `/${service.BASE_BE_URL}/ar/api/invoice/deleteAll`
            viewModal.post({ url, data: ids }).then(function (res) {
                if (res.error === false) {
                    viewModal.Message.info('删除成功');
                    result.initTable(viewModal);
                } else {
                    viewModal.Message.error(res.message);
                }
            })
        }
    }
    return result
}
