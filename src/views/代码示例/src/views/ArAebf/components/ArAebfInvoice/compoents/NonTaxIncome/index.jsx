/*
 * @Descripttion: 非税收入一般缴款书
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:00:37
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/NonTaxIncome/index.jsx
 */
import { Input, Message } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class NonTaxIncome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: Array.from((new Array(7)).keys()),
      payInfo: [
        { name: '全称', key: 'payAccName' },
        { name: '账号', key: 'payAccNo' },
        { name: '开户银行', key: 'payAccBank' }
      ],
      recInfo: [
        { name: '全称', key: 'recAccName' },
        { name: '账号', key: 'recAccNo' },
        { name: '开户银行', key: 'recAccBank' }
      ],
      detailTableHead: [
        { name: '项目编码', key: 'govProjectCode', width: 100 },
        { name: '收入项目名称', key: 'govProjectName', width: 250, textAlign: 'left' },
        { name: '单位', width: 60, key: 'collectionStandardUom' },
        { name: '数量', width: 60, key: 'receiveNum' },
        { name: '收缴标准', key: 'collectionStandard', inputType: '03', longDecimal: true, textAlign: 'right' },
        { name: '金额', key: 'collectionProjectMoney', inputType: '03', textAlign: 'right' }
      ],
      titleInfo: [
        { name: '缴款码', codeName: 'govIdentifyCode' },
        { name: '执收单位编码', codeName: 'executableUnitCode' },
        { name: '票据代码', codeName: 'invoiceCode' },
        { name: '校验码', codeName: 'checkCode' },
        { name: '执收单位名称', codeName: 'executableUnitName' },
        { name: '发票号码', codeName: 'invoiceNo' },
        { name: '填制日期', codeName: 'invoiceDate' }
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
    const { titleInfo, payInfo, recInfo, arr, detailTableHead } = this.state
    const noneTaxIncomeDetails = invoiceInfo?.noneTaxIncomeDetails?.length < 3 ? Array.from((new Array(3)).keys()) : invoiceInfo?.noneTaxIncomeDetails
    let listDetailsCode = ''
    let listDetails = []
    // listDetails = invoiceInfo?.noneTaxIncomeDetails
    listDetailsCode = 'noneTaxIncomeDetails'
    return (<div className='no-tax-income' >
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
            {
              titleInfo.map((item, index) => {
                return <div key={item.codeName} style={{ display: index !== 0 ? 'inline-block' : 'block' }}>
                  <label>{item.name + ':'}</label>
                  <span>{invoiceInfo[item.codeName]}</span>
                </div>
              })
            }
          </div>
          <div className="invoice-content">
            <div className="invoice-content-top">
              <div className="invoice-content-left">
                <div className="invoice-content-title">付款人</div>
                <div className="invoice-content-detail">
                  {
                    payInfo.map(item => {
                      return <div key={item.name}>
                        <label>{item.name}</label>
                        <span style={{ padding: '0 5px' }}>{invoiceInfo[item.key]}</span>
                      </div>
                    })
                  }
                </div>
              </div>
              <div className="invoice-content-right">
                <div className="invoice-content-title">收款人</div>
                <div className="invoice-content-detail">
                  {
                    recInfo.map(item => {
                      return <div key={item.name}>
                        <label>{item.name}</label>
                        <span style={{ padding: '0 5px' }}>{invoiceInfo[item.key]}</span>
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
            <div className="invoice-content-middle">
              <table className="moneyContent" border="1">
                <tbody>
                  <tr height="35">
                    <td width="429" style={{ borderTop: 'none' }}>
                      <div style={{ display: 'inline-block' }}>
                        <label>币种:</label>
                        <span>人民币</span>
                        <label>金额（大写）</label>
                        <span>{invoiceInfo.captitalTotal}</span>
                      </div>
                    </td>
                    <td style={{ borderTop: 'none', textAlign: 'left' }}>
                      <label>（小写）</label>
                      <span>{invoiceInfo.amountTaxTotal.toFixed(2)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="scroll-table">
                <div className="content-table-box" style={{ width: `calc(100% + ${scrollWidthWithData}px)`, 'overflowY': invoiceInfo?.noneTaxIncomeDetails?.length > 3 ? 'auto' : 'hidden' }}>
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
                        noneTaxIncomeDetails.map((item, index) => {
                          return <tr height={35} key={index}>
                            {
                              detailTableHead.map(item1 => {
                                return <td key={item1.name} style={{ textAlign: item1.textAlign ? item1.textAlign : '' }}>
                                  {noneTaxIncomeDetails[index] && noneTaxIncomeDetails[index][item1.key]
                                    ? <span>{item1.inputType === '03' ? noneTaxIncomeDetails[index][item1.key].toFixed(2) : noneTaxIncomeDetails[index][item1.key]}</span>
                                    : ''}
                                </td>
                              })
                            }
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <table className="bottom-table" border="1">
                <tbody>
                  <tr height="60">
                    <td width="350">
                      <label>经办人（盖章）</label>
                      <span>{invoiceInfo.operator}</span>
                    </td>
                    <td style={{ textAlign: 'left' }}>
                      <label>备注：</label>
                      <span>{invoiceInfo.remark}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="invoice-content-bottom">
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
export default NonTaxIncome;
