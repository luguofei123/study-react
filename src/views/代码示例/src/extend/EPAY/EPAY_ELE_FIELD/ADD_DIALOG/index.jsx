/*
 * @Descripttion: 电子报文弹框
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-06 10:58:29
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-08 18:28:28
 */
import service from '@/common/const/service'
import commonMethod from '@/common/utils'
 export default (viewModal) => {
    const result = {
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [
        { code: 'detailSaveAndAdd', label: '保存并新增' },
        { code: 'detailSave', label: '保存' },
        { code: 'detailCancel', label: '取消' }
      ],
      searchParams: {}, // 查询条件
      entyData: {}, // 实体数据
      id: '', // 编辑数据id
      parentData: {},
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.id = commonMethod.getUrlParameter('id')
        result.divCodeHandle(result.treeData.children)
        if (result.id) { // 存在id，为编辑数据
          result.getEleFieldDetail() // 获取电子报文详情
        } else {
          result.parentData = {
            payChannelCode: commonMethod.getUrlParameter('payChannelCode'),
            payChannelName: commonMethod.getUrlParameter('payChannelName'),
            transactionTypeCode: commonMethod.getUrlParameter('transactionTypeCode'),
            transactionTypeName: commonMethod.getUrlParameter('transactionTypeName')
          }
        }
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
      // 获取接口方案详情
      getEleFieldDetail() {
        const data = {
          queryScheme: {
            conditions: [
              {
                name: 'id',
                op: 'eq',
                v1: result.id
              }
            ],
            fields: [{name: '*'}]
         },
          busiObj: 'AEPAYFieldMapping'
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/detail`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res && res.data) {
            let data = res.data
            viewModal.setEntyValues(result.entyData.divCode, data) // 更新表单基本信息
          }
        })
      },
      // 保存并新增
      detailSaveAndAdd() {
        this.saveHandle('saveAndAdd')
      },
      // 保存
      detailSave() {
        this.saveHandle('save')
      },
      // 保存逻辑组装数据
      saveHandle(type) {
        // 非空校验
        viewModal.validateCheck().then(errorList => {
          if (errorList.length) {
            viewModal.Modal.error({
              title: '单据检查未通过',
              content: (errorList.map(item => <p key={item}>{item}</p>))
            })
            return false
          }
          const entyValues = viewModal.getEntyValues()
          let formData = entyValues[result.entyData.divCode].data
          let url = ''
          if (result.id) { // 编辑保存
            url = `/${service.BASE_BE_URL}/ybill/save`
          } else { // 新增保存
            url = `/${service.BASE_BE_URL}/ybill/add`
            Object.keys(result.parentData).forEach(key => {
              formData[key] = result.parentData[key]
            })
          }
          const data = {
            data: formData,
            busiObj: 'AEPAYFieldMapping'
          }
          viewModal.post({url: url, data: data, waitfor: true}).then(res => {
            viewModal.success('保存成功！')
            switch(type) {
              case 'saveAndAdd': // 保存并新增
                result.id = '' // 清空id
                commonMethod.clearFormValues(viewModal, result.entyData.children, result.entyData.divCode) // 清空表单
                break
              default: // 保存并关闭页面
                this.detailCancel()
                break
            }
          })
        })
      },
      // 取消
      detailCancel() {
        window.parent.closePage()
      }
    }
    return result
 }