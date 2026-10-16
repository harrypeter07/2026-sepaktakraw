'use client'

import { useState } from 'react'
import recordsData from '@/lib/msta-records.json'
import { Shield, Trophy, Users, Award, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getCdnUrl } from '@/lib/cdn-image'

export function StateSquadShowcase() {
  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'staff'>('men')
  const { stateSquad } = recordsData

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'Tekong':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'Killer':
        return 'bg-rose-100 text-rose-800 border-rose-300'
      case 'Feeder':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden mb-12">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-[#38bdf8]" />
              <span className="text-xs uppercase font-black tracking-widest text-[#93c5fd]">Official Governing Body Roster</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Maharashtra State Sepaktakraw Squad
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Representing Maharashtra at the Senior National Sepaktakraw Championships and National Games. Verified official squad.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-black/25 p-1 rounded-xl backdrop-blur-sm self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'men'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Men&apos;s Team ({stateSquad.men.length})
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'women'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Women&apos;s Team ({stateSquad.women.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'staff'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Officials & Staff ({stateSquad.staff.length})
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 sm:p-8 bg-slate-50/50">
        {activeTab === 'men' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stateSquad.men.map((player) => (
              <div
                key={player.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCdnUrl(player.photoUrl)}
                    alt={player.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-user.jpg'
                    }}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white font-black text-xs">
                    #{player.jerseyNumber}
                  </div>
                  <Badge className={`absolute top-2 right-2 text-[10px] font-bold border ${getPositionBadge(player.position)}`}>
                    {player.position}
                  </Badge>
                </div>
                <div className="p-3.5">
                  <h4 className="font-bold text-slate-800 text-sm leading-tight truncate">
                    {player.name}
                  </h4>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <MapPin size={12} className="text-blue-600" />
                      {player.district}
                    </span>
                    {player.birthYear && (
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                        Born {player.birthYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'women' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stateSquad.women.map((player) => (
              <div
                key={player.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCdnUrl(player.photoUrl)}
                    alt={player.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-user.jpg'
                    }}
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white font-black text-xs">
                    #{player.jerseyNumber}
                  </div>
                  <Badge className={`absolute top-2 right-2 text-[10px] font-bold border ${getPositionBadge(player.position)}`}>
                    {player.position}
                  </Badge>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 text-base leading-tight">
                    {player.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <MapPin size={12} className="text-blue-600" />
                      {player.district}
                    </span>
                    {player.birthYear && (
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">
                        Born {player.birthYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stateSquad.staff.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition"
              >
                <div className="h-16 w-16 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getCdnUrl(member.photoUrl)}
                    alt={member.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-user.jpg'
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-800 text-sm leading-tight truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5 leading-snug">
                    {member.role}
                  </p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    MSTA Official
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
