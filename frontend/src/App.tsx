import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Implement GORM Integration', description: 'Setup SQLite database and auto-migrations', status: 'completed', priority: 'high' },
    { id: 2, title: 'Create Fiber API Endpoints', description: 'Define CRUD routes for task management', status: 'in_progress', priority: 'medium' },
    { id: 3, title: 'Design Modern UI', description: 'Build a glassmorphic dashboard with React', status: 'pending', priority: 'high' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-[#10b981]" size={18} />;
      case 'in_progress': return <Clock className="text-[#f59e0b]" size={18} />;
      default: return <AlertCircle className="text-[#94a3b8]" size={18} />;
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">TaskMaster <span className="text-[#8b5cf6]">Pro</span></h1>
          <p className="text-gray-400 mt-2">Manage your workflows with precision</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glow-btn flex items-center gap-2"
        >
          <Plus size={20} />
          New Task
        </button>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'bg-blue-500' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'bg-yellow-500' },
          { label: 'High Priority', value: tasks.filter(t => t.priority === 'high').length, color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6">
            <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{stat.value}</span>
              <div className={`w-12 h-1 ${stat.color} rounded-full opacity-30`} />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 glass px-4 py-2 flex items-center gap-3">
          <Search size={20} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="glass px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
          <Filter size={18} className="text-gray-400" />
          <span className="text-sm font-medium">Filter</span>
        </div>
        <div className="glass px-2 py-2 flex items-center gap-1">
          <div className="p-1.5 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6]">
            <LayoutGrid size={18} />
          </div>
          <div className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300">
            <ListIcon size={18} />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence>
          {tasks
            .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-5 flex items-center gap-6 task-card group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#8b5cf6]/10 transition-colors">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Status</p>
                  <p className="text-sm font-medium capitalize">{task.status.replace('_', ' ')}</p>
                </div>
                <button className="p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center text-gray-500 text-xs">
        <p>Built with Go, Fiber, GORM, and SQLite</p>
        <p className="mt-1">Powered by React & Framer Motion</p>
      </footer>
    </div>
  );
};

export default App;
