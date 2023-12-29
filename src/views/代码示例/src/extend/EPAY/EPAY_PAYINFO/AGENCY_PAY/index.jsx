/*
 * @Descripttion:支付单
 * @version:
 * @Author: guohx
 * @Date: 2023-05-30 14:54:39
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-19 11:14:36
 */
 
import commonMethod from '@/common/utils' // 工具方法
import epayTableFun from '../../../../common/epay/epayTableFun'
import epayBtnFun from '../../../../common/epay/epayBtnFun'

export default (viewModal) => {
    const payType = "agency"
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([],epayTableFun.epayActionCommon),
        created () {

        },
        mounted () {
            epayTableFun.init(viewModal,payType);
        }, 
        //删除
        customDetele (btn, rowData) {
            epayBtnFun.customListDetele(viewModal, btn, rowData,epayTableFun.tabNo,epayTableFun.billContext.bizObjCode,'mainTable')
        },
        // 调整收款人
        adjPayee(btn, rowData){
            epayBtnFun.adjPayeeDialog(viewModal, btn, rowData)
        },
        // 支付
        customPay(btn, rowData){
            epayBtnFun.customPayAction(viewModal, btn, rowData)
        },
        // 重新支付
        rePay(btn, rowData){
            epayBtnFun.rePayAction(viewModal, btn, rowData)
        },
        // 全部状态下载
        allStatusDown(btn, rowData){
            epayBtnFun.allStatusDownload(viewModal, btn, rowData)
        },
        // 支付状态下载
        payStatusDown(btn, rowData){
            epayBtnFun.payStatusDownload(viewModal, btn, rowData)
        },
        // 支付成功确认
        paySucConfirm(btn, rowData){
            epayBtnFun.paySucConfirm(viewModal, btn, rowData)
        }, 
        // 支付失败确认
        payFailConfirm(btn, rowData){
            epayBtnFun.payFailConfirm(viewModal, btn, rowData)
        },
    }
    return result
}
