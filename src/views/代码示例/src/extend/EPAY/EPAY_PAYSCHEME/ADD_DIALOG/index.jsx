/*
 * @Descripttion: 接口方案弹框
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-06 10:58:29
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-19 14:22:44
 */
import service from '@/common/const/service'
import commonMethod from '@/common/utils'
export default (viewModal) => {
  const result = {
    // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
    api: [
      { code: 'detailDelete', label: '单位账户删除' },
      { code: 'detailSaveAndAdd', label: '保存并新增' },
      { code: 'detailSave', label: '保存' },
      { code: 'detailCancel', label: '取消' }
    ],
    agencyCode: '',
    mofDivCode: '',
    fiscalYear: '',
    yondifEnv: null,
    deleteDate: [],
    searchParams: {}, // 查询条件
    entyData: {}, // 实体数据
    id: '', // 编辑数据id
    mounted () {
      result.treeData = viewModal.getNodeByCode('root')
      result.id = commonMethod.getUrlParameter('id')
      result.divCodeHandle(result.treeData.children)
      if (result.id) { // 存在id，为编辑数据
        result.getSchemeDetail() // 获取接口方案详情
      }

      let yondifEnv = localStorage.getItem('yondifEnv')
      if (yondifEnv) {
        result.yondifEnv = JSON.parse(yondifEnv)
        result.agencyCode = result.yondifEnv.unitCode
        result.mofDivCode = result.yondifEnv.rgCode
        result.fiscalYear = result.yondifEnv.setYear
      }
    },
    // 获取实体元数据
    divCodeHandle (data) {
      data.forEach(item => {
        const { dataType, divCode, nodeType, name, enty, children } = item
        if (name !== 'root' && dataType === 'enty' && enty) {
          if (nodeType === 'form') { // 表单实体
            result.entyData.form = item
          }
          if (nodeType === 'table') { // 表格实体
            result.entyData.table = item
          }
        } else {
          if (children && children.length) {
            result.divCodeHandle(children)
          }
        }
      })
    },
    // 获取接口方案详情
    getSchemeDetail () {
      const data = {
        queryScheme: {
          conditions: [
            {
              name: 'id',
              op: 'eq',
              v1: result.id
            }
          ],
          fields: [{ name: '*' }],
          compositions: [
            {
              name: 'AEPAYPayschemeDetailList',
              fields: [{ name: '*' }]
            }
          ]
        },
        busiObj: 'AEPAYPayscheme'
      }
      viewModal.post({
        url: `/${service.BASE_BE_URL}/ybill/detail`,
        data: data,
        waitfor: true
      }).then(res => {
        if (res && res.data) {
          let data = res.data
          let table = JSON.parse(JSON.stringify(data.aepaypayschemeDetailList)) // 单位账户表格数据
          viewModal.get(result.entyData.table.divCode).loadData(table || [])
          viewModal.setEntyValues(result.entyData.table.divCode, table || [], true)
          delete data.aepaypayschemeDetailList
          viewModal.setEntyValues(result.entyData.form.divCode, data) // 更新表单基本信息
        }
      })
    },
    // 单位账户删除
    detailDelete () {
      let data = []
      const selectRows = viewModal.get(result.entyData.table.divCode).getSelectRow()
      const tableData = viewModal.get(result.entyData.table.divCode).getTableData().data
      if (selectRows.length === 0) {
        return viewModal.warning('请选择要删除的数据！')
      }
      tableData.forEach(ele => {
        const flag = selectRows.some(item => item.id === ele.id)
        if (!flag) {
          data.push(ele)
        }
      })
      let dejson = JSON.parse(JSON.stringify(selectRows))
      dejson.forEach(item => {
        item['_status'] = 3
      })

      result.deleteDate.push(...dejson)
      viewModal.get(result.entyData.table.divCode).loadData(data || [], { clearSelected: true })
      viewModal.setEntyValues(result.entyData.table.divCode, data || [])
    },
    // 保存并新增
    detailSaveAndAdd () {
      this.saveHandle('saveAndAdd')
    },
    // 保存
    detailSave () {
      this.saveHandle('save')
    },
    // 保存逻辑组装数据
    saveHandle (type) {
      // 非空校验
      viewModal.validateCheck().then(errorList => {
        if (errorList.length) {
          viewModal.Message.error('单据检查未通过！')
          return false
        }
        const entyValues = viewModal.getEntyValues()
        let param = entyValues[result.entyData.form.divCode].data
        param['AEPAYPayschemeDetailList'] = entyValues[result.entyData.table.divCode].data
        param['AEPAYPayschemeDetailList'].forEach(item => {
          if (!item.agencyCode) {
            item.agencyCode = result.agencyCode
          }
          if (!item.mofDivCode) {
            item.mofDivCode = result.mofDivCode
          }
          if (!item.fiscalYear) {
            item.fiscalYear = result.fiscalYear
          }
          if (item['_status'] !== 0) {
            item['_status'] = 'Insert'
          }
        })

        param['AEPAYPayschemeDetailList'].push(...result.deleteDate)
        const data = {
          data: param,
          extendData: {},
          busiObj: 'AEPAYPayscheme'
        }
        let url = ''
        if (result.id) { // 编辑保存
          url = `/${service.BASE_BE_URL}/ybill/save`
        } else { // 新增保存
          url = `/${service.BASE_BE_URL}/ybill/add`
        }
        viewModal.post({ url: url, data: data, waitfor: true }).then(res => {
          if (res.error === false) {
            viewModal.success('保存成功！')
            switch (type) {
              case 'saveAndAdd': // 保存并新增
                result.id = '' // 清空id
                commonMethod.clearFormValues(viewModal, result.entyData.form.children, result.entyData.form.divCode) // 清空表单
                viewModal.get(result.entyData.table.divCode).loadData([]) // 清空表格
                viewModal.setEntyValues(result.entyData.table.divCode, [], true)
                result.deleteDate = []
                break
              default: // 保存并关闭页面
                this.detailCancel()
                break
            }
          }
        })
      })
    },
    // 取消
    detailCancel () {
      window.parent.closePage()
    }
  }
  return result
}
