/*
 * @Descripttion: 支付失败确认弹窗
 * @version: 
 * @Author: guohx
 * @Date: 2023-06-07 15:31:06
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-07 15:31:09
 */
import commonMethod from '@/common/utils' // 工具方法
import epayTableFun from '../../../../common/epay/epayTableFun' 
import historyFun from '../../../../common/epay/historyFun'

export default (viewModal) => {
    const payType = "financial"
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([],epayTableFun.epayActionCommon),
        created () {

        },
        mounted () {
            historyFun.init(viewModal,payType);
        },  
        
    }
    return result
}