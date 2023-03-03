import React from 'react'
import { Form, InputNumber } from 'antd'
const prefixCls = 'lcd-border-radius-config'
import './style.less'

const styleKeyMap = {
  'borderTopLeftRadius': 'borderTopLeftRadius',
  'borderTopRightRadius': 'borderTopRightRadius',
  'borderBottomLeftRadius': 'borderBottomLeftRadius',
  'borderBottomRightRadius': 'borderBottomRightRadius'
}
export default class PropBorderRadiusConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    borderValueOptions:['borderTopLeftRadius','borderTopRightRadius','full','borderBottomLeftRadius','borderBottomRightRadius'],
    radiusValue: '',
    radiusWidth: '',
    radiusFull: {} // 存放四角的圆角大小
  }

  getRadiusWidth(radiusValue, radiusFull = {}) {
    if(radiusValue === 'full') {
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius
      } = radiusFull;
      // 只有当四个圆角大小统一时，才会回显
      if('borderTopLeftRadius' in radiusFull && 'borderTopRightRadius' in radiusFull && 'borderBottomLeftRadius' in radiusFull && 'borderBottomRightRadius' in radiusFull
      && borderTopLeftRadius === borderTopRightRadius && borderTopRightRadius === borderBottomLeftRadius && borderBottomLeftRadius === borderBottomRightRadius) {
        return borderTopLeftRadius || borderTopLeftRadius === 0 ? borderTopLeftRadius : ''
      }
    } else {
      return radiusFull[radiusValue] || radiusFull[radiusValue] === 0 ? radiusFull[radiusValue] : ''
    }
  }

  setBorder = (value) => {
    const { radiusFull = {} } = this.state;
    let radiusWidth = this.getRadiusWidth(value, radiusFull)
    this.setState({ radiusValue: value, radiusWidth })
  }

  setBoderWidth = (value) =>{
    const { radiusValue, radiusFull = {} } = this.state;
    const newState = { radiusWidth: value }
    if(radiusValue) { // 如果有选中圆角位置，才更新圆角大小
      let newRadiusFull = { ...radiusFull }
      if(radiusValue === 'full') { // 如果圆角位置是全部，更新所有
        newRadiusFull = {
          borderTopLeftRadius: value,
          borderTopRightRadius: value,
          borderBottomLeftRadius: value,
          borderBottomRightRadius: value
        }
      } else {
        newRadiusFull[radiusValue] = value
      }
      newState.radiusFull = newRadiusFull
    }
    this.setState(newState, () => { 
      if(radiusValue) { // 如果有选中的圆角位置，才向外触发
        this.onChange() 
      }
    })
  }

  onChange = () => {
    //if (this.props.onChange) {
      const { radiusFull } = this.state
      this.props.onChange({ ...radiusFull })
    //}
  }
  
  borderOption = () =>{
    const { borderValueOptions, radiusValue, radiusFull } = this.state
    return borderValueOptions.map(item => {
      const borderRadius = this.getRadiusWidth(item, radiusFull)
      let borderRadiusStyle = {};
      if(( borderRadius|| borderRadius === 0) && item !== 'full') {
        borderRadiusStyle[item] = `${borderRadius}px`
      }
      return <div className={`${prefixCls}-${item} comstyle  ${radiusValue === item ? 'border-active' : ''}`} onClick={e=>this.setBorder(item)}>
                <span style={borderRadiusStyle}></span>
             </div>
    })
  }
  componentDidMount() {
    const { value = {} } = this.props;
    this.setState({
      radiusFull: { ...value }
    })
  }

  render() {
    const { radiusWidth } = this.state
    return (
      <div className={`${prefixCls}`}>
            <div className={`${prefixCls}-preview`}>{this.borderOption()}</div >
        <div className={`${prefixCls}-set`}>
          <Form>
            <Form.Item label="粗细">
              <InputNumber value={radiusWidth} onChange={this.setBoderWidth} min={0} max={16}/>
            </Form.Item>
          </Form>
        </div>
      </div >
    )
  }
}