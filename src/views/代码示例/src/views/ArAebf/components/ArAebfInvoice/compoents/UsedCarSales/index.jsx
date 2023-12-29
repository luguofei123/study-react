/*
 * @Descripttion: 二手车销售统一票据
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-24 09:38:14
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/UsedCarSales/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class UsedCarSales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(8)).keys()),
            firstList: [
                { name: '发票号码', key: 'invoiceNo' },
                { name: '发票代码', key: 'invoiceCode' },
                { name: '开票日期', key: 'invoiceDate', type: '04' }
            ],
            secondList: [
                {
                    details: [
                        {
                            name: '买方单位/个人',
                            key: 'buyerName'
                        },
                        {
                            name: '单位代码/身份证号码',
                            key: 'buyerTaxNo'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '买方单位/个人住址',
                            key: 'buyerAddress'
                        },
                        {
                            name: '电话',
                            key: 'buyerTel'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '卖方单位/个人',
                            key: 'salerName'
                        },
                        {
                            name: '单位代码/身份证号码',
                            key: 'salerTaxNo'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '卖方单位/个人住址',
                            key: 'salerAddress'
                        },
                        {
                            name: '电话',
                            key: 'salerTel'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '车牌照号',
                            key: 'licensePlate'
                        },
                        {
                            name: '登记证号',
                            key: 'registNo'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '车辆类型',
                            key: 'vehicleType'
                        },
                        {
                            name: '厂牌型号',
                            key: 'model'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '车价合计（大写）',
                            key: 'captitalTotal',
                            disabled: true
                        },
                        {
                            name: '小写',
                            key: 'amountTaxTotal',
                            type: '02'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '经营、拍卖单位',
                            key: 'businessName'
                        },
                        {
                            name: '纳税人识别号',
                            key: 'businessTaxNo'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '开户银行、账号',
                            key: 'businessBank'
                        },
                        {
                            name: '电话',
                            key: 'businessTel'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '二手车市场',
                            key: 'companyName'
                        },
                        {
                            name: '纳税人识别号',
                            key: 'companyTaxNo'
                        }
                    ],
                    className: 'second-list'
                },
                {
                    details: [
                        {
                            name: '开户银行、账号',
                            key: 'companyBank'
                        },
                        {
                            name: '电话',
                            key: 'companyTel'
                        }
                    ],
                    className: 'third-list'
                }
            ],
            fourthList: [
                { name: '备注：', key: 'remark' }
            ],
            transTaxRate: false
        }
    }

    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    invoiceInfoTimeChange (code, moment, value) {
        this.props.invoiceInfoChange(code, value)
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
    render () {
        const { invoiceInfo, disabled } = this.props
        const { arr, firstList, secondList, thirdList, fourthList } = this.state
        // let planeDetails = JSON.parse(JSON.stringify(invoiceInfo.planeDetails))
        const getDetailDetail = (key, index, type) => {
            let value = null
            if (planeDetails[index]) {
                value = planeDetails[index][key]
            }
            if (index) {
                if (type === 'PLACE' && planeDetails[index - 1] && planeDetails[index - 1].endStation) {
                    // 最后一行处理
                    value = planeDetails[index - 1].endStation
                }
            }
            if (value) {
                if (key === 'rideDate') {
                    // value = moment(value, 'YYYY-MM-DD')
                }
                if (key === 'rideTime') {
                    // value = moment(value, 'HH-mm')
                }
            }
            return value


        }
        if (invoiceInfo.invoiceType === '22') {
            invoiceInfo.invoiceTypeName = '二手车销售统一（发票）'
        }
        return (<div className="usedCar-ticket">
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
                <div className="center">
                    <div className="ticket-title">
                        <span>{invoiceInfo.invoiceTypeName}</span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </div>
                    <div className="first-list">
                        {
                            firstList.map(item => {
                                return <div key={item.key}>
                                    <label>{item.name}</label>
                                    <div>
                                        <AebfInput
                                            infoKey={item.key}
                                            type={item.type}
                                            disabled={disabled}
                                            inputValue={invoiceInfo[item.key]}
                                            invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    {
                        secondList.map((item, index) => {
                            return <div className={item.className} key={item.key}>
                                {
                                    item.details.map((item1, index1) => {
                                        return <div key={index1}>
                                            <div className="label-title" dangerouslySetInnerHTML={{ __html: item1.name }} />
                                            <div className='content'>
                                                <AebfInput
                                                    infoKey={item1.key}
                                                    type={item1.type}
                                                    disabled={disabled || item1.disabled}
                                                    inputValue={invoiceInfo[item1.key]}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
                    <div className="fourth-list">
                        {
                            fourthList.map(item => {
                                return <div key={item.key}>
                                    <label>{item.name}</label>
                                    <Input value={invoiceInfo[item.key]} disabled={disabled} onChange={this.invoiceInfoChange.bind(this, item.key)}></Input>
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default UsedCarSales;
