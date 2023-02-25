import { Tag } from "antd";
IsPublish.islast = 'dedede'
export default function IsPublish (props) {
    debugger
    if (props.value === "1" || props.value === 1) {
        return <Tag color="success">已发布</Tag>;
    }
    return <Tag color="warning">未发布</Tag>;
}