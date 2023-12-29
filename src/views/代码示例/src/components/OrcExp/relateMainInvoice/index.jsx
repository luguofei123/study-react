/*
 * @Descripttion: 关联主票弹框
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-06-16 14:24:33
 * @LastEditors: lugfa
 * @LastEditTime: 2023-09-04 11:28:34
 */

import { Component } from 'react';
import './index.less'
const { Button, Modal, Input, Table, Radio, Message } = TinperNext

const { singleSelect } = Table;
const $message = Message
let SingleSelectTable = singleSelect(Table, Radio);
const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60, render (_text, _record, index) { return index + 1 } },
    { title: '票据类型', dataIndex: 'invoiceTypeName', key: 'invoiceTypeName' },
    { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo' },
    { title: '开票日期', dataIndex: 'invoiceDate', key: 'invoiceDate' },
    { title: '票据金额', dataIndex: 'amountTaxTotal', key: 'amountTaxTotal' },
    { title: '开票内容', dataIndex: 'invoiceContent', key: 'invoiceContent' },
    { title: '查验结果', dataIndex: 'checkStateName', key: 'checkStateName' }
]
export default class RelateMasterInvoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '选择主票',
            showModal: true,
            mainData: [], // 表格数据
            selectBackData: {},
            selectedRowKeys: []
        }
    }
    componentDidMount () {
        const { mainData } = this.props
        this.setState({
            mainTableData: mainData.tableData
        })
    }
    // 搜索
    searchHandle (val) {
        const { mainData } = this.props
        const mainTableData = mainData.tableData
        let arr = []
        mainTableData.forEach(item => {
            let flag = false
            Object.keys(item).forEach(key => {
                if (item[key] && typeof item[key] === 'string' && item[key].includes(val)) {
                    flag = true
                }
            })
            if (flag) {
                arr.push(item)
            }
        })
        this.setState({
            mainTableData: arr
        })
    }
    // 行的点击事件
    onRowClick (record, index) {
        this.setSelectData(record)
    }
    // 行的双击事件
    onRowDoubleClick (record, index) {
        // const obj = this.setSelectData(record)
        // this.props.selectMainInvoiceCallBack(obj)
        // this.closeModal()
    }
    // 关闭弹框
    closeModal () {
        this.setState({
            showModal: false
        })
    }
    // 选择行程确认事件
    confirmModal () {
        if (this.state.selectedRowKeys.length === 0) {
            $message.warning('请选择一条数据')
            return
        }
        this.props.selectMainInvoiceCallBack(this.state.selectBackData)
        this.closeModal()
    }
    // 组装返回的数据
    setSelectData (record) {
        const { mainData } = this.props
        const obj = {
            selectRow: record,
            ...mainData
        }
        this.setState({
            selectBackData: obj
        })
        return obj
    }
    render () {
        const { title, showModal, mainTableData } = this.state
        let rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, _selectedRows) => {
                this.setState({
                    selectedRowKeys
                });
            }
        };
        return <div>
            <Modal className="relateMasterInvoceWrap" title={title} visible={showModal} width={'60%'} onCancel={this.closeModal.bind(this)}>
                <Modal.Body>
                    <div className="searchBox">
                        <Input className="searchInput" type="search" placeholder="请输入关键词搜索" onSearch={this.searchHandle.bind(this)}></Input>
                    </div>
                    <SingleSelectTable
                        columns={columns}
                        data={mainTableData}
                        stripeLine={true}
                        bodyStyle={{ height: '300px' }}
                        bordered
                        rowKey='id'
                        autoCheckedByClickRows={false}
                        rowSelection={rowSelection}
                        onRowClick={this.onRowClick.bind(this)}
                        onRowDoubleClick={this.onRowDoubleClick.bind(this)}></SingleSelectTable>
                </Modal.Body>
                <Modal.Footer>
                    <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.closeModal.bind(this)}>取消</Button>
                    <Button colors='primary' onClick={this.confirmModal.bind(this)}>确定</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}
