import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { Scrollbars } from 'react-custom-scrollbars'
import YDFTree from '_c/YDFTree'
import { getRefers } from '@/api/pvdf/BillDesign.jsx'
export default class ReferTreeSelect extends Component {
  state = {
    entyFields: [],
    treeData: [],
    expandedKeys: [],
    selectedKeys: [],
    search: ''
  };


  onSelect = ({ node, event, changed }) => {
    if (this.props.onSelect) {
      this.props.onSelect(node, true)
    }

    this.setState({ selectedKeys: [node.value] })
  }
  onExpand = (expandedKeysValue) => {
    this.setState({ 'expandedKeys': expandedKeysValue });
  }
  //
  async componentDidMount() {
    let uri = '', refCode = ''
    const { enty, refuri = '' } = this.props.widget
    if (enty && enty.info) {
      uri = enty.info.uri
      refCode = enty.info.refCode
      const df = refCode.split('.')
      refCode = df[df.length - 1]
    }

    //如果是refuri==='',自定义参照可以重新配置
    const res = await getRefers(refuri === '' ? { entityUri: '', refCode: '' } : { entityUri: uri, refCode })
    let treeData = [...res.data]
    if (this.state.selectedKeys.length === 0 && treeData.length) {
      const expandedKeys = [enty && enty.info && enty.info.domain ? enty.info.domain : treeData[0].value]
      const selectedKeys = [enty && enty.info && enty.info.refCode ? enty.info.refCode : treeData[0].children[0].value]
      this.setState({ treeData, expandedKeys, selectedKeys, entyFields: [...res.data] })
    } else {
      this.setState({ treeData, entyFields: [...res.data] })
    }
  }

  /* 
  * 模糊搜索
  */
  onChange(e) {
    const { value } = e.target;
    this.setState({ search: value }, () => {
      // let { treeData } = this.state
      let { entyFields, search } = this.state
      const data = this.filterTreeData(JSON.parse(JSON.stringify(entyFields)), search)
      this.setState({ treeData: data })
    })
  }

  /* 
* 模糊搜索
*/
  filterTreeData(items, search) {

    if (!items) {
      return [];
    }
    return items
      .filter((item) => {
        if (item.children) {
          return true
        }
        const flag = item.label.includes(search);
        return flag;
      })
      .map((item) => {
        if (item.children) {
          item.children = this.filterTreeData(item.children, search);
        }
        return item;
      })
      .filter((item) => {
        if (!item.children) {
          return true;
        }
        return item.children.length > 0;
      });
  }

  render() {
    const { treeData, expandedKeys, selectedKeys } = this.state
    const fieldNames = { title: 'label', key: 'value', children: 'children' }
    let props = {
      value: '',
      onSelect: this.onSelect,
      treeData,
      fieldNames
    }
    const { height = 400 } = this.props
    return (
      <div>
        <Input
          style={{
            width: '270px',
            margin: '8px'
          }}
          suffix={<SearchOutlined />}
          onChange={this.onChange.bind(this)}
        />



        <Scrollbars style={{ height: `${height}px` }}>
          <YDFTree {...props}
            expandedKeys={expandedKeys} selectedKeys={selectedKeys} style={{ marginLeft: '1px' }}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
          />
        </Scrollbars>

      </div>
    );
  }
}