/*
 * @Descripttion:
 * @version:
 * @Author: luguofei
 * @Date: 2023-04-20 15:08:43
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-04 16:19:16
 */

import listTableFun from '@/common/list/listTableFun'
import commonMethod from "@/common/utils";
import listBtnFun from '@/common/list/listBtnFun' // 按钮公共事件

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], listTableFun.listActionCommon),
        mounted () {
            listTableFun.listTAbleMounted(viewModal, result)
        },
        // 自定义删除
        customDetele (btn, rowData) {
            listBtnFun.customListDetele(viewModal, btn, rowData)
        },
        // 自定义复制
        customCopy (btn, rowData) {
            listBtnFun.customListCopy(viewModal, btn, rowData)
        },
        // 自定义编辑
        customEditor (btn, rowData) {
            listBtnFun.customEditor(viewModal, btn, rowData)
        },
        // 自定义提交
        customWorkFlowStart (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
        },
        // 自定义收回
        customWorkFlowCancel (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchCancel')
        },
        // 自定义审批
        customWorkFlowApprove (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchApprove')
        },
        // 自定义销审
        customWorkFlowActivate (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchActivate')
        },
        // 自定义驳回
        customWorkFlowBack (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchBack')
        },
        // 自定义作废
        customWorkFlowDiscard (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchDiscard')
        },
        // 自定义流程弹窗
        customWorkOpenWorkFlow (btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'workflowTraceFull')
        },
        // 自定义办结
        customConclude (btn, rowData) {
            listBtnFun.customConclude(viewModal, btn, rowData)
        },
        // 自定义取消办结
        customUnconclude (btn, rowData) {
            listBtnFun.customUnconclude(viewModal, btn, rowData)
        },
    }
    return result
}

