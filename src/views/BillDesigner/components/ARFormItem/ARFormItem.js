import React from 'react'
import { Form } from 'antd'
// import ht from '../../utils/HelperTools'
const ht = {}
export default class ARFormItem extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    validateStatus: '',
    help: '',
    domnode: this.props.domnode
  }
  refreshState = (nextState) => {
    this.setState({ ...nextState })
  }
  //表单项点击，主要是为了控制校验信息
  handleFormItemClick = () => {

    this.setState({ validateStatus: 'success', help: '' })
  }
  setValidate = (help = '') => {
    this.setState({ validateStatus: help ? 'error' : 'success', help })
  }
  handleChange = () => {
    const timeId = setTimeout(() => {
      const { domnode } = this.props
      const { key, nullable, label } = domnode
      const value = ht.getValueByKey(key) || ''
      // console.log(value, nullable, '非空判断')
      // 为空判断
      if (!value && nullable === 1) {
        this.setState({ validateStatus: 'error', help: `${label}不能为空！` })
      } else {
        this.setState({ validateStatus: 'success', help: '' })
      }
      clearTimeout(timeId)
    }, 0)
  }
  render () {
    // const { validateStatus, help, domnode } = this.state

    // let itemProps = { ...this.props, validateStatus, help, colon: false }
    // if (domnode && domnode.key) {
    //   itemProps.label = domnode.label
    //   itemProps.domnode = { ...domnode }
    // }

    // itemProps.required = itemProps.domnode.nullable === 1

    // // 不显示标签
    // if (itemProps.show_label === 0 || domnode.position === 'line') {
    //   delete itemProps.label
    // }
    return (
      <Form.Item {...this.props} onClick={this.handleFormItemClick} onChange={this.handleChange} />
    )
  }
}