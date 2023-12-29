/*
 * @Descripttion:
 * @version:
 * @Author: luguofei
 * @Date: 2023-04-20 19:50:00
 * @LastEditors: fulxa
 * @LastEditTime: 2023-07-14 11:13:04
 */

import listTableFun from '@/common/list/listTableFun'
import commonMethod from "@/common/utils";
import listBtnFun from '@/common/list/listBtnFun' // 按钮公共事件

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], listTableFun.listActionCommon),
        mounted() {
            listTableFun.listTAbleMounted(viewModal, result)
            //result.frameTest()
        },
        // 自定义删除
        customDetele(btn, rowData) {
            listBtnFun.customListDetele(viewModal, btn, rowData)
        },
        // 自定义复制
        customCopy(btn, rowData) {
            listBtnFun.customListCopy(viewModal, btn, rowData)
        },
        // 自定义编辑
        customEditor(btn, rowData) {
            listBtnFun.customEditor(viewModal, btn, rowData)
        },
        // 自定义查看
        customView(btn, rowData) {
            listBtnFun.customView(viewModal, btn, rowData)
        },
        //    '提交', fn: 'start',
        //   '收回', fn: 'cancel',
        //   '审批', fn: 'approve',
        //   '销审', fn: 'activate',
        //   '驳回', fn: 'back',
        //  '作废', fn: 'discard',

        // * 批量提交：batchStart、
        // * 批量撤回：batchCancel、  如果是终审单据撤回，需先激活，目前工作流未提供批量激活
        // * 批量审核（通过）：batchApprove、
        // * 批量退回（）：batchBack、
        // * 激活：activate、没有批量激活
        // 自定义提交
        customWorkFlowStart(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
        },
        // 自定义收回
        customWorkFlowCancel(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchCancel')
        },
        // 自定义审批
        customWorkFlowApprove(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchApprove')
        },
        // 自定义销审
        customWorkFlowActivate(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchActivate')
        },
        // 自定义驳回
        customWorkFlowBack(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchBack')
        },
        // 自定义作废
        customWorkFlowDiscard(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchDiscard')
        },
        // 自定义流程弹窗
        customWorkOpenWorkFlow(btn, rowData) {
            listBtnFun.doWorkFlow(viewModal, btn, rowData, 'workflowTraceFull')
        },
        // 自定义办结
        customConclude(btn, rowData) {
            listBtnFun.customConclude(viewModal, btn, rowData)
        },
        // 自定义取消办结
        customUnconclude(btn, rowData) {
            listBtnFun.customUnconclude(viewModal, btn, rowData)
        },
        // 自定义开始收单
        customStartCollected(btn, rowData) {
            listBtnFun.customStartCollected(viewModal, btn, rowData)
        },
        // 自定义确认收单
        customCollected(btn, rowData) {
            listBtnFun.customCollected(viewModal, btn, rowData)
        },
        // 自定义取消收单
        customUncollected(btn, rowData) {
            listBtnFun.customUncollected(viewModal, btn, rowData)
        },
    
    }
    return result
}
