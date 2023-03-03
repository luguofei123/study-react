import React from 'react'
import YDFSelect from '_c/YDFSelect'
import { getSiblings } from '../../index'
export default class PropWidgetSelect extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { widgetList: [], value: this.props.widget.name }
  setWidgetList(widget) {
    const { nodeType } = widget
    let widgetList = getSiblings(nodeType === 'column' ? 'formItem' : nodeType)
    if (nodeType === 'column') {
      widgetList.push(
        // { name: 'link', label: '表格链接', value: 'link' }, 
        { name: 'column', label: '表格列', value: 'column' }
      )
    }
    // 查询区去掉表格链接
    if(widget.parentName=="LCDQueryString"){
      const idx = widgetList.findIndex(val=>val.name =='link');
      if(idx>-1){
        widgetList.splice(idx,1)
      }
    }
    //表格的组件类型中去掉表格列
    if(widget.name=="LCDTable"){
      const idx = widgetList.findIndex(val=>val.name =='column');
      if(idx>-1){
        widgetList.splice(idx,1)
      }
    }
    const data = []
    widgetList.forEach(item => {
      const { label, name } = item
      data.push({ label, value: name, item })
    })
    this.setState({ widgetList: data, value: widget.name })
  }
  handleChange(value) {
    this.setState({ value: value.value })
    this.props.onChange && this.props.onChange(value.item)
  }
  componentWillMount() {
    this.setWidgetList(this.props.widget)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.widget.name !== nextProps.widget.name) {
      this.setWidgetList(nextProps.widget)
    }
  }

  render() {
    const { widgetList, value } = this.state

    return (
      <div>
        <YDFSelect
          style={{ width: 200 }}
          placeholder="请选择组件类型"
          onChange={this.handleChange.bind(this)}
          labelInValue={true}
          data={widgetList}
          value={value}
        />
      </div>
    )
  }
}