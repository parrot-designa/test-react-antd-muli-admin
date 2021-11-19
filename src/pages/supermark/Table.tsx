//@ts-nocheck 
import React, { useEffect, useState, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import TagInput from '@/components/TagInput';
import CustomModal from '@/components/CustomModal';
import PermissionTree from '@/components/PermissionTree';
import roleApi from '@/api/resource/index'
import { Space, Form, Input, Button, Typography,Tooltip, DatePicker } from 'antd';
import { useHistory } from 'react-router-dom'
import { layout, tailLayout } from '@/utils/layout'
import TagSelectModal from '@/components/TagSelectModal';
import FileTypeImage from '@/components/FileTypeImage';
import ResourceUploader from '@/components/ResourceUploader'; 
import CustomTagInput from '@/components/CustomTagInput';
import CustomOssUploader from '@/components/CustomOssUploader';
import ResourceTreeSelect from '@/components/ResourceTreeSelect';
import editFileType from '@/utils/editFileType'
import { kbToMd } from '@/utils/tranformSize';
import useWindowResize from '@/hooks/useWindowResize';
import styles from './index.module.less';

const { Paragraph } = Typography;

const dateFormat = 'YYYY-MM-DD';

const Index = (props) => {

    const [form] = Form.useForm();
    const [form2] = Form.useForm();

    const history = useHistory()  

    const handleShowFile=(record)=>(e)=>{ 
        history.push({
            pathname:`/fileDetail`,  
            search:`fileId=${record.id}&fileName=${record.title}`
        })
    }

    const [customHeight]=useWindowResize(360);

    const columns = [

        {
            title: '文件名称',
            dataIndex: 'title',
            key: 'title', 
            width:'30%',
            render: (current, record) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }} onDoubleClick={handleShowFile(record)}>
                        <FileTypeImage fileType={record.fileType} />
                        <div style={{whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}}>
                            <Tooltip title={current}>
                                {current} 
                            </Tooltip>
                        </div>  
                    </div>
                )
            }
        },
        {
            title: '文件类型',
            dataIndex: 'fileType',
            key: 'fileType',
            render: (current, record) => {
                return (
                    <div> 
                        {editFileType(current,record)}
                    </div>
                )
            }
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
            key: 'fileSize',
            render: (current, record) => {
                return (
                    <span>{kbToMd(current)}</span>
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
            width:'15%',
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

    const [shearIds,setShearIds]=useState([]);

    const [selectedTags,setSelectedTags]=useState([]);

    const getList = () => {
        let newObj: any = {}
        if (props.foldId) {
            newObj.folderId = props.foldId
        }
        if (selectedTags) {
            newObj.labels = selectedTags.join(',')
        }
        if (tagInputValue) {
            newObj.searchKey = tagInputValue
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
    }, [pagination.current, pagination.pageSize, props.foldId]);

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add')
    }

    const onFinish = (values: any) => { 
       
        let newObj: any = {};
        if (values.title) {
            newObj.title = values.title
        }
        if (values.customLabels || values.label) {
            newObj.fileLabel = (values.customLabels || []).concat(values.label || []).join(",")
        }
        if (values.desc) {
            newObj.fileDesc = values.desc
        }
        if (values.imgs) {
            newObj.fileCover = values.imgs.join(',')
        }
        if (values.youxiaoDate) {
            newObj.periodValidity = values.youxiaoDate.format(dateFormat)
        } 
        if (values.file) {
            newObj.fileName = values.file.name;
            newObj.filePath = values.file.successUrl;
            newObj.fileSize = values.file.size;
            newObj.fileType = values.file.type;
        }
        if (props.foldId) {
            newObj.folderId = props.foldId
        }

       

        setAddLoading(true);
        if (modalType === 'add') {
            roleApi.add(newObj).then(res => {
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

    const onFinish2 = (values: any) => { 
        roleApi.move({
            folderId:values.targetFolder,
            ids:shearIds.join(",")
        }).then(res=>{
            setShearVisible(false);
            getList();
        })
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
            <div>角色名:</div>
            <div><Input onChange={handleChange('name')} value={searchKeys.name} /></div>
        </>
    )

    const [selectVisible,setSelectVisible]=useState(false);
 

    const handleChangeTag = (name, checked) => {
        if (checked) {
            setSelectedTags(
                [...selectedTags, name]
            )
        } else {
            setSelectedTags(
                selectedTags.filter(item => item !== name)
            )
        }
    }

    const handleSave = () => {
        setSelectVisible(false)
        getList();
        // props?.onChange?.(selectedTags)
    }

    const [tagInputValue,setTagInputValue]=useState();

    const handleChangeInput=(e)=>{
        setTagInputValue(e.target.value)
    }

    const [shearVisible,setShearVisible]=useState(false);
 
    const handleShowShear=(shearIds)=>{
        setShearVisible(true)
        setShearIds(shearIds);
    }

    const handleFieldsChange=(changedFields,allFields)=>{ 
        if(changedFields[0]?.name?.[0]==='file'){
            form.setFieldsValue({ 
                title:changedFields[0]?.value?.name?.split('.')?.[0]
            })
        }
    }

  
    return (
        <div style={{ padding: 20 }} className={styles.table}>


            <TagSelectModal
                visible={selectVisible}
                onCancel={() => setSelectVisible(false)}
                selectedTags={selectedTags}
                customTitle={"标签搜索"}
                onChange={handleChangeTag}
                onSave={handleSave}
                hasSearch={true}
                inputValue={tagInputValue}
                changeInput={handleChangeInput}
            />
            
            <PermissionTree
                visible={permissionVisible}
                clickCancel={() => setPermissionVisible(false)}
            />

            <CustomTable
                printModule={"resource"}
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                onTableChange={handleTableChange}
                showTableTop={false}
                showWhiteSpace={false}
                onAdd={handleShowVisible}
                onDelete={handleDeleteRoles}
                customDeleteButtonText={"删除"}
                customAddButtonText={"上传"}
                onShear={handleShowShear}
                hasAddButton={sessionStorage.getItem('CURRENTTYPEID')!=75}
                hasShearButton={sessionStorage.getItem('CURRENTTYPEID')!=75}
                hasSearchButton
                permissonModule={'Resource'}
                fileTypeTable
                onLeftSearch={()=>setSelectVisible(true)}
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
            >

            </CustomTable>

            <CustomModal
                customTitle={"移到指定的文件夹里"}
                visible={shearVisible}
                size="default"
                clickCancel={() => setShearVisible(false)}
            >
                <Form
                    name="basic"
                    onFinish={onFinish2}
                    onFieldsChange={handleFieldsChange}
                    form={form2}
                    {...layout}
                >
                    <Form.Item
                        label="目标文件夹"
                        name="targetFolder"
                        rules={[{ required: true, message: '目标文件夹必填!' }]}
                    >
                        <ResourceTreeSelect />
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

            <CustomModal
                visible={visible} 
                customTitle={"上传文件"}
                type={modalType}
                size="big"
                clickCancel={() => setVisible(false)}
                afterClose={()=>form.resetFields()}
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    onFieldsChange={handleFieldsChange}
                    form={form}
                    {...layout}
                >
                    <Form.Item
                        label="文件标题"
                        name="title"
                        rules={[{ required: true, message: '文件标题必填!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="上传" name={"file"} rules={[{ required: true, message: '上传文件必填!' }]}>
                        <ResourceUploader />
                    </Form.Item>

                    <Form.Item
                        label="标签选择"
                        name="label"
                    >
                        <TagInput />
                    </Form.Item>

                    <Form.Item
                        label="自定义标签"
                        name="customLabels"
                    >
                        <CustomTagInput />
                    </Form.Item>

                    <Form.Item
                        label="有效日期"
                        name="youxiaoDate"
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item
                        label="缩略图"
                        name="imgs"
                    >
                        <CustomOssUploader  type="add" special={true} />
                    </Form.Item>


                    {/* <Form.Item
                        label="授权文件"
                        name="authfile" 
                    >
                        <AuthorizationFile   /> 
                    </Form.Item> */}

                    <Form.Item
                        label="文件描述"
                        name="desc"
                    >
                        <Input />
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
        </div>
    )
}

export default Index;