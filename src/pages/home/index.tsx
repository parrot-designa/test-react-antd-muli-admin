import React, { FC, useEffect, useState, useLayoutEffect } from 'react'
import { Card, Row, Col, Typography, message } from 'antd'
import CustomTable from '@/components/CustomTable';
import WhiteSpace from '@/components/WhiteSpace';
import NoticeApi from '@/api/notice'
import EmailApi from '@/api/email'
import Api from '@/api/auth/useInfo'
import useWindowResize from '@/hooks/useWindowResize';
import { useHistory } from 'react-router-dom'

const { Paragraph, Text } = Typography;

const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 // Moment is also OK

const Home: FC = () => {

  const [user, setUser] = useState<any>({});

  const [data1, setData1] = useState([]);

  const [tableLoading, setTableLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    getList()
  }, [pagination.current, pagination.pageSize]);

  const [data2, setData2] = useState([]);

  const [customHeight] = useWindowResize(560);

  useLayoutEffect(() => {
    Api.getInfo().then(res => {
      sessionStorage.setItem("CURRENTUSER", res.username)
      setUser(res || {})
    })
  }, []);

  const getList = () => {
    let newObj: any = {}
    setTableLoading(true)
    NoticeApi.getList({
      page: pagination.current,
      size: pagination.pageSize,
      ...newObj
    }).then((res: any) => {
      setTableLoading(false)
      const { records, total } = res;
      setData1(records)
      setPagination({
        ...pagination,
        total: total
      })
    }).catch(e => {
      setTableLoading(false)
    })
  }

  useEffect(() => {
    EmailApi.getReceive({ page: 1, size: 15 }).then(res => {
      setData2(res.records);
    })
  }, []);


  const history = useHistory()

  const columns1 = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (current, record) => {
        return <a onClick={() => handleShowFile(record)}>{current}</a>
      }
    }
  ];

  const columns2 = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '发送时间',
      dataIndex: 'fileType',
      key: 'fileType',
    }
  ]

  const handleShowFile = (record) => { 
    if (!record.resourceId || !record.resourceTitle) {
      message.error("数据异常！")
      return;
    }

    history.push({
      pathname: `/fileDetail`,
      search: `fileId=${record.resourceId}&fileName=${record.resourceTitle}`
    })
  }

  const handleTableChange = (pagination) => {
    setPagination({
        ...pagination
    })
}

  return (
    <div className="home">
      <Row gutter={16}>
        <Col span={24}>
          <Card>
            <Paragraph>
              欢迎 <Text strong>{user.username}</Text> 登录 <Text strong>东风标致MEC素材广场</Text>
            </Paragraph>
            <Paragraph>
              当前登录时间 ：<Text strong>{user.lastLoginTime}</Text>      登录IP：<Text strong>{user.lastLoginIp}</Text>
            </Paragraph>
            <Paragraph>
              登录总次数 ：<Text strong>{user.loginCount}</Text>
            </Paragraph>
            <Paragraph>
              网站运维:<Text strong>0551-63354088 </Text>
            </Paragraph>
          </Card>
        </Col>
      </Row>
      <WhiteSpace height={10} />
      <Row gutter={16}>
        <Col span={12}>
          <Card title="资源公告">
            <CustomTable
              dataSource={data1}
              loading={tableLoading}
              columns={columns1}
              renderRight={false}
              showTableTop={false}
              showWhiteSpace={false}
              title={false}
              noselection
              pagination={pagination}
              onTableChange={handleTableChange}
              scroll={
                {
                  y: customHeight
                }
              } 
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="站内信">
            <CustomTable
              dataSource={data2}
              columns={columns2}
              renderRight={false}
              showTableTop={false}
              showWhiteSpace={false}
              title={false}
              noselection
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
