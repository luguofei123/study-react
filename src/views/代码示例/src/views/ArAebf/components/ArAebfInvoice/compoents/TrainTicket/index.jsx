/*
 * @Descripttion: 火车票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:01:13
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/TrainTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
class TrainTicket extends Component {
    constructor(props) {
        super(props)
        // this.state = {

        // }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    invoiceInfoTimeChange (code, moment, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        return (<div className='train-ticket-container' >
            <div className="train-ticket">
                <CheckResult invoiceInfo={invoiceInfo} background={'#EDF9FF'} />
                <div className="leftTitle">
                    <Input value={invoiceInfo.invoiceNo} onChange={this.invoiceInfoChange.bind(this, 'invoiceNo')} className='ticket-code' disabled={disabled} />
                </div>
                <div className="trickInfo">
                    <div className="top">
                        <Input value={invoiceInfo.startStation} onChange={this.invoiceInfoChange.bind(this, 'startStation')} disabled={disabled} />
                        <div className="arrowInput">
                            <Input value={invoiceInfo.trainNumber} onChange={this.invoiceInfoChange.bind(this, 'trainNumber')} disabled={disabled} />
                        </div>
                        <Input value={invoiceInfo.endStation} onChange={this.invoiceInfoChange.bind(this, 'endStation')} disabled={disabled} />
                    </div>
                    <div className="middle">
                        <div className="time-box">
                            <div>
                                <AebfInput
                                    type="08"
                                    showTime
                                    format={['YYYY-MM-DD HH:mm:ss']}
                                    inputValue={invoiceInfo.invoiceDate}
                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                    disabled={disabled}
                                    infoKey="invoiceDate" />
                            </div>
                            开
                        </div>
                        <Input value={invoiceInfo.seatNumber} onChange={this.invoiceInfoChange.bind(this, 'seatNumber')} disabled={disabled} />
                    </div>
                    <div className="bottom">
                        <div className="money">
                            <AebfInput
                                type="02"
                                inputValue={invoiceInfo.amountTaxTotal}
                                invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                disabled={disabled}
                                inputConfig={{ type: 'table', precision: 2 }}
                                infoKey="amountTaxTotal" />
                        </div>
                        <Input value={invoiceInfo.category} onChange={this.invoiceInfoChange.bind(this, 'category')} disabled={disabled} />
                    </div>
                    <div className="bottomBg">
                        <Input value={invoiceInfo.buyerTaxNo} onChange={this.invoiceInfoChange.bind(this, 'buyerTaxNo')} disabled={disabled} />
                        <Input value={invoiceInfo.buyerName} onChange={this.invoiceInfoChange.bind(this, 'buyerName')} disabled={disabled} />
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default TrainTicket;
