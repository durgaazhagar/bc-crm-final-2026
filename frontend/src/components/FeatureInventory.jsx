import React, { useMemo, useState } from 'react'
import initialFeatures from '../data/features'

function Modal({ children, open, onClose, title }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-gray-600" onClick={onClose}>✖</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default function FeatureInventory() {
  const [features, setFeatures] = useState(initialFeatures)
  const [nameQuery, setNameQuery] = useState('')
  const [statusQuery, setStatusQuery] = useState('')
  const [categoryQuery, setCategoryQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const [modalOpen, setModalOpen] = useState(false)
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)

  const categories = useMemo(() => {
    const s = new Set(features.map(f => f.category))
    return Array.from(s)
  }, [features])

  const filtered = useMemo(() => {
    const nq = nameQuery.trim().toLowerCase()
    const sq = statusQuery
    const cq = categoryQuery
    return features
      .filter(f => {
        if (nq && !f.name.toLowerCase().includes(nq)) return false
        if (sq && f.status !== sq) return false
        if (cq && f.category !== cq) return false
        return true
      })
      .sort((a, b) => {
        let va = a[sortBy]
        let vb = b[sortBy]
        if (typeof va === 'string') va = va.toLowerCase()
        if (typeof vb === 'string') vb = vb.toLowerCase()
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ? 1 : -1
        return 0
      })
  }, [features, nameQuery, statusQuery, categoryQuery, sortBy, sortDir])

  const totals = useMemo(() => {
    const total = features.length
    const active = features.filter(f => f.status === 'Active').length
    const inactive = total - active
    return { total, active, inactive }
  }, [features])

  function toggleSort(col) {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('asc') }
  }

  function handleDelete(id) {
    if (!confirm('Delete this feature?')) return
    setFeatures(prev => prev.filter(p => p.id !== id))
  }

  function handleSave(newItem) {
    if (newItem.id) {
      setFeatures(prev => prev.map(p => (p.id === newItem.id ? newItem : p)))
    } else {
      const id = Math.max(0, ...features.map(f => f.id)) + 1
      setFeatures(prev => [{ ...newItem, id }, ...prev])
    }
    setModalOpen(false)
    setEditItem(null)
  }

  function openAdd() {
    setEditItem({ name: '', description: '', status: 'Active', category: '' })
    setModalOpen(true)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 p-4 rounded-xl text-white" style={{ background: 'linear-gradient(90deg,#0f172a,#0891b2)' }}>
          <h2 className="text-xl font-bold">Inventory - Feature List</h2>
          <p className="text-sm text-gray-100/90 mt-1">Manage product features. Add, view, edit and delete entries.</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex gap-2 w-full md:w-auto">
              <input placeholder="Search by feature name" value={nameQuery} onChange={e=>setNameQuery(e.target.value)} className="flex-1 md:w-72 p-2 rounded border border-gray-200" />
              <select value={statusQuery} onChange={e=>setStatusQuery(e.target.value)} className="p-2 rounded border border-gray-200">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select value={categoryQuery} onChange={e=>setCategoryQuery(e.target.value)} className="p-2 rounded border border-gray-200">
                <option value="">All Categories</option>
                {categories.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={openAdd} className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded shadow">+ Add Feature</button>
              <div className="text-sm text-gray-600">Showing <strong>{filtered.length}</strong> of {features.length}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-3 px-4 cursor-pointer" onClick={()=>toggleSort('name')}>Feature Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={()=>toggleSort('status')}>Status</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 align-top font-medium">{f.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{f.description}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${f.status==='Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{f.status}</span>
                    </td>
                    <td className="py-3 px-4">{f.category}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button onClick={()=>{setViewItem(f); setModalOpen(true)}} className="text-blue-600">View</button>
                      <button onClick={()=>{setEditItem(f); setModalOpen(true)}} className="text-indigo-600">Edit</button>
                      <button onClick={()=>handleDelete(f.id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg shadow flex items-center gap-3" style={{ background: 'linear-gradient(90deg,#fff7ed,#fff1cc)' }}>
              <div className="text-2xl">📦</div>
              <div>
                <div className="text-sm text-gray-600">Total Features</div>
                <div className="text-lg font-semibold">{totals.total}</div>
              </div>
            </div>
            <div className="p-3 rounded-lg shadow flex items-center gap-3" style={{ background: 'linear-gradient(90deg,#ecfeff,#dbeafe)' }}>
              <div className="text-2xl">✅</div>
              <div>
                <div className="text-sm text-gray-600">Active Features</div>
                <div className="text-lg font-semibold">{totals.active}</div>
              </div>
            </div>
            <div className="p-3 rounded-lg shadow flex items-center gap-3" style={{ background: 'linear-gradient(90deg,#f8fafc,#fce7f3)' }}>
              <div className="text-2xl">⛔</div>
              <div>
                <div className="text-sm text-gray-600">Inactive Features</div>
                <div className="text-lg font-semibold">{totals.inactive}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={()=>{setModalOpen(false); setViewItem(null); setEditItem(null)}} title={viewItem ? 'View Feature' : (editItem && editItem.id ? 'Edit Feature' : 'Add Feature')}>
        {viewItem ? (
          <div>
            <div className="mb-2"><strong>Name:</strong> {viewItem.name}</div>
            <div className="mb-2"><strong>Description:</strong> {viewItem.description}</div>
            <div className="mb-2"><strong>Status:</strong> {viewItem.status}</div>
            <div className="mb-2"><strong>Category:</strong> {viewItem.category}</div>
            <div className="text-right"><button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>{setViewItem(null); setModalOpen(false)}}>Close</button></div>
          </div>
        ) : (
          editItem && (
            <FeatureForm item={editItem} onCancel={()=>{setEditItem(null); setModalOpen(false)}} onSave={handleSave} />
          )
        )}
      </Modal>
    </div>
  )
}

function FeatureForm({ item, onCancel, onSave }) {
  const [form, setForm] = useState(item)
  function update(field, value) { setForm(prev=>({ ...prev, [field]: value })) }
  return (
    <form onSubmit={e=>{ e.preventDefault(); onSave(form) }} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-600">Name</label>
        <input className="w-full p-2 border rounded" value={form.name} onChange={e=>update('name', e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Description</label>
        <textarea className="w-full p-2 border rounded" value={form.description} onChange={e=>update('description', e.target.value)} />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Status</label>
          <select className="w-full p-2 border rounded" value={form.status} onChange={e=>update('status', e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600">Category</label>
          <input className="w-full p-2 border rounded" value={form.category} onChange={e=>update('category', e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">Save</button>
      </div>
    </form>
  )
}
