import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import RoleSelect from '@/components/RoleSelect';
import UserTypeSelect from '@/components/UserTypeSelect';
import roleApi from '@/api/user/utype'
import { Space, Form, Card, Input, Tag, Button, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';
import useExpandedKeys from '@/hooks/useExpandedKeys'; 
import useWindowResize from '@/hooks/useWindowResize';
const { Option } = Select;

const Index = () => {

    const [form] = Form.useForm(); 

    const [customHeight]=useWindowResize(140);

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '标签名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {

                const hasChildren = record.children && record.children.length;

                return hasChildren ? <span style={{ marginLeft: 10 }}>
                    <FolderOutlined style={{ marginRight: 10 }} /><span>{text}</span>
                </span> : <span style={{ marginLeft: 10 }}>
                    <FileOutlined style={{ marginRight: 10 }} /><span>{text}</span>
                </span>
            }
        },
        {
            title: '排序号',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '角色',
            dataIndex: 'roleNames',
            key: 'roleNames',
            render: (value, current) => {
                return value?.split(",")?.map(role => (
                    <Tag color="volcano-inverse">{role}</Tag>
                ))
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',
        },
        // {
        //     title: '状态',
        //     dataIndex: 'state',
        //     key: 'state',
        //     render: (value, current) => {
        //         return (
        //             <Switch checkedChildren="正常" unCheckedChildren="锁定" checked={value === 0} onChange={(e) => handleChangeState(e, current)} />
        //         )
        //     }
        // },
        // {
        //     title: '创建时间',
        //     dataIndex: 'createTimeStr',
        //     key: 'createTimeStr',
        // },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <PermissionsButton permission={"UType:Update"}>
                            <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"UType:Delete"}>
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

        roleApi.tree(newObj).then((res: any) => { 
            setDataSource(res)

        })
    }

    useEffect(() => {
        getList()
    }, [pagination.current, pagination.pageSize]);

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add');
        form.resetFields();
    }

    const onFinish = (values: any) => { 
        if (values.roles && values.roles.length) {
            values.roleIds = values.roles.map(item => item.id).join(',')
            values.roleNames = values.roles.map(item => item.name).join(",")
            delete values.roles;
        }
        if (!values.pid) {
            delete values.pid;
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
            pid: current.pid,
            name: current.name,
            sort: current.sort,
            roles: current.roleIds?.split(',').map(item => Number(item))
        })
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

    }

    const tableTopComponent = (
        <>
            {/* <div>
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
                    <Option value="code">编号</Option>
                    <Option value="name">公司名称</Option> 
                </Select>
            </div> */}
            <div>
                类型名称
            </div>
            <div>
                <Input placeholder={"输入类型名称"} onChange={handleChange('name')} />
            </div>
            {/* <div>
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
                    <Option value={0}>未绑定</Option>
                    <Option value={1}>已绑定</Option> 
                </Select>
            </div> */}
        </>
    )



    const [expandedKeys, setExpandedKeys] = useExpandedKeys(dataSource);

    const onClickExpand = (expand, current) => {
        const newExpandedKeys = expandedKeys;
        const index = expandedKeys.indexOf(current.id);
        if (!expand) {
            //缩小
            newExpandedKeys.splice(index, 1);
        } else {
            newExpandedKeys.push(current.id);
        }
        setExpandedKeys(newExpandedKeys);
    }

    return (
        <div style={{height:customHeight,overflow:'auto'}}>

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
                    hasDeleteButton={false}
                    noselection
                    expandIconColumnIndex={1}
                    expandedKeys={expandedKeys}
                    onClickExpand={onClickExpand}
                    renderRight={false}
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={"UType"}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'类型'}
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
                            label="上级类型"
                            name="pid"
                        >
                            <UserTypeSelect />
                        </Form.Item>

                        <Form.Item
                            label="类型名称"
                            name="name"
                            rules={[{ required: true, message: '类型名称必填!' }]}
                        >
                            <Input placeholder={"请输入类型名称"} />
                        </Form.Item>

                        <Form.Item
                            label="排序号"
                            name="sort"
                        >
                            <InputNumber style={{ width: '100%' }} placeholder={"请输入排序号"} />
                        </Form.Item>

                        <Form.Item
                            label="角色"
                            name="roles"
                            rules={[{ required: true, message: '角色必填!' }]}
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