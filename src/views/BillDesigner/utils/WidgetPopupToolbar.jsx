import React from 'react'
import PopupMenu from '../components/PopupMenu'
// import { modal } from '_c/YDFModal'
import PopoverMenu from './PopoverMenu'
// import YDFTree from '_c/YDFTree'
// import YDFCodeMirror from '_c/YDFCodeMirror'
import ht from './HelperTools'
import u from '../../../utils/umbrella'
import { guid } from '../../../utils/utils'

import { Dropdown, Popover, Form, Input, Button, Tooltip } from 'antd'
import { ScissorOutlined, DeleteOutlined, ColumnWidthOutlined, ColumnHeightOutlined, ToTopOutlined, SaveOutlined, SelectOutlined, PlusSquareOutlined, CopyOutlined, ClearOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';

// import { getWidgetProps } from '../components/propList.jsx'
// import { saveWidget, getWidget, delWidget } from '@/api/pvdf/BillDesign'

import './style.less'
function getWidgetProps () { }
function saveWidget () { }
function getWidget () { }
function delWidget () { }
function handleMenuClick () { }
const YDFTree = ''
const modal = ''
const YDFCodeMirror = ''
const YDFTree1 = ''
let tdNode = ''
let node = ''
let position = ''
const fixedCls = 'widget-popup-toolbar'
///////////////////////////////////////////////////
class SaveModal extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { saveName: this.props.saveName }

  onValuesChange (changedValues, allValues) {
    this.setState(changedValues);
  }
  handleOkClick = () => {
    const { saveName } = this.state
    const { domnode, modalType } = this.props
    const getCss = () => {
      let css = {}
      const props = getWidgetProps(domnode.name)
      props.forEach(item => {
        const { key } = item
        if (domnode[key] && ['label', 'dataField', 'change_widget', 'divider'].includes(key)) {
          css[key] = domnode[key]
        }
      })
      if (domnode.props) {
        css.props = { ...domnode.props }
      }
      return css
    }
    //modalType是组件widget还是样式css，
    const item = { key: guid(), label: saveName, name: domnode.name, modalType, dom: modalType === 'widget' ? domnode : getCss() }
    saveWidget(item)
    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(false)
    }
  }
  handleCancelClick = () => {
    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(false)
    }
  }

  render () {
    const { saveName } = this.state
    return (
      <div className='popup-locked'>
        <Form onValuesChange={this.onValuesChange.bind(this)}>
          <Form.Item label="名称" name="saveName" initialValue={saveName}>
            <Input autoComplete="off" />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'right' }}>
          <Button size="small" onClick={this.handleCancelClick} style={{ marginRight: '15px' }}>取消</Button>
          <Button type="primary" size="small" onClick={this.handleOkClick}>确定</Button>
        </div>
      </div>
    )
  }
}
////////////////////////////////////////////////////
//选择样式
class SelectCutUI extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { cssWidgets: [] }

  getCutUIData = async (props) => {
    const { nodeType, name } = props.domnode
    // 取业务组件
    let cssWidgets = []
    let cutUIData = ht.getCutUIData()

    cutUIData.forEach(el => {
      let { parentNodeType } = el

      if (parentNodeType.includes(nodeType) || parentNodeType.includes(name)) {
        cssWidgets.push(el)
      }
    });
    this.setState({ cssWidgets })
  }

  handleCssClick (cmp) {

    const { domnode } = this.props

    cmp.parentKey = domnode.key
    cmp.parentName = domnode.name

    ht.insertAtNode(cmp, domnode, true, { x: 0, y: 0 }, false, false)
    ht.removeCutUIData(cmp)
    if (this.props.onVisibleChange) {
      this.props.onVisibleChange(false)
    }
  }

  componentDidMount () {
    //this.getCutUIData(this.props)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.domnode.key !== nextProps.domnode.key) {
      //this.setState({ busWidgets: this.SelectCutUI(nextProps) })
    }
  }

  render () {
    const { cutUIData } = this.props
    return (
      <div style={{ maxWidth: '800px' }}>
        {cutUIData.length ? cutUIData.map((cmp, idx) => {
          return (
            <span key={cmp.busKey} className={`widget-panel-cmp popup-locked`}
              onClick={(e) => { e.stopPropagation(); this.handleCssClick({ ...cmp }) }}>
              <span style={{ marginLeft: '5px' }}>{cmp.label}</span>
            </span>
          )
        }) : <span style={{ color: '#333' }}>无可用对象</span>
        }
      </div>
    )
  }
}
//////////////////////
class Toolbar extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    nodeKey: this.props.nodeKey, currentNode: {}, treeNode: {}, expandedKeys: [], selectedKeys: [],
    dropdownVisible: false,
    widgetPopoverVisible: false,
    saveModalVisible: false,
    saveCssVisible: false,
    selectCssVisible: false,
    cutUIData: []
  }
  refCodeMirror = React.createRef()
  async updatePopup (props) {
    const currentNode = ht.getNodeByKey(props.nodeKey)
    if (!currentNode) return
    let expandedKeys = [props.nodeKey]
    let selectedKeys = [props.nodeKey]
    let treeNode = { key: props.nodeKey, title: currentNode.label }
    let curNode = treeNode
    const getParentNode = (parentKey) => {
      if (!parentKey || parentKey === 'root') {
        return false
      }
      expandedKeys.push(parentKey)
      const node = ht.getNodeByKey(parentKey)
      treeNode = { key: node.key, title: node.label, children: [treeNode] }
      if (node.parentKey) {
        getParentNode(node.parentKey)
      }
    }
    getParentNode(currentNode.parentKey)
    //取非末级子结点
    const getChildNode = (node, parentNode) => {
      if (node.children && node.children.length) {
        node.children.forEach(nd => {
          if (nd.children && nd.children.length > 0) {
            if (!parentNode.children) {
              parentNode.children = []
            }
            const { key, label } = nd
            let tmpNode = { key, title: label }
            parentNode.children.push(tmpNode)
            getChildNode(nd, tmpNode)
          }
        });
      }
    }
    getChildNode(currentNode, curNode)

    const cutUIData = await this.getCutUIData(currentNode)

    this.setState({ nodeKey: props.nodeKey, currentNode, treeNode, expandedKeys, selectedKeys, cutUIData })
  }

  getCutUIData = async (node) => {

    const { nodeType, name } = node
    // 取业务组件
    let cutUIDataList = []
    let cutUIData = ht.getCutUIData()

    cutUIData.forEach(el => {
      let { parentNodeType = [], parentName } = el

      if (parentNodeType.includes(nodeType) || parentNodeType.includes(name) || parentName === name) {
        cutUIDataList.push(el)
      }
    });
    return cutUIDataList
  }
  ///////////////
  nodeTreeClick ({ node }) {
    const timeId = setTimeout(() => {
      if (node.key !== this.state.nodeKey) {
        ht.selectDom(node.key, node.nodeType === 'column' ? 'table' : node.nodeType)
        ht.showWidgetToolbar(node.key)
        clearTimeout(timeId)
      }
    }, 300)
    this.setState({ dropdownVisible: false })
  }
  //切换选择组件
  handleDropdownVisibleChange = visible => {
    this.setState({ dropdownVisible: visible })
  }

  getDropdownMenu = () => {
    const { treeNode, expandedKeys, selectedKeys } = this.state
    return (<div className='popup-locked' style={{ background: '#fff', border: '1px #d1d1d1 solid' }}>
      <YDFTree expandedKeys={expandedKeys} selectedKeys={selectedKeys} treeData={[treeNode]} onSelect={this.nodeTreeClick.bind(this)} />
    </div>)
  }
  //选择组件
  onWidgetPoverOpenChange = visible => {
    this.setState({ widgetPopoverVisible: visible })
  }

  getWidgetPopover = () => {

    const currentNode = ht.getNodeByKey(this.props.nodeKey)
    return <PopoverMenu domnode={currentNode} onVisibleChange={this.onWidgetPoverOpenChange} />
  }
  ////////////
  onSaveModalVisibleChange = visible => {
    this.setState({ saveModalVisible: visible })
  }
  getSaveModalPopover = () => {
    const currentNode = ht.getNodeByKey(this.props.nodeKey)
    return <SaveModal domnode={currentNode} modalType='widget' onVisibleChange={this.onSaveModalVisibleChange} />
  }
  ////////
  onSaveCssVisibleChange = visible => {
    this.setState({ saveCssVisible: visible })
  }
  getCssModalPopover = () => {
    const currentNode = ht.getNodeByKey(this.props.nodeKey)
    return <SaveModal domnode={currentNode} modalType='css' onVisibleChange={this.onSaveCssVisibleChange} />
  }
  //选择样式
  onCssPoverOpenChange = visible => {
    this.setState({ selectCssVisible: visible })
  }

  getCutUIPopover = () => {
    const { cutUIData } = this.state
    const currentNode = ht.getNodeByKey(this.props.nodeKey)
    return <SelectCutUI domnode={currentNode} cutUIData={cutUIData} onVisibleChange={this.onCssPoverOpenChange} />
  }
  ////////////工具条操作
  handleFullWidth = () => {
    let currentNode = ht.getNodeByKey(this.props.nodeKey)
    currentNode.w = 24
    currentNode.GridX = 0
    ht.updateNode(currentNode)
    ht.updateGridSize(currentNode.key, currentNode)
  }
  handleFullHeight = () => {
    let currentNode = ht.getNodeByKey(this.props.nodeKey)
    let parentNode = ht.getNodeByKey(currentNode.parentKey)
    let rect = ht.getRectByKey(currentNode.parentKey)
    let hPx = rect.height
    const rowHeight = parentNode.rowHeight || 10
    const { bordered = 1 } = parentNode.props
    hPx = hPx - (bordered ? 2 : 0)
    if (parentNode.props && parentNode.props.show_label) {
      hPx = hPx - 40
    }
    //物块间距为1

    currentNode.h = Math.round(hPx / rowHeight) - 1
    ht.updateNode(currentNode)

    ht.updateGridSize(currentNode.key, currentNode)

  }
  handleAutoHeight = () => {
    let currentNode = ht.getNodeByKey(this.props.nodeKey)
    const style = u(`.wx-${currentNode.key}`).nodes[0].style
    style.height = 'auto'
    ht.updateGridSize(currentNode.key, null, true)
  }
  handleDelWidget = () => {
    const { nodeKey } = this.props
    const node = ht.getNodeByKey(nodeKey)
    ht.deleteNode(node)
    PopupMenu.close()
  }
  handleEditUIDataOk () {
    const uidata = this.refCodeMirror.current.getData()
    if (!uidata) {
      return true
    }
    if (uidata.name === 'root') {
      ht.loadData([uidata])
    } else {
      ht.updateNode(uidata, true)
    }
    return true
  }
  handleEditUIData = () => {
    const { nodeKey } = this.props
    const node = ht.getNodeByKey(nodeKey)
    modal.open(
      {
        title: '代码查看',
        height: 550,
        width: 900,
        visible: true,
        sysbar: [],
        onClose () {
          return true
        },
        onOk: this.handleEditUIDataOk.bind(this),
        children: <YDFCodeMirror ref={this.refCodeMirror} code={node} />
      }
    )
  }
  handleCutUIData = () => {
    const { nodeKey } = this.props
    const node = ht.getNodeByKey(nodeKey)
    ht.setCutUIData(node)
  }
  handleClose = () => {
    PopupMenu.close()
  }
  ////////////
  componentDidMount () {
    this.updatePopup(this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.nodeKey !== nextProps.nodeKey) {
      this.updatePopup(nextProps)
    }
  }
  render () {
    let value = 11
    let data = []
    const { dropdownVisible, widgetPopoverVisible, saveModalVisible, saveCssVisible, selectCssVisible, currentNode, cutUIData } = this.state

    const { key, label, name, nodeType, parentNodeType } = currentNode
    const addWidget = !['formItem', 'leafItem', 'column', 'spliter', 'tree'].includes(currentNode.nodeType)
    let delWidget = true;
    // 分割组件的子节点不允许删除
    if (nodeType === 'dragact' && parentNodeType && parentNodeType.includes('spliter')) {
      delWidget = false
    }
    return (
      <div className={`${fixedCls}-box`} style={{ width: addWidget ? '360px' : '280px' }}>
        <div className={`${fixedCls}-header`}>
          <Dropdown visible={dropdownVisible} onVisibleChange={this.handleDropdownVisibleChange} overlay={this.getDropdownMenu} trigger={['click']}>
            <span className="btn title"><SelectOutlined />{label}({name})</span>
          </Dropdown>

          <span onClick={this.handleClose} style={{ position: 'absolute', right: '8px' }}><CloseOutlined /></span>
        </div>
        <div className={`${fixedCls}-content`}>
          <Popover placement="bottomLeft" trigger="click" visible={saveModalVisible} onVisibleChange={this.onSaveModalVisibleChange} content={this.getSaveModalPopover} title="保存业务组件">
            <Tooltip placement="top" title="另存为">
              <span className="btn" title=""><SaveOutlined />另存为</span>
            </Tooltip>
          </Popover>
          {addWidget ?
            <Popover placement="bottomLeft" trigger="click" visible={widgetPopoverVisible} onVisibleChange={this.onWidgetPoverOpenChange} content={this.getWidgetPopover} title="添加子组件">
              <Tooltip placement="top" title="添加组件">
                <span className="btn" title=""><PlusSquareOutlined />添加组件</span>
              </Tooltip>
            </Popover> : ''
          }
          {/*2023增加格式刷功能
          <Popover placement="bottomLeft" trigger="click" visible={saveCssVisible} onVisibleChange={this.onSaveCssVisibleChange} content={this.getCssModalPopover} title="保存组件样式">
            <Tooltip placement="top" title="保存样式">
              <span className="btn" title=""><CopyOutlined />保存样式</span>
            </Tooltip>
          </Popover>
          <Popover placement="bottomLeft" trigger="click" visible={selectCssVisible} onVisibleChange={this.onCssPoverOpenChange} content={this.getCssPopover} title="选择组件样式">
            <Tooltip placement="top" title="选择样式">  
              <span className="btn" title=""><ClearOutlined />选择样式</span>
            </Tooltip>
          </Popover>
*/}
        </div>
        <div className={`${fixedCls}-content`}>
          <Tooltip placement="bottom" title="自适应宽度">
            <span className="btn icon" title="" onClick={this.handleFullWidth}><ColumnWidthOutlined /></span>
          </Tooltip>
          <Tooltip placement="bottom" title="自适应高度">
            <span className="btn icon" title="" onClick={this.handleFullHeight}><ColumnHeightOutlined /></span>
          </Tooltip>
          <Tooltip placement="bottom" title="根据内容自适应高度">
            <span className="btn icon" title="" onClick={this.handleAutoHeight}><ToTopOutlined /></span>
          </Tooltip>
          {
            delWidget ? <Tooltip placement="bottom" title="删除组件">
              <span className="btn icon" title="" onClick={this.handleDelWidget} ><DeleteOutlined style={{ color: 'red' }} /></span>
            </Tooltip> : null
          }

          <Tooltip placement="bottom" title="剪切">
            <span className="btn icon" title="" onClick={this.handleCutUIData} ><ScissorOutlined /></span>
          </Tooltip>
          {cutUIData.length ?
            <Popover placement="bottomLeft" trigger="click" visible={selectCssVisible} onVisibleChange={this.onCssPoverOpenChange} content={this.getCutUIPopover} title="选择粘贴对象">
              <Tooltip placement="top" title="粘贴">
                <span className="btn icon" title=""><CopyOutlined /></span>
              </Tooltip>
            </Popover> : null
          }
          <Tooltip placement="bottom" title="打开编辑器">
            <span className="btn icon" title="" onClick={this.handleEditUIData} ><SettingOutlined /></span>
          </Tooltip>
        </div>
      </div>
    )
  }
}
/////////////////
export const hideWidgetPopupToolbar = () => {
  PopupMenu.close()
}

export const showWidgetPopupToolbar = ({ x, y, top = 0, left = 0, height, nodeKey, offsetX = 0 }) => {

  let className = 'widget-popup-toolbar'
  let style = {}
  if (top > 95) {
    y = y - 95
  } else if (left > 200) {
    x = x - 200
    className = className + ' vertical'
  }
  const windowHeight = window.innerHeight
  if (y + 100 > windowHeight) {
    y = windowHeight - 120
  }
  x = x + offsetX

  PopupMenu.open({
    x,
    y,
    zIndex: 99,
    className: className,
    children: <Toolbar nodeKey={nodeKey} />
  })
}