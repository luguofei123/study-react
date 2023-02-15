import React, { } from "react";
// 步骤条
function LCDPanel (pros) {
    debugger
    let data = pros.uidata
    return (<div className={pros.className}>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '20px' }}>{i.label}</span>
        })}
    </div>)
}

export default LCDPanel