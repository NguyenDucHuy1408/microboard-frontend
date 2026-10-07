import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, message, Button, Input, Space, Popconfirm, Modal, Select, Avatar, Tooltip, DatePicker } from 'antd';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftOutlined, FolderOpenOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Thêm thư viện xử lý ngày tháng

const { Title, Text } = Typography;
const getToken = () => localStorage.getItem('token');

// ==========================================
// 1. COMPONENT THẺ CÔNG VIỆC
// ==========================================
// ==========================================
// 1. COMPONENT THẺ CÔNG VIỆC
// ==========================================
const TaskCard = ({ task, onDelete, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id.toString() });
  const style = {
    transform: CSS.Translate.toString(transform),
    marginBottom: '10px', cursor: 'grab',
    zIndex: transform ? 999 : 'auto', position: transform ? 'relative' : 'static',
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); 
    if (window.confirm("Bạn có chắc chắn muốn xóa thẻ này?")) onDelete(task.id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        size="small" 
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
        onDoubleClick={() => onDoubleClick(task)} 
        extra={<Button type="text" danger size="small" onPointerDown={(e) => e.stopPropagation()} onClick={handleDeleteClick}>Xóa</Button>}
      >
        <div style={{ marginBottom: '12px' }}>{task.title}</div>
        
        {/* HIỂN THỊ NGƯỜI ĐƯỢC GIAO & DEADLINE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* CỘT TRÁI: AVATAR VÀ TÊN */}
          <div>
            {task.assignee && (
              <Tooltip title={`Người thực hiện: ${task.assignee.email}`}>
                <Space size={4}>
                  <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {task.assignee.email.split('@')[0]}
                  </Text>
                </Space>
              </Tooltip>
            )}
          </div>
          
          {/* CỘT PHẢI: DEADLINE MÀU ĐỎ */}
          <div>
            {task.dueDate && (
              <Tooltip title="Hạn chót hoàn thành">
                <div style={{ fontSize: '12px', color: '#cf1322', display: 'flex', alignItems: 'center', backgroundColor: '#fff1f0', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ffa39e' }}>
                  <CalendarOutlined style={{ marginRight: '4px' }} />
                  {task.dueDate}
                </div>
              </Tooltip>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
};

// ==========================================
// 2. COMPONENT CỘT TRẠNG THÁI
// ==========================================
const Column = ({ title, status, tasks, bgColor, onAddTask, onDeleteTask, onDoubleClickTask }) => {
  const { setNodeRef } = useDroppable({ id: status });
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSave = () => {
    if (newTaskTitle.trim() === '') return setIsAdding(false);
    onAddTask(status, newTaskTitle);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  return (
    <Col span={8}>
      <Card title={title} style={{ backgroundColor: bgColor, minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        <div ref={setNodeRef} style={{ flexGrow: 1, minHeight: '500px' }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} onDoubleClick={onDoubleClickTask} />
          ))}
          <div style={{ marginTop: '15px' }}>
            {isAdding ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input autoFocus placeholder="Nhập công việc..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} onPressEnter={handleSave} />
                <Space>
                  <Button type="primary" size="small" onClick={handleSave}>Lưu</Button>
                  <Button size="small" onClick={() => { setIsAdding(false); setNewTaskTitle(''); }}>Hủy</Button>
                </Space>
              </Space>
            ) : (
              <Button type="dashed" block onClick={() => setIsAdding(true)}>+ Thêm công việc</Button>
            )}
          </div>
        </div>
      </Card>
    </Col>
  );
};

// ==========================================
// 3. MÀN HÌNH BẢNG KANBAN
// ==========================================
const KanbanView = ({ boardId, onBack }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(null);
  
  // STATE CHỨA DEADLINE
  const [selectedDueDate, setSelectedDueDate] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://microboard-api.onrender.com/api/tasks/board/${boardId}`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) setTasks(await response.json());
      } catch (error) { messageApi.error('Lỗi tải danh sách công việc!'); }
    };
    
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://microboard-api.onrender.com/api/users', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) setUsers(await response.json());
      } catch (error) { console.error('Lỗi tải danh sách User'); }
    };

    fetchTasks();
    fetchUsers();
  }, [boardId, messageApi]);

  const handleAddTask = async (status, title) => {
    const response = await fetch('https://microboard-api.onrender.com/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ title, status, board: { id: boardId } }),
    });
    if (response.ok) {
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      messageApi.success('Thêm thành công!');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const response = await fetch(`https://microboard-api.onrender.com/api/tasks/${taskId}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (response.ok) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      messageApi.success('Đã xóa!');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const taskId = parseInt(active.id);
    const newStatus = over.id;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const taskToUpdate = tasks.find(t => t.id === taskId);
    
    await fetch(`https://microboard-api.onrender.com/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ 
        title: taskToUpdate.title, 
        status: newStatus, 
        position: taskToUpdate.position, 
        board: { id: boardId },
        assignee: taskToUpdate.assignee ? { id: taskToUpdate.assignee.id } : null,
        dueDate: taskToUpdate.dueDate // Kéo thả thì giữ nguyên deadline cũ
      }),
    });
  };

  const handleDoubleClickTask = (task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setSelectedAssigneeId(task.assignee ? task.assignee.id : null);
    setSelectedDueDate(task.dueDate || null); // Nạp Deadline cũ vào Modal
    setIsModalVisible(true);
  };

  const handleUpdateTaskDetails = async () => {
    if (!selectedTask || editedTitle.trim() === '') return;

    try {
      const response = await fetch(`https://microboard-api.onrender.com/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({
          title: editedTitle,
          status: selectedTask.status,
          position: selectedTask.position,
          board: { id: boardId },
          assignee: selectedAssigneeId ? { id: selectedAssigneeId } : null,
          dueDate: selectedDueDate // Gửi Deadline mới xuống Backend
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => t.id === selectedTask.id ? updatedTask : t));
        messageApi.success('Cập nhật chi tiết thành công!');
        setIsModalVisible(false);
      }
    } catch (error) {
      messageApi.error('Lỗi khi cập nhật chi tiết!');
    }
  };

  return (
    <div>
      {contextHolder}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} style={{ marginRight: '15px' }}>
          Quay lại Danh sách
        </Button>
        <Title level={3} style={{ margin: 0 }}>Bảng Công Việc (Dự án số {boardId})</Title>
      </div>
      
      <DndContext onDragEnd={handleDragEnd}>
        <Row gutter={16}>
          <Column title="CẦN LÀM" status="TODO" bgColor="#f0f2f5" tasks={tasks.filter(t => t.status === 'TODO')} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onDoubleClickTask={handleDoubleClickTask} />
          <Column title="ĐANG LÀM" status="IN_PROGRESS" bgColor="#e6f7ff" tasks={tasks.filter(t => t.status === 'IN_PROGRESS')} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onDoubleClickTask={handleDoubleClickTask} />
          <Column title="ĐÃ XONG" status="DONE" bgColor="#f6ffed" tasks={tasks.filter(t => t.status === 'DONE')} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask} onDoubleClickTask={handleDoubleClickTask} />
        </Row>
      </DndContext>

      <Modal
        title="Chi tiết công việc"
        open={isModalVisible}
        onOk={handleUpdateTaskDetails}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu thay đổi"
        cancelText="Đóng"
      >
        <div style={{ marginBottom: '15px' }}>
          <Text strong>Tên công việc:</Text>
          <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} style={{ marginTop: '5px' }} />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', gap: '15px' }}>
          {/* CỘT CHỌN NGƯỜI */}
          <div style={{ flex: 1 }}>
            <Text strong>Người thực hiện:</Text>
            <Select
              style={{ width: '100%', marginTop: '5px' }}
              placeholder="Bấm để chọn"
              value={selectedAssigneeId}
              onChange={(value) => setSelectedAssigneeId(value)}
              allowClear
            >
              {users.map(user => (
                <Select.Option key={user.id} value={user.id}>{user.email}</Select.Option>
              ))}
            </Select>
          </div>

          {/* CỘT CHỌN HẠN CHÓT */}
          <div style={{ flex: 1 }}>
            <Text strong>Hạn chót (Deadline):</Text>
            <DatePicker
              style={{ width: '100%', marginTop: '5px' }}
              placeholder="Chọn ngày hoàn thành"
              format="YYYY-MM-DD"
              value={selectedDueDate ? dayjs(selectedDueDate) : null}
              onChange={(date, dateString) => setSelectedDueDate(dateString)} // dateString có dạng "2026-12-30"
              allowClear // Nút X để gỡ hạn chót
            />
          </div>
        </div>

        <div>
          <Text strong>Trạng thái hiện tại: </Text>
          <Text code>{selectedTask?.status}</Text>
        </div>
      </Modal>
    </div>
  );
};

// ==========================================
// 4. MÀN HÌNH DASHBOARD
// ==========================================
const Dashboard = ({ onSelectBoard }) => {
  const [boards, setBoards] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('https://microboard-api.onrender.com/api/boards', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) setBoards(await response.json());
      } catch (error) { messageApi.error('Lỗi tải danh sách dự án!'); }
    };
    fetchBoards();
  }, [messageApi]);

  return (
    <div>
      {contextHolder}
      <Title level={3} style={{ textAlign: 'center', marginBottom: '30px' }}>
        Danh sách Dự án của bạn
      </Title>
      <Row gutter={[16, 16]}>
        {boards.map(board => (
          <Col span={8} key={board.id}>
            <Card hoverable onClick={() => onSelectBoard(board.id)} style={{ textAlign: 'center', borderColor: '#1890ff', borderWidth: '2px' }}>
              <FolderOpenOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '10px' }} />
              <Title level={4}>{board.title}</Title>
              <Text type="secondary">{board.description || 'Không có mô tả'}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// ==========================================
// 5. MAIN APP
// ==========================================
export default function App() {
  const [currentBoardId, setCurrentBoardId] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      {currentBoardId ? (
        <KanbanView boardId={currentBoardId} onBack={() => setCurrentBoardId(null)} />
      ) : (
        <Dashboard onSelectBoard={setCurrentBoardId} />
      )}
    </div>
  );
}