/*
 * @Descripttion: 银行交易流水查询
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-13 10:58:29
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-15 14:12:48
 */
import service from '@/common/const/service'
import commonMethod from '@/common/utils'
 export default (viewModal) => {
    const result = {
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [
        { code: 'tradeDetailHistoryQuery', label: '查询历史明细' },
        { code: 'tradeDetailTodayQuery', label: '查询当日明细' }
      ],
      treeData: {},
      searchParams: {}, // 查询条件
      entyData: {}, // 实体数据
      pageSize: 50,
      pageIndex: 1,
      actionCode: 'EpayTradeDetailHisQueryAction', // EpayTradeDetailHisQueryAction 历史，EpayTradeDetailTodayQueryAction 当日
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.divCodeHandle(result.treeData.children)
        result.getSearchInitValue() // 搜索区域初始化
        result.onListenerUiData() // 监听元数据
      },
      // 获取实体元数据
      divCodeHandle(data) {
        data.forEach(item => {
          const { dataType, nodeType, name, enty, children } = item
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
      // 获取银行交易流水列表数据
      getTradeList() {
        viewModal.setEntyValues(result.entyData.table.key, [], true)
        const queryScheme = viewModal.get(result.entyData.form.divCode)
        const accObj = queryScheme.state.queryString?.accNo || ''
        if (!accObj) {
          return viewModal.warning('请先选择己方账号')
        }
        result.searchParams = {
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
          actionCode: result.actionCode,
          busiObj: "AEPAYTradedetail",
          externalData: {
            accName: accObj?.bankAccName || ''
          }
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/ybill/pub`,
          data: result.searchParams,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.get(result.entyData.table.key).loadData(res.data.recordList || [], { total: res.data.recordCount })
            viewModal.setEntyValues(result.entyData.table.key, res.data.recordList || [], true)
          }
        })
      },
      // 查询历史明细
      tradeDetailHistoryQuery() {
        result.actionCode = 'EpayTradeDetailHisQueryAction'
        // 历史查询校验交易日期
        if (result.checkQueryVal()) {
          result.getTradeList()
        }
      },
      // 查询当日明细
      tradeDetailTodayQuery() {
        result.actionCode = 'EpayTradeDetailTodayQueryAction'
        result.getTradeList()
      },
      // 查询条件检查
      checkQueryVal() {
        const queryScheme = viewModal.get(result.entyData.form.divCode)
        const tradeDate = queryScheme.state.queryString?.tradeDate
        if (!tradeDate) {
          viewModal.warning('请选择交易日期')
          return false
        }
        const flag = commonMethod.checkTimeBeforeOne(tradeDate[1])
        if (!flag) {
          viewModal.warning('查询历史明细时，交易日期需小于当前日期')
          return false
        }
        return true
      },
      // 搜索区域初始化
      getSearchInitValue() {
        // 如果搜索区域有时间范围的组件，需要初始化这个组件，开始时间是当月的第一天，结束时间是当前日期的前一天
        if (result.entyData.form && result.entyData.form.children) {
          let nodeUi =  result.entyData.form.children
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
        const tableKey = result.entyData.table.divCode
        const formKey = result.entyData.form.divCode
        // 分页事件绑定
        viewModal.on(tableKey, 'onPageChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getTradeList()
        })
        // 分页事件绑定
        viewModal.on(tableKey, 'onPageSizeChange', ({ activeKey, pageSize }) => {
          result.pageIndex = activeKey || 1
          result.pageSize = pageSize
          result.getTradeList()
        })
        // 绑定搜索事件
        viewModal.on(formKey, 'onQuery', (item) => {
          result.actionCode = 'EpayTradeDetailHisQueryAction'
          result.getTradeList()
        })
      }
    }
    return result
 }
 