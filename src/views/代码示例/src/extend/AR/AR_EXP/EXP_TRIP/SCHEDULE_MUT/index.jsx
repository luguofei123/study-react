/*
 * @Descripttion: 差旅费报销单-行程归集
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-27 10:23:34
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-19 14:23:06
 */
import arBillCommonFun from '@/common/bill/arBillCommonFun' // ar报销公共事件
import btnFun from '@/common/bill/btnFun' // 按钮公共事件
import commonMethod from '@/common/utils' // 工具方法
import detailFun from '@/common/bill/detailFun'
import actionCommon from '@/common/const/billActions.json' // 公共自定义按钮常量
import travelFun from '@/common/bill/travelFun'
import budgetFun from '@/common/bill/budgetFun'
import commonUi from '@/common/commonUi'

export default viewModal => {
    const result = {
        ui: commonUi.getCommonUi(viewModal, ['IntelligentAuditing']),
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi(
            [
                {
                    code: 'travelSave',
                    label: '自定义保存行程'
                },
                {
                    code: 'travelInit',
                    label: '自定义初始化行程'
                },
                {
                    code: 'travelTemp',
                    label: '自定义暂存行程'
                }
            ],
            actionCommon.COMMON
        ),
        schDialogPageCode: 'XCXXTK',
        mutiType: true,
        created() {},
        mounted() {
            arBillCommonFun.arExpCreated(viewModal, result).then(res => {
                // detailFun.initSch(viewModal, result)
                // travelFun.initTravelData(viewModal) // 浏览态时，数据行程数据回显
            })
            arBillCommonFun.initMounted(viewModal)
        },
        // 自定义保存动作
        travelSave() {
            let actionCode = ''
            if (viewModal.editMod() === 'new') {
                // 新增
                actionCode = 'ArTravelBillAdd'
            } else {
                actionCode = 'ArTravelBillSave'
            }
            btnFun.tripSave(viewModal, actionCode)
            // btnFun.saveBill(viewModal)
        },
        // 单据详情点击新增的时候，行程这部分也需要初始化
        travelInit() {
            btnFun.tripInit(viewModal)
        },
        // 自定义暂存动作
        travelTemp() {
            const actionCode = 'ArTravelBillAddTemp'
            btnFun.tripTemp(viewModal, actionCode)
        },
        // 自定义删除
        customDetele(btn, rowData) {
            btnFun.customDetele(btn, rowData, viewModal)
        },
        // 自定义取消
        customCancel(btn, rowData) {
            btnFun.customCancel(btn, rowData, viewModal)
        },
        // 自定义确认收单
        customCollected(btn, rowData) {
            btnFun.customCollected(btn, rowData, viewModal)
        },
        // 自定义取消收单
        customUncollected(btn, rowData) {
            btnFun.customUncollected(btn, rowData, viewModal)
        },
        // 自定义提交
        customWorkFlowStart(btn, rowData) {
            btnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
        },
        // 自定义保存并提交
        customSaveAndsubmit(btn, rowData) {
            let actionCode = ''
            if (viewModal.editMod() === 'new') {
                // 新增
                actionCode = 'ArTravelBillAdd'
            } else {
                actionCode = 'ArTravelBillSave'
            }

            btnFun.tripSave(viewModal, actionCode, true)
        },
        // 指标删除
        budgetDelete(btn, rowData) {
            budgetFun.budgetDelete(viewModal, btn, rowData)
        }
    }
    return result
}
