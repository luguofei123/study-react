
/*
 * @Descripttion: 鼠标hover显示操作列
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-06-14 13:18:29
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/widgt/HoverContent.jsx
 */
import { Component } from 'react';
const { Button, Table, Icon, Dropdown, Menu } = TinperNext
const { Item } = Menu;
export default class HoverContent extends Component {
    constructor(props) {
        super(props)
    }
    render () {
        return (<div className='opt-btns'>
            <div style={{ display: 'inline-block' }}>
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }}>操作1</Button>
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }}>操作2</Button>
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }}>操作3</Button>
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }}>操作4</Button>
                <Button size='sm' colors="dark" style={{ marginRight: '5px' }}>操作5</Button>
            </div>
        </div>);
    }
}
