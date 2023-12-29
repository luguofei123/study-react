/*
 * @Descripttion:单位资金支付点击支付次数弹窗--支付历史明细
 * @version:
 * @Author: guohx
 * @Date: 2023-05-30 14:54:39
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-13 10:39:57
 */
  
import historyFun from '../../../../common/epay/historyFun'

export default (viewModal) => {
    const payType = "financial"
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: [],
        created () {

        },
        mounted () {
            historyFun.init(viewModal,payType);
        },  
        
    }
    return result
}
