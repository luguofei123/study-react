/*
 * @Descripttion: 汽车客票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-18 09:16:39
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/CarPassengerTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
class CarPassengerTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(5)).keys()),
            numTitle: [
                { name: '发票号码', key: 'invoiceNo' },
                { name: '发票代码', key: 'invoiceCode' }
            ],
            tableHead: [
                [
                    { name: '始发地', key: 'startStation', width: 200 },
                    { name: '目的地', key: 'endStation', width: 200 },
                    { name: '票价(元)', key: 'amountTaxTotal', width: 150, inputType: '02' },
                    { name: '车型', key: 'vehicleType' }
                ],
                [
                    { name: '乘车日期', key: 'invoiceDate', width: 200, inputType: '04' },
                    { name: '开车时间', key: 'startTime', width: 200, inputType: '07' },
                    { name: '车次', key: 'trainNumber,', width: 150, },
                    { name: '座(卧)号', key: 'seatNumber' }
                ]
            ]
        }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    // invoiceInfoTimeChange (code, moment, value) {
    //     debugger
    //     this.props.invoiceInfoChange(code, value)
    // }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { numTitle, tableHead, arr } = this.state
        // 数据处理
        if (!invoiceInfo.invoiceTypeName) {
            invoiceInfo.invoiceTypeName = '汽车客票'
        }
        return (<div className='car-ticket-container' >
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
                    <div className="ticket-num">
                        {
                            numTitle.map(item => {
                                return <div key={item.key}>
                                    <label>{item.name}</label>
                                    <div>
                                        <AebfInput
                                            disabled={disabled}
                                            infoKey={item.key}
                                            inputValue={invoiceInfo[item.key]}
                                            invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="ticket-table">
                        {
                            tableHead.map((item, index) => {
                                return <table key={index}>
                                    <thead>
                                        <tr>
                                            {item.map((item1, index1) => {
                                                return <th key={item1.key} width={item1.width}>{item1.name}</th>
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {item.map((item1, index1) => {
                                                return <td key={item1.key} >
                                                    <AebfInput
                                                        type={item1.inputType}
                                                        disabled={item1.disabled}
                                                        infoKey={item1.key}
                                                        inputConfig={{
                                                            type: 'table',
                                                            fieldAlign: '1'
                                                        }}
                                                        inputValue={invoiceInfo[item1.key]}
                                                        invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                                </td>
                                            })}
                                        </tr>
                                    </tbody>

                                </table>
                            })
                        }
                    </div>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default CarPassengerTicket;
