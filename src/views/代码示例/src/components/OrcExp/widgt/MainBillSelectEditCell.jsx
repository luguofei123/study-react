/*
 * @Descripttion: 主票选择
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-14 12:58:50
 * @LastEditors: jiamf1
 * @LastEditTime: 2023-06-17 14:54:22
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/widgt/MainBillSelectEditCell.jsx
 */
import { Component } from 'react';
const { Button, Icon, Menu, Input } = TinperNext
const { Item } = Menu;
export default class MainBillSelectEditCell extends Component {
    refWarp;
    timeHander = null
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false
        };
        this.refWarp = React.createRef();
    }

    // 关联主票-打开弹框
    selectMailBill () {
        this.props.openSelectMainInvoice()
    }
    // 数据改变-清除数据
    inputChange (v) {
        this.props.clearMainBill(this.props.data)
    }
    render () {
        const { value, record } = this.props.data
        return !record.isMainBill ? (<div style={{ display: 'inline-block' }}>
            <Input ref={el => (this.refWarp = el)} type="search" showClose readOnly value={value}
                onChange={this.inputChange.bind(this)} icon={<Icon type="uf-navmenu-light" onClick={this.selectMailBill.bind(this)}></Icon>}/>
        </div>) : (<div style={{ minWidth: 100, minHeight: 20 }}>
        </div>);
    }
}