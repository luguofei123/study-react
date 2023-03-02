export const int = (number) => {
  if (number === '' || number === null) {
    return 0
  }
  return parseInt(number, 10)
}
export const innerWidth = (node) => {
  let width = node.clientWidth;
  const computedStyle = node.style;

  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}

export const outerWidth = (node) => {
  let width = node.clientWidth;
  const computedStyle = node.style
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}

export const innerHeight = (node) => {
  let height = node.clientHeight;
  const computedStyle = node.style
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export const outerHeight = (node) => {
  let height = node.clientHeight;
  const computedStyle = node.style
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export const Bound = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
}
export const parseBounds = (bounds) => {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom
  }
}

export const isNumber = (things) => {
  return typeof things === 'number' ? true : false
}

export const getDataSet = (children) => {
  return children.map((child) => {
    return { ...child.props['data-set'], isUserMove: true, key: child.key, }
  })
}

export const stringJoin = (source, join) => {
  return source + (join ? ` ${join}` : '')
}
