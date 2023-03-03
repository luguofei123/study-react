import React from 'react'
import YDFBraftEditor from '_c/YDFBraftEditor'
import { Button } from 'antd'
import { modal } from '_c/YDFModal'
export default class PropRemarkConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  refBraftEditor = React.createRef();

  onOk() {
    const html = this.refBraftEditor.current.toHTML()
    if (this.props.onChange) {
      this.props.onChange(html)
    }
    return true
  }

  onClose() {
    this.setState({ showModal: false })
    return true
  }
  open = () => {
    const { value = '' } = this.props

    const props = {
      title: '说明文字',
      height: 550,
      width: 1000,
      visible: true,
      resizing: ({ height, width, $custom }) => {
        if ($custom) {
          $custom.update({ height: height - 40, width })
        }
      },
      onOk: this.onOk.bind(this),
      children: <YDFBraftEditor ref={this.refBraftEditor} value={value} />
    }

    const $modal = modal.open(props)
  }
  render() {

    return (
      <div style={{ margin: '10px', textAlign: 'center' }}>
        <Button type="link" onClick={this.open}>设置说明文字</Button>
      </div>
    )
  }
}
