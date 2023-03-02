const param = {
    type: "object",
    'x-component': 'FormTab.TabPane',
    'x-component-props': {
        tab: '参数控制',
    },
    properties: {
        collapse: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'FormCollapse',
            'x-component-props': {
                //  formCollapse: '{{formCollapse}}',
            },
            properties: {
                panel1: {
                    type: 'void',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                        header: '选择单据',
                    },
                    properties: {
                        aaa: {
                            type: 'string',
                            title: 'AAA',
                            'x-decorator': 'FormItem',
                            required: true,
                            'x-component': 'Input',
                        },
                    },
                },
                panel2: {
                    type: 'void',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                        header: '结算方式',
                    },
                    properties: {
                        bbb: {
                            type: 'string',
                            title: 'BBB',
                            'x-decorator': 'FormItem',
                            required: true,
                            'x-component': 'Input',
                        },
                    },
                },
                panel3: {
                    type: 'void',
                    'x-component': 'FormCollapse.CollapsePanel',
                    'x-component-props': {
                        header: '指标过滤',
                    },
                    properties: {
                        ccc: {
                            type: 'string',
                            title: 'CCC',
                            'x-decorator': 'FormItem',
                            required: true,
                            'x-component': 'Input',
                        },
                    },
                },
            },
        },
    },
}
export default param