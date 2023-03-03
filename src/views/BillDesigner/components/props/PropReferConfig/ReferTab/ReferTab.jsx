import React from 'react'
import { Button, Input, Form } from 'antd'
import ReferItem from './ReferItem'
import YDFSelect from '_c/YDFSelect'
import { guid } from '_u/utils'
import { getIsShowRepaceItems } from '../util'
import "./refer-tab.less"

const fixedCls = 'refer-tab'
class ReferTab extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { 
    fieldLabel: (this.props.refer.fieldNames && this.props.refer.fieldNames.label) ? this.props.refer.fieldNames.label : '',
    labelCode: (this.props.refer.fieldNames && this.props.refer.fieldNames.labelCode) ? this.props.refer.fieldNames.labelCode : '',
    fieldValue: (this.props.refer.fieldNames && this.props.refer.fieldNames.value) ? this.props.refer.fieldNames.value : 'id',
    replaceItems: this.props.refer.replaceItems ? [...this.props.refer.replaceItems] : []
  }
  setStateFromProps({ replaceItems }) {
    this.setState({ replaceItems })
  }
  handleAddNewRefer() {
    const list = this.state.replaceItems
    list.push({ id: guid(), from: '', to: '' })
    this.setState({ replaceItems: [...list] })
    if (this.props.onChange) {
      this.props.onChange(list, 'replaceItems')
    }
  }

  handleDelete(item) {
    const list = this.state.replaceItems
    const idx = list.findIndex(it => it.id === item.id)

    if (idx === -1) {
      return false
    }
    list.splice(idx, 1)
    this.setState({ replaceItems: [...list] })
    if (this.props.onChange) {
      this.props.onChange(list, 'replaceItems')
    }
  }

  handleOnValuesChange(index, item) {
    const list = [...(this.state.replaceItems || [])]
    list[index] = item
    this.setState({ replaceItems: [...list] })
    if (this.props.onChange) {
      this.props.onChange(list, 'replaceItems')
    }
  }
  // 设置fieldNames中的title显示
  handleFieldNamesCodeChange(value) {
    this.setState({ labelCode: value })
    const { fieldLabel, fieldValue } = this.state
    this.props.onChange({ labelCode: value, label: fieldLabel, value: fieldValue }, 'fieldNames')
  }
  // 设置fieldNames.label
  handleFieldNamesLabelChange(value) {
    this.setState({ fieldLabel: value })
    const { labelCode, fieldValue } = this.state
    this.props.onChange({ label: value, labelCode, value: fieldValue }, 'fieldNames')
  }

  render() {
    const { title, referFields = [], masterFields, widget } = this.props
    const { replaceItems, fieldLabel, labelCode } = this.state
    let isShowRepaceItems = getIsShowRepaceItems(widget); // 标记是否显示参照代入设置
    //默认id代入
    const group = replaceItems.map((item, index) => {
      return <ReferItem style={{paddingLeft: '17px'}} key={item.id} fromFields={referFields} toFields={masterFields} refer={item} widget={widget} onValuesChange={this.handleOnValuesChange.bind(this, index)} onDelete={() => this.handleDelete(item)} />
    })
    const selectOptions = referFields.map(item => {
      const { displayname, fieldname } = item;
      // 将fieldname显示在选项中
      const label = (<span title={`${displayname}(${fieldname})`}>{displayname}<span style={{ color:'#888' }}>({fieldname})</span></span>)
      return {
        ...item,
        showLabel: label
      }
    })
    const fieldNames = { label: 'showLabel', value: 'fieldname' }
    const filterOption = (inputValue, option) => {
      const { displayname, fieldname } = option;
      const upperVal = inputValue.toUpperCase();
      return displayname.toUpperCase().includes(upperVal) || fieldname.toUpperCase().includes(upperVal)
    }
    return (
      <div className={`${fixedCls}`}>
        <Form 
          colon={false} labelWrap
          labelCol={{ flex: '70px' }}
          className="refer-fieldnames"
          layout="inline">
          <Form.Item label="显示字段" style={{ width: '600px' }}>
            <YDFSelect
              style={{ width: 250 }}
              allowClear={true}
              placeholder="请选择参照字段"
              onChange={this.handleFieldNamesCodeChange.bind(this)}
              labelInValue={false}
              value={labelCode}
              data={selectOptions.filter(item=>item.fieldname!==fieldLabel)}
              fieldNames={fieldNames}
              filterOption={filterOption}
            />
            <span className="contact-line"></span>
            <YDFSelect
              allowClear={true}
              style={{ width: 250 }}
              placeholder="请选择参照字段"
              onChange={this.handleFieldNamesLabelChange.bind(this)}
              labelInValue={false}
              value={fieldLabel}
              data={selectOptions.filter(item=>item.fieldname!==labelCode)}
              fieldNames={fieldNames}
              filterOption={filterOption}
            />
          </Form.Item>
        </Form>
        { isShowRepaceItems && replaceItems.length > 0 ? <div>
          <span className="refer-tab-col" style={{ paddingLeft: '70px', color: '#999' }}>参照可用字段</span>
          <span className="refer-tab-col" style={{ paddingLeft: '74px', color: '#999' }}>可带入的字段</span>
          <span className="refer-tab-col" style={{ paddingLeft: '74px', color: '#999' }}>业务显示字段</span>
          {group}
        </div> : ''}
        { isShowRepaceItems ? <Button type="link" size={'small'} style={{ marginLeft: '64px', marginTop: '15px' }}
            onClick={this.handleAddNewRefer.bind(this)}>
            点击添加一行
          </Button>: ''
        }
        
      </div>
    )
  }
}

export default ReferTab