import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import roleApi from '@/api/file/favorite'
import { Space, Form, Input, Button, Modal, Card } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import FileTypeImage from '@/components/FileTypeImage';
import ActionButton from '@/components/ActionButton';

const Index = () => {

    const [form] = Form.useForm();

    const columns = [

        {
            title: '文件名称',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (current, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FileTypeImage fileType={record.fileType} />
                        <span>{current}</span>
                    </div>
                )
            }
        },
        {
            title: '文件名称',
            dataIndex: 'fileType',
            key: 'fileType',
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
            render: (current, record) => {
                return (
                    <span>{current}MB</span>
                )
            }
        },
        {
            title: '下载次数',
            dataIndex: 'downloadCount',
            key: 'downloadCount',
            render: (current, record) => {
                return (
                    <span>{current}次</span>
                )
            }
        },
        {
            title: '上传日期',
            dataIndex: 'createTimeStr',
            key: 'createTimeStr',

        },
        {
            title: '下载',
            dataIndex: 'download',
            key: 'download',
            align: 'center',
            render: () => {
                return <ActionButton />
            }
        },
        {
            title: '分享',
            dataIndex: 'share',
            key: 'share',
            align: 'center',
            render: () => {
                return <ActionButton type="copy" />
            }
        },
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
        let newObj:any={};
        if(searchKeys.name){
            newObj.searchKeys=searchKeys.name
        }
        roleApi.getList({
            page: pagination.current,
            size: pagination.pageSize,
            searchKey: searchKeys.name
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
            <div><Input onChange={handleChange('name')} value={searchKeys.name} placeholder={"输入文件名称"}/></div>
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
                    hasAddButton={false}
                    customDeleteButtonText={"删除记录"}
                    tableTopProps={{
                        search: true,
                        onSearch: handleSearchKeys,
                        children: <>
                            {tableTopComponent}
                        </>
                    }}
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