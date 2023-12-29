/*
 * @Descripttion: 支付成功确认弹窗
 * @version: 
 * @Author: guohx
 * @Date: 2023-06-07 15:30:48
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-07 15:30:52
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
        paySucConfirmTC(btn, rowData){
            this.handleOk(viewModal,btn, rowData)
        },
        handleOk(viewModal, btn, rowData) {
            let ids = ''
            if (rowData) {
                ids = rowData.id
            } else {
                // 批量
                let tableId = viewModal.getNodeByCode(epayTableFun.tabNo).children[0].key
                const selectRows = viewModal.get(tableId).getSelectRow();
                if (selectRows.length === 0) {
                    viewModal.Message.info('请至少选择一条数据!')
                    return
                } else {
                    ids = selectRows.map(item => item.id).join(',')
                }
            }
            const url = `/${service.BASE_BE_URL}/ybill/pub`
            const data = {
                ids: ids,
                busiObj: epayTableFun.billContext.bizObjCode,
                actionCode: 'EpayPayInfoConfirmPayAction',
                externalData: {
                    "result": "SUCCESS"
                }
            }
            viewModal.Modal.confirm({
                title: '支付成功确认',
                content: ('请确认是否要进行支付成功确认？'),
                onOk() {
                    viewModal.post({ url, data: data }).then(res => {
                        if (res.error === false) {
                            viewModal.Message.info('支付成功确认成功');
                            epayTableFun.getTableList(viewModal, epayTableFun.searchParams)

                        } else {
                            viewModal.Message.error(res.message);
                        }
                    })
                },
            })
        },  
    }
    return result
}