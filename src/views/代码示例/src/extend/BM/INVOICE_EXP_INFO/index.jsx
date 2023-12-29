/*
 * @Descripttion: 模板转换
 * @version:
 * @Author: luguofei
 * @Date: 2023-04-20 19:50:00
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-02 15:38:49
 */

import commonMethod from "@/common/utils";
import invoiceExpInfo from '@/common/list/aebf/invoiceExpInfo'
export default (viewModal) => {
    const result = {
        api: commonMethod.mergeApi([
            {
                "code": "customDeteleRow",
                "label": "删除"
            },
            {
                "code": "customCopyRow",
                "label": "复制"
            },
            {
                "code": "customSave",
                "label": "保存"
            },
            {
                "code": "customAddRow",
                "label": "新增"
            }
        ], []),
        created () {
            console.log('初始化')
        },

        mounted () {
            console.log('初始化')
            invoiceExpInfo.mounted(viewModal)
        },
        customDeteleRow (btn, rowData) {
            invoiceExpInfo.customDeteleRow(viewModal, btn, rowData)

        },
        customCopyRow (btn, rowData) {
            // invoiceExpInfo.customImport(viewModal, btn, rowData)

        },
        customSave (btn, rowData) {
            invoiceExpInfo.customSave(viewModal, btn, rowData)
        },
        customAddRow (btn, rowData) {
            invoiceExpInfo.customAddRow(viewModal, btn, rowData)
        }
    }
    return result
}