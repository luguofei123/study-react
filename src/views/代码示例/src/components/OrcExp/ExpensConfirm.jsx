/*
 * @Descripttion: 费用确认界面 表格可以编辑
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-24 18:19:05
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/ExpensConfirm.jsx
 */
import { Component } from 'react';
import commonMethod from '@/common/utils' // 工具方法
import service from '@/common/const/service'
import TreeSelectEditCell from './widgt/TreeSelectEditCell'
import SelectEditCell from './widgt/SelectEditCell'
import MainBillSelectEditCell from './widgt/MainBillSelectEditCell' // 关联主票信息项组件
import AdjustSch from './adjustSch' // 调整行程弹框
import RelateMasterInvoice from './relateMainInvoice/index'
// import schData from './sch.json'
import './index.less'
import axios from '@/api/api.request'
const { Table, Icon, Tree, Button, Modal, Message } = TinperNext
// const TreeNode = Tree.TreeNode
const $message = Message

export default class ExpensConfirm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModalAdjustSch: false,
            schTableData: [],
            noSchTable: [],
            applyExpenseList: [],   // 选择了申请单 后端返回的申请单上的费用
            isSch: this.props.billTypeCode.includes('TRIP') ? true : false
        }

        this.columns = [
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
            {
                fixed: "left", title: <span style={{ color: 'blue' }}><span style={{ fontSize: 12 }} className="iconfont icon-bianji1"></span>费用类型</span>, dataIndex: "expenseItemCode", key: "expenseItemCode", titleAlign: 'center',
                render: (_text, record, index) => {
                    let value = ''
                    if (record.expenseItemCode) {
                        value = record.expenseItemCode + ' ' + record.expenseItemName
                    }
                    return (<TreeSelectEditCell key={index} treeData={this.props.treeData} value={value} name={record.expenseItemName} onChange={this.onCellChange(index, record, "expenseItemCode")} />)
                },
                width: 150,
            },
            {
                title: "票据类型", dataIndex: "invoiceTypeName", key: "invoiceTypeName", titleAlign: 'center',
                render: (_text, record, index) => {
                    return (record['relationMainBill'] ? <div style={{ marginLeft: '16px' }}>{_text}</div> : <div>{_text}</div>)
                }
            },
            {
                fixed: "left", title: <span style={{ color: 'blue' }}><span style={{ fontSize: 12 }} className="iconfont icon-bianji1"></span>出差人</span>, dataIndex: "travelerCode", key: "travelerCode", titleAlign: 'center',
                render: (_text, record, index) => {
                    let tableList = this.state.schTableData[record?.tableIndex].tableList || []
                    let selectList = tableList.map(item => {
                        return {
                            code: item.travelerCode,
                            name: item.travelerName,
                        }

                    })
                    selectList = this.filterData(selectList, 'code')
                    selectList = this.filterData(selectList, 'name')
                    return (<SelectEditCell key={index} selectList={selectList} value={record.travelerCode} name={record.travelerName} onChange={this.onCellChange(index, record, "travelerCode")} />)
                },
                width: 100,
            },
            { title: "发票号码", dataIndex: "invoiceNo", key: "invoiceNo", titleAlign: 'center' },

            {
                title: <span style={{ color: 'blue' }}><span style={{ fontSize: 12 }} className="iconfont icon-bianji1"></span>关联主票</span>,
                dataIndex: "relationMainBill", key: "relationMainBill", titleAlign: 'center',
                render: (_text, record, index) =>
                (<MainBillSelectEditCell
                    data={
                        { record: record, index: index, value: _text }
                    }
                    openSelectMainInvoice={this.openSelectMainInvoice.bind(this, record, index)}
                    clearMainBill={this.clearMainBill.bind(this, record, index, _text)}
                    onChange={this.onCellChange(index, record, "relationMainBill")} />)
            },

            { title: "查验结果", dataIndex: "invoiceCheckName", key: "invoiceCheckName", titleAlign: 'center' },
            { title: "开票日期", dataIndex: "invoiceDate", key: "invoiceDate", titleAlign: 'center' },

            {
                title: "票据金额", dataIndex: "invoiceMoney", key: "invoiceMoney", titleAlign: 'center', contentAlign: 'right', render (_text, _record, index) {
                    return commonMethod.toThousandFix(_text);
                }
            },
            // {
            //     title: "原始票据文件", dataIndex: "fileName", key: "fileName", titleAlign: 'center', onCellClick: this.previewImg.bind(this), render (_text, _record, index) {
            //         return <span style={{ color: '#588ce9', cursor: 'pointer' }}>{_text}</span>;
            //     }
            // },
            // { title: "开票内容", dataIndex: "invoiceContent", key: "invoiceContent", titleAlign: 'center' },
            // { title: "购买方名称", dataIndex: "buyerName", key: "buyerName", titleAlign: 'center' },
            // { title: "购买方纳税识别号", dataIndex: "buyerTaxNo", key: "buyerTaxNo", titleAlign: 'center' },
            // { title: "销售方名称销售方纳税识别号", dataIndex: "salerTaxNo", key: "salerTaxNo", titleAlign: 'center' }
        ];
    }
    componentDidMount () {
        let { expensBackParam } = this.props
        if (expensBackParam.type === 'addBill') {
            this.addExpense(expensBackParam)
        } else if (expensBackParam.type === 'cancelBill') {
            let { isSch } = this.state
            if (isSch) {
                this.setState({
                    schTableData: expensBackParam.tableData
                })

            } else {
                this.setState({
                    noSchTable: expensBackParam.tableData
                })
            }

            this.getTotalMoeny(expensBackParam.tableData)


        } else {
            this.generatorExpense()
        }

    }
    // 数组去重复
    filterData (data, key) {
        let arr = data
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
    // 生成费用 
    generatorExpense () {
        let { invoiceSelectList, applySelectList, billTypeInfo, billTypeCode, historyTravelRow, fileList, historyExpenseList } = this.props
        let invoiceIds = invoiceSelectList.map(item => item.invoiceId)
        let relationBillIds = applySelectList.map(item => item.id)

        if (historyTravelRow && historyTravelRow.length === 0) {
            historyTravelRow = null
        }
        let param = {
            arTypeInvoiceBO: billTypeInfo,
            billType: billTypeCode,
            historyTravelRow: historyTravelRow,
            invoiceIds: invoiceIds,
            relationBillIds: relationBillIds,
            historyExpenseList: historyExpenseList
        }
        let sendData = {
            url: `/${service.BASE_BE_URL}/bm/invoice/createBillTrip`,
            method: "post",
            data: param,
            waitfor: true,
        }
        axios.request(sendData).then(res => {
            if (res.error === false) {
                if (res.data.checkInfo && res.data.checkInfo.length) {
                    let error = res.data.checkInfo.map(item => <div>{item}</div>)
                    Modal.error({
                        title: '禁止',
                        content: error,
                        width: 500,
                        okButtonProps: { style: { display: 'none' } }
                    })
                    this.props.goToSteps('select-invoice')
                    return
                }
                this.getSchTableList(res.data)
            } else {
                $message.warning(res?.message)
            }
        }).catch(err => {
            $message.error(err?.data?.message)
        })

    }
    // 添加费用
    addExpense (expensBackParam) {
        let { invoiceSelectList, billTypeInfo } = this.props
        let invoiceIds = invoiceSelectList.map(item => item.invoiceId)
        let param = {
            arTypeInvoiceBO: billTypeInfo,
            invoiceIds: invoiceIds,
            isMerge: 'N'
        }

        let sendData = {
            url: `/${service.BASE_BE_URL}/bm/invoice/invoiceToExpenseList`,
            method: "post",
            data: param,
            waitfor: true,
        }
        axios.request(sendData).then(res => {
            if (res.error === false) {
                let resultList = res.data.expenseList
                let list = []
                resultList.forEach((item => {
                    if (item.expenseDetailList) {
                        list.push(...item.expenseDetailList)
                    } else {
                        list.push(item)
                    }
                }))
                if (expensBackParam?.index !== null) {
                    let schTableData = expensBackParam.tableData
                    let index = expensBackParam.index
                    list.forEach(item => {
                        item.tableIndex = index
                        item.travelId = schTableData[index].id
                    })
                    schTableData[index].tableList.push(...list)
                    this.setDefaultPerson(schTableData[index].tableList)
                    this.setState({
                        schTableData: schTableData
                    })
                    this.getTotalMoeny(schTableData)
                } else {
                    let noSchTable = expensBackParam.tableData
                    noSchTable.push(...list)
                    this.setState({
                        noSchTable: noSchTable
                    })
                    this.getTotalMoeny(noSchTable)

                }

                if (expensBackParam.applyExpenseList) {
                    this.setState({
                        applyExpenseList: expensBackParam.applyExpenseList
                    })
                }

            } else {
                $message.warning(res?.message)
            }

        }).catch(err => {
            $message.error(err?.data?.message)
        })


    }
    getTableData = () => {
        return this.state
    }
    // 预览图片
    previewImg (row, e) {
        console.log('预览图片')
    }
    getTotalMoeny (list) {
        let tableData = []
        if (Array.isArray(list) && list.length > 0) {
            list.forEach(i => {
                if (i.tableList && Array.isArray(i.tableList)) {

                    tableData.push(...i.tableList)
                }
                else {
                    //if (i.invoiceId) {
                    tableData.push(i)
                    //}
                }
            })
        }

        // tableDataCopy.forEach(it => {
        //     if (it.expenseDetailList && Array.isArray(it.expenseDetailList)) {
        //         it.expenseDetailList.forEach(i => {
        //             if (i.invoiceId) {
        //                 excludeIds.push(i.invoiceId)
        //             }
        //         })

        //     }
        // })


        let money = 0
        let totalSelectNumber = 0
        let totalSelectMoney = 0
        if (tableData.length > 0) {
            tableData.forEach(item => {
                money += parseFloat(item.invoiceMoney) || 0
            })
            totalSelectNumber = tableData.length
            totalSelectMoney = money
        }

        this.props.updateTotal({
            totalSelectNumber: totalSelectNumber,
            totalSelectMoney: totalSelectMoney
        })
    }
    // 调整行程-打开弹窗
    adjustSch (index, schTableData, record, _index) {
        const data = {
            index,
            schTableData,
            record,
            _index
        }
        const div = document.createElement('div')
        document.body.appendChild(div)
        ReactDOM.render(<AdjustSch schData={data} adjustSchCallBack={this.adjustSchCallBack.bind(this)} />, div)
    }
    // 调整行程确认回调
    adjustSchCallBack (obj) {
        let { index, schTableData, record, _index, selectIndex } = obj
        let schTableDataCopy = schTableData
        schTableDataCopy[index].tableList.splice(_index, 1)
        record.tableIndex = selectIndex
        record.travelId = schTableDataCopy[selectIndex].id   // travelId 赋值
        schTableDataCopy[selectIndex].tableList.push(record)
        this.setDefaultPerson(schTableDataCopy[selectIndex].tableList)
        this.setState({ schTableData: schTableDataCopy }, () => {
            this.getTotalMoeny(schTableDataCopy)
        });
    }
    // 关联主票-打开选择主票弹框
    openSelectMainInvoice (record, index) {

        const { noSchTable, schTableData, isSch } = this.state
        let tableData = []
        let tableIndex = null
        if (isSch) {
            tableIndex = record.tableIndex // 当前表格的index，第几个行程表格
            tableData = JSON.parse(JSON.stringify(schTableData[tableIndex].tableList))
        } else {

            tableData = JSON.parse(JSON.stringify(noSchTable))
        }

        tableData.splice(index, 1) // 过滤掉当前数据
        tableData = tableData.filter(ele => !ele.relationMainBill) // 过滤掉含有主票的数据
        const mainData = {
            tableIndex: tableIndex,
            record: record,
            index: index,
            tableData: tableData
        }
        const div = document.createElement('div')
        document.body.appendChild(div)
        ReactDOM.render(<RelateMasterInvoice
            mainData={mainData}
            selectMainInvoiceCallBack={this.selectMainInvoiceCallBack.bind(this)} />, div)
    }
    // 清除关联主票
    clearMainBill (record, index, value) {
        const { isSch } = this.state
        if (isSch) {
            if (value) {
                const { schTableData } = this.state
                let schTableDataCopy = schTableData
                const tableIndex = record.tableIndex // 当前表格的index，第几个行程表格
                let tableData = JSON.parse(JSON.stringify(schTableDataCopy[tableIndex].tableList))
                tableData[index]['relationMainBill'] = '' // 清除当前行关联主票数据
                // 判断该票据是否是主票
                let flag = tableData.some(ele => ele.relationMainBill === value)
                if (!flag) { // 不是主票清除主票标识
                    tableData.forEach(v => {
                        if (v.invoiceNo === value) {
                            v['isMainBill'] = false
                        }
                    })
                }
                schTableDataCopy[tableIndex].tableList = tableData
                this.setState({
                    schTableData: schTableDataCopy
                })
            }
        } else {
            if (value) {
                const { noSchTable } = this.state
                let noSchTableCopy = noSchTable
                let tableData = JSON.parse(JSON.stringify(noSchTableCopy))
                tableData[index]['relationMainBill'] = '' // 清除当前行关联主票数据
                // 判断该票据是否是主票
                let flag = tableData.some(ele => ele.relationMainBill === value)
                if (!flag) { // 不是主票清除主票标识
                    tableData.forEach(v => {
                        if (v.invoiceNo === value) {
                            v['isMainBill'] = false
                        }
                    })
                }
                noSchTableCopy = tableData
                this.setState({
                    noSchTable: noSchTableCopy
                })
            }
        }

    }

    // 关联主票-确认回调
    selectMainInvoiceCallBack (data) {
        const { noSchTable, schTableData, isSch } = this.state
        if (isSch) {
            const { tableIndex, index, record, selectRow } = data
            let schTableDataCopy = commonMethod.deepClone(schTableData)
            let tableData = JSON.parse(JSON.stringify(schTableDataCopy[tableIndex].tableList)) // 当前行程表格数据
            record['relationMainBill'] = selectRow.invoiceNo // 关联主票
            record['expenseItemCode'] = selectRow.expenseItemCode // 费用类型编码
            record['expenseItemName'] = selectRow.expenseItemName // 费用类型名称
            tableData.splice(index, 1)
            let mainIndex = ''
            tableData.forEach((v, vIndex) => {
                if (v.invoiceNo === selectRow.invoiceNo) {
                    v['isMainBill'] = true
                    mainIndex = vIndex + 1
                }
            })
            tableData.splice(mainIndex, 0, record)
            schTableDataCopy[tableIndex].tableList = tableData
            this.setState({
                schTableData: schTableDataCopy
            })
        } else {
            const { tableIndex, index, record, selectRow } = data
            let noSchTableCopy = commonMethod.deepClone(noSchTable)
            let tableData = JSON.parse(JSON.stringify(noSchTableCopy)) // 当前行程表格数据
            record['relationMainBill'] = selectRow.invoiceNo // 关联主票
            record['expenseItemCode'] = selectRow.expenseItemCode // 费用类型编码
            record['expenseItemName'] = selectRow.expenseItemName // 费用类型名称
            tableData.splice(index, 1)
            let mainIndex = ''
            tableData.forEach((v, vIndex) => {
                if (v.invoiceNo === selectRow.invoiceNo) {
                    v['isMainBill'] = true
                    mainIndex = vIndex + 1
                }
            })
            tableData.splice(mainIndex, 0, record)
            noSchTableCopy = tableData
            this.setState({
                noSchTable: noSchTableCopy
            })
        }

    }
    // 删除费用
    deleteExplist (index, schTableData, record, _index, isSch) {
        let that = this
        Modal.info({
            title: '提示',
            content: (<div>
                <p>确定要删除该费用吗?</p>
            </div>),
            onOk (_e) {
                if (isSch) {
                    let schTableDataCopy = schTableData
                    schTableDataCopy[index].tableList.splice(_index, 1)
                    // 判断是否关联了主票
                    if (record.relationMainBill) {
                        // 判断是否还有票据关联了该主票
                        let flag = schTableDataCopy[index].tableList.some(ele => ele.relationMainBill === record.relationMainBill)
                        if (!flag) {
                            schTableDataCopy[index].tableList.forEach(v => {
                                if (v.invoiceNo === record.relationMainBill) {
                                    v.isMainBill = false
                                }
                            })
                        }
                    }
                    if (record.isMainBill) {
                        // 判断是否是主票
                        schTableDataCopy[index].tableList = schTableDataCopy[index].tableList.filter(ele => ele.relationMainBill !== record.invoiceNo)
                    }
                    that.setState({ schTableData: schTableDataCopy }, () => {
                        that.getTotalMoeny(schTableDataCopy)
                    });
                } else {
                    let noSchTableCopy = schTableData
                    noSchTableCopy.splice(_index, 1)
                    // 判断是否关联了主票
                    if (record.relationMainBill) {
                        // 判断是否还有票据关联了该主票
                        let flag = noSchTableCopy.some(ele => ele.relationMainBill === record.relationMainBill)
                        if (!flag) {
                            noSchTableCopy.forEach(v => {
                                if (v.invoiceNo === record.relationMainBill) {
                                    v.isMainBill = false
                                }
                            })
                        }
                    }
                    if (record.isMainBill) {
                        // 判断是否是主票
                        noSchTableCopy = noSchTableCopy.filter(ele => ele.relationMainBill !== record.invoiceNo)
                    }
                    that.setState({ noSchTable: noSchTableCopy }, () => {
                        that.getTotalMoeny(noSchTableCopy)
                    });
                }
            },
            centered: true,
            keyboard: true,
            autoFocus: 'ok',
        });
    }
    getHoverContent = (isSch, index, schTableData, record, _index) => {
        return (
            <div style={{ display: 'inline-block' }}>
                {isSch ? <Button size='sm' colors="dark" style={{ marginRight: '5px' }} onClick={this.adjustSch.bind(this, index, schTableData, record, _index)}>调整行程</Button> : ''}
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }} onClick={this.deleteExplist.bind(this, index, schTableData, record, _index, isSch)}>删除</Button>
            </div>);
    }
    onCellChange = (index, record, key) => {
        return (value) => {
            let { schTableData, isSch, noSchTable } = this.state;
            if (isSch) {
                let schTableDataCopy = schTableData
                if (key === 'expenseItemCode') {
                    schTableData[record['tableIndex']].tableList[index][key] = value.value;
                    schTableData[record['tableIndex']].tableList[index]['expenseItemName'] = value.name;
                } else if (key === 'travelerCode') {
                    schTableData[record['tableIndex']].tableList[index][key] = value.value;
                    schTableData[record['tableIndex']].tableList[index]['travelerName'] = value.name;

                    // schTableData[record['tableIndex']].tableList[index]['travelerCode'] = value.value;
                    // schTableData[record['tableIndex']].tableList[index]['travelerName'] = value.name;
                }
                else {
                    schTableData[record['tableIndex']].tableList[index][key] = value;
                }

                this.setState({ schTableData: schTableDataCopy }, () => {
                    console.log('行变化')
                });
            } else {
                let noSchTableCopy = noSchTable
                if (key === 'expenseItemCode') {
                    noSchTableCopy[index][key] = value.value;
                    noSchTableCopy[index]['expenseItemName'] = value.name;
                } else {
                    noSchTableCopy[index][key] = value;
                }

                this.setState({ noSchTable: noSchTableCopy }, () => {
                    console.log('行变化')
                });
            }

        };
    };
    // 添加票据 
    addBill (index, item, tableData) {
        // 获取所有已经选择过的invoiceId
        let tableDataCopy = []
        if (Array.isArray(tableData) && tableData.length > 0) {
            tableData.forEach(i => {
                if (i.tableList && Array.isArray(i.tableList)) {
                    tableDataCopy.push(...i.tableList)
                } else {
                    tableDataCopy.push(i)
                }
            })
        }
        let excludeIds = []
        tableDataCopy.forEach(it => {
            if (it.expenseDetailList && Array.isArray(it.expenseDetailList)) {
                it.expenseDetailList.forEach(i => {
                    if (i.invoiceId) {
                        excludeIds.push(i.invoiceId)
                    }
                })

            }
            if (it.invoiceId) {
                excludeIds.push(it.invoiceId)
            }
        })
        let { applyExpenseList } = this.state
        let param = {
            index: index,
            item: item,
            tableData: tableData,
            type: 'addBill',
            excludeIds: excludeIds,
            applyExpenseList: applyExpenseList

        }
        console.log('addBill')
        this.props.goToSteps('select-invoice', param)
    }
    // 如果行程里面出差人下拉只有一个人的时候，那么就默认要赋值
    setDefaultPerson (tableList) {
        let personCodeArr = tableList.map(i => i.travelerCode).filter(i => i)
        let personNameArr = tableList.map(i => i.travelerName).filter(i => i)
        personCodeArr = new Set(personCodeArr)
        personCodeArr = Array.from(personCodeArr)

        personNameArr = new Set(personNameArr)
        personNameArr = Array.from(personNameArr)

        let f1 = personCodeArr && Array.isArray(personCodeArr) && personCodeArr.length === 1
        let f2 = personNameArr && Array.isArray(personNameArr) && personNameArr.length === 1
        if (f1 && f2) {
            tableList.forEach(i => {
                i.travelerCode = personCodeArr[0]
                i.travelerName = personNameArr[0]
            })
        }
    }
    getSchTableList = (result) => {
        if (result?.travelRow) {
            let expenseDetailList = JSON.parse(JSON.stringify(result.expenseDetailList))
            let travelRow = JSON.parse(JSON.stringify(result.travelRow))
            let schTableData = []
            travelRow.forEach((item, index) => {
                item.tableList = []
                item.tableHead = this.columns
                expenseDetailList.forEach((item1, index1) => {
                    if (item1.travelId === item.id) {
                        item1.tableIndex = index
                        item.tableList.push(item1)
                    }
                })

                // 出差人要是只有一个人的话就默认赋值
                this.setDefaultPerson(item.tableList)

            })
            schTableData = travelRow
            // 没有匹配上的就单独一个组合叫 待新增行程
            let traveIds = travelRow.map(i => i.id)
            let noMatchList = expenseDetailList.filter(i => traveIds.indexOf(i.travelId) === -1)
            this.setDefaultPerson(noMatchList)
            noMatchList.forEach(item => {
                item.tableIndex = schTableData.length
            })
            let noMatchTravel = {
                tableHead: this.columns,
                tableList: noMatchList,
                noMatchFlag: true
            }
            if (noMatchList.length > 0) {
                schTableData.push(noMatchTravel)
            }
            this.setState({
                schTableData: schTableData
            })

            this.getTotalMoeny(schTableData)

        } else {
            let noSchTable = []
            noSchTable = JSON.parse(JSON.stringify(result.expenseDetailList))
            this.setState({
                noSchTable: noSchTable
            })
            this.getTotalMoeny(noSchTable)
        }


        // 申请单费用
        if (result.applyExpenseList) {
            this.setState({
                applyExpenseList: result.applyExpenseList
            })
        }



    }
    render () {
        const { schTableData, isSch, noSchTable } = this.state
        let columns = commonMethod.deepClone(this.columns)
        if (!isSch) {
            columns.splice(3, 1)
        }

        let tableHeight = window.innerHeight * 0.9 - 265

        return <div className='aebf-expense-confirm'>
            <div className='aebf-expense-wrapper'>
                <div className='aebf-confirm-top'>
                    <div className='aebf-steps'>
                        <span className='unactive'>
                            <Icon type="uf-correct" />
                            <span>选择票据</span>
                        </span>
                        <span className='long'></span>
                        <span className='active'>
                            <span className='circle'></span>
                            <span>费用确认</span>
                        </span>
                    </div>
                    <div className='aebf-tips'>
                        <Icon type="uf-exc-c-o" />
                        <span>1.贴在同一张纸上的多张票据必须一起报销！</span>
                        <span>2.请确认票据对应的费用类型与实际业务是否一致！</span>
                    </div>
                </div>
                {
                    isSch ? <div className='aebf-expense-confirm-sch'>
                        {
                            schTableData.map((item, index) => {
                                return <div key={index} className='sch-table-box'>
                                    {
                                        !item.noMatchFlag
                                            ? <><div className='confirm-sch-title'>
                                                <span>{item.deptPlaceName}</span>
                                                <span className="time">（{item.startDate || '-'}）</span>
                                                <span><Icon type="uf-arrow-right-2" /></span>
                                                <span>{item.arriPlaceName}</span>
                                                <span className="time">（{item.endDate || '-'}）</span>
                                                <span className='businessMan' >{item.travelerName}</span>
                                            </div>
                                                <Table
                                                    bodyStyle={{ height: '150px' }}
                                                    height={null}
                                                    scroll={{ y: 150 }}
                                                    key={index}
                                                    titleAlign='center'
                                                    columns={item.tableHead}
                                                    data={item.tableList}
                                                    stripeLine={true}
                                                    bordered
                                                    hoverContent={this.getHoverContent.bind(this, isSch, index, schTableData)}
                                                    footer={() => <div onClick={this.addBill.bind(this, index, item, schTableData)} style={{ textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}>+<span style={{ color: '#06f', fontSize: '12px' }}>添加票据</span></div>} />
                                            </>
                                            : <>
                                                <div className='confirm-sch-title'><span>{'待新增行程'}</span></div>
                                                <Table bodyStyle={{ height: '150px' }} height={null} scroll={{ y: 150 }} key={index} titleAlign='center' columns={item.tableHead} data={item.tableList} stripeLine={true} bordered hoverContent={this.getHoverContent.bind(this, isSch, index, schTableData)} />
                                            </>
                                    }

                                </div>
                            })
                        }

                    </div> :
                        <div className='aebf-expense-confirm-nosch'>
                            <Table
                                bodyStyle={{ height: tableHeight }}
                                height={null}
                                // scroll={{ y: 380 }}
                                titleAlign='center'
                                columns={columns}
                                data={noSchTable}
                                stripeLine={true}
                                bordered
                                hoverContent={this.getHoverContent.bind(this, isSch, null, noSchTable)}
                                footer={() => <div onClick={this.addBill.bind(this, null, null, noSchTable)} style={{ textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}>+<span style={{ color: '#06f', fontSize: '12px' }}>添加票据</span></div>} />
                        </div>
                }
            </div>
        </div>
    }
}
