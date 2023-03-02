const element = {
    type: "object",
    'x-component': 'FormTab.TabPane',
    'x-component-props': {
        tab: '要素设置',
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
            properties: {
                ccc: {
                    type: 'string',
                    title: 'CCC',
                    'x-decorator': 'FormItem',
                    required: true,
                    'x-component': 'Input',
                },
            }
        }
    },
}
export default element