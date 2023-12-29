/*
 * @Descripttion:  工会经费收入专用票据
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:01:09
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/TradeFundIncomeBill/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class TradeFundIncomeBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: Array.from((new Array(5)).keys()),
      detailTableHead: [
        { name: '工会经费收入项目', key: 'code' },
        { name: '内  容', key: 'name' },
        { name: '金额', width: 150, key: 'price', inputType: '03' }
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
    let scrollWidthWithData = 0
    const { invoiceInfo, disabled } = this.props
    const { sellerInfo, purchaserInfo, arr, detailTableHead } = this.state
    const nonTaxDetails = invoiceInfo?.nonTaxDetails?.length < 3 ? Array.from((new Array(3)).keys()) : invoiceInfo?.nonTaxDetails
    let listDetailsCode = ''
    let listDetails = []
    listDetails = invoiceInfo?.nonTaxDetails
    listDetailsCode = 'nonTaxDetails'
    return (<div className='trade-fund-income-bill' >
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
              <label>国财</label>
              <Input value={invoiceInfo.guocaiCode} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'guocaiCode')}></Input>
            </div>
            <div>
              <label >票据号码</label>
              <Input value={invoiceInfo.invoiceNo} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'invoiceNo')}></Input>
            </div>
            <div className="justify-end">
              <label >开票日期</label>
              <AebfInput infoKey="invoiceDate" styleSelf={{ border: 'none', bachground: 'transparent' }} type="04" disabled={disabled} inputValue={invoiceInfo.invoiceDate} invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
            </div>
          </div>
          <div className="invoice-content">
            <div className="invoice-content-middle">
              <div className="top-table">
                <label>缴款单位（人）:</label>
                <span className="col-text-content">
                  <Input value={invoiceInfo.revieveCompany} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'revieveCompany')}></Input>
                </span>
              </div>
              <div className="scroll-table">
                <div className="content-table-box" style={{ width: `calc(100% + ${scrollWidthWithData}px)` }}>
                  <div className="content-table" border="1">
                    <div className='table-header' style={{ width: `calc(100% - ${scrollWidthWithData}px)` }} >
                      <div className="table-body-row">
                        {
                          detailTableHead.map(item => {
                            return <div key={item.name} className='table-cell table-cell-th' style={{ width: item.width - 2, flex: !item.width ? 1 : 'none' }}>
                              {item.name}
                            </div>
                          })
                        }
                      </div>
                    </div>
                    <div className="table-body">
                      {
                        nonTaxDetails
                          .map((item, index) => {
                            return <div className="table-body-row" key={index}>
                              {
                                detailTableHead.map((item1, index1) => {
                                  return <div style={{ width: item1.width, flex: !item1.width ? 1 : 'none' }} className="table-cell table-cell-td" key={item1.name}>
                                    {listDetails[index] ? <AebfInput
                                      infoKey={item1.key}
                                      inputConfig={item1.inputConfig}
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
              <div className="bottom-table">
                <div className="bottom-item">
                  <label className="label-money">合计金额人民币（小写）</label>
                  <AebfInput
                    infoKey="amountTaxTotal"
                    type="02"
                    disabled={disabled}
                    inputValue={invoiceInfo.amountTaxTotal}
                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                </div>
                <div className="bottom-item">
                  <label className="label-money">合计金额人民币（大写）</label>
                  <Input value={invoiceInfo.captitalTotal} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, 'captitalTotal')}></Input>
                </div>
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
export default TradeFundIncomeBill;
