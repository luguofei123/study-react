import u from '../../../utils/umbrella'
import { getQueryString, guid, flatTree, arrayComp, objectComp } from '../../../utils/utils.js'

// import { setCache, getCache } from '../../../utils/indexDB'
// import * as billActions from '../ActionProps/BillActions'
import { showWidgetPopupToolbar, hideWidgetPopupToolbar } from './WidgetPopupToolbar'
// import { getRefers } from '@/api/pvdf/BillDesign'
import { autoBodyHeight } from './utils'
import { getDisplayValue } from '../components/props/PropReferConfig/util'
// 全局操作方法，为了简化操作，将一些对象绑定在window对象上
let billActions = {}
function getRefers () { }
function setCache () { }
function getCache () { }
function getDisplayFields () { }
let ht = {
  wxlcd: {},//uidata:缓存历史 treeData:树结构数据 flatTree:扁平化数据 divCodeToKey:容器编码
  //f: {},//实体数据，要存到表的数据存储,部分代入，需要最后合并
  showHideItem: 1,
  currentNode: null,//当前选择结点，弹出操作窗口
  historyIndex: 0,//缓存的页面样式,
  extraJS: {},//扩展脚本
  extraEvents: {},//存储扩展事件
  editMod: 'new',//new新增，edit修改,view浏览
  loading: false,//加载中
  local: {},//存储卡片原始的高，以便操作显示、隐藏事件
  contRef: {}, // 存储布局容器
  cacheEntyVersion: {},//实体版本号
  cutUIData: {},//剪切UI元数据

  storeContRef (ref, key) {
    if (!ht.contRef) {
      ht.contRef = {}
    }
    ht.contRef[`${key}`] = ref
  },

  refreshContRef (layoutItem, parentKey) {
    if (parentKey && ht.contRef[parentKey] && ht.contRef[parentKey].current) {
      ht.contRef[parentKey].current.updateLayout(layoutItem)
    }
  },
  getVersion () {
    return ht.wxlcd.treeData[0].version || 0
  },
  getTreeData () {
    return ht.wxlcd.treeData
  },
  setCache (key, value) {
    setCache(key, value)
  },

  async getCache (key) {
    return await getCache(key)
  },
  //存对象
  setItem (key, val) {
    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    ht.wxlcd[key] = val

  },
  //取对象
  getItem (key) {
    if (ht.wxlcd[key]) {
      return ht.wxlcd[key]
    }
    return ''
  },
  // 根据 billId 缓存 查询的detail接口数据
  setDetailData (billId, val) {
    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    if (!ht.wxlcd.detailData) {
      ht.wxlcd.detailData = {}
    }
    ht.wxlcd.detailData[billId] = val

  },
  // 根据 billId 获取 查询的detail接口数据
  getDetailData (billId) {
    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    if (!ht.wxlcd.detailData) {
      ht.wxlcd.detailData = {}
    }
    return ht.wxlcd.detailData[billId] || {}

  },

  //存对象
  setExtraEvent (key, func) {
    if (!ht.extraEvents) {
      ht.extraEvents = {}
    }
    ht.extraEvents[key] = func
  },
  //取对象
  getExtraEvent (key) {
    if (ht.extraEvents[key]) {
      return ht.extraEvents[key]
    }
    return ''
  },
  removeExtraEvent (key) {
    if (ht.extraEvents[key]) {
      delete ht.extraEvents[key]
    }
  },
  async execExtraEvent (actionDomKey, actionName, arugs) {
    const func = ht.getExtraEvent(`${actionDomKey}_${actionName}`)
    if (func) {
      return await func(arugs)
    }
    return true
  },
  syncExecExtraEvent (actionDomKey, actionName, arugs) {
    const func = ht.getExtraEvent(`${actionDomKey}_${actionName}`)
    if (func) {
      try {
        return func(arugs)
      } catch (error) {
        console.log(error)
        return false
      }

    }
    return true
  },
  // 销毁
  destroy () {
    delete ht.wxlcd
  },
  //缓存页面Dom,修改过程中用,1.插入2.删除3.改变大小4.属性变化时存
  setUIDataHistory (domTree) {
    const timeId = setTimeout(() => {
      if (!ht.wxlcd) {
        ht.wxlcd = {}
      }
      if (!ht.wxlcd.uidata) {
        ht.wxlcd.uidata = []
      }
      if (ht.historyIndex > ht.wxlcd.uidata.length - 1) {
        ht.wxlcd.uidata.slice(0, ht.historyIndex)
      }
      // if (JSON.stringify(domTree) === JSON.stringify(ht.wxlcd.treeData)) {
      //   return false
      // }
      ht.wxlcd.uidata.push(JSON.stringify(domTree || ht.wxlcd.treeData))
      if (ht.wxlcd.uidata.length > 50) {
        ht.wxlcd.uidata.splice(0, 1)
      }

      ht.historyIndex = ht.wxlcd.uidata.length
      clearTimeout(timeId)
    }, 300)
  },
  getUIDataHistory (idx) {
    if (!ht.wxlcd.uidata) {
      ht.wxlcd.uidata = [JSON.stringify(ht.wxlcd.treeData)]
    }
    if (idx < 0) {
      ht.historyIndex = 0
    } else if (idx >= ht.wxlcd.uidata.length) {
      ht.historyIndex = ht.wxlcd.uidata.length
    } else {
      ht.historyIndex = idx
    }

    const treeData = JSON.parse(ht.wxlcd.uidata[ht.historyIndex])
    ht.loadData(treeData)

  },
  //判断位置控制操作
  getHistoryPos () {
    if (!ht.wxlcd.uidata) {
      ht.wxlcd.uidata = [JSON.stringify(ht.wxlcd.treeData)]
    }
    //0:只有一个，1：大于1个位置第一个，2：大于2个中间的，3：大于1个，最后一个
    let pos = 0
    if (ht.historyIndex <= 0) {
      pos = 1
    } else if (ht.historyIndex >= ht.wxlcd.uidata.length - 1) {
      pos = 3
    } else {
      pos = 2
    }
    if (ht.wxlcd.uidata.length === 1) {
      pos = 0
    }
    return pos
  },
  //设置全局
  async setGlobalProps (props) {
    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    if (!ht.wxlcd.global) {
      ht.wxlcd.global = {}
    }
    ht.wxlcd.global = { ...ht.wxlcd.global, ...props }

  },
  getGlobalProps () {
    if (!ht.wxlcd.global) {
      return {}
    }
    return JSON.parse(JSON.stringify(ht.wxlcd.global))
  },
  setExtraJS (extraJS) {
    ht.extraJS = extraJS
  },
  getExtraJS () {
    return ht.extraJS
  },
  setCutUIData (node) {
    ht.cutUIData[node.key] = node
    ht.deleteNode(node)
  },
  removeCutUIData ({ key }) {
    delete ht.cutUIData[key]
  },
  getCutUIData () {
    const list = []
    for (let key in ht.cutUIData) {
      const node = ht.cutUIData[key]
      list.push(node)
    }
    return list
  },
  /////////////////////////////////////////////////////////////////
  getEntyValues () {
    return ht.wxlcd.entyValues
  },
  reloadWidgetData (widgetKey, focused = false) {
    const rootNode = ht.getNodeByKey(widgetKey)
    if (!rootNode) return
    ht.refreshUIData(rootNode)

    setTimeout(() => {
      //循环
      const reload = (nodes) => {
        nodes.forEach(nd => {
          const { key, dataType, children } = nd

          if (dataType === 'enty') {
            //debugger
            const entyValues = ht.getEntyValues()[key]
            const oldVer = ht.cacheEntyVersion[key]
            // 这里的版本好象不对，目前全走强制了
            if (entyValues && (oldVer !== entyValues.version || focused)) {
              ht.cacheEntyVersion[key] = entyValues.version
              // 数据为空时不更新
              if (entyValues.data.length) {
                ht.setEntyWidgetValues(key, entyValues.data)
              }

            }

          }
          if (children && children.length) {
            reload(children)
          }
        })
      }
      reload([rootNode])
    }, 10)
  },
  //设置值，当为表单时values为对象{}，当为表时values对象为数组[]
  setEntyWidgetValues (key, values) {
    //赋值
    const entyNode = ht.getNodeByKey(key)
    const { nodeType } = entyNode
    if (nodeType === 'table') {
      //debugger
      const $table = ht.getWidgetByKey(key)
      if ($table) {
        $table.loadData(values)
      } else {
        console.log('赋值刷新,对象不存在', entyNode)
      }
    } else {
      for (let dataField in values) {
        let node = ht.getNodeByDataField(key, dataField)
        if (node) {

          //还应该加上对参照的处理
          node.value = values[dataField]
          let displayValue = values[`${dataField}_displayValue`]

          //字段有参照
          if (node.enty) {
            if (node.props && node.props.displayvalue) {
              const displayvalue = node.props.displayvalue
              if (displayvalue) {
                let arr = displayvalue.split('+')
                let showVal = ''
                if (node.props.checkable) {
                  if (node.value && arr.length) {
                    const valMap = {};
                    arr.forEach((key) => {
                      valMap[key] = values[key] ? values[key].split(',') : []
                    })
                    const valueArr = node.value.split(',')
                    const disArr = [];
                    valueArr.forEach((item, ind) => {
                      let _str = [];
                      arr.forEach(key => {
                        _str.push(valMap[key][ind] || '')
                      })
                      disArr.push(_str.join(' '))
                    })
                    showVal = disArr.join(',')
                  }
                } else {
                  arr.forEach((key) => {
                    const val = values[key]
                    if (val) {
                      showVal = showVal ? (showVal + ' ' + val) : val
                    }

                  })
                }
                displayValue = showVal.replace(/\./g, '')
              }
            }

          }
          ///
          if (displayValue) {
            node.displayValue = displayValue
            //参照这样赋值是否合适
            //node.value = { value: node.value, displayValue }
          }
        }
      }
      ht.refreshUIData(entyNode)
    }
  },
  //
  async getChangedEntyValues () {
    const oldValues = ht.getItem('cacheEntyValues')
    const curValues = ht.wxlcd.entyValues
    let newValues = JSON.parse(JSON.stringify(curValues))

    const unincludes = ['_status', 'mofDivCode', 'agencyBizKey', 'billCateCode', 'billCateId', 'billTypeCode', 'billTypeId', 'fiscalYear', 'flowBillTypeId']
    /*
        for (let key in curValues) {
          if (!['billId', 'billCode'].includes(key)) {
            if (Array.isArray(curValues[key].data)) {
              const data = arrayComp(oldValues[key].data, curValues[key].data, ['id'], [...unincludes])
              if (data.length) {
                newValues[key].data = [...data]
              } else {
                delete newValues[key]
              }

            } else {
              const data = objectComp(oldValues[key].data, curValues[key].data, ['id', ...unincludes])
              if (Object.keys(data).length) {
                newValues[key].data = { ...data }
              } else {
                delete newValues[key]
              }
            }
          }
        }
        console.log('缓存的数据变人化埋', newValues)
    */
    let hasChange = false
    for (let key in curValues) {
      if (!['billId', 'billCode', 'billStatus'].includes(key)) {
        let oldData
        let tmpnode = ht.getNodeByKey(key)
        if (!oldValues[key]) {

          if (tmpnode.nodeType === 'table') {
            oldData = []
          } else {
            oldData = {}
          }
        } else {
          oldData = oldValues[key].data
        }
        if (Array.isArray(newValues[key].data)) {
          /*
          if(!oldValues[key]||!curValues[key]){
            debugger
            oldValues[key]
            curValues[key]
            let tmpnode=ht.getNodeByKey(key)
            console.log(key,'存出错',tmpnode)
          }
          */

          const data = arrayComp(oldData, curValues[key].data, ['id'], [...unincludes])

          if (data.length) {
            hasChange = true
            data.forEach(dt => {
              const ipos = newValues[key].data.findIndex(row => row.id === dt.id)
              if (ipos >= 0) {
                newValues[key].data[ipos]._status = dt._status
              } else {
                //删除
                const jpos = oldValues[key].data.findIndex(row => row.id === dt.id)
                if (jpos >= 0) {
                  newValues[key].data.push({ ...oldValues[key].data[jpos], ...dt })
                }

              }
            })

          }

        } else {
          const data = objectComp(oldData, curValues[key].data, ['id', ...unincludes])
          if (Object.keys(data).length) {
            hasChange = true
            newValues[key].data._status = data._status
          }
        }
      }
    }
    if (hasChange) {
      return newValues
    } else {
      return false
    }

  },

  // 初始化结构
  initEntyValues (clear = true, data) {
    ht.wxlcd.entyValues = {}
    const treeData = data || ht.getTreeData()
    let rootEnty
    const findEnty = (data) => {
      data.forEach(node => {
        const { dataType, key, children, enty, nodeType, isUpload } = node
        if (key === 'root') {
          rootEnty = { ...enty }
        }
        if (dataType === 'enty' && enty && key !== 'root') {

          let entyVale = { version: 0, nodeType, enty, data: nodeType === 'table' || isUpload === "isUpload" ? [] : {}, isMaster: (rootEnty.info && rootEnty.info.uri === enty.info.uri) }

          ht.wxlcd.entyValues[key] = entyVale
          //初始化子元素值
          if (nodeType !== 'table') {
            if (children && children.length) {
              // 已经初始化的字段
              let initedFields = {}
              children.forEach(cnode => {
                let { name, dataField, value = '', nodeType, defaultValue, enty, label } = cnode
                if (dataField && !initedFields[dataField]) {
                  //缓存
                  initedFields[dataField] = 1
                  // 如果有默认值，这里应该使用.如果是清理数据，需要将树上值清空
                  if (clear) {
                    value = ''
                    //cnode.value = ''
                  }
                  //金额框默认
                  if (name === 'YDFIntputNumber') {
                    if (!value) {
                      value = 0
                    }
                    if (!defaultValue) {
                      defaultValue = 0
                    }
                  }

                  //默认值处理
                  if (defaultValue || defaultValue === 0) {

                    if (typeof (defaultValue) === 'object') {

                      //一般是参照
                      if (!enty) { return }//日期区间
                      const { replaceItems = [] } = enty
                      replaceItems.forEach(item => {
                        const { from, to } = item
                        if (Object.keys(from).length && Object.keys(to).length) {
                          const replaceVal = defaultValue[from.fieldname] || ''
                          ht.wxlcd.entyValues[key].data[to.fieldname] = replaceVal
                          //缓存
                          initedFields[to.fieldname] = 1
                        }

                      })
                      //显示名称
                      ht.wxlcd.entyValues[key].data[`${dataField}_displayValue`] = defaultValue.displayValue

                    } else {
                      ht.wxlcd.entyValues[key].data[dataField] = defaultValue
                    }
                  } else {
                    ht.wxlcd.entyValues[key].data[dataField] = value
                  }

                } else if (dataField) {
                  console.log(`有可能配置错误：模板中绑定值或参照代入值有有重复${label}(${dataField})`)
                }
              })
            }
          } else {
            ht.wxlcd.entyValues[key].data = []
            //node.data = []
          }
        }
        if (children && children.length) {
          findEnty(children)
        }
      })
    }
    findEnty(treeData)
    console.log(JSON.parse(JSON.stringify(ht.wxlcd.entyValues)), '初始化的值集')
  },
  // 如果是表格行更新，需要指定rowIndex
  updateEntyValues (formKey, values, isTableRowChange, rowIndex) {
    console.log('%c updateEntyValues更新值', "color: blue", formKey, values, isTableRowChange, rowIndex,)

    //这里应该单独对billId，billCode处理,用于存储单据编码信息
    if (['billId', 'billCode', 'billStatus'].includes(formKey)) {
      ht.wxlcd.entyValues[formKey] = values
      return false
    }
    const formNode = ht.getNodeByKey(formKey)
    if (!formNode) {
      console.log('更新值错误：未找到表单', formKey, values)
      return false
    }
    /*会不会导致值丢失*/
    if (!formNode.locked) {
      return false
    }

    const { nodeType, isUpload } = formNode
    if (!ht.wxlcd.entyValues[formKey]) {
      ht.wxlcd.entyValues[formKey] = nodeType === 'table' || isUpload === "isUpload" ? { data: [] } : { data: {} }
      ht.wxlcd.entyValues[formKey].version = 0
    }
    if (nodeType === 'table' || isUpload === "isUpload") {
      // 可编辑表格组件也使用了自定义组件，也会执行updateEntyValues，这里加个开关，防止丢数据
      if (!isTableRowChange) {
        return false
      }

      if ((rowIndex || rowIndex === 0) && !Array.isArray(values)) {
        ht.wxlcd.entyValues[formKey].data[rowIndex] = { ...ht.wxlcd.entyValues[formKey].data[rowIndex], ...values }
      }
      // console.log('表格数据要整体存', formKey, values)
      else {
        ht.wxlcd.entyValues[formKey].data = values
      }
    } else {
      ht.wxlcd.entyValues[formKey].data = { ...ht.wxlcd.entyValues[formKey].data, ...values }
    }
    ht.wxlcd.entyValues[formKey].version = ht.wxlcd.entyValues[formKey].version + 1
    console.log(JSON.parse(JSON.stringify(ht.wxlcd.entyValues)), '存储的值')
  },
  //缓存实体数据,用于修改存数据时对比用
  async cacheEntyValues () {
    ht.setItem('cacheEntyValues', JSON.parse(JSON.stringify(ht.wxlcd.entyValues)))
  },
  //局部缓存实体数据,用于修改存数据时对比用
  async cacheEntyValueByKeys (key) {
    if (key) {
      const cacheValues = ht.getItem('cacheEntyValues') || {};
      const newCacheValues = JSON.parse(JSON.stringify(cacheValues))
      const entyValues = JSON.parse(JSON.stringify(ht.wxlcd.entyValues))
      if (Array.isArray(key)) {
        key.forEach(item => {
          newCacheValues[item] = entyValues[item]
        })
      } else {
        newCacheValues[key] = entyValues[key]
      }
      ht.setItem('cacheEntyValues', newCacheValues)
    }
  },
  // 加载uidata
  async loadData (treeData) {
    if (ht.wxlcd.domTree) {
      await ht.wxlcd.domTree.loadData(treeData)
    }

    if (treeData && treeData.length > 0) {
      if (!treeData[0].enty) {
        //alert('缺少实体')
        return false
      }
      // console.log(JSON.parse(JSON.stringify(treeData)), '重新加在')
      const designer = ht.getItem('designer')
      if (designer) {
        ht.getItem('designer').setState({ treeData })
      }

      ht.setItem('treeData', treeData);
      let ftree = flatTree({ treeData })
      ht.setItem('flatTree', ftree.data);
      ht.setItem('divCodeToKey', ftree.divCodeToKey);

    }
  },

  ///////////////////////////////
  //选中节点，包括设计区层、树节点
  selectPlaceholderDom (node, domType, e) {
    ht.selectDom(node.key, domType, e)
    ht.getItem('designer').selectNode(node)
  },
  selectDom (domKey, domType, e) {
    if (e) {
      e.stopPropagation()
    }
    const uDom = ['table', 'toolbar', 'placeholder'].includes(domType) ? u(`.wx-${domKey}`) : u(`.wx-${domKey}`).closest('.layout-item')
    if (uDom && uDom.hasClass('locked')) {
      console.log('填报时不能选择')
      return false
    }

    const selected = uDom.hasClass('selected')
    if (!selected) {
      u('.selected').removeClass('selected')
      u('.actived').removeClass('actived')
    }
    uDom.addClass('selected')
    const selectedNode = ht.getNodeByKey(domKey)
    console.log(domKey, '点选了节点', selectedNode)
    const timeId = setTimeout(() => {
      //选择树
      if (ht.wxlcd.domTree && domType !== 'tree') {
        ht.wxlcd.domTree.select([domKey])
      }
      if (selectedNode) {
        ht.getItem('designer').selectNode(selectedNode)
      }
      // 如果是多页签，要调用状态更新刷新
      if (selectedNode && ['LCDTabs', 'AmasTabsBar'].includes(selectedNode.parentName)) {
        const parentNode = ht.getNodeByKey(selectedNode.parentKey)
        let widget = ht.getWidgetByKey(selectedNode.parentKey)
        if (!widget) {
          console.log('组件缺少widget，导致不能实时更新属性', 'node')
        }
        if (widget && widget.refreshState) {
          widget.refreshState({ domnode: { ...parentNode }, activeKey: domKey })
        } else {
          console.log('组件缺少refreshState方法，导致不能实时更新属性', widget, 'node')
        }
      }
      clearTimeout(timeId)
    }, 30)
    return selectedNode

  },
  // 显示设计组件操作工具
  showWidgetToolbar (nodeKey) {
    debugger
    if (ht.currentNode && nodeKey === ht.currentNode.key) {
      hideWidgetPopupToolbar()
      ht.currentNode = null
      return false
    }
    ht.currentNode = ht.getNodeByKey(nodeKey)
    let rect = ht.getRectByKey(nodeKey)
    if (rect.y <= 0) {
      const { scrollTop = 0 } = ht.getGlobalProps()
      rect.y = rect.y + scrollTop
    }

    showWidgetPopupToolbar({ ...rect, nodeKey })
  },
  //隐藏操作工具
  hideWidgetPopupToolbar () {
    hideWidgetPopupToolbar()
  },
  // 根据拖动层更新
  async updateTreeNodeByDragactLayout (dragactNode, nodeChildren, resized) {
    if (!dragactNode) {
      return false
    }
    nodeChildren.forEach(item => {
      const { key, GridX, GridY, GridH, w, h } = item
      const idx = dragactNode.children.findIndex(nd => nd.key === item.key)
      if (idx >= 0) {
        dragactNode.children[idx].GridX = GridX
        dragactNode.children[idx].GridH = GridH
        dragactNode.children[idx].GridY = GridY
        dragactNode.children[idx].w = w
        dragactNode.children[idx].h = h
      }
    })

    if (!resized) {
      dragactNode.children.sort((a, b) => {
        if (a.GridY === b.GridY) {
          return a.GridX - b.GridX
        }
        return a.GridY - b.GridY
      })
    }
    // 调整大小后
    setTimeout(() => {
      ht.setUIDataHistory(ht.wxlcd.treeData)
    }, 300)
  },
  // 根据实体表字段批量选择的时候对实体对象处理,fixedParentKey为指定的key,用于业务组件跳过中间层用
  async updateWidgetByTable ({ widget, fields, fixedParentKey }) {
    console.log({ widget, fields, fixedParentKey })
    if (!fields || !fields.length) {
      return ''
    }

    //移动应用
    const isMobile = getQueryString('mobile')
    let prefix = isMobile ? 'Amas' : 'YDF'
    let widgetNames = {
      text: { name: `${prefix}Input`, title: "文本" },
      singleLineText: { name: `${prefix}Input`, title: '单行文本' },
      bigText: { name: `${prefix}TextArea`, title: '大文本' },
      multiLanuage: { name: `${prefix}Input`, title: '多语文本' },
      contact: { name: `${prefix}Input`, title: '联系方式' },
      password: { name: `${prefix}Input`, title: '密码' },
      credentialNo: { name: `${prefix}Input`, title: '证件号' },
      // multiLineText: { name: 'YDFTextArea', title: '多行文本' },
      multiLineText: { name: `${prefix}BraftEditor`, title: '富文本' },
      opinionWriteBack: { name: `${prefix}BraftEditor`, title: '意见回写' },
      tel: { name: `${prefix}Input`, title: '电话' },
      mobilePhone: { name: `${prefix}Input`, title: '手机' },
      mail: { name: `${prefix}Input`, title: '邮箱' },
      IDCard: { name: `${prefix}Input`, title: '身份证' },
      link: { name: `${prefix}Href`, title: '链接' },
      date: { name: `${prefix}DatePicker`, title: '日期' },
      dateRange: { name: `${prefix}DatePicker`, title: '日期范围' },
      time: { name: `${prefix}DatePicker`, title: '时间' },
      timeRange: { name: `${prefix}DatePicker`, title: '时间范围' },
      dateTime: { name: `${prefix}DatePicker`, title: '日期时间' },
      number: { name: `${prefix}InputNumber`, title: '数值' },
      amount: { name: `${prefix}InputNumber`, title: '金额' },
      int: { name: `${prefix}InputNumber`, title: '数值' },
      option: { name: `${prefix}Select`, dataType: 'refer', title: '选项' },
      singleOption: { name: 'YDFRadio', title: '单选' },
      multipleOption: { name: 'YDFCheckbox', title: '多选' },
      switch: { name: `${prefix}Switch`, title: '开关' },
      quote: { name: `${prefix}TableModalSelect`, dataType: 'refer', title: '单选引用' },
      quoteList: { name: `${prefix}TableModalSelect`, dataType: 'refer', title: '多选引用' },
    }


    const setEnty = async ({ cNode, refuri, dataField }) => {
      //特指refuri===''为判断是否有参照
      cNode.refuri = refuri || ''
      if (cNode.locked) {
        return false
      }
      if (refuri && !cNode.enty) {
        const res = await getRefers({ entityUri: refuri, refOnly: true })
        cNode.enty = {
          title: res.refName || '',
          info: {
            ...res
          }
        }
        // 这里应该配置默认代入ID begin
        if (widget.enty) {
          const toFormKey = widget.key
          const { tableName, name, code } = widget.enty.info || {}
          const { refName, uri, refCode } = res
          cNode.enty.replaceItems = [{
            id: guid(),
            locked: true,
            from: { displayname: `${refName}.id`, tablename: `${refCode}`, fieldname: 'id' },
            to: { displayname: `${name}.${cNode.label}`, tablename: `${tableName}`, fieldname: `${dataField}`, toFormKey }
          }]
          //代码集添加默认条件
          if (cNode.eleCatalogCode) {
            cNode.enty.queryParams = {
              items: [{
                key: "c6ef74cb-cdb4-46f8-bf6e-ea4a93b9b7c0", l: { code: "eleCatalogCode", label: "目录编码" },
                log: { code: "and", label: "并且" }, op: { code: "eq", label: "等于" }, r: { valType: "const", label: cNode.eleCatalogCode, code: cNode.eleCatalogCode }
              }],
              text: `目录编码 等于 ${cNode.eleCatalogCode}`, vops: { op: "and", items: [{ field: "eleCatalogCode", op: "eq", value1: cNode.eleCatalogCode }] }
            }
          }
        }
        // 这里应该配置默认代入ID end
      }
    }

    // 更新参照配置
    fields.sort((a, b) => (a.hide || 0) - (b.hide || 0))
    let newChildren = []
    if (widget.parseChild !== 0) {

      const oldChildren = JSON.parse(JSON.stringify(widget.children || []))
      widget.cols = widget.cols || 3
      const defaultW = 24 / (widget.cols || 3)
      const locked = widget.locked
      let GridX = 0
      let GridY = -1
      for (let idx = 0, len = fields.length; idx < len; idx++) {
        let item = fields[idx]
        const iMod = idx % widget.cols
        GridX = iMod * defaultW
        if (iMod === 0) {
          GridY = GridY + 1
        }

        let { key, fieldname, dataField, dataIndex, displayname, enty, label, hide, length, nullable, precise, biztype, refuri, tablename, isParallel, parentKey, h = 2, w, eleCatalogCode } = item
        // 支持表格列转换
        dataField = fieldname || dataField || dataIndex
        label = label || displayname
        const component = widgetNames[biztype] || { name: `${prefix}Input` }
        const { name, props, dataType } = component
        let cNode = { key: guid(), name, props, nodeType: 'formItem', dataType, enty, dataField, label, hide, length, nullable, precise, tablename, isParallel, GridX, GridY, h, w: w || defaultW, locked, parentKey: fixedParentKey || parentKey, parentName: widget.name, eleCatalogCode }
        if (!cNode.props) {
          cNode.props = {}
        }
        if (cNode.props.show_label !== 0) {
          cNode.props.show_label = 1
        }
        const ipos = oldChildren.findIndex(it => it.dataField === dataField && !['column'].includes(it.nodeType))

        if (ipos === -1) {
          // 新加字段
          await setEnty({ cNode, refuri, dataField })

          newChildren.push(cNode)
        } else {
          newChildren.push({ ...oldChildren[ipos], })
          // 删除提高性能
          oldChildren.splice(ipos, 1)
        }
      }

      widget.children = [...newChildren]
    } else {
      const oldChildren = widget.children ? [...widget.children] : []
      const transKey = async (data) => {
        for (let i = 0, len = data.length; i < len; i++) {
          let d = data[i]
          if (d.name === 'LCDToolbar' || d.name === 'LCDBtnToolbar') {
            continue
          }
          const component = widgetNames[d.biztype] || { name: 'YDFInput' }
          const { name, props, dataType } = component


          //如果是原字段，则需要留
          const ipos = oldChildren.findIndex(nd => d.dataField ? nd.dataField === d.dataField : nd.dataField === d.fieldname)

          if (ipos >= 0) {
            console.log(ipos, d, oldChildren[ipos], 5555555555555555)
            data[i] = { ...oldChildren[ipos] }
            oldChildren.splice(ipos, 1)
          } else {
            d.key = guid()
            d.nodeType = 'column'
            d.name = name || 'column'
            d.dataType = dataType
            d.label = d.displayname
            d.dataIndex = d.fieldname
            d.dataField = d.fieldname
            d.parentKey = widget.key
            d.parentName = widget.name
            d.props = { disabled: 1 }
          }
          // 默认不可编辑
          await setEnty({ cNode: d, refuri: d.refuri, dataField: d.dataField })
          delete d.fieldname
          delete d.displayname
          if (d.children) {
            transKey(d.children)
          }

        }
      }
      const children = [...fields]
      await transKey(children)
      widget.children = children

    }
  },
  //refreshParent
  async updateNode (newNode, refreshParent, deletedKeys) {
    console.log(newNode, 'helperTool更新updateNode')
    const nodeKey = newNode.key || newNode.UniqueKey
    let node = ht.getNodeByKey(nodeKey)
    if (newNode.children && newNode.children.length == 1) {
      sessionStorage.setItem('changeNode', 'changeTrue')
    }
    if (newNode.children && node.children && newNode.children.length !== node.children.length) {
      sessionStorage.setItem('changeNode', 'changeTrue')
    }
    const isChildChange = newNode.children && newNode.children.length && JSON.stringify(node.children) !== JSON.stringify(newNode.children)
    if (!node) {
      console.log('dom元素不存在', node)
      return false
      node = { ...newNode }
    } else {
      // node = Object.assign(node, newNode)
      //只更新值
      for (let jsonKey in newNode) {
        node[jsonKey] = newNode[jsonKey]
      }
      // 如果有要删掉的属性就删掉
      if (deletedKeys && deletedKeys.length) {
        deletedKeys.forEach(key => {
          delete node[key]
        })
      }
    }
    if (!node.label) {
      node.label = node.name
    }

    ht.updateGridSize(nodeKey, newNode)
    //同步节点宽度,如果子节点不需要同步则不用处理，影响性能
    if (newNode.parseChild !== 0 && node.children && node.GridW !== newNode.GridW) {
      node.children.forEach(nd => {
        nd.GridW = node.GridW
        //2022-04-02递归调用更新子结点行不行？
        if (nd.children) {
          ht.updateGridSize(nd.key)
        }
      });
    }

    // 2022-06-07 key是节点必须的，如果只有一个key后面的更新都不需要,可能就是为了调整布局需要
    /*     if (Object.keys(newNode).length <= 1) {
          console.log('节点没有要更新的属性，可能只是为了调整布局需要', node)
          return false
        } */
    // 这里也会影响性能2022-05-13暂时屏掉
    // await ht.execUpdateState([newNode])
    // 这里也会影响性能，改为只更新节点
    //更新布局节点2022-05-13
    let widget = ht.getWidgetByKey(['formItem', 'column'].includes(node.nodeType) ? `${node.key}_formItem` : node.key)
    if (!widget) {
      console.log('组件缺少widget，导致不能实时更新属性', node)
    }
    if (widget && widget.refreshState) {
      widget.refreshState({ domnode: { ...node } })
    } else {
      console.log('组件缺少refreshState方法，导致不能实时更新属性', widget, node)
    }
    //更新树节点名称2022-05-13
    if (!isChildChange && ht.wxlcd.domTree) {
      //console.log('只更新树显示')
      ht.wxlcd.domTree.updateNode(node)
      const selectedNode = ht.wxlcd.designer.state.selectedNode
      if (selectedNode) {
        const selectedKey = selectedNode.key
        if (selectedKey === node.key) {
          // 如果当前有选中节点
          // 并且要更新的节点就是选中节点
          // 需要重新设置一下选中
          // 持右侧属性面板的widgetProps中获取的widget对象是最新
          ht.wxlcd.designer.updateSelectNode(node)
        } else if (node.children && node.children.length > 0) {
          // 拖拽改变节点尺寸后更新的是parentNode
          // 所以也要判断一下如果当前选中的ui节点在node.children
          // 也需要更新一下
          const index = node.children.findIndex(ch => ch.key === selectedKey)
          if (index !== -1) {
            ht.wxlcd.designer.updateSelectNode(node.children[index])
          }
        }
      }
      if (refreshParent) {
        const parentNode = ht.getNodeByKey(node.parentKey)
        ht.refreshUIData(parentNode)
      }
    } else {
      // 暂时,要是能局部刷新就不用了
      //console.log('重新加在树')
      ht.loadData(ht.getItem('treeData'))
      ht.refreshUIData(ht.getNodeByKey('root'))
    }
    //本地缓存
    setTimeout(() => {
      //开发缓存本地结构方便使用
      localStorage.setItem('lclDomTree', JSON.stringify(ht.getItem('treeData')))
    }, 1000)
  },
  refreshUIData (node) {
    if (!node) {
      return false
    }
    setTimeout(() => {
      const el = ht.getElementByKey(node.key)
      if (el) {
        el.refreshUIdata(node)
      } else {
        console.log('解析引擎未缓存，导致不能实时渲染', node)
      }
    }, 5)
  },

  //记录容器大小
  updateGridSize (nodeKey, newNode, focused = false) {
    if (!nodeKey) {
      return
    }
    const oldNode = ht.getNodeByKey(nodeKey)
    if (!oldNode) {
      return
    }
    const { marginleft = 0, margintop = 0, marginright = 0, marginbottom = 0 } = oldNode.props || {}
    let marginconfig = oldNode.props?.marginconfig || {}
    let paddingFull = marginconfig.paddingFull || {}
    let { paddingleft = 0, paddingright = 0, paddingtop = 0, paddingbottom = 0 } = paddingFull
    // 以下兼容 原有的 查询区的padding值
    if (oldNode.props?.paddingleft && Object.keys(paddingFull).length == 0) {
      paddingleft = oldNode.props?.paddingleft
    }
    if (oldNode.props?.paddingright && Object.keys(paddingFull).length == 0) {
      paddingright = oldNode.props?.paddingright
    }
    /*
    const offW = marginleft + marginright + paddingleft + paddingright + 4
    const offH = margintop + marginbottom + paddingtop + paddingbottom + 2
*/
    const offW = marginleft + marginright + paddingleft + paddingright
    const offH = margintop + marginbottom + paddingtop + paddingbottom

    const timeId = setTimeout(() => {
      let size = ht.getRectByKey(nodeKey)
      if (size) {
        if (size.width - offW === oldNode.GridW && !focused) {
          return false
        }
        // 预留出滚动条空间
        // let node = { key: nodeKey, GridW: size.width - 2, GridH: size.height }
        // 要加上外边距
        let node = { key: nodeKey, GridW: size.width - offW, GridH: size.height - offH }
        console.log(offW, offH, '........................')
        //如果没有newNode为什么要更新？
        if (newNode) {
          node.w = newNode.w
          node.h = newNode.h

          if (newNode.GridH) {
            node.GridH = newNode.GridH
          }

          if (newNode.GridX) node.GridX = newNode.GridX
          if (newNode.GridY) node.GridY = newNode.GridY
        } else {
          //为什么要重新计算高度，忘记了？应该是节点自适应高度时用的
          //console.log(oldNode, 'updateGridSize调整容器大小，为什么没有新节点')
          const parentNode = ht.getParentNodeByKey(nodeKey)
          if (parentNode) {
            node.h = Math.round((size.height + 0.1 * (parentNode.rowHeight || 10)) / ((parentNode.rowHeight || 10) + 1))
          }

        }
        // ht.updateNode({ key: nodeKey, GridW: Math.ceil(size.width) - 17, GridH: Math.ceil(size.height) })
        ht.updateNode(node)
      }
      clearTimeout(timeId)
    }, 5)
  },
  //自动排序
  async setFlexDragact (layouts) {

    let x = 0
    let y = 0
    let lastH = 0
    layouts.map((item, idx) => {
      const { GridX, w, h, hide } = item
      lastH = h
      if (!hide) {
        if (x + w > 24) {
          x = 0
          y = y + h
        }
        item.GridX = x
        item.GridY = y
        x = x + w
      }
    })
    return y + lastH
  },
  //调整子元素顺序，多用于表格设计.
  async setChildrenOrder ({ key, children, repaint = false, flowX }) {
    const node = ht.getNodeByKey(key)
    if (!node) {
      return
    }
    //
    let newList = []
    const cacheChildren = JSON.parse(JSON.stringify(node.children))
    children.forEach((item, idx) => {
      const { key: tmpKey, hide } = item
      const ipos = cacheChildren.findIndex(nd => nd.key === tmpKey)
      if (ipos >= 0) {
        const cnode = cacheChildren[ipos]
        if (repaint) {
          cnode.hide = hide
        }
        newList.push(cnode)
        cacheChildren.splice(ipos, 1)
      }

    })
    let layouts = [...newList, ...cacheChildren]
    let newNodeH = node.h
    let bRefreshParent = false
    if (flowX) {
      newNodeH = await ht.setFlexDragact(layouts)
    }

    node.children = [...layouts]
    //重绘
    if (repaint) {
      if (node.h !== newNodeH) {
        node.h = newNodeH
        bRefreshParent = true
      }

      ht.refreshUIData(node)
      if (bRefreshParent) {
        setTimeout(() => {
          const parentNode = ht.getNodeByKey(node.parentKey)
          ht.refreshUIData(parentNode)
        }, 5)
      }
    }

  },
  // 根据宽度变化比例更新宽
  async updateGridWidthByRate (nodeKey, toWidth) {

    //console.log(nodeKey, toWidth, 'updateGridWidthByRate')
    let node = ht.getNodeByKey(nodeKey)
    if (!toWidth) {
      const rct = ht.getRectByKey(nodeKey)
      toWidth = parseInt(rct.width)
    }


    node.GridW = toWidth
    //最外层不动要计算比率，只有从当前组件开始才算
    const transWidth = async (nodes, GridW, withRate = true) => {
      nodes.forEach(nd => {
        nd.locked = 0
        //if (!['formItem', 'leafItem'].includes(node.nodeType)) {

        const { marginleft = 0, margintop = 0, marginright = 0, marginbottom = 0, paddingleft = 0, paddingright = 0, paddingtop = 0, paddingbottom = 0 } = nd.props || {}
        let offW = marginleft + marginright + paddingleft + paddingright
        let offH = margintop + marginbottom + paddingtop + paddingbottom
        if (nd.name === 'LCDCard' && nd.parentName === 'LCDTabs') {
          offW = 0
          offH = 0
        }
        let rate = 1
        if (withRate) {
          rate = (nd.w || 24) / 24
        }
        nd.GridW = parseInt(rate * GridW) - offW
        console.log(nd.name, nd.GridW, nd.w, '重新计算高宽')
        if (nd.children && nd.children.length) {
          transWidth(nd.children, nd.GridW - offW, true)
        }

        //}
      })
    }

    await transWidth([node], toWidth, false)


    if (nodeKey === 'root') {
      ht.loadData([node])
    }
    //ht.refreshUIData(ht.getNodeByKey('root'))
    //ht.updateNode(node)
  },
  // 更新子结点状态
  async execUpdateState (nodes) {
    nodes.forEach(node => {
      const widget = ht.getWidgetByKey(node.key)
      if (widget && widget.refreshState) {
        widget.refreshState(node)
      }
      const cNode = ht.getNodeByKey(node.key)
      if (cNode && cNode.children && cNode.children.length) {
        ht.execUpdateState(cNode.children)
      }
    })
  },

  // 根据节点key更新节点的单个属性 12.5增加 通过divCode修改属性 参考getNodeByCode
  async updateNodeProp ({ key, divCode, prop, value, isProps = false }) {
    //console.log('updateNodeProp',{ key, divCode, prop, value, isProps })
    let nodeKey = ""
    if (!key && divCode) {
      const divCodeToKey = ht.getItem('divCodeToKey')
      nodeKey = divCodeToKey[divCode]
      if (!nodeKey) {
        console.log(`容器编码${divCode}不存在,请排查！`)
        return
      } else {
        key = nodeKey
      }
    }

    if (value === undefined) {
      return false
    }

    let node = ht.getNodeByKey(key)
    if (!node) {
      return false
    }
    const formNode = ht.getNodeByKey(node.parentKey)
    //递归子节点
    const updateChildrenProp = (data) => {
      const cProp = { disabled: 'parentDisabled' }[prop] || prop
      data.forEach(item => {
        if (isProps) {
          if (!item[cProp]) {
            item.props = {}
          }
          item.props[cProp] = value
        } else {
          item[cProp] = value
        }

        if (item.children) {
          updateChildrenProp(item.children)
        }
      })
    }
    //整体禁用，需要递归处理，添加parentDisabled控制
    if (prop === 'disabled' && node.children) {
      updateChildrenProp(node.children)
      ht.refreshUIData(formNode)
      return false
    }
    // 如果是更新值
    if (prop === 'value') {
      if (formNode) {
        let values = {}
        values[node.dataField] = value
        ht.updateEntyValues(formNode.key, values)
      }
      //node上记忆会不会有问题？2022-08-08
      node.value = value

      //return false
    }
    ////////////

    if (isProps) {
      if (!node.props) {
        node.props = {}
      }
      if (node.props[prop] === value) {
        return false
      }
      node.props[prop] = value
    } else {
      node[prop] = value
    }
    ht.refreshUIData(formNode)
    // 设计期才需要刷新
    if (!node.locked && isProps) {
      // ht.loadData(ht.wxlcd.treeData)
      const selectedNode = ht.wxlcd.designer.state.selectedNode
      if (selectedNode) {
        const selectedKey = selectedNode.key
        if (selectedKey === node.key) {
          // 如果当前更新的是选中节点的属性
          // 同步一下右侧表单
          const propsForm = ht.wxlcd.refs.propsForm
          if (propsForm && propsForm.current) {
            const fieldInstance = propsForm.current.getFieldInstance(prop)
            // 如果当前修改的属性在右侧属性面板上有组件，也需要同步
            // 目前只对一些组件进行处理，其他的还需要测试
            if (fieldInstance) {
              if (fieldInstance.props && fieldInstance.props.domnode) {
                const { name } = fieldInstance.props.domnode
                if (name === 'YDFCheckbox') {
                  // 如果是YDFCheckbox，直接调用onchange方法，便于向上触发事件
                  fieldInstance.onChange(value)
                  return;
                } else if (name === 'YDFInput') {
                  // 如果是YDFCheckbox，直接调用afterChange方法，便于向上触发事件
                  fieldInstance.afterChange(value)
                  return;
                } else if (name === 'YDFColorPicker') {
                  fieldInstance.setSubtitleFontColor({
                    hex: value
                  })
                  return;
                } else if (name === 'YDFRadio') {
                  fieldInstance.handleOnChange({
                    target: {
                      value
                    }
                  })
                  return;
                }
              }

              propsForm.current.setFieldsValue({
                [prop]: value
              })
            }
          }
        }
      }
    }

  },
  // 复制uidata
  clone (node) {
    const cloneNode = JSON.parse(JSON.stringify(node))
    const refreshKey = (data) => {
      data.forEach((item, idx) => {
        item.key = guid()
        if (item.children) {
          refreshKey(item.children)
        }
      })
    }
    refreshKey([cloneNode])
    return cloneNode
  },
  // 插入节点,hasChild=false是否有子节点
  async insertAtNode (node, atNode, asSon = true, position = { x: 0, y: 0 }, hasChild = false, changeKey = true) {
    if (!node.name) {
      console.log('组件缺少名称', node)
      return false
    }
    //这里要深拷贝一份，否则会出现key重复
    node = JSON.parse(JSON.stringify(node))
    //支持页面组件复制做为模板
    if (node.name.substring(0, 4) === 'root') {
      const rootNode = ht.clone(node)
      // 应该重新刷一下key
      rootNode.key = 'root'
      ht.loadData([rootNode])
      ht.refreshUIData(rootNode)
      return false
    }

    if (atNode.name === 'LCDTabs') {
      node.GridX = 0
      node.GridY = 0
      node.w = 24
      node.GridW = atNode.GridW
      if (node.name === 'LCDCard') {
        node.props = { bordered: 0, show_label: 0, marginbottom: 0, marginleft: 0, marginright: 0, margintop: 0 }
      }
    }
    //标识父组件名，方便后期判断
    node.parentName = atNode.name || ''
    if (asSon && atNode.childSize) {
      if (!node.props) {
        node.props = { size: atNode.childSize }
      } else if (!node.props.size) {
        node.props.size = atNode.childSize
      }
    }

    let idx = 0
    if (!atNode.children || !atNode.children.length) {
      node.GridX = 0
      node.GridY = 0
    } else {
      const { cols = 3, GridW } = atNode
      const defaultColWidth = 24 / cols

      const { x, y } = position
      if (x > 15 || y > 15) {
        const defaultWidth = GridW / cols
        const pRect = ht.getRectByKey(atNode.key)
        const newGridX = (Math.ceil((x - pRect.x) / defaultWidth) - 1) * (24 / cols)

        node.GridX = newGridX
        node.GridY = 0
        let posY = 0
        if (atNode.children) {

          for (let i = 0, len = atNode.children.length; i < len; i++) {
            const { GridX, GridY, w, h, key } = atNode.children[i];
            idx = i
            if (GridX === 0) {
              const rect = ht.getRectByKey(key)
              if (posY < y && rect.top + rect.height > y) {
                node.GridY = GridY + (newGridX + (24 / cols) > 24 ? h : 0)
                idx = idx + 1
                if (GridX + w <= newGridX && newGridX + defaultColWidth === 24) {
                  idx = idx + 1
                }
                break;
              }
              posY = rect.top + rect.height
              node.GridY = GridY + h
            }
          }

        }
      } else {
        idx = atNode.children.length
        const { GridX, GridY, w, h } = atNode.children[idx - 1]
        if (GridX + w + defaultColWidth <= 24) {
          node.GridX = GridX + w
          node.GridY = GridY
        } else {
          node.GridX = 0
          node.GridY = GridY + (node.h || 1)
        }
        if (w === 24) {
          node.GridX = 0
        }
      }
    }
    if (node.name === 'LCDToolbar') {
      node.GridY = 0
      node.GridX = 0
      node.w = 24
    }
    // 允许表格添加组件做为可编辑列
    if (['formItem'].includes(node.nodeType) && !node.dataField) {
      node.dataField = `field_${guid()}`
    }
    // if (atNode.nodeType === 'table' && ['formItem', 'leafItem'].includes(node.nodeType)) {
    //   node.nodeType === 'column'
    //   node.name = node.name || 'column'
    //   if (!node.dataField) {
    //     node.dataField = `field_${guid()}`
    //   }
    // }

    //如果是LCDBtnToolbar，且atNode是表格
    if (atNode.nodeType === 'table' && ['LCDBtnToolbar'].includes(node.name)) {
      node.position = 'table'
    }
    if (!hasChild && !node.children && atNode.name !== 'LCDTabs' && changeKey) {
      node = await this.setBusWidgetConfig(node)
    }
    // 新插入的是否都要刷KEY?

    if (!node.key) {
      node.key = guid()
    }
    // 初始化
    if (asSon && node.w === 24) {
      node.GridW = atNode.GridW - 2
    }
    if (node && atNode && asSon) {
      node.parentKey = atNode.key
    }
    // debugger

    await ht.wxlcd.domTree.insertAtNode(node, atNode, asSon, idx, changeKey)

    ht.refreshUIData(atNode)
    // 缓存页面
    ht.setUIDataHistory(ht.wxlcd.treeData)
  },
  //业务组件默认配置
  async setBusWidgetConfig (node) {
    if (node.name === 'LCDDragWidthLayout') {
      node.children = [
        { key: guid(), name: 'LCDDragact', label: '分割面板一', nodeType: 'dragact', rowHeight: 20, GridX: 0, w: 24, h: 5, autoHeight: false, showDel: false, showMove: false, showResize: false },
        { key: guid(), name: 'LCDDragact', label: '分割面板二', nodeType: 'dragact', rowHeight: 20, GridX: 0, w: 24, h: 5, autoHeight: false, showDel: false, showMove: false, showResize: false }
      ]
    } else if (node.name === 'LCDCard') {
      node.children = [
        { key: guid(), name: 'LCDPanel', label: '面板', nodeType: 'form', dataType: 'enty', rowHeight: 20, GridX: 0, GridY: 0, w: 24, h: 5, flowX: true, autoHeight: false, showDel: true, showMove: true, parentName: node.name, used: ['card'] },
      ]
    } else if (node.name === 'LCDSpliterLayout') {
      node.children = [
        { key: guid(), name: 'LCDLayoutSider', label: '侧边栏', nodeType: 'dragact', rowHeight: 20, GridX: 0, GridY: 0, w: 24, h: 5, autoHeight: false, showDel: false, showMove: false, showResize: false, parentName: node.name, parentNodeType: ['spliter'], props: { marginleft: 0, marginright: 0, margintop: 0, marginbottom: 0 } },
        { key: guid(), name: 'LCDLayoutContent', label: '内容栏', nodeType: 'dragact', rowHeight: 20, GridX: 0, GridY: 0, w: 24, h: 5, autoHeight: false, showDel: false, showMove: false, showResize: false, parentName: node.name, parentNodeType: ['spliter'], props: { marginleft: 0, marginright: 0, margintop: 0, marginbottom: 0 } }
      ]
    } else if (node.name === 'LCDTabs') {
      node.children = [
        { key: guid(), name: 'LCDBtnToolbar', label: '按钮工具栏', icon: 'Toolbar', nodeType: 'toolbar', parseChild: 0, fixedHeight: 1, GridX: 0, GridY: 0, rowHeight: 20, defaultHeight: 1, cols: 24, position: 'top', h: 2.4, GridH: 48, flowX: 'right', parentNodeType: ['tabs'], props: { body_color: 'transparent', borderRadius: { radiusFull: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 } } } }
      ]
    } /* else if (node.name === 'LCDList') {
      if (!node.children) {
        node.children = []
      }
      node.children.push({ key: guid(), name: 'LCDToolbar', label: '工具条', nodeType: 'form', rowHeight: 10, GridX: 0, GridW: 200, w: 24, h: 3, flowX: false, autoHeight: false, showDel: false, showMove: false })
    } */
    return node
  },
  // 删除节点
  deleteNode (node) {
    console.log('删除结点', node)
    // 如果是根节点清空
    if (node.name === 'root') {
      ht.wxlcd.treeData[0].children = []
      ht.wxlcd.domTree.loadData(ht.wxlcd.treeData)
      ht.getElementByKey('root').refreshUIdata(ht.wxlcd.treeData[0])
      return false
    }
    // 根结点只能有一个
    if (!node.parentKey) {
      const idx = ht.wxlcd.treeData.findIndex(item => item.key === node.key)
      if (idx >= 0) {
        ht.wxlcd.treeData.splice(idx, 1)
        ht.wxlcd.domTree.loadData(ht.wxlcd.treeData)
        return
      }
    }

    const parentNode = ht.getNodeByKey(node.parentKey)
    const idx = parentNode.children.findIndex(item => item.key === node.key)
    if (idx >= 0) {
      parentNode.children.splice(idx, 1);
      ht.wxlcd.domTree.loadData(ht.wxlcd.treeData)
    }

    //刷新
    ht.refreshUIData(parentNode)
    /*2022-06-07 不应该是更新组件内部，应该是重新渲染  */
    //更新组件
    const widget = ht.getWidgetByKey(parentNode.key)

    if (!widget) {
      console.log('组件缺少widget，导致不能实时更新属性', parentNode)
    }
    if (widget && widget.refreshState) {
      widget.refreshState({ domnode: { ...parentNode } })
    } else {
      console.log('组件缺少refreshState方法，导致不能实时更新属性', widget, parentNode)
    }

    //缓存
    ht.setUIDataHistory(ht.wxlcd.treeData)
  },

  // 根据key取节点
  getNodeByCode (divCode) {
    const divCodeToKey = ht.getItem(divCodeToKey)
    const nodeKey = divCodeToKey[divCode]
    if (!nodeKey) {
      console.log(`容器编码${divCode}不存在！`)
      return
    }
    return ht.getNodeByKey(nodeKey)
  },
  getNodeByKey (nodeKey) {
    return ht.wxlcd.flatTree[nodeKey]
  },
  //根据uri.field取对象
  async getNodeByUriField (uriField) {
    const treeData = ht.getTreeData()
    let curNode

    const findEnty = async (data) => {
      for (let i = 0, len = data.length; i < len; i++) {
        if (curNode) {
          break
        }
        const item = data[i]
        const { name, dataType, enty, refer, biztype, children } = item

        if (dataType === 'enty' && enty && enty.info && name !== 'root') {
          const { name, uri } = enty.info
          //字段
          if (children && children.length > 0) {
            const ipos = children.findIndex(node => uriField === `${uri}.${node.dataField}`)
            curNode = children[ipos]
          }
        } else {
          if (children && children.length > 0) {
            findEnty(children)
          }
        }

      }
    }
    await findEnty(treeData)
    return curNode
  },
  //根据key取父dom对象
  getParentNodeByKey (nodeKey) {
    const node = ht.getNodeByKey(nodeKey)
    if (!node) {
      return null
    }
    return ht.getNodeByKey(node.parentKey)
  },
  //根据表单key和字段名取节点
  getNodeByDataField (formKey, dataField) {
    const form = ht.getNodeByKey(formKey)
    if (!form) {
      console.log('根据字段名取对象失败，父组件ID不正确')
      return null
    }
    const idx = form.children.findIndex(item => item.dataField === dataField)
    if (idx >= 0) {
      return form.children[idx]
    }
    return null
  },
  //取节点rect
  getRectByKey (nodeKey) {
    if (!nodeKey) {
      return null
    }
    const uDom = u(`.wx-${nodeKey}`)
    if (!uDom.length) {
      return null
    }

    let size = uDom.size()

    const { x, y, width, height, left, right, top, bottom, clientWidth, clientHeight } = size
    return { x, y, width, height, left, right, top, bottom, clientWidth, clientHeight }
  },
  //表单取值
  getValueByKey (nodeKey) {
    const node = ht.getNodeByKey(nodeKey)
    if (!node) {
      return ''
    }

    const { parentKey, dataField, nodeType } = node
    if (nodeType === 'formItem') {
      if (!ht.wxlcd.entyValues[parentKey]) {
        return ''
      }
      return ht.wxlcd.entyValues[parentKey].data[dataField]
    } else {
      const entyValues = ht.wxlcd.entyValues[nodeKey]
      return entyValues ? entyValues.data : []
    }

  },
  // 调整操作按钮
  setHandlePosition (item) {
    const size = ht.getRectByKey(item.key)
    const fatherSize = ht.getRectByKey(item.parentKey)
    if (!fatherSize) {
      return false
    }
    const uDom = u(`.wx-${item.key} .layout-item-handle`);
    uDom.removeClass('vertical')
    let style = 'left:0px;top:-25px;'
    //顶部有遮盖
    if (size.y < fatherSize.y + 50) {
      //能左边
      if (size.x > fatherSize.x + 25) {
        uDom.addClass('vertical')
        style = 'top:-1px;left:-24px;right:100%;'
      } else if (fatherSize.right > size.right + 24) {
        //能右边
        uDom.addClass('vertical')
        style = 'top:-1px;left:100%;right:-24px;'
      } else {//放内部
        style = 'top:0px;left:0px;'
      }
    }
    uDom.attr('style', style)
  },
  // 存组件对象全局使用
  storeRef (ref, key) {

    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    if (!ht.wxlcd.refs) {
      ht.wxlcd.refs = {}
    }
    ht.wxlcd.refs[`${key}`] = ref
  },
  getWidgetByKey (key) {
    const widget = ht.wxlcd.refs[`${key}`]
    // console.log(ht.wxlcd.refs, '所有对象')
    return widget ? widget.current : null
  },
  // 2022-8-5 yanxyd 参考自getNodeByCode
  getWidgetByCode (code) {
    const divCodeToKey = ht.getItem('divCodeToKey')
    const nodeKey = divCodeToKey[code]
    if (!nodeKey) {
      console.log(`容器编码${code}不存在！`)
      return
    }
    const widget = ht.wxlcd.refs[`${nodeKey}`]
    return widget ? widget.current : null
  },
  storeElement (key, el) {
    if (!ht.wxlcd) {
      ht.wxlcd = {}
    }
    if (!ht.wxlcd.els) {
      ht.wxlcd.els = {}
    }
    if (el) {
      ht.wxlcd.els[`${key}`] = el
    } else {
      delete ht.wxlcd.els[`${key}`]
    }
  },
  getElementByKey (key) {
    const el = ht.wxlcd.els[`${key}`]
    return el ? el : null
  },
  /////////////////////////////
  //执行单个代入,一般是表单
  changeDomValuesSingleForm (widget, values) {
    // 只有填报时代入
    if (!widget.enty || !widget.locked) {
      return false
    }
    //初始化数据对象
    if (widget.children && widget.children.length) {
      const entyValues = {}
      widget.children.forEach(item => {
        const { dataField, value = '' } = item
        entyValues[dataField] = value
      })
      ht.updateEntyValues(widget.key, entyValues)
    }
    if (!widget.enty.replaceItems && !widget.enty.fieldNames) {
      return false
    }
    let displayName = getDisplayValue(widget, values);
    // 如果有配置显示字段或业务显示字段
    // 需要将显示字段或业务显示字段中配置代入到当前字段的.displayname
    if (displayName !== null) {
      const parentFormKey = widget.parentKey
      const displayFieldName = `${widget.dataField}.displayname`
      const newdisplayValue = `${widget.dataField}_displayValue`
      let changedValues = {}
      changedValues[displayFieldName] = displayName
      changedValues[newdisplayValue] = displayName
      ht.updateEntyValues(parentFormKey, changedValues)
      //更新显示
      const ref = ht.getWidgetByKey(widget.key)
      if (ref && ref.update) {
        ref.update({ displayValue: displayName })
      }
    }
    if (widget.enty.replaceItems && widget.enty.replaceItems.length) {
      widget.enty.replaceItems.forEach(item => {

        const { from, to } = item
        if (Object.keys(from).length && Object.keys(to).length) {
          function getProp (obj = {}, _field) {
            if (_field in obj) {
              return obj[_field]
            }
            return null
          }
          let replaceVal = null;
          if (!Array.isArray(values)) {
            replaceVal = getProp(values, from.fieldname)
          } else if (values.length > 0) {
            replaceVal = values.map(item => getProp(item, from.fieldname)).join(',')
          }
          //存部分数据，主要是带入数据,根据实体key
          let changedValues = {}
          changedValues[to.fieldname] = replaceVal
          ht.updateEntyValues(to.toFormKey, changedValues)
          //
          // ht.updateNodeProp({ key: toKey, props: 'value', value: replaceVal })
          //let node = ht.getNodeByDataField(to.toFormKey, to.fieldname)
          const field = to.fieldname.replace('.displayname', '')
          let node = ht.getNodeByDataField(to.toFormKey, field)
          // 有些代入信息并不存在，是不是有个地方存放？
          if (!node) {
            return false
          }
          // 数据先存上，对一些不需要渲染的对象有用

          node.value = replaceVal

          //对需要渲染的数据通过ref更新值
          const ref = ht.getWidgetByKey(node.key)
          //console.log(ref, ref.current, '参照对象', replaceVal)
          if (ref && ref.update) {
            if (to.fieldname.indexOf('.displayname') >= 0) {
              ref.update({ displayValue: replaceVal })
            } else {
              ref.update({ value: replaceVal })
            }
          } else {
            console.log(`${to}所用组件缺少update方法，代入失败`, node)
          }

        }
      })
    }


  },
  //执行多行代入，一般是表格用
  changeDomValuesTableRows (widget, newValues) {
    const updateRow = (values, idx) => {
      // 只有填报时代入
      if (!widget.enty || !widget.locked) {
        return false
      }
      if (!widget.enty.replaceItems && !widget.enty.fieldNames) {
        return false
      }
      //可能会多表代入吗？
      let tableKeys = {}

      let changedValues = {}
      // 需要将显示字段或业务显示字段中配置代入到当前字段的.displayname
      if (widget.dataField) {
        let displayValue = getDisplayValue(widget, values);
        if (displayValue !== null) {
          const displayFieldName = `${widget.dataField}.displayname`
          changedValues[displayFieldName] = displayValue
        }
      }
      widget.enty.replaceItems.forEach(item => {
        const { from, to } = item

        if (Object.keys(from).length && Object.keys(to).length) {
          const replaceVal = values[from.fieldname] || ''
          //存部分数据，主要是带入数据,根据实体key
          if (!tableKeys[to.toFormKey]) {
            tableKeys[to.toFormKey] = {}
            tableKeys[to.toFormKey].row = { ...changedValues }
            tableKeys[to.toFormKey].cols = []
          }
          //console.log(to.fieldname, replaceVal, values, '22222222222222222', '开始代入')
          // 这里应该有displayName的代入
          tableKeys[to.toFormKey].row[to.fieldname] = replaceVal
          if (to.fieldname.indexOf('.displayname') === -1) {
            tableKeys[to.toFormKey].cols.push(to.fieldname)
          }
        }
      })

      //
      console.log(tableKeys, '要代入表格的数据')
      for (let tableKey in tableKeys) {
        if (!ht.wxlcd.entyValues[tableKey]) {
          continue
        }
        let { data: entyValues, nodeType } = ht.wxlcd.entyValues[tableKey]
        //////////////////

        if (nodeType === 'table') {
          const { row, cols } = tableKeys[tableKey]
          // 根据代入关系查找是否已经存在了
          const ifind = entyValues.findIndex(rw => {
            for (let i = 0, len = cols.length; i < len; i++) {
              const field = cols[i]
              // 避免某些字段代入值为null经后端存后为''，导致对比失败
              if (rw[field] !== row[field]
                && !(rw[field] === null && row[field] === '')) {
                return false
              }
            }
            return true
          })
          if (ifind === -1) {
            if (row.id === undefined) {
              row.id = guid()
            }
            entyValues.push(row)
          } else {
            const oldRow = entyValues[ifind]
            entyValues[ifind] = { ...oldRow, ...row }
          }

          ht.wxlcd.entyValues[tableKey].data = entyValues
          //这里要loadData吧，表格啊
          console.log(ht.wxlcd.entyValues, '代入的字段信息对不对啊')
          const tableWidget = ht.getWidgetByKey(tableKey)
          if (tableWidget && tableWidget.loadData) {
            tableWidget.loadData(entyValues)
          } else {
            console.log('未找到表格对象', tableKey)
          }
        }
        ////////
      }

    }
    newValues.forEach((values, idx) => {
      updateRow(values, idx)
    })
  },
  // 取代入对象2022-07-29
  async getReplaceToNodeType (widget) {
    if (!widget.enty || !widget.enty.replaceItems || widget.enty.replaceItems.length < 1) {
      return false
    }
    let nodeTypes = {}
    await widget.enty.replaceItems.forEach(item => {
      const { toFormKey } = item.to
      const node = ht.getNodeByKey(toFormKey)
      if (node) {
        nodeTypes[toFormKey] = node.nodeType
      }

    })
    return nodeTypes
  },
  // 改变值，执行代入,通过newValues为空，清空组件值
  async changeDomValues (widget, newValues) {

    // 这里还是判断一下是不是代入表格比较好
    const nodeTypes = await ht.getReplaceToNodeType(widget)
    ///执行多行代入关系,一般是表格用，根据代入字段判断去重
    if (newValues && Array.isArray(newValues)) {
      if (!nodeTypes) {//如果没有代入，直接改变值就行
        ht.changeDomValuesSingleForm(widget, newValues || [])
        return false
      }
      for (let key in nodeTypes) {
        if (nodeTypes[key] === 'table') {
          ht.changeDomValuesTableRows(widget, newValues ? newValues : [])
        } else {
          ht.changeDomValuesSingleForm(widget, newValues || [])
        }
      }
    }
    //执行单个代入关系
    else {
      if (!nodeTypes) {
        ht.changeDomValuesSingleForm(widget, newValues || {})
        return false
      }
      for (let key in nodeTypes) {
        if (nodeTypes[key] === 'table') {
          ht.changeDomValuesTableRows(widget, newValues ? [newValues] : [])
        } else {
          ht.changeDomValuesSingleForm(widget, newValues || {})
        }
      }
    }
  },

  //////////////////
  clearDomValues ({ key, index }) {
    console.log(key, index, '清除数据....')
    const clearFormVal = (nodes) => {
      let formValues = {}
      nodes.forEach(node => {

        const { dataField, key: nodeKey, nodeType, enty, name, defaultValue } = node

        if (dataField) {
          let value = ''
          //金额框默认
          if (name === 'YDFIntputNumber') {
            value = 0
            if (!defaultValue) {
              defaultValue = 0
            }
          }

          if (defaultValue !== undefined) {
            value = defaultValue
          }

          let widgetValues = { value }
          if (['YDFSelect', 'YDFTreeModalSelect', 'YDFTableModalSelect', 'YDFTreeSelect'].indexOf(name) !== -1) {
            widgetValues['displayValue'] = '' //需要清空显示名称
          }
          formValues[dataField] = value

          //字段有参照
          if (enty && enty.replaceItems) {
            widgetValues.displayValue = ''
            enty.replaceItems.forEach(item => {
              if (Object.keys(item.to).length) {
                formValues[item.to.fieldname] = ''
              }
            })
          }

          //有默认值的时候要重新更新一次默认值
          if (defaultValue || defaultValue === 0) {

            if (typeof (defaultValue) === 'object') {
              for (let defKey in defaultValue) {
                if (defKey === 'id') {
                  formValues[dataField] = defaultValue.id
                } else if (defKey !== 'displayValue') {
                  formValues[defKey] = defaultValue[defKey]
                }
              }
            } else {
              formValues[dataField] = defaultValue
            }
          }
          widgetValues.referValue = formValues
          const widget = ht.getWidgetByKey(nodeKey)
          if (widget && widget.update) {
            widget.update(widgetValues)
          }
        }

      })
      //单个调用会激活吧？
      // ht.updateEntyValues(formKey, formValues)
    }

    //取空表格行值
    let node = ht.getNodeByKey(key)
    // 如果是表格
    if (node.nodeType === 'column') {
      const parentFormKey = node.parentKey

      let changedValues = {}
      changedValues[node.dataField] = ['YDFSwitch', 'YDFIntputNumber'].includes(node.name) ? 0 : ''
      //需要将fieldNames中配置代入到当前字段的.displayname
      if (node.enty) {
        if (node.dataField) {
          const displayFieldArr = getDisplayFields(node)
          if (displayFieldArr.length) { // 如果组件设置了显示字段，也需要清除
            const displayFieldName = `${node.dataField}.displayname`
            changedValues[displayFieldName] = ''
          }
        }
        //清空代入关系
        node.enty.replaceItems.forEach(item => {
          const { from, to } = item

          if (Object.keys(from).length && Object.keys(to).length) {
            //   const replaceVal = values[from.fieldname] || ''
            if (to.toFormKey === parentFormKey) {
              changedValues[to.fieldname] = ''
            }
          }
        })
      }
      const tableData = ht.getEntyValues()[parentFormKey]['data'] || []

      if (tableData.length > index) {
        tableData[index] = { ...tableData[index], ...changedValues }
      }
      const tableWidget = ht.getWidgetByKey(parentFormKey)
      if (tableWidget && tableWidget.loadData) {
        tableWidget.loadData(tableData)
      } else {
        console.log('未找到表格对象', parentFormKey)
      }
      return false
    }
    // 这里先处理表单的，应该根据node来判断一下，加上处理表格的
    if (node.children) {
      const nodes = node.children
      clearFormVal(nodes)
    } else {
      clearFormVal([node])
    }

  },
  /////////////////////
  // 单据的可编辑状态
  setBillEditable (editable) {
    if (editable === 0) {
      ht.editMod = 'view'
    }

    const flatTreeNodes = ht.getItem('flatTree')
    //console.log(flatTreeNodes, '所有对象')
    for (let key in flatTreeNodes) {
      //console.log(key, flatTreeNodes[key], '设置显隐藏')
      setTimeout(() => {
        ht.setEditable(key, editable)
      }, 0)
    }
  },
  //组件是否可编辑
  setEditable (key, editable = 1) {
    //更新UI数据的可编辑属性
    const node = ht.getNodeByKey(key)
    if (!node || node.name === 'LCDQueryString' || node.parentName === 'LCDQueryString') {
      return false
    }
    /*暂时先不考虑，可能会将模板初始设置给改掉
    const node = ht.getNodeByKey(key)

    if(node){
      if(!node.props){
        node.props={}
      }
      //对于本身
      node.props['readOnly']=editable?0:1
      node.props['disabled']=editable?0:1
    }
    */
    const widget = ht.getWidgetByKey(key)
    if (!widget) {
      //console.log('未找到widget,无法改变编辑状态', ht.getNodeByKey(key))
      return false
    }
    if (widget.setEditable) {
      widget.setEditable(editable)
    } else {
      //console.log('未找到setEditable', ht.getNodeByKey(key))
    }
  },
  // 查询区 输入框 回车事件
  onInputEnter (key, onenter = 1) {
    const widget = ht.getWidgetByKey(key)
    if (!widget) {
      return false
    }
    if (widget.onInputEnter) {
      widget.onInputEnter(onenter)
    } else {
      console.log('onInputEnter', ht.getNodeByKey(key), "此组件不存在输入框回车事件")
    }
  },
  showNode (key, show) {

    // const dom = u(`#wx-${key}`)
    // if (dom) {
    //   dom[show ? 'removeClass' : 'addClass']('hide')
    // }
    //更改原数据
    let node = ht.getNodeByKey(key)
    if (node) {
      node.hide = show ? 0 : 1
    }

    ht.updateNodeProp({ key: key, prop: 'hide', value: show ? 0 : 1 })
    const parentnode = ht.getParentNodeByKey(key)
    if (!parentnode) {
      return false
    }
    setTimeout(() => {
      ht.refreshUIData(parentnode)
    }, 0)

    if (show && !['LCDPage', 'YDFStepsNext', 'LCDQueryString', 'LCDBtnToolbar', 'LCDToolbar'].includes(parentnode.name)) {
      setTimeout(() => {
        ht.reloadWidgetData(key, true)
        autoBodyHeight(parentnode, true, ht)
      }, 1)
    }

  },

  scrollToNode (nodeKey) {
    let offsetTop = 0
    const children = ht.getNodeByKey('root').children || []
    const items = children.filter(item => !!item.position)
    items.forEach(it => {
      const { GridY = 0, GridH = 0 } = it
      offsetTop = offsetTop + GridY + GridH
    })

    const sc = ht.getItem('scrollbar')
    const scTop = sc.getScrollTop()
    const uDom = u(`#wx-${nodeKey}.locked`)
    let rect = uDom && uDom.length ? uDom.size() : null

    if (sc && rect) {
      sc.scrollTop(scTop + rect.top - offsetTop)
    }
  },
  //根据操作和状态控制按钮显示或隐藏
  showOrHideBtn (action) {
    const { relationActions = {} } = action || {}
    const billStatus = ht.getEntyValues()['billStatus']
    const actionEL = ht.getItem('actionEL')
    //首先要根据单据状态调整relationActions

    //
    // console.log(billStatus, actionEL, '当前单据状态及所有按钮')

    for (let code in relationActions) {
      ////////////////////////////////////////////
      if (billStatus === 1) {
        relationActions['cancelFlow'] = 1
      }
      if (billStatus > 0) {
        relationActions['modifyBill'] = 0
        relationActions['startFlow'] = 0
      }
      ///////////////////////////////////////////
      const { nodeKey = '' } = actionEL[code] || {}

      if (nodeKey) {
        //这里根据节点的statusflag判断
        const node = ht.getNodeByKey(nodeKey) || {}
        if (node && node.statusflag) {
          //权限标识用“,”分隔
          const nodeStatusList = node.statusflag.split(',')
          relationActions[code] = nodeStatusList.indexOf(billStatus + '') >= 0 ? 1 : 0
        }
        ht.updateNodeProp({ key: nodeKey, prop: 'hide', value: relationActions[code] !== 0 ? 0 : 1 })
      }

    }
  },
  // 将组件调用动作方法提成公共方法,actionName为动作名，actionNode为动作对象
  async prepareAction (argus) {
    console.log(argus, '准备执行动作')
    const { actionName, actionNode, data } = argus
    if (actionNode && actionNode.locked) {
      const { key: actionNodeKey, actions } = actionNode;
      //执行扩展方法
      const res = await ht.execExtraEvent(actionNodeKey, actionName, argus)
      if (!res) {
        console.log('扩展方法阻止了动作')
        return false
      }
      //执行动作
      if (actions && actions[actionName]) {
        ht.doAction({
          actions: actions[actionName],
          actionNodeKey,
          ...argus
        });
      }
    }
  },
  // 执行动作data:如果是表格，表格行数据，enty，如果是表格为表格实体,index:当前行号
  // 2022-8-29 增加actionNodeName，用于表格删除行操作
  async doAction ({ actions, data, enty, event, index, actionName, actionNodeKey, fieldName, actionNodeName }) {
    //初始化时屏蔽掉页面加载外的动作,新单执行动作
    //if (actionName !== 'onMount' && ht.loading) {
    if (['onChange'].includes(actionName) && ht.loading && ht.editMod === 'view') {
      console.log('加载中，事件屏蔽掉', actionName)
      return false
    }
    const waitActions = [...actions]
    let ruleActionList = []
    const exec = async (action) => {
      const { actionType, key, title, nodeKey } = action
      //if (actionType !== 'rule') {
      waitActions.splice(0, 1)
      //}
      //这里执行动作
      // console.log(actionType, key, title, actions, data, enty, index, '执行动作')

      if (actionType === 'bill') {
        if (key === 'refreshPage') {
          return billActions.refreshPage()
        }

        const curData = ht.getActionBillData({ rowData: data, tmpEnty: enty, actionNodeKey })
        const res = await billActions[key](curData, action, ht, event)
        if (!res) {
          return false
        }
        //所有页面动作调用一次刷新，是否排除删除？
        if (['saveBill'].includes(key)) {
          await billActions.refreshPage(null, 'cancelBill')
        }
        ht.showOrHideBtn(action)
      } else if (actionType === 'rule') {
        // 本来设计不支持批量，被改换了，这里先临时支持一下
        //billActions.execRule(waitActions, data, enty, index)
        const curData = ht.getActionBillData({ rowData: data, tmpEnty: enty, index, actionNodeKey, isRule: true })
        await billActions.execRule([action], curData, enty, index, actionNodeKey, actionName)
        //不要批量执行
        //ruleActionList.push(action)
      } else if (actionType === 'flow') {
        await billActions.execFlow(action, data, event, () => {
          billActions.refreshPage(null, 'cancelBill')
          ht.showOrHideBtn(action)
        })

      } else if (actionType === 'dom') {

        const curData = ht.getActionBillData({ rowData: data, tmpEnty: enty, index, actionNodeKey })
        await billActions.ctrlDom({ actions: action.actions, data: curData, event, index, value: data, actionNodeKey, fieldName, actionNodeName })
      } else if (actionType === 'self') {
        const extraJS = ht.getExtraJS()
        console.log(extraJS)
        if (extraJS[key]) {
          await extraJS[key](action, data)
        }
      }
      //递归
      //if (actionType !== 'rule') {
      if (waitActions.length > 0) {
        await exec(waitActions[0])
      }
      //}
    }

    if (waitActions.length) {
      await exec(waitActions[0])
    }
    //规则本来不支持批量，这里要将规则单独出来最后执行
    /*单个规则执行，按顺序
    if (ruleActionList.length) {
      const curData = ht.getActionBillData({ rowData: data, tmpEnty: enty, index, actionNodeKey, isRule: true })
      billActions.execRule(ruleActionList, curData, enty, index)
    }
    */
  },
  ////////////////数据管理//////////////
  // 取实体可编辑信息，主要是为规则提供结构,公式用
  async getEntyInfo () {
    const treeData = ht.getTreeData()
    let oEnty = {}

    const findEnty = async (data) => {
      data.forEach(item => {
        const { name, dataType, enty, refer, biztype, children } = item
        let fieldType = 'String'
        //只有页面元素，后期可能会有问题，应该根据实体吧
        if (dataType === 'enty' && enty && enty.info && name !== 'root') {
          const { name, uri: tableId } = enty.info
          if (!oEnty[tableId]) {
            oEnty[tableId] = { name, code: tableId, fieldType, children: [] }
          }

          //字段
          if (children && children.length > 0) {
            children.forEach(node => {
              fieldType = 'String'
              const { name, key: nodeKey, label, dataField, nodeType } = node
              if (['formItem', 'leafItem', 'column'].includes(nodeType) && name !== 'YDFDivider') {
                if (['YDFInputNumber'].includes(name)) {
                  fieldType = 'Decimal'
                } else if (name === 'YDFSwitch') {
                  fieldType = 'Boolean'
                }
                const code = `${tableId}.${dataField}`
                if (oEnty[tableId].children.findIndex(cnode => cnode.code === code) === -1) {
                  oEnty[tableId].children.push({ nodeKey, name: label, code, fieldType, })
                }
              }
            })
          }
        } else {
          if (children && children.length > 0) {
            findEnty(children)
          }
        }

      })
    }
    await findEnty(treeData)

    let aEnty = []
    for (let key in oEnty) {
      aEnty.push(oEnty[key])
    }
    console.log(aEnty, 44444444444444)
    return aEnty
  },
  // 取实体可编辑信息，主要是为规则提供结构,公式用,以Key为前缀，支持一实体多区域
  async getEntyInfoOfKey () {
    const treeData = ht.getTreeData()
    let oEnty = {}

    const findEnty = async (data) => {
      data.forEach(item => {
        const { key, label, name, dataType, enty, refer, biztype, children } = item
        let fieldType = 'String'

        if (dataType === 'enty' && enty && enty.info && name !== 'root') {

          oEnty[key] = { name: label, code: key, fieldType, children: [] }
          //字段
          if (children && children.length > 0) {
            children.forEach(node => {
              fieldType = 'String'
              const { name, key: nodeKey, label, dataField, nodeType } = node
              if (['formItem', 'leafItem', 'column'].includes(nodeType) && name !== 'YDFDivider') {
                if (['YDFInputNumber'].includes(name)) {
                  fieldType = 'Decimal'
                } else if (name === 'YDFSwitch') {
                  fieldType = 'Boolean'
                }
                oEnty[key].children.push({ nodeKey, name: label, code: `${key}.${dataField}`, fieldType, })
              }
            })
          }
        } else {
          if (children && children.length > 0) {
            findEnty(children)
          }
        }

      })
    }
    await findEnty(treeData)

    let aEnty = []
    for (let key in oEnty) {
      aEnty.push(oEnty[key])
    }
    console.log(aEnty, 44444444444444)
    return aEnty
  },

  //取所有字段信息：主表数据是uri.field=value,明线表数据：主表uri:data,这种主要是为了求和用，还有一种是当前行：uri.field=value,如果是规则用的是实体，数据值不需要加key
  getActionBillData ({ rowData, tmpEnty, index, actionNodeKey, isRule }) {
    let newData = {}
    const entyValues = ht.getEntyValues()
    for (let key in entyValues) {
      //

      if (!['billId', 'billStatus'].includes(key)) {
        const { data } = entyValues[key]
        //数组为明细表所用
        if (Array.isArray(data)) {
          newData[key] = data
        }
        //表单
        else {
          for (let field in data) {
            // 规则要特别处理，不加key
            if (isRule) {
              newData[`${field}`] = data[field]
            } else {
              newData[`${key}.${field}`] = data[field]
            }

          }
        }
      }

    }
    // 表格行
    if (rowData && actionNodeKey) {
      // 如果是表格列，需要转为表格的id
      const actionNode = ht.getNodeByKey(actionNodeKey)
      if (actionNode.nodeType === 'column') {
        actionNodeKey = actionNode.parentKey
      }
      for (let field in rowData) {
        // 规则要特别处理，不加key
        if (isRule) {
          newData[`${field}`] = rowData[field]
        } else {
          newData[`${actionNodeKey}.${field}`] = rowData[field]
        }

      }
    }
    console.log(newData, '动作使用的数据')
    return newData
    /*
    let newData = {}
    const entyValues = ht.getEntyValues()
    for (let key in entyValues) {
      //
      if (!['billId'].includes(key)) {
        const { data, enty } = entyValues[key]
        const { uri } = enty.info
        //数组为明细表所用
        if (Array.isArray(data)) {
          newData[uri] = data
        }
        //表单
        else {
          for (let field in data) {
            newData[`${ uri }.${ field }`] = data[field]
          }
        }
      }

    }
    // 表格行
    if (rowData && tmpEnty) {
      const { uri } = tmpEnty
      for (let field in rowData) {
        newData[`${ uri }.${ field }`] = rowData[field]
      }
    }
    console.log(newData, '动作使用的数据')
    return newData
    */
  },
  //////////////////////////////////////////
  showLoading (tip) {
    console.log(tip, '正在熟悉内容')
    const designer = ht.getItem('designer')
    if (!designer) {
      return false
    }
    setTimeout(() => {
      designer.setState({ showSpin: true, spinTip: tip })
    }, 0)
  },
  hideLoading () {
    const designer = ht.getItem('designer')
    if (!designer) {
      return false
    }
    setTimeout(() => {
      designer.setState({ showSpin: false })
    }, 300)
  },
  // 单据检查
  validateCheck () {
    return billActions.validateCheck()
  },
  postMessage (message, targetOrigin) {
    window.parent.postMessage(message, targetOrigin)
  },
  saveBill () {
    return billActions.saveBill()
  },
  doWorkFlow ({ fn, data, _cb }) {
    return billActions.doWorkFlow({ fn, data, _cb })
  },
  doBatchWorkFlow ({ fn, data, _cb }) {
    return billActions.doBatchWorkFlow({ fn, data, _cb })
  },
  getUrlParameter (key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.href.substring(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  },
  // 暴露 所有动作
  billActions: {
    ...billActions
  }
}

export default ht
