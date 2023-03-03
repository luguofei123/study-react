import ht from './HelperTools'
import axios from "@/api/api.request";
import { guid } from '_u/utils'
import { Message } from '@tinper/next-ui'
import { message, Modal } from "antd"
// 需要对方法重新包装
export const ViewModal = {
  //ajax,get请求
  request: async ({ url, method, waitfor = true }) => {
    return await axios.request({
      url,
      method,
      waitfor: waitfor
    });
  },
  //post请求
  post: async ({ url, data = {}, responseType, waitfor = true }) => {
    return await axios.request({
      url,
      method: "post",
      data,
      responseType,
      waitfor: waitfor
    });
  },
  //取guid
  guid: () => guid(),
  // 取环境变量
  getContext() {
    const globals = ht.getGlobalProps()
    return globals
  },
  // 编辑状态
  editMod() {
    return ht.editMod
  },
  // 绑定事件
  on: (key, action, func) => {
    const divCodeToKey = ht.getItem('divCodeToKey')
    const nodeKey = divCodeToKey[key]
    if (nodeKey) {
      // 如果传入的是divCode，需要把事件绑定在key上
      ht.setExtraEvent(`${nodeKey}_${action}`, func)
    } else {
      ht.setExtraEvent(`${key}_${action}`, func)
    }
  },
  //取消绑定
  off: (key, action) => {
    const divCodeToKey = ht.getItem('divCodeToKey')
    const nodeKey = divCodeToKey[key]
    if (nodeKey) {
      ht.removeExtraEvent(`${nodeKey}_${action}`)
    } else {
      ht.removeExtraEvent(`${key}_${action}`)
    }
  },
  ////////////////////////////////////////////
  //根据key取组件对象,建议用code
  get(key) {
    const node = ht.getWidgetByCode(key)
    if (node) {
      return node
    }
    return ht.getWidgetByKey(key)
  },
  //表格加载数据
  loadTableData(tableKey, tableData = [], total) {
    const widget = ht.getWidgetByKey(tableKey)
    if (!widget) {
      console.log('未找到相应组件', tableKey)
      return false
    }
    ht.updateEntyValues(tableKey, tableData,true)
  
    if (widget.loadData) {
      widget.loadData(tableData, total)
    }
  },
  // 单据检查
  validateCheck() {
    return ht.validateCheck()
  },
  postMessage(message, targetOrigin) {
    return ht.postMessage(message, targetOrigin)
  },
  doWorkFlow({ fn, data, _cb }) {
    return ht.doWorkFlow({ fn, data, _cb })
  },
  doBatchWorkFlow({ fn, data, _cb }) {
    return ht.doBatchWorkFlow({ fn, data, _cb })
  },
  /////////////
  showNode(key, show) {
    ht.showNode(key, show)
  },
  //设置必录，也可通过LCDPanel的setRequired设置
  setRequired(key, required) {
    ht.updateNodeProp({ key, prop: 'nullable', value: required ? 1 : 0 })
  },
  //设置值，当为表单时values为对象{}，当为表时values对象为数组[]
  async setEntyValues(key, values) {
    const node = ht.getNodeByKey(key)
    if (node) {
      await ht.updateEntyValues(key, values, node.nodeType === 'table')
      //赋值
      ht.setEntyWidgetValues(key, values)
    } else {
      console.log('更新值错误：未找到表单', key, values)
    }
  },
  //刷新组件
  reloadWidgetData(key) {
    ht.reloadWidgetData(key)
  },
  //取值
  getEntyValues(key) {
    return ht.getEntyValues()[key]['data']
  },
  //取ID
  getBillId() {
    return ht.getEntyValues()['billId']
  },
  Message: Message,
  // antd的消息提示框，文本和图标未对齐，所以改用tinper的消息提示框，先改主页面
  message: Message,
  Modal: Modal,
  // 后期禁用ht
  ht: ht,
}
