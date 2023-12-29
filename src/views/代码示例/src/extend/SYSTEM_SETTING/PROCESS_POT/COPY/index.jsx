/*
 * @Descripttion: 审批要点复制
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-02 15:46:18
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-09 14:37:15
 */
import service from "../../../../common/const/service"
export default (viewModal) => {
  const result = {
    // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
    api: [
      { code: 'goalNodeConfirm', label: '选择目标节点确定' },
      { code: 'goalNodeCancel', label: '选择目标节点取消' }
    ],
    yondifEnv: {}, // 上下文信息
    selectTreeData: [], // 选中的数据
    treeData: {},
    mounted () {
      if (window.parent.nodeData) {
        result.treeData = window.parent.nodeData
      } else {
        result.treeData = window.parent[0].nodeData
      }
      viewModal.get('treeWrap').loadData(result.treeData.nodeList || [])
      result.onListenerUiData()
    },
    onListenerUiData () {
      viewModal.on('treeWrap', 'onCheck', param => {
        result.selectTreeData = []
        let data = param.data.info.checkedNodes
        data.forEach(ele => {
          if (ele.key !== 'all') {
            const obj = {
              nodeId: ele.key,
              nodeName: ele.title
            }
            result.selectTreeData.push(obj)
          }
        })
      })
    },
    // 确定
    goalNodeConfirm () {
      const data = {
        nodeId: result.treeData.nodeId,
        billTypeCode: result.treeData.billTypeCode,
        agencyCode: result.treeData.agencyCode,
        targetNodes: result.selectTreeData,
        mofDivCode: result.treeData.mofDivCode
      }
      viewModal.post({
        url: `/${service.BASE_BE_URL}/ar/process/auditpoint/copyPoint`,
        data: data,
        waitfor: true
      }).then(res => {
        if (res.error === false) {
          viewModal.success('复制成功！')
          result.goalNodeCancel()
        }
      })
    },
    // 取消
    goalNodeCancel () {
      if (window.parent.closeModal) {
        window.parent.closeModal()
      } else {
        window.parent[0].closeModal()
      }
    }
  }
  return result
}
