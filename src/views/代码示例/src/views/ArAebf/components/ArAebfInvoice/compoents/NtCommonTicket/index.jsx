/*
 * @Descripttion: 非税
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:44
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/NtCommonTicket/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class NtCommonTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(7)).keys()),
            sellerInfo: [
                { name: '名称', key: 'salerName' },
                { name: '纳税人识别号', key: 'salerTaxNo' },
                { name: '开户行', key: 'salerBank' },
                { name: '账号', key: 'salerAccount' },
                { name: '地址、电话', key: 'salerAddress', width: "100%" }
            ],
            detailTableHead: [
                { name: '项目编号', key: 'code', width: 150 },
                { name: '项目名称', key: 'name', width: 200 },
                { name: '单位', width: 60, key: 'unit' },
                { name: '数量', width: 60, key: 'num', inputType: '03' },
                { name: '标准', key: 'standard', inputType: '03', longDecimal: true },
                { name: '金额', key: 'amount', inputType: '03' },
                { name: '备注', key: 'remark' }
            ],
            transTaxRate: false // 是否转换过费率
        }
    }
    invoicelistDetailsInfoChange (index, listDetail, listDetailsCode, code, value) {
        let params = {}
        let vatDetails = JSON.parse(JSON.stringify(listDetail))
        let currentRow = vatDetails[index]
        currentRow[code] = value
        // 金额 = 数量 * 单价
        if (code === 'standard' || code === 'num') {
            currentRow.amount = Number((Number(currentRow.standard) * Number(currentRow.num)).toFixed(2))
        }
        // 单价 = 金额 / 数量
        if (code === 'amount' || code === 'num') {
            if (Number(currentRow.num) !== 0) {
                currentRow.standard = Number((Number(currentRow.amount) / Number(currentRow.num)))
            }
        }
        // 税额 = 金额 * 税率
        if (code === 'amount' || code === 'taxRate') {
            currentRow.tax = Number(((Number(currentRow.amount) || 0) * (Number(currentRow.taxRate) || 0) / 100).toFixed(2))
        }
        // 金额合计
        params.amountTotal = vatDetails.reduce((sum, item) => {
            return sum + (Number(item.amount) || 0)
        }, 0)
        // 税额合计
        params.taxTotal = vatDetails.reduce((sum, item) => {
            return sum + (Number(item.tax) || 0)
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
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        let scrollWidthWithData = 0
        const { invoiceInfo, disabled } = this.props
        const { sellerInfo, purchaserInfo, arr, detailTableHead } = this.state
        const nonTaxDetails = invoiceInfo?.nonTaxDetails?.length < 3 ? Array.from((new Array(3)).keys()) : invoiceInfo?.nonTaxDetails
        let listDetailsCode = ''
        let listDetails = []
        listDetails = invoiceInfo?.nonTaxDetails
        listDetailsCode = 'nonTaxDetails'
        listDetails.forEach(item => {
            if (String(item.taxRate).indexOf('%') > -1) {
                item.taxRate = Number(item.taxRate.substr(0, item.taxRate.length - 1))
            }
        })
        // 数据处理
        if (!invoiceInfo.invoiceTypeName) {
            invoiceInfo.invoiceTypeName = '非税收入统一票据（电子）'
        }
        if (!invoiceInfo.captitalTotal && invoiceInfo.amountTaxTotal) {
            invoiceInfo.captitalTotal = transRMBSmallToBig(invoiceInfo.amountTaxTotal, $message)
        }
        return (<div className='nt-common-ticket' >
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background={'#fffdfa'} />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={index}></span>)}
                </div>
                <div className="center">
                    <div className="title-box">
                        <span className="title">{invoiceInfo.invoiceTypeName}</span>
                        <span className="line" ></span>
                        <span className="line" ></span>
                    </div>
                    <div className="number-box">
                        <div>
                            <label>票据代码</label>
                            <Input value={invoiceInfo.invoiceCode} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceCode')}></Input>
                        </div>
                        <div>
                            <label>发票号码</label>
                            <Input value={invoiceInfo.invoiceNo} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceNo')}></Input>
                        </div>
                        <div>
                            <label>交款人信用代码</label>
                            <Input value={invoiceInfo.buyerTaxNo} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'buyerTaxNo')}></Input>
                        </div>
                    </div>
                    <div className="number-box">
                        <div>
                            <label>校验码(后6位)</label>
                            <Input value={invoiceInfo.checkCode} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'checkCode')}></Input>
                        </div>
                        <div>
                            <label>交款人</label>
                            <Input value={invoiceInfo.buyerName} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'buyerName')}></Input>
                        </div>
                        <div>
                            <label>开票日期</label>
                            <AebfInput infoKey="invoiceDate" styleSelf={{ border: 'none', bachground: 'transparent' }} type="04" disabled={disabled} inputValue={invoiceInfo.invoiceDate} invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                        </div>
                    </div>
                    <div className="invoice-content">
                        <div className="invoice-content-middle">
                            <div className='scroll-table'>
                                <div className='content-table-box' style={{ width: `calc(100% + ${scrollWidthWithData}px)`, overflow: invoiceInfo?.nonTaxDetails?.length > 3 ? 'auto' : 'hidden' }}>
                                    <table className="content-table" border="1">
                                        <thead>
                                            <tr height="35">
                                                {
                                                    detailTableHead.map(item => {
                                                        return <th key={item.name} width={item.width}>
                                                            {item.name}
                                                        </th>
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                nonTaxDetails.map((item, index) => {
                                                    return <tr key={index} height="35">
                                                        {
                                                            detailTableHead.map((item1, index1) => {
                                                                return <td key={item1.name}>
                                                                    {listDetails[index] ? <AebfInput
                                                                        infoKey={item1.key}
                                                                        inputConfig={item1.inputConfig}
                                                                        longDecimal={item1.longDecimal}
                                                                        type={item1.inputType}
                                                                        disabled={disabled}
                                                                        inputValue={listDetails[index][item1.key]}
                                                                        invoiceInfoChange={this.invoicelistDetailsInfoChange.bind(this, index, listDetails, listDetailsCode)} /> : ''}
                                                                </td>
                                                            })
                                                        }
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <table className="header-table" border="1">
                                    <thead>
                                        <tr height="35">
                                            {
                                                detailTableHead.map(item => {
                                                    return <th key={item.name} width={item.width}>
                                                        {item.name}
                                                    </th>
                                                })
                                            }
                                        </tr>
                                    </thead>
                                </table>

                            </div>
                            <table className="bottom-table" border="1">
                                <tbody>
                                    <tr height="35">
                                        <td width="350">
                                            <label>合计人民币（大写）</label>
                                            <Input style={{ width: 200 }} value={invoiceInfo.captitalTotal} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'captitalTotal')}></Input>
                                        </td>
                                        <td width="189">
                                            <div className='td-small'>
                                                <label class="col-center">（小写）</label>
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
                        <div className="invoice-content-remark">
                            <table className="bottom-table" border="1">
                                <tbody>
                                    <tr height="105">
                                        <td>
                                            <label>其他信息：</label>
                                            <Input value={invoiceInfo.remark} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'remark')}></Input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="number-box bottom">
                        <div>
                            <label>收款单位</label>
                            <Input value={invoiceInfo.payee} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'payee')}></Input>
                        </div>
                        <div>
                            <label>复核人</label>
                            <Input value={invoiceInfo.checker} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'checker')}></Input>
                        </div>
                        <div>
                            <label>收款人</label>
                            <Input value={invoiceInfo.receiver} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'receiver')}></Input>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={index}></span>)}
                </div>
            </div>

        </div >);
    }
}
export default NtCommonTicket;
