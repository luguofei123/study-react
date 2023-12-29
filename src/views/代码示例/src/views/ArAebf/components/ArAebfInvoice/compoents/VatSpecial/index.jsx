/*
 * @Descripttion: 增值税专用发票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-24 18:50:57
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/VatSpecial/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class VatSpecial extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(7)).keys()),
            disabled: false,
            purchaserInfo: [
                { name: '名称', key: 'buyerName' },
                { name: '纳税人识别号', key: 'buyerTaxNo' },
                { name: '开户行', key: 'buyerBank' },
                { name: '账号', key: 'buyerAccount' },
                { name: '地址、电话', key: 'buyerAddress', width: "100%" },
            ],
            sellerInfo: [
                { name: '名称', key: 'salerName' },
                { name: '纳税人识别号', key: 'salerTaxNo' },
                { name: '开户行', key: 'salerBank' },
                { name: '账号', key: 'salerAccount' },
                { name: '地址、电话', key: 'salerAddress', width: "100%" },
            ],
            detailTableHead: [
                { name: '货物或应税劳务、服务名称', key: 'item', width: 200 },
                { name: '规格型号', key: 'model', width: 109.75 },
                { name: '单位', width: 60, key: 'unit' },
                { name: '数量', width: 60, key: 'num', inputType: '03' },
                { name: '单价', key: 'price', inputType: '03', longDecimal: true },
                { name: '金额', key: 'amount', inputType: '03' },
                { name: '税率', width: 60, key: 'taxRate', inputType: '10', inputConfig: { precision: '0' } },
                { name: '税额', key: 'tax', inputType: '03' }
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
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { sellerInfo, purchaserInfo, arr, detailTableHead } = this.state
        const vatDetails = invoiceInfo.vatDetails?.length < 3 ? Array.from((new Array(3)).keys()) : invoiceInfo.vatDetails || []
        let listDetailsCode = ''
        let listDetails = []
        if (invoiceInfo.invoiceType === '12') {
            listDetails = invoiceInfo.tollsDetails
            listDetailsCode = 'tollsDetails'
        } else {
            listDetails = invoiceInfo.vatDetails || []
            listDetails.forEach(item => {
                if (String(item.taxRate).indexOf('%') > -1) {
                    item.taxRate = Number(item.taxRate.substr(0, item.taxRate.length - 1))
                }
            })
            listDetailsCode = 'vatDetails'
        }
        // 数据处理
        // if (!invoiceInfo.invoiceTypeName) {
        //     invoiceInfo.invoiceTypeName = '增值税普通票据（折叠票）'
        // }
        // 名字处理
        if (invoiceInfo.invoiceType === '01') {
            invoiceInfo.invoiceTypeName = '增值税专用发票'
        } else if (invoiceInfo.invoiceType === '03') {
            invoiceInfo.invoiceTypeName = '增值税电子专用发票'
        } else if (invoiceInfo.invoiceType === '04') {
            invoiceInfo.invoiceTypeName = '增值税普通发票（折叠票）'
        } else if (invoiceInfo.invoiceType === '10') {
            invoiceInfo.invoiceTypeName = '增值税电子普通发票'
        } else if (invoiceInfo.invoiceType === '11') {
            invoiceInfo.invoiceTypeName = '增值税普重发票（卷票）'
        } else if (invoiceInfo.invoiceType === '13') {
            invoiceInfo.invoiceTypeName = '区块链电子发票'
        } else if (invoiceInfo.invoiceType === '25') {
            invoiceInfo.invoiceTypeName = '通用电子发票'
        }
        else {
            invoiceInfo.invoiceTypeName = '增值税普通票据（折叠票）'
        }

        // 处理验证码
        if (invoiceInfo.checkCode && invoiceInfo.checkCode.length > 6) {
            invoiceInfo.checkCode = invoiceInfo.checkCode.substr(-6)
        }
        if (!invoiceInfo.captitalTotal && invoiceInfo.amountTaxTotal) {
            invoiceInfo.captitalTotal = transRMBSmallToBig(invoiceInfo.amountTaxTotal, $message)
        }
        let scrollTableStyle = {

        }
        if (listDetails.length > 3) {
            scrollTableStyle = { width: `calc(100% + ${8}px)`, 'overflow-y': 'auto' }
        } else {
            scrollTableStyle = { width: `calc(100% + ${0}px)`, 'overflow-y': 'hidden' }
        }


        return (<div className='vat-special-invoice' >
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
                            <label>发票号码</label>
                            <Input value={invoiceInfo.invoiceNo} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceNo')}></Input>
                        </div>
                        <div>
                            <label>发票代码</label>
                            <Input value={invoiceInfo.invoiceCode} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceCode')}></Input>
                        </div>
                        <div>
                            <label>校验码(后6位)</label>
                            <Input maxLength={6} value={invoiceInfo.checkCode} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'checkCode')}></Input>
                        </div>
                        <div>
                            <label>开票日期</label>
                            <AebfInput infoKey="invoiceDate" styleSelf={{ border: 'none', width: 120, bachground: 'transparent' }} type="04" disabled={disabled} inputValue={invoiceInfo.invoiceDate} invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                        </div>
                    </div>
                    <div className="invoice-content">
                        <div className="invoice-content-top">
                            <div className="invoice-content-left">
                                <div className="invoice-content-title">购买方</div>
                                <div className="invoice-content-detail">
                                    {
                                        purchaserInfo.map((item, index) => {
                                            return (<div className="content-detail-item" style={{ width: item.width }} key={item.name}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="invoice-content-middle">
                            <div className="scroll-table">

                                <div className="content-table-box" style={scrollTableStyle}>
                                    <table className="content-table" border="1">
                                        <thead>
                                            <tr height="35">
                                                {detailTableHead.map(item => {
                                                    return <th key={item.name} width={item.width}>{item.name}</th>
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                vatDetails.map((item, index) => {
                                                    return (<tr key={index} height={35}>
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
                                                    </tr>)
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <table className="header-table" border="1">
                                    <thead>
                                        <tr height="35">
                                            {detailTableHead.map((item, index) => {
                                                return <th key={item.name} width={item.width}>{item.name}</th>
                                            })}
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <table className="bottom-table" border="1">
                                <tbody>
                                    <tr height="35">
                                        <td width="539">
                                            <label>价税合计（大写）</label>
                                            <Input style={{ width: 215 }} value={invoiceInfo.captitalTotal} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'captitalTotal')}></Input>
                                            <label>（小写）</label>
                                            <AebfInput
                                                clasStyle="lower-case"
                                                inputValue={invoiceInfo.amountTaxTotal}
                                                type="02"
                                                // styleSelf={{ width: 110 }}
                                                disabled={disabled}
                                                infoKey={'amountTaxTotal'}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                            />
                                        </td>
                                        <td width="110">
                                            <AebfInput
                                                clasStyle="total-money"
                                                inputValue={invoiceInfo.amountTotal}
                                                type="02"
                                                disabled={disabled}
                                                infoKey={'amountTotal'}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                            />
                                        </td>
                                        <td width="60"></td>
                                        <td>
                                            <AebfInput
                                                inputValue={invoiceInfo.taxTotal}
                                                type="02"
                                                disabled={disabled}
                                                infoKey={'taxTotal'}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="invoice-content-bottom">
                            <div className="invoice-content-right">
                                <div className="invoice-content-title">销售方</div>
                                <div className="invoice-content-detail">
                                    {
                                        sellerInfo.map((item) => {
                                            return (<div className="content-detail-item" style={{ width: item.width }} key={item.name}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="invoice-content-remark">
                            <table className="bottom-table" border="1">
                                <tbody>
                                    <tr height="35">
                                        <td>
                                            <label>备注</label>
                                            <Input style={{ width: 700 }} value={invoiceInfo['remark']} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'remark')}></Input>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
export default VatSpecial;
