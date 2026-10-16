'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Filter,
  BarChart3,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react'
import participationData from '@/lib/participation-records.json'

export function ParticipationAnalytics() {
  const [selectedSeason, setSelectedSeason] = useState<string>('all')
  const [searchDistrict, setSearchDistrict] = useState('')
  const [activeTab, setActiveTab] = useState<'chart' | 'matrix'>('chart')

  const seasons = participationData.seasons || ['2021-22', '2022-23', '2023-24', '2024-25']
  const summaries = (participationData.seasonSummaries || {}) as Record<string, any>
  const districts = participationData.districts || []

  // Filter districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) =>
      d.district.toLowerCase().includes(searchDistrict.toLowerCase().trim())
    )
  }, [districts, searchDistrict])

  // Aggregate stats
  const totalParticipations = districts.reduce((acc, d) => acc + (d.allTimeAthletes || 0), 0)
  const peakSeason = Object.entries(summaries).reduce(
    (max, [year, data]) => (data.grandTotal > max.total ? { year, total: data.grandTotal } : max),
    { year: '2023-24', total: 559 }
  )

  return (
    <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl my-12 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black uppercase tracking-wider mb-4">
            <BarChart3 size={14} className="text-blue-400" />
            Official MSTA State Records Analytics
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            DISTRICT PARTICIPATION & ATHLETE GROWTH
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Historical championship field data across Senior, Junior, and Sub-Junior divisions from 2021 to 2025.
          </p>
        </div>

        {/* High Level KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Total Athletes Fielded
              </span>
              <Users size={18} className="text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalParticipations.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-1">
              Across 26 affiliated district units
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Peak State Championship
              </span>
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{peakSeason.total} <span className="text-sm font-bold text-slate-400">Athletes</span></div>
            <div className="text-[11px] text-blue-400 font-semibold mt-1">
              Season {peakSeason.year} Championship
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Youth Grassroots Growth
              </span>
              <Award size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">+93.4%</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">
              Junior & Sub-Junior athlete intake
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Active Districts
              </span>
              <Shield size={18} className="text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">26 Units</div>
            <div className="text-[11px] text-purple-400 font-semibold mt-1">
              Maharashtra Olympic recognized
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 p-2 sm:p-3 rounded-2xl border border-slate-700/80 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'chart'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 size={15} /> Visual Growth Diagram
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Layers size={15} /> District Participation Matrix
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Visual Growth Diagram */}
        {activeTab === 'chart' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  State Championship Athlete Turnout by Season
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Verified field counts reported by official tournament scrutiny committees.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" /> Senior Men
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" /> Senior Women
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" /> Youth (Jr/Sub-Jr)
                </span>
              </div>
            </div>

            {/* Visual Bar Progression */}
            <div className="space-y-6">
              {seasons.map((season) => {
                const sData = summaries[season] || { seniorMen: 0, seniorWomen: 0, grandTotal: 0 }
                const youthCount = (sData.juniorBoys || 0) + (sData.juniorGirls || 0) + (sData.subJuniorBoys || 0) + (sData.subJuniorGirls || 0)
                const maxVal = 600
                const menPercent = Math.round(((sData.seniorMen || 0) / maxVal) * 100)
                const womenPercent = Math.round(((sData.seniorWomen || 0) / maxVal) * 100)
                const youthPercent = Math.round((youthCount / maxVal) * 100)

                return (
                  <div key={season} className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-extrabold text-white flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400" />
                        Championship Season {season}
                      </span>
                      <span className="font-black text-slate-200">
                        {sData.grandTotal} <span className="text-slate-400 font-semibold">Total Athletes</span>
                      </span>
                    </div>

                    {/* Stacked Progress Bar */}
                    <div className="h-7 w-full bg-slate-900 rounded-xl overflow-hidden flex border border-slate-700/80 p-0.5 gap-0.5">
                      <div
                        style={{ width: `${menPercent}%` }}
                        className="bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white hover:bg-blue-500 transition"
                        title={`Senior Men: ${sData.seniorMen}`}
                      >
                        {sData.seniorMen > 30 ? `${sData.seniorMen} Men` : ''}
                      </div>
                      <div
                        style={{ width: `${womenPercent}%` }}
                        className="bg-rose-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white hover:bg-rose-500 transition"
                        title={`Senior Women: ${sData.seniorWomen}`}
                      >
                        {sData.seniorWomen > 30 ? `${sData.seniorWomen} Women` : ''}
                      </div>
                      {youthCount > 0 && (
                        <div
                          style={{ width: `${youthPercent}%` }}
                          className="bg-amber-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white hover:bg-amber-500 transition"
                          title={`Youth (Junior & Sub-Junior): ${youthCount}`}
                        >
                          {youthCount > 30 ? `${youthCount} Youth` : ''}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Men: <strong className="text-slate-200">{sData.seniorMen}</strong></span>
                      <span>Women: <strong className="text-slate-200">{sData.seniorWomen}</strong></span>
                      <span>Youth: <strong className="text-slate-200">{youthCount}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: District Participation Matrix */}
        {activeTab === 'matrix' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-700">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">District Association</th>
                    <th className="py-3 px-4 text-center">2021-22</th>
                    <th className="py-3 px-4 text-center">2022-23</th>
                    <th className="py-3 px-4 text-center">2023-24</th>
                    <th className="py-3 px-4 text-center">2024-25</th>
                    <th className="py-3 px-4 text-right">All-Time Athletes</th>
                    <th className="py-3 px-4 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredDistricts.map((dist, idx) => (
                    <tr key={dist.district} className="hover:bg-slate-700/40 transition">
                      <td className="py-3 px-4 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-black text-white whitespace-nowrap">
                        {dist.district}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-300">
                        {dist.history['2021-22']?.total || 0}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-300">
                        {dist.history['2022-23']?.total || 0}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-300">
                        {dist.history['2023-24']?.total || 0}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-300">
                        {dist.history['2024-25']?.total || 0}
                      </td>
                      <td className="py-3 px-4 text-right font-black text-blue-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs">
                          {dist.allTimeAthletes} Athletes
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/districts/${encodeURIComponent(dist.district.toLowerCase())}`}
                          className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ParticipationAnalytics
