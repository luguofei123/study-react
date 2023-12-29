/*
 * @Descripttion: 设置城市旺季
 * @version:
 * @Author: fulxa
 * @Date: 2023-05-29 16:52:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 09:59:38
 */
import commonMethod from '@/common/utils'
import actions from '@/common/const/actions.json'
import service from "../../../common/const/service";
import listTableFun from "../../../common/list/listTableFun";

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actions.szcswj_dialog),
        tableData: [],
        searchKey: '',
        pageIndex: 1,
        pageSize: 50,
        total: 0,
        nodeKey: '',
        context: {}, // 获取上下文
        created () {

        },
        mounted () {
            result.treeData = viewModal.getNodeByCode('root').children // 模型结构
            result.context = viewModal.getContext()
            result.getCode(result.treeData)
            result.getTableData()
            result.getCondition()
        },
        // 获取实体的key
        getCode (data) {
            data.forEach(item => {
                const { divCode, children, dataType } = item
                if (dataType === 'enty') {
                    result.nodeKey = item.key

                } else if (children && children.length) {
                    result.getCode(children)
                }
            })
        },
        getTableData () {
            result.getBusy().then(res => {
                result.tableData = res.data.busySeasonList
                result.total = res.data.totalcount
                viewModal.get(result.nodeKey).loadData(result.tableData, { total: result.total })
                viewModal.setEntyValues(result.nodeKey, result.tableData || [], true)
            })
        },
        // 获取城市淡旺季
        getBusy () {
            let params = {
                pageIndex: result.pageIndex,
                pageSize: result.pageSize,
                searchKey: result.searchKey,
                ytenantId: result.context.env.tenantid,
                agencyCode: result.context.env.agency.agencyCode,
                mofDivCode: result.context.env.mofdiv.mofDivCode,
                fiscalYear: result.context.env.fiscalYear || result.context.env.setYear
            }
            const res = viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/basicset/setting/getBusySeasonList`,
                data: params,
                waitfor: false,
            })
            return res
        },
        getCondition () {
            // 获取查询条件
            viewModal.on('cswj_search', 'onQuery', (item) => {
                if (item.data.length > 0) {
                    result.searchKey = item.data[0].v1
                } else {
                    result.searchKey = ''
                }
                result.getTableData()

            })
            viewModal.on(result.nodeKey, 'onPageChange', ({ activeKey, pageSize }) => {
                result.pageIndex = activeKey || 1
                result.pageSize = pageSize
                result.getTableData()
            })
            // 分页事件绑定
            viewModal.on(result.nodeKey, 'onPageSizeChange', ({ activeKey, pageSize }) => {
                result.pageIndex = activeKey || 1
                result.pageSize = pageSize
                result.getTableData()
            })
        },
        // 保存
        dialogConfirm () {
            const entyValues = viewModal.getEntyValues()
            const data = entyValues[result.nodeKey].data
            data.forEach(item => {
                item.ytenantId = result.context.env.tenantid
                item.agencyCode = result.context.env.agency.agencyCode
                item.mofDivCode = result.context.env.mofdiv.mofDivCode
                item.fiscalYear = result.context.env.fiscalYear || result.context.env.setYear
            })
            viewModal.post({
                url: `/${service.BASE_BE_URL}/ar/basicset/setting/saveBusySeason`,
                data: data,
                waitfor: true,
            }).then(res => {
                if (res.error === false) {
                    viewModal.Message.success('保存成功！')
                    if (window.parent.closeDialog) {
                        window.parent.closeDialog('save')
                    } else {
                        window.parent[0].closeDialog('save')
                    }

                } else {
                    viewModal.Message.error('保存失败！')
                }
            })

        },
        // 关闭按钮
        dialogCancel () {
            if (window.parent.closeDialog) {
                window.parent.closeDialog('cancel')
            } else {
                window.parent[0].closeDialog('cancel')
            }
        },
        // 删除行
        deleteRow (btn, rowData) {
            let ids = ''
            if (rowData) {
                ids = rowData.id
            } else {
                // 批量删除
                const selectRows = viewModal.get(result.nodeKey).getSelectRow();
                if (selectRows.length === 0) {
                    viewModal.Message.info('请至少选择一条数据!')
                    return
                } else {
                    ids = selectRows.map(item => item.id).join(',')
                }
            }
            const data = {
                ids: ids
            }
            viewModal.Modal.confirm({
                title: '删除',
                content: ('请确认是否删除数据？'),
                onOk () {
                    viewModal.post({
                        url: `/${service.BASE_BE_URL}/ar/basicset/setting/deleteBusySeason`,
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
        }

    }
    return result
}
