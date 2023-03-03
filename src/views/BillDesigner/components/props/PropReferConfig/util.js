// 判断是否需要显示参照代入
export const getIsShowRepaceItems = (widget) => {
  let isShow = true; // 标记是否显示参照代入设置
  if(widget) {
    const { name: widgetName } = widget
    if(['LCDTree'].indexOf(widgetName) !== -1) {
      isShow = false; // 搜索树类型的不需要显示参照代入
    }
  }
  return isShow;
}
// 判断参照代入项是否是有效的业务显示字段
export const isBusiDislayField = (item = {})=>{
  // 如果参照代入项勾选了业务显示字段，且设置了to字段
  // 才认为是有效的业务显示字段
  return item.isDisplayField && item.to && item.to.fieldname
}

// 获取用来设置组件显示值的来源字段
export const getDisplayFields = (widget = {}) => {
  const { fieldNames = {}, replaceItems = [] } = widget.enty || {}
  // 需要将显示字段或业务显示字段中配置代入到当前字段的.displayname
  let displayFieldArr = [];
  replaceItems.forEach(item=>{
    if(isBusiDislayField(item)) {
      // 防止有些代入项没有设置from字段
      const fromField = item.from && item.from.fieldname ? item.from.fieldname : ''
      displayFieldArr.push(fromField)
    }
  })
  // 如果没有设置有效的业务显示字段，需要从fieldNames中取
  if(displayFieldArr.length ===0) {
    const { label, labelCode } = fieldNames
    if(labelCode) {
      displayFieldArr.push(labelCode)
    }
    if(label) {
      displayFieldArr.push(label)
    }
  }
  return displayFieldArr
}

// 根据字段获取值
export const getValueByFields = (displayFieldsArr = [], values = {}) => {
  let displayName = null;
  if (displayFieldsArr.length) {
    displayName = '' // 如果有配置显示字段，值为空时默认为''
    function getDisplayValue(val = {}) {
      return displayFieldsArr.map(item=>(item in val ? val[item] : '')).join(' ')
    }
    if(values && JSON.stringify(values) !== '{}') {
      if (!Array.isArray(values)) {//如果不是数组
        displayName = getDisplayValue(values)
      } else if (values.length > 0) {
        displayName = values.map(item => getDisplayValue(item)).join(',')
      }
    }
  }
  return displayName;
}

// 获取显示值
export const getDisplayValue = (widget = {}, values = {})=>{
  let displayName = null;
  const displayFieldsArr = getDisplayFields(widget);
  if (displayFieldsArr.length) {
    displayName = getValueByFields(displayFieldsArr, values)
  }
  return displayName; // 值为null表示没有配置显示字段
}