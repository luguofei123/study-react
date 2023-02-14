import React, { } from "react";
// 步骤条
function YDFStepsNext (pros) {
    let data = pros.uidata
    return (<>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '10px' }}>{i.label}</span>
        })}
    </>)
}

export default YDFStepsNext