'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { DistrictMedalLeaderboard } from '@/components/district-medal-leaderboard'
import { ParticipationAnalytics } from '@/components/participation-analytics'
import { getCdnUrl } from '@/lib/cdn-image'
import { Search, Mail, MapPin, Award, Building, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface District {
  id: string
  name: string
  district: string
  logo: string
  status: string
  region: string
  email: string
}

interface DistrictsClientProps {
  districts: District[]
  tallies: any[]
}

export function DistrictsClient({ districts, tallies }: DistrictsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

  // Unique list of regions for the filter list
  const regions = ['All', ...Array.from(new Set(districts.map((d) => d.region)))]

  // Filter districts based on search and selected region
  const filteredDistricts = districts.filter((d) => {
    const matchesSearch =
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Helper to retrieve official state medal tally for district
  const getDistrictTally = (districtName: string, districtId: string) => {
    const normName = districtName.toLowerCase()
    const normId = districtId.toLowerCase()
    return tallies.find((t) => {
      const tNorm = t.district.toLowerCase()
      return (
        tNorm === normName ||
        normName.includes(tNorm) ||
        tNorm.includes(normName) ||
        (normId === 'aurangabad' && tNorm.includes('sambhaji'))
      )
    })
  }

  return (
    <>
      {/* Page Hero */}
      <PageHero
        kicker="Affiliated Units"
        title="Districts"
        subtitle="Explore the active district units of the Maharashtra Sepaktakraw Association"
      />

      {/* Filters and Search Sticky Bar */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search districts by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-xs font-semibold"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mr-1.5 hidden lg:inline">
                Region:
              </span>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedRegion === region
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* 1. Affiliated District Associations (Shows FIRST directly below the filters) */}
          <div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">
                  Affiliated District Associations
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Showing {filteredDistricts.length} registered regional units of Maharashtra Sepaktakraw
                  {selectedRegion !== 'All' ? ` in ${selectedRegion} Region` : ''}
                </p>
              </div>

              {selectedRegion !== 'All' && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-800 border-blue-200 text-xs font-bold self-start sm:self-auto cursor-pointer"
                  onClick={() => setSelectedRegion('All')}
                >
                  Clear &quot;{selectedRegion}&quot; filter &times;
                </Badge>
              )}
            </div>

            {filteredDistricts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDistricts.map((district) => {
                  const tally = getDistrictTally(district.district, district.id)
                  return (
                    <Link
                      key={district.id}
                      href={`/districts/${district.id}`}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="p-6 text-center flex flex-col items-center flex-grow">
                        {/* Logo Frame */}
                        <div className="w-24 h-24 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden mb-4 p-2 transition-transform duration-300 group-hover:scale-105 shadow-inner shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getCdnUrl(district.logo)}
                            alt={`${district.district} Logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        {/* District Title */}
                        <h4 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                          {district.district}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {district.region} Region
                        </p>

                        {/* Championship Medals Summary */}
                        {tally && tally.total > 0 ? (
                          <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-100 w-full text-[11px] font-mono font-bold flex-wrap">
                            {tally.gold > 0 && (
                              <span
                                className="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded"
                                title={`${tally.gold} Gold Medals`}
                              >
                                🥇 {tally.gold}
                              </span>
                            )}
                            {tally.silver > 0 && (
                              <span
                                className="bg-slate-100 text-slate-900 border border-slate-200 px-1.5 py-0.5 rounded"
                                title={`${tally.silver} Silver Medals`}
                              >
                                🥈 {tally.silver}
                              </span>
                            )}
                            {tally.bronze > 0 && (
                              <span
                                className="bg-amber-50 text-amber-950 border border-amber-200 px-1.5 py-0.5 rounded"
                                title={`${tally.bronze} Bronze Medals`}
                              >
                                🥉 {tally.bronze}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-sans font-bold ml-0.5">
                              ({tally.total} total)
                            </span>
                          </div>
                        ) : (
                          <div className="mt-3 pt-3 border-t border-slate-100 w-full text-[11px] text-slate-400 font-medium">
                            Affiliated Unit
                          </div>
                        )}
                      </div>

                      {/* Footer stats */}
                      <div className="bg-slate-50/80 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-500">MSTA Unit</span>
                        <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                          View Unit <ChevronRight size={13} />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto px-6">
                <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Districts Found</h3>
                <p className="text-sm text-slate-500 mt-2">
                  We couldn&apos;t find any districts matching your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedRegion('All')
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* 2. Championship Medal Standings (Moved BELOW the district cards as requested) */}
          <div>
            <div className="mb-4">
              <span className="text-xs uppercase font-black tracking-widest text-blue-700">
                Podium Records
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
                State Championship Medal Standings
              </h3>
            </div>
            <DistrictMedalLeaderboard />
          </div>

          {/* 3. Official Athlete Participation & Growth Diagram */}
          <div>
            <ParticipationAnalytics />
          </div>
        </div>
      </section>

      {/* Details Dialog */}
      <Dialog open={selectedDistrict !== null} onOpenChange={() => setSelectedDistrict(null)}>
        <DialogContent className="sm:max-w-[480px] p-6 overflow-hidden rounded-xl border border-slate-200 shadow-xl bg-white animate-in fade-in duration-200">
          {selectedDistrict && (
            <>
              <DialogHeader className="items-center pb-4 border-b border-slate-100">
                <div className="w-28 h-28 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center p-3 overflow-hidden shadow-inner mb-3 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedDistrict.logo}
                    alt={selectedDistrict.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <DialogTitle className="text-lg font-extrabold text-slate-800 text-center uppercase tracking-tight leading-snug">
                  {selectedDistrict.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-blue-50/50 text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {selectedDistrict.region} Region
                  </Badge>
                  <Badge className="bg-green-50 text-green-700 border-green-200 border text-[10px] font-bold">
                    {selectedDistrict.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4 text-sm text-slate-700">
                <DialogDescription className="text-xs text-slate-500 font-medium text-center italic">
                  Official Affiliated District Unit of the Maharashtra Sepaktakraw Association
                </DialogDescription>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <Building size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Association
                      </span>
                      <p className="font-semibold text-slate-800 leading-snug">
                        {selectedDistrict.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Affiliation status
                      </span>
                      <p className="font-semibold text-slate-800 leading-snug">
                        Permanently Affiliated (Active)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        District Jurisdiction
                      </span>
                      <p className="font-semibold text-slate-800 leading-snug">
                        {selectedDistrict.district}, Maharashtra
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Official Contact Email
                      </span>
                      <p className="font-semibold text-slate-800 leading-snug break-all">
                        {selectedDistrict.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
