import React from 'react';
import { createForm } from '@formily/core';
import "@formily/antd/dist/antd.css";
import { createSchemaField, FormProvider } from '@formily/react';
import TableDelete from './component/TableDelete'



import { PreviewText, FormCollapse, FormTab, FormItem, Input, Password, Submit, FormLayout, FormButtonGroup, Radio, ArrayTable, Switch, Editable } from '@formily/antd';
import IsPublish from './component/IsPublish'


import * as ICONS from '@ant-design/icons';
import schema from './schema/index'
console.log(IsPublish.islast)
//用来创建表单核心领域模型，它是作为MVVM设计模式的标准 ViewModel
const form = createForm(
    {
        initialValues: {
            basic: {
                enable: '1',
                controlMethod: 0,
                username: 'EXP_TRIP',
                password: '00010002003',
                tableList: [{
                    a1: '', a2: '', a3: false, a4: true
                }]

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
        IsPublish,
        TableDelete
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



const Formily = () => {
    return (
        <div style={{ textAlign: 'left', }}>
            <FormProvider form={form} >
                <FormLayout layout="vertical">
                    <PreviewText.Placeholder value={<span style={{ visibility: "hidden" }}>N/A</span>}>
                        <SchemaField schema={schema} />
                    </PreviewText.Placeholder>
                </FormLayout>
                <FormButtonGroup>
                    <Submit onSubmit={(data) => { console.log(data); console.log(form) }}>提交</Submit>
                </FormButtonGroup>

            </FormProvider>
        </div>
    );
};
export default Formily
