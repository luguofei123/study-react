import React from 'react'
import { SketchPicker } from 'react-color';
import { BgColorsOutlined } from '@ant-design/icons';
import { Col, Row, Form, Select, InputNumber, Input, Popover, Icon } from 'antd'
import './style.less'
const prefixCls = 'lcd-border-config'
export default class PropBorderConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    borderValue: '',
    borderStyle: '',
    borderWidth: '',
    borderColor: '',
    borderFull: {},
    borderStyleOptions: [
      {
        label: '实线',
        value: 'solid'
      },
      {
        label: '虚线',
        value: 'dashed'
      },
      {
        label: '双实线',
        value: 'double'
      },
    ],
    borderValueOptions:['borderTop','borderLeft','borderFull','borderRight','borderBottom']
  }

  setBorder = (value) => {
    const newState = {
      borderValue: value
    }
    const { borderFull = {} } = this.state;
    const { 
      borderWidth = '',
      borderStyle = '',
      borderColor = ''
    } = this.getBorderConfig(value, borderFull)
    newState.borderWidth = borderWidth
    newState.borderStyle = borderStyle
    newState.borderColor = borderColor
    this.setState(newState)
  }

  updateBorderConfig(key, value) { // 更新borderFull中的数据
    const { borderValue, borderFull = {}, borderValueOptions } = this.state;
    const newBorderFull = { ...borderFull }
    if(borderValue === 'borderFull') {
      borderValueOptions.forEach(item=>{
        if(item !== 'borderFull') {
          newBorderFull[item] = {
            ...newBorderFull[item], 
            [key]: value
          };
        }
      })
    } else {
      newBorderFull[borderValue] = {
        ...newBorderFull[borderValue], 
        [key]: value
      };
    }
    return newBorderFull
  }
  setBoderStyle = (value) =>{
    const newState = { borderStyle: value }
    const { borderValue } = this.state;
    if(borderValue) {
      newState.borderFull = this.updateBorderConfig('borderStyle', value)
    }
    this.setState(newState, () => { 
      if(borderValue) {
        this.onChange()
      } 
    })
  }

  setBoderWidth = (value) =>{
    const newState = { borderWidth: value }
    const { borderValue } = this.state;
    if(borderValue) {
      newState.borderFull = this.updateBorderConfig('borderWidth', value)
    }
    this.setState(newState, () => { 
      if(borderValue) {
        this.onChange() 
      }
    })
  }

  setBoderColor = (value) =>{
    const newState = { borderColor: value.hex }
    const { borderValue } = this.state;
    if(borderValue) {
      newState.borderFull = this.updateBorderConfig('borderColor', value.hex)
    }
    this.setState(newState, () => { 
      if(borderValue) {
        this.onChange() 
      }
    })
  }
  
  handleonChange(value) {
    this.setBoderColor({ hex: value.borderColor })
  }

  onChange = () => {
    //if (this.props.onChange) {
      const { borderFull} = this.state
      this.props.onChange({ ...borderFull })
    //}
  }
  
  getBorderConfig(borderValue, borderFull = {}) {
    if(borderValue === 'borderFull') {
      const fullStyle = {};
      const { borderTop, borderRight, borderLeft, borderBottom } = borderFull;
      // 只有当四个边框样式统一时，才会回显
      if(borderTop && borderRight && borderLeft && borderBottom) {
        const { borderWidth: tBorderWidth, borderStyle: tBorderStyle, borderColor: tBorderColor } = borderTop || {}
        const { borderWidth: lBorderWidth, borderStyle: lBorderStyle, borderColor: lBorderColor } = borderLeft || {}
        const { borderWidth: rBorderWidth, borderStyle: rBorderStyle, borderColor: rBorderColor } = borderRight || {}
        const { borderWidth: bBorderWidth, borderStyle: bBorderStyle, borderColor: bBorderColor } = borderBottom || {}
        if((tBorderWidth || tBorderWidth === 0) 
        && tBorderWidth === lBorderWidth && lBorderWidth === rBorderWidth && rBorderWidth === bBorderWidth) {
          fullStyle.borderWidth = tBorderWidth
        }
        if(tBorderStyle
        && tBorderStyle === lBorderStyle && lBorderStyle === rBorderStyle && rBorderStyle === bBorderStyle) {
          fullStyle.borderStyle = tBorderStyle
        }
        if(tBorderColor
        && tBorderColor === lBorderColor && lBorderColor === rBorderColor && rBorderColor === bBorderColor) {
          fullStyle.borderColor = tBorderColor
        }
      }
      return fullStyle
    } else {
      return borderFull[borderValue] || {}
    }
  }

  componentDidMount() {
    const { value = {} } = this.props;
    const newState = {
      ...this.state,
      borderFull: {...value}
    };
    if(newState.borderValue && newState.borderFull) {
      const { 
        borderWidth = '',
        borderStyle = '',
        borderColor = ''
      } = this.getBorderConfig(borderValue, borderFull)
      newState.borderWidth = borderWidth
      newState.borderStyle = borderStyle
      newState.borderColor = borderColor
    }
    this.setState(newState)
  }
  toCss(borderObj = {}) {
    const {
      borderStyle, borderWidth, borderColor
    } = borderObj
    const arr = [];
    if(borderWidth || borderWidth === 0) {
      arr.push(`${borderWidth}px`)
    }
    if(borderStyle) {
      arr.push(borderStyle)
    }
    if(borderColor) {
      arr.push(borderColor)
    }
    return arr.join(' ')
  }
  borderOption = () =>{
    const { borderValueOptions, borderValue, borderFull = {} } = this.state
    return borderValueOptions.map(item => {
      const key = item == 'borderFull' ? 'border' : item
      const cssValue = item === 'borderFull' ? '2px solid #7f8082' : this.toCss(borderFull[item])
      return <div className={`${prefixCls}-${item} comstyle  ${borderValue === item ? 'border-active' : ''}`} onClick={e=>this.setBorder(item)}>
                <span style={{ [key]: cssValue }}></span>
             </div>
    })
  }

  render() {
    const { borderColor, borderWidth, borderStyle, borderStyleOptions } = this.state
    const colorOption = (
      <Popover
        placement="bottom"
        content={<SketchPicker
          color={borderColor}
          // onChange={(e) => { this.setBoderColor(e) }}
          onChangeComplete={(e) => { this.setBoderColor(e) }}
        />}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            height: 15, width: 15,
            background: borderColor || '#333',
          }} />
        </div>
      </Popover>
    );
    return (
      <div className={`${prefixCls}`}>
        <div className={`${prefixCls}-preview`}>{this.borderOption()}</div >
        <div className={`${prefixCls}-set`}>
          <Form>
            <Form.Item label="样式">
            <Select value={borderStyle} onChange={this.setBoderStyle}
                    options={borderStyleOptions}/>
            </Form.Item>
            <Form.Item label="粗细">
              <InputNumber value={borderWidth} onChange={this.setBoderWidth} min={0} max={5}/>
            </Form.Item>
            <Form.Item label="颜色">
              <Input value={borderColor}
                className={`${prefixCls}-color`}
                onChange={e => this.handleonChange({ borderColor: e.target.value })}
                placeholder="请填写颜色，以#开头，如：#f0f0f0"
                suffix={colorOption} />
            </Form.Item>
          </Form>
        </div>
      </div >
    )
  }
}