import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import TagSelectModal from '@/components/TagSelectModal';
import { Tag } from 'antd';

const TagInput = (props) => {

    const [visible, setVisible] = useState(false);

    const [selectedTags, setSelectedTags] = useState([]);

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
        setVisible(false)
        props?.onChange?.(selectedTags)
    }

    useEffect(()=>{
        setSelectedTags(
            (props.value||[])
        )
        props?.onChange?.(props.value||[])
    },[props.value])

    return (
        <>
            {
                props?.value && props?.value?.length > 0 ?
                    props?.value.map(tag => (<Tag color="success" key={tag} onClick={() => setVisible(true)}>{tag}</Tag>))
                    : <div className={styles.tagInput}>
                        <div onClick={() => setVisible(true)}>选择标签</div>
                    </div>
            }
            <TagSelectModal
                visible={visible}
                onCancel={() => setVisible(false)}
                selectedTags={selectedTags}
                onChange={handleChangeTag}
                onSave={handleSave}
            />
        </>
    )
}

export default TagInput;