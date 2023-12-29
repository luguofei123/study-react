/*
 * @Descripttion: 机动车销售统一票据
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-24 09:48:16
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/MotorsVehicleSales/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
class MotorsVehicleSales extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(7)).keys()),
            arr3: Array.from((new Array(3)).keys()),
            firstList: [
                { name: '发票号码', key: 'invoiceNo' },
                { name: '发票代码', key: 'invoiceCode' },
                { name: '开票日期', key: 'invoiceDate', type: '04' }
            ],
            secondList: [
                {
                    name: '购买方名称',
                    key: 'buyerName'
                },
                {
                    name: '纳税人识别号/<br/> 统一社会信用代码/ <br/>身份证号码',
                    key: 'buyerTaxNo'
                }
            ],
            thirdList: [
                {
                    details: [
                        {
                            name: '车辆类型',
                            key: 'vehicleType'
                        },
                        {
                            name: '厂牌型号',
                            key: 'model'
                        },
                        {
                            name: '产地',
                            key: 'factory'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '合格证书',
                            key: 'qualifiedNo'
                        },
                        {
                            name: '进口证明书号',
                            key: 'importNo'
                        },
                        {
                            name: '商检单号',
                            key: 'checkNo'
                        }
                    ],
                    className: 'third-list'
                },
                {
                    details: [
                        {
                            name: '销售单位名称',
                            key: 'salerName'
                        },
                        {
                            name: '电话',
                            key: 'salerTel'
                        }
                    ],
                    className: 'fourth-list'
                },
                {
                    details: [
                        {
                            name: '纳税人识别号',
                            key: 'salerTaxNo'
                        },
                        {
                            name: '账号',
                            key: 'salerAccount'
                        }
                    ],
                    className: 'fourth-list'
                },
                {
                    details: [
                        {
                            name: '地址',
                            key: 'salerAddress'
                        },
                        {
                            name: '开户银行',
                            key: 'salerBank'
                        }
                    ],
                    className: 'fifth-list'
                },
                {
                    details: [
                        {
                            name: '价税合计',
                            key: 'captitalTotal',
                            disabled: true
                        },
                        {
                            name: '小写',
                            key: 'amountTaxTotal',
                            type: '02'
                        }
                    ],
                    className: 'fifth-list'
                },
                {
                    details: [
                        {
                            name: '增值税税率或征收率',
                            key: 'taxRate',
                            type: '10',
                            inputConfig: { precision: 0 }
                        },
                        {
                            name: '增值税税额',
                            key: 'taxTotal',
                            type: '02'
                        }
                    ],
                    className: 'fifth-list'
                },
                {
                    details: [
                        {
                            name: '不含税价(小写)',
                            key: 'amountTotal',
                            type: '02'
                        },
                        {
                            name: '完税凭证号码',
                            key: 'taxNum'
                        }
                    ],
                    className: 'fifth-list borderB'
                }
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
        const { arr, arr3, firstList, secondList, thirdList } = this.state
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
        if (invoiceInfo.invoiceType === '21') {
            invoiceInfo.invoiceTypeName = '机动车销售统一（发票）'
        }
        return (<div className="motors-ticket">
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
                    <div className="second-list">
                        {
                            secondList.map(item => {
                                return <div key={item.key}>
                                    <div className="label-title" dangerouslySetInnerHTML={{ __html: item.name }} />
                                    <div className='content'>
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
                        thirdList.map((item, index) => {
                            return <div key={index} className={item.className}>
                                {
                                    item.details.map((item1, index1) => {
                                        return <div key={index1}>
                                            <div className="label-title" dangerouslySetInnerHTML={{ __html: item1.name }} />
                                            <div>
                                                <AebfInput
                                                    infoKey={item1.key}
                                                    type={item1.type}
                                                    disabled={disabled}
                                                    inputConfig={item1.inputConfig}
                                                    inputValue={invoiceInfo[item.key]}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default MotorsVehicleSales;
