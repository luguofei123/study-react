/*
 * @Descripttion: 电子发票(普通发票)/电子发票(增值税专用发票)
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:23
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/ElectronicInvoiceBill/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class ElectronicInvoiceBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: Array.from((new Array(6)).keys()),
      purchaserInfo: [
        { name: '名称', key: 'buyerName' },
        { name: '统一社会信用代码/纳税人识别号', key: 'buyerTaxNo', labelWidth: 330 }
      ],
      sellerInfo: [
        { name: '名称', key: 'salerName' },
        { name: '统一社会信用代码/纳税人识别号', key: 'salerTaxNo', labelWidth: 330 }
      ],
      detailTableHead: [
        { name: '项目名称', key: 'item', width: 278 },
        { name: '规格型号', width: 110, key: 'model' },
        { name: '单位', width: 60, key: 'unit' },
        { name: '数量', width: 60, key: 'num', inputType: '03' },
        { name: '单价', key: 'price', inputType: '03', longDecimal: true },
        { name: '金额', key: 'amount', inputType: '03' },
        { name: '税率', width: 65, key: 'taxRate', inputType: '10', inputConfig: { precision: 0 } },
        { name: '税额', width: 110, key: 'tax', inputType: '03' }
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
    const { purchaserInfo, sellerInfo, arr, detailTableHead } = this.state
    const vatDetails = invoiceInfo.vatDetails?.length < 3 ? Array.from((new Array(3)).keys()) : invoiceInfo.vatDetails
    let scrollWidthWithData = 0
    let listDetailsCode = ''
    let listDetails = []
    listDetails = invoiceInfo.vatDetails
    listDetailsCode = 'vatDetails'
    listDetails.forEach(item => {
      if (String(item.taxRate).indexOf('%') > -1) {
        item.taxRate = Number(item.taxRate.substr(0, item.taxRate.length - 1))
      }
    })
    // 数据处理
    if (!invoiceInfo.invoiceTypeName) {
      invoiceInfo.invoiceTypeName = '电子发票（普通发票）'
    }
    if (!invoiceInfo.captitalTotal && invoiceInfo.amountTaxTotal) {
      invoiceInfo.captitalTotal = transRMBSmallToBig(invoiceInfo.amountTaxTotal, $message)
    }
    return (<div className='ele-vat-special-invoice' >
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
                    purchaserInfo.map(item => {
                      return <div className='content-detail-item' key={item.name}>
                        <label style={{ width: item.labelWidth ? item.labelWidth : 'auto' }}>{item.name}</label>
                        <Input style={{ width: item.key === 'buyerName' ? 355 : '' }} value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)} />
                      </div>
                    })
                  }
                </div>
              </div>
              <div className="invoice-content-right">
                <div className="invoice-content-title">销售方</div>
                <div className="invoice-content-detail">
                  {
                    sellerInfo.map(item => {
                      return <div className='content-detail-item' key={item.name}>
                        <label style={{ width: item.labelWidth ? item.labelWidth : 'auto' }}>{item.name}</label>
                        <Input style={{ width: item.key === 'salerName' ? 354 : '' }} value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)} />
                      </div>
                    })
                  }
                </div>
              </div>

            </div>
            <div className="invoice-content-middle">
              <div className="scroll-table">
                <div className="content-table-box" style={{ width: `calc(100% + ${scrollWidthWithData}px)` }}>
                  <div className="content-table" border="1">
                    <div className='table-header' style={{ width: `calc(100% - ${scrollWidthWithData}px)` }} >
                      <div className="table-body-row">
                        {
                          detailTableHead.map(item => {
                            return <div key={item.name} className='table-cell table-cell-th' style={{ width: item.width, flex: !item.width ? 1 : 'none' }}>
                              {item.name}
                            </div>
                          })
                        }
                      </div>
                    </div>
                    <div className="table-body">
                      {
                        vatDetails.map((item, index) => {
                          return <div className="table-body-row" key={index}>
                            {
                              detailTableHead.map((item1, index1) => {
                                return <div style={{ width: item1.width, flex: !item1.width ? 1 : 'none' }} className="table-cell table-cell-td" key={item1.name}>
                                  {listDetails[index] ? <AebfInput
                                    infoKey={item1.key}
                                    inputConfig={item1.inputConfig}
                                    longDecimal={item1.longDecimal}
                                    type={item1.inputType}
                                    disabled={disabled}
                                    inputValue={listDetails[index][item1.key]}
                                    invoiceInfoChange={this.invoicelistDetailsInfoChange.bind(this, index, listDetails, listDetailsCode)} /> : ''}
                                </div>
                              })
                            }

                          </div>
                        })
                      }

                    </div>
                  </div>

                </div>
              </div>
              <div className="total-table">
                <span className="total">合计</span>
                <span className="total-money">
                  <AebfInput
                    infoKey="amountTotal"
                    type="02"
                    disabled={disabled}
                    inputValue={invoiceInfo.amountTotal}
                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                </span>
                <span className="place-empty"></span>
                <span className="tax-amount">
                  <AebfInput
                    infoKey="capital"
                    type="02"
                    disabled={disabled}
                    inputValue={invoiceInfo.taxTotal}
                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                </span>
              </div>
              <div className="bottom-table">
                <label>价税合计（大写）</label>
                <span className="invoice-text">
                  <AebfInput
                    stylePSelf={{ width: 300 }}
                    infoKey="captitalTotal"
                    disabled={disabled}
                    inputValue={invoiceInfo.captitalTotal}
                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                </span>
                <label>（小写）</label>
                <AebfInput
                  infoKey="amountTaxTotal"
                  type="02"
                  disabled={disabled}
                  inputValue={invoiceInfo.amountTaxTotal}
                  invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
              </div>
            </div>
            <div className="invoice-content-bottom">
              <div className="invoice-content-title">备注</div>
              <div className="invoice-content-detail">
                <Input value={invoiceInfo.remark} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'remark')}></Input>
              </div>
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
export default ElectronicInvoiceBill;

