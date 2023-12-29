/*
 * @Descripttion:  下拉选择
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-14 12:58:50
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-06 20:21:10
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/widgt/SelectEditCell.jsx
 */
import { Component } from 'react';
const { Select } = TinperNext
const Option = Select.Option;

export default class SelectEditCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editable: false
        };
    }
    componentDidMount () {
    }
    edit = () => {
        this.setState({ editable: true });
    };
    handleSelect = (value, item) => {
        if (this.props.onChange) {
            const { selectList } = this.props
            let selectObj = selectList.find(i => i.code === value)
            let obj = {
                value: value,
                name: selectObj.name,
            }
            this.props.onChange(obj);
        }
    };
    commitChange = () => {
        this.setState({ editable: false });
    };

    render () {
        const { editable } = this.state;
        const { selectList, name, value } = this.props
        return editable ? (<div>
            <Select placeholder="请选择" onSelect={this.handleSelect.bind(this)} value={value} onBlur={this.commitChange.bind(this)}>
                {
                    selectList.map((item => {
                        return <Option index={item.code} value={item.code}>{item.name}</Option>
                    }))
                }
            </Select>
        </div>) : (<div style={{ minWidth: 100, minHeight: 20 }} onClick={this.edit.bind(this)}>
            {name || " "}
        </div>);
    }
}