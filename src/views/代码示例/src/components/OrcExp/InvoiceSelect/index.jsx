/*
 * @Descripttion: 票据选择界面  tab页签 票据和订单
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-09-05 15:27:37
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/InvoiceSelect/index.jsx
 */
import { Component } from 'react';
import commonMethod from '@/common/utils' // 工具方法
import axios from 'axios';
import service from '@/common/const/service'
import './index.less'
const { Table, Icon, Tree, Input, Pagination, Checkbox, Message } = TinperNext
const $message = Message
const { multiSelect, sum } = Table;
let ComplexTable = multiSelect(Table, Checkbox);
export default class InvoceSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabList: [
                { title: '票据', code: 1 },
                { title: '订单', code: 2 },
            ],
            currentTab: 1,
            treeData: [{
                clipId: "",
                clipName: "全部",
                children: []
            }],
            treeDataCopy: [],
            tableData: [],
            search: '',
            isExpend: true,
            currentClipId: '',
            selectedRowKeys: [],
            selectedRows: [],
            selectRowsAll: [], // 多页签选择数据
            pagination: {
                showSizeChanger: true,
                current: 1,
                pageSize: 10,
                total: 0
            },
            columns: []
        }
        // 票据表头
        this.columns1 = [
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

            { title: "票据类型", dataIndex: "invoiceTypeName", key: "invoiceTypeName", titleAlign: 'center', width: 120, },
            {
                title: "发票号码", dataIndex: "invoiceNo", key: "invoiceNo", titleAlign: 'center', width: 120,
                render (_text, _record, index) {
                    return <a style={{ color: '#588ce9' }}>{_text}</a>
                },
                onCellClick: (_record, e) => { e.stopPropagation(); this.props.jumperToBill('view', { ..._record, clipId: this.state.currentClipId }) }
            },
            { title: "开票日期", dataIndex: "invoiceDate", key: "invoiceDate", titleAlign: 'center', width: 120 },
            {
                title: "票据金额", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', contentAlign: 'right', width: 120, render (_text, _record, index) {
                    return commonMethod.toThousandFix(_text);
                }
            },
            { title: "开票内容", dataIndex: "invoiceContent", key: "invoiceContent", titleAlign: 'center' },

        ];
        // 订单表头
        this.columns2 = [
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

            { title: "订单号", dataIndex: "invoiceTypeName", key: "invoiceTypeName", titleAlign: 'center', width: 120, },
            { title: "订单类型", dataIndex: "invoiceNo", key: "invoiceNo", titleAlign: 'center', width: 120 },
            { title: "订单日期", dataIndex: "invoiceDate", key: "invoiceDate", titleAlign: 'center', width: 120 },
            { title: "出发时间", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', width: 120 },
            { title: "出差人", dataIndex: "invoiceContent", key: "invoiceContent", titleAlign: 'center', width: 120 },
            { title: "出发地", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', width: 120 },
            { title: "目的地", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', width: 120 },
            {
                title: "订单金额", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', contentAlign: 'right', width: 120, render (_text, _record, index) {
                    return commonMethod.toThousandFix(_text);
                }
            },
            { title: "到达时间", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center', width: 120 },
            { title: "席别/舱位/房型", dataIndex: "amountTaxTotal", key: "amountTaxTotal", titleAlign: 'center' },

        ];
    }

    componentDidMount () {
        this.showTab({ code: 1 })
        // 监听有变化刷新数据
        window.addEventListener('storage', e => {
            let isRefresh = localStorage.getItem('aebfFresh')
            if (isRefresh === 'refresh') {
                this.showTab({ code: 1 }, 'aebfFresh')
                localStorage.setItem('aebfFresh', '')
            }
        })
    }

    showTab (item, type) {
        this.setState({
            currentTab: item.code,
            columns: item.code === 1 ? this.columns1 : this.columns2
        }, () => {
            this.getDataByChangeTab(item.code, type)
        })
    }
    getDataByChangeTab (tab, type) {

        const { agencyCodeStr, userCode, expensBackParam, historyExpenseList } = this.props
        let historyInvoicesId = this.getExcludeIdsFromHistoryExpenseList(historyExpenseList)
        let { excludeIds } = expensBackParam
        let excludeIdsAll = [...historyInvoicesId, ...excludeIds]
        excludeIdsAll = excludeIdsAll.filter(i => i)
        excludeIdsAll = new Set(excludeIdsAll)
        excludeIdsAll = Array.from(excludeIdsAll)
        if (tab === 1) {
            axios.get(`/${service.BASE_BE_URL}/bm/api/listClip?clipType=${'01'}&agencyCodeStr=${agencyCodeStr}&excludeIds=${excludeIdsAll.join(',')}`).then(res => {
                if (res.data.flag === 'success') {
                    let treeData = [{
                        clipId: "",
                        clipName: "全部",
                        children: []
                    }]

                    treeData[0].children = res.data.data

                    let currentClipId = treeData[0].children[0]?.clipId || ''
                    if (type === 'aebfFresh') {
                        currentClipId = this.state.currentClipId

                    }
                    this.setState({
                        treeData: treeData,
                        currentClipId: currentClipId,
                        treeDataCopy: JSON.parse(JSON.stringify(treeData))
                    }, () => {
                        this.queryInvoices()
                    })
                } else {
                    $message.warning(res?.data?.message)
                }
            })
        }
        if (tab === 2) {
            let param = {
                agencyCode: agencyCodeStr,
                clipType: "01",
                excludeIds: excludeIds,
                used: 0
            }
            axios.post(`/${service.BASE_BE_URL}/bm/trip/queryClips`, param).then(res => {
                if (res.data.flag === 'success') {
                    let treeData = [{
                        clipId: "",
                        clipName: "全部",
                        children: []
                    }]

                    treeData[0].children = res.data.data
                    let currentClipId = treeData[0].children[0]?.clipId || ''
                    this.setState({
                        treeData: treeData,
                        currentClipId: currentClipId,
                        treeDataCopy: JSON.parse(JSON.stringify(treeData))
                    }, () => {
                        this.queryInvoices()
                    })
                } else {
                    $message.warning(res?.data?.message)
                }
            })
        }

    }
    getExcludeIdsFromHistoryExpenseList (list) {
        let ids = []
        list.forEach(item => {
            if (item.AARBillExpDetailList) {
                item.AARBillExpDetailList.forEach(item1 => {
                    ids.push(item1.invoiceId)
                })
            }
        })
        return ids
    }
    // 查询票据根据左侧的票夹
    queryInvoices () {
        const { agencyCodeStr, userCode, expensBackParam, historyExpenseList } = this.props
        let historyInvoicesId = this.getExcludeIdsFromHistoryExpenseList(historyExpenseList)
        let { excludeIds } = expensBackParam
        let excludeIdsAll = [...historyInvoicesId, ...excludeIds]
        excludeIdsAll = excludeIdsAll.filter(i => i)
        excludeIdsAll = new Set(excludeIdsAll)
        excludeIdsAll = Array.from(excludeIdsAll)
        let { search, currentClipId, pagination, currentTab } = this.state
        if (currentTab === 1) {
            let param = {
                agencyCode: agencyCodeStr,
                clipId: currentClipId,
                clipType: "01",
                excludeIds: excludeIdsAll,
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                search: search,
                userCode: userCode,
                used: '2'
            }
            axios.post(`/${service.BASE_BE_URL}/bm/api/queryInvoices`, param).then(res => {
                if (res.data.flag === 'success') {
                    let tableData = res.data.data.list
                    let total = res.data.data.total
                    this.setState({
                        tableData: tableData,
                        pagination: {
                            ...pagination,
                            total
                        },
                        // selectedRowKeys: []
                    })
                } else {
                    $message.warning(res?.data?.message)
                }
            })
        }
        if (currentTab === 2) {
            let param = {
                agencyCode: agencyCodeStr,
                clipId: currentClipId,
                clipType: "01",
                excludeIds: [],
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                search: search,
                isNotPage: false
            }
            axios.post(`/${service.BASE_BE_URL}/bm/trip/queryInvoices`, param).then(res => {
                if (res.data.flag === 'success') {
                    let tableData = res.data.data.list
                    let total = res.data.data.total
                    this.setState({
                        tableData: tableData,
                        pagination: {
                            ...pagination,
                            total
                        },
                        // selectedRowKeys: []
                    })
                } else {
                    $message.warning(res?.data?.message)
                }
            })
        }

        let { selectRowsAll } = this.state
        this.getSelectedDataFunc(selectRowsAll)

        // this.props.updateTotal({
        //     totalSelectNumber: 0,
        //     totalSelectMoney: 0
        // })
    }
    // 数组去重复
    filterData (data, key) {
        let arr = data.filter(i => i)
        data = data.filter(i => i)
        if (data && data.length) {
            arr = data.filter((x, index) => {
                let arrKey = []
                data.forEach(item => {
                    arrKey.push(item[key])
                })
                return arrKey.indexOf(x[key]) === index && x[key]
            })
        }
        return arr
    }
    // 节点点击查询右侧数据
    clickTreeNode (node) {
        // 每次切换之前都要将选择的数据放在一个地方
        let { selectedRows, selectRowsAll } = this.state
        selectRowsAll.push(...selectedRows)
        selectRowsAll = this.filterData(selectRowsAll, 'invoiceId')



        this.setState({
            currentClipId: node.clipId,
            selectRowsAll: selectRowsAll
        }, () => {
            this.queryInvoices()
        })
    }
    expandList () {
        let { isExpend } = this.state
        this.setState({
            isExpend: !isExpend
        })
    }
    // 过滤左侧树
    filtTree (val) {
        let { treeDataCopy } = this.state
        let treeDataCopy1 = JSON.parse(JSON.stringify(treeDataCopy))
        if (val) {
            treeDataCopy1[0].children = treeDataCopy1[0].children.filter(item => {
                return item.clipName.includes(val)
            })
            this.setState({
                treeData: treeDataCopy1
            })

        } else {
            this.setState({
                treeData: treeDataCopy1
            })
        }
    }
    // 搜索
    onSearch (val) {
        this.setState({
            search: val
        }, () => {
            this.queryInvoices()
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
            this.queryInvoices()
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
            this.queryInvoices()
        })

    }
    // 注意：需要用回调中提供的参数 newData，去更新 state 或 store 中的 data 属性值，否则当表格重新render的时候，已选数据会被冲刷掉。
    // getSelectedDataFunc = (selectedList, _record, index, newData) => {
    //     console.log("selectedList", selectedList, "index", index, 'newData', newData);
    //     this.setState({
    //         selectedRows: selectedList,
    //         tableData: newData
    //     })

    //     let money = 0
    //     let totalSelectNumber = 0
    //     let totalSelectMoney = 0
    //     if (selectedList.length > 0) {
    //         selectedList.forEach(item => {
    //             money += parseFloat(item.amountTaxTotal) || 0
    //         })
    //         totalSelectNumber = selectedList.length
    //         totalSelectMoney = money
    //     }
    //     this.props.updateTotal({
    //         totalSelectNumber: totalSelectNumber,
    //         totalSelectMoney: totalSelectMoney
    //     })


    // };
    getSelectedDataFunc = (selectedList) => {
        // console.log("selectedList", selectedList, "index", index, 'newData', newData);
        // this.setState({
        //     selectedRows: selectedList,
        //     tableData: newData
        // })

        let money = 0
        let totalSelectNumber = 0
        let totalSelectMoney = 0
        if (selectedList.length > 0) {
            selectedList.forEach(item => {
                money += parseFloat(item.amountTaxTotal) || 0
            })
            totalSelectNumber = selectedList.length
            totalSelectMoney = money
        }
        this.props.updateTotal({
            totalSelectNumber: totalSelectNumber,
            totalSelectMoney: totalSelectMoney
        })


    };
    // 需要支持跨页签选数据
    render () {
        let { currentTab, tabList, treeData, tableData, isExpend, currentClipId, pagination, columns, selectRowsAll } = this.state
        const { billTypeCode } = this.props
        let tabListCopy = tabList.slice()
        let that = this
        tabListCopy.pop()
        let tabListUse = billTypeCode.includes('TRIP') ? tabList : tabListCopy
        let tableHeight = window.innerHeight * 0.9 - 265
        let rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, _selectedRows) => {
                selectRowsAll.push(..._selectedRows)
                selectRowsAll = that.filterData(selectRowsAll, 'invoiceId')
                this.setState({
                    selectedRowKeys,
                    selectedRows: _selectedRows,
                    selectRowsAll: selectRowsAll
                });

                this.getSelectedDataFunc(selectRowsAll)
            }
        };
        return <div className='invoce-select-wrapper'>
            <div className='top-title'>
                {tabListUse.map(item => {
                    return <span key={item.code} className={currentTab === item.code ? 'nomarl active' : 'nomarl'} onClick={this.showTab.bind(this, item)}>{item.title}</span>
                })}
            </div>
            <div className='content'>
                <div className='left'>
                    <Input type='search' onChange={this.filtTree.bind(this)} placeholder='输入关键字过滤' />
                    <div className='treeBox'>
                        {
                            treeData.map(item => {
                                return <div className='treeList' key={item.clipName}>
                                    <div className='parent'>
                                        <Icon type="uf-triangle-down" rotate={isExpend ? 0 : -90} onClick={this.expandList.bind(this)} />
                                        <span className={currentClipId === item.clipId ? 'active' : ''} onClick={this.clickTreeNode.bind(this, item)}>{item.clipName}</span></div>
                                    {
                                        isExpend ? <>
                                            {
                                                item.children.map(item1 => {
                                                    return <div className='children'><span className={currentClipId === item1.clipId ? 'active' : ''} onClick={this.clickTreeNode.bind(this, item1)}>{item1.clipName}（{item1.aebfNum}）</span></div>
                                                })
                                            }
                                        </> : ''
                                    }

                                </div>
                            })
                        }
                    </div>
                </div>
                <div className='right'>
                    <div className='search'>
                        <div className='aebf-steps'>
                            <span className='active'>
                                <span className='circle'></span>
                                <span>选择票据</span>
                            </span>
                            <span className='long'></span>
                            <span className='unactive'>
                                <span className='circle'></span>
                                <span>费用类型确认</span>
                            </span>
                        </div>
                        <Input onSearch={this.onSearch.bind(this)} placeholder='输入关键字搜索' type='search' style={{ width: 200 }} />
                    </div>
                    {/* <Table
                        bordered
                        rowKey='invoiceId'
                        bodyStyle={{ height: tableHeight }}
                        columns={columns}
                        data={tableData}
                        rowSelection={{ type: 'checkbox' }}
                        getSelectedDataFunc={this.getSelectedDataFunc.bind(this)} /> */}

                    <ComplexTable
                        bordered
                        rowKey='invoiceId'
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
        </div>
    }
}
