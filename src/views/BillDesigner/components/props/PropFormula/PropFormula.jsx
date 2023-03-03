import React from 'react'
import { Input } from 'antd'
import { ScheduleOutlined } from '@ant-design/icons'
import ht from '../../../utils/HelperTools'
import YDFFormula from '_c/YDFFormula'
import { modal } from '_c/YDFModal'
import './style.less'
const prefixCls = 'lcd-formula'
export default class PropFormula extends React.Component {
    constructor(props) {
        super(props)
    }
    refFormula = new React.createRef()
    state = { fText: '', fValue: '' }
    async handleSelectFormula() {
        const { env } = ht.getGlobalProps()
        const fieldsTree = await ht.getEntyInfoOfKey()
        modal.open(
            {
                title: '编辑公式',
                height: 550,
                width: 900,
                visible: true,
                sysbar: [],
                resizing: ({ height, width, top, left, $custom }) => {
                    if ($custom && $custom.update) {
                        $custom.update({ height: height, width, top, left })
                    }
                },
                // onClose() {
                //     return true
                // },
                onOk: this.handleFormulaOk.bind(this),
                children: <YDFFormula paramsSys={env} fieldsTree={fieldsTree} ref={this.refFormula} />
            }
        )
    }
    handleFormulaOk() {
        const formula = this.refFormula.current.getFormula()
        if (this.props.onChange) {
            this.props.onChange(formula)
        }
        modal.close()
    }
    render() {
        const { value = { formula: '' } } = this.props
        return (
            <div className={`${prefixCls}`}>
                {value.formulaText || value.formula}
                <ScheduleOutlined className="btn" onClick={this.handleSelectFormula.bind(this)} />
            </div>

        )
    }
}