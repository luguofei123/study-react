import { Button } from "antd";
import { ArrayTable } from "@formily/antd";
import cls from "classnames";
import { useField } from "@formily/react";
import React from "react";
const { useIndex, useArray } = ArrayTable;


export default React.forwardRef(function TableDelete (props, ref) {
    const index = useIndex(props.index);
    const self = useField();
    const array = useArray();
    if (!array) return null;
    if (array.field?.pattern !== "editable") return null;
    return (
        <Button
            {...props}
            size={"small"}
            className={cls(props.className)}
            disabled={self?.disabled}
            ref={ref}
            onClick={(e) => {
                if (self?.disabled) return;
                e.stopPropagation();
                array.field?.remove?.(index);
                array.props?.onRemove?.(index);
                if (props.onClick) {
                    props.onClick(e);
                }
            }}
        >
            删除
        </Button>
    );
});