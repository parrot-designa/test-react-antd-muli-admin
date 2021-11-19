import React, { useEffect, useState } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import roleApi from '@/api/permissions/role'
import { Space, Form, Input, Card, Button, Modal } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';

const Index = () => {

    const [form] = Form.useForm();

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '备注',
            dataIndex: 'des',
            key: 'des',
        },
        {
            title: '创建时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <PermissionsButton permission={"Role:Update"}>
                        <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"Role:Delete"}>
                        <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                        </PermissionsButton>
                  
                        <CustomButton type='warning' onClick={() => onOpenPermission(record)}>权限分配</CustomButton>
                  
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
        name: ""
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');

    const [permissionVisible, setPermissionVisible] = useState(false);

    const [current, setCurrent] = useState({});

    const getList = () => {
        let newObj:any={}
        if(searchKeys){
            newObj.searchKey=searchKeys.name
        }
        roleApi.getList({
            page: pagination.current,
            size: pagination.pageSize,
            ...newObj
        }).then((res: any) => { 
            const { records, total } = res;
            setDataSource(records)
            setPagination({
                ...pagination,
                total: total
            })
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

    const onEditItem = (current) => {
        setVisible(true);
        setModalType('edit')
        setCurrent(current)
        form.setFieldsValue({
            name: current.name,
            des: current.des
        })
    }

    const onOpenPermission = (current) => {
        setPermissionVisible(true);
        setCurrent(current);
    }

    const handleChange = (key) => (e) => {
        if (key === 'name') {
            setSearchKeys({
                ...searchKeys,
                name: e.target.value
            })
        }
    }

    const handleSearchKeys = () => {
        getList();
    }

    const tableTopComponent = (
        <>
            <div>角色名:</div>
            <div><Input onChange={handleChange('name')} value={searchKeys.name} /></div>
        </>
    )

    return (
        <div>
            <Card>

                <PermissionTree
                    visible={permissionVisible}
                    clickCancel={() => setPermissionVisible(false)}
                    roleId={(current as any).id}
                />

                <CustomTable
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                    onAdd={handleShowVisible}
                    onDelete={handleDeleteRoles}
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={"Role"}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'角色'}
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
                            label="角色名"
                            name="name"
                            rules={[{ required: true, message: '角色名必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            name="des"
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space align="end" style={{ float: 'right' }}>
                                <Button type="primary" htmlType="submit" loading={addLoading}>
                                    保存
                            </Button>
                                <Button type="default" onClick={() => setVisible(false)} >
                                    取消
                            </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </CustomModal>
            </Card>
        </div>
    )
}

export default Index;