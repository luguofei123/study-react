import React, { useContext, useState, useEffect } from 'react';
import {
    Table,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Tooltip,
    Select,
    DatePicker,
    TimePicker,
} from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';

const tableData = [
    {
        key: '0',
        name: '铅笔',
        budget: '100',
        number: 1,
        price: 0.00,
        data: dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    },
    {
        key: '1',
        name: '橡皮',
        budget: '200',
        number: 1,
        price: 0.00,
        data: null,
    },
];
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    rules,
    handleSave,
    valueType,
    ...restProps
}) => {
    const form = useContext(EditableContext);
    useEffect(() => {
        form.setFieldsValue({
            [dataIndex]: record?.[dataIndex],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const save = async () => {
        try {
            const values = await form.validateFields();
            // 计算
            debugger
            let price = 0
            if (values.budget && values.number) {
                price = values.budget * values.number
                record.key = new Date().getTime()
            }
            handleSave({ ...record, ...values, price });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    const selectChange = (val) => {

        debugger
        if (val === 1) {
            record.budget = 100
        }
        if (val === 2) {
            record.budget = 200
        }
        record.key = new Date().getTime()
        record.name = val
        let price = 0
        if (record.budget && record.number) {
            price = record.budget * record.number
        }
        handleSave({ ...record, price });
    }

    // 这里可以自行扩展
    const renderNode = (valueType) => {
        switch (valueType) {
            case 'input':
                return <Input onPressEnter={save} onBlur={save} />;
            case 'select':
                return (
                    <Select allowClear onBlur={save} onChange={selectChange}>
                        <Select.Option key="1" value={1}>
                            铅笔
                        </Select.Option>
                        <Select.Option key="2" value={2}>
                            橡皮
                        </Select.Option>
                    </Select>
                );
            case 'date':
                return <DatePicker onBlur={save} />;
            case 'dateRange':
                return <DatePicker.RangePicker onBlur={save} />;
            case 'time':
                return <TimePicker onBlur={save} />;
            case 'inputNumber':
                return <InputNumber
                    style={{ width: '100%' }}
                    onBlur={save}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />;

            default:
                break;
        }
    };
    let childNode = valueType ? (
        <Form.Item
            style={{
                margin: 0,
            }}
            name={dataIndex}
            rules={
                rules || [
                    {
                        required: true,
                        message: `${title} 不能为空.`,
                    },
                ]
            }
        >
            {renderNode(valueType)}
        </Form.Item>
    ) : (
        children
    );
    return <td {...restProps}>{childNode}</td>;
};

const TableAnt = ({ value = tableData, onChange }) => {
    const [dataSource, setDataSource] = useState(value);
    const columns = [
        {
            title: '物品',
            dataIndex: 'name',
            width: '30%',
            editable: true,
            valueType: 'select',
            rules: [{ required: true, message: '测1111试' }],
        },
        {
            title: '单价',
            dataIndex: 'budget',
            editable: true,
            valueType: 'inputNumber',
        },
        {
            title: '数量',
            dataIndex: 'number',
            editable: true,
            valueType: 'inputNumber',
        },
        {
            title: '价钱',
            dataIndex: 'price',
            editable: true,
            valueType: 'inputNumber',
        },
        {
            title: '日期',
            dataIndex: 'data',
            editable: true,
            valueType: 'date',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Tooltip placement="bottom" title="删除当前行">
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <a href='/#'>删除</a>
                        </Popconfirm>
                    </Tooltip>
                ) : null,
        },
    ];

    const handleDelete = (key) => {
        setDataSource(dataSource.filter((item) => item.key !== key));
        onChange?.(dataSource.filter((item) => item.key !== key));
    };

    const handleAdd = () => {
        const newData = {
            key: new Date().getTime(),
            name: 1,
            budget: '1',
            number: 0,
            price: 0,
            data: dayjs(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
        };
        setDataSource([...dataSource, newData]);
        // onChange?.([...dataSource, newData]);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        // if (row.name === 1) {
        //     row.budget = Math.random(100) + ''
        //     row.key = new Date().getTime()
        // }
        newData.splice(index, 1, { ...item, ...row });

        setDataSource(newData);
        onChange?.(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const newColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                valueType: col.valueType,
                rules: col.rules,
                handleSave: handleSave,
            }),
        };
    });
    // 模拟 class 组件的 componentDidMount 和 componentDidUpdate
    // 第一个参数执行函数，第二个参数不传
    useEffect(() => {
        debugger
        console.log('DidMount 和 DidUpdate')
    })
    // 模拟 class 组件的 componentDidMount
    // 第一个参数执行函数，第二个参数传空数组[]
    // 第二个参数是 [] （不依赖于任何 state）
    useEffect(() => {
        console.log('加载完了componentDidMount')
    }, [])
    // 模拟 class 组件的 componentDidUpdate
    // 第一个参数执行函数，第二个参数传state数组
    useEffect(() => {
        console.log('更新了')
    }, [dataSource]) // 第二个参数就是依赖的 state

    // 模拟 class 组件的 componentDidMount 和 componentWillUnmount
    useEffect(() => {
        let timerId = window.setInterval(() => {
            // console.log(Date.now())
        }, 1000)

        // 返回一个函数
        // 模拟 componentWillUnmount 组件销毁的时候 停止计时器
        return () => {
            window.clearInterval(timerId)
        }
    }, [])
    // useEffect(() => {
    //     debugger
    //     onChange?.([...dataSource]);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    return (
        <div>
            <Table
                components={components}
                rowClassName="rules_edit_row"
                rowKey={(record) => record.key}
                bordered
                pagination={true}
                showHeader={true}
                dataSource={dataSource}
                columns={newColumns}
            />
            <span
                style={{
                    color: '#3880ff',
                    cursor: 'pointer',
                    position: 'relative',
                    top: 6,
                }}
                onClick={handleAdd}
            >
                <PlusOutlined />
                添加
            </span>
        </div>
    );
}

export default TableAnt