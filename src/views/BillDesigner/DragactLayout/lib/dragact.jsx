import React from 'react'
import GridItem from './GridItem'
import { compactLayout } from './util/compact'
import { getMaxContainerHeight } from './util/sort'
import { layoutCheck } from './util/collison'
import { correctLayout } from './util/correction'
import { stringJoin } from './utils'
import { layoutItemForkey, syncLayout } from './util/initiate'

import './style.css'

export class Dragact extends React.Component {
  constructor(props) {
    super(props)
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)

    const layout = props.layout

    this.state = {
      GridXMoving: 0,
      GridYMoving: 0,
      wMoving: 0,
      hMoving: 0,
      placeholderShow: false,
      placeholderMoving: false,
      layout: layout,
      containerHeight: 500,
      dragType: 'drag',
      mapLayout: undefined,
      xPx: 0,
      yPx: 0
    }
  }

  onResizeStart = (layoutItem) => {

    const { GridX, GridY, w, h, position, placeholder } = layoutItem
    if (this.state.mapLayout) {
      const newlayout = syncLayout(this.state.mapLayout, layoutItem)
      this.setState({
        GridXMoving: GridX,
        GridYMoving: GridY,
        wMoving: w,
        hMoving: h,
        placeholderShow: placeholder === false ? false : !position,
        placeholderMoving: true,
        mapLayout: newlayout,
        dragType: 'resize'
      })
    }
    this.props.onDragStart &&
      this.props.onDragStart(layoutItem, this.state.layout)
  }

  onResizing = (layoutItem) => {
    const newLayout = layoutCheck(
      this.state.layout,
      layoutItem,
      layoutItem.UniqueKey + '',
      layoutItem.UniqueKey + '',
      0
    )

    const { compacted, mapLayout } = compactLayout(
      newLayout,
      layoutItem,
      this.state.mapLayout
    )

    this.setState({
      layout: compacted,
      wMoving: layoutItem.w,
      hMoving: layoutItem.h,
      wPxMoving: layoutItem.wPx,
      hPxMoving: layoutItem.hPx,
      mapLayout: mapLayout,
      containerHeight: getMaxContainerHeight(
        compacted,
        this.props.rowHeight,
        this.props.margin[1],
        this.state.containerHeight,
        false
      )
    })
  }

  onResizeEnd = (layoutItem) => {
    console.log(layoutItem, 'onResizeEnd')
    const { compacted, mapLayout } = compactLayout(
      this.state.layout,
      undefined,
      this.state.mapLayout
    )
    this.setState({
      placeholderShow: false,
      layout: compacted,
      mapLayout: mapLayout,
      containerHeight: getMaxContainerHeight(
        compacted,
        this.props.rowHeight,
        this.props.margin[1],
        this.state.containerHeight
      )
    })
    this.props.onDragEnd && this.props.onDragEnd(layoutItem, compacted, true)
  }

  onDragStart(bundles) {
    const { GridX, GridY, w, h, position, placeholder } = bundles

    if (this.state.mapLayout) {
      this.setState({
        GridXMoving: GridX,
        GridYMoving: GridY,
        wMoving: w,
        hMoving: h,
        placeholderShow: placeholder === false ? false : !position,
        placeholderMoving: true,
        mapLayout: syncLayout(this.state.mapLayout, bundles),
        dragType: 'drag'
      })
    }
    this.props.onDragStart &&
      this.props.onDragStart(bundles, this.state.layout)
  }

  onDrag(layoutItem) {

    const { GridY, GridX, UniqueKey, x, y } = layoutItem

    const moving = GridY - this.state.GridYMoving

    const newLayout = layoutCheck(
      this.state.layout,
      layoutItem,
      UniqueKey + '',
      UniqueKey + '',
      moving
    )
    const { compacted, mapLayout } = compactLayout(
      newLayout,
      layoutItem,
      this.state.mapLayout
    )
    this.setState({
      GridXMoving: layoutItem.GridX,
      GridYMoving: layoutItem.GridY,
      xPx: layoutItem.x,
      yPx: layoutItem.y,
      layout: compacted,
      mapLayout: mapLayout,
      containerHeight: getMaxContainerHeight(
        compacted,
        this.props.rowHeight,
        this.props.margin[1],
        this.state.containerHeight
      )
    })

    this.props.onDrag && this.props.onDrag(layoutItem, compacted)
  }

  onDragEnd(layoutItem) {

    const { compacted, mapLayout } = compactLayout(
      this.state.layout,
      undefined,
      this.state.mapLayout
    )
    // console.log(JSON.parse(JSON.stringify(layoutItem)), '移动。。。。。onDragEnd')
    this.setState({
      placeholderShow: false,
      layout: compacted,
      mapLayout: mapLayout,
      xPx: layoutItem.x,
      yPx: layoutItem.y,
      containerHeight: getMaxContainerHeight(
        compacted,
        this.props.rowHeight,
        this.props.margin[1],
        this.state.containerHeight
      )
    })
    this.props.onDragEnd && this.props.onDragEnd(layoutItem, compacted, false)
  }


  renderPlaceholder() {
    if (!this.state.placeholderShow) return null
    var { col, padding, rowHeight, margin, placeholder, width } = this.props
    const {
      GridXMoving,
      GridYMoving,
      wMoving,
      hMoving,
      wPxMoving,
      hPxMoving,
      xPx,
      yPx,
      placeholderMoving,
      dragType
    } = this.state

    if (!placeholder) return null
    if (!padding) padding = 0
    return (
      <GridItem
        margin={margin}
        col={col}
        containerWidth={width}
        containerPadding={[padding, padding]}
        rowHeight={rowHeight}
        GridX={GridXMoving}
        GridY={GridYMoving}
        w={wMoving}
        h={hMoving}
        wPx={wPxMoving}
        hPx={hPxMoving}
        xPx={xPx}
        yPx={yPx}
        pxMove={true}
        style={{
          background: 'rgba(15,15,15,0.3)',
          zIndex: dragType === 'drag' ? 1 : 10,
          transition: ' all .15s ease-out'
        }}
        isUserMove={!placeholderMoving}
        dragType={dragType}
        canDrag={false}
        canResize={false}
      >
        {(p, resizerProps) => <div {...p} />}
      </GridItem>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.layout.length > nextProps.layout.length) {
      //remove
      const mapLayoutCopy = { ...this.state.mapLayout }
      nextProps.layout.forEach((child) => {
        if ((mapLayoutCopy)[child.key + ''] !== void 666)
          delete (mapLayoutCopy)[child.key + '']
      })
      /*2022-08-17不使用缓存
            const copyed = { ...this.state.mapLayout }
            const newLayout = nextProps.layout.map((item) => {
              const { w, h, GridX, GridY, key, ...others } = item
      
              return {
                ...copyed[item.key],
                others
              }
            })
            */
      const newLayout = [...nextProps.layout]
      const { compacted, mapLayout } = compactLayout(
        newLayout,
        undefined,
        this.state.mapLayout
      )
      this.setState({
        containerHeight: getMaxContainerHeight(
          compacted,
          this.props.rowHeight,
          this.props.margin[1],
          this.state.containerHeight
        ),
        layout: compacted,
        mapLayout
      })
    } else if (this.props.layout.length < nextProps.layout.length) {
      /*2022-08-17不使用缓存
      //add
      const copyed = { ...this.state.mapLayout }
      var newLayout = nextProps.layout.map((v) => {
        if (copyed[v.key]) {
          return {
            ...v,
            GridX: copyed[v.key].GridX,
            GridY: copyed[v.key].GridY,
            w: copyed[v.key].w,
            h: copyed[v.key].h,
            key: copyed[v.key].key
          }
        }

        return {
          ...v,
          isUserMove: false,
          key: v.key + ''
        }
      })
      */
      const newLayout = [...nextProps.layout]
      const { compacted, mapLayout } = compactLayout(
        newLayout,
        undefined,
        this.state.mapLayout
      )
      this.setState({
        containerHeight: getMaxContainerHeight(
          compacted,
          this.props.rowHeight,
          this.props.margin[1],
          this.state.containerHeight,
          false
        ),
        layout: compacted,
        mapLayout
      })
    } else {
      this.recalculateLayout(nextProps.layout, nextProps.col)
    }
  }

  recalculateLayout = (layout, col) => {
    const corrected = correctLayout(layout, col)
    const { compacted, mapLayout } = compactLayout(
      corrected,
      undefined,
      undefined
    )
    this.setState({
      layout: compacted,
      mapLayout: mapLayout,
      containerHeight: getMaxContainerHeight(
        compacted,
        this.props.rowHeight,
        this.props.margin[1],
        this.state.containerHeight,
        false
      )
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.recalculateLayout(this.state.layout, this.props.col)
    }, 1)
  }

  getGridItem(child, index) {
    const { dragType, mapLayout } = this.state
    var { col, padding, rowHeight, margin, width } = this.props
    if (mapLayout) {
      const renderItem = layoutItemForkey(mapLayout, child.key + '')
      if (!padding) padding = 0
      return (
        <GridItem
          {...renderItem}
          margin={margin}
          col={col}
          containerWidth={width}
          containerPadding={[padding, padding]}
          rowHeight={rowHeight}
          onDrag={this.onDrag}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
          onDidMount={this.onDidMount}
          isUserMove={
            renderItem.isUserMove !== void 666
              ? renderItem.isUserMove
              : false
          }
          UniqueKey={child.key}
          onResizing={this.onResizing}
          onResizeStart={this.onResizeStart}
          onResizeEnd={this.onResizeEnd}
          dragType={dragType}
          key={child.key}
        >
          {(GridItemProvided, dragHandle, resizeHandle) =>
            this.props.children(child, {
              isDragging:
                renderItem.isUserMove !== void 666
                  ? renderItem.isUserMove
                  : false,
              props: GridItemProvided,
              dragHandle,
              resizeHandle
            })
          }
        </GridItem>
      )
    }
  }

  render() {
    const { className, style, width, autoHeight } = this.props

    const { containerHeight, layout } = this.state
    return (
      <div
        className={stringJoin('DraggerLayout', className + '')}
        style={{
          ...style,
          left: 100,
          width: width,
          height: containerHeight,
          zIndex: 1
        }}
      >
        {layout.map((item, index) => {
          return this.getGridItem(item, index)
        })}
        {this.renderPlaceholder()}
      </div>
    )
  }

  //api
  getLayout() {
    return this.state.layout
  }

  //api
  deleteItem(key) { }
}
