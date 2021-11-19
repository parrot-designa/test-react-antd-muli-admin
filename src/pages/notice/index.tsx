import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal'; 
import roleApi from '@/api/notice'
import { Space, Card, Form, Input, Modal, InputNumber  } from 'antd';
import { layout } from '@/utils/layout'
import PermissionsButton from '@/components/PermissionsButton';
import { ExclamationCircleOutlined } from '@ant-design/icons'; 

const Index = () => {

    const [form] = Form.useForm();

    const [tableLoading, setTableLoading] = useState(false); 

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },

        {
            title: '时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        {/* <CustomButton type='default' onClick={() => onViewItem(record)} >查看</CustomButton> */}
                        {/* <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton> */}
                        <PermissionsButton permission={`Notice:Delete`}>
                            <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                        </PermissionsButton>
                    </Space>
                )
            }
        }
    ];

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [searchKeys, setSearchKeys] = useState({
        title: ""
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');


    const [current, setCurrent] = useState({});

    const getList = () => {
        let newObj: any = {}
        if (searchKeys.title) {
            newObj.title = searchKeys.title
        }

        setTableLoading(true)
        roleApi.getList({
            page: pagination.current,
            size: pagination.pageSize,
            ...newObj
        }).then((res: any) => {
            setTableLoading(false) 
            const { records, total } = res;
            setDataSource(records)
            setPagination({
                ...pagination,
                total: total
            })
        }).catch(e => {
            setTableLoading(false)
        })
    }

    useEffect(() => {
        getList()
    }, [pagination.current, pagination.pageSize]);

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add')
    }

    const onFinish = (values: any) => { 
        if (values.roleNames && values.roleNames.length) {
            values.roleNames = values.roleNames.join(",")
        }
        setAddLoading(true);
        if (modalType === 'add') {
            roleApi.add(values).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        } else {
            roleApi.edit({
                ...values,
                id: (current as any).id
            }).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        }

    };

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination({
            ...pagination
        })
    }
    //删除全部
    const handleDeleteRoles = (deleteIds) => {
        roleApi.delete(deleteIds).then(res => {
            getList();
        })
    }
    //删除单个
    const onDeleteItem = (current) => { 
        Modal.confirm({
            title: '信息',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除选中数据吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => roleApi.delete([current.id]).then(res => {
                getList();
            })
        });
    }

    const onViewItem = (current) => {
        setVisible(true);
        setModalType('view')
        setCurrent(current)
        form.setFieldsValue({
            account: current.account,
            title: current.title,
            url: current.url,
            method: current.method,
            param: current.param,
            client: current.client,
            ip: current.ip,
            createTimeStr: current.createTimeStr,
        })
    }


    const handleChange = (key) => (e) => {
        if (key === 'title') {
            setSearchKeys({
                ...searchKeys,
                title: e.target.value
            })
        }
    }

    const handleSearchKeys = () => {
        getList();
    }

    const tableTopComponent = (
        <>

            <div>
                <Input placeholder={"请输入搜索标题"} value={searchKeys.title} onChange={handleChange('title')} />
            </div>
        </>
    )

    return (
        <div>
            <Card>
                <CustomTable
                    columns={columns}
                    loading={tableLoading}
                    dataSource={dataSource}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                    onAdd={handleShowVisible}
                    onDelete={handleDeleteRoles}
                    hasAddButton={false}
                    hasDeleteButton={true}
                    tableTopProps={{
                        search: true,
                        add: false,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={`Notice`}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'操作日志'}
                    type={modalType}
                    size="small"
                    clickCancel={() => setVisible(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        {...layout}
                    >
                        <Form.Item
                            label="用户名"
                            name="account"
                        >
                            <Input disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="标题"
                            name="title"
                            rules={[{ required: true, message: '姓名必填!' }]}
                        >
                            <Input disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="URL"
                            name="url"
                            rules={[{ required: true, message: '姓名必填!' }]}
                        >
                            <Input disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="请求类型"
                            name="method"

                        >
                            <InputNumber style={{ width: '100%' }} disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="请求内容"
                            name="param"
                        >
                            <Input disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="客户端"
                            name="client"
                        >
                            <Input.TextArea disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="IP"
                            name="ip"
                        >
                            <Input.TextArea disabled={modalType === 'view'} />
                        </Form.Item>

                        <Form.Item
                            label="创建时间"
                            name="createTimeStr"
                        >
                            <Input disabled={modalType === 'view'} />
                        </Form.Item>

                    </Form>
                </CustomModal>
            </Card>
        </div>
    )
}

export default Index;