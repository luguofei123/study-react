import React from 'react';
import { createForm } from '@formily/core';
import "@formily/antd/dist/antd.css";
import { createSchemaField, FormProvider } from '@formily/react';
import { FormCollapse, FormTab, FormItem, Input, Password, Submit, FormLayout, FormButtonGroup, Radio, ArrayTable, Switch, Editable } from '@formily/antd';
import IsPublish from './component/IsPublish'

import * as ICONS from '@ant-design/icons';
console.log(IsPublish.islast)
//用来创建表单核心领域模型，它是作为MVVM设计模式的标准 ViewModel
const form = createForm(
    {
        initialValues: {
            tab1: {
                enable: '1',
                controlMethod: 0,
                username: 'EXP_TRIP',
                password: '00010002003'
            },
            tab2: {
                aaa: "11",
                bbb: "22",
                ccc: "33"
            },
            tab3: {
                ccc: "33"
            }

        },
    }
);

// 创建一个 SchemaField 组件用于解析JSON-Schema动态渲染表单的组件
const SchemaField = createSchemaField({
    // 组件列表
    components: {
        FormTab, FormCollapse,
        FormLayout,
        FormItem,
        Input,
        Password,
        Radio,
        ArrayTable,
        Switch,
        Editable,
        IsPublish
    },
    // 全局作用域，用于实现协议表达式变量注入
    scope: {
        icon (name) {
            return React.createElement(ICONS[name]);
        },
    },
});
// const formTab = FormTab.createFormTab()

/**初始化一份json schema
 * 解析 json-schema 的能力；将 json-schema 转换成 Field Model 的能力；编译 json-schema 表达式的能力
 **/
const schema = {
    type: 'object',
    properties: {
        collapse: {
            type: 'void',
            'x-component': 'FormTab',
            'x-component-props': {
                // formTab: '{{formTab}}',
            },
            properties: {
                tab1: {
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
                                            // column1: {
                                            //     type: 'void',
                                            //     'x-component': 'ArrayTable.Column',
                                            //     'x-component-props': { width: 50, title: 'Sort', align: 'center' },
                                            //     properties: {
                                            //         sort: {
                                            //             type: 'void',
                                            //             'x-component': 'ArrayTable.SortHandle',
                                            //         },
                                            //     },
                                            // },
                                            column2: {
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
                                            column3: {
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
                                            column4: {
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
                                            column5: {
                                                type: 'void',
                                                'x-component': 'ArrayTable.Column',
                                                'x-component-props': { width: 800, title: '是否审批' },
                                                properties: {
                                                    a3: {
                                                        type: 'string',
                                                        'x-decorator': 'FormItem',
                                                        'x-component': 'Switch',
                                                    },
                                                },
                                            },
                                            column6: {
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
                                                                'x-component': 'ArrayTable.Remove',
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
                },
                tab2: {
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
                },
                tab3: {
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
                },
            },
        },
    },
}

// const schema11 = {
//     type: 'object',
//     properties: {
//         collapse: {
//             type: 'void',
//             title: '折叠面板',
//             'x-decorator': 'FormItem',
//             'x-component': 'FormCollapse',
//             'x-component-props': {
//                 formCollapse: '{{formCollapse}}',
//             },
//             properties: {
//                 panel1: {
//                     type: 'void',
//                     'x-component': 'FormCollapse.CollapsePanel',
//                     'x-component-props': {
//                         header: 'A1',
//                     },
//                     properties: {
//                         aaa: {
//                             type: 'string',
//                             title: 'AAA',
//                             'x-decorator': 'FormItem',
//                             required: true,
//                             'x-component': 'Input',
//                         },
//                     },
//                 },
//                 panel2: {
//                     type: 'void',
//                     'x-component': 'FormCollapse.CollapsePanel',
//                     'x-component-props': {
//                         header: 'A2',
//                     },
//                     properties: {
//                         bbb: {
//                             type: 'string',
//                             title: 'BBB',
//                             'x-decorator': 'FormItem',
//                             required: true,
//                             'x-component': 'Input',
//                         },
//                     },
//                 },
//                 panel3: {
//                     type: 'void',
//                     'x-component': 'FormCollapse.CollapsePanel',
//                     'x-component-props': {
//                         header: 'A3',
//                     },
//                     properties: {
//                         ccc: {
//                             type: 'string',
//                             title: 'CCC',
//                             'x-decorator': 'FormItem',
//                             required: true,
//                             'x-component': 'Input',
//                         },
//                     },
//                 },
//             },
//         },
//     },
// }

const Formily = () => {
    return (
        <div style={{ textAlign: 'left', }}>
            <FormProvider form={form}>
                <FormLayout layout="vertical">
                    <SchemaField schema={schema} />
                </FormLayout>
                <FormButtonGroup>
                    <Submit onSubmit={(data) => { console.log(data) }}>提交</Submit>
                </FormButtonGroup>
            </FormProvider>
        </div>
    );
};
export default Formily
