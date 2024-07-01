import React, { useEffect, useState } from 'react';
import { Grid, Space } from '@arco-design/web-react';
import PopularContents from './popular-contents';
import ContentPercentage from './content-percentage';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Carousel from './carousel';
import Docs from './docs';
import Overview from './overview'; // 导入 Overview 组件
import styles from './style/index.module.less';
import './mock';

const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  const [jsonData, setJsonData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('./test.json'); // 替换为你的 JSON 文件路径
      const data = await response.json();
      setJsonData(data);
    };

    fetchData();
  }, []);

  return (
    <Space size={16} align="start">
      <Space size={16} direction="vertical">
        <Row gutter={gutter}>
          <Col span={24}>
            <Overview /> {/* 添加 Overview 组件 */}
          </Col>
          {/* 你可以在此处添加更多的组件 */}
        </Row>
      </Space>
    </Space>
  );
}

export default Workplace;
