import React from 'react'
import UIParser from '@/views/BillUIDesigner/UIParser'
import { getDisplayValue } from '../PropReferConfig/util'
export default class PropDefaultValue extends React.Component {
    constructor(props) {
        super(props)
    }
    onValuesChange(changedValues, allValues) {
        // console.log(changedValues, allValues, '修改默认值变化')
    }
    onChange = (data, domnode) => {

        let defaultValues
        const enty = domnode?domnode.enty:"";
        if (enty) {
            if (typeof (data) === 'object') {
                const { fieldNames = {}, replaceItems = [] } = enty
                const { label } = fieldNames
                defaultValues = { id: data.id || '' }
                const displayValue = getDisplayValue(domnode, data)
                if (displayValue !== null) {
                  defaultValues[label] = displayValue
                  defaultValues.displayValue = displayValue
                }
    
                replaceItems.forEach(item => {
                    const { from = {} } = item
                    const { fieldname } = from
                    if (fieldname) {
                        defaultValues[fieldname] = data[fieldname]
                    }
                })
            }else{
                defaultValues = data
            }
        } else {
            // 没有参照的情况，开关
            if (typeof (data) === 'object') {
                defaultValues = data.defaultValue
            } else {
                defaultValues = data
            }

        }
        // console.log(defaultValues, '要存的默认值')
        // 向表单抛出变动结果
        if (this.props.onChange) {
            this.props.onChange(defaultValues)
        }

    }

    render() {
        let widget = JSON.parse(JSON.stringify(this.props.widget))
        delete widget.hide
        if (widget.props) {
            delete widget.props.readOnly
            delete widget.props.disabled
            widget.props.value = widget.value
        }
        widget.dataField = 'defaultValue'
        // widget.initialValue = widget.defaultValue
        widget.props ? widget.props.show_label = 0 : widget.props = { show_label: 0 }
        widget.extraStyle = { width: '215px' }
        widget.fn = { 'onChange': 'onChange' }
        widget.locked = 1
        // console.log(widget, '初始化默认值')
        if (widget.name === 'YDFStepNext') {
            widget.name = 'YDFInput'
        }
        // 加一下标记用于判断是否是属性面板里的组件
        widget.isInPropForm = true;
        return (
            <>
                <UIParser
                    key={widget.key}
                    draggabled={false}
                    uidata={widget}

                    onChange={this.onChange}
                />
            </>
        )
    }
}