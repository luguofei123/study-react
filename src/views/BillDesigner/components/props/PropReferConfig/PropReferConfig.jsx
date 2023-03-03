import React from 'react'
import { Layout, Tabs, Divider, Input } from 'antd'
import {Message} from "@tinper/next-ui";
import ReferTreeSelect from './ReferTreeSelect';
import ReferTab from './ReferTab'
import ParamsTab from './ParamsTab'
import { getEntyFields, getReferFields } from '@/api/pvdf/BillDesign'
import { cloneDeep } from 'lodash'
import ht from '../../../utils/HelperTools'
import { guid } from '_u/utils'
import { getIsShowRepaceItems } from './util';
const { Content, Sider } = Layout;
const { TabPane } = Tabs
const fixedCls = 'ydf-refer-config'
export default class PropReferConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.height,
      enty: this.props.widget.enty ? { ...this.props.widget.enty } : { info: {} },
      referFields: [], masterFields: [], paramsLeft: []
    }
    if (!this.state.enty.fieldNames) {
      this.state.enty.fieldNames = { label: '', value: '' }
    }
  }
  refReferTab = React.createRef()
  refParamTab = React.createRef()
  update = ({ height: height, width, top, left }) => {
    this.setState({ height })
  }
  getReferConfig() {
    if(this.state.enty) {
      return { ...this.state.enty, fields: [...this.state.referFields] }
    }else{ 
      return null
    }
  }
  checkBeforeClose() {
    const { enty } = this.state;
    let isOk = true;
    if(enty) {
      const { replaceItems } = enty;
      if(replaceItems && replaceItems.length > 0) {
        // 默认的参照代入配置参照可用字段不能为空
        const isIn = replaceItems.some(item=>item.locked && (!item.from || JSON.stringify(item.from) === '{}'))
        if(isIn) {
          Message.warning('默认参照代入配置中参照可用字段不能为空')
          return false;
        }
      }
    } else {
      return false;
    }
    return isOk
  }
  handleURLChange = (e) => {
    const { enty } = this.state
    enty.postApi = e.target.value
    this.setState({ enty })
  }
  // 参数配置保存
  handleParamsChange = ({ items, text, vops }) => {
    let { enty } = this.state
    enty.queryParams = { items, text, vops }
    this.setState({ enty })
  }
  //参照变化
  handleReferChange(values, key) {
    let { enty } = this.state
    enty[key] = cloneDeep(values)
    this.setState({ enty })
  }

  handleTreeSelect = (node) => {

    const { info } = node
    if (!info) {
      return false
    }

    let enty = { ...this.state.enty, ...node }
    // 更新title属性
    // 避免回显携带的title属性不被重置
    enty.title = enty.info.refName
    const isShowRepaceItems = getIsShowRepaceItems(this.props.widget)
    //需要生成默认代入
    if (isShowRepaceItems && (!enty.replaceItems || !enty.replaceItems.length)) {
      const { key, dataField, label, parentKey } = this.props.widget
      const formNode = ht.getParentNodeByKey(key)
      // const toFormKey = formNode.key
      const toFormKey = parentKey
      if (formNode.enty) {
        const { tableName, name, code } = formNode.enty.info || {}
        const { refName, uri, refCode } = info
        enty.replaceItems = [{
          id: guid(),
          locked: true,//锁定
          from: { displayname: `${refName}.id`, tablename: `${refCode}`, fieldname: 'id' },
          to: { displayname: `${name}.${label}`, rawDisplayname: label, tablename: `${tableName}`, fieldname: `${dataField}`, toFormKey }
        }]
        this.refReferTab.current.setStateFromProps(enty)
      } else {
        console.log('未配置实体', formNode)
      }
    }

    this.setState({ enty })
    this.getReferFields(node)
  }
  /////

  // 取参照字段
  async getReferFields({ info }) {
    let referFields = []
    let paramsLeft = []
    if(info) {
      let res = await getReferFields(info)
      const tablename_cn = info.refName
      const tablename = info.refCode
      res.data.forEach((fld => {
        const { displayname, fieldname } = fld
        referFields.push({ displayname, fieldname, tablename, tablename_cn })
        paramsLeft.push({ code: fieldname, label: displayname })
      }))
    }
    this.setState({ referFields, paramsLeft })
  }

  // 取单据区域数据
  async getMasterFields() {
    let masterFields = []
    const transTableFieldsToNode = async (parentKey, tablename_cn, fields, oldFields) => {
      const children = []
      fields.forEach((fld => {

        const { displayname, fieldname, tablename, refuri } = fld
        children.push({ toFormKey: parentKey, displayname, fieldname, tablename, tablename_cn, key: `${parentKey}_${fieldname}` })
        //有参照的增加_displayValue
        let needDisplayName = false;
        if (refuri) {
          needDisplayName = true
        } else {
          // oldField是当前ui元数据，fields是selectEntityByUri接口拿到的字段实体信息
          // 存在字段的实体里refuri是空（即不是参照）
          // 但是在单据设计器里为字段配置了参照
          // 这种的也需要加上displayname
          if(oldFields && oldFields.length) {
            const uiField = oldFields.find(item=>item.fieldname === fieldname && item.tablename === tablename)
            if(uiField && uiField.dataType === 'refer') {
              needDisplayName = true;
            }
          }
        }
        if(needDisplayName) {
          children.push({ toFormKey: parentKey, displayname: `${displayname}显示名`, fieldname: `${fieldname}.displayname`, tablename, tablename_cn, key: `${parentKey}_${fieldname}_displayValue` })
        }
      }))
      return children
    }

    const { parentKey, biztype, dataType, nodeType } = this.props.widget
    // 构造树
    const buildEntyTree = async (data) => {
      for (let idx = 0, len = data.length; idx < len; idx++) {
        const item = data[idx]
        if (item.enty && item.dataType === 'enty' && item.name !== 'root') {
          if (item.enty && item.enty.info) {
            const { code } = item.enty.info
            // 生成树
            const res = await getEntyFields(item.enty.info)
            // 显示树的组件标签名为树节点，方便确认代入位置
            const name = item.label || item.enty.info.name
            //这里应该处理一下结构
            const fields = await transTableFieldsToNode(item.key, name, res.data, item.children)
            masterFields.push({ displayname: name, fieldname: item.key, children: [...fields], key: item.key })
          }
        }
        if (item.children && item.children.length) {
          await buildEntyTree(item.children)
        }
      }
    }
    const pnode = ht.getNodeByKey('root')
    await buildEntyTree([pnode])

    this.setState({ masterFields })
  }

  componentDidMount() {
    if (this.props.widget.enty !== this.state.enty) {
      this.setState({ enty: { ...this.props.widget.enty } })
    }
    if (this.props.widget.enty) {
      this.getReferFields(this.props.widget.enty)
    }
    this.getMasterFields()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.widget && nextProps.widget && JSON.stringify(this.props.widget.enty) !== JSON.stringify(nextProps.widget.enty)) {
      this.setState({ enty: { ...nextProps.widget.enty } })
      setTimeout(() => {
        this.getReferFields(nextProps.widget.enty)
        this.getMasterFields()
      }, 30)

    }
  }

  render() {
    let { enty = { info: { refName: '' } }, referFields, masterFields, paramsLeft = [], height } = this.state
    const { widget } = this.props
    return (
      <Layout className={`${fixedCls}`}>
        <Sider width={300} style={{ height: '100%', background: '#fff', borderRight: '1px #d9d9d9 solid', overflow: 'auto' }}>
          <ReferTreeSelect widget={widget} height={height} onSelect={this.handleTreeSelect} />
        </Sider>
        <Content style={{ background: '#fff', padding: '16px' }}>
          <div className={`${fixedCls}-info`}>
            <div style={{ paddingBottom: '8px' }}><span>参照：{enty.info && enty.info.refName}</span><span>uri：{enty.info && enty.info.refCode}</span></div>
            <div><span style={{ marginRight: 0 }}>数据接口：</span><span><Input value={enty.postApi} onChange={this.handleURLChange} style={{ width: 595 }} placeholder="输入数据接口后，数据源将通过接口取数！" /></span></div>

          </div>
          <Tabs defaultActiveKey="replaceTab" size="small" className={`${fixedCls}-tab`} style={{ margin: '0 16px' }}>
            <TabPane tab="代入配置" key="replaceTab" >
              <ReferTab widget={widget} ref={this.refReferTab} refer={enty} referFields={referFields} masterFields={masterFields} onChange={this.handleReferChange.bind(this)} />
            </TabPane>
            <TabPane tab="过滤参数" key="paramTab" className={`${fixedCls}-tab`}>
              <ParamsTab ref={this.refParamTab} queryParams={enty.queryParams || {}} leftFields={paramsLeft} rightVals={masterFields} onChange={this.handleParamsChange} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    )
  }
}
