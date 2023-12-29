/*
 * @Descripttion: 会议费报销单
 * @version:
 * @Author: jiamf1
 * @Date: 2023-05-16 16:52:14
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-06 17:27:53
 */
import arBillCommonFun from '@/common/bill/arBillCommonFun' // ar报销公共事件
import btnFun from '@/common/bill/btnFun' // 按钮公共事件
import commonMethod from '@/common/utils' // 工具方法
import actionCommon from '@/common/const/billActions.json' // 公共自定义按钮常量
import baseAreaFun from "@/common/bill/baseAreaFun"; // 基本信息方法
import commonUi from '@/common/commonUi'
import budgetFun from '@/common/bill/budgetFun'
export default (viewModal) => {
    const result = {
        // ui 引入
        ui: commonUi.getCommonUi(viewModal, ['IntelligentAuditing']),
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([
            { code: 'customSave', label: '保存' }
        ], actionCommon.COMMON),
        created () {

        },
        mounted () {
            arBillCommonFun.arExpCreated(viewModal, result)
            baseAreaFun.changeTrainOrMeetingType(viewModal)
            arBillCommonFun.initMounted(viewModal)
            baseAreaFun.initTrainOrMeetingType(viewModal)
        },
        // 自定义删除
        customDetele (btn, rowData) {
            btnFun.customDetele(btn, rowData, viewModal)
        },
        // 自定义取消
        customCancel (btn, rowData) {
            btnFun.customCancel(btn, rowData, viewModal)
        },
        // 自定义提交
        customWorkFlowStart (btn, rowData) {
            btnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
        },
        // 自定义行上智能识别
        customRowOrc (btn, rowData) {
            btnFun.customRowOrc(viewModal, btn, rowData)
        },
        // 自定义行上联查发票
        customRowViewInvoices (btn, rowData) {
            btnFun.customRowViewInvoices(viewModal, btn, rowData)
        },
        // 指标删除
        budgetDelete(btn, rowData) {
            budgetFun.budgetDelete(viewModal, btn, rowData)
        }

    }
    return result
}
