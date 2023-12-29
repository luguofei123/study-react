/*
 * @Descripttion: 通行费增值税电子普通发票
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:01:02
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/TollValueAddedTax/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class TollValueAddedTax extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr7: Array.from((new Array(8)).keys()),
            arr3: Array.from((new Array(3)).keys()),
            purchaserInfo: [
                { name: '名称', key: 'buyerName' },
                { name: '纳税人识别号', key: 'buyerTaxNo' },
                { name: '地址、电话', key: 'buyerAddress' },
                { name: '开户行', key: 'buyerBank' },
                { name: '账号', key: 'buyerAccount' }
            ],
            sellerInfo: [
                { name: '名称', key: 'salerName' },
                { name: '纳税人识别号', key: 'salerTaxNo' },
                { name: '地址、电话', key: 'salerAddress' },
                { name: '开户行', key: 'salerBank' },
                { name: '账号', key: 'salerAccount' }
            ],
            detailTableHead: [
                { name: '项目名称', key: 'item', width: 200 },
                { name: '车牌号', key: 'plateNumber' },
                { name: '类型', key: 'type' },
                { name: '通行日期起', width: 120, key: 'startDate', inputType: '04' },
                { name: '通行日期止', width: 120, key: 'endDate', inputType: '04' },
                { name: '金额', key: 'amount', inputType: '03' },
                { name: '税率', width: 60, key: 'taxRate', inputType: '10', inputConfig: { precision: 0 } },
                { name: '税额', key: 'tax', inputType: '03' }
            ]
        }
    }
    invoicelistDetailsInfoChange (index, listDetail, listDetailsCode, code, value) {
        let params = {}
        let vatDetails = JSON.parse(JSON.stringify(listDetail))
        let currentRow = vatDetails[index]
        currentRow[code] = value
        // 计算需求
        if (code !== 'tax') {
            // 税额 = 金额 * 税率
            currentRow.tax = Number(((Number(currentRow?.amount || 0)) * Number(currentRow?.taxRate || 0)).toFixed(2))
        }
        // 金额合计
        params.amountTotal = vatDetails.reduce((sum, item) => {
            return sum + Number(item?.amount || 0)
        }, 0)
        // 税额合计
        params.taxTotal = vatDetails.reduce((sum, item) => {
            return sum + Number(item?.tax || 0)
        }, 0)
        // 小写合计 = 金额合计 + 税额合计
        params.amountTaxTotal = params.amountTotal + params.taxTotal
        params[listDetailsCode] = vatDetails
        params.captitalTotal = transRMBSmallToBig(params.amountTaxTotal || 0, $message)
        // 大写合计 = 小写合计转大写
        // let amountTaxTotal = 0
        // let keys = ['amountTaxTotal', 'amountTotal', 'taxTotal']
        // if (keys.includes(code)) {
        //     if (code === 'amountTaxTotal') {
        //         amountTaxTotal = params.amountTaxTotal
        //     } else if (code === 'amountTotal') {
        //         amountTaxTotal = params.amountTaxTotal = params.amountTotal + params.taxTotal
        //     } else if (code === 'taxTotal') {
        //         amountTaxTotal = params.amountTaxTotal = params.amountTotal + params.taxTotal
        //     }
        //     if (amountTaxTotal) {
        //         params.captitalTotal = transRMBSmallToBig(amountTaxTotal, $message)
        //     }
        // }
        Object.keys(params).forEach(key => {
            this.props.invoiceInfoChange(key, params[key])
        })
    }

    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { sellerInfo, purchaserInfo, arr3, arr7, detailTableHead } = this.state
        let tollsDetails = invoiceInfo.tollsDetails || [{}, {}, {}]
        return (<div className='toll-value-added-invoice' >
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
                <div className='left'>
                    {arr7.map((i, index) => <span className="circle" key={index}></span>)}
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
                            <AebfInput
                                infoKey="invoiceDate"
                                styleSelf={{ border: 'none', width: 120, bachground: 'transparent' }}
                                type="04" disabled={disabled}
                                inputValue={invoiceInfo.invoiceDate}
                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                        </div>
                    </div>
                    <div className="invoice-content">
                        <div className="invoice-content-top">
                            <div className="invoice-content-left">
                                <div className="invoice-content-title">购买方</div>
                                <div className="invoice-content-detail">
                                    {
                                        purchaserInfo.map((item, index) => {
                                            return (<div key={item.name}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                            {/* <div className="invoice-content-right">
                                <div className="invoice-content-title">销售方</div>
                                <div className="invoice-content-detail">
                                    {
                                        sellerInfo.map((item, index) => {
                                            return (<div key={item.name}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div> */}
                        </div>
                        <div className="invoice-content-middle">
                            <table border="1">
                                <thead>
                                    <tr height="35">
                                        {
                                            detailTableHead.map(item => {
                                                return <th key={item.key} width={item.width}>
                                                    {item.name}
                                                </th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {arr3.map((item, index) => {
                                        return <tr key={item} height={35}>
                                            {
                                                detailTableHead.map(item1 => {
                                                    return <td key={item1.name}>
                                                        <AebfInput
                                                            type={item1.inputType}
                                                            infoKey={item1.key}
                                                            inputConfig={item1.inputConfig}
                                                            disabled={disabled}
                                                            inputValue={tollsDetails[index][item1.key]}
                                                            invoiceInfoChange={this.invoicelistDetailsInfoChange.bind(this, index, tollsDetails, 'tollsDetails')} />
                                                    </td>
                                                })
                                            }
                                        </tr>
                                    })}
                                    <tr height="35">
                                        <td colSpan="5">
                                            <label>价税合计（大写）</label>
                                            <Input
                                                className='capital'
                                                disabled={disabled}
                                                value={invoiceInfo.captitalTotal}
                                                onChange={this.invoiceInfoChange.bind(this, 'captitalTotal')} />
                                            <label>（小写）</label>
                                            <AebfInput
                                                type='02'
                                                infoKey={'amountTaxTotal'}
                                                disabled={disabled}
                                                inputValue={invoiceInfo.amountTaxTotal}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                        </td>
                                        <td>
                                            <AebfInput
                                                type='02'
                                                infoKey={'amountTotal'}
                                                disabled={disabled}
                                                inputValue={invoiceInfo.amountTotal}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                        </td>
                                        <td></td>
                                        <td>
                                            <AebfInput
                                                type='02'
                                                infoKey={'taxTotal'}
                                                disabled={disabled}
                                                inputValue={invoiceInfo.taxTotal}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
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
                                        sellerInfo.map((item, index) => {
                                            return (<div key={item.name}>
                                                <label>{item.name}</label>
                                                <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                            </div>)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="invoice-content-remark">
                            <table border="1">
                                <tbody>
                                    <tr height="35">
                                        <td>
                                            <label>备注</label>
                                            <Input
                                                className="remark"
                                                style={{ width: 700 }}
                                                disabled={disabled}
                                                value={invoiceInfo.remark}
                                                onChange={this.invoiceInfoChange.bind(this, 'remark')} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    {arr7.map((i, index) => <span className="circle" key={index}></span>)}
                </div>
                {/* 
  <div class="toll-value-added-invoice">
    <div class="bg">
      <div class="center">
        <div class="invoice-content">
          <div class="invoice-content-middle">
            <table border="1">
              <tbody>
              <tr height="35">
                <td>
                  <label>备注</label>
                  <a-input
                      class="remark"
                      :value="invoiceInfo.remark"
                      :disabled="disabled"
                      @change="invoiceInfoChange(['remark', $event.target.value])"
                  ></a-input>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="invoice-content-bottom">

          </div>
        </div>
      </div>
      <div class="right">
        <span class="circle" v-for="n in 7" :key="n"></span>
      </div>
    </div>
  </div>
 */}
            </div>

        </div >);
    }
}
export default TollValueAddedTax;
