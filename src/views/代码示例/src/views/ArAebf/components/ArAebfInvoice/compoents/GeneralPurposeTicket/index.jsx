/*
 * @Descripttion: 通用机打发票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-09-06 19:23:07
 * @FilePath: /study-react/src/views/代码示例/src/views/ArAebf/components/ArAebfInvoice/compoents/GeneralPurposeTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class GeneralPurposeTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(7)).keys()),
            arr3: Array.from((new Array(3)).keys()),
            // leftWidth,
            firstList: [
                { name: '发票号码', key: 'invoiceNo' },
                { name: '发票代码', key: 'invoiceCode' }
            ],
            secondList: [
                { name: '行业分类', key: 'category' },
                { name: '开票日期', key: 'invoiceDate' }
            ],
            thirdList: [
                {
                    title: '购买方',
                    content: [
                        { name: '名称', key: 'buyerName' },
                        { name: '纳税人识别号', key: 'buyerTaxNo' }
                    ]
                },
                {
                    title: '销售方',
                    content: [
                        { name: '名称', key: 'salerName' },
                        { name: '纳税人识别号', key: 'salerTaxNo' }
                    ]
                }
            ],
            detailHead: [
                { name: '品名规格', key: 'item', width: 300 },
                { name: '单位', key: 'unit', width: 100 },
                { name: '数量', key: 'num', type: '03', width: 130 },
                { name: '单价', key: 'price', type: '02', width: 200 },
                { name: '金额', key: 'amount', type: '02', width: 200 }
            ],
            fourthList: [
                { name: '合计金额大写(人民币)', key: 'captitalTotal' },
                { name: '合计金额小写', key: 'amountTaxTotal' },
                { name: '备注', key: 'remark' }
            ]
        }
    }

    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    invoiceInfoTimeChange (code, moment, value) {
        this.props.invoiceInfoChange(code, value)
    }
    invoicelistDetailsInfoChange (index, listDetail, listDetailsCode, code, value) {
        let params = {}
        let vatDetails = JSON.parse(JSON.stringify(listDetail))
        let currentRow = vatDetails[index]
        currentRow[code] = value
        // 金额 = 数量 * 单价
        if (code === 'price' || code === 'num') {
            currentRow.amount = Number((Number(currentRow.price) * Number(currentRow.num)).toFixed(2))
        }
        // 单价 = 金额 / 数量
        if (code === 'amount' || code === 'num') {
            if (Number(currentRow.num) !== 0) {
                currentRow.price = Number((Number(currentRow.amount) / Number(currentRow.num)))
            }
        }
        // 税额 = 金额 * 税率
        if (code === 'amount' || code === 'taxRate') {
            currentRow.tax = Number((Number(currentRow.amount) * Number(currentRow.taxRate) / 100).toFixed(2))
        }
        // 金额合计
        params.amountTotal = vatDetails.reduce((sum, item) => {
            return sum + Number(item.amount)
        }, 0)
        // 税额合计
        params.taxTotal = vatDetails.reduce((sum, item) => {
            return sum + Number(item.tax)
        }, 0)
        // 小写合计 = 金额合计 + 税额合计
        params.amountTaxTotal = params.amountTotal + params.taxTotal
        params[listDetailsCode] = vatDetails
        // 大写合计 = 小写合计转大写
        params.captitalTotal = transRMBSmallToBig(params.amountTaxTotal, $message)
        Object.keys(params).forEach(key => {
            this.props.invoiceInfoChange(key, params[key])
        })
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { arr, arr3, firstList, secondList, thirdList, detailHead, fourthList } = this.state
        // let planeDetails = JSON.parse(JSON.stringify(invoiceInfo.planeDetails))
        const getDetailDetail = (key, index, type) => {
            let value = null
            if (planeDetails[index]) {
                value = planeDetails[index][key]
            }
            if (index) {
                if (type === 'PLACE' && planeDetails[index - 1] && planeDetails[index - 1].endStation) {
                    // 最后一行处理
                    value = planeDetails[index - 1].endStation
                }
            }
            if (value) {
                if (key === 'rideDate') {
                    // value = moment(value, 'YYYY-MM-DD')
                }
                if (key === 'rideTime') {
                    // value = moment(value, 'HH-mm')
                }
            }
            return value


        }

        // 发票通用机打
        if (invoiceInfo.invoiceType === '22') {
            invoiceInfo.invoiceTypeName = '通用机打发票'
        }
        return (<div className="general-ticket">
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
                <div className="center">
                    <div className="ticket-title">
                        <span>{invoiceInfo.invoiceTypeName}</span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </div>
                    <div className="first-list">
                        {
                            firstList.map(item => {
                                return <div key={item.key}>
                                    <label>{item.name}</label>
                                    <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                </div>
                            })
                        }
                    </div>
                    <div className="second-list">
                        {
                            secondList.map(item => {
                                return <div key={item.key}>
                                    <label>{item.name}</label>
                                    {
                                        item.key === 'invoiceDate' ?
                                            <DatePicker
                                                value={invoiceInfo.invoiceDate ? moment(invoiceInfo.invoiceDate) : null}
                                                format="YYYY-MM-DD"
                                                disabled={disabled}
                                                onChange={this.invoiceInfoTimeChange.bind(this, item.key)}
                                            /> :
                                            <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>

                                    }
                                </div>
                            })
                        }
                    </div>
                    <div className="third-list">
                        {
                            thirdList.map(item => {
                                return <div key={item.key}>
                                    <div>{item.title}</div>
                                    <div>
                                        {
                                            item.content.map(item1 => {
                                                return <div key={item1.key}>
                                                    <label>{item1.name}</label>
                                                    <Input value={invoiceInfo[item1.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item1.key)}></Input>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            })
                        }

                    </div>
                    <div className="detail-table">
                        <table>
                            <thead>
                                <tr>
                                    {detailHead.map(item => {
                                        return <th key={item.key} width={item.width}>
                                            {item.name}
                                        </th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    arr3.map((item, index) => {
                                        return <tr key={item}>
                                            {
                                                detailHead.map((item1, index1) => {
                                                    return <td key={item1.key}>
                                                        {
                                                            (invoiceInfo.generalDetails && invoiceInfo.generalDetails[item]) ? (
                                                                (item1.key === 'item' || item1.key === 'unit')
                                                                    ? <Input value={invoiceInfo.generalDetails[item][item1.key]} disabled={disabled} onChange={this.invoicelistDetailsInfoChange.bind(this, item)}></Input>
                                                                    : <AebfInput
                                                                        infoKey={item1.key}
                                                                        hideRMB={true}
                                                                        type={item1.type}
                                                                        disabled={disabled}
                                                                        inputValue={invoiceInfo.generalDetails[item][item1.key]}
                                                                        invoiceInfoChange={this.invoicelistDetailsInfoChange.bind(this, item)}
                                                                    />
                                                            ) : ''

                                                        }
                                                    </td>
                                                })
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="fourth-list">
                        <div>
                            {
                                fourthList.slice(0, 2).map(item => {
                                    return <div key={item.key}>
                                        <label>{item.name}</label>
                                        {
                                            item.key === 'amountTaxTotal' ?
                                                <AebfInput
                                                    type="02"
                                                    infoKey={item.key}
                                                    inputValue={invoiceInfo[item.key]}
                                                    disabled={disabled}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} /> :
                                                <Input
                                                    value={invoiceInfo[item.key]}
                                                    disabled={disabled}
                                                    onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                        }
                                    </div>
                                })
                            }
                        </div>
                        <div>
                            <div>
                                <label>{fourthList[2].name}</label>
                                <Input
                                    value={fourthList[2].key}
                                    disabled={disabled}
                                    onChange={this.invoiceInfoChange.bind(this, fourthList[2].key)}></Input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default GeneralPurposeTicket;
