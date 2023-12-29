/*
 * @Descripttion: 接口方案列表页面
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-06 10:58:29
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-13 12:29:48
 */
import service from '@/common/const/service'
 export default (viewModal) => {
    const result = {
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [
        { code: 'paySchemeAdd', label: '接口方案新增' },
        { code: 'paySchemeEdit', label: '接口方案编辑' },
        { code: 'paySchemeDelele', label: '接口方案删除' }
      ],
      searchParams: {}, // 查询条件
      entyData: {}, // 实体数据
      pageSize: 50,
      pageIndex: 1,
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.divCodeHandle(result.treeData.children)
        result.onListenerUiData() // 监听元数据
        result.getPaySchemeList() // 获取接口方案列表数据
      },
      // 获取实体元数据
      divCodeHandle(data) {
        data.forEach(item => {
          const { dataType, divCode, nodeType, name, enty, children } = item
          if (name !== 'root' && dataType === 'enty' && enty) {
            result.entyData = item // 实体数据
          } else {
            if (children && children.length) {
              result.divCodeHandle(children)
            }
          }
        })
      },
      // 获取接口方案列表数据
      getPaySchemeList() {
        result.searchParams = {
          queryScheme: {
              fullname: result.treeData.enty.info.uri,
              fields: [],
              conditions: [],
              orders: [],
              pager: {
                pageIndex: result.pageIndex,
                pageSize: result.pageSize
              },
          },
          actionCode: 'EpayPaySchemeListAction',
          busiObj: 'AEPAYPayscheme',
          externalData: {}
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/pub`,
          data: result.searchParams,
          waitfor: true
        }).then(res => {
          viewModal.get(this.entyData.divCode).loadData(res.data.recordList, { clearSelected: true, total: res.data.recordCount })
        })
      },
      // 新增
      paySchemeAdd(btn) {
        const data = {
          url: '/yondif-pvdf-fe/#/BillRender?&code=JKFASZ',
          title: '新增',
          pageId: 'paySchemeAdd'
        }
        result.showPage(data) // 单据页面
        window.closePage = this.closePageCallBack.bind(null, data) // 关闭回调
      },
      // 编辑
      paySchemeEdit(btn, rowData) {
        console.log(btn, rowData)
        const data = {
          url: `/yondif-pvdf-fe/#/BillRender?&code=JKFASZ&id=` + rowData.id,
          title: '编辑',
          pageId: 'paySchemeEdit'
        }
        result.showPage(data)
        window.closePage = this.closePageCallBack.bind(null, data) // 关闭回调
      },
      // 删除
      paySchemeDelele(btn, rowData) {
        console.log(btn, rowData)
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
          const selectRows = viewModal.get(result.entyData.divCode).getSelectRow()
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
          busiObj: 'AEPAYPayscheme'
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/delete`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.success('删除成功！')
            result.getPaySchemeList()
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
        result.getPaySchemeList() // 刷新列表数据
      },
      // 监听元数据
      onListenerUiData() {
        // 分页事件绑定
        viewModal.on(result.entyData.divCode, 'onPageChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getPaySchemeList()
        })
        // 分页事件绑定
        viewModal.on(result.entyData.divCode, 'onPageSizeChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getPaySchemeList()
        })
      }
    }
    return result
 }
 