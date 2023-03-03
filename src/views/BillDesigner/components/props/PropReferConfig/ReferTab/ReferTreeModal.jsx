import React from "react";
import { Input, Button,Modal } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import YDFTreeNext from "_c/YDFTreeNext";
import {Message} from "@tinper/next-ui";
import './referTreeModal.less'
// import { YDFModal } from '_c/YDFModal';
import { Scrollbars } from 'react-custom-scrollbars';
const { Search } = Input;

const message = Message;
class SearchTree extends React.Component {
  refTree = React.createRef();
  onChange(e){
    const { value } = e.target;
    this.refTree.current.doFilter(value);
  }

  getSelectedNode() {
    return this.refTree.current.getSelectedNode()
  }

  render(){
    const { treeData, titleRender, fieldNames, onDoubleClick } = this.props;
    return <div style={{ height: '400px',padding: '8px' }}>
      <Search
        placeholder="请输入关键字"
        onChange={this.onChange.bind(this)}
        style={{ marginBottom: '8px' }}
      />
      <Scrollbars
        style={{ height: `calc(100% - 36px)`, borderRadius: '4px' }}
      >
        <YDFTreeNext 
          ref={this.refTree} 
          treeData={treeData} 
          fieldNames={fieldNames}
          defaultExpandAll={true}
          nodeFilterProp={[ 'fieldname', 'displayname' ]}
          titleRender={titleRender}
          onDoubleClick={onDoubleClick}
        />
      </Scrollbars>
    </div>
  }
}


class ReferTreeModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.value || null,
      isModalVisible: false
    }
  }

  refTree = React.createRef();

  showModal() {
    this.setState({
      isModalVisible: true
    })
  }

  handleOk(data) {
    let node = null;
    if(data && data.node) {
      node = data.node;
    } else {
      node = this.refTree.current.getSelectedNode()
    }
    
    if(!node){
      message.error('请选择数据！')
      return
    }

    const { onChange } = this.props
    this.setState({
      value: {...node}
    })
    if(onChange) {
      onChange(node);
    }
    this.setState({
      isModalVisible: false
    })
  }
  
  onDoubleClick(data) {
    this.handleOk(data)
  }

  renderTree() {
    const { treeData, titleRender } = this.props;
    return <SearchTree
      ref={this.refTree} 
      treeData={treeData}
      titleRender={titleRender}
      onDoubleClick={this.onDoubleClick.bind(this)}
    ></SearchTree>
  }

  render() {
    const { style, placeholder, disabled, titleRender } = this.props
    const { showModal, handleOk, state } = this;
    let { value, displayValue, isModalVisible } = state
    //如果value是对象一般是属性配置的时候
    if (value && typeof (value) === 'object') {
      if(titleRender) {
        value = titleRender(value)
      } else {
        value = value.displayValue || value.value
      }
    } else {
      value = displayValue || value
    }
    return <span className={"refer-tree" + (disabled ? ' refer-tree-disabled' : '')} style={style}>
      <span className="refer-div"
      >
        {value?<span className="value-div">{value}</span>:<span className="placeholder-div">{placeholder}</span>}
      </span>
      <Button 
        type="default"
        style={{ background: 'transparent' }} 
        disabled={disabled} 
        icon={<BarsOutlined style={{ fontSize: '12px', background: 'transparent' }} />} 
        onClick={showModal.bind(this)}
      />
      <Modal
        title="选择数据"
        okText="确定"
        cancelText="取消"
        destroyOnClose
        maskClosable={false}
        width={550}
        visible={isModalVisible}
        onOk={handleOk.bind(this)}
        onCancel={() => { this.setState({ isModalVisible: false }) }}
      >
        {this.renderTree()}
      </Modal>
    </span>
    // return <Input.Group compact className="ydf-select" style={style}>
    //   <Input
    //     placeholder={placeholder}
    //     style={{ width: 'calc(100% - 200px)', background: 'transparent' }}
    //     value={value}
    //     disabled={disabled}
    //     autoFocus={autoFocus}
    //   />
    //   <Button 
    //     type="default"
    //     style={{ background: 'transparent' }} 
    //     disabled={disabled} 
    //     icon={<BarsOutlined style={{ fontSize: '18px', background: 'transparent' }} />} 
    //     onClick={showModal.bind(this)}
    //    />
    //   <Modal
    //     title="选择数据"
    //     okText="确定"
    //     cancelText="取消"
    //     destroyOnClose
    //     width={550}
    //     visible={isModalVisible}
    //     onOk={handleOk.bind(this)}
    //     onCancel={() => { this.setState({ isModalVisible: false }) }}
    //   >
    //     {this.renderTree()}
    //   </Modal>
    // </Input.Group>
  }
}

export default ReferTreeModal