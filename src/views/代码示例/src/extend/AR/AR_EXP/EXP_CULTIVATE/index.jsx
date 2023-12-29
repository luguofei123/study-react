/*
 * @Descripttion:
 * @version:
 * @Author: lugfa
 * @Date: 2023-05-12 17:22:55
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-06 17:25:24
 * @FilePath: /yondif-a-ar-fe/yondif/src/extend/AR/AR_EXP/EXP_CULTIVATE/index.jsx
 */
/**
 * 培训费报销单
 * @param {*} viewModal
 * @returns
 */
import arBillCommonFun from '@/common/bill/arBillCommonFun' // ar报销公共事件
import btnFun from '@/common/bill/btnFun' // 按钮公共事件
import baseAreaFun from '@/common/bill/baseAreaFun' // 基本信息
import commonMethod from '@/common/utils' // 工具方法
import actionCommon from '@/common/const/billActions.json' // 公共自定义按钮常量
import commonUi from '@/common/commonUi'
import budgetFun from '@/common/bill/budgetFun'
export default (viewModal) => {
    const result = {
        // ui 引入
        ui: commonUi.getCommonUi(viewModal, ['IntelligentAuditing']),
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actionCommon.COMMON),
        created () {

        },
        mounted () {
            arBillCommonFun.arExpCreated(viewModal, result)
            baseAreaFun.changeTrainOrMeetingType(viewModal)  // 会议基本信息区域类型改变获取标准
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
