import type { Charity } from '@/types';

export const FALLBACK_CHARITIES: Charity[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Golf for All Foundation',
    slug: 'golf-for-all',
    description:
      'Making golf accessible to underprivileged youth and people with disabilities through community programs, adaptive equipment, and free coaching.',
    short_description: 'Accessible golf programs for underprivileged youth and adaptive players.',
    image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&auto=format&fit=crop&q=80',
    logo_url: '',
    website_url: 'https://golfforall.example.org',
    category: 'Youth & Sport',
    total_received: 1425000, // in minor units (£14,250.00)
    is_featured: true,
    is_active: true,
    upcoming_events: [
      {
        title: 'Junior Summer Golf Camp',
        date: '2026-07-15',
        description: 'Two-week introductory camp for 50 young players in inner-city areas.',
      },
      {
        title: 'Adaptive Golf Championship',
        date: '2026-09-10',
        description: 'Annual competitive showcase for golfers with physical disabilities.',
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Green Fairways Environmental Trust',
    slug: 'green-fairways',
    description:
      'Partnering with golf courses across the country to restore native wildlife habitats, reduce water consumption, and eliminate toxic pesticides.',
    short_description: 'Ecological restoration and water conservation across national golf courses.',
    image_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=80',
    logo_url: '',
    website_url: 'https://greenfairways.example.org',
    category: 'Environment',
    total_received: 980000, // £9,800.00
    is_featured: true,
    is_active: true,
    upcoming_events: [
      {
        title: 'National Pollinator Corridor Initiative',
        date: '2026-06-01',
        description: 'Planting wild bee corridors across 40 championship courses.',
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Veterans on the Green',
    slug: 'veterans-on-the-green',
    description:
      'Using golf as active outdoor therapy for military veterans recovering from physical trauma and PTSD. Building strong community bonds on the fairway.',
    short_description: 'Rehabilitation, PTSD recovery, and camaraderie for armed forces veterans.',
    image_url: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800&auto=format&fit=crop&q=80',
    logo_url: '',
    website_url: 'https://veteransgreen.example.org',
    category: 'Veterans & Health',
    total_received: 2150000, // £21,500.00
    is_featured: true,
    is_active: true,
    upcoming_events: [
      {
        title: 'Heroes Cup Invitational',
        date: '2026-08-20',
        description: 'Annual charity tournament uniting veterans and PGA professionals.',
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Cancer Research UK Golf Alliance',
    slug: 'cancer-research-uk-golf',
    description:
      'Funding cutting-edge clinical trials, early screening detection, and patient support networks powered by the national golfing community.',
    short_description: 'Pioneering cancer research and support funded by golfers.',
    image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    logo_url: '',
    website_url: 'https://cancerresearchuk.example.org',
    category: 'Healthcare',
    total_received: 3840000, // £38,400.00
    is_featured: false,
    is_active: true,
    upcoming_events: [
      {
        title: 'Longest Day Golf Challenge',
        date: '2026-06-21',
        description: 'Four rounds in one day to raise vital cancer research funds.',
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Junior Links Academy',
    slug: 'junior-links-academy',
    description:
      'Providing academic tutoring, equipment subsidies, and athletic scholarships to promising junior golfers regardless of household income.',
    short_description: 'Youth scholarships, tutoring, and athletic pathways.',
    image_url: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=800&auto=format&fit=crop&q=80',
    logo_url: '',
    website_url: 'https://juniorlinks.example.org',
    category: 'Youth & Education',
    total_received: 860000, // £8,600.00
    is_featured: false,
    is_active: true,
    upcoming_events: [
      {
        title: 'College Pathway Showcase',
        date: '2026-10-05',
        description: 'Showcase tournament attended by college golf recruiters.',
      },
    ],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];
