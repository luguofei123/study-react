import React from 'react'
import Term from '_c/YDFTerm'
const envTree = [{
  key: 'root', title: '系统参数', children: [
    { key: 'mofdiv', title: '区划', children: [{ key: 'mofdiv.mofDivId', title: '区划ID' }, { key: 'mofdiv.mofDivCode', title: '区划编码' }, { key: 'mofdiv.mofDivName', title: '区划名称' }] },
    { key: 'agency', title: '单位', children: [{ key: 'agency.agencyId', title: '单位ID' }, { key: 'agency.agencyCode', title: '单位编码' }, { key: 'agency.agencyName', title: '单位名称' }] },
    { key: 'dept', title: '部门', children: [{ key: 'dept.deptId', title: '部门ID' }, { key: 'dept.deptCode', title: '部门编码' }, { key: 'dept.deptName', title: '部门名称' }] },
    { key: 'user', title: '用户', children: [{ key: 'user.userId', title: '用户ID' }, { key: 'user.userCode', title: '用户编码' }, { key: 'user.userName', title: '用户名称' }] },
    { key: 'date', title: '业务日期' }]
}]
export default class ParamsTab extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    selectorCfg: {
      log: {
        placeholder: '',
        data: [
          { code: 'and', label: '并且' },
          { code: 'or', label: '或者' }
        ]
      },
      l: { placeholder: '请选择字段', data: this.props.leftFields || [] },
      op: {
        placeholder: '请选择操作符',
        data: [
          { code: 'gt', label: '大于' },
          { code: 'lt', label: '小于' },
          { code: 'eq', label: '等于' },
          { code: 'neq', label: '不等于' },
          { code: 'egt', label: '大于等于' },
          { code: 'elt', label: '小于等于' },
          { code: 'in', label: '包含' },
          { code: 'is_null', label: '为空' },
          { code: 'is_not_null', label: '非空' }
        ]
      },
      r: {
        placeholder: '请选择值类型',
        data: [{ code: 'field', label: '字段', values: this.props.rightVals }, { code: 'formula', label: '公式表达式' }, { code: 'const', label: '常量' }, { code: 'env', label: '系统参数', leafRequired: 1, values: envTree }]
      },
      values: this.props.rightVals,
      fieldNames: { key: 'fieldname', title: 'displayname', children: 'children' }
    },
    items: this.props.queryParams && this.props.queryParams.items ? this.props.queryParams.items : [],
    text: ''
  }
  onChange = (items, text, vops) => {
    this.setState({ items, text, vops })
    if (this.props.onChange) {
      this.props.onChange({ items, text, vops })
    }
  }
  getData = () => {
    return { items: this.state.items, text: this.state.text }
  }
  render() {
    const { selectorCfg, text, items } = this.state
    return (

      <div style={{ margin: ' 0 50px' }}>
        <div style={{ padding: '10px', marginBottom: '15px' }}>{text}</div>
        <Term onChange={this.onChange} items={items} selectorCfg={selectorCfg} />
      </div>
    )
  }
}

