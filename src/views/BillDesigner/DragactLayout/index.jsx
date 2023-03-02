import React from 'react';
import './index.less';
// import { Dragact } from 'dragact'
import { Dragact } from './lib/dragact'
// import { LayoutItem } from './LayoutItem.jsx'
import LayoutItemMemo from './LayoutItemMemo'
import u from '../../../utils/umbrella'
// import ht from '../utils/HelperTools'
// import { showContextMenu } from '../utils/ContextMenu.jsx'
const ht = {}
class DragactLayout extends React.PureComponent {
  constructor(props) {
    super(props)
  }
  dragactNode = null;
  refCont = React.createRef()

  handleOnDragStart () {
    ht.hideWidgetPopupToolbar()
  }
  handleOnDrag (node) {

  }
  async handleOnDragEnd (node, newLayout, resized) {
    const { GridX, GridY, w, h, wPx, hPx, UniqueKey: key } = node
    const curNode = ht.getNodeByKey(key)
    const containerKey = newLayout[0].parentKey
    let parentNode = ht.getNodeByKey(containerKey)
    // const newLayout = this.dragactNode.getLayout();
    await ht.updateTreeNodeByDragactLayout(parentNode, newLayout, resized)
    setTimeout(() => {
      ht.updateNode({ GridX, GridY, w, h, GridW: wPx, GridH: hPx, key })
      // ht.updateNode(parentNode)
      // ht.updateGridWidthByRate(containerKey)
    }, 5)
  }

  hanldeOnDelete (item) {
    ht.deleteNode(item)
  }
  handleOnClick (e, item) {

    if (!item.locked) {
      ht.selectDom(item.key);
      ht.showWidgetToolbar(item.key)
    }
  }

  handleOnMouseEnter (e, item) {
    u('.layout-item.actived').removeClass('actived')
    //u('.layout-item.selected').removeClass('selected')
    const uDom = u(e.target).closest('.layout-item');

    if (uDom.length > 0) {
      uDom.addClass('actived')
    }
    // 动态调整物块调整位置工具
    // ht.setHandlePosition(item)
  }
  //鼠标右键
  handleOnContextMeun (event, item) {
    // showContextMenu(item, event)
  }
  handleOnMouseLeave (e, item) {
    const uDom = u(e.target).closest('.layout-item')
    if (uDom.length > 0) {
      uDom.removeClass('actived')
    }
  }
  //横向排序
  getSortLayout ({ cols, layout, flowX }) {
    let sortLayouts = [], topLayouts = [], bottomLayouts = [], maxY = 0
    layout.forEach(lay => {
      const { position = '', h, GridY } = lay
      if (position !== 'bottom' && maxY < GridY + h) {
        maxY = GridY + h
      }

      if (position === 'top') {
        lay.GridY = 0
        topLayouts.push(lay)
      } else if (position === 'bottom') {
        bottomLayouts.push(lay)
      } else {
        sortLayouts.push(lay)
      }
    })

    bottomLayouts.map(item => {
      item.GridY = maxY - item.h + 1.5
    })
    //如果
    sortLayouts = [...topLayouts, ...sortLayouts, ...bottomLayouts]

    if (!flowX) {
      return sortLayouts
    }

    const { width, rowHeight } = this.props
    const colWidth = Math.ceil(width / 24)
    let x = 0
    let y = 0
    let xPx = 0
    if (flowX === 'right') {
      const len = sortLayouts.length
      for (let idx = len - 1; idx >= 0; idx--) {
        let item = sortLayouts[idx]
        const { GridX, w, h, label } = item
        if (x < w) {
          x = 24
          y = idx === len - 1 ? 0 : (y + h)
        }
        x = x - w
        item.GridX = x
        item.GridY = y
      }
    } else if (flowX === 'left' || flowX === true || flowX === 1) {
      sortLayouts.map((item, idx) => {
        const { GridX, w, h, wPx, hPx } = item
        if (x + w > 24) {
          xPx = 0
          x = 0
          y = y + h
        }
        item.GridX = x
        item.GridY = y
        x = x + w
      })
    }


    return sortLayouts
  }

  getDragDom = (dragLayouts) => {
    const { margin, width, rowHeight, extraStyle, autoHeight, placeholder, locked, cols, layout, flowX, allowX = true, allowY = true, utools } = this.props
    //dragLayouts = this.getSortLayout({ cols, layout: dragLayouts, flowX })
    const dragactInit = {
      width,
      col: 24,
      rowHeight: Math.ceil(rowHeight),
      margin: locked ? [0, 0] : margin,
      className: 'dragact-layout',
      layout: dragLayouts,
      placeholder,
      autoHeight,
      allowX,
      allowY,
      utools
    }
    const { parentKey } = this.dragactNode || {}
    const dragact =
      locked ? <Dragact
        {...dragactInit}
        ref={this.refCont}
      >
        {(item, provided) => {
          // 添加额外的样式
          if (extraStyle && Object.keys(extraStyle).length) {
            item.extraStyle = extraStyle
          }
          return <LayoutItemMemo
            key={item.key}
            item={item}
            provided={provided}
          />
        }}
      </Dragact> :
        <Dragact
          {...dragactInit}
          placeholder={true}
          ref={node => node ? this.dragactNode = node : null}
          onDrag={this.handleOnDrag.bind(this)}
          onDragStart={this.handleOnDragStart.bind(this)}
          onDragEnd={this.handleOnDragEnd.bind(this)}
        >
          {(item, provided) => {
            // 添加额外的样式
            if (extraStyle && Object.keys(extraStyle).length) {
              item.extraStyle = extraStyle
            }

            return <LayoutItemMemo
              key={item.key}
              parentKey={parentKey}
              onMouseEnter={this.handleOnMouseEnter.bind(this)}
              onMouseLeave={this.handleOnMouseLeave.bind(this)}
              onContextMenu={this.handleOnContextMeun.bind(this)}
              item={item}
              onDelete={(node) => this.hanldeOnDelete(node)}
              onClick={this.handleOnClick.bind(this)}
              provided={provided}
            />
          }}
        </Dragact>
    return dragact
  }
  getToolbarHolderStyle = (toolbars) => {
    let paddingTop = 0, paddingBottom = 0, paddingLeft = 0, paddingRight = 0
    toolbars.forEach(item => {
      const { position = '', GridH = 0, GridW = 0 } = item

      if (position === 'top') {
        paddingTop = paddingTop + GridH
      }
      if (position === 'bottom') {
        paddingBottom = paddingBottom + GridH
      }
      if (position === 'right') {
        paddingRight = paddingRight + GridW
      }
      if (position === 'left') {
        paddingLeft = paddingLeft + GridW
      }
    });
    let style = {}
    if (paddingTop) {
      style.paddingTop = `${paddingTop + 10}px`
    }
    if (paddingBottom) {
      style.paddingBottom = `${paddingBottom + 10}px`
    }
    if (paddingLeft) {
      style.paddingLeft = `${paddingLeft + 10}px`
    }
    if (paddingRight) {
      style.paddingRight = `${paddingRight + 10}px`
    }
    return style
  }

  componentWillUnmount () {
    this.setState = () => false;
  }
  componentDidMount () {
    // const { utools, containerKey, key } = this.props
    // utools.storeContRef(this.refCont,key||containerKey) 
  }
  render () {
    debugger
    const { margin, width, rowHeight, extraStyle, autoHeight, placeholder, locked, cols, layout, flowX, flexAlign = 'center', isRoot } = this.props
    // const toolbars = layout.filter(lay => !!lay.position)
    ///////////////////////
    const dragact = this.getDragDom(layout)

    //const paddingStyle = this.getToolbarHolderStyle(toolbars)

    /*     let dagStyle = {
          display: 'flex',
          justifyContent: 'center'
        } */
    let dagStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: { left: 'flex-start', center: 'center', right: 'flex-end' }[flexAlign]
    }
    /////////////////////////
    return (
      <div
        id={isRoot ? 'contentRoot' : null}
        className={this.props.className}
        style={dagStyle}
      >
        {layout?.length ? dragact : ''}
      </div>
    )
  }
}
DragactLayout.defaultProps = {
  containerKey: '',//容器key更新树方便
  placeholder: true,
  margin: [1, 1],
  width: 600,   //容器宽
  rowHeight: 20, //行高
  cols: 3,
  defaultHeight: 2,
  extraStyle: null,//子元素额外样式
  flowX: false,//X轴方向自动排序
  allowX: true,
  allowY: true
}
export default DragactLayout