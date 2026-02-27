import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import LoginPage from './pages/login';
import Loginout from './pages/loginout';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 所有后台页面都嵌套在 Layout 布局中 */}
           <Route path="/" element={<LoginPage />} />
           <Route path="/loginout" element={<Loginout />} />
           
           <Route path="home" element={<Layout />}>
            <Route index element={<UserList />} /> {/* 默认首页 */}
            <Route path="users" element={<UserList />} /> {/* 用户列表页 */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;