import React from 'react'
import { Input } from 'antd'
import './style.less'
class ARInput extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { value: this.props.value, editable: 1, opacity: 0 }
  doAction = (action, e) => {
    if (this.props.domnode && this.props.domnode.locked) {
      //执行动作
      this.props.utools.prepareAction({ actionName: action, actionNode: this.props.domnode, data: this.state.value })
    }
  }


  afterChange (value, e) {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange(value, this.props.domnode)
    }
    // 设计期右侧属性面板里的组件（默认值组件）不需要走下面的流程
    if (this.props.domnode && this.props.domnode.locked && !this.props.domnode.isInPropForm) {
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
  handleOnChange (e) {
    const value = e.target.value
    this.afterChange(value, e)
  }

  handleFocus = (e) => {
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
    this.setState({ opacity: 1 })
    this.doAction('onFocus')
  }

  handleBlur = (e) => {
    setTimeout(() => {
      if (this.props.onBlur) {
        this.props.onBlur(e)
      }
      this.setState({ opacity: 0 })
      this.doAction('onBlur')
    }, 500)

  }
  mouseEnter = () => {
    this.setState({ opacity: 1 })
  }
  mouseLeave = () => {
    this.setState({ opacity: 0 })
  }
  clear = () => {
    this.setState({ value: '' })
    this.afterChange('')
    this.setState({ opacity: 0 })
  }
  update = ({ value }) => {
    // this.setState({ value })
    if (this.state.value !== value) {
      this.afterChange(value)
    }

  }
  // 回车事件
  onInputEnter (e) {
    this.props.utools.onInputEnter(this.props.domnode.parentKey)
  }

  //是否可编辑
  setEditable = (editable) => {
    this.setState({ editable })
  }

  componentWillMount () {
    //初始化调用一次事件，是否合适
    // if (this.props.domnode.locked) {
    //   this.doAction('onChange')
    // }
  }
  componentWillReceiveProps (nextProps) {
    /*
    if (this.props.initialValue !== nextProps.initialValue) {
      this.setState({ value: nextProps.initialValue })
    }
    */
  }

  render () {
    // const { style, disabled, parentDisabled, readOnly, showcount, maxLength, autoFocus, formatType, domnode, placeholder = '' } = this.props
    // let { value, editable } = this.state
    // // 单号需要特殊处理
    // if (formatType === 'billNo' || domnode.dataField === 'billNo') {
    //   if (domnode.dataField !== 'billNo') {
    //     return <div style={{ color: '#ee2223' }}>实体对象必须是billNo</div>
    //   }
    //   return <div className='dis-editable'>{value || <span style={{ opacity: .3 }}>自动编号</span>}</div>
    // }

    // const props = { disabled, showCount: showcount, maxLength, value }
    // if (!editable) {
    //   return <div className='dis-editable'>{value || <span style={{ opacity: .3 }}>--</span>}</div>
    // }
    // if (value == undefined) {
    //   this.setState({ value: '' })
    // }
    // 将只读逻辑提到前面
    // if (readOnly || parentDisabled) {
    //   return <div className='dis-editable'>{value || <span style={{ opacity: .3 }}>--</span>}</div>;
    // }
    // if (value !== '' && disabled !== 1) {
    //   if (showcount == 1) {
    //     return <>
    //       <Input style={style} className={!maxLength ? 'ant-input-paddingright' : ''} placeholder={`${placeholder}`} autoFocus={autoFocus} onPressEnter={this.onInputEnter.bind(this)} onChange={this.handleOnChange.bind(this)} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onFocus={this.handleFocus} onBlur={this.handleBlur} {...props} />
    //       <img src='./img/inputClose.svg' style={{ position: 'absolute', top: '34%', right: '33px', cursor: 'pointer', width: 12, zIndex: 9, opacity: this.state.opacity }} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.clear} />
    //     </>
    //   }
    //   return <>
    //     <Input style={style} className='ant-input-padding' placeholder={`${placeholder}`} autoFocus={autoFocus} onPressEnter={this.onInputEnter.bind(this)} onChange={this.handleOnChange.bind(this)} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onFocus={this.handleFocus} onBlur={this.handleBlur} {...props} />
    //     <img src='./img/inputClose.svg' style={{ position: 'absolute', top: '29%', right: '6px', cursor: 'pointer', width: 12, opacity: this.state.opacity }} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={this.clear} />
    //   </>
    // }
    debugger
    return (
      <Input />
      // this.props && this.props.widget && this.props.widget.name === 'YDFDivider' ?
      //   <Input style={style} placeholder={`${placeholder}`} autoFocus={autoFocus} onPressEnter={this.onInputEnter.bind(this)} onChange={this.handleOnChange.bind(this)} onFocus={this.handleFocus} onBlur={this.handleBlur} {...props} maxLength={50} />
      //   :
      //   <Input style={style} placeholder={`${placeholder}`} autoFocus={autoFocus} onPressEnter={this.onInputEnter.bind(this)} onChange={this.handleOnChange.bind(this)} onFocus={this.handleFocus} onBlur={this.handleBlur} {...props} />
    )
  }
}

export default ARInput
