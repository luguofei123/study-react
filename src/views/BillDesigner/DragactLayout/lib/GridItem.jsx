import React from "react";
import { Dragger } from './dragger/index'
import { checkInContainer } from './util/correction';
import { Bound } from './utils';

const checkWidthHeight = (GridX, w, h, col) => {
  var newW = w;
  var newH = h;
  if (GridX + w > col - 1) newW = col - GridX //右边界
  if (w < 1) newW = 1;
  if (h < 1) newH = 1;
  return {
    w: newW, h: newH
  }
}

class GridItem extends React.Component {
  constructor(props) {
    super(props)
    this.onDrag = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.calGridXY = this.calGridXY.bind(this)
    this.calColWidth = this.calColWidth.bind(this)
  }
  state = { dragStartX: 0, dragStartY: 0 }
  /** 计算容器的每一个格子多大 */
  calColWidth () {
    const { containerWidth, col, containerPadding, margin } = this.props;

    if (margin) {
      return (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col
    }
    return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col
  }

  /**转化，计算网格的GridX,GridY值 */
  calGridXY (x, y) {
    const { margin, containerWidth, col, w, rowHeight } = this.props

    /**坐标转换成格子的时候，无须计算margin */
    let GridX = Math.round(x / containerWidth * col)
    let GridY = Math.round(y / (rowHeight + (margin ? margin[1] : 0)))

    // /**防止元素出container */
    return checkInContainer(GridX, GridY, col, w)
  }


  /**给予一个grid的位置，算出元素具体的在容器中位置在哪里，单位是px */
  calGridItemPosition (GridX, GridY) {
    var { margin, rowHeight } = this.props

    if (!margin) margin = [0, 0];

    let x = Math.round(GridX * this.calColWidth() + (GridX + 1) * margin[0])
    let y = Math.round(GridY * rowHeight + margin[1] * (GridY + 1))


    return {
      x: x,
      y: y
    }
  }


  shouldComponentUpdate (props, state) {

    let isUpdate = false
    Object.keys(props).forEach((key) => {
      if (props[key] !== this.props[key]) {
        isUpdate = true
      }
    })
    return isUpdate

    // return this.props.GridX !== props.GridX ||
    //     this.props.GridY !== props.GridY ||
    //     this.props.isUserMove !== props.isUserMove ||
    //     this.props.w !== props.w ||
    //     this.props.h !== props.h ||
    //     this.props.containerWidth !== props.containerWidth ||
    //     this.props.col !== props.col ||
    //     this.props.rowHeight !== props.rowHeight
  }

  /**宽和高计算成为px */
  calWHtoPx (w, h) {
    var { margin, movepx } = this.props
    if (!margin) margin = [0, 0];
    if (!movepx) {
      const wPx = Math.round(w * this.calColWidth() + (w - 1) * margin[0])
      const hPx = Math.round(h * this.props.rowHeight + (h - 1) * margin[1])
      return { wPx, hPx }
    } else {
      const wPx = w * this.calColWidth() + (w - 1) * margin[0]
      const hPx = h * this.props.rowHeight + (h - 1) * margin[1]
      return { wPx, hPx }
    }
  }

  calPxToWH (wPx, hPx) {
    const calWidth = this.calColWidth();
    /*wangxin 这里为什么要减一个半？而且可以不取整吧*/
    if (!this.props.movepx) {
      const w = Math.round((wPx - calWidth * 0.5) / calWidth)
      const h = Math.round((hPx - this.props.rowHeight * 0.5) / this.props.rowHeight)
      return checkWidthHeight(this.props.GridX, w, h, this.props.col)
    } else {
      const w = wPx / calWidth
      const h = hPx / this.props.rowHeight
      return checkWidthHeight(this.props.GridX, w, h, this.props.col)
    }
  }

  onDragStart (x, y) {
    this.setState({ dragStartX: x, dragStartY: y })
    const { w, h, UniqueKey, position, placeholder } = this.props;

    if (this.props.static) return;

    const { GridX, GridY } = this.calGridXY(x, y)

    this.props.onDragStart && this.props.onDragStart({
      event: null, GridX, GridY, w, h, UniqueKey: UniqueKey + '', position, placeholder
    })
  }
  onDrag (event, x, y) {
    if (this.props.static) return;
    /*     //2022-06-08 begin
        const { dragStartX, dragStartY } = this.state
        if (Math.abs(x - dragStartX) < 5 || Math.abs(y - dragStartY) < 5) {
          return
        }
        //2022-06-08 end */
    const { GridX, GridY } = this.calGridXY(x, y)
    // console.log(x, y, GridX, GridY, '拖动改变位置')
    const { w, h, UniqueKey } = this.props
    this.props.onDrag && this.props.onDrag({ GridX, GridY, x, y, w, h, UniqueKey: UniqueKey + '', event })
  }

  onDragEnd (event, x, y) {
    //2022-06-08 begin
    /*     const { dragStartX, dragStartY } = this.state
        if (Math.abs(x - dragStartX) < 5 || Math.abs(y - dragStartY) < 5) {
          return
        } */
    //2022-06-08 end 
    if (this.props.static) return;
    const { GridX, GridY } = this.calGridXY(x, y);
    const { w, h, UniqueKey } = this.props;
    if (this.props.onDragEnd) this.props.onDragEnd({ GridX, GridY, x, y, w, h, UniqueKey: UniqueKey + '', event });
  }

  onResizeStart = (event, wPx, hPx) => {
    const { GridX, GridY, UniqueKey, w, h, position, placeholder } = this.props;
    this.props.onResizeStart && this.props.onResizeStart({ GridX, GridY, w, h, UniqueKey: UniqueKey + '', position, placeholder, event })
  }

  onResizing = (event, wPx, hPx) => {
    var { w, h } = this.calPxToWH(wPx, hPx);
    const { GridX, GridY, UniqueKey } = this.props;
    this.props.onResizing && this.props.onResizing({ GridX, GridY, w, h, wPx, hPx, UniqueKey: UniqueKey + '', event })
  }

  onResizeEnd = (event, wPx, hPx) => {
    var { w, h } = this.calPxToWH(wPx, hPx);
    const { GridX, GridY, UniqueKey } = this.props;

    this.props.onResizeEnd && this.props.onResizeEnd({ GridX, GridY, w, h, wPx, hPx, UniqueKey: UniqueKey + '', event })
  }





  render () {
    const { w, h, xPx, yPx, pxMove, style, bounds, GridX, GridY, GridW, GridH, handle, canDrag, canResize, autoHeight, autoWidth } = this.props;
    let { x, y } = this.calGridItemPosition(GridX, GridY);
    let { wPx, hPx } = this.calWHtoPx(w, h);
    return (
      <Dragger
        style={{
          ...style,
          width: wPx,
          height: hPx,
          position: 'absolute',
          transition: this.props.isUserMove ? '' : 'all .2s ease-out',
          zIndex: this.props.isUserMove ? (this.props.dragType === 'drag' ? 10 : 2) : 2
        }}
        onDragStart={this.onDragStart}
        onMove={this.onDrag}
        onDragEnd={this.onDragEnd}
        onResizeStart={this.onResizeStart}
        onResizing={this.onResizing}
        onResizeEnd={this.onResizeEnd}
        x={x}
        y={y}
        w={wPx}
        h={hPx}
        isUserMove={this.props.isUserMove}
        bounds={bounds}
        handle={handle}
        canDrag={canDrag}
        canResize={canResize}
      >
        {(provided, draggerProps, resizerProps) => this.props.children(provided, draggerProps, resizerProps)}
      </Dragger>
    )
  }
}

GridItem.defaultProps = {
  col: 12,
  containerWidth: 500,
  containerPadding: [0, 0],
  margin: [10, 10],
  rowHeight: 30,
  w: 1,
  h: 1
}

export default GridItem