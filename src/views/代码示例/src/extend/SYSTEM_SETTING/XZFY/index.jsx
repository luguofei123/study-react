/*
 * @Descripttion: 新增费用
 * @version:
 * @Author: fulxa
 * @Date: 2023-05-29 16:52:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 09:58:52
 */
import commonMethod from '@/common/utils'
import actions from '@/common/const/actions.json'
import service from "../../../common/const/service";

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actions.sch_dialog),
        treeData: [],
        nodeKey: '',
        expenseItemCode: '',
        agencyCode: '',
        mofDivCode: '',
        context: {},
        created () {

        },
        mounted () {
            result.treeData = viewModal.getNodeByCode('root').children // 模型结构
            result.context = viewModal.getContext()
            if (window.parent.expenseItemCode) {
                if (window.parent.expenseItemCode !== 'none') {
                    result.expenseItemCode = window.parent.expenseItemCode
                    result.agencyCode = window.parent.agencyCode
                    result.mofDivCode = window.parent.mofDivCode
                } else {
                    result.expenseItemCode = ''
                    result.agencyCode = window.parent.agencyCode
                    result.mofDivCode = window.parent.mofDivCode
                }

            } else {
                if (window.parent[0].expenseItemCode !== 'none') {
                    result.expenseItemCode = window.parent[0].expenseItemCode
                    result.agencyCode = window.parent[0].agencyCode
                    result.mofDivCode = window.parent[0].mofDivCode
                } else {
                    result.expenseItemCode = ''
                    result.agencyCode = window.parent[0].agencyCode
                    result.mofDivCode = window.parent[0].mofDivCode
                }
            }
            result.getCode(result.treeData)
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
        // 保存
        dialogConfirm () {
            const entyValues = viewModal.getEntyValues()
            let data = {}
            let params = {
                expType: {},
                expTypeInfoList: []
            }
            const contextData = {
                ytenantId: result.context.env.tenantid,
                agencyCode: result.agencyCode,
                mofDivCode: result.mofDivCode,
                fiscalYear: result.context.env.fiscalYear || result.context.env.setYear,
                ptype: result.expenseItemCode
            }
            const checkList = viewModal.validateCheck()
            checkList.then(errorList => {
                if (errorList.length) {
                    viewModal.Modal.error({
                        title: '单据检查未通过',
                        content: (errorList.map(items => <p key={items}>{items}</p>)),
                        onOk () {

                        },
                    });
                    return false
                }
                data = { ...entyValues[result.nodeKey].data, ...contextData }
                params.expType = data
                viewModal.post({
                    url: `/${service.BASE_BE_URL}/ar/sysset/arSysExpenseType/save`,
                    data: params,
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
            })


        },
        // 关闭按钮
        dialogCancel () {
            if (window.parent.closeDialog) {
                window.parent.closeDialog('cancel')
            } else {
                window.parent[0].closeDialog('cancel')
            }
        }

    }
    return result
}
