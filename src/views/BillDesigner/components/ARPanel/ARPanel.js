/**卡片为了在卡片中使用Form做的封装 */
import React from 'react'
import { Form } from 'antd'
import { getSizeStyle } from '../../../../utils/utils'
const fixedCls = 'lcd-panel'
class ARPanel extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { width: this.props.width }
  formRef = React.createRef()
  // Form表单数据变化
  onValuesChange = (changedValues, allValues) => {
    if (this.props.onValuesChange) {
      this.props.onValuesChange(changedValues, allValues)
    }
  }
  updateState (node) {

    const { GridW, GridH } = node
    if (GridW !== this.state.width) {
      this.setState({ width: GridW })
    }
  }
  setRequired (names) {
    if (!names) return
    const { domnode, utools } = this.props
    const formKey = domnode.key
    for (let key in names) {
      let node = utools.getNodeByDataField(formKey, key)
      node.nullable = names[key] ? 1 : 0
    }
    utools.refreshUIData(utools.getNodeByKey(formKey))
  }
  render () {
    let props = { ...this.props }
    const font = props.font || {}
    const { marginleft = 0, marginright = 0, margintop = 0, marginbottom = 0, showaddonafter = 1 } = props
    // 获取边距设置属性
    let { paddingFull = {}, marginFull = {} } = this.props?.marginconfig || {}
    if (Object.keys(marginFull).length == 0) {
      // 兼容原有的样式
      marginFull.marginleft = marginleft
      marginFull.marginright = marginright
      marginFull.margintop = margintop
      marginFull.marginbottom = marginbottom
    }
    const style = getSizeStyle({ width: this.state.width, height: '100%', ...marginFull, ...paddingFull })
    let styles = { ...style, ...font }

    const children = this.props.children || []

    return (
      <Form
        style={styles}
        className={`${fixedCls} ${showaddonafter ? 'formitem-addon-after' : ''} ${props.underline ? 'formitem-underline' : ''}`}
        labelAlign="right"
        labelWrap
        labelCol={{ flex: `${props.labelwidth || 120}px` }}
        onValuesChange={this.onValuesChange}
        ref={this.formRef}
      >{children}</Form>

    )
  }
}

ARPanel.defaultProps = {
  label: 'Card title',
  bordered: 'false',
  width: '100%'
}
export default ARPanel