/*
 * @Descripttion:
 * @version:
 * @Author: liwz
 * @Date: 2023-05-10 16:43:01
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-02 14:31:37
 */

// import listTableFun from '@/common/list/listTableFun'
import commonMethod from "@/common/utils";
import listBtnFun from '@/common/list/listBtnFun' // 按钮公共事件
import planCommonFun from '@/common/list/planCommonFun' // 计划公共事件

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([{ code: 'saveAndClose', label: '保存后关闭' }, {
            code: 'customCancel',
            label: '取消'
        }], planCommonFun.listActionCommon),
        mounted () {
            console.log(2222, '计划详情', viewModal)
            planCommonFun.listTAbleMounted(viewModal, result)

            planCommonFun.changeTrainOrMeetingType(viewModal)  // 会议基本信息区域类型改变获取标准
            planCommonFun.initHandleData(viewModal)
            // this.changeTrainOrMeetingType(viewModal)
        },
        // 自定义导出
        customSave (btn, rowData) {
            planCommonFun.customSave(viewModal, btn, rowData)
        },
        // 详情弹框保存后需关闭弹框
        saveAndClose (btn, rowData) {

            //viewModal.postMessage({ action: 'confirm', page: 'plan' }, "*")
            console.log(3333, btn, rowData)
            if (window.parent.getSchData) {
                window.parent.getSchData('confirm')
            } else {
                window.parent[0].getSchData('confirm')
            }

        },
        //详情弹框取消按钮事件
        customCancel (btn) {
            // viewModal.postMessage({ action: 'cancel', page: 'plan' }, "*")
            console.log('详情取消：')
            if (window.parent.getSchData) {
                window.parent.getSchData('cancel')
            } else {
                window.parent[0].getSchData('cancel')
            }
        },
        // // 自定义删除
        // customDetele(btn, rowData) {
        //     listBtnFun.customListDetele(viewModal, btn, rowData)
        // },
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

