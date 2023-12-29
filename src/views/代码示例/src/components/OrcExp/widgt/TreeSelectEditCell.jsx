/*
 * @Descripttion:  费用下拉树选择
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-14 12:58:50
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-24 11:15:55
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/widgt/TreeSelectEditCell.jsx
 */
import { Component } from 'react';
const { Button, Table, Icon, Dropdown, Menu, TreeSelect } = TinperNext
const { TreeNode } = TreeSelect;
const { Item } = Menu;
export default class TreeSelectEditCell extends Component {
    refWarp;
    constructor(props) {
        super(props);
        this.state = {
            editable: false
        };
        this.refWarp = React.createRef();
    }
    componentDidMount () {
        console.log('初始化')
    }
    edit = () => {
        console.log('shshhshhshh')
        this.setState({ editable: true }, () => {
            this.refWarp?.rcTreeSelect?.focus();
        });
    };
    handleSelect = (_values, node) => {
        debugger
        if (this.props.onChange) {
            let obj = {
                value: node['data-params'].expenseItemCode,
                name: node['data-params'].expenseItemName
            }
            this.props.onChange(obj);
        }
    };
    commitChange = () => {
        this.setState({ editable: false });
    };
    renderTreeNode (data) {
        return data.map(item => {
            if (item.children) {
                return <TreeNode selectable={item.isEnd === 1} value={item.expenseItemCode + ' ' + item.expenseItemName} data-params={item} title={item.expenseItemName} key={item.id}>
                    {this.renderTreeNode(item.children)}
                </TreeNode>;
            }
            return <TreeNode selectable={item.isEnd === 1} value={item.expenseItemCode + ' ' + item.expenseItemName} data-params={item} title={item.expenseItemName} key={item.id}></TreeNode>;
        });
    }
    render () {
        const { editable } = this.state;
        let { treeData, value, name } = this.props
        return editable ? (<div>
            <TreeSelect ref={el => (this.refWarp = el)} showSearch value={value} dropdownMatchSelectWidth={200} dropdownStyle={{ minHeight: 250, overflow: 'auto' }} placeholder="请选择" treeDefaultExpandAll onSelect={this.handleSelect.bind(this)} onBlur={this.commitChange.bind(this)}>
                {this.renderTreeNode(treeData)}
            </TreeSelect>
        </div>) : (<div style={{ minWidth: 100, minHeight: 20 }} onClick={this.edit}>
            {name || " "}
        </div>);
    }
}