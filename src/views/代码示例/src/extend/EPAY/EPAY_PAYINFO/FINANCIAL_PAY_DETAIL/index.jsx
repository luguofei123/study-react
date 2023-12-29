/*
 * @Descripttion: 财政资金支付详情
 * @version: 
 * @Author: guohx
 * @Date: 2023-06-07 15:54:23
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-19 11:15:02
 */
import commonMethod from '@/common/utils' // 工具方法
import epayTableFun from '../../../../common/epay/epayTableFun' 
import financialDetail from '../../../../common/epay/financialDetail'
import epayBtnFun from '../../../../common/epay/epayBtnFun'

export default (viewModal) => { 
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([],epayTableFun.epayActionCommon),
        created () {

        },
        mounted () {
            financialDetail.init(viewModal);
        },
         //删除
        customDetele (btn, rowData) {
            epayBtnFun.customListDetele(viewModal, btn, rowData,financialDetail.tabsContainer,financialDetail.billContext.bizObjCode,'detailTable')
        },
    }
    return result
}