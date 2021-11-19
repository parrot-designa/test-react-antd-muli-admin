import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import { showImage } from '@/utils/getSuccessUrl';
import roleApi from '@/api/system/advert'
import { Space, Form, Input,InputNumber,Select, Card, Button, Modal, Switch } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import ResourceUploader from '@/components/ResourceUploader';
import CarouselImage from '@/components/CarouselImage';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PermissionsButton from '@/components/PermissionsButton';

const Option=Select.Option;

const Index = () => {

    const [form] = Form.useForm();


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

    const handleClickCal=(index)=>(e)=>{
        setImgVisible(true);
        setCurrentIndex(index)
    }

    const columns = [
        {
            title: '轮播图',
            dataIndex: 'image',
            key: 'image',
            width:'80%',
            render: (value, current,index) => {
                return (
                    <div style={{height:60,textAlign:'center'}} onClick={handleClickCal(index)}>
                        <img src={showImage(value)} style={{height:'100%',cursor:'pointer'}} />
                    </div>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value, current) => {
                return (
                    <Switch checkedChildren="上架" unCheckedChildren="下架" checked={value === 0} onChange={(e) => handleChangeState(e, current)} />
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <PermissionsButton permission={"Advert:Update"}>
                        <CustomButton type='default' onClick={() => onEditItem(record)} >修改</CustomButton>
                        </PermissionsButton>
                        <PermissionsButton permission={"Advert:Delete"}>
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

    const [dataSource, setDataSource] = useState([]);

    const [visible, setVisible] = useState(false);

    const [addLoading, setAddLoading] = useState(false);

    const [modalType, setModalType] = useState('add');
 

    const [current, setCurrent] = useState({});

    const getList = () => {
        roleApi.getAllList().then((res: any) => { 
            setDataSource(res) 
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
        if(values.image){
            values.image=values.image.successUrl
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
            image: current.image,
            sort: current.sort,
            state:current.state
        })
    }  

    const [imgVisible,setImgVisible]=useState(false);

    const [currentIndex,setCurrentIndex]=useState(0);

    const handleVisibleChange=(value,prevValue)=>{ 
        setImgVisible(value)
    } 

    return (
        <div>

            <CarouselImage imgList={dataSource} visible={imgVisible} onVisibleChange={handleVisibleChange} current={currentIndex} />

            <Card>
                <CustomTable
                    showTableTop={false}
                    showWhiteSpace={false}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    onTableChange={handleTableChange}
                    onAdd={handleShowVisible}
                    onDelete={handleDeleteRoles} 
                    permissonModule={"Advert"}
                >

                </CustomTable>

                <CustomModal
                    visible={visible}
                    title={''}
                    type={modalType}
                    size="big"
                    clickCancel={() => setVisible(false)}
                >
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        form={form}
                        {...layout}
                    >
                        <Form.Item
                            label="图片"
                            name="image"
                            rules={[{ required: true, message: '图片必传!' }]}
                        >
                            <ResourceUploader type={'image'} />
                        </Form.Item>

                      

                        <Form.Item
                            label="状态"
                            name="state"
                            rules={[{ required: true, message: '图片必传!' }]}
                        >
                            <Select 
                                style={{ width: '100%' }}     
                            >
                                <Option value={0}>上架</Option>
                                <Option value={1}>下架</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="排序号"
                            name="sort"
                        >
                            <InputNumber style={{ width: '100%' }} placeholder={"请输入排序号"} />
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