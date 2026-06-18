import React, { useMemo, useState } from 'react'
import donors from '../data/donors'

const Badge = ({ icons }) => (
  <div className="flex gap-1 text-xl" aria-hidden>
    {icons.map((i, idx) => (
      <span key={idx} className="min-w-[1.25rem]">{i}</span>
    ))}
  </div>
)

const SummaryCounter = ({ emoji, label, value, bg }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg shadow-sm" style={{ background: bg }}>
    <div className="text-2xl">{emoji}</div>
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  </div>
)

export default function DonorLoyalty() {
  const [nameQuery, setNameQuery] = useState('')
  const [districtQuery, setDistrictQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    const qn = nameQuery.trim().toLowerCase()
    const qd = districtQuery.trim().toLowerCase()
    return donors
      .filter(d => {
        if (qn && !d.name.toLowerCase().includes(qn)) return false
        if (qd && !d.district.toLowerCase().includes(qd)) return false
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
  }, [nameQuery, districtQuery, sortBy, sortDir])

  const counts = useMemo(() => {
    let platinum = 0
    let silver = 0
    donors.forEach(d => {
      if (d.loyaltyPoints >= 900) platinum++
      else if (d.loyaltyPoints >= 300) silver++
    })
    return { platinum, silver }
  }, [])

  function toggleSort(col) {
    if (sortBy === col) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(col)
      setSortDir('asc')
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 p-6 rounded-xl text-white" style={{ background: 'linear-gradient(90deg,#0f172a,#1e3a8a)' }}>
          <h2 className="text-2xl font-bold">Donor Loyalty List — Tamil Nadu</h2>
          <p className="text-sm text-gray-200/80 mt-1">Clean, responsive list with sorting, filtering and loyalty summary.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex gap-3 flex-1">
              <input
                aria-label="Search by name"
                placeholder="Search by name"
                value={nameQuery}
                onChange={e => setNameQuery(e.target.value)}
                className="flex-1 p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              />
              <input
                aria-label="Search by district"
                placeholder="Search by district"
                value={districtQuery}
                onChange={e => setDistrictQuery(e.target.value)}
                className="w-56 p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="text-sm text-gray-600">Showing <strong>{filtered.length}</strong> of {donors.length} donors</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('name')}>Name</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('bloodGroup')}>Blood Group</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('district')}>District</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('lifetimeDonations')}>Lifetime Donations</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('loyaltyPoints')}>Loyalty Points</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 align-top">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.email || ''}</div>
                    </td>
                    <td className="py-3 px-4">{d.bloodGroup}</td>
                    <td className="py-3 px-4">{d.district}</td>
                    <td className="py-3 px-4">{d.lifetimeDonations}</td>
                    <td className="py-3 px-4"><Badge icons={d.badges} /></td>
                    <td className="py-3 px-4 font-semibold">{d.loyaltyPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SummaryCounter emoji="🏆" label="Platinum Donors" value={counts.platinum} bg="linear-gradient(90deg,#f59e0b10,#f9731620)" />
            <SummaryCounter emoji="🥈" label="Silver Donors" value={counts.silver} bg="linear-gradient(90deg,#9ca3ff10,#60a5fa20)" />
          </div>
        </div>
      </div>
    </div>
  )
}
