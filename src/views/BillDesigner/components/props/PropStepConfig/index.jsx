import React from 'react'
import { modal } from '_c/YDFModal'
import { UnorderedListOutlined } from '@ant-design/icons';
import SelectDomTree from '../../SelectDomTree'
import './style.less'

const fixedCls = 'lcd-stepconfg'
export default class LCDStepsConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  refDomTree = React.createRef()
  state = { domKey: '', title: '' }
  delStep = () => {

  }

  // 双点击树
  handleDomTreeDboubleClick(node) {

    if (!node) {
      return false
    }
    this.onChange(node)
  }
  onChange = (node) => {
    if (!node) {
      return false
    }
    if (this.props.onChange) {
      const values = { domKey: node.key, title: node.label }
      this.setState(values)

      this.props.onChange(values)
    }
    modal.close()
  }
  selectLink = () => {
    const onChange = this.onChange
    const $modal = modal.open(
      {
        title: '选择更新位置',
        height: 550,
        width: 400,
        visible: true,
        sysbar: [],
        /*       resizing: ({ height, width, top, left, $custom }) => {
                if ($custom) {
                  $custom.update({ height: height, width, top, left })
                }
              }, */
        onOk: () => {
          const node = this.refDomTree.current.getSelectedNode()
          onChange(node)
        },
        children: <SelectDomTree askFirst={1} onDoubleClick={({ node }) => this.handleDomTreeDboubleClick(node)} ref={this.refDomTree} />
      }
    )
  }
  /////////

  render() {
    // const { title = '' } = this.state
    let title = '',domKey = ''
    const { value } = this.props
    if(value){
      title = value.title || ''
      domKey = value.domKey || ''
    }
    return (
      <div className={`${fixedCls}`}>
        {title !== '' ? <div>{title}</div> : <span className="empty">请设置步骤</span>}
        <UnorderedListOutlined onClick={this.selectLink} size={18} />
      </div>
    )
  }
}