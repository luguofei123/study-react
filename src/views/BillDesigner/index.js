
import React from "react"
import widgets from "./components/index"
import dataUi from './mock'
// import { Form } from 'antd'
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
        let draggabled = false
        const parser = (data) => {
            let visibledData = []
            visibledData = data
            return visibledData.map(it => {
                console.log(widgets)
                const COMP = widgets[it.name]
                let item = JSON.parse(JSON.stringify(it))

                if (item.children && item.children.length) {
                    if (item.parseChild === 0) {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} ></COMP>
                    } else {
                        const layouts = item.children
                        const { key } = item
                        let props = { key, ...item.props, labelwidth: item.labelwidth, label: item.label, domnode: item, }
                        if (draggabled) {
                            let content = <DragactLayout isRoot={item.name === 'root'} layout={layouts} rowHeight={item.rowHeight} defaultHeight={item.defaultHeight} flowX={item.flowX} cols={item.cols} width={item.GridW || 800} containerKey={item.key} key={item.key} locked={item.locked} />
                            return wrap(COMP, content, props)
                        } else {
                            let content = parser(item.children)
                            return wrap(COMP, content, props)

                        }

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

        return <>{parser([dataUi])}</>

    }

}
export default BillDesigner