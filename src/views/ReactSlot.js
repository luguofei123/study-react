import React, { useState } from "react";
import { Button, Input } from 'antd';
function Son1 () {
    return <><Input /></>
}
// function Son2 () {
//     return <><Input /></>
// }
// let TagName = null

function App () {
    const [slot, setSlot] = useState(0)
    const [tem, setTem] = useState(null)

    const appendChidren = () => {
        debugger
        // TagName = Son1
        setSlot(num => num + 1)
        setTem(tem => {
            tem = Son1
            return tem
        })
    }
    return <>
        <Button onClick={appendChidren}>添加</Button>
        <span>{slot}</span>

        {/* 注意这种写法 */}
        {tem ? tem() : '3333'}

    </>
}
export default App