import React, { useEffect, useState } from 'react';
import { Modal, message, Tree, Space, Button } from 'antd';
import roleApi from '@/api/permissions/role'
const { DirectoryTree } = Tree;

const PermissionTree = React.forwardRef((props: any, ref: any) => {

    const { visible, title = '角色权限分配', children, roleId, size = "small", clickCancel } = props;

    const [treeData, setTreeData] = useState([]);

    const [value, setValue] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            roleApi.getCurrentRolePermission().then(res => {
                setTreeData(res);
            }).catch(e => {
                message.error("权限树获取失败")
            })
        }
    }, [visible])

    useEffect(() => {
        if (roleId) {
            roleApi.getCurrentRoleList({ roleId }).then(res => {
                setValue(res)
            }).catch(e => {
                message.error("权限树获取失败")
            })
        }
    }, [roleId])

    const handleChangeCheck = (checkedKeys, e) => {
        setValue(checkedKeys);
    }

    const handleSave = () => {
        setLoading(true);
        const functionIds = value.filter(item => item.includes("f_")).map(item => item.replace("f_", "")).join(",")
        roleApi.editRole({
            roleId,
            functionIds
        }).then(res => {
            setLoading(false);
            clickCancel()
        }).catch(err => {
            setLoading(false);
        })
    }

    return (
        <>
            <Modal
                footer={null}
                visible={visible}
                title={title}
                width={size === 'small' ? 400 : 520}
                onCancel={clickCancel}
                maskClosable={false}
            >
                <Tree
                    checkable
                    treeData={treeData}
                    checkedKeys={value}
                    onCheck={handleChangeCheck}
                />
                <div style={{ justifyContent: 'flex-end', display: 'flex', marginTop: 20 }}>
                    <Space align="end">
                        <Button type="primary" loading={loading} onClick={handleSave} >
                            保存
                    </Button>
                        <Button type="default" onClick={clickCancel} >
                            取消
                    </Button>
                    </Space>
                </div>
            </Modal>
        </>
    )
})

export default PermissionTree;