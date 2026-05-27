import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// 加载环境变量
config();

const testDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'jira_user',
  password: process.env.DB_PASSWORD || 'jira_password',
  database: process.env.DB_DATABASE || 'jira_clone',
  logging: true,
});

async function testConnection() {
  console.log('🔍 测试数据库连接...\n');
  console.log('配置信息:');
  console.log(`- Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`- Port: ${process.env.DB_PORT || 3306}`);
  console.log(`- User: ${process.env.DB_USERNAME || 'jira_user'}`);
  console.log(`- Database: ${process.env.DB_DATABASE || 'jira_clone'}\n`);

  try {
    console.log('⏳ 正在连接数据库...');
    await testDataSource.initialize();
    console.log('✅ 数据库连接成功！\n');

    // 测试查询
    const result = await testDataSource.query('SELECT 1 as test');
    console.log('✅ 查询测试成功:', result, '\n');

    await testDataSource.destroy();
    console.log('✅ 连接已关闭');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ 数据库连接失败！\n');
    console.error('错误信息:', error.message);
    console.error('\n可能的原因:');
    console.error('1. Docker 容器未启动');
    console.error('2. 数据库端口配置错误');
    console.error('3. 用户名或密码错误');
    console.error('4. 数据库未完全初始化\n');
    console.error('💡 解决方案:');
    console.error('   - 运行: docker-compose ps');
    console.error('   - 查看日志: docker logs jira-mysql');
    console.error('   - 重启容器: docker-compose restart');
    console.error('   - 等待30秒后重试\n');
    process.exit(1);
  }
}

testConnection();