/*
 * @Descripttion: 发票仿真组件
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-06-20 15:10:23
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/ArAebfInvoice/index.jsx
 */
import './index.less'
import React, { Component } from 'react';
import { Icon } from '@tinper/next-ui';
import AirTicket from './compoents/AirTicket'
import TrainTicket from './compoents/TrainTicket'
import VatSpecial from './compoents/VatSpecial'
import QuotaInvoice from './compoents/QuotaInvoice'
import CarPassengerTicket from './compoents/CarPassengerTicket'
import TollTicket from './compoents/TollTicket'
import TaxiTicket from './compoents/TaxiTicket'
import GeneralPurposeTicket from './compoents/GeneralPurposeTicket'
import ValueAddedTaxInvoice from './compoents/ValueAddedTaxInvoice'
import TollValueAddedTax from './compoents/TollValueAddedTax'
import WaterTicket from './compoents/WaterTicket'
import ElectronicInvoiceBill from './compoents/ElectronicInvoiceBill'
import MedicalTicket from './compoents/MedicalTicket'
import NtCommonTicket from './compoents/NtCommonTicket'
import NonTaxIncomeBill from './compoents/NonTaxIncomeBill'
import CapTransSettleBill from './compoents/CapTransSettleBill'
import TradeFundIncomeBill from './compoents/TradeFundIncomeBill'
import AdminCareerChargeBill from './compoents/AdminCareerChargeBill'
import MotorsVehicleSales from './compoents/MotorsVehicleSales'
import UsedCarSales from './compoents/UsedCarSales'
import NonTaxIncome from './compoents/NonTaxIncome'
import emptyImg from '../img/quexingye.png'
class ArAebfInvoice extends Component {
    constructor(props) {
        super(props)
        this.invoiceRef = React.createRef()
        this.state = {
            C: '',
            CompName: ''
        }
    }
    INVOICETYPELIST = [
        { invoiceType: '01', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '02', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '03', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '04', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '10', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '11', name: 'valueAddedTaxInvoice', comp: ValueAddedTaxInvoice }, // 增值税普通发票(卷票)
        { invoiceType: '12', name: 'tollValueAddedTax', comp: TollValueAddedTax },    // 通行费增值税电子普通发票
        { invoiceType: '13', name: 'vatSpecial', comp: VatSpecial },  // 增值税专用发票
        { invoiceType: '14', name: 'electronicInvoiceBill', comp: ElectronicInvoiceBill },  // 电子发票(普通发票)
        { invoiceType: '15', name: 'electronicInvoiceBill', comp: ElectronicInvoiceBill },  // 电子发票(增值税专用发票)
        { invoiceType: '21', name: 'motorsVehicleSales', comp: MotorsVehicleSales }, // 机动车销售统一票据
        { invoiceType: '22', name: 'usedCarSales', comp: UsedCarSales }, // 二手车销售统一票据
        { invoiceType: '23', name: 'generalPurposeTicket', comp: GeneralPurposeTicket }, // 通用机打发票
        { invoiceType: '24', name: 'quotaInvoice', comp: QuotaInvoice },   // 通用定额发票
        { invoiceType: '25', name: 'vatSpecial', comp: VatSpecial }, // 增值税专用发票
        { invoiceType: '40', name: 'nonTaxIncome', comp: NonTaxIncome },  // 非税收入一般缴款书
        { invoiceType: '41', name: 'ntCommonTicket', comp: NtCommonTicket },  // 非税发票
        { invoiceType: '50', name: 'medicalTicket', comp: MedicalTicket },  // 医疗发票
        { invoiceType: '91', name: 'taxiTicket', comp: TaxiTicket },  // 出租汽车票
        { invoiceType: '92', name: 'trainTicket', comp: TrainTicket }, // 火车票
        { invoiceType: '93', name: 'airTicket', comp: AirTicket },  // 航空运输电子客票行程单
        { invoiceType: '94', name: 'carPassengerTicket', comp: CarPassengerTicket }, // 汽车客票
        { invoiceType: '96', name: 'waterTicket', comp: WaterTicket },   // 船运客票
        { invoiceType: '97', name: 'quotaInvoice', comp: QuotaInvoice },   // 通用定额发票
        { invoiceType: '98', name: 'tollTicket', comp: TollTicket },  // 过路过桥费票据
        { invoiceType: '99', name: 'quotaInvoice', comp: QuotaInvoice },   // 通用定额发票
        { invoiceType: '100', name: 'nonTaxIncomeBill', comp: NonTaxIncomeBill },  // 非税收入统一票据
        { invoiceType: '101', name: 'capTransSettleBill', comp: CapTransSettleBill },  // 资金往来结算票据
        { invoiceType: '102', name: 'tradeFundIncomeBill', comp: TradeFundIncomeBill },  // 工会经费收入专用票据
        { invoiceType: '103', name: 'adminCareerChargeBill', comp: AdminCareerChargeBill },  // 行政事业性收费统一票据
    ]
    componentDidMount () {
        const invoiceType = this.props.invoiceInfo?.invoiceType
        this.loadCompByInvoice(invoiceType)
    }
    loadCompByInvoice (invoiceType) {
        let Comp = ''
        let CompName = ''
        this.INVOICETYPELIST.forEach(item => {
            if (item.invoiceType === invoiceType) {
                Comp = item.comp
                CompName = item.name
            }
        })
        this.setState({
            C: Comp,
            CompName: CompName
        })

    }
    invoiceInfoChange (code, value) {
        this.props.invoiceInfoChange(code, value)
    }
    handleChange (type, value) {
        const { invoiceInfo } = this.props
        this.props.headerChange(type, value, invoiceInfo)
    }
    saveBeforeCheck () {
        let result = true
        if (this.invoiceRef && this.invoiceRef.current.saveBeforeCheck) {
            result = this.invoiceRef.current.saveBeforeCheck()
        }

        return result
    }
    render () {
        const { C } = this.state
        const pros = this.props
        return (<div className='detail-content'>
            <div className='invoice-box-container'>
                <div className='invoice-box'>
                    {C ? <C {...pros} ref={this.invoiceRef} invoiceInfoChange={this.invoiceInfoChange.bind(this)} /> :
                        <div>
                            <img src={emptyImg} height={'100%'} width={'100%'} alt="" />
                        </div>}
                </div>
            </div>
            {
                C ? <div className='opration-page'>
                    <div className='page-pre'>
                        <div className='page-bg'>
                            <Icon type="uf-arrow-left" onClick={this.handleChange.bind(this, 'prePage', -1)} />
                        </div>
                    </div>
                    <div className='page-next'>
                        <div className='page-bg'>
                            <Icon type="uf-arrow-right" onClick={this.handleChange.bind(this, 'nextPage', 1)} />
                        </div>
                    </div>
                </div> : ''
            }
        </div>);
    }
}
export default ArAebfInvoice;

