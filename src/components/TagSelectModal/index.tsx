import React, { useEffect, useState } from 'react';
import { Tag, Space, Button,Input } from 'antd';

import CustomModal from '@/components/CustomModal';
import roleApi from '@/api/system/label';
import styles from './index.module.less';

const { CheckableTag } = Tag

const TagSelectModal = React.forwardRef((props: any, ref: any) => {

    const {
        selectedTags,
        customTitle,
        hasSearch=false,
        inputValue
    } = props;

    const [list, setList] = useState([]);
 

    useEffect(() => {
        roleApi.tree().then(res => { 
            setList(res)
        })
    }, [])
 

    return (
        <CustomModal
            visible={props.visible}
            customTitle={customTitle ? customTitle : "选择标签"}
            size="big"
            clickCancel={props?.onCancel}
        >
            {
                list.map((i) => {

                    return (
                        <div className={styles.group} key={i.name}>
                            <div className={styles.groupName}>
                                {i.name}
                            </div>
                            <div className={styles.groupTag}>
                                {
                                    i.children.map(c => (

                                        <CheckableTag
                                            key={c.name}
                                            checked={selectedTags.indexOf(c.name) > -1}
                                            onChange={checked => props?.onChange(c.name, checked)}
                                        >
                                            {c.name}
                                        </CheckableTag>
                                    ))
                                }
                            </div>
                        </div>
                    )
                })
            }
            <Space align="end" style={{ marginTop: 10, width: '100%', display: 'flex',alignItems:'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex',alignItems:'center', justifyContent: 'center' }}>
                    {
                        hasSearch && <><div style={{width:80,flexShrink:0}}>{"关键字："}</div><Input value={inputValue} onChange={props?.changeInput} placeholder={"请输入关键字"} /></>
                    }
                </div>
                <div>
                    <Space>
                        <Button type="primary" onClick={props?.onSave} >
                            保存
                            </Button>
                        <Button type="default" onClick={props?.onCancel} >
                            取消
                            </Button>
                    </Space>
                </div>

            </Space>
        </CustomModal>
    )
})

export default TagSelectModal;