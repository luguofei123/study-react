/*
 * @Descripttion: 流程中操作
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-02 15:46:18
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-18 09:16:09
 */
import billType from '../../../../components/LCDArProcessPot/billType' // 单据类型
import processPot from '../../../../components/LCDArProcessPot/processPot' // 流程中操作
import aduitRules from '../../../../components/LCDArProcessPot/aduitRules' // 稽核规则
import service from '../../../../common/const/service'
import agentTree from '@/common/agentTree'
export default (viewModal) => {
  const result = {
    // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
    api: [
      { code: 'processPotSave', label: '流程中操作保存' },
      { code: 'selectPoint', label: '选择稽核规则' },
      { code: 'copyNode', label: '稽核规则复制' }
    ],
    ui: [
      { key: 'billType', name: 'billType', label: '单据类型', widget: billType, nodeType: 'card', rowHeight: 20, h: 30, w: 6, hide: 0, props: { vm: viewModal }, config: ['label', 'divCode'], events: ['onMount'], parentNodeType: ['root', 'dragact'] },
    ],
    yondifEnv: {}, // 上下文信息
    billTypeCode: '', // 单据类型
    tabNo: 'process', //流程中操作
    billTypeRef: React.createRef('billType'),
    processPotRef: React.createRef('processPot'),
    processNodeRef: React.createRef('processNode'),
    selectAuditRef: React.createRef('selectAudit'),
    nodeId: '',
    copyKey: 'SPYDFZ',
    selectPointKey: 'XZJHGZ',
    nodeList: [], // 当前单据类型下的流程节点
    pointList: [], // 已选稽核、审批要点
    agentTree: '202308020904404076041176717354',
    agencyCode: '',
    mofDivCode: '',
    mounted () {
      let yondifEnv = localStorage.getItem('yondifEnv')
      if (yondifEnv) {
        result.yondifEnv = JSON.parse(yondifEnv)
        result.agencyCode = result.yondifEnv.unitCode
        result.mofDivCode = result.yondifEnv.rgCode

      }
      agentTree.getAgentTree(viewModal, result.agentTree).then(res => {
        result.agencyCode = res.agencyCode
        result.mofDivCode = res.mofDivCode

        // 监听单位树
        viewModal.on(result.agentTree, 'onChange', (param) => {
          result.agencyCode = param.data.agencyCode
          result.mofDivCode = param.data.mofDivCode
          result.freshLeftBillType()
          // result.getOptList(result.billTypeCode)
          // result.getNodeList(result.billTypeCode)
        })
      })
      result.onListenerUiData()
      result.freshLeftBillType()
    },
    // 刷新左侧数据
    freshLeftBillType () {
      viewModal.request({
        url: `/${service.BASE_BE_URL}/ar/billtype/getBillTypeTree?agencyCode=${result.agencyCode}&mofDivCode=${result.mofDivCode}`,
        waitfor: false
      }).then(res => {
        const billTypeTree = res.data || []
        const activeCateCode = billTypeTree[0].billCateCode
        const activeNode = billTypeTree[0].billTypeList[0]
        result.setUiData(billTypeTree, activeCateCode, activeNode)
        result.billTypeClick(activeNode)
      })
    },
    // 模板元数据加载
    setUiData (billTypeTree, activeCateCode, activeNode) {
      // 单据类型
      const billTypeWrap = viewModal.get('billTypeWrap')
      if (billTypeWrap) {
        billTypeWrap.appendChild(billType,
          {
            name: '单据类型',
            billTypeTree: billTypeTree,
            activeCateCode: activeCateCode,
            activeNode: activeNode,
            ref: result.billTypeRef,
            billTypeClick: (e) => result.billTypeClick(e),
            vm: viewModal
          })
      }
      // 流程中操作
      const processPotWrap = viewModal.get('processPot')
      if (processPotWrap) {
        processPotWrap.appendChild(processPot,
          {
            name: '流程中操作',
            processPotlist: [],
            ref: result.processPotRef,
            vm: viewModal
          })
      }
      // 流程节点
      const processNodeWrap = viewModal.get('processNode')
      if (processNodeWrap) {
        processNodeWrap.appendChild(aduitRules,
          {
            name: '流程节点',
            ref: result.processNodeRef,
            nodeOnClick: (e) => result.nodeClick(e),
            vm: viewModal
          })
      }
      // 已选稽核
      const selectAuditWrap = viewModal.get('selectAudit')
      if (selectAuditWrap) {
        selectAuditWrap.appendChild(aduitRules,
          {
            name: '已选稽核',
            ref: result.selectAuditRef,
            deletePointClick: (e) => result.deletePointClick(e),
            vm: viewModal
          })
      }
    },
    // 点击单据类型，获取流程中操作和稽核规则
    billTypeClick (t) {
      this.billTypeCode = t.code
      this.getOptList(t.code)
      this.getNodeList(t.code)
    },
    // 获取流程中操作选项
    getOptList (code) {
      viewModal.request({
        url: `/${service.BASE_BE_URL}/ar/process/processOpt/getOpt?billTypeCode=${code}&agencyCode=${result.agencyCode}&mofDivCode=${result.mofDivCode}`,
        waitfor: false,
      }).then(res => {
        this.getNodeValList(code).then(val => {
          const autoRecalculateTaxValList = val.data.filter(ele => ele.nodeId !== 'save' && ele.nodeId !== 'audited')

          // 过滤数据                 单据类型                    默认值
          // 1 允许时间打印点          所有单据                    保存后
          // 2 占指标时点             所有单据                     保存后
          // 3 允许支付时点            单据类型不等于申请单或还款单    终审后
          // 4 允许生成凭证时点         单据类型不等于申请单          终审后
          // 5 参与合并计税时点         单据等于报销单 且 当前单据费用存在税金类型===劳务费个税 时显示                  终审后
          // 6 审核时自动重算个税岗位：  单据等于报销单 且 当前单据费用存在税金类型===劳务费个税 时显示                     空
          // 7 允许收单/投递时点：       所有单据                    保存后
          let resultList = res.data
          // let filterData = []
          // resultList.forEach(item => {
          //   item.show = true
          //   if (code.includes('APPLY_') || code.includes('LOAN_')) {
          //     if (item.optCode === 'canPay') {
          //       item.show = false
          //     }
          //   }
          //   if (code.includes('APPLY_')) {
          //     if (item.optCode === 'canGenerateVou') {
          //       item.show = false
          //     }
          //   }
          //   if (code.includes('EXP_')) {
          //     if (item.optCode === 'canGenerateVou') {
          //       item.show = false
          //     }
          //   }
          // })
          // filterData = resultList.filter(i => i.show)

          const param = {
            data: resultList,
            valList: val.data,
            autoRecalculateTaxValList: autoRecalculateTaxValList
          }
          result.processPotRef.current.setProcessPotData(param)
        })
      })
    },
    // 获取流程中操作选项下拉值集
    getNodeValList (code) {
      const res = viewModal.request({
        url: `/${service.BASE_BE_URL}/ar/process/processOpt/getNodeValList?billTypeCode=${code}&agencyCode=${result.agencyCode}&mofDivCode=${result.mofDivCode}`,
        waitfor: false,
      })
      return res
    },
    // 获取稽核规则，流程节点
    getNodeList (code) {
      viewModal.request({
        url: `/${service.BASE_BE_URL}/ar/process/processOpt/getNodeList?billTypeCode=${code}&agencyCode=${result.agencyCode}&mofDivCode=${result.mofDivCode}`,
        waitfor: true,
      }).then(res => {
        result.nodeList = res.data || []
        const nodeParam = {
          list: res.data || [],
          type: 'node'
        }
        result.processNodeRef.current.setNodeList(nodeParam) // 点击流程节点，更新已选稽核
        if (res.data && res.data.length) {
          result.nodeId = res.data[0].nodeId || ''
        }
        if (result.nodeId) {
          this.getPointList(result.nodeId).then(val => {
            result.pointList = val.data || []
            const param = {
              list: val?.data || [],
              type: 'point'
            }
            result.selectAuditRef.current.setNodeList(param) // 点击流程节点，更新已选稽核
          })
        }
      })
    },
    // 根据流程节点，获取已选稽核数据
    getPointList (nodeId) {
      const data = {
        nodeId: nodeId,
        billTypeCode: this.billTypeCode,
        agencyCode: result.agencyCode,
        mofDivCode: result.mofDivCode
      }
      const res = viewModal.post({
        url: `/${service.BASE_BE_URL}/ar/process/auditpoint/getPointList`,
        data: data,
        waitfor: true,
      })
      return res
    },
    // 点击流程节点，获取已选稽核、审批要点
    nodeClick (data) {
      result.nodeId = data.nodeId
      this.getPointList(data.nodeId).then(val => {
        result.pointList = val.data || []
        const param = {
          list: val?.data || [],
          type: 'point'
        }
        result.selectAuditRef.current.setNodeList(param) // 点击流程节点，更新已选稽核
      })
    },
    // 删除已选稽核、审批要点
    deletePointClick (data) {
      result.pointList = result.pointList.filter(ele => ele.code !== data.code)
      const obj = {
        list: result.pointList || [],
        type: 'point'
      }
      result.selectAuditRef.current.setNodeList(obj)
    },
    // 监听元数据
    onListenerUiData () {
      // 监听多页签
      viewModal.on('rightTabs', 'onChange', param => {
        if (param.data.label.includes('流程')) {
          result.tabNo = 'process' // 流程中操作
        } else {
          result.tabNo = 'point' // 已选稽核（审批要点）
        }
      })
      // 监听选择稽核规则
      viewModal.on('btn-selectPoint', 'onChange', param => {
        let data = param.data
        data.forEach(ele => {
          ele.name = ele.pointName
          ele.code = ele.pointCode
        })
        let pointList = [...result.pointList, ...data]
        result.pointList = result.filterData(pointList)
        const obj = {
          list: result.pointList || [],
          type: 'point'
        }
        result.selectAuditRef.current.setNodeList(obj)
      })
      viewModal.on('btn-save', 'onClick', param => {
        if (result.tabNo === 'process') {
          let processPotData = JSON.parse(JSON.stringify(result.processPotRef.current.state.processPotData))
          processPotData.forEach(ele => {
            if (ele.nodeId && Array.isArray(ele.nodeId)) {
              ele.nodeId = ele.nodeId.join(',')
              ele.nodeName = ele.nodeName.join(',')
            }
          })
          const data = {
            billTypeCode: this.billTypeCode,
            agencyCode: result.agencyCode,
            processOptList: processPotData,
            mofDivCode: result.mofDivCode
          }
          viewModal.post({
            url: `/${service.BASE_BE_URL}/ar/process/processOpt/saveOpt`,
            data: data,
            waitfor: true,
          }).then(res => {
            if (res.error === false) {
              viewModal.success('保存成功！')
            }
          })
        } else {
          // 稽核规则保存
          const data = {
            nodeId: result.nodeId,
            billTypeCode: this.billTypeCode,
            agencyCode: result.agencyCode,
            auditPointList: result.pointList,
            mofDivCode: result.mofDivCode
          }
          viewModal.post({
            url: `/${service.BASE_BE_URL}/ar/process/auditpoint/savePoint`,
            data: data,
            waitfor: true
          }).then(res => {
            if (res.error === false) {
              viewModal.success('保存成功！')
            }
          })
        }
      })
    },
    // 数据去重
    filterData (data) {
      let arr = data
      if (data && data.length) {
        arr = data.filter((x, index) => {
          let arrCode = []
          data.forEach(item => {
            arrCode.push(item.code)
          })
          return arrCode.indexOf(x.code) === index
        })
      }
      return arr
    },
    // 保存
    processPotSave () {
      if (result.tabNo === 'process') {
        let processPotData = JSON.parse(JSON.stringify(result.processPotRef.current.state.processPotData))
        processPotData.forEach(ele => {
          if (ele.nodeId && Array.isArray(ele.nodeId)) {
            ele.nodeId = ele.nodeId.join(',')
            ele.nodeName = ele.nodeName.join(',')
          }
        })
        const data = {
          billTypeCode: this.billTypeCode,
          agencyCode: result.agencyCode,
          processOptList: processPotData,
          mofDivCode: result.mofDivCode
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ar/process/processOpt/saveOpt`,
          data: data,
          waitfor: true,
        }).then(res => {
          if (res.error === false) {
            viewModal.success('保存成功！')
          }
        })
      } else {
        // 稽核规则保存
        const data = {
          nodeId: result.nodeId,
          billTypeCode: this.billTypeCode,
          agencyCode: result.agencyCode,
          mofDivCode: result.mofDivCode,
          internalDepCode: '',
          auditPointList: result.pointList
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ar/process/auditpoint/savePoint`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.success('保存成功！')
          }
        })
      }
    },
    // 选择稽核规则
    selectPoint () {
      const obj = {
        billTypeCode: result.billTypeCode,
        agencyCode: result.agencyCode,
        mofDivCode: result.mofDivCode,
        selectedData: result.pointList
      }
      window.contextData = obj
      window.closeSelectPointModal = result.closeSelectPointModal
      viewModal.showModal({
        pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${result.selectPointKey}&cacheUI=0`,
        title: '选择目标节点',
        margintop: 80,
        pageId: result.selectPointKey, // 关闭时的key
        "props": {
          // 同 上面的参数 pageUrl，此处可不写
          "width": 500,
          "height": 500,
          "unit_type": {
            // 此处加上这个属性，width和height就是px，否则是百分比
            "label": "px",
            "value": "px"
          }
        }
      })
    },
    // 关闭选择稽核规则弹框
    closeSelectPointModal (type, data) {
      viewModal.closePageModal(result.selectPointKey) // 关闭弹框
      if (type === 'confirm') { // 弹框确定，带入稽核规则
        data.forEach(ele => {
          ele.name = ele.pointName
          ele.code = ele.pointCode
          ele.parentId = ele.parentPointCode
        })
        let pointList = [...result.pointList, ...data]
        result.pointList = result.filterData(pointList)
        const obj = {
          list: result.pointList || [],
          type: 'point'
        }
        result.selectAuditRef.current.setNodeList(obj)
      }
    },
    // 复制 打卡复制弹框
    copyNode () {
      let nodeArr = []
      result.nodeList.forEach(ele => {
        if (ele.nodeId !== result.nodeId) {
          const data = {
            key: ele.nodeId,
            title: ele.nodeName
          }
          nodeArr.push(data)
        }
      })
      let arr = [{ key: 'all', title: '全部', children: nodeArr }]
      const obj = {
        nodeId: result.nodeId,
        nodeList: arr,
        billTypeCode: result.billTypeCode,
        agencyCode: result.agencyCode,
        mofDivCode: result.mofDivCode
      }
      window.nodeData = obj
      window.closeModal = result.closeModal
      viewModal.showModal({
        pageUrl: `/yondif-pvdf-fe/#/BillRender?code=${result.copyKey}&cacheUI=0`,
        title: '选择目标节点',
        margintop: 80,
        pageId: result.copyKey, // 关闭时的key
        "props": {
          // 同 上面的参数 pageUrl，此处可不写
          "width": 500,
          "height": 500,
          "unit_type": {
            // 此处加上这个属性，width和height就是px，否则是百分比
            "label": "px",
            "value": "px"
          }
        }
      })
    },
    // 关闭复制弹框
    closeModal () {
      viewModal.closePageModal(result.copyKey)
    }
  }
  return result
}
