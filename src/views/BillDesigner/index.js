
import React from "react"
import widgets from "./components/index"
import dataUi from './mock'
import { Form } from 'antd'
import ARPanel from './components/ARPanel/index'
import ARFormItem from './components/ARFormItem/index'
import ARInput from './components/ARInput/index'
// import DragactLayout from './DragactLayout/index.jsx'

class BillDesigner extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        // 增加包裹层
        const wrap = (Pwrap, content) => {
            return Pwrap ? <Pwrap >{content}</Pwrap> : content
        }
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
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item}>{parser(item.children)}</COMP>
                    }


                } else {
                    if (item.nodeType = 'formItem') {
                        let content = <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} ></COMP>
                        return wrap(widgets[item.nodeType], content)
                    } else {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} >{item.label + '组件：' + item.name}</COMP>
                    }
                }

            })
        }
        return <>{parser([dataUi])}
            <Form>
                <ARFormItem>
                    <ARInput />
                </ARFormItem>
            </Form>
        </>

    }

}
export default BillDesigner