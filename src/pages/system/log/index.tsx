import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal'; 
import roleApi from '@/api/system/log'
import { Space, Form, Input, Card, Modal, DatePicker, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import PermissionsButton from '@/components/PermissionsButton';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const Index = () => {

    const [form] = Form.useForm();

    const [tableLoading, setTableLoading] = useState(false);

    const handleChangeState = (e, current) => { 
        roleApi.edit({
            ...current,
            id: (current as any).id,
            state: e ? 0 : 1
        }).then(res => {

            getList();
        }).catch((e) => {
        })
    }

    const columns = [
        {
            title: '用户名',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '请求类型',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
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
                        <PermissionsButton permission={"SystemLog:Get"}>
                            <CustomButton type='default' onClick={() => onViewItem(record)} >查看</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"SystemLog:Delete"}> 
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
        searchAccount: "",
        searchDate: undefined
    })

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');


    const [current, setCurrent] = useState({});

    const getList = () => {
        let newObj: any = {}
        if (searchKeys.searchAccount) {
            newObj.searchAccount = searchKeys.searchAccount
        } 
        if (searchKeys.searchDate) {
            newObj.searchDate = `${searchKeys.searchDate[0].format(dateFormat)}-${searchKeys.searchDate[1].format(dateFormat)}`
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
        if (key === 'Account') {
            setSearchKeys({
                ...searchKeys,
                searchAccount: e.target.value
            })
        } else if (key === 'Ranger') { 
            setSearchKeys({
                ...searchKeys,
                searchDate: e
            })
        }
    }

    const handleSearchKeys = () => {
        getList();
    }

    const tableTopComponent = (
        <>
            <div>
                用户账号
            </div>
            <div>
                <Input placeholder={"输入账号"} value={searchKeys.searchAccount} onChange={handleChange('Account')} />
            </div>
            <div>
                登录日期
            </div>
            <div>
                <RangePicker value={searchKeys.searchDate} onChange={handleChange('Ranger')} />
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
                    permissonModule={'SystemLog'}
                    title={false}
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