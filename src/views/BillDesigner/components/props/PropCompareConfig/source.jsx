export const copmareList = [{
    label: '字符型', name: 'string', parentNodeType: ['YDFInput', 'YDFTextArea'],
    dataList: [
        { label: '等于(eq)', value: 'eq' },
        { label: '不等于(neq)', value: 'neq' },
        { label: '包含(like)', value: 'like' },
        { label: '开始以(leftlike)', value: 'leftlike' },
        { label: '结束以(rightlike)', value: 'rightlike' }
    ]
},
{
    label: '数值型', name: 'number', parentNodeType: ['YDFInputNumber','YDFDatePicker'],//日期/时间
    dataList: [
        { label: '等于(eq)', value: 'eq' },
        { label: '不等于(neq)', value: 'neq' },
        { label: '大于(gt)', value: 'gt' },
        { label: '小于(lt)', value: 'lt' },
        { label: '大于等于(egt)', value: 'egt' },
        { label: '小于等于(elt)', value: 'elt' },
    ]
},
{
    label: '日期区间', name: 'dateRange', parentNodeType: ['YDFDateRange'],
    dataList: [
        { label: '区间(between)', value: 'between' },
    ]
},
{
    label: '枚举型', name: 'enumerate', parentNodeType: ['YDFSelect','YDFCheckbox','YDFRadio','YDFSwitch','YDFTreeSelect'],
    dataList: [
        { label: '等于(eq)', value: 'eq' },
        { label: '不等于(neq)', value: 'neq' },
        { label: '为空(is_null)', value: 'is_null' },
        { label: '非空(is_not_null)', value: 'is_not_null' },
    ]
},
{
    label: '参照类型', name: 'refer', parentNodeType: ['YDFReferButton','YDFTreeModalSelect','YDFTableModalSelect'],
    dataList: [
        { label: '等于(eq)', value: 'eq' },
        { label: '不等于(neq)', value: 'neq' },
    ]
},
{
    label: '参照多选类型', name: 'multiRefer', parentNodeType: ['YDFReferButton','YDFTreeModalSelect','YDFTableModalSelect'],
    isMulti: true,
    dataList: [
        { label: '在列表中(in)', value: 'in' },
        { label: '不在列表中(nin)', value: 'nin' },
        { label: '包含(like)', value: 'like' },
    ]
}
]