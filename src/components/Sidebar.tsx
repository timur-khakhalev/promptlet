import { useState, forwardRef, useImperativeHandle } from 'react'
import { useAppContext, type MiniApp } from '../contexts/AppContext'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import CreateAppModal from './CreateAppModal'

export interface SidebarRef {
  openCreateModal: () => void
}

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = forwardRef<SidebarRef, SidebarProps>(({ onClose }, ref) => {
  const { state, setActiveMiniAppId, deleteMiniApp } = useAppContext()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<MiniApp | null>(null)

  const openCreateModal = () => {
    setEditingApp(null)
    setIsCreateModalOpen(true)
  }

  const openEditModal = (app: MiniApp) => {
    setEditingApp(app)
    setIsCreateModalOpen(true)
  }

  useImperativeHandle(ref, () => ({
    openCreateModal,
  }))

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this mini-app?')) {
      deleteMiniApp(id)
    }
  }

  const handleAppClick = (appId: string) => {
    setActiveMiniAppId(appId)
    if (onClose) onClose();
  }

  return (
    <aside className="w-full md:w-80 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-600 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">Mini-Apps</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={openCreateModal} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
              title="Create new mini-app"
            >
              <Plus size={20} />
            </button>
            {onClose && (
              <button 
                onClick={onClose} 
                className="p-2 md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
                title="Close menu"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          {state.miniApps.length} mini-app{state.miniApps.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mini-Apps List */}
      <div className="flex-1 overflow-y-auto p-2">
        {state.miniApps.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">
              No mini-apps yet
            </p>
            <button
              onClick={openCreateModal}
              className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
            >
              Create your first mini-app
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {state.miniApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className={`group rounded-lg border transition-all cursor-pointer p-3 ${
                  state.activeMiniAppId === app.id
                    ? 'bg-indigo-50 dark:bg-slate-700 border-indigo-200 dark:border-slate-500'
                    : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-slate-50 truncate">
                        {app.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Model: {app.model}
                      </p>
                      {app.systemPrompt && (
                        <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {app.systemPrompt.slice(0, 80)}
                          {app.systemPrompt.length > 80 ? '...' : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(app)
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-400"
                        title="Edit mini-app"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(app.id)
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                        title="Delete mini-app"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateAppModal
          onClose={() => setIsCreateModalOpen(false)}
          editingApp={editingApp}
        />
      )}
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar