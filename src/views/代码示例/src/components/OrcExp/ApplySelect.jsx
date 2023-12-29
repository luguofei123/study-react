/*
 * @Descripttion: 申请单选择界面
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-11 19:15:52
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/ApplySelect.jsx
 */
import { Component } from 'react';
// import axios from 'axios';
import axios from '@/api/api.request'
import service from '@/common/const/service'
import commonMethod from '@/common/utils' // 工具方法
const { Table, Input, Pagination, Message, Checkbox } = TinperNext
const $message = Message
const { multiSelect, sum } = Table;
let ComplexTable = multiSelect(Table, Checkbox);
const columns = [
    {
        title: "序号",
        dataIndex: "index",
        key: "index",
        width: 50,
        render (_text, _record, index) {
            return index + 1;
        },
        fixed: "left",
    },
    { title: "单据编号", dataIndex: "dkBillNo", key: "dkBillNo", titleAlign: 'center', fixed: "left" },
    { title: "单据类型", dataIndex: "billTypeName", key: "billTypeName", titleAlign: 'center' },
    { title: "申请事由", dataIndex: "reason", key: "reason", titleAlign: 'center' },
    {
        title: "申请金额", dataIndex: "amt", key: "amt", width: 100, titleAlign: 'center', contentAlign: 'right', render (_text, _record, index) {
            return commonMethod.toThousandFix(_text);
        }
    },
    {
        title: "可用余额", dataIndex: "ele40Code", key: "ele40Code", width: 100, titleAlign: 'center', contentAlign: 'right', render (_text, _record, index) {
            return commonMethod.toThousandFix(_text);
        }
    },
    { title: "申请人", dataIndex: "proposer", key: "proposer", titleAlign: 'center' },
    { title: "申请日期", dataIndex: "billDate", key: "billDate", titleAlign: 'center' },
    { title: "申请部门", dataIndex: "internalDepName", key: "internalDepName", titleAlign: 'center' }
];
export default class ApplySelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            search: '',
            pagination: {
                showSizeChanger: true,
                current: 1,
                pageSize: 10,
                total: 0
            },
        }
    }
    getTableData = () => {
        return this.state
    }
    componentDidMount () {

        this.getApplyList()

    }
    getApplyList () {
        const { billTypeCode, agencyCodeStr } = this.props
        let { search, pagination } = this.state
        let param = {
            billType: billTypeCode,
            agencyCode: agencyCodeStr,
            pageIndex: pagination.current,
            search: search,
            pageSize: pagination.pageSize
        }
        let sendData = {
            url: `/${service.BASE_BE_URL}/ar/invoice/relateBill/relateApply`,
            method: "post",
            data: param,
            waitfor: true,
        }
        axios.request(sendData).then(res => {
            if (res.error === false) {
                let tableData = res.data.list
                let total = res.data.total
                this.setState({
                    tableData: tableData,
                    pagination: {
                        ...pagination,
                        total
                    }
                })
            } else {
                $message.warning(res?.msg)
            }

        })
    }
    handleSelect = (current) => {
        let { pagination } = this.state;
        this.setState({
            pagination: {
                ...pagination,
                current
            }
        }, () => {
            this.getApplyList()
        })
    }
    onPageSizeChange (current, pageSize) {
        let { pagination } = this.state;
        this.setState({
            pagination: {
                ...pagination,
                current,
                pageSize
            }
        }, () => {
            this.getApplyList()
        })

    }
    // 注意：需要用回调中提供的参数 newData，去更新 state 或 store 中的 data 属性值，否则当表格重新render的时候，已选数据会被冲刷掉。
    getSelectedDataFunc = (selectedList, _record, index, newData) => {
        console.log("selectedList", selectedList, "index", index, 'newData', newData);
        this.setState({
            selectedRows: selectedList,
            tableData: newData
        })

    };
    // 搜索
    onSearch (val) {
        this.setState({
            search: val
        }, () => {
            this.getApplyList()
        })
    }
    render () {
        const { tableData, pagination } = this.state
        const { data } = this.props
        console.log(data)
        let tableHeight = window.innerHeight * 0.9 - 235
        let rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, _selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows: _selectedRows
                });
            }
        };
        return <div>
            <div className='search-box' style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <Input onSearch={this.onSearch.bind(this)} placeholder='输入关键字搜索' type='search' style={{ width: 200 }} />
            </div>
            <div>
                {/* <Table
                    bordered
                    rowKey='id'
                    bodyStyle={{ height: tableHeight }}
                    columns={columns}
                    data={tableData}
                    rowSelection={{ type: 'checkbox' }}
                    getSelectedDataFunc={this.getSelectedDataFunc.bind(this)} /> */}
                <ComplexTable
                    bordered
                    rowKey='id'
                    bodyStyle={{ height: tableHeight }}
                    columns={columns}
                    data={tableData}
                    rowSelection={rowSelection}

                />
                <div style={{ marginTop: 10 }}>
                    <Pagination
                        showSizeChanger={pagination.showSizeChanger}
                        current={pagination.current}
                        onChange={this.handleSelect.bind(this)}
                        onPageSizeChange={this.onPageSizeChange.bind(this)}
                        total={pagination.total}
                        pageSize={pagination.pageSize} />
                </div>
            </div>
        </div>
    }
}
