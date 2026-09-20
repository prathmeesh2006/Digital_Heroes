export interface PlanConfig {
  id: string;
  name: string;
  price: number; // in minor units (£10.00 = 1000)
  interval: 'month' | 'year';
  description: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    id: 'plan_monthly',
    name: 'Hero Monthly',
    price: 1000, // £10/month
    interval: 'month',
    description: 'Standard monthly membership with full draw participation and golf scoring.',
    features: [
      'Enter up to 5 Stableford scores',
      'Automatic monthly draw participation',
      'Eligible for 5, 4, and 3 number match prizes',
      'Personal charity selection & tax reporting',
      'Performance analytics & scoring history',
    ],
  },
  {
    id: 'plan_annual',
    name: 'Hero Annual',
    price: 10000, // £100/year (save £20)
    interval: 'year',
    description: '12 months for the price of 10. Ultimate value for passionate golfers.',
    features: [
      'Everything in Hero Monthly',
      '2 months free annual discount',
      'Priority scorecard verification',
      'Exclusive Annual Champion badge',
      'Direct contribution impact reports',
    ],
  },
];
