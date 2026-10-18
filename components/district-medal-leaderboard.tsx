'use client'

import { useState } from 'react'
import Link from 'next/link'
import recordsData from '@/lib/msta-records.json'
import districtsData from '@/lib/districts.json'
import { Trophy, Medal, Search, ChevronRight, Award } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function DistrictMedalLeaderboard() {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const { tallies } = recordsData

  const getDistrictLink = (distName: string) => {
    const match = districtsData.find(
      (d) =>
        d.district.toLowerCase() === distName.toLowerCase() ||
        d.name.toLowerCase().includes(distName.toLowerCase()) ||
        distName.toLowerCase().includes(d.district.toLowerCase())
    )
    return match ? `/districts/${match.id}` : '/districts'
  }

  const filtered = tallies.filter((t) =>
    t.district.toLowerCase().includes(search.toLowerCase())
  )

  const displayed = showAll ? filtered : filtered.slice(0, 8)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Top Header - Dignified Federation Style */}
      <div className="p-6 sm:p-8 bg-[#0b1528] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-[11px] uppercase font-black tracking-widest text-amber-400">
              State Championship Honours Roll
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Championship Medal Standings (2021–2026)
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Cumulative medal tally of affiliated district associations across Senior, Junior, and
            Sub-Junior Maharashtra State Championships.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search district tally..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900/90 text-white placeholder:text-slate-500 border border-slate-700 h-10 rounded-xl text-xs font-semibold focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:border-amber-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 sm:px-6 w-16">Rank</th>
              <th className="py-3 px-4 sm:px-6">District Unit</th>
              <th className="py-3 px-4 text-center w-24">
                <span className="inline-flex items-center gap-1 text-amber-600 font-extrabold">
                  🥇 Gold
                </span>
              </th>
              <th className="py-3 px-4 text-center w-24">
                <span className="inline-flex items-center gap-1 text-slate-600 font-extrabold">
                  🥈 Silver
                </span>
              </th>
              <th className="py-3 px-4 text-center w-24">
                <span className="inline-flex items-center gap-1 text-amber-800 font-extrabold">
                  🥉 Bronze
                </span>
              </th>
              <th className="py-3 px-6 text-center w-28 text-slate-700">Total</th>
              <th className="py-3 px-6 text-right">District Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-semibold">
            {displayed.map((item, idx) => {
              const rank = idx + 1
              const isTopThree = rank <= 3
              const rankClass =
                rank === 1
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : rank === 2
                  ? 'bg-slate-200 text-slate-900 font-black shadow-xs'
                  : rank === 3
                  ? 'bg-amber-700 text-amber-50 font-black shadow-xs'
                  : 'text-slate-500 font-bold bg-slate-100'

              return (
                <tr
                  key={item.district}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isTopThree ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs font-mono ${rankClass}`}
                    >
                      {rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <Link
                      href={getDistrictLink(item.district)}
                      className="font-bold text-slate-900 hover:text-blue-700 transition"
                    >
                      {item.district}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600 tabular-nums">
                    {item.gold}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600 tabular-nums">
                    {item.silver}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-800 tabular-nums">
                    {item.bronze}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className="inline-flex items-center gap-1 font-mono font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">
                      <Medal size={11} className="text-amber-500" /> {item.total}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href={getDistrictLink(item.district)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition"
                    >
                      View Profile <ChevronRight size={13} />
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
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 py-1 px-4 rounded-lg hover:bg-white transition cursor-pointer"
          >
            {showAll ? 'Collapse to Top 8 Districts' : `View All ${filtered.length} Ranked Districts`}
          </button>
        </div>
      )}
    </div>
  )
}
