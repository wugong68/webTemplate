/*

    http://localhost/home/ro?module=demo-query

*/

const { Table } = antd;
const { useState, useEffect } = React;
function App() {

    const dataSource = [
        {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '3',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '4',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '5',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        }, {
            key: '6',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '7',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '8',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '9',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
        },
        {
            key: '10',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '11',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
        {
            key: '12',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
        },
    ];

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
    ];


    const [page,setpage] = useState({
        pageSize:10,
        total:dataSource.length,
        current:1
    })

    const changePage = (curr) => {
        console.log("page", curr)
        console.log("pre",JSON.stringify(page))
        setpage(Object.assign(page, { current: curr }) )
        console.log("aft", JSON.stringify(page))

        setpaginationProps(Object.assign(paginationProps, { current: page.current }))
    }

    const changePageSize = (ps,curr) => {

    }

    const [paginationProps, setpaginationProps] = useState({
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共${page.total}条`,
        pageSize: page.pageSize,
        current: page.current,
        total: page.total,
        onShowSizeChange: changePageSize,
        onChange: changePage,
    });


    return (
        <div style={{ padding: '10px' }} >
            <Table pagination={ paginationProps } dataSource={dataSource} columns={columns} />
        </div>
    );
}
