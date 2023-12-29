/*
 * @Descripttion: 调整行程弹框
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-24 11:08:21
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/adjustSch/index.jsx
 */
import { Component } from 'react';
const { Button, Modal, Radio, Icon } = TinperNext
import './index.less'
export default class AdjustSch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '选择行程',
            showModal: true,
            schData: [], // 行程数据
            selectedValue: ''
        }
    }
    componentDidMount () {
        const { schTableData, index } = this.props.schData
        let schData = []
        schTableData.forEach((v, vIndex) => {
            if (index !== vIndex) {
                v.itemIndex = vIndex
                schData.push(v)
            }
        })
        this.setState({
            schData: schData
        })
    }
    // 关闭弹框
    closeModal () {
        this.setState({
            showModal: false
        })
    }
    // 选择行程事件
    handleChange (val) {
        this.setState({
            selectedValue: val
        })
    }
    // 选择行程确认事件
    confirmModal () {
        const obj = {
            selectIndex: this.state.selectedValue,
            ...this.props.schData
        }
        this.props.adjustSchCallBack(obj)
        this.closeModal()
    }
    render () {
        const { title, showModal, schData, selectedValue } = this.state
        return <div>
            <Modal className="adjustSchWrap" title={title} visible={showModal} showPosition={{ y: 50 }} width={'60%'} height={'80%'} onCancel={this.closeModal.bind(this)}>
                <Modal.Body>
                    <div className='adjustSchContent'>
                        {schData.length ?
                            <Radio.Group selectedValue={selectedValue} onChange={this.handleChange.bind(this)}>
                                {schData.map((t, tIndex) => (
                                    <Radio value={t.itemIndex} className="radio-item">
                                        {t.noMatchFlag ?
                                            <div className="schBox">
                                                <div className="addSch">待新增行程</div>
                                            </div> :
                                            <div className="schBox">
                                                <div className="sch-index">{tIndex + 1}</div>
                                                <div className="sch-start">
                                                    {t.deptPlaceName ? <div>{t.deptPlaceName}</div> : <div>-</div>}
                                                    {t.startDate ? <div>{t.startDate}</div> : <div>-</div>}
                                                </div>
                                                {/* <Icon className="icon-item" type="uf-truck"></Icon> */}
                                                <span style={{ fontSize: 24, margin: '0 20px' }} className="iconfont icon-banjiantou"></span>
                                                <div className="sch-end">
                                                    {t.arriPlaceName ? <div>{t.arriPlaceName}</div> : <div>-</div>}
                                                    {t.endDate ? <div>{t.endDate}</div> : <div>-</div>}
                                                </div>
                                                {t.travelerName ? <div>{t.travelerName}</div> : <div>-</div>}
                                            </div>}
                                    </Radio>
                                ))}
                            </Radio.Group> : null}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.closeModal.bind(this)}>取消</Button>
                    <Button colors='primary' onClick={this.confirmModal.bind(this)}>确定</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}
