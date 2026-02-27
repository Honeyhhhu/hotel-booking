import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false); // 侧边栏折叠状态
  const navigate = useNavigate();

  // 模拟退出登录
  const handleLogout = () => {
    if (window.confirm('确定退出登录吗？')) {
      navigate('/');
      alert('已退出登录');
    }
  };

  return (
    <div className="layout-container">
      {/* 侧边栏 */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{collapsed ? '后台' : '简单后台管理系统'}</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="home" className="nav-item">
            酒店管理
          </Link>
          {/* <Link to="/users" className="nav-item">
            用户管理
          </Link> */}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="main-content">
        {/* 顶部导航 */}
        <header className="header">
          <button 
            className="collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '展开' : '折叠'}
          </button>
          <div className="header-right">
            <span>管理员</span>
            <button onClick={handleLogout} className="logout-btn">退出</button>
          </div>
        </header>

        {/* 页面内容（由路由匹配的组件填充） */}
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;