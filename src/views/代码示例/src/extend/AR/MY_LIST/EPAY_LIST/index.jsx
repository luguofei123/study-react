/*
 * @Descripttion: 生成支付单
 * @version:
 * @Author: fulxa
 * @Date: 2023-06-08 19:50:00
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-23 15:57:48
 */

import commonMethod from '@/common/utils'
import service from '@/common/const/service'

export default viewModal => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi(
            [
                {
                    code: 'generatePay',
                    label: '生成支付单'
                },
                {
                    code: 'customEdit',
                    label: '自定义编辑'
                },
                {
                    code: 'cancelGen',
                    label: '取消生成'
                }
            ],
            []
        ),
        tabContainer: 'tabContainer', // 页签容器
        searchContainer: 'searchContainer', // 步骤条容器编码
        tableContainer: '', // 表格容器编码
        treeData: {},
        searchParams: {},
        actionCodeTypeSearch: 'BillPayListAction',
        tabNo: 'tabWSC', // 默认未生成
        tabNos: [],
        billContext: {},
        pageCode: '',
        mounted () {
            result.treeData = viewModal.getNodeByCode('root')
            result.billContext = viewModal.getContext() // 获取单据类型信息
            result.pageCode = commonMethod.getUrlParameter('pageCode') ? commonMethod.getUrlParameter('pageCode') : 'SCZFD'
            result.getKey(result.treeData.children)
            result.getSearchInitValue() // 搜索区域初始化
            result.getStepsDiv(viewModal)
            setTimeout(() => {
                result.initTable(viewModal)
            }, 300)


            window.addEventListener('message', (param) => {
                // 关闭打开的子页签，右上角返回箭头
                if (param?.data?.command === "closed") {

                    result.getTableList(viewModal, result.searchParams)
                }
            })

            // result.smqEvent(viewModal)
        },
        // 搜索区域初始化
        getSearchInitValue () {
            const searchUi = viewModal.getNodeByCode(result.searchContainer)
            // 如果搜索区域有时间范围的组件，需要初始化这个组件，开始时间是当年的第一天，结束时间是当前业务日期
            if (searchUi && searchUi.children) {
                let nodeUi = searchUi.children
                nodeUi.forEach((item, index) => {
                    if (item.name === 'YDFDateRange') {
                        const date = result.billContext.env.date
                        const v1 = commonMethod.getYearStartTime(date) // 业务年度的第一天
                        const v2 = commonMethod.getDate(date) // 当前业务日期
                        viewModal.get(item.key).update({ value: [v1, v2] })
                    }
                    if (item.dataField === 'billTypeCode') {
                        // 单据类型
                        viewModal
                            .request({
                                url: `/${service.BASE_BE_URL}/ar/billtype/getBillTypeListByBillCate?billCateCode=AAR_EXP,AAR_LOAN`
                            })
                            .then(res => {
                                let billTypeList = res.data
                                billTypeList.forEach(ele => {
                                    ele.value = ele.billTypeCode
                                    ele.label = ele.billTypeName
                                })
                                viewModal.on(item.key, 'onload', async (domnode, value) => {
                                    return billTypeList
                                })
                            })
                    }
                })
            }
        },
        // 初始化表格
        initTable (viewModal) {
            const searchData = viewModal.get(result.searchContainer)
            if (!searchData) {
                return false
            }
            // 列表字段
            //  const columList = searchData.state.columns
            result.searchParams = {
                queryScheme: {
                    fullname: result.treeData.enty.info.uri,
                    fields: [],
                    conditions: searchData.getQCondition(),
                    orders: [],
                    pager: {
                        pageIndex: 1,
                        pageSize: 50
                    }
                },
                actionCode: result.actionCodeTypeSearch,
                busiObj: result.treeData.enty.info.code,
                externalData: {
                    tabNo: result.tabNo,
                    billCateCode: result.billContext.billTypeCode
                }
            }
            result.getTableList(viewModal, result.searchParams) // 进入页面加载数据
            // 绑定搜索事件
            viewModal.on(result.searchContainer, 'onQuery', item => {
                result.searchParams.queryScheme.conditions = item.data
                result.getTableList(viewModal, result.searchParams)
            })
            // 绑定tab事件
            viewModal.showNode('btn-pay-bill', true)
            viewModal.showNode('btn-cancel-bill', false)
            viewModal.on(result.tabContainer, 'onChange', item => {
                if (item.data.divCode === 'tabYSC') {
                    // 已生成
                    result.searchParams.externalData.tabNo = 'tabYSC'
                    viewModal.showNode('btn-pay-bill', false)
                    viewModal.showNode('btn-cancel-bill', true)

                } else {
                    result.searchParams.externalData.tabNo = 'tabWSC'
                    viewModal.showNode('btn-pay-bill', true)
                    viewModal.showNode('btn-cancel-bill', false)
                }
                result.getTableList(viewModal, result.searchParams)
            })
            // 分页事件绑定
            viewModal.on(result.tableContainer, 'onPageChange', ({ activeKey, pageSize }) => {
                result.searchParams.queryScheme.pager.pageIndex = activeKey || 1
                result.searchParams.queryScheme.pager.pageSize = pageSize
                result.getTableList(viewModal, result.searchParams)
            })
            // 分页事件绑定
            viewModal.on(result.tableContainer, 'onPageSizeChange', ({ activeKey, pageSize }) => {
                result.searchParams.queryScheme.pager.pageIndex = activeKey || 1
                result.searchParams.queryScheme.pager.pageSize = pageSize
                result.getTableList(viewModal, result.searchParams)
            })

            // 设置表格上的按钮显示逻辑
            viewModal.on(result.tableContainer, 'onRowHover', ({ row, rowIndex, rowTools }) => {
                // params: row: 表格行数据  rowIndex： 表格行标  owTools： 按钮列表
                let btnCodeArr = []
                if (result.searchParams.externalData.tabNo === 'tabYSC') {
                    btnCodeArr = ['btn-cancel-table']
                }
                if (result.searchParams.externalData.tabNo === 'tabWSC') {
                    btnCodeArr = ['btn-edit-table', 'btn-pay-table']
                }
                let newRowTools = rowTools.filter(item => {
                    return btnCodeArr.indexOf(item.divCode) !== -1
                })

                console.log(newRowTools)
                // btn-edit-table
                // btn-pay-table
                // btn-cancel-table
                // let newRowTools = invoicelistBtnFun.showRowButtonLogic(viewModal, row, rowIndex, rowTools)
                return newRowTools
            }
            );
            // 监控单据跳转 单据id字段需要设置成链接
            // viewModal.get(result.tableContainer).state.columns.forEach(item => {
            //     if (item.name === 'link' && item.dataField.indexOf('arBillNo') !== -1) {
            //         viewModal.on(item.key, 'onCellClick', (param) => {
            //             result.customOpen('view', param.data)
            //         })
            //     }
            // })
        },
        // 获取列表数据通用方法
        getTableList (viewModal, param) {
            let conditions = param.queryScheme.conditions
            if (conditions.length) {
                conditions.forEach(item => {
                    if (item.name === 'auditTime') {
                        // 查询条件，审批日期添加时分秒
                        if (!item.v1.includes('00:00:00')) {
                            item.v1 += ' 00:00:00'
                            item.v2 += ' 23:59:59'
                        }
                    }
                })
            }
            param.queryScheme.conditions = conditions
            viewModal
                .post({
                    url: `/${service.BASE_BE_URL}/ybill/pub`,
                    data: param,
                    waitfor: true
                })
                .then(res => {
                    if (res) {
                        if (res?.error === false) {
                            let tableData = viewModal.get(result.tableContainer).getTableData().data
                            let ids = tableData.map(i => i.id)
                            if (param.externalData.billId) {
                                if (ids.indexOf(param.externalData.billId) === -1) {
                                    tableData.push(res.data)
                                }
                            } else {
                                tableData = res.data.recordList
                            }
                            viewModal.get(result.tableContainer).loadData(tableData, {
                                clearSelected: true,
                                total: res.data.recordCount
                            })
                        } else {
                            viewModal.Message.error(`${res?.message}`)
                        }
                    }
                })

            this.getStepsStatus(viewModal)
        },
        // 获取步骤条上的状态
        getStepsDiv (viewModal) {
            const stepsContainer = viewModal.get(this.tabContainer)
            if (!stepsContainer) {
                return false
            }
            const list = stepsContainer.getList()
            stepsContainer.setState({ current: 0 })  // 设置默认
            this.tabNos = []
            list.forEach((item, index) => {
                const tabNo = item.props.uidata.props.stepcode
                if (tabNo) {
                    this.tabNos.push(tabNo)
                }
            })
        },
        // 获取步骤条上的状态 电子票夹暂时不提供此数据
        getStepsStatus (viewModal) {
            if (this.tabNos.length > 0) {
                const data = {
                    queryScheme: {
                        fullname: this.treeData.enty.info.uri
                    },
                    actionCode: "BillPayGroupAction",
                    busiObj: this.treeData.enty.info.code,
                    externalData: {
                        tabNo: this.tabNos,
                        bizTypeCode: this.billContext.billTypeCode
                    }
                }
                viewModal.post({
                    url: `/${service.BASE_BE_URL}/ybill/pub`,
                    data,
                    waitfor: false,
                }).then(res => {
                    if (res?.error === false) {
                        const result = res.data
                        this.tabNos.forEach((value, index) => {
                            viewModal.get(this.tabContainer).setStepCorner(index, result[value])
                        })

                    } else {
                        viewModal.Message.error(`${res?.message}`)
                    }

                })

            }
        },
        // 获取页签下的实体key
        getKey (data) {
            data.forEach(item => {
                const { divCode, children, dataType, nodeType } = item
                if (dataType === 'enty' && nodeType === 'table') {
                    result.tableContainer = item.key
                } else if (children && children.length) {
                    result.getKey(children)
                }
            })
        },
        customEdit (action, rowData, cols) {
            if (cols) {
                if (cols.col.name === 'link' && cols.col.dataField === 'arBillNo') {
                    result.customOpen('view', rowData)
                }
            } else {
                // 支付单打开的时候都是不可编辑的
                result.customOpen('view', rowData, 'editable')
            }
        },
        // 打开单据页
        customOpen (eidtType, data, isEdit) {
            const type = eidtType
            let url =
                '/yondif-pvdf-fe/#/BillRender?billId=' +
                data.id +
                '&status=' +
                data.billStatus +
                '&editMod=' +
                type +
                '&fromPage=' +
                result.pageCode +
                '&tabNo=' +
                result.searchParams?.externalData?.tabNo
            if (isEdit) {
                url = `${url}&isEdit=${isEdit}`
            }

            commonMethod.openBill({ viewModal: viewModal, data: data, url: url })
            window.colsePageDetailPay = result.colsePageDetailCallback.bind(null, viewModal, data)
        },
        // 单据详情关闭回掉
        colsePageDetailCallback (viewModal, data) {
            viewModal.closePageModal(`p${data.id}`) // 关闭弹框，key是打开弹框的pageId
            result.getTableList(viewModal, result.searchParams)
        },
        // 自定义生成支付单 弹窗
        generatePay (btn, rowData) {

            if (rowData) {
                this.generatePayStepTwo(viewModal, btn, rowData)

            } else {
                const that = this
                const pageId = 'SCZFDTC'
                const selectRows = viewModal.get(result.tableContainer).getSelectRow()
                window.colloctData = selectRows
                // 监听行程弹框的确定事件
                window.colloctDataCallback = function (type, list) {
                    if (type === 'cancel') {
                        viewModal.closePageModal(pageId)
                    }
                    if (type === 'confirm') {
                        that.generatePayStepTwo(viewModal, btn, rowData, list, pageId)

                    }
                }
                viewModal.showModal({
                    pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${'SCZFDTC'}&cacheUI=0`,
                    title: <span>生成支付单<span style={{ color: 'rgb(255, 153, 51)', marginLeft: 20 }}>持使用扫描枪扫描纸质报销单，快速识别！</span></span>,
                    margintop: 80,
                    pageId: pageId, // 关闭时的key
                    "props": {
                        // 同 上面的参数 pageUrl，此处可不写
                        "width": '90%',
                        "height": '80%',
                        "unit_type": {
                            // 此处加上这个属性，width和height就是px，否则是百分比
                            "label": "px",
                            "value": "px"
                        }
                    }
                })
            }
        },
        // 生成支付单
        generatePayStepTwo (viewModal, btn, rowData, list, pageId) {
            let payCollected = {
                _status: 'Insert',
                billTypeCode: 'EPAY_PAYINFO'
            }
            result.generateApi(viewModal, rowData, 'EpayInfoAddAction', payCollected, list, pageId)
        },
        // 取消生成
        cancelGen (btn, rowData) {
            result.generateApi(viewModal, rowData, 'EpayInfoCancelAddAction')
        },
        generateApi (viewModal, rowData, actionCode, payCollected, list, pageId) {
            let ids = ''
            if (rowData) {
                ids = rowData.id
            } else {
                // 批量删除
                let selectRows = viewModal.get(result.tableContainer).getSelectRow()
                if (list) {
                    selectRows = list
                }

                if (selectRows.length === 0) {
                    viewModal.Message.info('请至少选择一条数据!')
                    return
                } else {
                    ids = selectRows.map(item => item.id).join(',')
                }
            }

            let param = {
                ids: ids,
                busiObj: 'AEPAYPayinfo',
                actionCode: actionCode
            }
            if (payCollected) {
                param.data = payCollected
            }
            viewModal
                .post({
                    url: `/${service.BASE_BE_URL}/ybill/pub`,
                    data: param,
                    waitfor: false
                })
                .then(res => {
                    if (res.error === false) {
                        if (pageId) {
                            viewModal.closePageModal(pageId)
                        }
                        viewModal.Message.success('操作成功')
                        result.getTableList(viewModal, result.searchParams)
                    } else {
                        viewModal.Message.error(`${res?.message}`)
                    }
                })
        },
        // 扫码枪
        smqEvent (viewModal) {
            let smqCode = ''
            let id = ''
            let lastTime = 0
            let nextTime = 0
            let newCode = ''
            document.onkeypress = function (e) {
                newCode = e.keyCode
                console.log(newCode)
                nextTime = new Date().getTime()
                if (nextTime - lastTime < 100 || lastTime === 0) {
                    smqCode += String.fromCharCode(newCode)
                    smqCode = smqCode.replace(/\r/g, '')
                    if (smqCode.length === 26) {
                        id = smqCode
                        result.searchParams.externalData.billId = id
                        result.getTableList(viewModal, result.searchParams)
                        smqCode = ''
                    }
                } else {
                    smqCode = String.fromCharCode(newCode)
                    smqCode = smqCode.replace(/\r/g, '')

                    if (smqCode.length === 26) {
                        id = smqCode
                        result.searchParams.externalData.billId = id
                        result.getTableList(viewModal, result.searchParams)
                        smqCode = ''
                    }
                }
                lastTime = nextTime
            }
        }
    }
    return result
}
