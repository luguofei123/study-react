/*
 * @Descripttion: 经费申请单
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-27 10:23:34
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-06 18:10:04
 */
/**
 * 经费申请单
 * @param {*} viewModal
 * @returns
 */
import arBillCommonFun from '@/common/bill/arBillCommonFun' // ar报销公共事件
import commonMethod from '@/common/utils' // 工具方法
import actionCommon from '@/common/const/billActions.json' // 公共自定义按钮常量
import btnFun from '@/common/bill/btnFun' // 按钮公共事件
import budgetFun from '@/common/bill/budgetFun'
export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actionCommon.COMMON),
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
