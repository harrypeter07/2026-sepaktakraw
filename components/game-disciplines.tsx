'use client'

import { useState } from 'react'
import { Trophy, Award, ShieldCheck, Activity, Users, Flame, Info } from 'lucide-react'
import { getCdnUrl } from '@/lib/cdn-image'

export function GameDisciplines() {
  const [activeTab, setActiveTab] = useState<'disciplines' | 'specs' | 'heritage'>('disciplines')

  const disciplines = [
    {
      id: 'regu',
      title: 'Regu Event (3 vs 3)',
      tag: 'Classical Olympic Discipline',
      summary: 'The flagship event featuring 3 players per side: Tekong (Server), Feeder, and Striker / Killer.',
      rules: [
        'Played inside badminton-sized court (13.4m x 6.1m)',
        'Rally point system: 21 points per set, best of 3 sets',
        'Tekong serves from circular service ring; hands cannot touch the ball during play',
        'Acrobatic Sunback spikes and Roll spikes executed above 2-meter heights',
      ],
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'quad',
      title: 'Quadrant Event (4 vs 4)',
      tag: 'Asian Games Medal Event',
      summary: 'High-speed, tactical format with 4 players on court allowing dynamic substitutions and multi-block walls.',
      rules: [
        'Event where Indian Men National Team won historic Bronze at 2018 Asian Games',
        'Fast-paced counter-attacking rallies with coordinated 2-man blocks at the net',
        'Maximum 3 touches per side before the ball must cross the net',
        'Any player can initiate service without mandatory circle restriction',
      ],
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'team',
      title: 'Team Championship (3 Regus)',
      tag: 'Premier Inter-District Event',
      summary: 'The ultimate test of association depth pitting 3 distinct Regus (12 players) in a best-of-3 ties series.',
      rules: [
        'Conducted at Senior, Junior, and Sub-Junior State Championships',
        'Tie won by the district securing first 2 Regu victories',
        'Tests deep coaching preparation, tactical substitutions, and reserve bench strength',
        'Official basis for state squad scouting and district points trophies',
      ],
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'doubles',
      title: 'Double Event (2 vs 2)',
      tag: 'High-Endurance Precision',
      summary: 'Intense 2-player format demanding maximum stamina, rapid court coverage, and precise footwork.',
      rules: [
        'Each side fields 2 active players with 1 designated reserve',
        'Service executed from baseline behind the quarter-circle',
        'Requires lightning reflexes for defense and immediate acrobatic kill replies',
        'Contested across Men and Women divisions at State & National championships',
      ],
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'beach',
      title: 'Beach Sepaktakraw',
      tag: 'Coastal & Sand Arenas',
      summary: 'Played on beach sand courts under international ASTAF beach competition regulations.',
      rules: [
        'Court size adjusted for sand play (12m x 5m)',
        'Demands superior lower-body explosive power and sand agility',
        'Maharashtra coastal units (Mumbai, Thane, Raigad, Ratnagiri) excel in this discipline',
        'Conducted during annual state beach trophies',
      ],
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 text-xs font-black uppercase tracking-[0.25em]">
            Official ISTAF & STFI Regulations
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-slate-900 tracking-tight">
            OFFICIAL DISCIPLINES & RULES OF THE GAME
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The sport of Sepaktakraw combines the athleticism of football, the tactical geometry of volleyball, and the acrobatic grace of gymnastics.
          </p>

          {/* Navigation Pill Switcher */}
          <div className="mt-8 inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('disciplines')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'disciplines'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Event Disciplines
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'specs'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Court & Equipment Specs
            </button>
            <button
              onClick={() => setActiveTab('heritage')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'heritage'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Asian Games Heritage
            </button>
          </div>
        </div>

        {/* Tab 1: Event Disciplines */}
        {activeTab === 'disciplines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <Activity size={16} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{item.summary}</p>

                  <ul className="space-y-2 border-t border-slate-200/60 pt-4">
                    {item.rules.map((rule, rIdx) => (
                      <li key={rIdx} className="text-[11px] text-slate-700 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Court & Equipment Specifications */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-1">Court Dimensions</h4>
              <p className="text-xs text-slate-500 mb-4">ISTAF Standard Competition Court</p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Length:</strong> 13.4 meters (44 feet)</li>
                <li>• <strong>Width:</strong> 6.1 meters (20 feet)</li>
                <li>• <strong>Free Zone:</strong> Minimum 3 meters surrounding court</li>
                <li>• <strong>Service Circle:</strong> 0.3 meter radius in each court half</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-1">Official Ball Specs</h4>
              <p className="text-xs text-slate-500 mb-4">Synthetic woven fiber spherical ball</p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Men Weight:</strong> 170g to 180g (12 holes, 20 intersections)</li>
                <li>• <strong>Women Weight:</strong> 150g to 160g</li>
                <li>• <strong>Circumference:</strong> 0.41m to 0.43m (Men), 0.42m to 0.44m (Women)</li>
                <li>• <strong>Approved Brands:</strong> Gajah Emas / Marathon ASTAF certified</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base mb-1">Net & Post Height</h4>
              <p className="text-xs text-slate-500 mb-4">Precision height measurements</p>
              <ul className="text-xs text-slate-700 space-y-2">
                <li>• <strong>Men Height:</strong> 1.52m at center, 1.55m over the posts</li>
                <li>• <strong>Women Height:</strong> 1.42m at center, 1.45m over the posts</li>
                <li>• <strong>Junior Boys/Girls:</strong> 1.42m regulated net height</li>
                <li>• <strong>Net Mesh:</strong> 6cm to 8cm diamond mesh cord</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Asian Games Heritage Tribute */}
        {activeTab === 'heritage' && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase mb-3">
                  <Trophy size={14} className="text-amber-400" />
                  Historic Asian Games Milestone
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3">
                  INDIA WINS HISTORIC BRONZE AT ASIAN GAMES
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  At the 2018 Asian Games in Jakarta-Palembang, the Indian National Men Quadrant Team etched their names in sports history by winning the country first-ever Asian Games medal in Sepaktakraw.
                </p>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Congratulated by the Honble Prime Minister of India & Ministry of Youth Affairs and Sports (MYAS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>Maharashtra athletes and coaches contributed actively to national coaching camps and selection squads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span>Catalyzed grassroots expansion across all 36 districts of Maharashtra</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative aspect-[16/10] bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCdnUrl('/official/asian-games-bronze-team.jpg')}
                  alt="Indian National Sepaktakraw Team Asian Games Bronze"
                  className="w-full h-full object-cover object-center hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-4">
                  <p className="text-xs font-bold text-white">Indian National Sepaktakraw Team</p>
                  <p className="text-[10px] text-amber-300 font-semibold">Asian Games Bronze Medalists • Sepaktakraw Federation of India</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default GameDisciplines
