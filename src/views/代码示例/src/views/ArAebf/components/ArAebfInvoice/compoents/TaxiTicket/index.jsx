/*
 * @Descripttion: 出租汽车票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:52
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/TaxiTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import taxiBgTop from '../../../img/taxiBg_top.png'
import taxiBgMiddle from '../../../img/taxiBg_middle.png'
import taxiBgBottom from '../../../img/taxiBg_bottom.png'
import './index.less'
const $message = Message
class TaxiTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ticketInfo: [
                { name: '发票代码', key: 'invoiceCode', inputType: '01' },
                { name: '发票号码', key: 'invoiceNo', inputType: '01' },
                { name: '车号', key: 'plateNumber', inputType: '01' },
                { name: '日期', key: 'invoiceDate', inputType: '04' },
                { name: '时间', key: 'startTime-endTime', inputType: '06' },
                { name: '金额', key: 'amountTaxTotal', inputType: '02' },
                // {name: '金额', key: 'amountTotal', inputType: '02'},
                // {name: '燃油附加费', key: 'fuelSurcharge', inputType: '02'},
                // {name: '预约叫车服务费', key: 'callSurcharge', inputType: '02'},
                // {name: '实收金额', key: 'amountTaxTotal', inputType: '02'}
            ]
        }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    saveBeforeCheck () {
        const { invoiceInfo } = this.props
        const { startTime, endTime } = invoiceInfo
        if (new Date(`1900-01-01 ${startTime}`).getTime() > new Date(`1900-01-01 ${endTime}`).getTime()) {
            $message.warning('出发时间大于到达时间!')
            return false
        }
        return true
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        let copyInvoiceInfo = JSON.parse(JSON.stringify(invoiceInfo))
        let startTime = copyInvoiceInfo.startTime ? copyInvoiceInfo.startTime : ''
        let endTime = copyInvoiceInfo.endTime ? copyInvoiceInfo.endTime : ''
        copyInvoiceInfo['startTime-endTime'] = `${startTime}-${endTime}`
        const { ticketInfo } = this.state
        // 数据处理
        if (!copyInvoiceInfo.invoiceTypeName) {
            copyInvoiceInfo.invoiceTypeName = '出租汽车票'
        }
        return (<div className='taxi-ticket' >
            <div className="bg_top" style={{ backgroundImage: `url(${taxiBgTop})` }}></div>
            <div className="bg_middle" style={{ backgroundImage: `url(${taxiBgMiddle})` }}>
                <CheckResult invoiceInfo={copyInvoiceInfo} background="#FFFDFA" />
                <div className="ticket-title">
                    <span>{copyInvoiceInfo.invoiceTypeName}</span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
                <div className="ticket-info">
                    {ticketInfo.map(item => {
                        return <div key={item.key}>
                            <label>{item.name}</label>
                            <div className="info-input">
                                <AebfInput
                                    type={item.inputType}
                                    disabled={disabled}
                                    infoKey={item.key}
                                    format={item.format}
                                    inputValue={copyInvoiceInfo[item.key]}
                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className="bg_bottom" style={{ backgroundImage: `url(${taxiBgBottom})` }}></div>
        </div>);
    }
}
export default TaxiTicket;
