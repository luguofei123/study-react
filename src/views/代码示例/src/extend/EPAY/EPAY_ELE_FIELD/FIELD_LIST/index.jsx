/*
 * @Descripttion: 电子报文
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-14 10:28:05
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-07-18 15:14:51
 */
import service from '@/common/const/service'
 export default (viewModal) => {
    const result = { 
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [
        { code: 'eleFieldAdd', label: '电子报文新增' },
        { code: 'eleFieldEdit', label: '电子报文编辑' },
        { code: 'eleFieldDelele', label: '电子报文删除' }
      ],
      entyData: {}, // 实体数据
      conditions: [], // 查询条件
      treeNode: {}, // 当前选中的节点树
      payTreeData: [], // 交易类型树
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.divCodeHandle(result.treeData.children)
        result.onListenerUiData() // 监听元数据
        result.getPayChannelAndPayType() // 查询支付方式和交易类型树
      },
      // 获取实体元数据
      divCodeHandle(data) {
        data.forEach(item => {
          const { dataType, divCode, nodeType, name, enty, children } = item
          if (name !== 'root' && dataType === 'enty' && enty) {
            if (nodeType === 'form') { // 查询实体
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
      // 查询支付方式和交易类型树
      getPayChannelAndPayType() {
        viewModal.post({
          url: `/${service.BASE_BE_URL}/epay/getPayChannelAndPayType`,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            result.payTreeData = res.data
            viewModal.get('transactionType').loadData(res.data || []) // 加载左侧交易类型树
            if (res.data && res.data[0].children && res.data[0].children[0]) {
                viewModal.get('transactionType').selectNode(res.data[0].children[0]) // 默认选中第一个
            }
          }
        })
      },
      // 查询电子报文列表数据
      getEleFieldList() {
        const queryScheme = viewModal.get(result.entyData.form.divCode)
        let data = {
          queryScheme: {
            conditions: queryScheme.getQCondition(),
            fields: [{name: '*'}]
          },
          actionCode: 'EpayFieldMappingListAction',
          busiObj: 'AEPAYFieldMapping'
        }
        data.queryScheme.conditions = [...data.queryScheme.conditions, ...result.conditions]
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/pub`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.get(result.entyData.table.divCode).loadData(res.data || [], {clearSelected: true})
          }
        })
      },
      // 新增
      eleFieldAdd(btn) {
        const item = result.payTreeData.find(ele => ele.key === result.treeNode.parentNode)
        let argu = '&payChannelCode=' + result.treeNode.key + '&payChannelName=' + result.treeNode.title + '&transactionTypeCode=' + result.treeNode.parentNode + '&transactionTypeName=' + item.title
        const data = {
          url: '/yondif-pvdf-fe/#/BillRender?&code=DZBWBJ' + argu,
          title: '新增',
          pageId: 'eleFieldAdd'
        }
        result.showPage(data) // 单据页面
        window.closePage = this.closePageCallBack.bind(null, data) // 关闭回调
      },
      // 编辑
      eleFieldEdit(btn, rowData) {
        const data = {
          url: `/yondif-pvdf-fe/#/BillRender?&code=DZBWBJ&id=` + rowData.id,
          title: '编辑',
          pageId: 'eleFieldEdit'
        }
        result.showPage(data)
        window.closePage = this.closePageCallBack.bind(null, data) // 关闭回调
      },
      // 删除
      eleFieldDelele(btn, rowData) {
        let ids = ''
        if (rowData) { // 表格行删除
          viewModal.Modal.confirm({
            title: '提示',
            content: ('是否要删除当前数据'),
            onOk(){
              ids = rowData.id
              result.deleteDataAPI(ids)
            }
          })
        } else { // 多行删除
          const selectRows = viewModal.get(result.entyData.table.divCode).getSelectRow()
          if (selectRows.length === 0) {
            return viewModal.warning('请选择要删除的数据！')
          }
          ids = selectRows.map(i => i.id).join(',')
          result.deleteDataAPI(ids)
        }
      },
      // 删除api
      deleteDataAPI(ids) {
        const data = {
          ids: ids,
          busiObj: 'AEPAYFieldMapping'
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/delete`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.success('删除成功！')
            result.getEleFieldList()
          }
        })
      },
      // 打开页面
      showPage(data) {
        viewModal.showPage({
          pageUrl: data.url,
          title: data.title,
          margintop: 0,
          pageId: data.pageId,
        })
      },
      // 页面关闭回调
      closePageCallBack(data) {
        viewModal.closePageModal(data.pageId) // 关闭页面
        result.getEleFieldList() // 查询列表数据
      },
      // 监听元数据
      onListenerUiData() {
        // 交易类型树父级不可点击
        const newTree = viewModal.get('transactionType')
        if (newTree) {
          newTree.setNodeEnableFunc((node) => {
            return new Promise((res, rej) => {
              const isAllowed = !['0'].includes(node.node.parentNode)
              res(isAllowed)
            })
          })
        }
        // 监听交易类型树，点击节点查询数据
        viewModal.on('transactionType', 'onSelect', param => {
          result.treeNode = param.data
          result.conditions = [
            {
              name: 'payChannelCode',
              op: 'eq',
              v1: param.data.parentNode
            },
            {
              name: 'transactionTypeCode',
              op: 'eq',
              v1: param.data.key
            }
          ]
          result.getEleFieldList() // 查询当前交易类型的电子报文数据
        })
        // 绑定搜索事件
        viewModal.on(result.entyData.form.divCode, 'onQuery', (item) => {
          result.getEleFieldList()
        })
      }
    }
    return result
 }