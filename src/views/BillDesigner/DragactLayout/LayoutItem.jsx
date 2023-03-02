import React from 'react';
import UIParser from '../UIParse'
import {
  DragOutlined, DeleteOutlined
} from '@ant-design/icons';
export const LayoutItem = ({ item, provided, onDelete, onMouseEnter, onMouseLeave, onClick, onContextMenu }) => {

  let styles = {
    ...provided.props.style,
    background: `${provided.isDragging ? '#eaff8f' : 'transparent'}`
  }
  if (item.style) {
    styles = { ...styles, ...item.style }
  }

  /* 先不考虑自适应*/
  /*   if (item.autoHeight && ((item.children && item.children.length) || ['leafItem', 'formItem'].includes(item.nodeType))) {
      styles.height = 'auto'
    } */

  if (!provided.isDragging && item.autoWidth && ((item.children && item.children.length) || ['leafItem', 'formItem'].includes(item.nodeType))) {
    styles.width = 'auto'
  } else {
    styles.width = provided.props.style.width
  }

  if ('viewH' in provided.props && provided.props.viewH !== null
    && 'viewGridH' in provided.props && provided.props.viewGridH !== null) {
    item.h = provided.props.viewH
    item.GridH = provided.props.viewGridH
  }
  delete provided.props.viewH
  delete provided.props.viewGridH

  const { parentKey, position } = item
  const { margintop = 0, marginleft = 0, marginright = 0, marginbottom = 0 } = item.props || {}
  let offW = marginleft + marginright + 4
  let offH = margintop + marginbottom + 2
  let offw = offW / (item.GridW / 24)
  if (position && position !== 'default') {
    styles.position = parentKey === 'root' ? 'fixed' : 'absolute'
    styles.zIndex = 6;
  }

  if (position === 'bottom') {
    styles.bottom = `0px`;
    styles.transform = 'none'
  }

  const className = `layout-item ${item.locked ? 'locked' : ''} wx-${item.key}`
  let showHeader = false
  let showFooter = false
  let showTableTool = false
  let headerClassName
  let footerClassName
  let headerStyle = {}
  let footerStyle = {}
  let tableToolStyle = {}
  let tableToolClassName
  let headerItem
  let footerItem
  let tableToolItem
  let contentItem = item
  let toolbarTop = 0
  if (item.name === 'LCDTable') {
    //暂时一个表头，要是有多个表头再加
    const headerRowCount = 1
    toolbarTop = 31 * headerRowCount + (item.props && item.props.show_label ? 35 : 0)
  }

  let style = {}
  // 表格工具条使用
  if (['form', 'card', 'table', 'toolbar', 'root'].includes(item.nodeType) && !['top', 'bottom'].includes(item.position) && item.children && item.parentName !== 'LCDTabs') {
    contentItem = JSON.parse(JSON.stringify(item))
    //const iheader = contentItem.children.findIndex(it => ['LCDCardHeader'].includes(it.name))
    const iheader = contentItem.children.findIndex(it => it.position === 'top')
    if (iheader >= 0) {
      headerItem = contentItem.children[iheader]
      headerItem.GridW = contentItem.GridW - offW
      headerItem.w = headerItem.w - offw
      headerClassName = `layout-item layout-item-header ${headerItem.locked ? 'locked' : ``} wx-${headerItem.key}`
      /*       headerStyle.marginTop = `${margintop + (margintop ? 2 : 0)}px`;
            headerStyle.marginLeft = `${marginleft + (marginleft ? 2 : 0)}px`;
            headerStyle.marginRight = `${marginright + (marginright ? 2 : 0)}px`;
            headerStyle.marginBottom = `${marginbottom + (marginbottom ? 4 : 0)}px`; */
      headerStyle.top = `${margintop + (margintop ? 2 : 0)}px`;
      headerStyle.marginLeft = `${marginleft + (marginleft ? 2 : 0)}px`;
      headerStyle.marginRight = `${marginright + (marginright ? 2 : 0)}px`;
      headerStyle.bottom = `${marginbottom + (marginbottom ? 4 : 0)}px`;
      showHeader = true
    }
    ///////////////
    // const itableTool = contentItem.children.findIndex(it => ['LCDToolbar'].includes(it.name))
    //表格在填报态工具条不处理
    if (!contentItem.locked) {
      const itableTool = contentItem.children.findIndex(it => it.position === 'table')
      if (itableTool >= 0) {
        tableToolItem = contentItem.children[itableTool]
        tableToolItem.GridW = contentItem.GridW - offW
        tableToolItem.w = tableToolItem.w - offw
        tableToolClassName = `layout-item table-toolbar ${tableToolItem.locked ? 'locked' : ``} wx-${tableToolItem.key}`
        const headerRowCount = contentItem.hasOwnProperty('headerRowCount') ? contentItem.headerRowCount : 1
        const toolbarTop = 31 * headerRowCount + (item.props && item.props.show_label ? 35 : 0)
        style.top = `${toolbarTop + margintop}px`
        tableToolStyle.marginLeft = `${marginleft + (marginleft ? 2 : 0)}px`;
        tableToolStyle.marginRight = `${marginright + (marginright ? 2 : 0)}px`;
        showTableTool = true
      }
    }
    //////////////
    const ifooter = contentItem.children.findIndex(it => it.position === 'bottom')
    if (ifooter >= 0) {
      footerItem = contentItem.children[ifooter]
      footerItem.GridW = contentItem.GridW - offW
      footerItem.w = footerItem.w - offw
      footerClassName = `layout-item layout-item-footer ${footerItem.locked ? 'locked' : ``} wx-${footerItem.key}`
      footerStyle.bottom = `${marginbottom}px`;
      footerStyle.marginLeft = `${marginleft + (marginleft ? 2 : 0)}px`;
      footerStyle.marginRight = `${marginright + (marginright ? 2 : 0)}px`;
      showFooter = true
    }
    /////////

    //const contentChildren = contentItem.children.filter(it => !['LCDCardHeader', 'LCDCardFooter', 'LCDToolbar'].includes(it.name))
    let contentChildren = []
    // 表格行操作是表格单独处理
    if (!contentItem.locked) {
      contentChildren = contentItem.children.filter(it => !['bottom', 'top'].includes(it.position))
    } else {
      //contentChildren = contentItem.children.filter(it => !['LCDToolbar'].includes(it.name))
      contentChildren = contentItem.children.filter(it => !['bottom', 'top'].includes(it.position))
    }

    contentItem.children = contentChildren
  }
  // 移动手柄
  let moveHandleStyle = { top: `${toolbarTop ? (toolbarTop + 36) : 0}px` }

  let moveHandle = !['LCDTable', 'LCDTabs', 'YDFTextArea', 'LCDBtnToolbar', 'LCDDragWidthLayout', 'LCDTableNext'].includes(item.name) && item.showMove !== false && item.showDrag !== false ? <div  {...provided.dragHandle} className="layout-item-handle-drag" style={moveHandleStyle} /> : ''
  // 拖拽时只显示框架，提高性能
  if (provided.isDragging) {
    return <div
      id={`wx-${item.key}`}
      className={className}
      {...provided.props}
      style={styles}
    >
      <div className="layout-item-content">

      </div>

    </div>
  }
  // console.log(style, item, 'layoutitems')
  let shadow = contentItem.props?.shadow
  let shadowclass = ''
  let _position = contentItem.position
  if (shadow === 1 && _position) {
    shadowclass = `lcd-box-shadow-${_position}`
  }
  let setfixed = contentItem.props?.setfixed
  let setfixedclass = ''
  if (setfixed === 1) {
    setfixedclass = `layout-item-setfixed`
  }

  return (
    item.locked ?
      <div
        id={`wx-${item.key}`}
        className={`${className} ${setfixedclass}`}
        {...provided.props}
        style={styles}
      >
        <div className={`layout-item-content ${shadowclass}`}>
          {showHeader ? <div className={headerClassName} style={headerStyle}><UIParser uidata={headerItem} /></div> : ''}
          <UIParser uidata={contentItem} />
          {showFooter ? <div className={footerClassName} style={footerStyle}><UIParser uidata={footerItem} /></div> : ''}
        </div>

      </div>
      :
      <div
        id={`wx-${item.key}`}
        className={className}
        {...provided.props}
        style={styles}
        onMouseEnter={e => { e.stopPropagation(); onMouseEnter(e, item); }}
        onMouseLeave={e => { e.stopPropagation(); onMouseLeave(e, item); }}
        onClick={e => { e.stopPropagation(); onClick(e, item); }}
        onContextMenu={e => { e.stopPropagation(); e.preventDefault(); onContextMenu(e, item); }}
      >


        {showHeader ? <div className={headerClassName} style={headerStyle}
          onMouseEnter={e => { e.stopPropagation(); onMouseEnter(e, headerItem); }}
          onMouseLeave={e => { e.stopPropagation(); onMouseLeave(e, headerItem); }}
          onClick={e => { e.stopPropagation(); onClick(e, headerItem); }}
          onContextMenu={e => { e.stopPropagation(); e.preventDefault(); onContextMenu(e, headerItem); }}
        ><div className="layout-item-content">
            <UIParser uidata={headerItem} />
          </div>
          {/* <div  {...provided.dragHandle} className="layout-item-handle-drag" /> */}
          <div className="layout-item-handle">
            <DeleteOutlined twoToneColor="#eb2f96" className="layout-item-handle-del" onClick={(e) => { e.stopPropagation(); onDelete(headerItem); }} />
          </div>
        </div> : ''}

        {showTableTool ? <div className={tableToolClassName} style={style}
          onMouseEnter={e => { e.stopPropagation(); onMouseEnter(e, tableToolItem); }}
          onMouseLeave={e => { e.stopPropagation(); onMouseLeave(e, tableToolItem); }}
          onClick={e => { e.stopPropagation(); onClick(e, tableToolItem); }}
          onContextMenu={e => { e.stopPropagation(); e.preventDefault(); onContextMenu(e, tableToolItem); }}
        ><UIParser uidata={tableToolItem} /></div> : ''}
        <div className={`layout-item-content ${shadowclass}`} >
          <UIParser uidata={contentItem} />
        </div>
        {showFooter ? <div className={footerClassName} style={footerStyle}
          onMouseEnter={e => { e.stopPropagation(); onMouseEnter(e, footerItem); }}
          onMouseLeave={e => { e.stopPropagation(); onMouseLeave(e, footerItem); }}
          onClick={e => { e.stopPropagation(); onClick(e, footerItem); }}
          onContextMenu={e => { e.stopPropagation(); e.preventDefault(); onContextMenu(e, footerItem); }}   >
          <div className="layout-item-content">
            <UIParser uidata={footerItem} />
          </div>
          <div  {...provided.dragHandle} className="layout-item-handle-drag" />
          <div className="layout-item-handle" >
            <DeleteOutlined twoToneColor="#eb2f96" className="layout-item-handle-del" onClick={(e) => { e.stopPropagation(); onDelete(footerItem); }} />
          </div>
        </div> : ''}


        {moveHandle}
        {item.showDel !== false || item.showMove !== false ? <div className="layout-item-handle" >
          {item.showMove !== false && !item.static ? <DragOutlined {...provided.dragHandle} onClick={e => e.stopPropagation()} className="layout-item-handle-dragicon" /> : ''}
          {item.showDel !== false ? <DeleteOutlined twoToneColor="#eb2f96" className="layout-item-handle-del" onClick={(e) => { e.stopPropagation(); onDelete(item); }} /> : ''}
        </div>
          : ''}
        {!item.locked && item.showResize !== false ? <span {...provided.resizeHandle} className="layout-item-handle-resize w-resize" /> : ''}
        {!item.locked && item.showResize !== false ? <span {...provided.resizeHandle} className="layout-item-handle-resize s-resize" /> : ''}
        {!item.locked && item.showResize !== false ? <span {...provided.resizeHandle} className="layout-item-handle-resize se-resize" /> : ''}
      </div>
  )
}