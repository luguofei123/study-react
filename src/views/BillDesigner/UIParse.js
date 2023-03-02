
import React from "react"
import widgets from "./components/index"
import dataUi from './mock'
import { Form } from 'antd'
// import ARPanel from './components/ARPanel/index'
// import ARFormItem from './components/ARFormItem/index'
// import ARInput from './components/ARInput/index'
import DragactLayout from './DragactLayout/index.jsx'

class BillDesigner extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        // 增加包裹层
        const wrap = (Pwrap, content, wrapProps) => {
            return Pwrap ? <Pwrap {...wrapProps} >{content}</Pwrap> : content
        }
        const parser = (data) => {
            debugger
            let visibledData = []
            visibledData = [data]
            return visibledData.map(it => {
                console.log(widgets)
                const COMP = widgets[it.name]
                // const layouts = (ht.showHideItem || !item.locked) ? item.children : item.children.filter(lt => lt.hide !== 1)


                // const { key } = item
                // //需要拖拽时
                // if (draggabled) {
                //   return wrap(<DragactLayout isRoot={item.name === 'root'} layout={layouts} rowHeight={item.rowHeight} defaultHeight={item.defaultHeight} flowX={item.flowX} cols={item.cols} width={item.GridW || 800} containerKey={item.key} key={item.key} extraStyle={itemExtraStyle} locked={item.locked} utools={ht} />, 
                // TagName, { key, ...item.props, labelwidth: item.labelwidth, label: item.label, ref, domnode: item, utools: ht })
                // }
                let item = JSON.parse(JSON.stringify(it))

                if (item.children && item.children.length) {
                    if (item.parseChild === 0) {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} ></COMP>
                    } else {
                        const layouts = item.children
                        const { key } = item
                        let props = { key, ...item.props, labelwidth: item.labelwidth, label: item.label, domnode: item, }
                        let content = <DragactLayout isRoot={item.name === 'root'} layout={layouts} rowHeight={item.rowHeight} defaultHeight={item.defaultHeight} flowX={item.flowX} cols={item.cols} width={item.GridW || 800} containerKey={item.key} key={item.key} locked={item.locked} />
                        // let pwrap = <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item}>{parser(item.children)}</COMP>
                        return wrap(COMP, content, props)
                    }


                } else {
                    let wrapProps = { key: item.key, label: item.label || item.title, name: item.dataField, ...item.props, className: item.hide ? 'hide' : '', domnode: { ...item } }
                    let tmpProps = { ...item.props, label: item.label, domnode: { ...item } }
                    if (item.nodeType = 'formItem') {
                        let content = <COMP {...tmpProps} ></COMP>
                        debugger
                        return wrap(widgets[item.nodeType], content, wrapProps)
                    } else {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} >{item.label + '组件：' + item.name}</COMP>
                    }
                }

            })
        }
        if (this.props.uidata) {
            return <>{parser(this.props.uidata)}</>
        } else {
            return <>{parser([dataUi])}</>
        }


    }

}
export default BillDesigner