/*
 * @Descripttion: 通用定额发票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:48
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/QuotaInvoice/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
class QuotaInvoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                { name: '发票代码', infoKey: 'invoiceCode' },
                { name: '发票号码', infoKey: 'invoiceNo' },
                { name: '日期', infoKey: 'invoiceDate', type: '04' },
                { name: '金额', infoKey: 'amountTaxTotal', type: '03' }
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
        const { list } = this.state

        if (invoiceInfo.invoiceType === '97') {
            invoiceInfo.invoiceTypeName = '停车费发票'
        } else if (invoiceInfo.invoiceType === '99') {
            invoiceInfo.invoiceTypeName = '火车退票费发票'

        } else {
            console.log('22')
        }
        return (<div className='quota-invoice' >
            <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
            <h1>{invoiceInfo.invoiceTypeName}</h1>
            {
                list.map(item => {
                    return <div key={item.key} className='item'>
                        <label>{item.name}</label>
                        <AebfInput
                            type={item.type}
                            disabled={disabled}
                            infoKey={item.infoKey}
                            inputValue={invoiceInfo[item.infoKey]}
                            invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                        />
                    </div>
                })
            }
        </div>);
    }
}
export default QuotaInvoice;
