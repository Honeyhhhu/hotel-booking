import { useState } from 'react';
import { Button, Modal, Space, Tag } from 'antd';
// 可选：补充基础样式，让列表更美观
import './UserList.css';

const UserList = () => {
  // 模拟用户数据
  const [users, setUsers] = useState([
    { id: 1, name: '名称', age: '地址', role: '星级', fangxing: '房型' ,jiage: '价格',time: '开业时间',status:'通过'},

  ]);

  // ✅ 核心修正：用 useState 管理弹窗可见状态（React 状态，修改会触发重渲染）
  const [modalVisible, setModalVisible] = useState(false);

  // 模拟删除用户
  const handleDelete = (id) => {
    if (window.confirm('确定删除该数据吗？')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // ✅ 修正：修改 React 状态来控制弹窗显示
  const showModal = () => {
    setModalVisible(true);
  };

  // ✅ 修正：函数组件中直接修改状态，无 this
  const handleOk = (e) => {
    console.log(e);
    setModalVisible(false);
    // 可在这里添加新增用户的逻辑（比如表单提交、接口请求）
  };

  // ✅ 修正：关闭弹窗，修改状态
  const handleCancel = (e) => {
    console.log(e);
    setModalVisible(false);
  };

  return (
    <div className="user-list-container">
      {/* 新增按钮：✅ 修正事件绑定（调用 showModal 函数） */}
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        新增
      </Button>

      {/* 用户列表表格 */}
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>酒店名称</th>
            <th>酒店地址</th>
            <th>酒店星级</th>
            <th>酒店房型</th>
            <th>酒店价格</th>
            <th>酒店开业时间</th>
            <th>酒店审核状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.role}</td>
              <td>{user.fangxing}</td>
              
            

               <td>{user.jiage}</td>
              <td>{user.time}</td>
                <td>
                {/* 用 antd Tag 优化状态显示，更美观 */}
                <Tag color={user.status === '通过' ? 'success' : 'error'}>
                  {user.status}
                </Tag>
              </td>
              <td>
                <Space size="small">
                  <Button type="primary" size="small" onClick={showModal}>通过</Button>
                  <Button type="primary" size="small" onClick={showModal}>拒绝</Button>
                  <Button type="default" size="small" onClick={showModal}>编辑</Button>
                 
                  <Button
                    type="danger"
                    size="small"
                    onClick={() => handleDelete(user.id)}
                  >
                    删除
                  </Button>
                </Space>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ 修正后的 Modal：绑定 React 状态 + 正确的事件处理 */}
      <Modal
        title="新增酒店"
        open={modalVisible} // v5 版本推荐用 open 替代 visible（兼容 visible）
        onOk={handleOk} // 直接绑定函数，无需额外箭头函数（除非需要传参）
        onCancel={handleCancel}
        confirmLoading={false} 
            footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              确认
            </Button>,
          ]}// 可添加加载状态，比如提交时设为 true
      >
      
        <p style={{margin:'10px'}}>酒店名称：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
        <p style={{margin:'10px'}}>酒店地址：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
        <p style={{margin:'10px'}}> 酒店星级：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
        <p style={{margin:'10px'}}>酒店房型：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
        <p style={{margin:'10px'}}>酒店价格：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
        <p style={{margin:'10px'}}>酒店开业时间：<input placeholder="请输入" style={{ width: '70%', padding: 8 }} /></p>
      </Modal>
    </div>
  );
};

export default UserList;