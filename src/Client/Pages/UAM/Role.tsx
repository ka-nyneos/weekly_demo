import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import Layout from '../../components/Layout/layout';
import Button from '../../components/ui/Button';
import { SortableRow } from '../../components/utils/SortableRow';

// Role data type
type Role = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  createdAt: string;
};

// Dummy initial data for roles table (from image)
const defaultRoles: Role[] = [
  {
    id: 1,
    name: 'MASTER MAKER',
    description: 'Master Maker role',
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date(Date.now() - 86400000 * 8).toLocaleString(),
  },
  {
    id: 2,
    name: 'operations',
    description: 'Operations role',
    startTime: '09:30',
    endTime: '18:30',
    createdAt: new Date(Date.now() - 86400000 * 7).toLocaleString(),
  },
  {
    id: 3,
    name: 'UAM MAKER',
    description: 'UAM Maker role',
    startTime: '10:00',
    endTime: '19:00',
    createdAt: new Date(Date.now() - 86400000 * 6).toLocaleString(),
  },
  {
    id: 4,
    name: 'UAM CHECKER',
    description: 'UAM Checker role',
    startTime: '10:30',
    endTime: '19:30',
    createdAt: new Date(Date.now() - 86400000 * 5).toLocaleString(),
  },
  {
    id: 5,
    name: 'MASTER CHECKER',
    description: 'Master Checker role',
    startTime: '11:00',
    endTime: '20:00',
    createdAt: new Date(Date.now() - 86400000 * 4).toLocaleString(),
  },
  {
    id: 6,
    name: 'QA and Engineering',
    description: 'QA and Engineering role',
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date(Date.now() - 86400000 * 3).toLocaleString(),
  },
  {
    id: 7,
    name: 'maintainance',
    description: 'Maintainance role',
    startTime: '08:00',
    endTime: '17:00',
    createdAt: new Date(Date.now() - 86400000 * 2).toLocaleString(),
  },
  {
    id: 8,
    name: 'manager',
    description: 'Manager role',
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date(Date.now() - 86400000).toLocaleString(),
  },
  {
    id: 9,
    name: 'OPERATION USER',
    description: 'Operation User role',
    startTime: '09:00',
    endTime: '18:00',
    createdAt: new Date().toLocaleString(),
  },
];

function getInitialRoles(): Role[] {
  const stored = localStorage.getItem('roles');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  localStorage.setItem('roles', JSON.stringify(defaultRoles));
  return defaultRoles;
}

const initialRoles: Role[] = getInitialRoles();

const defaultColumns = [
  { id: 'name', label: 'Role Name' },
  { id: 'description', label: 'Description' },
  { id: 'startTime', label: 'Start Time' },
  { id: 'endTime', label: 'End Time' },
  { id: 'createdAt', label: 'Created At' },
];

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  const [formError, setFormError] = useState('');
  const [columns, setColumns] = useState(defaultColumns);
  // const navigate = useNavigate();

  // Save roles to localStorage whenever roles change
  React.useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  // When the component mounts, always reload the latest roles from localStorage (in case another tab/page added a role)
  React.useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('roles');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setRoles(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.description || !form.startTime || !form.endTime) {
      setFormError('All fields are required.');
      return;
    }
    setFormError('');
    const newRole: Role = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      startTime: form.startTime,
      endTime: form.endTime,
      createdAt: new Date().toLocaleString(),
    };
    // Add new role and sort alphabetically by name
    const updatedRoles = [...roles, newRole].sort((a, b) => a.name.localeCompare(b.name));
    setRoles(updatedRoles);
    setShowForm(false);
    setForm({ name: '', description: '', startTime: '', endTime: '' });
    alert('Role created');
  };

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Handle row drag end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    // Row drag
    if (active.data.current?.type === 'row' && over.data.current?.type === 'row') {
      const oldIndex = roles.findIndex(r => r.id.toString() === active.id);
      const newIndex = roles.findIndex(r => r.id.toString() === over.id);
      setRoles(arrayMove(roles, oldIndex, newIndex));
    }
    // Column drag
    if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      const oldIndex = columns.findIndex(c => c.id === active.id);
      const newIndex = columns.findIndex(c => c.id === over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  return (
    <Layout title="Roles"  showButton={true} buttonText="Create Role" onButtonClick={() => setShowForm(true)}>
      {/* Role Creation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Create New Role</h2>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Role Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-3 flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1">Office Start Time (IST) *</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">Office End Time (IST) *</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            </div>
            {formError && <div className="text-red-600 mb-2">{formError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" color="Blue" categories="Medium" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" color="Green" categories="Medium">Submit</Button>
            </div>
          </form>
        </div>
      )}
      {/* Roles Table */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="text-xl font-bold mb-4">Roles List</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
            <table className="w-full border">
              <thead>
                <tr className="bg-indigo-50 rounded-xl">
                  {columns.map(col => (
                    <DraggableColumnHeader key={col.id} id={col.id} label={col.label} />
                  ))}
                </tr>
              </thead>
              <SortableContext items={roles.map(r => r.id.toString())} strategy={verticalListSortingStrategy}>
                <tbody>
                  {roles.length === 0 ? (
                    <tr><td colSpan={columns.length} className="text-center p-4 text-gray-400">No roles created yet.</td></tr>
                  ) : (
                    roles.map(role => (
                      <SortableRow key={role.id} id={role.id.toString()}>
                        {columns.map(col => (
                          <td key={col.id} className="p-2 border">{role[col.id as keyof Role]}</td>
                        ))}
                      </SortableRow>
                    ))
                  )}
                </tbody>
              </SortableContext>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </Layout>
  );
};

function DraggableColumnHeader({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: { type: 'column' } });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#e0e7ff' : undefined,
    userSelect: 'none',
  };
  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 border">
      <span className="flex items-center">{label}</span>
    </th>
  );
}

export default RolePage;