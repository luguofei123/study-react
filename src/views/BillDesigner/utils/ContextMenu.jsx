import PopupMenu from '_c/PopupMenu'
import ht from './HelperTools'
import { getUsedWidgets } from '../components'
// 右键操作

const getContextMenu = (node) => {
  const { nodeType, name } = node

  let contextMenus = [

    {
      "divider": true
    },
    {
      "label": "属性",
      "value": "props"
    }
  ]
  // 动态添加菜单，注意顺序
  if (nodeType !== 'root') {

    contextMenus.unshift({
      "label": "宽度",
      "value": "width",
      children: [
        { label: '100%', value: 24, action: 'setWidth' },
        { label: '1/2', value: 12, action: 'setWidth' },
        { label: '1/3', value: 8, action: 'setWidth' },
        { label: '1/4', value: 6, action: 'setWidth' }
      ]
    })
    contextMenus.unshift({
      "divider": true
    })
    if (node.showDel !== false) {
      contextMenus.unshift({
        "label": "删除",
        "value": "delete"
      })
    }
  }
  //筛选可用组件

  const widgets = getUsedWidgets(nodeType, name)

  if (widgets && widgets.length) {
    contextMenus.unshift({
      "label": "插入",
      "value": "insert",
      children: widgets
    })
  }

  return contextMenus
}
const handleMenuClick = (menu, node, position, event) => {
  const { value, action } = menu
  // 删除节点
  if (value === 'delete') {
    ht.deleteNode(node)
  } else if (value === 'props') {//查看属性
  } else if (action === 'setWidth') {//设置宽
    node.w = value
    if (value === 24) {
      node.GridX = 0
    }
    ht.updateNode(node)
    const timeId = setTimeout(() => {
      ht.updateGridSize(node.key)
      clearTimeout(timeId)
    }, 300)
  } else {//添加节点
    // console.log(menu, node, '插入新节点')
    ht.insertAtNode(menu, node, ['LCDToolbar', 'LCDToolbar', 'LCDPanel', 'LCDDragWidthLayout'].includes(menu.name) || menu.nodeType !== node.nodeType, position)
  }
}
export const showContextMenu = (node, event) => {
  return false
  let tdNode = null
  if (node.nodeType === 'table') {
    const className = event.target.className
    let istart = className.indexOf('wx-')
    const iend = className.indexOf(' lcd-table-col')
    if (istart >= 0) {
      istart = istart + 3
      const key = className.substr(istart, iend - istart)
      if (key) {
        tdNode = ht.selectDom(key, 'table')
      }
    }
  }
  event.preventDefault()

  let x = event.pageX
  let y = event.pageY
  let cHeight = window.innerHeight - 120

  y = y > cHeight ? y - 120 : y;
  const position = { x, y }
  const data = getContextMenu(node)
  PopupMenu.open({
    x,
    y,
    data,
    zIndex: 99,
    onMenuClick: (menu) => {
      handleMenuClick(menu, menu.value === 'delete' && tdNode ? tdNode : node, position, event)
    }
  })
}