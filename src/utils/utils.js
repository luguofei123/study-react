import moment from 'moment';
export const guid = (num = 3) => {
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //   let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //   return v.toString(16);
  // });

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(10).substring(1);
  }
  const timeStr = moment().format(`YYYYMMDDHHmmssSSS`)
  let guid = timeStr
  for (let i = 0; i < num; i++) {
    guid = guid + S4()
  }

  return guid
}
export const date = (formatStr = 'YYYYMMDD') => {
  return moment().format(formatStr)
}
// 从url中取参数
export const getQueryString = (name) => {
  const reg = new RegExp("(^|[&,?])" + name + "=([^&]*)(&|$)");
  const r = window.location.href.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

// 根据key将树型结构平行化
export const flatTree = ({ treeData, key = 'key', children = 'children' }) => {
  let flat = {}
  let divCodeToKey = {}
  const trans = (dt, parentKey, level) => {
    dt.map(son => {
      son.level = level
      if (!son.divCode) {
        son.divCode = son[key]
      } else {
        divCodeToKey[son.divCode] = son[key]
      }

      if (!son[key]) {
        son[key] = guid()
      }
      son.parentKey = parentKey
      flat[son[key]] = son

      if (son[children]) {
        trans(son[children], son[key], level + 1)
      }
    })
  }
  trans(treeData, '', 0)
  return { data: flat, divCodeToKey }
}

export const arrayMove = (array, fromIndex, toIndex) => {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}
////////////////////
//计算高宽样式，用来设计组件外边距用
export const getSizeStyle = ({ width = '100%', height = '100%', margintop = 0, marginleft = 0, marginbottom = 0, marginright = 0, paddingleft = 0, paddingright = 0, paddingtop = 0, paddingbottom = 0 }) => {
  let style = { width, height }
  /*
    if (width && width !== 'auto') {
      if (width.indexOf('%') === -1) {
        style.width = `${width - marginleft - marginright - paddingleft - paddingright}px`
      } else {
        style.width = `calc(100% - ${marginleft + marginright + paddingleft + paddingright}px)`
      }
    }
    if (height && height !== 'auto') {
      if (height.indexOf('%') === -1) {
        style.height = `${height - margintop - marginbottom - paddingtop - paddingbottom}px`
      } else {
        style.height = `calc(100% - ${margintop + marginbottom + paddingtop + paddingbottom-1}px)`
      }
    }
  */
 
  if (width && width !== 'auto') {
    if (width.indexOf('%') === -1) {
      style.width = `${width - marginleft - marginright}px`
    } else {
      style.width = `calc(100% - ${marginleft + marginright}px)`
    }
  }
  if (height && height !== 'auto') {
    if (height.indexOf('%') === -1) {
      style.height = `${height - margintop - marginbottom}px`
    } else {
      style.height = `calc(100% - ${margintop + marginbottom - 1}px)`
    }
  }
  
  if (margintop) {
    style.marginTop = `${margintop}px`
  }
  if (marginleft) {
    style.marginLeft = `${marginleft}px`
  }
  if (marginright) {
    style.marginRight = `${marginright}px`
  }
  if (marginbottom) {
    style.marginBottom = `${marginbottom}px`
  }
  /////
  if (paddingtop) {
    style.paddingTop = `${paddingtop}px`
  }
  if (paddingleft) {
    style.paddingLeft = `${paddingleft}px`
  }
  if (paddingright) {
    style.paddingRight = `${paddingright}px`
  }
  if (paddingbottom) {
    style.paddingBottom = `${paddingbottom}px`
  }
  return style
}
////////////cookie
export const setCookie = (name, value, time = '', path = '') => {
  if (time && path) {
    let strsec = time * 1000;
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path;
  } else if (time) {
    let strsec = time * 1000;
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  } else if (path) {
    document.cookie = name + "=" + escape(value) + ";path=" + path;
  } else {
    document.cookie = name + "=" + escape(value);
  }
}

export const getCookie = (name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

// 全局替换
export const replaceAll = (str, str1, str2) => {
  if (!str || !str1) return str;
  const reg = new RegExp(str1, 'gm');
  str = str.replace(reg, str2);
  return str;
}
/////////////
// 对象比较加状态,unincluds=>要排除的字段['id'],primaryKeys主键
export const objectComp = (oOld, oNew, unincluds, primaryKeys) => {
  primaryKeys = primaryKeys || []
  keys = keys || []
  let newSize = Object.keys(oNew).length
  let newObj = {}
  /*
  for (let i = 0, len = unincluds.length; i < len; i++) {
    let key = unincluds[i]
    if (oOld[key] === oNew[key] || newSize === 0) {
      newObj[key] = oNew[key] || ''
    }
  }
*/

  for (let i = 0, len = primaryKeys.length; i < len; i++) {
    let key = primaryKeys[i]
    if (oNew[key]) {
      newObj[key] = oNew[key]
    }
  }

  if (newSize === 0) {
    newObj._status = 'Delete'
  }

  let isDiff = false
  let keys = Object.keys(oNew)
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let val = oNew[key]
    if (!unincluds.includes(key)) {
      let oldVal = (oOld[key] === undefined || oOld[key] === null) ? '' : oOld[key]
      let cmpOld = oldVal
      if (typeof oldVal === 'object') {
        cmpOld = JSON.stringify(cmpOld)
      } else {
        cmpOld = oldVal.toString()
      }
      let cmpNew = (val === undefined || val === null) ? '' : val
      if (typeof cmpNew === 'object') {
        cmpNew = JSON.stringify(cmpNew)
      } else {
        cmpNew = cmpNew.toString()
      }

      //console.log('开启调试：', cmpNew, cmpOld, cmpNew !== cmpOld, key)

      if (cmpNew !== cmpOld) {
        newObj[key] = val
        isDiff = true
      }
    }
  }

  if (isDiff) {
    newObj._status = 'Update'
  }
  return newObj
}
//数组比较加状态,keys:行比较关键字，unincluds：非关键字，但不做为比较对象
export const arrayComp = (aOld, aNew, keys, unincluds) => {
  unincluds = unincluds || []
  keys = keys || []
  unincluds = unincluds.concat(keys)
  let newSize = aNew.length
  let unSize = keys.length
  let cloneOld = JSON.parse(JSON.stringify(aOld))
  // let cloneNew = XEUtils.clone(aNew)
  let aResult = []
  // 新数组中存在，旧数组中不存在
  for (let i = newSize - 1; i >= 0; i--) {
    let oNew = aNew[i]
    let oldSize = cloneOld.length
    if (oldSize === 0) {
      oNew._status = 'Insert'
      aResult.unshift(oNew)
      continue
    }
    let bProcess = false
    for (let j = oldSize - 1; j >= 0; j--) {
      let oOld = cloneOld[j]
      let iCount = 0
      for (let k = 0; k < unSize; k++) {
        let key = keys[k]
        if (!oNew[key] || !oOld[key]) continue
        if (oNew[key].toString() === oOld[key].toString()) {
          iCount++
        }
      }
      if (iCount === unSize) {
        let oRst = objectComp(oOld, oNew, unincluds, keys)

        if (oRst.hasOwnProperty('_status')) {
          aResult.unshift(oRst)
        }
        cloneOld.splice(j, 1)
        bProcess = true
        break
      }
    }
    // 没找到匹配项为新行
    if (!bProcess) {
      oNew._status = 'Insert'
      aResult.unshift(oNew)
    }
  }
  // 旧数组中有，新数组中无
  for (let i = 0, len = cloneOld.length; i < len; i++) {
    let delRow = cloneOld[i]
    let tmpRow = { _status: 'Delete' }
    for (let k = 0; k < unSize; k++) {
      let key = keys[k]
      if (!delRow[key]) continue
      tmpRow[key] = delRow[key]
    }
    aResult.unshift(tmpRow)
  }
  return aResult
}

// 求合
export const sum = (data = [], field) => {
  let sumVal = 0
  data.forEach(item => {
    const val = parseFloat(item[field]) || 0
    sumVal = sumVal + val
  })

  return sumVal
}