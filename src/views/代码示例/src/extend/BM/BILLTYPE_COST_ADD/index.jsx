/*
 * @Descripttion: 票据类型与费用对照新增弹窗
 * @version: 
 * @Author: guohx
 * @Date: 2023-06-14 19:32:21
 * @LastEditors: guohx
 * @LastEditTime: 2023-06-16 16:33:49
 */

import commonMethod from '@/common/utils' // 工具方法 
import service from '../../../common/const/service';

export default (viewModal) => {
  let baseData;
  if (window.parent.colloctData) {
    baseData = window.parent.colloctData
  } else {
    baseData = window.parent[0].colloctData
  }
  const result = {
    // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
    api: [
      { code: 'save', label: '保存' },
      { code: 'saveAndAdd', label: '保存并新增' },
      { code: 'cancel', label: '取消' }
    ],
    formContainer : 'formContainer',
    entyData: {}, // 实体数据
    // 表单实体对象
    formData: {},
    created() {

    },
    mounted() {
      let yondifEnv = localStorage.getItem('yondifEnv')
      if (yondifEnv) {
        result.yondifEnv = JSON.parse(yondifEnv)
      }
      result.treeData = viewModal.getNodeByCode('root')
      result.divCodeHandle(result.treeData.children)
      const invoiceTypeCode = commonMethod.getUrlParameter('invoiceTypeCode')
      const invoiceTypeName = commonMethod.getUrlParameter('invoiceTypeName')
      const actionCode = commonMethod.getUrlParameter('actionCode')
      if (actionCode == "add") {
        result.formData = {
          invoiceTypeCode: invoiceTypeCode,
          invoiceTypeName: invoiceTypeName,
          invoiceContextKey: '',
          expenseTypeCode: '',
          frequency: ''
        }
      } else {
        result.formData = baseData
      }
      // 更新表单
      viewModal.setEntyValues(result.formContainer, result.formData)
    },
    // 保存
    save() {
      const entyValues = viewModal.getEntyValues()
      let formData = entyValues[result.entyData.key].data
      var saveData = {
        expenseTypeCode: formData.expenseTypeCode,
        expenseTypeName: formData.expenseTypeName,
        invoiceTypeCode: formData.invoiceTypeCode,
        invoiceTypeName: formData.invoiceTypeName,
        frequency: formData.frequency,
        invoiceContextKey: formData.invoiceContextKey,
        agencyCode: result.yondifEnv.unitCode,
        mofDivCode: result.yondifEnv.rgCode,
        fiscalYear: result.yondifEnv.setYear
      }
      let array = []
      array.push(saveData)
      // 请求接口
      const url = `/${service.BASE_BE_URL}/ar/api/invoice/saveIArInvoice`
      viewModal.post({ url, data: array }).then(function (res) {
        if (res.error === false) {
          viewModal.Message.info('保存成功');
          window.parent.colloctDataCallback('confirm')
        } else {
          viewModal.Message.error(res.message);
        }
      })
    },
    // 保存并新增
    saveAndAdd() {
      const entyValues = viewModal.getEntyValues()
      let formData = entyValues[result.entyData.key].data
      var saveData = {  
        expenseTypeCode: formData.expenseTypeCode,
        expenseTypeName: formData.expenseTypeName,
        invoiceTypeCode: formData.invoiceTypeCode,
        invoiceTypeName: formData.invoiceTypeName,
        frequency: formData.frequency,
        invoiceContextKey: formData.invoiceContextKey,
        agencyCode: result.yondifEnv.unitCode,
        mofDivCode: result.yondifEnv.rgCode,
        fiscalYear: result.yondifEnv.setYear
      }
      let array = []
      array.push(saveData)
      // 请求接口
      const url = `/${service.BASE_BE_URL}/ar/api/invoice/saveIArInvoice`
      viewModal.post({ url, data: array }).then(function (res) {
        if (res.error === false) {
          viewModal.Message.info('保存成功');
          const newFormData = {
            invoiceTypeCode: result.formData.invoiceTypeCode,
            invoiceTypeName: result.formData.invoiceTypeName,
            invoiceContextKey: '',
            expenseTypeCode: '',
            frequency: ''
          }
          viewModal.setEntyValues(result.formContainer, newFormData) // 更新表单基本信息 
        } else {
          viewModal.Message.error(res.message);
        }
      })
    },
    // 取消
    cancel() {
      window.parent.colloctDataCallback('cancel')
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
  }
  return result
}
