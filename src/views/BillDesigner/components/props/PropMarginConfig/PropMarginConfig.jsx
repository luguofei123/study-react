import React from "react";
import { InputNumber, Popover, Tooltip } from 'antd'
import './style.less'
const prefixCls = 'lcd-margin-config'
export default class PropMarginConfig extends React.Component {
    constructor(props){
        super(props)
    }
    handleOpenChange = (visible)=> {
        if(visible == false) {
            const { margintop, marginbottom, marginleft, marginright, paddingtop, paddingbottom, paddingleft, paddingright } = this.state
            let marginFull = { margintop, marginbottom, marginleft, marginright },
                paddingFull = { paddingtop, paddingbottom, paddingleft, paddingright }
            this.props.onChange({ marginFull, paddingFull })
        }
    }
    state = { 
        margintop: null,
        marginbottom: null,
        marginleft: null,
        marginright: null, 
        paddingtop: null,
        paddingbottom: null,
        paddingleft: null,
        paddingright: null,
    }
   componentDidMount(){
    const { value = {} } = this.props;
    let { marginFull, paddingFull } = value
    this.setState({...marginFull, ...paddingFull})
    
   }
    render() { 
        let { margintop, marginleft, marginright, marginbottom, paddingtop, paddingleft, paddingright, paddingbottom } = this.state
        return (<>
        <div className = {prefixCls}>
            <div className='top'>
                <span className="top-span">margin</span>
                <Popover
                    overlayClassName="overlaypopover"
                    content={<InputNumber min={0} max={1000} value={margintop} onChange={value=>{this.setState({margintop:value})}} />}
                    title="设置margintop"
                    trigger="click"
                    open={open}
                    onVisibleChange={this.handleOpenChange}
                >
                    <Tooltip placement="bottom" title="点击设置">{ margintop != null ? margintop : '--' }</Tooltip>
                </Popover>
            </div>
            <div className='content'>
            <div className='content-left'>
                <Popover
                    overlayClassName="overlaypopover"
                    content={<InputNumber min={0} max={1000} value={marginleft} onChange={value=>{this.setState({marginleft:value})}} />}
                    title="设置"
                    trigger="click"
                    open={open}
                    onVisibleChange={this.handleOpenChange}
                >
                    <Tooltip placement="bottom" title="点击设置">{ marginleft != null ? marginleft : '--' }</Tooltip>
                </Popover>
            </div>
            <div className='content-center'>
                <div className='content-center-top' style={{'position':'relative'}}>
                    <span className="content-center-top-span" style={{ 'position': 'absolute', 'left': '2px' }}>padding</span>
                    <Popover
                        overlayClassName="overlaypopover"
                        content={<InputNumber min={0} max={1000} value={paddingtop} onChange={value=>{this.setState({paddingtop:value})}} />}
                        title="设置"
                        trigger="click"
                        open={open}
                        onVisibleChange={this.handleOpenChange}
                    >
                        <Tooltip placement="bottom" title="点击设置">{ paddingtop != null ? paddingtop : '--' }</Tooltip>
                    </Popover>
                </div>
                <div className='content-center-content'>
                    <div className='content-center-content-left'>
                        <Popover
                            overlayClassName="overlaypopover"
                            content={<InputNumber min={0} max={1000} value={paddingleft} onChange={value=>{this.setState({paddingleft:value})}} />}
                            title="设置"
                            trigger="click"
                            open={open}
                            onVisibleChange={this.handleOpenChange}
                        >
                            <Tooltip placement="bottom" title="点击设置">{ paddingleft != null ? paddingleft : '--' }</Tooltip>
                        </Popover>
                    </div>
                    <div className='content-center-content-center'></div>
                    <div className='content-center-content-right'>
                        <Popover
                            overlayClassName="overlaypopover"
                            content={<InputNumber min={0} max={1000} value={paddingright} onChange={value=>{this.setState({paddingright:value})}} />}
                            title="设置"
                            trigger="click"
                            open={open}
                            placement="left"
                            onVisibleChange={this.handleOpenChange}
                        >
                            <Tooltip placement="bottom" title="点击设置">{ paddingright != null ? paddingright : '--' }</Tooltip>
                        </Popover>
                    </div>
                </div>
                <div className='content-center-bottom'>
                    <Popover
                        overlayClassName="overlaypopover"
                        content={<InputNumber min={0} max={1000} value={paddingbottom} onChange={value=>{this.setState({paddingbottom:value})}} />}
                        title="设置"
                        trigger="click"
                        open={open}
                        onVisibleChange={this.handleOpenChange}
                    >
                        <Tooltip placement="bottom" title="点击设置">{ paddingbottom != null ? paddingbottom : '--' }</Tooltip>
                    </Popover>
                </div>
            </div>
            <div className='content-right'>
                <Popover
                    overlayClassName="overlaypopover"
                    content={<InputNumber min={0} max={1000} value={marginright} onChange={value=>{this.setState({marginright:value})}} />}
                    title="设置"
                    trigger="click"
                    open={open}
                    placement="left"
                    onVisibleChange={this.handleOpenChange}
                >
                    <Tooltip placement="bottom" title="点击设置">{ marginright != null ? marginright : '--' }</Tooltip>
                </Popover>
            </div>
            </div>
            <div className='bottom'>
                <Popover
                    overlayClassName="overlaypopover"
                    content={<InputNumber min={0} max={1000} value={marginbottom} onChange={value=>{this.setState({marginbottom:value})}} />}
                    title="设置"
                    trigger="click"
                    open={open}
                    onVisibleChange={this.handleOpenChange}
                >
                    <Tooltip placement="bottom" title="点击设置">{ marginbottom != null ? marginbottom : '--' }</Tooltip>
                </Popover>
            </div>
        </div>
        </>);
    }
}