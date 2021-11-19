
import React from 'react';
import CustomTable from '@/components/CustomTable';

const List = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
            width: 150,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: 80,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address 1',
            ellipsis: true,
        },
        {
            title: 'Long Column Long Column Long Column',
            dataIndex: 'address',
            key: 'address 2',
            ellipsis: true,
        },
        {
            title: 'Long Column Long Column',
            dataIndex: 'address',
            key: 'address 3',
            ellipsis: true,
        },
        {
            title: 'Long Column',
            dataIndex: 'address',
            key: 'address 4',
            ellipsis: true,
        },
    ];


    return (
        <>
            <CustomTable
                columns={columns}
            >

            </CustomTable>
        </>
    )
}

export default List;