/*
 * @Descripttion:调整收款人弹窗
 * @version:
 * @Author: guohx
 * @Date: 2023-05-30 14:54:39
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-16 14:03:48
 */

import commonMethod from '@/common/utils' // 工具方法 
import epayTableFun from '../../../../common/epay/epayTableFun'
import service from '../../../../common/const/service'

export default (viewModal) => {  
    let baseData; 
    if (window.parent.colloctData) {
        baseData = window.parent.colloctData
    } else {
        baseData = window.parent[0].colloctData
    }
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        // api: commonMethod.mergeApi([],epayTableFun.epayActionCommon),
        api: [
            { code: 'savePayeeAndPay', label: '保存并支付' },
            { code: 'savePayee', label: '保存' },
            { code: 'cancelPayee', label: '取消' }
          ], 
          
        entyData: {}, // 实体数据
        listContainer : 'adjContainer' ,
        created() {

        },
        mounted() {  
            result.treeData = viewModal.getNodeByCode('root')
            result.divCodeHandle(result.treeData.children)
            baseData['payeeAcctName_new'] = baseData.payeeAcctName
            baseData['payeeAcctNo_new'] = baseData.payeeAcctNo
            baseData['payeeAcctBankName_new'] = baseData.payeeAcctBankName
            viewModal.setEntyValues(result.listContainer, baseData) // 更新表单基本信息 
            
        },
        // 保存
        savePayee() {
            const entyValues = viewModal.getEntyValues()
            let formData = entyValues[result.entyData.key].data
            console.log(formData)
            let saveData = { 
                agencyBizKey : "",
                _status: "Update",
                fiscalYear: formData.fiscalYear,
                mofDivCode: formData.mofDivCode,
                AEPAYPayinfoDetailList: [
                    {
                        payeeAcctName: formData.payeeAcctName_new,
                        payeeAcctNo: formData.payeeAcctNo_new,
                        payeeAcctBankName: formData.payeeAcctBankName_new,
                        id: formData.id,
                        amount: formData.amount,
                        modifyReason: formData.modifyReason,
                    }
                ]
            }
            let billContext = viewModal.getContext()  // 获取单据类型信息
            const url = `/${service.BASE_BE_URL}/ybill/save`
            const data = {
                data: saveData,
                busiObj: billContext.bizObjCode,
                externalData: {},
            } 
            viewModal.post({ url, data: data }).then(res => {
                if (res.error === false) {
                    viewModal.Message.info('调整收款人成功');
                    window.parent.colloctDataCallback('confirm')
                } else {
                    viewModal.Message.error(res.message);
                }
            })
        },
        // 保存并支付
        savePayeeAndPay() {
            const entyValues = viewModal.getEntyValues()
            let formData = entyValues[result.entyData.key].data
            console.log(formData)
            let saveData = { 
                agencyBizKey : "",
                _status: "Update", 
                AEPAYPayinfoDetailList: [
                    {
                        payeeAcctName: formData.payeeAcctName_new,
                        payeeAcctNo: formData.payeeAcctNo_new,
                        payeeAcctBankName: formData.payeeAcctBankName_new,
                        id: formData.id,
                        amount: formData.amount,
                        modifyReason: formData.modifyReason,
                    }
                ]
            }
            let billContext = viewModal.getContext()  // 获取单据类型信息
            const url = `/${service.BASE_BE_URL}/ybill/pub`
            const data = {
                data: saveData,
                busiObj: billContext.bizObjCode,
                externalData: {},
                actionCode : 'EpayPaySaveAndPayAgainAction'
            } 
            viewModal.post({ url, data: data }).then(res => {
                if (res.error === false) {
                    viewModal.Message.info('调整收款人并重新支付成功'); 
                    window.parent.colloctDataCallback('confirm')
                } else {
                    viewModal.Message.error(res.message);
                }
            })
        },
        // 获取实体元数据
        divCodeHandle(data) {
            data.forEach(item => {
                const { dataType, divCode, nodeType, name, enty, children } = item
                if (name !== 'root' && dataType === 'enty' && enty) {
                    result.entyData = item
                } else {
                    if (children && children.length) {
                        result.divCodeHandle(children)
                    }
                }
            })
        }, 
        cancelPayee () {
            window.parent.colloctDataCallback('cancel')
        },
    }
    return result
}
