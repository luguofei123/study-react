import React from 'react'
export const Bound = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
}

export const DraggerProps = {

  className: '',

  /**
  * 给予元素一个x,y的初始位置，单位是px
  */
  x: 0,
  y: 0,

  /** 
   * 拖动范围限制
   * 如果不规定范围，那么子元素就可以随意拖动不受限制
   * 1.可以提供自定义的范围限制
   * 2.也可以提供父类为边框的范围限制(string === parent)
   */
  bounds: 'parent',

  /**
       * 以网格的方式移动，每次移动并不是平滑的移动
       * [20,30]，鼠标x轴方向移动了20 px ，y方向移动了30 px，整个子元素才会移动
       */
  grid: [5, 5],


  /**只允许移动x轴 */
  /**只允许移动y轴 */
  allowX: true,
  allowY: true,


  /**
  * 是否由用户移动
  * 可能是通过外部props改变
  */
  isUserMove: false,

  /**
   * 生命周期回调
   */
  onDragStart: (x, y) => false,
  onMove: (event, x, y) => false,
  onDragEnd: (event, x, y) => false,

  onResizeStart: (event, x, y) => false,
  onResizing: (event, x, y) => false,
  onResizeEnd: (event, x, y) => false,
  style: React.CSSProperties,

  w: 8,
  h: 1,
  handle: true,
  canDrag: true,
  canResize: true,
  children: (provided, resizeMix, dragMix) => []
}
