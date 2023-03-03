import React from 'react'
import { Table, Icon, Tooltip, Button, Input, InputNumber, Select, Checkbox  } from "@tinper/next-ui";
const prefixCls = 'lcd-tableConfig'

class StringEditCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: true,
            value: props.value || props.record.name,
        }
    }
    timer = null
    cellClick = (e) => {
        this.setState({
            editable: !this.state.editable
        })
    }
    changeValue = (value) => {
        this.setState({
            value
        });
        this.props.onCellChange(value)
    };
    
    commitChange = ()=> {
        this.setState({ editable: false });
    }
    render() {
        const { editable, value } = this.state
        return <div class="editCell" onClick={this.cellClick}>{
            <Input 
             className={ [value ? "u-form-control" : "u-form-control error",  ] } 
             value={value} 
             onChange={this.changeValue}
             onBlur={this.commitChange}/>
        }</div>
    }
}

class NumberEditCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            value: props.value || 200,
        }
    }
    cellClick = () => {
        this.setState({
            editable: !this.state.editable
        })
    }
    changeValue = (value) => {
        this.setState({
            value
        });
        this.props.onCellChange(value)
    };
    
    commitChange = ()=> {

    }
    render() {
        const { editable, value } = this.state
        return <div class="editCell" onClick={this.cellClick}>{
            <InputNumber 
            className={value ? "u-form-control" : "u-form-control error"} 
            value={value} 
            iconStyle='one'
            onChange={this.changeValue}
            onBlur={this.commitChange}/>
        }</div>
    }
}

class SelectEditCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            value: ['left','center','right'].includes(props.value)? props.value : 'left',
        }
        props.type == 'boolean' ? ( this.state.value = [0,1].includes(props.value)? props.value : 0)  : (this.state.value = ['left','center','right'].includes(props.value)? props.value: 'left')
        this.SELECT_SOURCE = props.type == 'boolean' ? this.BOOLEAN_SOURCE : this.ALIGN_SOURCE
    }
    ALIGN_SOURCE = [{title:'左对齐',value: 'left'},{title:'居中',value: 'center'}, {title:'右对齐',value: 'right'}]
    BOOLEAN_SOURCE = [{title: '否', value: 0},{title: '是', value: 1}]
    SELECT_SOURCE = null
    cellClick = () => {
        this.setState({
            editable: !this.state.editable
        })
    }
    
    commitChange = ()=> {
        this.setState({ editable: false });
    }
    handleSelect = (value) => {
        this.setState({ value });
        this.props.onCellChange(value)
    }
    render() {
        const { editable, value } = this.state
        return <div class="editCell" onClick={this.cellClick}>{
                <Select defaultValue={this.props.value} value={value} onSelect={this.handleSelect} onBlur={this.commitChange} autoFocus>
                     {this.SELECT_SOURCE.map((item, index) => (<Option key={item.value} value={item.value}> {item.title} </Option>))}
                 </Select>
        }</div>
    }
}
class CheckboxEditCell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            value: props.value,
        }
    }
    cellClick = () => {
        this.setState({
            editable: !this.state.editable
        })
    }
    
    commitChange = ()=> {
        this.setState({ editable: false });
    }
    onChange = (value) => {
        this.props.onCellChange(value)
    }
    render() {
        const { value, checkedVal } = this.props
        const { editable,  } = this.state
        return <div class="editCell" onClick={this.cellClick}>
                {/*<Radio value={ } checked={!!value} onChange={this.onChange}> </Radio>*/}
                <Checkbox checked={ !!value } onChange={this.onChange}> </Checkbox>
        </div>
    }
} 

export default class extends React.Component  {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(JSON.stringify(props.data) !== JSON.stringify(state.data) ) {
            return {
                data:props.data 
            }
        }
        return null
    }
    columns = [{
        title: (<div>表头字段<Tooltip overlay="“.”分层标识符" placement='top'>
                    <Icon type="uf-qm-c" title=""/>
                </Tooltip></div>), 
        dataIndex: "head", key: "head", width: 400, 
        children: [{
            title: "表格字段", dataIndex: "name", key: "name", width: 150,
        },{
            title: "显示名称", dataIndex: "displayName", key: "displayName", width: 250, render: (text, record, index) => {
                return (<StringEditCell value={text} record={record} onCellChange={this.cellChange(index,record,'displayName')}/>)
            }
        }]  
    },{
        title: "对齐方式", dataIndex: "align", key: "align", width: 80, render: (text, record, index) => {
            return (<SelectEditCell value={text} onCellChange={this.cellChange(index,record,'align')}/>)
        }
    },{
        title: "禁用", dataIndex: "disabled", key: "disabled", width: 80, render: (text, record, index) => {
            return (<SelectEditCell value={text} type="boolean" onCellChange={this.cellChange(index,record,'disabled')}/>)
        }
    },{
        title: "隐藏", dataIndex: "hide", key: "hide", width: 80, render: (text, record, index) => {
            return (<SelectEditCell value={text} type="boolean" onCellChange={this.cellChange(index,record,'hide')}/>)
        }
    },
    {
        title: "必录", dataIndex: "nullable", key: "nullable", width: 80, render: (text, record, index) => {
            return (<SelectEditCell value={text} type="boolean" onCellChange={this.cellChange(index,record,'nullable')}/>)
        }
    },{
        title: "主键", dataIndex: "isKey", key: "isKey", width: 60, render: (text, record, index) => {
            return (<CheckboxEditCell value={text} onCellChange={this.cellChange(index,record,'isKey')}/>)
        }
    },{
        title: "列宽(px)", dataIndex: "width", key: "width", width: 100, render: (text, record, index) => {
            return (<NumberEditCell value={text} onCellChange={this.cellChange(index,record,'width')}/>)
        }
    }]
    cellChange = (index, record, col, ) => {
        // console.log(index, col, record)
        return (value) => {
            // console.log(value)
            const { data } = this.state
            const row = { ...record, [col]: value }

            data[index] = row
            this.setState({data})
        }
    }

    endEdit = (index, col, record) => {
        this.setState({ 

        })
    }
    getData = () => {
        return this.state.data
        
    }
    render() {
        const { data } = this.state
        return (

            <Table
                columns={this.columns}
                data={data}
                className={prefixCls}
                bordered
                rowKey='key'
            />
        )

    }
}