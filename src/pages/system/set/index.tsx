import React, { useEffect, useRef, useState } from 'react';
import style from './index.module.less';
import CustomUploader from '@/components/CustomUploader/index';
import CustomImage from '@/components/CustomImage/index';
import Api from '@/api/system/set';
import Api2 from '@/api/global/auth';
import useWindowResize from '@/hooks/useWindowResize';
import PermissionsButton from '@/components/PermissionsButton';
import { Card } from 'antd';

import {
    Form,
    Input,
    Button,
    Tabs,
    InputNumber,
    Space,
    message
} from 'antd';

const { TabPane } = Tabs;

const Index = () => {

    const [customHeight]=useWindowResize(140);

    useEffect(() => {
        Api.get().then((res) => {
            baseform.setFieldsValue({
                archives: res.archives,
                name: res.name,
                keyword: res.keyword,
                siteDesc: res.siteDesc,
                logoTitle: res.logoTitle,
                logoIcon: res.logoIcon,
                copyright: res.copyright,
                codeExpire: res.codeExpire,
                autoClear: res.autoClear,
                domain: res.domain,
                id: res.id
            })
        })
        baseform2.setFieldsValue({
            password: 123456
        })
        
    }, []);

    const [imgVisible, setImgVisible] = useState(false);


    const [baseform] = Form.useForm();
    const [baseform2] = Form.useForm();

    const imgLoaderRef = useRef(null);

    const handleSuccessUpload = () => {
        const successUrl = imgLoaderRef.current.fileList[0].successUrl;
        baseform.setFieldsValue({
            logoIcon: successUrl
        })
    }

    const [addLoading, setAddLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmit = (values) => {
        Api.edit({
            ...values,
        }).then(res => {
            message.success("提交成功！")

            setAddLoading(false);
        }).catch((e) => {
            setAddLoading(false);
        })


    }


    const handleSubmit2 = (values) => { 

        Api2.reset(values).then(res => {
            message.success("密码重置成功")
            setSubmitLoading(false);
        }).catch((e) => {
            setSubmitLoading(false);
        })
    }


    return (
        <div className={style.wrapper} style={{height:customHeight}} >
            <Tabs className={style.cardStyle} defaultActiveKey="basic" type="line">
                <TabPane tab="基础设置" key="basic">

                    <CustomUploader visible={imgVisible} max={1} ref={imgLoaderRef} successUploader={handleSuccessUpload} onCancel={() => setImgVisible(false)} />

                    {/* <CustomImage /> */}

                    <Form
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        form={baseform}
                        onFinish={handleSubmit}
                    >
                        <Form.Item label="站点ID" name="id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item label="站点名称" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="站点域名" name="domain">
                            <Input />
                        </Form.Item>
                        <Form.Item label="网站关键词" name="keyword">
                            <Input />
                        </Form.Item>
                        <Form.Item label="网站描述" name="siteDesc">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="LOGO标题" name="logoTitle">
                            <Input />
                        </Form.Item>
                        <Form.Item label="LOGO图标" >
                            <div style={{ display: 'flex' }}>
                                <Form.Item name="logoIcon" style={{ flex: 1, marginBottom: 0 }}>
                                    <Input />
                                </Form.Item>
                                <Button type="primary" onClick={() => { setImgVisible(true) }}>上传</Button>
                            </div>

                        </Form.Item>
                        <Form.Item label="备案信息" name="archives">
                            <Input />
                        </Form.Item>
                        <Form.Item label="版权信息" name="copyright">
                            <Input />
                        </Form.Item>
                        <Form.Item label="验证码过期"  >
                            <div style={{ display: 'flex' }}>
                                <Form.Item name="codeExpire" style={{ flex: 1, marginBottom: 0 }}>
                                    <InputNumber />
                                </Form.Item>
                                <div style={{ marginLeft: 10 }}>短信验证码过期时间 单位：分钟</div>
                            </div>

                        </Form.Item>
                        <Form.Item label="回收站自动清理"  >
                            <div style={{ display: 'flex' }}>
                                <Form.Item name="autoClear" style={{ flex: 1, marginBottom: 0 }}>
                                    <InputNumber />
                                </Form.Item>
                                <div style={{ marginLeft: 10 }}>回收站到期后自动清理 单位：天</div>
                            </div>
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <Space>
                                <PermissionsButton permission={'SiteSet:Update'}>
                                    <Button type="primary" htmlType="submit" loading={addLoading}>
                                    提交
                                    </Button>
                            </PermissionsButton>
                                <Button htmlType="button" >
                                    重置
                            </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab="账户设置" key="account">
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        form={baseform2}
                        onFinish={handleSubmit2}
                    >
                        <Form.Item
                            name="password"
                            label="密码重置"
                            rules={[{ required: true, message: '密码必填' }]}
                        >
                            <Input.Password visibilityToggle={false} placeholder="Please input" />
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <Space>
                            <PermissionsButton permission={'SiteSet:Update'}>
                                <Button type="primary" htmlType="submit" loading={submitLoading}>
                                    提交
                            </Button></PermissionsButton>
                                <Button htmlType="button" >
                                    重置
                            </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    )

}

export default Index;