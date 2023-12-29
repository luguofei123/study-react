/*
 * @Descripttion: 医疗发票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:31
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/MedicalTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class MedicalTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(5)).keys()),
            sellerInfo: [
                { name: '交款人', key: 'buyerName' },
                { name: '性别', key: 'sex' },
                { name: '业务流水号', key: 'workflowNumber' },
                { name: '医疗机构类型', key: 'medicalInstitutionType' },
                { name: '医保类型', key: 'medicalInsuranceType' },
                { name: '社会保障卡号', key: 'buyerTaxNo' }
            ],
            transTaxRate: false // 是否转换过费率
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
        const { arr, sellerInfo } = this.state
        return (<div className='medical-ticket' >
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background="#fffdfa" />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={index}></span>)}
                </div>
                <div className="center">
                    <div className="title-box">
                        <span className="title">{invoiceInfo.invoiceTypeName}</span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </div>
                    <div className="number-box">
                        <div>
                            <label>交易流水号</label>
                            <Input value={invoiceInfo.transactionNumber} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'transactionNumber')}></Input>
                        </div>
                        <div>
                            <label>票据号码</label>
                            <Input value={invoiceInfo.invoiceNo} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceNo')}></Input>
                        </div>
                        <div>
                            <label>开票日期</label>
                            <AebfInput infoKey="invoiceDate" styleSelf={{ border: 'none', width: 120, bachground: 'transparent' }} type="04" disabled={disabled} inputValue={invoiceInfo.invoiceDate} invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                        </div>
                    </div>
                    <div className="invoice-content">
                        <div className="invoice-content-middle">
                            <table className="bottom-table" border="1">
                                <tbody>
                                    <tr height="35">
                                        <td width="539">
                                            <div className='table-td'>
                                                <label>合计人民币（大写）</label>
                                                <Input value={invoiceInfo.captitalTotal} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'captitalTotal')}></Input>
                                                <label>（小写）</label>
                                                <AebfInput
                                                    infoKey="amountTaxTotal"
                                                    type="02"
                                                    disabled={disabled}
                                                    inputValue={invoiceInfo.amountTaxTotal}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="invoice-content-bottom">
                            <div className="invoice-content-right">
                                <div className="invoice-content-title">其他信息</div>
                                <div className="invoice-content-detail">
                                    {
                                        sellerInfo.map(item => {
                                            return <div className="content-detail-item" key={item.name} style={{ width: item.width }}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={index}></span>)}
                </div>
            </div>
        </div>);

    }
}
export default MedicalTicket;
