/*
 * @Descripttion: 船运客票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:01:34
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/WaterTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
class WaterTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(6)).keys()),
            numTitle: [
                { name: '发票号码', key: 'invoiceNo' },
                { name: '发票代码', key: 'invoiceCode' }
            ],
            locationTitle: [
                { key: 'startPort' },
                { key: 'shipName' },
                { key: 'endPort' }
            ],
            infoTitle: [
                { name: '开船时间', key: 'invoiceDate', inputType: '08', showTime: true, format: 'YYYY-MM-DD HH:mm' },
                { name: '等级', key: 'shipClass' },
                { name: '位号', key: 'seatNo' },
                { name: '票价', key: 'amountTaxTotal', inputType: '03' }
            ]

        }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { numTitle, locationTitle, infoTitle, arr } = this.state
        return (<div className='water-ticket-container' >
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background="#F4FCFF" />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
                <div className="center">
                    <div className="ticket-title">
                        <span>{invoiceInfo.invoiceTypeName}</span>
                    </div>
                    <div className="ticket-num">
                        {numTitle.map(item => {
                            return <div key={item.key}>
                                <label>{item.name}</label>
                                <div>
                                    <AebfInput
                                        infoKey={item.key}
                                        inputValue={invoiceInfo[item.key]}
                                        disabled={disabled}
                                        invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="ticket-location">
                        {
                            locationTitle.map((item, index) => {
                                return <div key={item.key}>
                                    {index === 1 ? <label>船名</label> : ''}
                                    <AebfInput
                                        infoKey={item.key}
                                        inputValue={invoiceInfo[item.key]}
                                        disabled={disabled}
                                        invoiceInfoChange={this.invoiceInfoChange.bind(this)} />

                                </div>
                            })
                        }
                    </div>
                    <div className="ticket-info">
                        {infoTitle.map(item => {
                            return <div key={item.key}>
                                <label>{item.name}</label>
                                <div>
                                    <AebfInput
                                        showTime={item.showTime}
                                        format={item.format}
                                        type={item.inputType}
                                        infoKey={item.key}
                                        inputValue={invoiceInfo[item.key]}
                                        disabled={disabled}
                                        invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default WaterTicket;
