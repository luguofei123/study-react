/*
 * @Descripttion:
 * @version:
 * @Author: lugfa
 * @Date: 2023-05-10 15:38:53
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-06 17:28:04
 * @FilePath: /yondif-a-ar-fe/yondif/src/extend/AR/AR_EXP/EXP_TRIP/GROUP/index.jsx
 */
/**
 * 差旅费报销单-分组
 * @param {*} viewModal
 * @returns
 */
import arBillCommonFun from '@/common/bill/arBillCommonFun' // ar报销公共事件
import btnFun from '@/common/bill/btnFun' // 按钮公共事件
import commonMethod from '@/common/utils' // 工具方法
import actionCommon from '@/common/const/billActions.json' // 公共自定义按钮常量
import budgetFun from '@/common/bill/budgetFun'
export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([
            { code: 'customSave', label: '保存' }
        ], actionCommon.COMMON),
        created () {

        },
        mounted () {
            arBillCommonFun.arExpCreated(viewModal, result)
            arBillCommonFun.initMounted(viewModal)
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
        // 指标删除
        budgetDelete(btn, rowData) {
            budgetFun.budgetDelete(viewModal, btn, rowData)
        }
    }
    return result
}
