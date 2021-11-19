import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import UserTypeSelect from '@/components/UserTypeSelect';
import UserTypeTreeSelect from '@/components/UserTypeTreeSelect';
import roleApi from '@/api/user/manager'
import { Space, Card, Form, Input, Button, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';
import useWindowResize from '@/hooks/useWindowResize';
const { Option } = Select;


const Index = () => {

    const [form] = Form.useForm();

    const [customHeight]=useWindowResize(380);

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
            }).catch(() => message.error("重置密码失败"))
        });
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'sort',
            key: 'sort',
            render:(text,record)=>{  
                return <div>{text}</div>
            }
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '名称',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '类型',
            dataIndex: 'typeName',
            key: 'typeName',
        },
        {
            title: '公司名称',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: '创建时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, current) => {
                //0-正常  1-锁定
                return (
                    <Switch checkedChildren="正常" unCheckedChildren="锁定" checked={value === 0} onChange={(e) => handleChangeState(e, current)} />
                )
            }
        },

        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <PermissionsButton permission={"User:Update"}>
                            <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"User:Delete"}>
                        <CustomButton type='delete' onClick={() => onDeleteItem(record)}>删除</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"User:Reset"}>
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
        state: -1,
        cId:''
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');

    const [permissionVisible, setPermissionVisible] = useState(false);

    const [current, setCurrent] = useState({});

    const getList = () => {
        const newObj:any={}

        if(searchKeys.key && searchKeys.name){
            newObj[searchKeys.key]=searchKeys.name;
        }

        if(searchKeys.state && searchKeys.state!==-1){
            newObj.state=searchKeys.state;
        }

        if(searchKeys.cId){
            newObj.userTypeId=searchKeys.cId;
        }

        roleApi.getList({
            page: pagination.current,
            size: pagination.pageSize,
            ...newObj
        }).then((res: any) => { 
            const { records, total } = res;
            setDataSource(records.map((item,index)=>({
                ...item,
               //sort:(pagination.current-1)*(pagination.pageSize)+index+1
               sort:total-(pagination.current-1)*(pagination.pageSize)-index
            })))
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
        form.resetFields()
        setVisible(true);
        setModalType('add')
    }

    const onFinish = (values: any) => { 
        if (!values?.userTypeId?.isLevelOne) {
            values.company = values?.userTypeId?.company
        }
        if (values?.userTypeId?.id) {
            values.userTypeId = values?.userTypeId?.id
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

    const onEditItem = (current) => {
        setVisible(true);
        setModalType('edit')
        setCurrent(current)
        form.setFieldsValue({
            username: current.username,
            phone: current.phone,
            password: current.password,
            email: current.email,
            userTypeId: current.user_type_id,
            code:current.code
        })
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
                    <Option value="username">姓名</Option> 
                    <Option value="phone">手机号</Option>
                    <Option value="company">公司名称</Option>
                    <Option value="code">经销商编码</Option>
                </Select>
            </div>
            <div>
                <Input placeholder={"请输入要搜索的内容"} value={searchKeys.name} onChange={(value) => {
                        setSearchKeys({
                            ...searchKeys,
                            name: value.target.value
                        })
                    }} />
            </div>
            <div>  
                <UserTypeSelect onChange={(value) => { 
                        setSearchKeys({
                            ...searchKeys,
                            cId: value
                        })
                    }} />  
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

    const [isVisibleCode, setVisibleCode] = useState(false);

    const handleValueChange = (value, record) => {  
        if (record?.userTypeId?.id===75) {
            setVisibleCode(true)
        } else {
            setVisibleCode(false)
        }
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
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={"User"}
                    scroll={
                        {
                            y:customHeight
                        }
                    } 
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'用户'}
                    type={modalType}
                    size="small"
                    clickCancel={() => setVisible(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={handleValueChange}
                        {...layout}
                    >
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
                            rules={[{ required: true, message: '手机号必填!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>


                        <Form.Item
                            label="密码"
                            name="password"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="类型"
                            name="userTypeId"
                            rules={[{ required: true, message: '类型必填!' }]}
                        >
                            <UserTypeTreeSelect />
                        </Form.Item>

                        {isVisibleCode && <Form.Item
                            label="经销商代码"
                            name="code"
                        >
                            <Input placeholder={"请输入经销商代码"} />
                        </Form.Item>}

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