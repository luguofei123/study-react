/*
 * @Descripttion: 账户余额查询
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-14 10:28:05
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-14 13:47:22
 */
import service from '@/common/const/service'
 export default (viewModal) => {
    const result = {
      // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
      api: [
        { code: 'tradeDetailHistoryQuery', label: '查询历史明细' },
        { code: 'tradeDetailTodayQuery', label: '查询当日明细' }
      ],
      treeData: {},
      entyQueryData: {}, // 查询实体数据
      entyFormData: {}, // 表单实体数据
      mounted () {
        result.treeData = viewModal.getNodeByCode('root')
        result.divCodeHandle(result.treeData.children)
        result.onListenerUiData() // 监听元数据
      },
      // 获取实体元数据
      divCodeHandle(data) {
        data.forEach(item => {
          const { dataType, nodeType, name, enty, children } = item
          if (name !== 'root' && dataType === 'enty' && enty) {
            if (name === 'LCDQueryString') { // 查询查询实体
              result.entyQueryData = item
            } else {
              result.entyFormData = item // 表单实体
            }
          } else {
            if (children && children.length) {
              result.divCodeHandle(children)
            }
          }
        })
      },
      // 获取账户余额数据
      getBalanceList() {
        const queryScheme = viewModal.get(result.entyQueryData.divCode)
        const accObj = queryScheme.state.queryString?.accNo || ''
        if (!accObj) {
          viewModal.warning('请选择账号')
          return false
        }
        const data = {
          accNo: accObj?.bankAccNo || '',
          accName: accObj?.bankAccName || ''
        }
        viewModal.post({
          url: `/${service.BASE_BE_URL}/epay/balance/query`,
          data: data,
          waitfor: true
        }).then(res => {
          if (res.error === false) {
            viewModal.setEntyValues(result.entyFormData.divCode, res.data)
          }
        })
      },
      // 监听元数据
      onListenerUiData() {
        // 绑定搜索事件
        viewModal.on(result.entyQueryData.divCode, 'onQuery', (item) => {
          result.getBalanceList()
        })
      }
    }
    return result
 }