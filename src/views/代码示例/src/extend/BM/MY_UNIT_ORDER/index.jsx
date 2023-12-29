/*
 * @Descripttion: 商旅订单 - 我的订单，单位订单
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-07-11 13:55:05
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-12 17:06:08
 */

import commonMethod from "@/common/utils"
import listOrderAction from '@/common/const/listOrderAction.json'
import orderTableFun from '@/common/list/order/orderTableFun'
import orderBtnFun from "@/common/list/order/orderBtnFun"

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], listOrderAction),
        mounted () {
          orderTableFun.initHandle(viewModal)
        },
        // 订单下载
        orderDownload() {
          orderBtnFun.orderDownload(viewModal)
        },
        // 订单导入
        orderImport() {
          orderBtnFun.orderImport(viewModal)
        },
        // 订单导出
        orderExport() {
          orderBtnFun.orderExport(viewModal)
        }
    }
    return result
}