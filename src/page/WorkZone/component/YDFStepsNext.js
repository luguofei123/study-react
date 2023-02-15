import React, { } from "react";
// 步骤条
function YDFStepsNext (pros) {
    debugger
    let data = pros.uidata
    return (<div>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '10px' }}>{i.label}</span>
        })}
    </div>)
}

export default YDFStepsNext