/*
 * @Descripttion: 列表通用方法
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-29 13:56:32
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-29 14:27:52
 * @FilePath: /study-react/src/views/代码规范/listTable.js
 */
initTable = (viewModal) => {
    const searchData = viewModal.get(this.searchContainer)
    // 列表检索条件
    this.searchParams = {
        queryScheme: {
            fullname: this.treeData.enty.info.uri,
            fields: fields,
            conditions: searchData.getQCondition(),
            orders: [],
            pager: {
                pageIndex: 1,
                pageSize: 50
            },
        },
        actionCode: this.actionCodeTypeSearch,
        busiObj: this.treeData.enty.info.code,
        externalData: {
            tabNo: this.tabNos[0],
            billCateCode: this.billContext.billTypeCode,
            fields: externalFields
        }
    }
    this.getTableList(viewModal, this.searchParams)   // 进入页面加载数据
    // 绑定搜索事件
    viewModal.on(this.searchContainer, 'onQuery', (item) => {
        this.searchParams.queryScheme.conditions = item.data
        this.getTableList(viewModal, this.searchParams)

    })
    // 绑定tab事件
    viewModal.on(this.stepsContainer, 'onChange', (item) => {
        this.searchParams.externalData.tabNo = item.data.props.stepcode
        this.getTableList(viewModal, this.searchParams)
    })
    // 分页事件绑定
    viewModal.on(this.tableContainer, 'onPageChange', ({ activeKey, pageSize }) => {
        this.searchParams.queryScheme.pager.pageIndex = activeKey || 1
        this.searchParams.queryScheme.pager.pageSize = pageSize
        this.getTableList(viewModal, this.searchParams)
    })
    // 分页事件绑定
    viewModal.on(this.tableContainer, 'onPageSizeChange', ({ activeKey, pageSize }) => {
        this.searchParams.queryScheme.pager.pageIndex = activeKey || 1
        this.searchParams.queryScheme.pager.pageSize = pageSize
        this.getTableList(viewModal, this.searchParams)
    })
    // 监控单据跳转 单据id字段需要设置成链接
    viewModal.get(this.tableContainer).state.columns.forEach(item => {
        if (item.name === 'link' && item.dataField.indexOf('illNo') !== -1) {
            viewModal.on(item.key, 'onCellClick', (param) => {
                listBtnFun.customView(viewModal, '', param.data)
            })
        }
    })
    // 设置表格上的按钮显示逻辑 // params: row: 表格行数据  rowIndex： 表格行标  owTools： 按钮列表
    viewModal.on(this.tableContainer, 'onRowHover', ({ row, rowIndex, rowTools }) => {
        let newRowTools = listBtnFun.showRowButtonLogic(viewModal, row, rowIndex, rowTools)
        return newRowTools;
    }
    );

}