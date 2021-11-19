import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree'; 
import roleApi from '@/api/system/code'
import { Space, Form, Card, Input, Button, Modal, Switch, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import useWindowResize from '@/hooks/useWindowResize';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';
const { Option } = Select;


const Index = () => {

    const [form] = Form.useForm();

    const [customHeight]=useWindowResize(400);

    const handleChangeState = (e, current) => { 
        roleApi.edit({ 
            id: (current as any).id,
            state: e ? 1 : 0
        }).then(res => {

            getList();
        }).catch((e) => {
        })
    }

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '大区名称',
            dataIndex: 'regions',
            key: 'regions',
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '公司名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '省',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: '市',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, current) => {
                return (
                    <Switch checkedChildren="已绑定" unCheckedChildren="未绑定" checked={value === 1} onChange={(e) => handleChangeState(e, current)} />
                )
            }
        },
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
                        <PermissionsButton permission={"Code:Update"}>
                            <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"Code:Delete"}>
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

        if (searchKeys.name) {
            if (searchKeys.key === 'name') {
                newObj.name = searchKeys.name
            }
            if (searchKeys.key === 'code') {
                newObj.code = searchKeys.name
            }
        }

        if (searchKeys.state === 0 || searchKeys.state === 1) {
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
        setModalType('add');
        form.resetFields();
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

    const onEditItem = (current) => {
        setVisible(true);
        setModalType('edit')
        setCurrent(current)
        form.setFieldsValue({
            name: current.name,
            regions: current.regions,
            code: current.code,
            type: current.type,
            province: current.province,
            city: current.city,

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
                    <Option value="code">编号</Option>
                    <Option value="name">公司名称</Option>
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
                    <Option value={0}>未绑定</Option>
                    <Option value={1}>已绑定</Option>
                </Select>
            </div>
        </>
    )

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
                    scroll={
                        {
                            y:customHeight
                        }
                    } 
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
                    permissonModule={'Code'}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={'经销商编码'}
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
                            label="大区"
                            name="regions"
                        >
                            <Input placeholder={"请输入大区名称"} />
                        </Form.Item>

                        <Form.Item
                            label="网点编码"
                            name="code"
                            rules={[{ required: true, message: '网点编码必填!' }]}
                        >
                            <Input placeholder={"请输入网点编码"} />
                        </Form.Item>

                        <Form.Item
                            label="网点名称"
                            name="name"
                        >
                            <Input placeholder={"请输入网点名称"} />
                        </Form.Item>

                        <Form.Item
                            label="网点类型"
                            name="type"

                        >
                            <Input placeholder={"请输入网点类型"} />
                        </Form.Item>

                        <Form.Item
                            label="省份"
                            name="province"
                        >
                            <Input placeholder={"请输入省份"} />
                        </Form.Item>

                        <Form.Item
                            label="地级市"
                            name="city"
                        >
                            <Input placeholder={"请输入地级市"} />
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