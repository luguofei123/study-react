
export const DragactLayoutItem = {
  GridX: 0,
  GridY: 0,
  static: false,
  w: 8,
  h: 1,
  isUserMove: false,
  key: 0,
  handle: false,
  canDrag: false,
  canResize: false
}

export const DragactProps = {
  layout: [],
  /** 
   * 宽度切分比 
   * 这个参数会把容器的宽度平均分为col等份
   * 于是容器内元素的最小宽度就等于 containerWidth/col
  */
  col: 3,

  /** 
   * 容器的宽度
  */
  width: 800,

  /**容器内每个元素的最小高度 */
  rowHeight: 32,

  /**
   * 容器内部的padding
   */
  padding: 0,

  children: (Item, provided) => [],


  // 
  // interface GridItemEvent {
  //     event: any //浏览器拖动事件
  //     GridX: number //在布局中的x格子  
  //     GridY: number //在布局中的y格子  
  //     w: number //元素的宽度
  //     h: number //元素的高度
  //     UniqueKey: string | number //元素的唯一key
  // }

  /**
   * 拖动开始的回调
   */
  onDragStart: (event, currentLayout) => false,

  /**
   * 拖动中的回调
   */
  onDrag: (event, currentLayout) => false,

  /**
   * 拖动结束的回调
   */
  onDragEnd: (event, currentLayout) => false,

  /**
   * 每个元素的margin,第一个参数是左右，第二个参数是上下
   */
  margin: [5, 5],

  /** 
   * layout的名字
  */
  className: '',

  /**是否有placeholder */
  placeholder: false,

  style: '',
}

export const mapLayout = {
  key: DragactLayoutItem
}

export const DragactState = {
  GridXMoving: 0,
  GridYMoving: 0,
  wMoving: 0,
  hMoving: 0,
  placeholderShow: false,
  placeholderMoving: false,
  layout: [],
  containerHeight: 100,
  dragType: 'drag',
  mapLayout: undefined
}

export const GridItemProvided = {
  isDragging: Boolean,
  dragHandle: null,
  resizeHandle: null,
  props: null
}
