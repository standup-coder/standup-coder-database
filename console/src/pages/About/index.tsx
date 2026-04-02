import { Card, Typography, Space, Tag, Divider, Timeline, Button } from 'antd';
import { 
  GithubOutlined, 
  DatabaseOutlined, 
  CodeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <DatabaseOutlined className="text-6xl text-blue-500 mb-4" />
            <Title level={2}>Standup Coder Database</Title>
            <Paragraph className="text-gray-500 text-lg">
              全面的企业清单和IT岗位信息数据库
            </Paragraph>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>项目介绍</Title>
            <Paragraph>
              Standup Coder Database 是一个全面的企业清单和IT岗位信息数据库项目，
              采用清晰的文件夹结构组织各类权威企业榜单、行业信息以及IT技术岗位详细信息。
            </Paragraph>
            <Paragraph>
              项目包含权威榜单、行业清单、专题榜单、投资信息、技术活动、求职招聘、法律实务、
              IT岗位JD等八大类别，覆盖全国多个城市的科技企业，以及财富500强、专精特新、
              独角兽等国家级/国际级权威榜单。
            </Paragraph>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>数据覆盖</Title>
            <div className="flex flex-wrap gap-2">
              <Tag color="blue">312+ Markdown 文件</Tag>
              <Tag color="green">120+ 行业清单</Tag>
              <Tag color="orange">27+ IT岗位JD</Tag>
              <Tag color="purple">7+ 权威榜单</Tag>
              <Tag color="cyan">16+ 城市覆盖</Tag>
              <Tag color="red">13+ 行业分类</Tag>
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={4}>技术栈</Title>
            <Timeline
              items={[
                {
                  dot: <CodeOutlined />,
                  children: (
                    <div>
                      <Text strong>前端框架</Text>
                      <div className="text-gray-500">React 18 + TypeScript 5</div>
                    </div>
                  ),
                },
                {
                  dot: <DatabaseOutlined />,
                  children: (
                    <div>
                      <Text strong>UI组件库</Text>
                      <div className="text-gray-500">Ant Design 5 + Tailwind CSS</div>
                    </div>
                  ),
                },
                {
                  dot: <FileTextOutlined />,
                  children: (
                    <div>
                      <Text strong>构建工具</Text>
                      <div className="text-gray-500">Vite 5</div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
          
          <Divider />
          
          <div className="text-center">
            <Space>
              <Button 
                type="primary" 
                icon={<GithubOutlined />}
                href="https://github.com/standup-coder/standup-coder-database"
                target="_blank"
              >
                GitHub 仓库
              </Button>
              <Button 
                icon={<FileTextOutlined />}
                href="https://github.com/standup-coder/standup-coder-database/blob/main/README.md"
                target="_blank"
              >
                项目文档
              </Button>
            </Space>
          </div>
        </Space>
      </Card>
      
      <Card title="开源协议">
        <Paragraph>
          本项目采用 MIT 开源协议，欢迎贡献代码和反馈问题。
        </Paragraph>
        <Text type="secondary">
          Copyright © 2026 Standup Coder. All rights reserved.
        </Text>
      </Card>
    </div>
  );
}
