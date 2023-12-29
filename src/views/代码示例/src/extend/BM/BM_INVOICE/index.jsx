/*
 * @Descripttion:我的票夹 单位票夹子 综合查询
 * @version:
 * @Author: luguofei
 * @Date: 2023-04-20 19:50:00
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-10 16:33:11
 */
// import LCDAebfLeft from '@/components/LCDAebfLeft'
// import LCDAebfLeft from '@/components/LCDAebfLeftTree'
import invoiceTableFun from '@/common/list/aebf/invoiceTableFun'
import commonMethod from "@/common/utils";
import invoicelistBtnFun from '@/common/list/aebf/invoicelistBtnFun' // 按钮公共事件



export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], invoiceTableFun.listAebfAction),
        // LCDAebfLeftRef: React.createRef('LCDAebfLeftRef'),
        created () {
            console.log('初始化')
        },
        mounted () {
            invoiceTableFun.listTAbleMounted(viewModal, result)
            // const widget = viewModal.get('LCDAebfLeft')
            // if (widget) {
            //     widget.appendChild(LCDAebfLeft, {
            //         name: '票夹列表', ref: result.LCDAebfLeftRef,
            //         doAction: (obj) => result.doAction(obj),
            //         vm: viewModal
            //     })
            // }
        },
        // doAction (param) {
        //     debugger
        //     invoiceTableFun.optionByleft(param, viewModal)
        // },
        // 自定义删除
        customDetele (btn, rowData) {
            invoicelistBtnFun.customListDetele(viewModal, btn, rowData)
        },
        // 自定义票据采集
        customCollectBill (btn, rowData) {
            invoicelistBtnFun.customCollectBill(viewModal, btn, rowData)
        },
        // 自定义报销
        customJunperExp (btn, rowData) {
            invoicelistBtnFun.customJunperExp(viewModal, btn, rowData)
        },
        // 自定义导入
        customImport (btn, rowData) {
            invoicelistBtnFun.customImport(viewModal, btn, rowData)
        },
        // 自定义导出
        customExport (btn, rowData) {
            invoicelistBtnFun.customExport(viewModal, btn, rowData)
        },
        // 自定义联查报销单
        customViewExp (btn, rowData) {
            invoicelistBtnFun.customViewExp(viewModal, btn, rowData)
        },
        // 自定义联查凭证
        customViewVou (btn, rowData) {
            invoicelistBtnFun.customViewVou(viewModal, btn, rowData)
        },
        // 自定义上传文件
        customUploadFile (btn, rowData) {
            invoicelistBtnFun.customUploadFile(viewModal, btn, rowData)
        },
        // 自定义上传增票
        customAddBill (btn, rowData) {
            invoicelistBtnFun.customAddBill(viewModal, btn, rowData)
        },
        // 自定义确认
        customConfirm (btn, rowData) {
            invoicelistBtnFun.customConfirm(viewModal, btn, rowData)
        },
        // 自定义行确认
        customConfirmRow (btn, rowData) {
            invoicelistBtnFun.customConfirmRow(viewModal, btn, rowData)
        },
        // 导出excel
        customExportExcel (btn, rowData) {
            invoicelistBtnFun.customExportExcel(viewModal, btn, rowData)
        }
    }
    return result
}