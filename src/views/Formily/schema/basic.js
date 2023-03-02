const basic = {
    type: "object",
    'x-component': 'FormTab.TabPane',
    'x-component-props': {
        tab: '基本信息',
    },
    properties: {
        layout: {
            type: 'void',
            'x-component': 'FormLayout',
            'x-component-props': {
                labelCol: 2,
                wrapperCol: 6,
                labelAlign: 'right',
                // layout: 'vertical',
            },
            // 属性描述
            properties: {
                enable: {
                    type: "string",
                    title: "发布状态",
                    "x-decorator": "FormItem",
                    "x-component": "IsPublish",
                },
                controlMethod: {
                    type: "number",
                    title: "管控方式",
                    enum: [
                        {
                            label: "统建",
                            value: 0,
                        },
                        {
                            label: "参考",
                            value: 1,
                        },
                        {
                            label: "自建",
                            value: 2,
                        },
                    ],
                    "x-decorator": "FormItem",
                    "x-component": "Radio.Group",
                    required: true,
                },
                username: {
                    // schema type
                    type: 'string',
                    // 标题
                    title: '单据名称',
                    // 必填
                    required: true,
                    // 字段 UI 包装器组件
                    'x-decorator': 'FormItem',
                    // 字段 UI 组件
                    'x-component': 'Input',
                },
                password: {
                    type: 'string',
                    title: '单据编号',
                    required: true,
                    'x-decorator': 'FormItem',
                    'x-component': 'Input',
                },
                tableList: {
                    type: 'array',
                    title: '附件类型',
                    'x-decorator': 'FormItem',
                    'x-component': 'ArrayTable',
                    "x-decorator-props": {
                        wrapperCol: 18,
                    },
                    'x-component-props': {
                        pagination: { pageSize: 10 },
                        scroll: { x: '100%' },
                    },
                    items: {
                        type: 'object',
                        properties: {
                            index: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': { width: 80, title: '序号', align: 'center', fixed: 'left', },
                                properties: {
                                    index: {
                                        type: 'void',
                                        'x-component': 'ArrayTable.Index',
                                    },
                                },
                            },
                            a1: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': { width: 200, title: '附件类型', fixed: 'left', },
                                properties: {
                                    a1: {
                                        type: 'string',
                                        'x-decorator': 'Editable',
                                        'x-component': 'Input',
                                    },
                                },
                            },
                            a2: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': { width: 200, title: '附件别名' },
                                properties: {
                                    a2: {
                                        type: 'string',
                                        'x-decorator': 'Editable',
                                        'x-component': 'Input',
                                    },
                                },
                            },
                            a3: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': { width: 200, title: '是否审批111' },
                                properties: {
                                    a3: {
                                        type: 'boolean',
                                        'x-decorator': 'FormItem',
                                        'x-component': 'Switch',
                                    },
                                },
                            },
                            a4: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': { width: 200, title: '是否审批222' },
                                properties: {
                                    a4: {
                                        type: 'boolean',
                                        'x-decorator': 'FormItem',
                                        'x-component': 'Switch',
                                    },
                                },
                            },
                            operations: {
                                type: 'void',
                                'x-component': 'ArrayTable.Column',
                                'x-component-props': {
                                    title: '操作',
                                    dataIndex: 'operations',
                                    width: 200,
                                    fixed: 'right',
                                },
                                properties: {
                                    item: {
                                        type: 'void',
                                        'x-component': 'FormItem',
                                        properties: {
                                            remove: {
                                                type: 'void',
                                                'x-component': 'TableDelete',
                                            },
                                            moveDown: {
                                                type: 'void',
                                                'x-component': 'ArrayTable.MoveDown',
                                            },
                                            moveUp: {
                                                type: 'void',
                                                'x-component': 'ArrayTable.MoveUp',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    properties: {
                        add: {
                            type: 'void',
                            'x-component': 'ArrayTable.Addition',
                            title: '添加条目',
                        },
                    },
                },

            },
        },
    },
}
export default basic