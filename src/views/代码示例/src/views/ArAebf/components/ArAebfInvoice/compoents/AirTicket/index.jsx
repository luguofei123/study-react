/*
 * @Descripttion: 航空运输电子客票行程单
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-07-24 09:50:23
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/compoents/AirTicket/index.jsx
 */
import { Input, Message, DatePicker, TimePicker } from '@tinper/next-ui'
import React, { Component } from 'react'
import moment from 'moment'
import AebfInput from '../../../AebfInput'
import CheckResult from '../../../CheckResult'
import { transRMBSmallToBig } from '../../../utils/index.js'
import './index.less'
const $message = Message
const leftWidth = 210
const carrierWidth = 90
const flightWidth = 160
const dateWidth = 110
const timeWidth = 100
class AirTicket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: Array.from((new Array(6)).keys()),
            // leftWidth,
            passengerInfo: [
                { name: { cn: '旅客姓名', en: 'NAME OF PASSENGER' }, width: leftWidth, key: 'buyerName' },
                { name: { cn: '有效身份证', en: 'ID.NO.' }, key: 'buyerTaxNo' }
            ],
            detailTableHead: [
                { name: { cn: '承运人', en: 'CARRIER' }, width: carrierWidth, key: 'carrier' },
                { name: { cn: '航班号', en: 'FLIGHT' }, width: flightWidth, key: 'flight' },
                { name: { cn: '座位等级', en: 'CLASS' }, key: 'seatClass' },
                { name: { cn: '日期', en: 'DATE' }, width: dateWidth, key: 'rideDate' },
                { name: { cn: '时间', en: 'TIME' }, width: timeWidth, key: 'rideTime' }
            ],
            flyMaiInfo: [
                { name: { cn: '自', en: 'FROM' }, key: 'startStation' },
                { name: { cn: '至', en: 'TO' }, key: 'endStation' },
                { name: { cn: '至', en: 'TO' }, key: 'endStation' }
            ],
            priceTitle: [
                { name: { cn: '票价', en: 'FARE' }, left: '-1%', width: carrierWidth, key: 'fare' },
                { name: { cn: '民航发展基金', en: 'CIVIL AVIATION DEVELOPMENT FUND' }, left: '-11%', width: flightWidth, key: 'devFund' },
                { name: { cn: '燃油附加费', en: 'FUEL SURCHARGE' }, left: '-6%', key: 'fuelSurcharge' },
                { name: { cn: '其他税费', en: 'OTHER TAXES' }, left: '-5%', width: dateWidth, key: 'otherTaxes' },
                { name: { cn: '合计', en: 'TOTAL' }, width: timeWidth, left: '-3%', key: 'amountTaxTotal', disabled: true }
            ],
            etNumberRow: [
                { name: { cn: '电子客票号码', en: 'E-TICKET NO.' }, width: leftWidth + carrierWidth, titleWidth: 100, key: 'invoiceNo' },
                { name: { cn: '验证码', en: 'CK' }, width: flightWidth + 109, titleWidth: 80, key: 'checkCode' },
                { name: { cn: '保险费', en: 'INSUREANCE' }, titleWidth: 90, key: 'insurance' }
            ],
            acNumberRow: [
                { name: { cn: '销售单位代号', en: 'AGENT CODE' }, width: leftWidth, titleWidth: 100, key: 'saleAgencyCode' },
                { name: { cn: '填开单位', en: 'ISSUDE BY' }, width: carrierWidth + flightWidth + 109, titleWidth: 80, key: 'salerName' },
                { name: { cn: '填开日期', en: 'DATE OF ISSUE' }, titleWidth: 90, key: 'issueDate' }
            ]
        }
    }

    invoiceInfoChange (code, value) {
        const { invoiceInfo } = this.props

        if (code === 'fare' || code === 'devFund' || code === 'fuelSurcharge' || code === 'otherTaxes') {
            let params = {}
            params.fare = Number(invoiceInfo.fare) ? invoiceInfo.fare : 0
            params.devFund = Number(invoiceInfo.devFund) ? invoiceInfo.devFund : 0
            params.fuelSurcharge = Number(invoiceInfo.fuelSurcharge) ? invoiceInfo.fuelSurcharge : 0
            params.otherTaxes = Number(invoiceInfo.otherTaxes) ? invoiceInfo.otherTaxes : 0
            params[code] = value
            params.amountTaxTotal = Number(params.fare) + Number(params.devFund) + Number(params.fuelSurcharge) + Number(params.otherTaxes)
            Object.keys(params).forEach(key => {
                this.props.invoiceInfoChange(key, params[key])
            })
        } else {

            this.props.invoiceInfoChange(code, value)
        }
    }
    invoiceInfoTimeChange (code, moment, value) {
        this.props.invoiceInfoChange(code, value)
    }
    invoicelistDetailsInfoChange (code, index, type, value1, value2) {
        let value = ''
        if (type === 'T') {
            value = value2
        } else if (type === 'P') {
            value = value1
        } else {
            console.log(type)
        }
        const { invoiceInfo } = this.props
        let planeDetails = JSON.parse(JSON.stringify(invoiceInfo.planeDetails))
        if (!planeDetails[index]) {
            planeDetails[index] = {}
        }
        if (code !== 'endStation') {
            planeDetails[index][code] = value
        }
        if (code === 'endStation' && index === 1) {
            planeDetails[0][code] = value
        }
        if (code === 'endStation' && index === 2) {
            if (!planeDetails[1]) {
                planeDetails[1] = {}
            }
            planeDetails[1][code] = value

        }
        if (type === 'T') {
            if (!planeDetails[index]) {
                planeDetails[index] = {}
            }
            planeDetails[index][code] = value
        }


        if (!planeDetails[index]) {

            let obj = {}
            if (type !== 'P') {
                obj[code] = value
                planeDetails.push(obj)
            }

        }

        if (code === 'rideDate' && index === 0) {
            let invoiceDate = value2
            this.props.invoiceInfoChange('invoiceDate', invoiceDate)

        }

        this.props.invoiceInfoChange('planeDetails', planeDetails)
    }
    render () {
        const { invoiceInfo, disabled } = this.props
        const { passengerInfo, detailTableHead, flyMaiInfo, arr, priceTitle, etNumberRow, acNumberRow } = this.state
        let planeDetails = JSON.parse(JSON.stringify(invoiceInfo.planeDetails))
        const getDetailDetail = (key, index, type) => {
            let value = null
            if (planeDetails[index]) {
                value = planeDetails[index][key]
            }


            if (index === 1) {
                if (type === 'PLACE' && planeDetails[0] && planeDetails[0].endStation) {
                    // 最后一行处理
                    value = planeDetails[0].endStation
                }
            }
            if (index === 2) {
                if (type === 'PLACE' && planeDetails[1] && planeDetails[1].endStation) {
                    // 最后一行处理
                    value = planeDetails[1].endStation
                }
            }
            // if (value) {
            //     if (key === 'rideDate') {
            //         // value = moment(value, 'YYYY-MM-DD')
            //     }
            //     if (key === 'rideTime') {
            //         // value = moment(value, 'HH-mm')
            //     }
            // }
            return value


        }
        // 数据处理
        if (!invoiceInfo.invoiceTypeName) {
            invoiceInfo.invoiceTypeName = '航空运输电子客票行程单'
        }
        if (!invoiceInfo.otherTaxes) {
            invoiceInfo.otherTaxes = 0
        }
        if (!invoiceInfo.insurance) {
            invoiceInfo.insurance = 0
        } else {
            let a = parseFloat(invoiceInfo.insurance)
            if (isNaN(a)) {
                invoiceInfo.insurance = 0
            }
        }
        return (<div className="air-ticket">
            <div className="bg">
                <CheckResult invoiceInfo={invoiceInfo} background={'#f5fcff'} />
                <div className='left'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
                <div className="center">
                    <div className="title">
                        {invoiceInfo.invoiceTypeName}
                    </div>
                    <table className="name-table">
                        <tbody>
                            <tr>
                                {
                                    passengerInfo.map(item => {
                                        return <td key={item.key} width={item.width}>
                                            <span>{item.name.cn} </span>
                                            <span className="font-name-en">{item.name.en}</span>
                                        </td>
                                    })
                                }
                            </tr>
                            <tr>
                                {
                                    passengerInfo.map(item => {
                                        return <td key={item.key} width={item.width}>
                                            <Input className="passenger-Info-input"
                                                value={invoiceInfo[item.key]}
                                                disabled={disabled}
                                                onChange={this.invoiceInfoChange.bind(this, item.key)}
                                            />
                                        </td>
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                    <table border="1">
                        <thead>
                            <tr>
                                <th width={leftWidth}></th>
                                {detailTableHead.map(item => {
                                    return <th className='font-size-small detail-table-head' key={item.name.en} width={item.width}>
                                        <div>{item.name.cn}</div>
                                        <div className="font-name-en">{item.name.en}</div>
                                    </th>
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {flyMaiInfo.map((item, index) => {
                                return <tr key={item.key}>
                                    <td className="nvzhips-td">
                                        <label>
                                            <span>
                                                {item.name.cn}
                                            </span>
                                            <span className="font-name-en">
                                                {item.name.en}
                                            </span>
                                        </label>
                                        <Input
                                            value={getDetailDetail(item.key, index, 'PLACE')}
                                            disabled={disabled}
                                            onChange={this.invoicelistDetailsInfoChange.bind(this, item.key, index, 'P')}
                                        />
                                    </td>
                                    {
                                        detailTableHead.map((item1, index1) => {
                                            return <td className='detail-input' key={item1.name.en}>
                                                {item1.key === 'rideDate'
                                                    ? <DatePicker disabled={disabled} placeholder='请选择日期' format={"YYYY-MM-DD"} value={getDetailDetail(item1.key, index)} onChange={this.invoicelistDetailsInfoChange.bind(this, item1.key, index, 'T')} />
                                                    : item1.key === 'rideTime'
                                                        ? <TimePicker disabled={disabled} placeholder='请选择时间' showClear={false} format={"HH:mm"} value={getDetailDetail(item1.key, index)} onChange={this.invoicelistDetailsInfoChange.bind(this, item1.key, index, 'T')} />
                                                        : <Input
                                                            value={getDetailDetail(item1.key, index)}
                                                            disabled={disabled}
                                                            onChange={this.invoicelistDetailsInfoChange.bind(this, item1.key, index, 'P')}
                                                        />}
                                            </td>
                                        })
                                    }
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <table border="1">
                        <tbody>
                            <tr>
                                <td width={leftWidth}>
                                    <span>至 </span>
                                    <span className="font-name-en">TO</span>
                                </td>
                                {
                                    priceTitle.map((item, index) => {
                                        return <td className='yellow-bg font-size-small' width={item.width} key={item.name.en}>
                                            <div>{item.name.cn}</div>
                                            <div className="font-name-en font-name-en-price">
                                                <div className="position-content">
                                                    <span style={{ left: item.left }}>{item.name.en}</span>
                                                </div>
                                            </div>
                                        </td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td width={leftWidth}>
                                    <span>至 </span>
                                    <span className="font-name-en">TO</span>
                                </td>
                                {
                                    priceTitle.map((item, index) => {
                                        return <td className='yellow-bg' width={item.width} key={item.name.en}>
                                            <AebfInput
                                                clasStyle={'money-input'}
                                                type="02"
                                                hideRMB={true}
                                                infoKey={item.key}
                                                inputValue={invoiceInfo[item.key]}
                                                disabled={item.key === 'amountTaxTotal' ? item.disabled : disabled}
                                                invoiceInfoChange={this.invoiceInfoChange.bind(this)} />
                                        </td>
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                    <table border="1">
                        <tbody>
                            <tr>
                                {etNumberRow.map(item => {
                                    return <td key={item.name.en} width={item.width} className='number-td'>
                                        <div className='number-name' style={{ width: `${item.titleWidth}px` }}>
                                            <div>
                                                {item.name.cn}
                                            </div>
                                            <div className="font-name-en">
                                                {item.name.en}
                                            </div>
                                        </div>
                                        {
                                            item.key === 'insurance'
                                                ? <AebfInput
                                                    clasStyle='money-input margin-input'
                                                    stylePSelf={{ width: `calc(100% - ${item.titleWidth + 5}px)`, float: 'right' }}
                                                    infoKey={item.key}
                                                    hideRMB={true}
                                                    type="02"
                                                    disabled={disabled}
                                                    inputValue={invoiceInfo[item.key]}
                                                    invoiceInfoChange={this.invoiceInfoChange.bind(this)}
                                                />
                                                : <Input
                                                    className='margin-input'
                                                    value={invoiceInfo[item.key]}
                                                    disabled={disabled}
                                                    onChange={this.invoiceInfoChange.bind(this, item.key)}
                                                    style={{ width: `calc(100% - ${item.titleWidth + 5}px)` }} />
                                        }
                                    </td>
                                })}
                            </tr>
                        </tbody>
                    </table>
                    <table border="1">
                        <tbody>
                            <tr>
                                {acNumberRow.map(item => {
                                    return <td className='number-td' key={item.name.en} width={item.width}>
                                        <div className="number-name" style={{ width: `${item.titleWidth}px` }}>
                                            <div>
                                                {item.name.cn}
                                            </div>
                                            <div className="font-name-en">
                                                {item.name.en}
                                            </div>
                                        </div>
                                        {
                                            item.key === 'issueDate'
                                                ? <DatePicker
                                                    className='margin-input'
                                                    value={invoiceInfo.issueDate ? moment(invoiceInfo.issueDate) : null}
                                                    style={{ width: `calc(100% - ${item.titleWidth + 5}px)` }}
                                                    format="YYYY-MM-DD"
                                                    disabled={disabled}
                                                    onChange={this.invoiceInfoTimeChange.bind(this, item.key)}
                                                />
                                                : <Input
                                                    className='margin-input'
                                                    value={invoiceInfo[item.key]}
                                                    disabled={disabled}
                                                    onChange={this.invoiceInfoChange.bind(this, item.key)}
                                                    style={{ width: `calc(100% - ${item.titleWidth + 5}px)` }} />
                                        }
                                    </td>
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='right'>
                    {arr.map((i, index) => <span className="circle" key={i}></span>)}
                </div>
            </div>
        </div>);
    }
}
export default AirTicket;
