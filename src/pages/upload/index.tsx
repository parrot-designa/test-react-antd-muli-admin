import React, {useState, FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Upload, message, Button,Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import * as actions from '@/store/actions'  
import AliUpload from '@/hooks/AliUpload';
import AliDownload from '@/hooks/AliDownload';

interface Props extends ReduxProps { }

const UploadPage: FC<Props> = ({ storeData: { userInfo }, setStoreData }) => {

    const customRequestFunc = (params) => {
        uploadFn(params)
    }

    const [uploadPercent,setUploadPercent]=useState<undefined|number>(undefined);
    const [downloadUrl,setDownloadUrl]=useState<string>('');

    const uploadFn = (param: CommonObjectType): void => {
 
        // 上传中
        const progressFn = (p: number) => { 
            // 上传进度发生变化时调用param.progress
            setUploadPercent(p*100);
        }

        const successFn = (resSuccess: CommonObjectType,url:string) => {  
            message.destroy()
            message.success({ content: '上传成功!', key: 'updatable', duration: 2 })
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            setDownloadUrl(url)
            param.onSuccess({
                url: url, 
            })
        }

        const errorFn = (err: string) => { 
            message.destroy()
            message.error('上传失败')
            // 上传发生错误时调用param.error
            param.onError({
                msg: err
            })
        }


        AliUpload(progressFn, param.file,param.file.type)
            .then((res: CommonObjectType) => {   
                successFn(res,res.customUrl)
            })
            .catch(errorFn)

        return

    }


    const props = {
        name: 'file',
        customRequest: customRequestFunc,
        headers: {
            authorization: 'authorization-text',
        },
        progress:{
            showInfo:true
        },
        onChange(info) {
            if (info.file.status !== 'uploading') { 
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const download=async ()=>{
        const url=await AliDownload(downloadUrl); 
        window.open(url);
    }

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                {typeof uploadPercent==="number" && <Progress percent={uploadPercent} />}
            </Upload>
            { downloadUrl && <Button onClick={()=>download()}>下载{downloadUrl}</Button>}
        </>
    )

}

export default connect(
    (state) => state,
    actions
)(UploadPage)
