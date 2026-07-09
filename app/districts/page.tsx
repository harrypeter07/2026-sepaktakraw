'use client'

import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { useState } from 'react'
import districtsData from '@/lib/districts.json'
import { Search, Mail, MapPin, Award, Building, Phone } from 'lucide-react'
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

export default function DistrictsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

  // Unique list of regions for the filter list
  const regions = ['All', ...Array.from(new Set(districtsData.map(d => d.region)))]

  // Filter districts based on search and selected region
  const filteredDistricts = districtsData.filter(d => {
    const matchesSearch = 
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Page Hero */}
        <PageHero
          kicker="Affiliated Units"
          title="Districts"
          subtitle="Explore the active district units of the Maharashtra Sepaktakraw Association"
        />

        {/* Filters and Search */}
        <section className="py-10 bg-slate-50/50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search districts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-blue-600 rounded-lg shadow-sm"
                />
              </div>

              {/* Region Filter Buttons */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground mr-2 hidden lg:inline">Regions:</span>
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedRegion === region
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
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

        {/* District Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredDistricts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDistricts.map(district => (
                  <Link
                    key={district.id}
                    href={`/districts/${district.id}`}
                    className="group cursor-pointer bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="p-6 text-center flex flex-col items-center flex-grow">
                      {/* Logo Frame */}
                      <div className="w-24 h-24 rounded-full border border-slate-100 bg-slate-50/50 flex items-center justify-center overflow-hidden mb-4 p-2 transition-transform duration-300 group-hover:scale-105 shadow-inner shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={district.logo}
                          alt={`${district.district} Logo`}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* District Title */}
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                        {district.district}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {district.region} Region
                      </p>
                    </div>

                    {/* Footer stats */}
                    <div className="bg-slate-50 border-t px-4 py-3 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">MSTA Affiliate</span>
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 border text-[10px] font-bold">
                        {district.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto px-6">
                <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Districts Found</h3>
                <p className="text-sm text-slate-500 mt-2">
                  We couldn&apos;t find any districts matching your filters or search query.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Details Dialog */}
      <Dialog open={selectedDistrict !== null} onOpenChange={() => setSelectedDistrict(null)}>
        <DialogContent className="sm:max-w-[480px] p-6 overflow-hidden rounded-xl border border-slate-200 shadow-xl bg-white animate-in fade-in duration-200">
          {selectedDistrict && (
            <>
              <DialogHeader className="items-center pb-4 border-b border-slate-100">
                {/* Dialog Logo */}
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
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50 text-[10px] font-extrabold uppercase tracking-wider">
                    {selectedDistrict.region} Region
                  </Badge>
                  <Badge className="bg-green-50 text-green-700 border-green-200 border text-[10px] font-bold">
                    {selectedDistrict.status}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Information Rows */}
              <div className="py-4 space-y-4 text-sm text-slate-700">
                <DialogDescription className="text-xs text-slate-500 font-medium text-center italic">
                  Official Affiliated District Unit of the Maharashtra Sepaktakraw Association
                </DialogDescription>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <Building size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Association</span>
                      <p className="font-semibold text-slate-800 leading-snug">{selectedDistrict.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Affiliation status</span>
                      <p className="font-semibold text-slate-800 leading-snug">Permanently Affiliated (Active)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">District Jurisdiction</span>
                      <p className="font-semibold text-slate-800 leading-snug">{selectedDistrict.district}, Maharashtra</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Official Contact Email</span>
                      <p className="font-semibold text-slate-800 leading-snug break-all">{selectedDistrict.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
