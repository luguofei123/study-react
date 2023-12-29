/*
 * @Descripttion: 电子回单
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-14 10:28:05
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-14 15:28:12
 */
import service from '@/common/const/service'
import commonMethod from '@/common/utils'
 export default (viewModal) => {
    const result = {
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [],
      treeData: {},
      searchParams: {}, // 查询条件
      entyQueryData: {}, // 查询实体数据
      entyTableData: {}, // 表单实体数据
      pageSize: 50,
      pageIndex: 1,
      payeeAcctName: '', // 查询条件付款方户名
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.divCodeHandle(result.treeData.children)
        result.getSearchInitValue() // 初始化默认值
        result.onListenerUiData() // 监听元数据
      },
      // 获取实体元数据
      divCodeHandle(data) {
        data.forEach(item => {
          const { dataType, nodeType, name, enty, children } = item
          if (name !== 'root' && dataType === 'enty' && enty) {
            if (nodeType === 'form') { // 查询查询实体
              result.entyQueryData = item
            } else {
              result.entyTableData = item // 表格实体
            }
          } else {
            if (children && children.length) {
              result.divCodeHandle(children)
            }
          }
        })
      },
      // 获取电子回单数据
      getPayReturnList() {
        const queryScheme = viewModal.get(result.entyQueryData.divCode)
        const payAcctNo = queryScheme.state.queryString?.payAcctNo || ''
        if (!payAcctNo) {
          viewModal.warning('请选择付款方账号')
          return false
        }
        const data = {
          queryScheme: {
            fullname: result.treeData.enty.info.uri,
            fields: [],
            conditions: queryScheme.getQCondition(),
            orders: [],
            pager: {
              pageIndex: result.pageIndex,
              pageSize: result.pageSize
            }
          },
          actionCode: "EpayReturnBillQueryAction",
          busiObj: "AEPAYReturnBillInfo",
            externalData: {
              payAcctName: payAcctNo?.bankAccName || ''
          }
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/pub`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.get(result.entyTableData.divCode).loadData(res.data.recordList || [], { total: res.data.recordCount })
          }
        })
      },
      // 查询条件检查
      checkQueryVal() {
        const queryScheme = viewModal.get(result.entyQueryData.divCode)
        const tradeDate = queryScheme.state.queryString?.tradeDate
        if (!tradeDate) {
          viewModal.warning('请选择交易日期')
          return false
        }
        const flag = commonMethod.checkTimeBeforeOne(tradeDate[1])
        if (!flag) {
          viewModal.warning('交易日期需小于当前日期')
          return false
        }
        return true
      },
      // 搜索区域初始化
      getSearchInitValue() {
        // 如果搜索区域有时间范围的组件，需要初始化这个组件，开始时间是当月的第一天，结束时间是当前日期的前一天
        if (result.entyQueryData && result.entyQueryData.children) {
          let nodeUi =  result.entyQueryData.children
          nodeUi.forEach((item, index) => {
            if (item.name === 'YDFDateRange') {
              const v1 = commonMethod.getStartTime() // 当月的第一天
              const v2 = commonMethod.getTimeBeforeOne() // 当前日期的前一天
              viewModal.get(item.key).update({value: [v1, v2]})
            }
          })
        }
      },
      // 监听元数据
      onListenerUiData() {
        // 分页事件绑定
        viewModal.on(result.entyTableData.divCode, 'onPageChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getPayReturnList()
        })
        // 分页事件绑定
        viewModal.on(result.entyTableData.divCode, 'onPageSizeChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getPayReturnList()
        })
        // 绑定搜索事件
        viewModal.on(result.entyQueryData.divCode, 'onQuery', (item) => {
          if (result.checkQueryVal()) {
            result.getPayReturnList()
          }
        })
      }
    }
    return result
 }