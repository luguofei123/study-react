import React from 'react'
import { Input } from 'antd'
export default class PropDivCode extends React.Component {
    constructor(props) {
        super(props)
    }
    state = { value: this.props.value, status: '' }
    onChange = (e) => {
        const value = e.target.value
        this.setState({ value })
        const { utools } = this.props
        const divCodeToKey = utools.getItem('divCodeToKey')
        
        if (value && divCodeToKey[value]) {

            this.setState({ status: 'error' })
            return false
        }
        this.setState({ status: '' })

    }
    onBlur = () => {
        const { domnode,utools } = this.props
        const { status, value } = this.state
        if (status) {
            this.setState({ value: domnode.divCode || domnode.key, status: '' })
            return false
        }
        let divCodeToKey = utools.getItem('divCodeToKey')
        divCodeToKey[value]=domnode.key
        utools.setItem('divCodeToKey',divCodeToKey)
        if (this.props.onChange) {
            this.props.onChange(value)
        }
    }

    render() {
        const { value, status } = this.state
        const helpStyle = { position: 'absolute', right: '16px', color: '#EE2223', zIndex: 999, top: '-24px' }
        return (
            <>
                {status ? <span style={helpStyle}>编码已存在，请重新输入</span> : ''}
                <Input value={value} status={status} onBlur={this.onBlur} onChange={this.onChange} />
            </>
        )
    }
}