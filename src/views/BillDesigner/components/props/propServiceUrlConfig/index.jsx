import React from 'react'
import { modal } from '_c/YDFModal'
import { UnorderedListOutlined } from '@ant-design/icons';
import LCDUrlConfig from '../../LCDUrlConfig'
import YDFIcon from '_c/YDFIcon'
import { Input } from 'antd'
import './style.less'
const { TextArea } = Input
const fixedCls = 'lcd-seturl'
const selectUrl = (onSelect) => {
  const refUrl = React.createRef()
  let selectUrl = ''
  const onClick = (icon) => {
    onSelect(icon)
    selectUrl = icon
    modal.close()
  }

  modal.open(
    {
      title: '选择应用服务',
      height: 550,
      width: 600,
      visible: true,
      sysbar: [],
      onOk: () => {
        if (selectUrl) {
          onSelect(selectUrl)
        }else{
          let record = refUrl.current.refTable.current.getSelectRow();
          onClick(record.url)
        }
      },
      children: <LCDUrlConfig ref={refUrl} onClick={onClick} />
    }
  )
}
export default class PropServiceUrlConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    selectUrl : ''
  }
  selectLink = () => {
    selectUrl((icon) => {
      if (this.props.onChange) {
        this.props.onChange(icon)
      }
    })
  }
  inputValueChange = (e)=> {
    let value = e.target.value || ''
    this.setState({ selectUrl: value })
    if (this.props.onChange) {
      this.props.onChange(value, this.props.domnode)
    }
    if (this.props.domnode && this.props.domnode.locked) {
      const { key, actions } = this.props.domnode
      if (!key) {
        return false
      }
      // 更新值
      setTimeout(() => {
        this.props.utools.updateNodeProp({ key, prop: 'value', value })
      }, 0)
      //执行动作
      setTimeout(() => {
        this.doAction('onChange', e)
      }, 2)
    }
  }

  render() {
    const { value } = this.props
    let { selectUrl } = this.state
    selectUrl = value ? value : selectUrl
    return (
      <div className={`${fixedCls}`}>
        {selectUrl !== '' ? <TextArea value={selectUrl} onChange={this.inputValueChange} className={`${fixedCls}-block`}><YDFIcon type={value} size={14} /></TextArea> : <TextArea value={selectUrl} onChange={this.inputValueChange} className="" placeholder='请输入URL'></TextArea>}
        <UnorderedListOutlined onClick={this.selectLink} size={18} />
      </div>
    )
  }
}