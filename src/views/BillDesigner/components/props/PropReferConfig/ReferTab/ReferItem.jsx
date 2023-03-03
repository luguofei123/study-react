import React from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import YDFSelect from '_c/YDFSelect'
import YDFCheckbox from '_c/YDFCheckbox'
import ReferTreeModal from './ReferTreeModal';
class ReferItem extends React.Component {
  constructor(props) {
    super(props)
  }
  treeTitleRender = (node, searchValue)=>{
    function getContent(text) {
      if(!searchValue) {
        return text;
      } else {
        const index = text.search(searchValue);
        const beforeStr = text.substr(0, index);
        const afterStr = text.substr(index + searchValue.length);
        return index > -1 ? (<span className='searched-title'>
          {beforeStr}
          <span className='searched-value'>{searchValue}</span>
          {afterStr}
        </span>) : text;
      }
    }
    const { displayname, fieldname } = node;
    return (<span title={`${displayname}(${fieldname})`}>{getContent(displayname)}<span style={{ color:'#888' }}>({getContent(fieldname)})</span></span>)
  };
  handleChangeFrom (value) {
    const newRefer = {
      ...this.props.refer
    }
    if(value) {
      const { tablename, tablename_cn, displayname, fieldname } = value
      newRefer.from = {
        displayname: `${tablename_cn}.${displayname}`,
        tablename,
        fieldname
      }
    } else {
      newRefer.from = {}
    }
    if (this.props.onValuesChange) {
      this.props.onValuesChange(newRefer)
    }
  }
  handleChangeTo (node) {
    const { toFormKey, tablename, tablename_cn, displayname, fieldname } = node
    const to = {
      displayname: `${tablename_cn}.${displayname}`,
      rawDisplayname: displayname,
      tablename,
      fieldname,
      toFormKey
    }
    const newRefer = {
      ...this.props.refer,
      to
    }
    if(toFormKey && toFormKey !== this.props.widget.parentKey) {
      newRefer.isDisplayField = false; // 避免修改前为显示字段
    }
    this.props.onValuesChange(newRefer)
  }
  handleDisplayChange(value) {
    const newRefer = {
      ...this.props.refer,
      isDisplayField: value
    }
    this.props.onValuesChange(newRefer)
  }
  handleDelClick () {
    if (this.props.onDelete) {
      this.props.onDelete()
    }
  }
  render () {
    const { style, fromFields = [], toFields, refer, widget } = this.props
    const { from, to, locked, isDisplayField } = refer
    const showFromFields = fromFields.map(item => {
      const { displayname, fieldname } = item;
      // 将fieldname显示在选项中
      const label = (<span title={`${displayname}(${fieldname})`}>{displayname}<span style={{ color:'#888' }}>({fieldname})</span></span>)
      return {
        ...item,
        showLabel: label
      }
    })
    const fromFieldNames = { label: 'showLabel', value: 'fieldname' }
    const filterOption = (inputValue, option) => {
      const { displayname, fieldname } = option;
      const upperVal = inputValue.toUpperCase();
      return displayname.toUpperCase().includes(upperVal) || fieldname.toUpperCase().includes(upperVal)
    }
    let isShowCheck = true; // 标记是否可以设置为业务显示字段
    let toFieldValue = null;
    if(to && typeof to === 'object') {
      toFieldValue = {fieldname:to.fieldname, displayname:to.rawDisplayname}
      if(to.toFormKey && to.toFormKey !== widget.parentKey) {
        isShowCheck = false; // 当被带入字段的Formkey跟当前组件的FormKey不一致时，不可设置为业务显示字段
      }
    }

    return (
      <div style={style}>参照带入
        <span className="refer-tab-col"><YDFSelect
          style={{ width: 250 }}
          placeholder="请选择参照字段"
          onChange={this.handleChangeFrom.bind(this)}
          labelInValue={true}
          data={showFromFields}
          value={from.fieldname}
          fieldNames={fromFieldNames}
          filterOption={filterOption}
        /></span> <span className="refer-tab-col">
          <ReferTreeModal style={{ width: 250 }}
            treeData={toFields}
            value={toFieldValue}
            placeholder="请选择业务字段"
            onChange={this.handleChangeTo.bind(this)}
            fieldNames={{ title: 'displayname', key: 'fieldname' }}
            disabled={locked}
            titleRender={this.treeTitleRender}
          />
        </span>
          <span className="refer-tab-col display-field">
            {isShowCheck ?
              <YDFCheckbox
                showLabel={false}
                value={isDisplayField}
                onChange={this.handleDisplayChange.bind(this)}
              ></YDFCheckbox> : ''}
          </span>
        {!locked ? <DeleteOutlined className={"button"} onClick={this.handleDelClick.bind(this)} /> : ''}
      </div>
    )
  }
}

export default ReferItem