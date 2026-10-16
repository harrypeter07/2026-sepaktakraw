'use client'

import { useState } from 'react'
import Link from 'next/link'
import recordsData from '@/lib/msta-records.json'
import districtsData from '@/lib/districts.json'
import { Trophy, Award, Medal, Search, ChevronRight, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function DistrictMedalLeaderboard() {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const { tallies } = recordsData

  const getDistrictLink = (distName: string) => {
    const match = districtsData.find(
      d => d.district.toLowerCase() === distName.toLowerCase() ||
           d.name.toLowerCase().includes(distName.toLowerCase()) ||
           distName.toLowerCase().includes(d.district.toLowerCase())
    )
    return match ? `/districts/${match.id}` : '/districts'
  }

  const filtered = tallies.filter(t =>
    t.district.toLowerCase().includes(search.toLowerCase())
  )

  const displayed = showAll ? filtered : filtered.slice(0, 8)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden mb-12">
      {/* Top Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-200" />
            <span className="text-xs uppercase font-black tracking-widest text-amber-100">Official State Honours Roll</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Championship Medal Standings (2021–2026)
          </h2>
          <p className="text-amber-100/90 text-xs sm:text-sm mt-1 max-w-xl">
            Historical podium finishes of affiliated district associations across Senior, Junior, and Sub-Junior State Championships.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search district medal tally..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/95 text-slate-800 placeholder:text-slate-400 border-none h-10 rounded-xl text-xs font-semibold focus-visible:ring-2 focus-visible:ring-amber-300 shadow-inner"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Rank</th>
              <th className="py-3.5 px-4 sm:px-6">District Unit</th>
              <th className="py-3.5 px-3 text-center">🥇 Gold</th>
              <th className="py-3.5 px-3 text-center">🥈 Silver</th>
              <th className="py-3.5 px-3 text-center">🥉 Bronze</th>
              <th className="py-3.5 px-4 sm:px-6 text-center">Total Medals</th>
              <th className="py-3.5 px-4 text-right">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold">
            {displayed.map((item, idx) => {
              const rank = idx + 1
              const rankBadge =
                rank === 1 ? 'bg-amber-100 text-amber-900 border-amber-300' :
                rank === 2 ? 'bg-slate-100 text-slate-900 border-slate-300' :
                rank === 3 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-slate-50 text-slate-600 border-slate-200'

              return (
                <tr key={item.district} className="hover:bg-blue-50/40 transition">
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black border ${rankBadge}`}>
                      {rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-800">
                    <Link
                      href={getDistrictLink(item.district)}
                      className="hover:text-blue-600 transition flex items-center gap-1.5"
                    >
                      {item.district}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block min-w-8 text-center font-black text-amber-600 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-xs">
                      {item.gold}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block min-w-8 text-center font-black text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs">
                      {item.silver}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block min-w-8 text-center font-black text-amber-800 bg-amber-100/50 border border-amber-300 px-2 py-0.5 rounded-md text-xs">
                      {item.bronze}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <span className="inline-flex items-center gap-1 font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs">
                      <Medal size={12} /> {item.total}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={getDistrictLink(item.district)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5"
                    >
                      View <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer controls */}
      {filtered.length > 8 && (
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 py-1 px-4 rounded-lg hover:bg-blue-50 transition"
          >
            {showAll ? 'Show Top 8 Districts' : `View All ${filtered.length} Ranked Districts`}
          </button>
        </div>
      )}
    </div>
  )
}
