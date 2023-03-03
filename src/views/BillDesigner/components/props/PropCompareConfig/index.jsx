import React from 'react'
import YDFSelect from '_c/YDFSelect'
import {copmareList} from './source'
export default class PropCompareConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  state = { copmareList: [], value: this.props.value }
  selectRef = React.createRef()
  setCopmareList(widget, needReset) {
    let data = [];
    let value = '';
    let isMulti = false
    if(widget.props.checkable) { // 如果是查询区多选，比较符需为in,nin,like
      const multiList = copmareList.find(item=>item.name === 'multiRefer')
      if(multiList && multiList.parentNodeType.indexOf(widget.name) !== -1){
        data =  [...multiList.dataList]
        isMulti = true
      }
    }
    if(!isMulti) {
      if(widget.name=='YDFDateRange'){
        const multiList = copmareList.find(item=>item.name === 'dateRange')
        data =  [...multiList.dataList]
      }else{
        copmareList.forEach(item => {
          if(item.parentNodeType.indexOf(widget.name) !== -1 && !item.isMulti){
            data = [...item.dataList]
          }
        })
      }
    }
    this.setState({ copmareList: data })
    
    let defaultV = this.state.value;
    if(defaultV){
      const comList = data.find(item=>item.value==defaultV);
      if(!comList){
        value = data[0].value||'';
        this.handleChange({value})
      }
    }
    // if(needReset) {
    //   // 属性面板上有是否多选，且值发生变化，响应的比较符也需要变化，所以值需要重置
    //   value = data.length > 0 ? data[0].value : ''
    //   this.handleChange({
      //     value
      //   })
      if(this.selectRef.current) {
        value = data.length > 0 ? data[0].value : ''
        this.selectRef.current.update({
          value
        })
      }
    // }
  }
  handleChange(value) {
    this.setState({ value: value.value })
    this.props.onChange && this.props.onChange(value.value)
  }
  
  componentWillReceiveProps(nextProps) {
    if('checkable' in nextProps.widget.props && nextProps.widget.props.checkable !== this.props.widget.props.checkable) {
      this.setCopmareList(nextProps.widget, true)
    }
    if('picker' in nextProps.widget.props && this.props.widget.name !== nextProps.widget.name){
      this.setCopmareList(nextProps.widget)
    }
  }
  componentWillMount() {
    this.setCopmareList(this.props.widget)
  }

  render() {
    const { copmareList, value } = this.state

    return (
      <div>
        <YDFSelect
          ref={this.selectRef}
          style={{ width: 200 }}
          placeholder="请选择比较符"
          onChange={this.handleChange.bind(this)}
          labelInValue={true}
          data={copmareList}
          value={value}
        />
      </div>
    )
  }
}