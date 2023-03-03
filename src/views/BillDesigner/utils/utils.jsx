// 从UI元数据取字段信息
import { cloneDeep } from 'lodash'
import { guid } from '../../../utils/utils'
//取默认值
export const getEmptyRow = async (uidata) => {
  let emptyRow = {}
  emptyRow.id = guid()
  let trans = async (nodes) => {

    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i]
      let { fieldname, dataField, name, props, defaultValue, enty } = node
      if (['LCDBtnToolbar', 'LCDToolbar'].includes(name)) {
        continue
      }
      fieldname = fieldname || dataField

      if (fieldname) {
        emptyRow[fieldname] = ['YDFInputNumber'].includes(name) ? 0 : ''
      }
      //默认值填入空行,填报时才使用默认值
      if (defaultValue !== undefined && enty) {

        if (typeof (defaultValue) === 'object') {
          //一般是参照
          const { replaceItems = [] } = enty
          replaceItems.forEach(item => {
            const { from, to } = item
            if (Object.keys(from).length && Object.keys(to).length) {
              const replaceVal = defaultValue[from.fieldname] || ''
              emptyRow[to.fieldname] = replaceVal
            }
          })
          //显示名称
          emptyRow[`${fieldname}_displayValue`] = defaultValue.displayValue
        } else {
          emptyRow[fieldname] = defaultValue
        }

      } else if (defaultValue !== undefined && !enty) {
        emptyRow[fieldname] = defaultValue
      }

      if (node.children && node.children.length) {
        await trans(node.children)
      }
    }

  }

  await trans(uidata.children)
  return emptyRow
}
//从UI元数据中取列信息
export const getColumnsFromUIData = async (uidata, onHeadCellClick, locked = 0) => {
  let columns = []
  let cardItems = []
  let emptyRow = {}
  emptyRow.id = guid()
  if (!uidata.children) {
    return { columns, cardItems }
  }
  const editRenderNames = {
    YDFInput: 'Input',
    YDFSelect: 'Select',
    YDFTreeSelect: 'TreeSelect',
    YDFTableModalSelect: 'TableModalSelect',
    YDFTreeModalSelect: 'TreeModalSelect',
    YDFInputNumber: 'InputNumber',
    YDFCheckbox: 'Checkbox',
    YDFSwitch: 'Switch',
    YDFRadio: 'Radio',
    YDFDatePicker: 'DateTime',
  }

  let trans = async (nodes, hasParent) => {
    for (let i = 0, len = nodes.length; i < len; i++) {

      const node = nodes[i]

      let { fieldname, dataField, name, props, defaultValue, enty } = node

      if (['LCDBtnToolbar', 'LCDToolbar'].includes(name)) {
        continue
      }
      fieldname = fieldname || dataField
      // 转为表格属性
      // 2023/2 为什么一样转成了''？ 先修改为不做操作
      // node.title = node.label===node.name?'':node.label
      node.label = node.name ? null : node.title = node.label
      node.uikey = node.key
      node.locked = locked
      if (fieldname) {
        emptyRow[fieldname] = ['YDFInputNumber'].includes(name) ? 0 : ''
      }
      //默认值填入空行,填报时才使用默认值
      if (defaultValue !== undefined && locked && enty) {

        if (typeof (defaultValue) === 'object') {
          //一般是参照
          const { replaceItems = [] } = enty
          replaceItems.forEach(item => {
            const { from, to } = item
            if (Object.keys(from).length && Object.keys(to).length) {
              const replaceVal = defaultValue[from.fieldname] || ''
              emptyRow[to.fieldname] = replaceVal
            }
          })
          //显示名称
          emptyRow[`${fieldname}_displayValue`] = defaultValue.displayValue
        } else {
          emptyRow[fieldname] = defaultValue
        }

      }

      const t_f = node.dataField.split('.')
      node.dataIndex = t_f[t_f.length - 1]
      //key留下用于拖拽
      //delete node.key
      if (node.children && node.children.length) {
        await trans(node.children, true)
      }
      if (node.name === 'YDFInputNumber') {
        node.contentAlign = 'right'
      }
      if (editRenderNames[node.name]) {
        let props = node.props || {}
        props.required = node.nullable
        node.editRender = {
          name: editRenderNames[node.name],
          props
        }
      }
      // 模板设计期增加表头点击事件
      //if (!node.locked) {
      if (!(node.parentName && node.parentName == "LCDTable" && locked && node.hide === 1)) {
        node.className = `wx-${node.uikey} lcd-table-col ${node.hide === 1 ? 'hide' : ''}`

      }
      //}
      if (onHeadCellClick) {
        node.onHeadCellClick = (w, event) => {
          onHeadCellClick(node, event)
        }
      }
      if (!hasParent) {
        /*if (!locked || (locked && node.hide !== 1)) {
          columns.push({ ...node })
        }*/
        if (node.parentName && node.parentName == "LCDTable") {
          if (!locked || (locked && node.hide !== 1)) {
            columns.push({ ...node })
          } else if (locked && node.hide === 1) {
            columns.push({ ...node, ifshow: false, isShow: false })
          }
        } else if (!locked || (locked && node.hide !== 1)) {
          columns.push({ ...node })
        }
      }
    }
  }
  const childNodes = cloneDeep(uidata.children)
  await trans(childNodes, false)

  return { columns, cardItems, emptyData: [emptyRow], emptyRow }
}
//取面板组高度
export const getNodesTotalH = (nodes) => {

  if (!nodes) return
  if (nodes.length > 0) {
    nodes.sort((a, b) => a.GridY > b.GridY)
  }
  let _top = 0
  let _btm = 0
  let totalH = 0
  nodes.forEach(d => {
    let { GridY, h, cacheH } = d
    //console.log({GridY,_top,_btm,totalH,d})
    if (cacheH) {
      h = cacheH
    }
    if (d.hide !== 1 && h !== -1) {
      if (totalH === 0) {
        totalH = h
        _top = GridY
        _btm = GridY + h
      } else if (_btm <= GridY) {
        totalH = totalH + h
        _top = GridY
        _btm = GridY + h
      } else if (_top <= GridY && _btm < GridY + h) {
        totalH = totalH - (GridY - _btm)
        _top = _btm
        _btm = GridY + h
      }
    }
  })

  return totalH
}
// 自适应高度
//取固定高度
export const getFixedH = (nodes, GridX, w) => {
  const outFixedNodes = nodes.filter(node => {
    //起点在中间
    const case1 = node.GridX >= GridX && node.GridX < GridX + w
    //终点在中间
    const case2 = node.GridX + node.w > GridX && node.GridX + node.w <= GridX + w
    //超出
    const case3 = node.GridX <= GridX && node.GridX + node.w >= GridX + w

    const wgtCase = node.hide !== 1 && node.h !== -1 && (node.fixedHeight === 1 || ['LCDPage', 'YDFStepsNext', 'LCDQueryString', 'LCDBtnToolbar', 'LCDToolbar'].includes(node.name) || ['leafItem', 'formItem', 'column'].includes(node.nodeType))
    //console.log(case1,case2,case3,wgtCase,'判断固定')
    return (case1 || case2 || case3) && wgtCase
  })

  return getNodesTotalH(outFixedNodes)
}
//取区域总高度
export const getWedgitBoxH = (nodes, GridX, w) => {

  const outNodes = nodes.filter(node => {
    //起点在中间
    const case1 = node.GridX >= GridX && node.GridX < GridX + w
    //终点在中间
    const case2 = node.GridX + node.w > GridX && node.GridX + node.w <= GridX + w
    //超出
    const case3 = node.GridX <= GridX && node.GridX + node.w >= GridX + w
    const wgtCase = node.hide !== 1 && node.h !== -1
    return (case1 || case2 || case3) && wgtCase
  })

  return getNodesTotalH(outNodes)
}
//按比例缩放高度
export const autoBodyHeight = (data, recaculate = false, ht) => {
  if (['LCDPage', 'YDFStepsNext', 'LCDQueryString', 'LCDBtnToolbar', 'LCDToolbar'].includes(data.name) || ['leafItem', 'formItem', 'column'].includes(data.nodeType)) {
    return false
  }

  let fullScreen = 1
  if (ht) {
    fullScreen = ht.getNodeByKey('root')['fullScreen']
  }
  if (!fullScreen) {
    return false
  }
  let { name, h: docH, rowHeight = 20 } = data
  if (['LCDTable'].includes(name)) {
    return
  }

  if (name === 'root') {
    const height = document.body.clientHeight - 1
    docH = height / rowHeight
  }

  const setNodeHeight = (dt, newH) => {
    const unFixedNodes = dt.filter(node => node.hide !== 1 && node.h !== -1 && node.fixedHeight !== 1 && !['LCDPage', 'YDFStepsNext', 'LCDQueryString', 'LCDBtnToolbar', 'LCDToolbar'].includes(node.name) && !['leafItem', 'formItem', 'column'].includes(node.nodeType))
    if (!unFixedNodes.length) {
      return
    }

    unFixedNodes.forEach(d => {
      let { outFixedH = 0, percentH = 1, GridX, w, h } = d
      if (!percentH) {
        const boxH = getWedgitBoxH(unFixedNodes, GridX, w) || 1
        if (boxH) {
          percentH = h / boxH
        }
        d.percentH = percentH
      }
      //强制刷新
      if (recaculate || !outFixedH) {
        outFixedH = getFixedH(dt, GridX, w)
      }
      let zoomH = newH - outFixedH
      if (!d.cacheH) {
        d.cacheH = d.h
      }
      d.h = zoomH * percentH
      //强制渲染时要加入递归
      if (recaculate && d.children && d.children.length) {
        setNodeHeight(d.children, d.h)
      }
    })

    //要从上现下调整一次上部
    dt.forEach(node => {
      let { GridY, GridX, w } = node
      //当前节点上面的
      let gridTopNodes = dt.filter(d => d.GridY < GridY)
      if (gridTopNodes.length === 0) {
        node.GridY = 0
      } else {
        node.GridY = getWedgitBoxH(gridTopNodes, GridX, w)
      }
    })

  }

  if (data.children && data.children.length) {

    const { props = {} } = data
    const { show_label = 0, margintop = 0, marginbottom = 0, paddingtop = 0, paddingbottom = 0 } = props
    let offsetH = (margintop + marginbottom + paddingtop + paddingbottom) / 20

    if (['LCDCard', 'LCDTable'].includes(data.name)) {
      offsetH = offsetH + (show_label !== 0 ? 24 : 0) / 20
    } else if (['LCDTabs'].includes(data.name)) {
      offsetH = offsetH + 31 / 20
    }


    setNodeHeight(data.children, docH - offsetH)
  }

}

// 锁定编辑功能
export const lockedLayOut = async (data, isLock = 0) => {
  const width = document.body.clientWidth - 16
  const rate = width / data.GridW;
  const locked = (dt) => {
    dt.map(d => {
      d.locked = isLock
      if (d.children && d.children.length) {
        locked(d.children)
      }
    })
  }
  await locked([data])
}