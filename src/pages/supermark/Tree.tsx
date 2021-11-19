import React, { useEffect,useState } from 'react';
import { Tree } from 'antd';
import styles from './index.module.less';
import Api from '@/api/system/rtype'
import useExpandedKeys from '@/hooks/useExpandedKeys';
import CustomButton from '@/components/CustomButton';
import CustomModal from '@/components/CustomModal';
import ResourceTreeSelect from '@/components/ResourceTreeSelect';
import { Space, Radio,Form, Input, Button, Modal, Switch, InputNumber, message, Select } from 'antd';
import { layout, tailLayout } from '@/utils/layout'
import UserTypeSelect from '@/components/UserTypeSelect';
import PermissionsButton from '@/components/PermissionsButton';

const aaa=[];

const TreePage=(props)=>{

    const [treeList,setTreeList]=useState([]);

    const [form] = Form.useForm();

    const getList=()=>{
        Api.tree().then(res=>{ 
            setTreeList(res)
        });
    }

    useEffect(()=>{
        getList()
    },[]);

    const transformTree = (treeData) => {


        return treeData.map(item => {
            if (item.children && item.children.length) {
                let childrens = transformTree(item.children);
                return ({
                    title: item.name,
                    key: item.id,
                    children: childrens
                })
            }
            return ({
                title: item.name,
                key: item.id
            })
        })
    }

    const renderTreeData = transformTree(treeList); 

    const [expandedKeys, setExpandedKeys] = useExpandedKeys(aaa); 

    const [visible, setVisible] = useState(false);

    const [modalType, setModalType] = useState('add');

    const handleShowVisible = () => {
        setVisible(true);
        setModalType('add');
        form.resetFields();
        form.setFieldsValue({
            readonly:false
        });
    }

    const onClickExpand=(expandedKeys,{expanded:expand,node:current})=>{  
        const newExpandedKeys=[...expandedKeys];
        const index=expandedKeys.indexOf(current.id);
        if(!expand){
            //缩小
            newExpandedKeys.splice(index,1);
        }else{
            newExpandedKeys.push(current.id);
        }
        setExpandedKeys(newExpandedKeys);
    }
 

    const [current, setCurrent] = useState({});

    const [addLoading, setAddLoading] = useState(false);

    const onFinish = (values: any) => { 
        if (values.roleNames && values.roleNames.length) {
            values.roleNames = values.roleNames.join(",")
        }
        setAddLoading(true);
        if (modalType === 'add') {
            Api.add(values).then(res => {
                setAddLoading(false);
                setVisible(false);
                getList();
            }).catch((e) => {
                setAddLoading(false);
            })
        } else {
            Api.edit({
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

    const selectedKeys=[props.foldId]

    

    return (
        <div className={styles.treeList}>
            <div className={styles.header}>
                <PermissionsButton permission="Folder:Save">
                    <CustomButton type="add"   addText={'新建文件夹'} onClick={()=>handleShowVisible()}></CustomButton>
                </PermissionsButton>
            </div>
            <div className={styles.cotent}>
                <Tree
                    showLine={true}
                    showIcon={true}  
                    blockNode 
                    treeData={renderTreeData}
                    expandedKeys={expandedKeys}
                    onExpand={onClickExpand}
                    selectedKeys={selectedKeys}
                    onSelect={props?.onSelect}
                />
            </div>
            <CustomModal
                visible={visible}
                title={'资源分类'}
                type={modalType}
                size="default"
                clickCancel={() => setVisible(false)}
               
            >
                <Form
                    name="basic"
                    onFinish={onFinish}
                    form={form}
                    {...layout}
                >
                    <Form.Item
                        label="上级"
                        name="pid"
                    >
                        <ResourceTreeSelect />
                    </Form.Item>

                    <Form.Item
                        label="名称"
                        name="name"
                        rules={[{ required: true, message: '文件名称必填!' }]}
                    >
                        <Input placeholder={"请输入文件名称"} />
                    </Form.Item>


                    <Form.Item
                        label="只读"
                        name="readonly"
                        rules={[{ required: true, message: '只读必填!' }]}
                    >
                        <Radio.Group >
                            <Radio value={true}>是</Radio> 
                            <Radio value={false}>否</Radio> 
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="可见组"
                        name="seeType"
                        rules={[{ required: false, message: '可见组必填!' }]}
                    >
                        <UserTypeSelect />
                    </Form.Item>

                    <Form.Item
                        label="描述"
                        name="folderDesc"
                    >
                        <Input.TextArea placeholder={"请输入你的文件夹描述"} />
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


export default TreePage;