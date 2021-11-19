import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import RoleSelect from '@/components/RoleSelect';
import roleApi from '@/api/permissions/admin'
import { Space, Card, Form, Input, Button, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';
const { Option } = Select;


const Index = () => {

    const [form] = Form.useForm();

    const handleChangeState = (e, current) => {
        roleApi.edit({
            id: (current as any).id,
            state: e ? 0 : 1
        }).then(res => {

            getList();
        }).catch((e) => {
        })
    }

    const onResetPassword = (current) => {
        Modal.confirm({
            title: '信息',
            icon: <ExclamationCircleOutlined />,
            content: `确定要重置“${current.username}”的登录密码吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => roleApi.resetPassword(current.id).then(res => {
                message.success("密码重置成功，重置后的密码为：123456")
            }).catch(() => message.success("重置密码失败"))
        });
    }



    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '名称',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, current) => {
                return (
                    <Switch checkedChildren="正常" unCheckedChildren="锁定" checked={value === 0} onChange={(e) => handleChangeState(e, current)} />
                )
            }
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
                        <PermissionsButton permission={"Account:Update"}>
                            <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"Account:Delete"}>
                            <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"Account:Reset"}>
                            <CustomButton type='warning' onClick={() => onResetPassword(record)}>重置密码</CustomButton>
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
        name: "",
        key: '',
        state: -1
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');

    const [permissionVisible, setPermissionVisible] = useState(false);

    const [current, setCurrent] = useState({});

    const getList = () => {

        let newObj: any = {}

        if (searchKeys.key && searchKeys.name) {
            newObj[searchKeys.key] = searchKeys.name
        }

        if (searchKeys.state && searchKeys.state !== -1) {
            newObj.state = searchKeys.state
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

        if (values.roles && values.roles.length) {
            // values.roleIds = values.roles.map(item => item.id).join(',')
            values.roleIds = values.roles.map(item => item.id).join(",")
            delete values.roles;
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
            <div>
                <Select
                    style={{ width: 200 }}
                    placeholder="请选择要输入内容"
                    onChange={(value) => {
                        setSearchKeys({
                            ...searchKeys,
                            key: value
                        })
                    }}
                    value={searchKeys.key}
                >
                    <Option value="">请输入要搜索内容</Option>
                    <Option value="account">用户名</Option>
                    <Option value="username">姓名</Option>
                    <Option value="phone">手机号</Option>
                </Select>
            </div>
            <div>
                <Input placeholder={"请输入要搜索的内容"} onChange={handleChange('name')} />
            </div>
            <div>
                <Select
                    style={{ width: 200 }}
                    placeholder="请选择要输入内容"
                    onChange={(value) => {
                        setSearchKeys({
                            ...searchKeys,
                            state: value
                        })
                    }}
                    value={searchKeys.state}
                >
                    <Option value={-1}>状态</Option>
                    <Option value={0}>正常</Option>
                    <Option value={1}>锁定</Option>
                </Select>
            </div>
        </>
    )

    const onEditItem = (current) => {
        setVisible(true);
        setModalType('edit')
        setCurrent(current)
 

        form.setFieldsValue({
            username: current.username,
            account: current.account,
            password: current.password,
            phone: current.phone,
            email: current.email,
            roles: current.roleIds?.split(',').map(item => Number(item))
        })
    }

    return (
        <div>

            <Card>
                <PermissionTree
                    visible={permissionVisible}
                    clickCancel={() => setPermissionVisible(false)}
                />

                <CustomTable
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    onTableChange={handleTableChange}
                    onAdd={handleShowVisible}
                    onDelete={handleDeleteRoles}
                    customAddButtonText={"添加管理员"}
                    customDeleteButtonText={"删除管理员"}
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={"Account"}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'管理员'}
                    type={modalType}
                    size="small"
                    clickCancel={() => setVisible(false)}
                    afterClose={() => form.resetFields()}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        {...layout}
                    >
                        <Form.Item
                            label="账号"
                            name="account"
                            rules={[{ required: true, message: '账号必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '密码必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="姓名"
                            name="username"
                            rules={[{ required: true, message: '姓名必填!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="手机号"
                            name="phone"

                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="角色"
                            name="roles"
                            rules={[{ required: true, message: '角色必选!' }]}
                        >
                            <RoleSelect />
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