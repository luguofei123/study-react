import React from 'react'
import ht from './HelperTools'
// import YDFIcon from '_c/YDFIcon'
// import YDFDivider from '_c/YDFDivider'
// import { getUsedWidgets } from '../components'
// import { getUsedMobileWidgets } from '../MobileComponents'
// import { getMobileUIWidgets } from '../MobileComponents/bus'
// import { getWidget, delWidget } from '@/api/pvdf/BillDesign'
import { DeleteOutlined } from '@ant-design/icons';
import { getQueryString, guid, replaceAll } from '../../../utils/utils'
// import { getUIWidgets } from '../UIComponents'


import './PopoverMenu.less'
let YDFDivider = <div></div>
function getMobileUIWidgets () { }
function getWidget () { }
function delWidget () { }
function getUsedMobileWidgets () { }
function getUsedWidgets () { }
function getUIWidgets () { }
const fixedCls = 'widget-panel'
const isMobile = getQueryString('mobile')
export default class PopoverMenu extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { usedWidgets: this.getUsedDidgetList(this.props), uiWidgets: [], busWidgets: [] }
  getUsedDidgetList (props) {
    const { nodeType, name, parentName } = props.domnode
    let widgets = isMobile ? getUsedMobileWidgets(nodeType, name, true) : getUsedWidgets(nodeType, name, true)
    if (name === "LCDBtnToolbar" && parentName === "LCDTable") {
      widgets = (widgets || []).filter(item => item.name !== "YDFDropdownButton")
    }
    widgets = widgets || []
    return widgets
  }
  getEntyInfo = async (utools) => {
    // 根据主实体code+Attachment从模板中取附件实体begin
    const templateTree = utools.getTreeData()
    const { enty } = templateTree[0]
    const { info, children } = enty
    if (!children || !children.length) {
      return false
    }
    const { code } = info
    const iFJEnty = children.findIndex(enty => enty.info.code === `${code}Attachment`)
    if (iFJEnty === -1) {
      return false
    }
    return { entyInfo: children[iFJEnty].info, rootInfo: info }
  }
  getBusWidgets = async (props) => {
    const { nodeType, name } = props.domnode
    // 取业务组件
    let busWidgets = []
    const res = await getWidget()

    res.data.forEach(el => {
      let { dom, modalType, label, key } = el
      if (modalType === 'widget') {
        dom.label = label
        dom.busKey = key
        if (!dom.used || (dom.used.indexOf(name) >= 0 || dom.used.indexOf(nodeType) >= 0)) {
          busWidgets.push(dom)
        }
      }
    });
    this.setState({ busWidgets })
  }
  async handleCmpClick (cmp, type) {

    if (type === 'ui') {
      cmp = await cmp.widget(ht)
      if (!cmp) { return false }
    }
    let hasChild = false
    // 通过busKey来确定是否业务组件
    if (type === 'bus' || type === 'ui') {
      hasChild = false
      let strUI = JSON.stringify(cmp)
      const transKey = (nodes, parentKey) => {
        nodes.map(nd => {
          const key = nd.key
          const newKey = guid()
          strUI = replaceAll(strUI, key, newKey)
          //nd.key = newKey
          // if (parentKey) {
          //   nd.parentKey = parentKey
          // }
          if (nd.children && nd.children.length) {
            transKey(nd.children, newKey)
          }
        })
      }
      transKey([cmp])
      //////////////////////
      cmp = JSON.parse(strUI)
    }

    const { domnode } = this.props
    const atNode = ht.getNodeByKey(domnode.key)
    /*后期应该调整，不应该在这里*/
    if (cmp.name == "LCDUpload") {
      const { entyInfo, rootInfo } = await this.getEntyInfo(ht)
      cmp = {
        "name": "LCDCard",
        "label": "附件信息",
        "dataType": "enty",
        "icon": "Card",
        "nodeType": "card",
        "isUpload": "isUpload",
        "rowHeight": 20,
        "h": 10,
        "flowX": true,
        "props": {
          "bordered": 1,
          "show_label": 1,
          "marginleft": 0,
          "marginright": 0,
          "margintop": 0,
          "marginbottom": 0,
          "radiustl": 4,
          "radiustr": 4,
          "radiusbl": 4,
          "radiusbr": 4,
          "font": {
            "fontFamily": ""
          }
        },
        "parentNodeType": [
          "root",
          "tabs",
          "card",
          "dragact"
        ],
        "parentName": "root",
        "GridX": 0,
        "GridY": 8,
        "key": "5976698d-5c1a-46f0-9b61-32d5be3a8731",
        "enty": {
          "info": {
          },
          "title": entyInfo,
        },
        "children": [
          {
            "name": "LCDUpload",
            "label": "附件上传",
            "icon": "Table",
            "nodeType": "table",
            "dataType": "enty",
            "parseChild": 0,
            "h": 10,
            "w": 24,
            "props": {
              "bordered": 1,
              "show_label": 1,
              "marginleft": 0,
              "marginright": 0,
              "margintop": 0,
              "marginbottom": 0,
              "radiustl": 4,
              "radiustr": 4,
              "radiusbl": 4,
              "radiusbr": 4
            },
            "parentNodeType": [
              "root",
              "card",
              "dragact"
            ],
            key: "202211291002541482844178893718",
            parentKey: "5976698d-5c1a-46f0-9b61-32d5be3a8731",
            "GridX": 0,
            "GridY": 0,
            "GridW": null,
            "level": 2,
          },
          {
            "name": "LCDToolbar",
            "label": "浮动面板",
            "icon": "Header",
            "nodeType": "form",
            "rowHeight": 32,
            "defaultHeight": 1,
            "cols": 24,
            "position": "top",
            "GridX": 0,
            "GridY": 0,
            "w": 24,
            "h": 2,
            "static": true,
            "parentNodeType": [
              "root",
              "form",
              "card",
              "table",
              "dragact"
            ],
            "parentName": "LCDCard",
            "key": "2022120110571076520883501226922",
            "GridW": null,
            "parentKey": "5976698d-5c1a-46f0-9b61-32d5be3a8731",
            "level": 2,
            "divCode": "2022120110571076520883501226922",
            "children": [
              {
                "name": "LCDBtnToolbar",
                "label": "按钮工具栏",
                "icon": "Toolbar",
                "nodeType": "toolbar",
                "parseChild": 0,
                "rowHeight": 32,
                "defaultHeight": 1,
                "cols": 24,
                "position": "top",
                "h": 4,
                "GridH": 40,
                "flowX": "left",
                "parentNodeType": [
                  "root",
                  "form",
                  "card",
                  "table",
                  "dragact"
                ],
                "parentName": "LCDToolbar",
                "GridX": 0,
                "GridY": 0,
                "key": "61d2b72e-f268-4880-b0e4-b31c3dba6a45",
                "parentKey": "2022120110571076520883501226922",
                "w": 8,
                "level": 2,
                "children": [
                  {
                    "name": "YDFButton",
                    "label": "上传附件",
                    "icon": "Button",
                    "nodeType": "leafItem",
                    "labelPosition": "inTag",
                    "editable": false,
                    "autoHeight": true,
                    "autoWidth": true,
                    "w": 2,
                    "h": 2,
                    "showResize": false,
                    "placeholder": true,
                    "fixedSize": true,
                    "movepx": true,
                    "parentNodeType": [
                      "form",
                      "toolbar"
                    ],
                    "fn": {
                      "onClick": "onCustomClick"
                    },
                    "parentName": "LCDBtnToolbar",
                    "GridX": 0,
                    "GridY": 0,
                    "key": "b8ccb7d4-4271-46a5-b10c-baa186eb6c8b",
                    "parentKey": "61d2b72e-f268-4880-b0e4-b31c3dba6a45",
                    "level": 3,
                    "GridW": 25,
                    "GridH": 28.041667938232422,
                    "actions": {
                      "onClick": [
                        {
                          "actionType": "bill",
                          "key": "billAnnex",
                          "title": "附件管理",
                          "label": "附件管理",
                          afterMethod: { method: 'reload', dom: { key: '202211291002541482844178893718' } },
                          "relationActions": {
                            "newBill": 0,
                            "modifyBill": 0,
                            "deleteBill": 0,
                            "saveBill": 0,
                            "cancelBill": 0,
                            "refreshPage": 0,
                            "billPrint": 0,
                            "billAnnex": 0,
                            "startFlow": 0,
                            "cancelFlow": 0,
                            "approveFlow": 0,
                            "unapproveFlow": 0,
                            "backFlow": 0,
                            "delegateFlow": 0,
                            "transferFlow": 0,
                            "circulateSendFlow": 0,
                            "discardFlow": 0,
                            "workflowTraceFull": 0
                          },
                          "nodeKey": "3a13077f-8895-47e3-818b-82a927f81d34"
                        }
                      ]
                    },
                    "props": {
                      "type": "link",
                      "marginleft": 90,
                      "margintop": 2,
                      "showforedit": 1,
                      "font": {
                        "color": "#4a90e2",
                      }
                    },
                    "locked": 0
                  }
                ],
                "props": {},
                "GridW": 401,
                "locked": 0
              }
            ]
          },
        ],
        "actions": {
          "onMount": [
            {
              "actionType": "self",
              "key": "GetAnnexType",
              "title": "获取附件类型",
              "label": "获取附件类型",
              "nodeKey": "5976698d-5c1a-46f0-9b61-32d5be3a8731"
            }
          ]
        },
        "w": 24,
        "level": 1,
        "GridH": null,
        "GridW": 1069.999755859375
      }
      cmp.enty.info = { ...entyInfo }
      console.log(cmp);
    }
    // changeKey改为true 用于和粘贴操作区分
    let changeKey = true;
    // 新增上传组件不再替换key
    if (cmp.name == "LCDUpload" || (cmp.name === 'LCDTable' && cmp.tableType === 'upload')) {
      changeKey = false
    }
    ht.insertAtNode(cmp, atNode, ['LCDToolbar', 'LCDBtnToolbar', 'LCDPanel', 'LCDDragWidthLayout', 'LCDCard'].includes(cmp.name) || cmp.nodeType !== domnode.nodeType, { x: 0, y: 0 }, hasChild, changeKey)
    //ht.insertAtNode(cmp, domnode, ['LCDToolbar', 'LCDBtnToolbar', 'LCDPanel', 'LCDDragWidthLayout'].includes(cmp.name) || cmp.nodeType !== domnode.nodeType)

    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(false)
    }
  }
  handleDelBusWidget = (e, cmp, idx) => {
    e.stopPropagation()
    delWidget({ nodeKey: cmp.busKey })
    let { busWidgets } = this.state
    busWidgets.splice(idx, 1)
    this.setState({ busWidgets: [...busWidgets] })
  }

  componentDidMount () {
    this.getBusWidgets(this.props)
    const uiWidgets = isMobile ? getMobileUIWidgets(this.props.domnode.name, this.props.domnode.nodeType) : getUIWidgets(null, this.props.domnode.name, this.props.domnode.nodeType)

    this.setState({ uiWidgets })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.domnode.key !== nextProps.domnode.key) {
      this.getBusWidgets(nextProps)
      this.setState({ usedWidgets: this.getUsedDidgetList(nextProps) })
    }
  }

  render () {
    const { usedWidgets, busWidgets, uiWidgets } = this.state

    return (
      <div className={`${fixedCls}`} style={{ maxWidth: '800px' }}>
        {usedWidgets.map(cmp => {
          return (
            <span key={cmp.name} className={`${fixedCls}-cmp popup-locked`}
              onClick={(e) => { e.stopPropagation(); this.handleCmpClick(cmp) }}>
              {/* <YDFIcon size="18" type={cmp.icon} /> */}
              <span style={{ marginLeft: '5px' }}>{cmp.label}</span>
            </span>
          )
        })
        }

        {uiWidgets.length > 0 ? <YDFDivider /> : ''}
        {uiWidgets.map((cmp, idx) => {
          return (
            <span key={cmp.key} className={`${fixedCls}-cmp popup-locked`}
              onClick={(e) => { e.stopPropagation(); this.handleCmpClick(cmp, cmp.nodeType ? null : 'ui') }}>
              {/* <YDFIcon size="18" type={cmp.icon} /> */}
              <span style={{ marginLeft: '5px' }}>{cmp.label}</span>
            </span>
          )
        })
        }

        {!isMobile && busWidgets.length > 0 ? <YDFDivider /> : ''}
        {!isMobile && busWidgets.map((cmp, idx) => {
          return (
            <span key={cmp.key} className={`${fixedCls}-cmp popup-locked`}
              onClick={(e) => { e.stopPropagation(); this.handleCmpClick(cmp, 'bus') }}>
              {/* <YDFIcon size="18" type={cmp.icon} /> */}
              <span style={{ marginLeft: '5px' }}>{cmp.label}</span>
              <DeleteOutlined style={{ paddingTop: '10px' }} className={`icon-del`} onClick={e => this.handleDelBusWidget(e, cmp, idx)} />
            </span>
          )
        })
        }
      </div>
    )
  }
}