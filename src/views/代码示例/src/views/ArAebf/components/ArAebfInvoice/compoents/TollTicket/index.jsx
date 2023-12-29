/*
 * @Descripttion: 过路过桥费票据
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:58
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/TollTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
class TollTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(5)).keys()),
            list: [
                [
                    { name: '发票代码', key: 'invoiceCode' },
                    { name: '发票号码', key: 'invoiceNo' }
                ],
                [
                    { name: '入口站', key: 'startStation' },
                    { name: '出口站', key: 'endStation' }
                ],
                [
                    { name: '金额', key: 'amountTaxTotal', inputType: '03' },
                    { name: '车型', key: 'vehicleType' }
                ],
                [
                    { name: '日期', key: 'invoiceDate', inputType: '04' },
                    { name: '时间', key: 'time', inputType: '05', format: 'HH:mm:ss' }
                ]
            ]

        }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { list, arr } = this.state
        if (invoiceInfo.invoiceType === '98') {
            invoiceInfo.invoiceTypeName = '过路过桥费发票'
        }
        return (<div className='toll-ticket' >
            <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
            <h1>{invoiceInfo.invoiceTypeName}</h1>
            {
                list.map((item, index) => {
                    return <div key={index} className='line-div'>
                        {
                            item.map((item1, index1) => {
                                return <div className={index ? 'two-column' : 'one-column'} key={item1.key}>
                                    <label>
                                        {item1.name}
                                    </label>
                                    <div className='line-row-div'>
                                        <AebfInput
                                            type={item1.inputType}
                                            disabled={disabled}
                                            infoKey={item1.key}
                                            format={item1.format}
                                            inputValue={invoiceInfo[item1.key]}
                                            invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>);
    }
}
export default TollTicket;
