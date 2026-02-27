const Dashboard = () => {
  // 模拟统计数据
  const stats = [
    { title: '总用户数', value: 1280 },
    { title: '今日新增', value: 36 },
    { title: '订单数', value: 890 },
    { title: '待处理', value: 12 }
  ];

  return (
    <div className="dashboard">
      <h1>仪表盘</h1>
      <div className="stats-card">
        {stats.map((item, index) => (
          <div key={index} className="stat-item">
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;