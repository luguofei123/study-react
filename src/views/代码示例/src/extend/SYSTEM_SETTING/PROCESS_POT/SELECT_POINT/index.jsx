/*
 * @Descripttion: 审批要点复制
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-02 15:46:18
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-09 14:38:20
 */
import service from "../../../../common/const/service"
export default (viewModal) => {
  const result = {
    // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
    api: [
      { code: 'pointTreeConfirm', label: '选择稽核规则确定' },
      { code: 'pointTreeCancel', label: '选择稽核规则取消' }
    ],
    yondifEnv: {}, // 上下文信息
    selectTreeData: [], // 选中的数据
    selectedData: [],
    contextData: {},
    mounted () {
      if (window.parent.contextData) {
        result.contextData = window.parent.contextData
      } else {
        result.contextData = window.parent[0]?.contextData || {}
      }
      result.getPointRefTree()
      result.onListenerUiData()
    },
    // 获取稽核规则树
    getPointRefTree () {
      const data = {
        agencyCode: result.contextData.agencyCode,
        mofDivCode: result.contextData.mofDivCode,
        billTypeCode: result.contextData.billTypeCode
      }
      viewModal.post({
        url: `/${service.BASE_BE_URL}/ar/auditconfig/auditpoint/getPointRefTree`,
        data: data,
        waitfor: true
      }).then(res => {
        if (res.error === false) {
          viewModal.get('treeWrap').loadData(res.data || []) // 回显树

          // viewModal.get('treeWrap').selectNode()
        }
      })
    },
    onListenerUiData () {
      viewModal.on('treeWrap', 'onCheck', param => {
        result.selectTreeData = []
        let data = param.data.info.checkedNodes
        data.forEach(ele => {
          if (ele.parent) {
            result.selectTreeData.push(ele)
          }
        })
      })
    },
    // 确定
    pointTreeConfirm () {
      result.pointTreeCancel('confirm')
    },
    // 取消
    pointTreeCancel (type) {
      if (window.parent.closeSelectPointModal) {
        window.parent.closeSelectPointModal(type, result.selectTreeData)
      } else {
        window.parent[0].closeSelectPointModal(type, result.selectTreeData)
      }
    }
  }
  return result
}
