import React from 'react'
import { Input } from 'antd'
import { Table, Icon, Button } from "@tinper/next-ui";
import ht from '../../../utils/HelperTools'
import { modal } from '_c/YDFModal'
import YDFTable from '_c/YDFTable'
import './style.less'
import ConfigTable from './ConfigTable'
const prefixCls = 'lcd-tableConfigBtn'

export default class PropTableConfig extends React.Component {
    constructor(props) {
        super(props)
    }
    state = { fText: '', fValue: '' }
    refTableConfig = new React.createRef()
    async handleTableConfig() {
        const { env } = ht.getGlobalProps()
        // const fieldsTree = await ht.getEntyInfoOfKey()
        const { widget } = this.props
        const { children=[] } = widget || {}
        const c = []
        const deal = (raw)=> {
            if(!raw.hasOwnProperty('children') || Object.prototype.toString.call(raw.children) !== '[object Array]' || raw.children.length ===0 ) {
                c.push(raw)
                // return raw
            }else {
                let c = raw.children
                c.map(item=>{
                    return deal(item)
                })
                // return r
            }
        }
        
        children.forEach(item=>{
            if(item.name !== "LCDBtnToolbar") {
                deal(item)
            }
        })
       
        const data = [];
        c.forEach(item=> {
            if(item.name === "LCDBtnToolbar") {
                return
            }
            // const temp = {...item.props, key: item.key, name:item.label,  }
            const temp = { ...item, name:item.label, }
            if(!temp.displayName) {
                temp.displayName = item.label
            }
            if(!temp.width || temp.width === 200) {
                temp.width = 200
            }
            if(!temp.align) {
                if(item.biztype == "number" || item.name == "YDFInputNumber") {
                    temp.align = "right"
                }else {
                    temp.align = "left"
                }
            }
            if(!temp.disabled) {
                temp.disabled = 0
            }
            if(!temp.hide) {
                temp.hide = 0
            }
            if(!temp.nullable) {
                temp.nullable = 0
            }
            if(!temp.isKey) {
                temp.isKey = false
            }
            data.push(temp)

        })
        this.tableData = JSON.parse(JSON.stringify(data))
        modal.open(
            {
                title: '表格设置(开发中)',
                height: 550,
                width: 950,
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
                onOk: this.handleOk.bind(this),
                children: <ConfigTable ref={this.refTableConfig} data={data} paramsSys={env}  />
            }
        )
    }
    handleOk() {
        const { utools, widget } = this.props
        const { children } = widget || []
        // const divCodeToKey = utools.getItem('divCodeToKey')
        const table = this.refTableConfig.current.getData()
        modal.close()
        table.forEach((item,index)=>{
            const t = this.tableData[index]
            /*const i = children.findIndex(col=>{
                return col.key == item.key
            })
            const t = children[i]*/
            const p = {}
            let col = {}
            if(item.name !== item.displayName.trim()) {
                p.displayName = item.displayName.trim()
            }
            if(item.align !== t.align) {
                p.align = item.align
            }
            if(item.width !== t.width && item.width > 0) {
                p.width = item.width
            }
            if(item.disabled !== t.disabled) { // 原先在props
                p.disabled = item.disabled
            }
            if(item.hide !== t.hide) { // props 外
                p.hide = item.hide
            }
            if(item.nullable !== t.nullable) { // 原先在外面
                p.nullable = item.nullable
            }
            if(!!item.isKey !== !!t.isKey) {
                p.isKey = item.isKey
            }
            /* 后续用这个
            ['name','align','width','disabled','hide','nullable','isKey'].forEach(prop=>{
                if(item[prop] !== t[prop] && !!item[prop] !== !!t[prop]) {
                    p[prop] = item[prop]
                }
            })*/
            /*!col.props ? col.props = p : col.props = {...col.props,...p}
            if(Object.keys(p).length > 0) {
                col = { ...t, ...p }
                utools.updateNode(col,true)
                // utools.wxlcd.designer.updateSelectNode(node)
                utools.updateNodeProp({ key: item.key, prop: 'props', value: p })
            }*/
            this.tableData[index] = { ...t, ...p }
        })
         //标题对象缓存
        let titleColObj={}
        let headerRowCount=1
        let newColumns=[]
        const columns = this.tableData
        //0.处理多表头，displayName,以值分隔
        const hasMultHeader = columns.some(col=>{
            return col.displayName&&col.displayName.indexOf('.')
        })
        
        if(hasMultHeader){
            columns.forEach(col => {
                const {title,displayName}=col
                if(!displayName||displayName.indexOf('.')===-1){
                    newColumns.push(col)
                }else{
                    const titleGroups=displayName.split('.')
                    const len=titleGroups.length
                    if(len>headerRowCount){
                        headerRowCount=len
                    }
                    //临时列
                    /*for(let icol=0;icol<len;icol++){
                        const t=titleGroups[icol]
                        if(icol===0){
                            if(!titleColObj[t]){
                                let tmpCol={title:t,children:[],dataField:t,label:t,key:t}
                                titleColObj[t]=tmpCol
                                newColumns.push(tmpCol)
                            }
                        }else if(icol===len-1){
                            let tmpCol=titleColObj[titleGroups[icol-1]]
                            col.label = t
                            tmpCol.children.push(col)
                        }else{
                            let tmpCol=titleColObj[titleGroups[icol-1]]
                            titleColObj[t]={title:t,children:[],dataField:t,label:t,key: t}
                            tmpCol.children.push(titleColObj[t])
                        }
                    }*/
                    for(let icol=0;icol<len;icol++){
                        const t=titleGroups[icol]
                        if(icol < len-1) {
                            if(!titleColObj[t]) {
                                let tmpCol={title:t,children:[],dataField:t,label:t,key:t}
                                titleColObj[t]=tmpCol
                                if(icol===0) {
                                    newColumns.push(tmpCol)
                                }else {
                                    let pCol=titleColObj[titleGroups[icol-1]]
                                    pCol.children.push(tmpCol)
                                }
                            } 
                        }else {
                            col.label = t
                            let tmpCol=titleColObj[titleGroups[icol-1]]
                            tmpCol.children.push(col)
                        }
                    }
                }
            });
        }else{
            newColumns=[...columns]
        }
        const TI = widget.children.findIndex(item=>item.name === "LCDBtnToolbar")
        TI>-1 && newColumns.push(widget.children[TI])
        widget.children = newColumns
        widget.headerRowCount = headerRowCount
       /* utools.updateNodeProp({ key: widget.key, prop: 'children', value: newColumns })
        utools.wxlcd.designer.updateSelectNode(widget)*/
        utools.updateNode(widget)
        // 子元素更新 默认不会更新选中节点 暂时手动调一次
        utools.wxlcd.designer.updateSelectNode(widget)
    }
    render() {
        const { value = { formula: '' } } = this.props
        return (
            <div className={`${prefixCls}`} >
                <Button className="cofigBtn" colors="secondary" onClick={this.handleTableConfig.bind(this)}>表格设置</Button>
            </div>

        )
    }
}