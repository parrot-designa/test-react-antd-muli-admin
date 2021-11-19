//@ts-nocheck
import React, { useState } from 'react';
import { Modal, Upload, message, Button, Image, Space, Progress, Typography } from 'antd';
import { kbToMd } from '@/utils/tranformSize';
import style from "./index.module.less";
import fileToBase64 from '@/utils/fileToBase64'
import {
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import AliUpload from '@/hooks/AliUpload';
import { isImage, getUrl, getImageUrl, whereType } from '@/utils/getSuccessUrl'

const { Dragger } = Upload;
const { Text } = Typography;

const CustomUploader = React.forwardRef((props: any, ref) => {

    const {
        accept = ['jpg', 'jpeg', 'png', 'gif'],
        //上传文件最大5M
        size = 5,
        multiple = true,
        //上传文件最大为5个
        max = 5,
        visible,
        successUploader = () => { },
        onCancel = () => { },
        extraAccept = []
    } = props;

    const [fileList, setFileList] = useState([]);

    React.useImperativeHandle(ref, () => ({
        fileList
    }), [fileList]);

    const handleRequest = async ({ file, filename }) => {

        const type = whereType(file);

        const isType = accept.concat(extraAccept).some((item: string) => file.type.includes(item) || file.name.includes(item))

        const isSize = file.size / 1024 / 1024 / 1024 < size

        if (!isType || !isSize) {
            message.error('请上传正确文件')
            return false
        }

        let base64Url;

        if (file.size < 1024 * 1024 * 100) {
            base64Url = await fileToBase64(file);
            console.log("====base64Url====",base64Url)
        } else {
            base64Url = undefined;
        }


        setFileList((oldFileList) => {
            const hasFile = oldFileList.filter(item => item.name === file.name);

            if (hasFile.length) {
                message.error(`无法选择重复的图片！`)
                return oldFileList;
            }
            if (oldFileList.length === 5) {
                message.error(`超出最大上传文件数，最大上传文件数为${max}`)
                return oldFileList;
            } else {
                return [
                    ...oldFileList,
                    {
                        name: file.name,
                        filename,
                        base64Url,
                        file: file,
                        size: file.size,
                        type: file.type || type,
                        uploadProgress: 0
                    }
                ]
            }
        })

    }

    const uploadProps = {
        name: 'file',
        multiple,
        customRequest: handleRequest,
        showUploadList: false,
    }

    const totalSize = fileList.reduce((total, current) => total + current.size, 0);

    const handleClickDelete = (e, current) => {
        e.preventDefault();
        e.stopPropagation();
        setFileList(fileList.filter(item => item.name !== current.name))
    }

    const successFn = async (resSuccess: CommonObjectType, url: string, itemA: any) => {
        const successUrl = resSuccess?.data?.res?.requestUrls?.[0];

        setFileList((oldFileList) => {
            let newFileList = JSON.parse(JSON.stringify(oldFileList));
            let newIndex = oldFileList.findIndex(item => item.name === itemA.name);
            newFileList.splice(newIndex, 1, {
                ...oldFileList[newIndex],
                successUrl: getUrl(oldFileList[newIndex].file, successUrl),
                visibleUrl: getImageUrl(oldFileList[newIndex].file, getUrl(oldFileList[newIndex].file, successUrl))
            });
            return newFileList;
        })
        message.destroy()
        message.success({ content: '上传成功!', key: 'updatable', duration: 2 })
    }

    const isAllSuccess = fileList.every(item => item.uploadProgress === 100)

    const handleUpload = () => {

        if (isAllSuccess) {
            message.warning("已经上传成功,无法继续上传！")
            return;
        }
        // 上传中
        const progressFn = (current) => (p: number, checkpoint: any) => {


            // 上传进度发生变化时调用param.progress 
            setFileList((oldFileList) => {
                let newFileList = JSON.parse(JSON.stringify(oldFileList));
                let newIndex = oldFileList.findIndex(item => item.name === current.name);
                newFileList.splice(newIndex, 1, {
                    ...oldFileList[newIndex],
                    uploadProgress: p * 100
                });
                return newFileList;
            })
        }

        try {
            fileList.filter(item => item.uploadProgress !== 100).forEach(async item => {
                const res = await AliUpload(
                    progressFn(item),
                    item.file,
                    isImage(item) ? item.type : `file/${item.type}`,
                    item.type)
                await successFn(res, res.customUrl, item)
                successUploader()
            })
        } catch (e) {
            message.destroy()
            message.success({ content: '您的网络有异常，上传失败!', key: 'updatable', duration: 2 })
        }

    }

    //是否有上传
    const isUpload = fileList.reduce((total, current) => total + current.uploadProgress, 0);

    const hasUploadLength = fileList.reduce((total, current) => {
        if (current.uploadProgress === 100) {
            return total + 1
        } else {
            return total;
        }
    }, 0);

    const handleMouseEnter = (fileName) => (e) => {
        const currentIndex = fileList.findIndex(item => item.name === fileName);
        if (currentIndex > -1) {
            fileList.splice(currentIndex, 1, { ...fileList[currentIndex], isHover: true });
            setFileList([...fileList])
        }
    }

    const handleMouseLeave = (fileName) => (e) => {
        const currentIndex = fileList.findIndex(item => item.name === fileName);
        if (currentIndex > -1) {
            fileList.splice(currentIndex, 1, { ...fileList[currentIndex], isHover: false });
            setFileList([...fileList])
        }
    }

    console.log('fileList', fileList)


    return (
        <Modal title="上传" visible={visible} maskClosable={false} footer={null} width={800} className={style.cardStyle} onCancel={onCancel}>
            {!fileList.length && <Dragger {...uploadProps} className={style.draggerStyle}>
                <div className={style.placeholder}></div>
                <div>
                    <Button type="primary">点击选择文件</Button>
                </div>
                <div className={style.text}>
                    可以将文件拖到这里
                </div>
            </Dragger>}
            {
                !!fileList.length && <div className={style.fileContainer}>
                    <div className={style.imgList}>
                        {fileList.map(item => {

                            return isImage(item.file) ? <div className={style.imgWrap} key={item.name}>
                                <Image.PreviewGroup>
                                    <Image
                                        height={110}
                                        width={110}
                                        src={item.base64Url}
                                    // key={item.name}
                                    // preview={{
                                    //     maskClassName: style.customMask,
                                    //     mask: (
                                    //         <div style={{position:'relative'}}>
                                    //             <Space direction="vertical" align="center">
                                    //                 <div><EyeOutlined /></div>
                                    //                 <div onClick={(e) => handleClickDelete(e, item)}><DeleteOutlined /></div>
                                    //             </Space> 
                                    //         </div>
                                    //     ),
                                    // }}
                                    ></Image>
                                </Image.PreviewGroup>
                                {!!item.uploadProgress && <Progress percent={item.uploadProgress.toFixed(0)} size="small" className={style.progress} />}
                            </div> : <div className={style.fileWrap} onMouseEnter={handleMouseEnter(item.name)} onMouseLeave={handleMouseLeave(item.name)} >
                                <div>{item.name}</div>
                                <div>此类型无法预览</div>

                                {
                                    item.isHover && <div className={style.hoverOverlay}>
                                        <div onClick={(e) => handleClickDelete(e, item)}><DeleteOutlined style={{ color: 'white', cursor: 'pointer' }} /></div>
                                    </div>
                                }
                                {!!item.uploadProgress && <Progress percent={item.uploadProgress.toFixed(0)} size="small" className={style.progress} />}
                            </div>
                        })}
                    </div>
                    <div className={style.bottomContainer}>
                        <div className={style.text}>
                            <div>选中<Text type="warning">{fileList.length}</Text>个文件，共{kbToMd(totalSize)}。</div>
                            {!!isUpload && <div>已上传<Text type="success">{hasUploadLength}</Text>个文件。</div>}
                        </div>
                        <div className={style.action}>
                            <Space>
                                <Upload {...uploadProps}>
                                    {fileList.length < max && <Button>继续添加</Button>}
                                </Upload>
                                <Button type="primary" onClick={handleUpload}>{isAllSuccess ? "上传成功" : "开始上传"}</Button>
                            </Space>
                        </div>
                    </div>
                </div>
            }
        </Modal>
    )
})

export default CustomUploader;