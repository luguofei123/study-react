import { Component } from 'react'
import { BaseTable } from 'ali-react-table'
import { Table as AnTable } from 'antd'
class Table extends Component {

    render () {
        const dataSource = [
            { prov: '湖北省', confirmed: 54406, cured: 4793, dead: 1457, t: '2020-02-15 19:52:02' },
            { prov: '广东省', confirmed: 1294, cured: 409, dead: 2, t: '2020-02-15 19:52:02' },
            { prov: '河南省', confirmed: 1212, cured: 390, dead: 13, t: '2020-02-15 19:52:02' },
            { prov: '浙江省', confirmed: 1162, cured: 428, dead: 0, t: '2020-02-15 19:52:02' },
            { prov: '湖南省', confirmed: 1001, cured: 417, dead: 2, t: '2020-02-15 19:52:02' },
        ]

        const columns = [
            { code: 'prov', name: '省份', width: 150 },
            { code: 'confirmed', name: '确诊', width: 100, align: 'right' },
            { code: 'cured', name: '治愈', width: 100, align: 'right' },
            { code: 'dead', name: '死亡', width: 100, align: 'right' },
            { code: 't', name: '最后更新时间', width: 180 },
        ]
        const columns1 = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            AnTable.EXPAND_COLUMN,
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            AnTable.SELECTION_COLUMN,
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
        ];
        const data1 = [
            {
                key: 1,
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
            },
            {
                key: 2,
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
            },
            {
                key: 3,
                name: 'Not Expandable',
                age: 29,
                address: 'Jiangsu No. 1 Lake Park',
                description: 'This not expandable',
            },
            {
                key: 4,
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
            },
        ];
        return <div style={{ margin: '10px', textAlign: 'center' }}>
            <BaseTable dataSource={dataSource} columns={columns} />
            <br />
            <div>antd表格</div>
            <AnTable
                columns={columns1}
                rowSelection={{}}
                expandable={{
                    expandedRowRender: (record) => (
                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            {record.description}
                        </p>
                    ),
                }}
                dataSource={data1}
            />
        </div >
    }
}
export default Table;
