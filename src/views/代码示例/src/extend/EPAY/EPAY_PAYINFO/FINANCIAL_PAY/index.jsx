/*
 * @Descripttion:支付单
 * @version:
 * @Author: guohx
 * @Date: 2023-05-30 14:54:39
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-19 11:14:49
 */
 
import commonMethod from '@/common/utils' // 工具方法
import epayTableFun from '../../../../common/epay/epayTableFun'
import epayBtnFun from '../../../../common/epay/epayBtnFun'

export default (viewModal) => {
    const payType = "financial"
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
            epayBtnFun.customListDetele(viewModal, btn, rowData, epayTableFun.tabNo,epayTableFun.billContext.bizObjCode,'mainTable')
        },
        // 支付成功确认
        paySucConfirmF(btn, rowData){
            epayBtnFun.paySucConfirmF(viewModal, btn, rowData)
        }, 
        // 支付失败确认
        payFailConfirmF(btn, rowData){
            epayBtnFun.payFailConfirmF(viewModal, btn, rowData)
        },
    }
    return result
}
