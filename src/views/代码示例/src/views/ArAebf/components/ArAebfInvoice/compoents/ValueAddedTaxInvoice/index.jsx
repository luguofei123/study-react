/*
 * @Descripttion: 增值税普通发票(卷票)
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-01 16:01:25
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/ValueAddedTaxInvoice/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import vatiBgTop from '../../../img/vatiBg_top.png'
import vatiBgMiddle from '../../../img/vatiBg_middle.png'
import vatiBgBottom from '../../../img/vatiBg_bottom.png'
import './index.less'
const $message = Message
class ValueAddedTaxInvoice extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                { name: '发票代码', key: 'invoiceCode' },
                { name: '发票号码', key: 'invoiceNo' },
                { name: '校验码(后6位)', key: 'checkCode' },
                { name: '销售方名称', key: 'salerName' },
                { name: '纳税人识别号', key: 'salerTaxNo' },
                { name: '开票日期', key: 'invoiceDate', inputType: '04' },
                { name: '购买方名称', key: 'buyerName' },
                { name: '纳税人识别号', key: 'buyerTaxNo' }
            ],
            middleList: [
                { name: '项目', key: 'item', width: 150 },
                { name: '单价', key: 'price', inputType: '03' },
                { name: '数量', key: 'num', inputType: '03' },
                { name: '金额', key: 'amount', inputType: '03' }
            ],
            bottomList: [
                { name: '合计金额(小写)', key: 'amountTaxTotal', inputType: '02' },
                { name: '合计金额(大写)', key: 'captitalTotal' }
            ]
        }
    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    saveBeforeCheck () {

        return true
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { list, middleList, bottomList } = this.state
        return (<div className='value-added-tax-invoice' >
            <div className="bg_top" style={{ backgroundImage: `url(${vatiBgTop})` }}></div>
            <div className="bg_content" style={{ backgroundImage: `url(${vatiBgMiddle})` }}>
                <CheckResult invoiceInfo={invoiceInfo} background="#FFFDFA" />
                <h1>{invoiceInfo.invoiceTypeName}</h1>
                <div className="head-line"></div>
                {
                    list.map(item => {
                        return <div className='top-list-div' key={item.key}>
                            <label>{item.name}</label>
                            <div>
                                <AebfInput
                                    type={item.inputType}
                                    disabled={disabled}
                                    infoKey={item.key}
                                    inputValue={invoiceInfo[item.key]}
                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                            </div>
                        </div>
                    })
                }
                <table>
                    <thead>
                        <tr class="middleList">
                            {
                                middleList.map(item => {
                                    return <th key={item.key} width={item.width}>
                                        {item.name}
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoiceInfo.ordinaryDetails?.map((item, index) => {
                                return <tr className="middleList" key={index}>
                                    {
                                        middleList.map((item1, index1) => {
                                            return <td key={item1.key}>
                                                <AebfInput
                                                    type={item.inputType}
                                                    disabled={disabled}
                                                    infoKey={item.key}
                                                    inputValue={invoiceInfo[item.key]}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this, index)} />
                                            </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>
                {
                    bottomList.map(item => {
                        return <div className="content_bottom" key={item.infoKey}>
                            <label>{item.name}</label>
                            <AebfInput
                                type={item.inputType}
                                disabled={disabled}
                                infoKey={item.key}
                                inputValue={invoiceInfo[item.key]}
                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                        </div>
                    })
                }
            </div>
            <div className="bg_bottom" style={{ backgroundImage: `url(${vatiBgBottom})` }}></div>
        </div>);
    }
}
export default ValueAddedTaxInvoice;
