/*
 * @Descripttion:
 * @version:
 * @Author: liwz
 * @Date: 2023-05-10 16:43:01
 * @LastEditors: liwz
 * @LastEditTime: 2023-05-16 17:02:28
 */

// import listTableFun from '@/common/list/listTableFun'
import commonMethod from "@/common/utils";
import listBtnFun from '@/common/list/listBtnFun' // 按钮公共事件
import planCommonFun from '@/common/list/planCommonFun' // 计划公共事件

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], planCommonFun.listActionCommon),
        mounted() {
            console.log(11111111111,'会议计划')
            planCommonFun.listTAbleMounted(viewModal, result)
        },
        // 自定义导出
        customExport(btn, rowData) {
            planCommonFun.exportFn(viewModal, btn, rowData)
        },
        // 自定义删除
        customDetele(btn, rowData) {
            planCommonFun.customListDetele(viewModal, btn, rowData)
        },
        // 自定义结束计划
        DkPlanEnd(btn,rowData){
            planCommonFun.customListEndPlan(viewModal, btn, rowData)
        }
        // // 自定义复制
        // customCopy(btn, rowData) {
        //     listBtnFun.customListCopy(viewModal, btn, rowData)
        // },
        // // 自定义编辑
        // customEditor(btn, rowData) {
        //     listBtnFun.customEditor(viewModal, btn, rowData)
        // },
        // // 自定义提交
        // customWorkFlowStart(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
        // },
        // // 自定义收回
        // customWorkFlowCancel(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchCancel')
        // },
        // // 自定义审批
        // customWorkFlowApprove(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchApprove')
        // },
        // // 自定义销审
        // customWorkFlowActivate(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchActivate')
        // },
        // // 自定义驳回
        // customWorkFlowBack(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchBack')
        // },
        // // 自定义作废
        // customWorkFlowDiscard(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchDiscard')
        // },
        // // 自定义流程弹窗
        // customWorkOpenWorkFlow(btn, rowData) {
        //     listBtnFun.doWorkFlow(viewModal, btn, rowData, 'workflowTraceFull')
        // }
    }
    return result
}

