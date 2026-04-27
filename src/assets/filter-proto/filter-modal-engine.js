'use strict';

// Adapted for Angular integration.
// Call window.filterModalInit() from ngAfterViewInit after the HTML shell is rendered.

// ============================================================
// Onflo Filter Modal — Prototype
// Pre-Angular prototype for design validation.
// References @onflo/design-system tokens via CSS variables.
// ============================================================

'use strict';

// ── Filter group data ─────────────────────────────────────────
// Shape:
//   Flat group:  { id, label, icon, options: [{ id, label }] }
//   Tiered group: { id, label, icon, tiers: [{ id, label, options }] }

const FILTER_GROUPS_ASSETS = [
  // ── 1. Assets ────────────────────────────────────────────────
  {
    id: 'assets',
    label: 'Assets',
    icon: 'devices',
    tiers: [
      {
        id: 'asset-status',
        label: 'Asset Status',
        options: [
          { id: 'as-missing',         label: 'Missing' },
          { id: 'as-stolen',          label: 'Stolen' },
          { id: 'as-in-transit',      label: 'In Transit' },
          { id: 'as-in-use',          label: 'In Use' },
          { id: 'as-available',       label: 'Available' },
          { id: 'as-ready-disposal',  label: 'Ready for Disposal' },
          { id: 'as-disposed',        label: 'Disposed' },
          { id: 'as-maintenance',     label: 'Under Maintenance' },
          { id: 'as-repair',          label: 'Under Repair' },
          // Custom district-defined statuses:
          { id: 'as-pending-audit',   label: 'Pending Audit' },
          { id: 'as-on-loan',         label: 'On Loan' },
          { id: 'as-decommissioned',  label: 'Decommissioned' },
        ],
      },
      {
        id: 'asset-type',
        label: 'Asset Type',
        options: [
          { id: 'atype-chromebook',          label: 'Chromebook' },
          { id: 'atype-ipad',                label: 'iPad' },
          { id: 'atype-macbook',             label: 'MacBook' },
          { id: 'atype-windows-laptop',      label: 'Windows Laptop' },
          { id: 'atype-desktop',             label: 'Desktop Computer' },
          { id: 'atype-monitor',             label: 'Monitor' },
          { id: 'atype-interactive-display', label: 'Interactive Display' },
          { id: 'atype-projector',           label: 'Projector' },
          { id: 'atype-printer',             label: 'Printer' },
          { id: 'atype-calculator',          label: 'Graphing Calculator' },
          { id: 'atype-hotspot',             label: 'Hotspot / MiFi' },
          { id: 'atype-headset',             label: 'Headset / Headphones' },
          { id: 'atype-charging-cart',       label: 'Charging Cart' },
          { id: 'atype-barcode-scanner',     label: 'Barcode Scanner' },
          { id: 'atype-camera',              label: 'Camera' },
        ],
      },
      {
        id: 'asset-sub-type',
        label: 'Asset Sub-Type',
        options: [
          { id: 'ast-student-chromebook',  label: 'Student Chromebook' },
          { id: 'ast-teacher-chromebook',  label: 'Teacher Chromebook' },
          { id: 'ast-loaner-chromebook',   label: 'Loaner Chromebook' },
          { id: 'ast-student-ipad',        label: 'Student iPad' },
          { id: 'ast-teacher-ipad',        label: 'Teacher iPad' },
          { id: 'ast-ipad-keyboard',       label: 'iPad with Keyboard Case' },
          { id: 'ast-student-macbook-air', label: 'Student MacBook Air' },
          { id: 'ast-teacher-macbook-pro', label: 'Teacher MacBook Pro' },
          { id: 'ast-classroom-desktop',   label: 'Classroom Desktop' },
          { id: 'ast-lab-desktop',         label: 'Computer Lab Desktop' },
          { id: 'ast-staff-laptop',        label: 'Staff Laptop' },
          { id: 'ast-smartboard',          label: 'SMART Board' },
          { id: 'ast-classroom-projector', label: 'Classroom Projector' },
          { id: 'ast-laser-printer',       label: 'Laser Printer' },
          { id: 'ast-color-printer',       label: 'Color Inkjet Printer' },
        ],
      },
      {
        id: 'custom-hierarchy',
        label: 'Custom Hierarchy',
        options: [
          { id: 'ch-1to1',         label: '1:1 Initiative Device' },
          { id: 'ch-shared-pool',  label: 'Shared Pool Device' },
          { id: 'ch-title1',       label: 'Title I Equipment' },
          { id: 'ch-idea',         label: 'IDEA / Special Ed Equipment' },
          { id: 'ch-refresh-2024', label: 'Tech Refresh 2024' },
          { id: 'ch-refresh-2025', label: 'Tech Refresh 2025' },
          { id: 'ch-esser',        label: 'ESSER Grant Equipment' },
          { id: 'ch-lease',        label: 'Lease Equipment' },
          { id: 'ch-after-school', label: 'After School Program' },
        ],
      },
      {
        id: 'tags',
        label: 'Tags',
        options: [
          { id: 'tag-1to1',             label: '1:1 Device' },
          { id: 'tag-loaner-pool',      label: 'Loaner Pool' },
          { id: 'tag-repair-queue',     label: 'Repair Queue' },
          { id: 'tag-needs-case',       label: 'Needs Case' },
          { id: 'tag-ada',              label: 'ADA Compliant' },
          { id: 'tag-do-not-loan',      label: 'Do Not Loan' },
          { id: 'tag-priority-refresh', label: 'Priority Refresh' },
          { id: 'tag-surplus',          label: 'Surplus' },
          { id: 'tag-missing-charger',  label: 'Missing Charger' },
          { id: 'tag-district-lease',   label: 'District Lease' },
          { id: 'tag-classroom-set',    label: 'Classroom Set' },
        ],
      },
      {
        id: 'manufacturer',
        label: 'Manufacturer',
        options: [
          { id: 'mfr-apple',       label: 'Apple' },
          { id: 'mfr-dell',        label: 'Dell' },
          { id: 'mfr-hp',          label: 'HP' },
          { id: 'mfr-lenovo',      label: 'Lenovo' },
          { id: 'mfr-acer',        label: 'Acer' },
          { id: 'mfr-asus',        label: 'ASUS' },
          { id: 'mfr-samsung',     label: 'Samsung' },
          { id: 'mfr-microsoft',   label: 'Microsoft' },
          { id: 'mfr-epson',       label: 'Epson' },
          { id: 'mfr-benq',        label: 'BenQ' },
          { id: 'mfr-smart-tech',  label: 'SMART Technologies' },
          { id: 'mfr-brother',     label: 'Brother' },
          { id: 'mfr-logitech',    label: 'Logitech' },
          { id: 'mfr-ti',          label: 'Texas Instruments' },
        ],
      },
      {
        id: 'asset-model',
        label: 'Asset Model',
        options: [
          { id: 'model-cb-hp11',        label: 'HP Chromebook 11 G9 EE' },
          { id: 'model-cb-hp14',        label: 'HP Chromebook 14 G7' },
          { id: 'model-cb-lenovo300e',  label: 'Lenovo 300e Chromebook Gen 3' },
          { id: 'model-cb-acer311',     label: 'Acer Chromebook 311 C722' },
          { id: 'model-cb-dell3110',    label: 'Dell Chromebook 3110' },
          { id: 'model-ipad-10',        label: 'iPad (10th Gen)' },
          { id: 'model-ipad-air5',      label: 'iPad Air (5th Gen)' },
          { id: 'model-ipad-mini6',     label: 'iPad Mini (6th Gen)' },
          { id: 'model-mba-m2-13',      label: 'MacBook Air 13" (M2)' },
          { id: 'model-mba-m3',         label: 'MacBook Air 15" (M3)' },
          { id: 'model-dell-lat5430',   label: 'Dell Latitude 5430' },
          { id: 'model-hp-elite840',    label: 'HP EliteBook 840 G9' },
          { id: 'model-lenovo-e14',     label: 'Lenovo ThinkPad E14 Gen 4' },
          { id: 'model-sb-mx286',       label: 'SMART Board MX286' },
          { id: 'model-epson-eb-w52',   label: 'Epson EB-W52 Projector' },
        ],
      },
    ],
  },

  // ── 2. Assignment ─────────────────────────────────────────────
  {
    id: 'assignment',
    label: 'Assignment',
    icon: 'person_pin',
    tiers: [
      {
        id: 'assignment-type',
        label: 'Assignment Type',
        options: [
          { id: 'at-person',         label: 'Person' },
          { id: 'at-building',       label: 'Building' },
          { id: 'at-room',           label: 'Room' },
          { id: 'at-container',      label: 'Container' },
          { id: 'at-special-area',   label: 'Special Area' },
          { id: 'at-all-assigned',   label: 'All Assigned' },
          { id: 'at-all-unassigned', label: 'All Unassigned' },
        ],
      },
      {
        id: 'roles',
        label: 'Roles',
        options: [
          { id: 'role-student',        label: 'Student' },
          { id: 'role-teacher',        label: 'Teacher' },
          { id: 'role-school-admin',   label: 'School Admin' },
          { id: 'role-district-admin', label: 'District Admin' },
          { id: 'role-staff',          label: 'Staff' },
        ],
      },
      {
        id: 'grade',
        label: 'Grade',
        options: [
          { id: 'grade-prek', label: 'Pre-K' },
          { id: 'grade-k',    label: 'Kindergarten' },
          { id: 'grade-1',    label: 'Grade 1' },
          { id: 'grade-2',    label: 'Grade 2' },
          { id: 'grade-3',    label: 'Grade 3' },
          { id: 'grade-4',    label: 'Grade 4' },
          { id: 'grade-5',    label: 'Grade 5' },
          { id: 'grade-6',    label: 'Grade 6' },
          { id: 'grade-7',    label: 'Grade 7' },
          { id: 'grade-8',    label: 'Grade 8' },
          { id: 'grade-9',    label: 'Grade 9' },
          { id: 'grade-10',   label: 'Grade 10' },
          { id: 'grade-11',   label: 'Grade 11' },
          { id: 'grade-12',   label: 'Grade 12' },
        ],
      },
    ],
  },

  // ── 3. Location ───────────────────────────────────────────────
  {
    id: 'location',
    label: 'Location',
    icon: 'location_on',
    tiers: [
      {
        id: 'region',
        label: 'Region',
        options: [
          { id: 'rgn-north',   label: 'North Region' },
          { id: 'rgn-south',   label: 'South Region' },
          { id: 'rgn-east',    label: 'East Region' },
          { id: 'rgn-west',    label: 'West Region' },
          { id: 'rgn-central', label: 'Central Region' },
        ],
      },
      {
        id: 'campus',
        label: 'Campus',
        options: [
          { id: 'campus-lincoln',    label: 'Lincoln Elementary' },
          { id: 'campus-central',    label: 'Central Elementary' },
          { id: 'campus-garfield',   label: 'Garfield Elementary' },
          { id: 'campus-washington', label: 'Washington Middle School' },
          { id: 'campus-roosevelt',  label: 'Roosevelt Middle School' },
          { id: 'campus-jefferson',  label: 'Jefferson High School' },
          { id: 'campus-district',   label: 'District Office' },
          { id: 'campus-depot',      label: 'IT Depot' },
        ],
      },
      {
        id: 'building',
        label: 'Building',
        options: [
          { id: 'bldg-main-lin',   label: 'Lincoln – Main Building' },
          { id: 'bldg-annex-lin',  label: 'Lincoln – Annex' },
          { id: 'bldg-main-was',   label: 'Washington – Main Building' },
          { id: 'bldg-gym-was',    label: 'Washington – Gymnasium' },
          { id: 'bldg-main-jef',   label: 'Jefferson – Main Building' },
          { id: 'bldg-stem-jef',   label: 'Jefferson – STEM Wing' },
          { id: 'bldg-arts-jef',   label: 'Jefferson – Arts Building' },
          { id: 'bldg-admin-dist', label: 'District – Administration Bldg' },
        ],
      },
      {
        id: 'room',
        label: 'Room',
        options: [
          { id: 'room-101',        label: 'Room 101 – Kindergarten' },
          { id: 'room-102',        label: 'Room 102 – Grade 1' },
          { id: 'room-comp-lab-a', label: 'Computer Lab A' },
          { id: 'room-comp-lab-b', label: 'Computer Lab B' },
          { id: 'room-stem-lab',   label: 'STEM Lab' },
          { id: 'room-sci-lab',    label: 'Science Lab' },
          { id: 'room-media-ctr',  label: 'Library / Media Center' },
          { id: 'room-main-office',label: 'Main Office' },
          { id: 'room-it-dept',    label: 'IT Department' },
          { id: 'room-conf-a',     label: 'Conference Room A' },
        ],
      },
      {
        id: 'container',
        label: 'Container',
        options: [
          { id: 'cont-ipad-a1',   label: 'iPad Cart A-1' },
          { id: 'cont-ipad-a2',   label: 'iPad Cart A-2' },
          { id: 'cont-cb-b1',     label: 'Chromebook Cart B-1' },
          { id: 'cont-cb-b2',     label: 'Chromebook Cart B-2' },
          { id: 'cont-cb-b3',     label: 'Chromebook Cart B-3' },
          { id: 'cont-loaner-1',  label: 'Loaner Cart 1' },
          { id: 'cont-loaner-2',  label: 'Loaner Cart 2' },
          { id: 'cont-storage-a', label: 'Storage Box A' },
          { id: 'cont-storage-b', label: 'Storage Box B' },
        ],
      },
      {
        id: 'special-area',
        label: 'Special Area',
        options: [
          { id: 'sa-library',     label: 'Library / Media Center' },
          { id: 'sa-gymnasium',   label: 'Gymnasium' },
          { id: 'sa-cafeteria',   label: 'Cafeteria' },
          { id: 'sa-auditorium',  label: 'Auditorium' },
          { id: 'sa-it-depot',    label: 'IT Depot / Warehouse' },
          { id: 'sa-after-school',label: 'After School Room' },
          { id: 'sa-special-ed',  label: 'Special Education Center' },
          { id: 'sa-counseling',  label: 'Counseling Suite' },
        ],
      },
    ],
  },

  // ── 4. Financial ──────────────────────────────────────────────
  {
    id: 'financial',
    label: 'Financial',
    icon: 'attach_money',
    tiers: [
      {
        id: 'supplier',
        label: 'Supplier',
        options: [
          { id: 'sup-cdwg',       label: 'CDW-G' },
          { id: 'sup-shi',        label: 'SHI Government Solutions' },
          { id: 'sup-apple-edu',  label: 'Apple Education' },
          { id: 'sup-insight',    label: 'Insight Public Sector' },
          { id: 'sup-connection', label: 'Connection (PCM Gov)' },
          { id: 'sup-amazon-biz', label: 'Amazon Business' },
          { id: 'sup-bbedu',      label: 'Best Buy Education' },
          { id: 'sup-zones',      label: 'Zones' },
          { id: 'sup-bh',         label: 'B&H Photo / Video' },
        ],
      },
      {
        id: 'funding-source',
        label: 'Funding Source',
        options: [
          { id: 'fund-general',      label: 'General Fund' },
          { id: 'fund-title1',       label: 'Title I' },
          { id: 'fund-title4',       label: 'Title IV' },
          { id: 'fund-erate',        label: 'E-Rate' },
          { id: 'fund-idea',         label: 'IDEA' },
          { id: 'fund-esser1',       label: 'ESSER I' },
          { id: 'fund-esser2',       label: 'ESSER II' },
          { id: 'fund-esser3',       label: 'ESSER III' },
          { id: 'fund-state-grant',  label: 'State Technology Grant' },
          { id: 'fund-bond',         label: 'Local Bond Measure' },
          { id: 'fund-pta',          label: 'PTA / Booster Donation' },
        ],
      },
      {
        id: 'total-cost',
        label: 'Total Cost',
        type: 'cost-range',
        min: 0,
        max: 5000,
        step: 50,
      },
    ],
  },

  // ── 5. Dates ──────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Dates',
    icon: 'calendar_today',
    tiers: [
      { id: 'date-created',  label: 'Created Date',      type: 'date-range' },
      { id: 'date-purchase', label: 'Purchase Date',     type: 'date-range' },
      { id: 'date-delivery', label: 'Delivery Date',     type: 'date-range' },
      { id: 'date-warranty', label: 'Warranty End Date', type: 'date-range' },
    ],
  },

  // ── 6. Loans ──────────────────────────────────────────────────
  {
    id: 'loans',
    label: 'Loans',
    icon: 'swap_horiz',
    tiers: [
      {
        id: 'loan-status',
        label: 'Loan Status',
        options: [
          { id: 'ls-loaned',    label: 'Loaned' },
          { id: 'ls-available', label: 'Available for Loan' },
          { id: 'ls-not-avail', label: 'Not Available for Loan' },
        ],
      },
      { id: 'date-loan-on',     label: 'Loan On',     type: 'date-range' },
      { id: 'date-loan-expiry', label: 'Loan Expiry', type: 'date-range' },
    ],
  },
];

// ── Service Overview filter groups ───────────────────────────────────────
const FILTER_GROUPS_SERVICE_OVERVIEW = [

  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',              label: 'Today' },
      { id: 'dp-last-7-days',        label: 'Last 7 days' },
      { id: 'dp-last-30-days',       label: 'Last 30 days' },
      { id: 'dp-last-90-days',       label: 'Last 90 days' },
      { id: 'dp-this-week',          label: 'This week' },
      { id: 'dp-this-month',         label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Ticket ─────────────────────────────────────────────────
  {
    id: 'ticket',
    label: 'Ticket',
    icon: 'confirmation_number',
    tiers: [
      {
        id: 'ticket-type',
        label: 'Ticket Type',
        options: [
          { id: 'tt-question',   label: 'Question' },
          { id: 'tt-comment',    label: 'Comment' },
          { id: 'tt-suggestion', label: 'Suggestion' },
          { id: 'tt-concern',    label: 'Concern' },
          { id: 'tt-compliment', label: 'Compliment' },
        ],
      },
      {
        id: 'ticket-status',
        label: 'Ticket Status',
        options: [
          { id: 'ts-critical',  label: 'Critical' },
          { id: 'ts-p1-high',   label: 'P1 High' },
          { id: 'ts-p2-normal', label: 'P2 Normal' },
          { id: 'ts-p3-low',    label: 'P3 Low' },
        ],
      },
      {
        id: 'ticket-age',
        label: 'Ticket Age',
        type: 'numeric-range',
        min: 0,
        max: 32,
        step: 1,
        unit: 'days',
        maxLabel: '32+',
      },
      {
        id: 'cx-score',
        label: 'CX Score',
        type: 'numeric-range',
        min: 0,
        max: 10,
        step: 1,
        unit: '',
      },
      {
        id: 'ticket-owner',
        label: 'Ticket Owner',
        options: [
          { id: 'to-sarah-chen',    label: 'Sarah Chen' },
          { id: 'to-marcus-hayes',  label: 'Marcus Hayes' },
          { id: 'to-priya-patel',   label: 'Priya Patel' },
          { id: 'to-james-okonkwo', label: 'James Okonkwo' },
          { id: 'to-linda-reyes',   label: 'Linda Reyes' },
          { id: 'to-derek-wu',      label: 'Derek Wu' },
          { id: 'to-unassigned',    label: 'Unassigned' },
        ],
      },
      {
        id: 'svc-tags',
        label: 'Tags',
        options: [
          { id: 'stag-escalated',    label: 'Escalated' },
          { id: 'stag-follow-up',    label: 'Follow-up Required' },
          { id: 'stag-after-hours',  label: 'After Hours' },
          { id: 'stag-parent-cb',    label: 'Parent Callback' },
          { id: 'stag-data-request', label: 'Data Request' },
          { id: 'stag-tech-issue',   label: 'Tech Issue' },
          { id: 'stag-transport',    label: 'Transportation' },
          { id: 'stag-covid',        label: 'COVID-Related' },
        ],
      },
    ],
  },

  // ── 3. Customer ───────────────────────────────────────────────
  {
    id: 'customer',
    label: 'Customer',
    icon: 'person',
    tiers: [
      {
        id: 'customer-type',
        label: 'Customer Type',
        options: [
          { id: 'ct-student',   label: 'Student' },
          { id: 'ct-employee',  label: 'Employee' },
          { id: 'ct-parent',    label: 'Parent / Guardian' },
          { id: 'ct-community', label: 'Community Member' },
          { id: 'ct-other',     label: 'Other' },
          // Custom district-defined types:
          { id: 'ct-volunteer', label: 'Volunteer' },
          { id: 'ct-vendor',    label: 'Vendor' },
          { id: 'ct-board',     label: 'Board Member' },
        ],
      },
      {
        id: 'language',
        label: 'Language',
        options: [
          { id: 'lang-ar', label: 'Arabic' },
          { id: 'lang-zh', label: 'Chinese (Simplified)' },
          { id: 'lang-en', label: 'English' },
          { id: 'lang-fr', label: 'French' },
          { id: 'lang-hi', label: 'Hindi' },
          { id: 'lang-pl', label: 'Polish' },
          { id: 'lang-ru', label: 'Russian' },
          { id: 'lang-so', label: 'Somali' },
          { id: 'lang-es', label: 'Spanish' },
          { id: 'lang-uk', label: 'Ukrainian' },
          { id: 'lang-ur', label: 'Urdu' },
        ],
      },
    ],
  },

  // ── 4. Topic ──────────────────────────────────────────────────
  // Hierarchical: categories (tiers) → topics (options).
  // All content is district-customized — placeholders represent realistic examples.
  {
    id: 'topic',
    label: 'Topic',
    icon: 'layers',
    tiers: [
      {
        id: 'topic-academics',
        label: 'Academics',
        options: [
          { id: 'top-grades',     label: 'Grades & Report Cards' },
          { id: 'top-curriculum', label: 'Curriculum Questions' },
          { id: 'top-hw-help',    label: 'Homework Help' },
          { id: 'top-testing',    label: 'Standardized Testing' },
          { id: 'top-special-ed', label: 'Special Education' },
        ],
      },
      {
        id: 'topic-enrollment',
        label: 'Enrollment & Attendance',
        options: [
          { id: 'top-enroll',     label: 'Enrollment Process' },
          { id: 'top-withdrawal', label: 'Withdrawal / Transfer' },
          { id: 'top-attendance', label: 'Attendance Questions' },
          { id: 'top-tardies',    label: 'Tardies & Absences' },
        ],
      },
      {
        id: 'topic-facilities',
        label: 'Facilities & Safety',
        options: [
          { id: 'top-facility',  label: 'Facility Concern' },
          { id: 'top-safety',    label: 'Safety / Bullying' },
          { id: 'top-food',      label: 'Food Services' },
          { id: 'top-transport', label: 'Transportation' },
        ],
      },
      {
        id: 'topic-tech',
        label: 'Technology',
        options: [
          { id: 'top-device',    label: 'Device Issue' },
          { id: 'top-login',     label: 'Login / Password Reset' },
          { id: 'top-app',       label: 'App / Software Access' },
          { id: 'top-wifi',      label: 'Wi-Fi / Connectivity' },
        ],
      },
    ],
  },

  // ── 5. Routing ────────────────────────────────────────────────
  {
    id: 'routing',
    label: 'Routing',
    icon: 'route',
    tiers: [
      {
        id: 'entry-point',
        label: 'Entry Point',
        options: [
          { id: 'ep-website',   label: 'District Website' },
          { id: 'ep-email',     label: 'Email' },
          { id: 'ep-phone',     label: 'Phone' },
          { id: 'ep-recorder',  label: 'Recorder' },
          { id: 'ep-cx-app',    label: 'Customer App' },
          { id: 'ep-text',      label: 'Text' },
          { id: 'ep-chatbot',   label: 'Chatbot' },
          { id: 'ep-live-chat', label: 'Live Chat' },
          { id: 'ep-global',    label: 'Global Ticket' },
          { id: 'ep-portal',    label: 'Customer Portal' },
        ],
      },
      {
        id: 'landing-page',
        label: 'Landing Page',
        options: [
          { id: 'lp-home',      label: 'Homepage' },
          { id: 'lp-it',        label: 'IT Support' },
          { id: 'lp-hr',        label: 'Human Resources' },
          { id: 'lp-registrar', label: 'Registrar' },
          { id: 'lp-finance',   label: 'Finance' },
          { id: 'lp-nutrition', label: 'Nutrition Services' },
          { id: 'lp-transport', label: 'Transportation' },
          { id: 'lp-comm',      label: 'Communications' },
        ],
      },
      {
        id: 'tab',
        label: 'Tab',
        options: [
          { id: 'tab-general',   label: 'General' },
          { id: 'tab-academic',  label: 'Academic' },
          { id: 'tab-it',        label: 'IT / Tech Support' },
          { id: 'tab-hr',        label: 'HR' },
          { id: 'tab-facilities',label: 'Facilities' },
          { id: 'tab-parents',   label: 'Parents' },
        ],
      },
    ],
  },

  // ── 6. Actions ────────────────────────────────────────────────
  {
    id: 'actions',
    label: 'Actions',
    icon: 'task_alt',
    tiers: [
      {
        id: 'action-taken',
        label: 'Action Taken',
        options: [
          { id: 'act-phone',      label: 'Phone Call' },
          { id: 'act-blog',       label: 'Blog Post' },
          { id: 'act-email',      label: 'Email' },
          { id: 'act-letter',     label: 'Letter' },
          { id: 'act-meeting',    label: 'In-Person Meeting' },
          { id: 'act-newsletter', label: 'Newsletter' },
          { id: 'act-oped',       label: 'Op Ed' },
          { id: 'act-speech',     label: 'Speech' },
          { id: 'act-other',      label: 'Other' },
          { id: 'act-none',       label: 'None' },
        ],
      },
    ],
  },
];

// ── Chatbot: Overview ─────────────────────────────────────────
const FILTER_GROUPS_CHATBOT_OVERVIEW = [

  // ── 1. Dates ──────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Languages ──────────────────────────────────────────────
  {
    id: 'language',
    label: 'Languages',
    icon: 'language',
    options: [
      { id: 'lang-en', label: 'English' },
      { id: 'lang-ar', label: 'Arabic' },
      { id: 'lang-zh', label: 'Chinese (Simplified)' },
      { id: 'lang-fr', label: 'French' },
      { id: 'lang-es', label: 'Spanish' },
      { id: 'lang-ru', label: 'Russian' },
      { id: 'lang-so', label: 'Somali' },
      { id: 'lang-ur', label: 'Urdu' },
      { id: 'lang-pl', label: 'Polish' },
      { id: 'lang-hi', label: 'Hindi' },
      { id: 'lang-uk', label: 'Ukrainian' },
    ],
  },

  // ── 3. Profiles (client-configured, dynamic in production) ────
  {
    id: 'profiles',
    label: 'Profiles',
    icon: 'manage_accounts',
    options: [
      { id: 'prof-default',    label: 'Default' },
      { id: 'prof-elementary', label: 'Elementary School' },
      { id: 'prof-middle',     label: 'Middle School' },
      { id: 'prof-high',       label: 'High School' },
      { id: 'prof-district',   label: 'District Office' },
    ],
  },

  // ── 4. Embeds (client-configured, dynamic in production) ──────
  {
    id: 'embeds',
    label: 'Embeds',
    icon: 'web',
    options: [
      { id: 'emb-homepage',  label: 'Homepage' },
      { id: 'emb-it',        label: 'IT Support' },
      { id: 'emb-hr',        label: 'Human Resources' },
      { id: 'emb-registrar', label: 'Registrar' },
      { id: 'emb-finance',   label: 'Finance' },
      { id: 'emb-nutrition', label: 'Nutrition Services' },
      { id: 'emb-transport', label: 'Transportation' },
    ],
  },
];

// ── Chatbot: Optimization ─────────────────────────────────────
const FILTER_GROUPS_CHATBOT_OPTIMIZATION = [
  {
    id: 'date',
    label: 'Date',
    icon: 'calendar_today',
    tiers: [
      { id: 'date-session', label: 'Session Date', type: 'date-range' },
    ],
  },
  {
    id: 'intent',
    label: 'Intent',
    icon: 'psychology',
    tiers: [
      {
        id: 'intent-group',
        label: 'Intent Group',
        options: [
          { id: 'ig-academics',  label: 'Academics' },
          { id: 'ig-enrollment', label: 'Enrollment' },
          { id: 'ig-technology', label: 'Technology' },
          { id: 'ig-facilities', label: 'Facilities & Safety' },
          { id: 'ig-payments',   label: 'Payments' },
          { id: 'ig-hr',         label: 'HR & Staff' },
          { id: 'ig-events',     label: 'Events & Activities' },
          { id: 'ig-other',      label: 'Other' },
        ],
      },
      {
        id: 'confidence',
        label: 'Confidence Level',
        options: [
          { id: 'conf-high',    label: 'High (≥ 90%)' },
          { id: 'conf-medium',  label: 'Medium (70–89%)' },
          { id: 'conf-low',     label: 'Low (< 70%)' },
          { id: 'conf-fallback',label: 'Fallback' },
        ],
      },
      {
        id: 'matched-status',
        label: 'Match Status',
        options: [
          { id: 'ms-matched',    label: 'Intent Matched' },
          { id: 'ms-unmatched',  label: 'No Match' },
          { id: 'ms-partial',    label: 'Partial Match' },
          { id: 'ms-escalated',  label: 'Escalated to Agent' },
        ],
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: 'insights',
    tiers: [
      {
        id: 'deflection',
        label: 'Deflection Outcome',
        options: [
          { id: 'def-self-served',   label: 'Self-Served' },
          { id: 'def-ticket-created',label: 'Ticket Created' },
          { id: 'def-live-chat',     label: 'Transferred to Live Chat' },
          { id: 'def-abandoned',     label: 'Session Abandoned' },
          { id: 'def-call',          label: 'Prompted to Call' },
        ],
      },
      {
        id: 'session-rating',
        label: 'Session Rating',
        options: [
          { id: 'sr-5',       label: '5 Stars' },
          { id: 'sr-4',       label: '4 Stars' },
          { id: 'sr-3',       label: '3 Stars' },
          { id: 'sr-2',       label: '2 Stars' },
          { id: 'sr-1',       label: '1 Star' },
          { id: 'sr-no-rate', label: 'Not Rated' },
        ],
      },
      {
        id: 'turn-count',
        label: 'Turn Count',
        type: 'numeric-range',
        min: 1,
        max: 30,
        step: 1,
        unit: 'turns',
        maxLabel: '30+',
      },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: 'person',
    tiers: [
      {
        id: 'customer-type',
        label: 'Customer Type',
        options: [
          { id: 'ct-student',   label: 'Student' },
          { id: 'ct-employee',  label: 'Employee' },
          { id: 'ct-parent',    label: 'Parent / Guardian' },
          { id: 'ct-community', label: 'Community Member' },
          { id: 'ct-other',     label: 'Other' },
          { id: 'ct-volunteer', label: 'Volunteer' },
          { id: 'ct-vendor',    label: 'Vendor' },
          { id: 'ct-board',     label: 'Board Member' },
        ],
      },
    ],
  },
];

// ── Chatbot: Chat Logs ────────────────────────────────────────
const FILTER_GROUPS_CHATBOT_CHAT_LOGS = [

  // ── 1. Date (date-preset — same full option set as other dashboards) ──
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Message — per-exchange content filters ─────────────────
  {
    id: 'message',
    label: 'Message',
    icon: 'forum',
    tiers: [
      { id: 'cl-time',     label: 'Time of Day', type: 'time-range', min: 0, max: 1439, step: 15 },
      { id: 'cl-question', label: 'Question',    type: 'text-match' },
      { id: 'cl-response', label: 'Response',    type: 'text-match' },
      {
        id: 'cl-answered',
        label: 'Answered',
        options: [
          { id: 'ans-yes', label: 'Yes' },
          { id: 'ans-no',  label: 'No' },
        ],
      },
      {
        id: 'cl-rating',
        label: 'Rating',
        options: [
          { id: 'rat-helpful',   label: 'Helpful' },
          { id: 'rat-unhelpful', label: 'Unhelpful' },
          { id: 'rat-none',      label: 'No Rating' },
        ],
      },
    ],
  },

  // ── 3. Language ───────────────────────────────────────────────
  {
    id: 'language',
    label: 'Language',
    icon: 'language',
    options: [
      { id: 'lang-ar', label: 'Arabic' },
      { id: 'lang-zh', label: 'Chinese (Simplified)' },
      { id: 'lang-en', label: 'English' },
      { id: 'lang-fr', label: 'French' },
      { id: 'lang-hi', label: 'Hindi' },
      { id: 'lang-pl', label: 'Polish' },
      { id: 'lang-ru', label: 'Russian' },
      { id: 'lang-so', label: 'Somali' },
      { id: 'lang-es', label: 'Spanish' },
      { id: 'lang-uk', label: 'Ukrainian' },
      { id: 'lang-ur', label: 'Urdu' },
    ],
  },

  // ── 4. Deployment — client-configured / session context ───────
  {
    id: 'deployment',
    label: 'Deployment',
    icon: 'deployed_code',
    tiers: [
      {
        id: 'cl-profiles',
        label: 'Profile',
        options: [
          { id: 'prof-default',    label: 'Default' },
          { id: 'prof-elementary', label: 'Elementary School' },
          { id: 'prof-middle',     label: 'Middle School' },
          { id: 'prof-high',       label: 'High School' },
          { id: 'prof-district',   label: 'District Office' },
        ],
      },
      {
        id: 'cl-embeds',
        label: 'Embed',
        options: [
          { id: 'emb-homepage',  label: 'Homepage' },
          { id: 'emb-it',        label: 'IT Support' },
          { id: 'emb-hr',        label: 'Human Resources' },
          { id: 'emb-registrar', label: 'Registrar' },
          { id: 'emb-finance',   label: 'Finance' },
          { id: 'emb-nutrition', label: 'Nutrition Services' },
          { id: 'emb-transport', label: 'Transportation' },
        ],
      },
      {
        id: 'cl-theme',
        label: 'Theme',
        options: [
          { id: 'thm-light',        label: 'Light' },
          { id: 'thm-dark',         label: 'Dark' },
          { id: 'thm-system',       label: 'System Default' },
          { id: 'thm-high-contrast', label: 'High Contrast' },
        ],
      },
      {
        id: 'cl-origin',
        label: 'Origin',
        options: [
          { id: 'orig-external', label: 'External' },
          { id: 'orig-internal', label: 'Internal' },
        ],
      },
    ],
  },
];

// ── Call Center — CSAT filter groups ─────────────────────────
// Districts, queues, and topics are dynamic per-client — options below are
// representative placeholders until the real API feeds are wired.
const FILTER_GROUPS_CALL_CENTER_CSAT = [

  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Phone Line ─────────────────────────────────────────────
  // Dynamic — populated from client phone line configuration.
  // Each option label is the line name; the number is shown as sublabel on prod.
  {
    id: 'phone-line',
    label: 'Phone Line',
    icon: 'phone',
    options: [
      { id: 'line-hr',            label: 'HR Line',            sublabel: '15715204113' },
      { id: 'line-missing-child', label: 'Missing Child Line', sublabel: '15715204114' },
      { id: 'line-main',          label: 'Main Office Line',   sublabel: '15715204115' },
      { id: 'line-enrollment',    label: 'Enrollment Line',    sublabel: '15715204116' },
      { id: 'line-transport',     label: 'Transportation Line', sublabel: '15715204117' },
    ],
  },

  // ── 3. Queue ──────────────────────────────────────────────────
  // Dynamic — populated from client queue configuration
  {
    id: 'queue',
    label: 'Queue',
    icon: 'support_agent',
    options: [
      { id: 'queue-general',        label: 'General Inquiries' },
      { id: 'queue-enrollment',     label: 'Enrollment' },
      { id: 'queue-transportation', label: 'Transportation' },
      { id: 'queue-special-ed',     label: 'Special Education' },
      { id: 'queue-nutrition',      label: 'Nutrition Services' },
      { id: 'queue-hr',             label: 'Human Resources' },
      { id: 'queue-tech',           label: 'Technology Support' },
    ],
  },

  // ── 4. Topic ──────────────────────────────────────────────────
  // Hierarchical: categories (tiers) → topics (options).
  // All content is district-customized — placeholders represent realistic examples.
  {
    id: 'topic',
    label: 'Topic',
    icon: 'layers',
    tiers: [
      {
        id: 'topic-academics',
        label: 'Academics',
        options: [
          { id: 'top-grades',     label: 'Grades & Report Cards' },
          { id: 'top-curriculum', label: 'Curriculum Questions' },
          { id: 'top-special-ed', label: 'Special Education' },
          { id: 'top-testing',    label: 'Standardized Testing' },
        ],
      },
      {
        id: 'topic-enrollment',
        label: 'Enrollment & Attendance',
        options: [
          { id: 'top-enroll',     label: 'Enrollment Process' },
          { id: 'top-withdrawal', label: 'Withdrawal / Transfer' },
          { id: 'top-attendance', label: 'Attendance Questions' },
          { id: 'top-tardies',    label: 'Tardies & Absences' },
        ],
      },
      {
        id: 'topic-facilities',
        label: 'Facilities & Safety',
        options: [
          { id: 'top-facility',  label: 'Facility Concern' },
          { id: 'top-safety',    label: 'Safety / Bullying' },
          { id: 'top-food',      label: 'Food Services' },
          { id: 'top-transport', label: 'Transportation' },
        ],
      },
      {
        id: 'topic-tech',
        label: 'Technology',
        options: [
          { id: 'top-device', label: 'Device Issue' },
          { id: 'top-login',  label: 'Login / Password Reset' },
          { id: 'top-app',    label: 'App / Software Access' },
          { id: 'top-wifi',   label: 'Wi-Fi / Connectivity' },
        ],
      },
    ],
  },

];

// ── Call Center — Call Details filter groups ──────────────────
// Customer, Agent, Queue, District Number, and Topic are dynamic
// per-client — options below are representative placeholders.
const FILTER_GROUPS_CALL_DETAILS = [

  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Call ───────────────────────────────────────────────────
  // Start time, direction, result, and all duration ranges.
  {
    id: 'cd-call',
    label: 'Call',
    icon: 'call',
    tiers: [
      { id: 'cd-time-of-day', label: 'Start Time', type: 'time-range', min: 0, max: 1439, step: 15 },
      {
        id: 'cd-direction',
        label: 'Direction',
        options: [
          { id: 'dir-incoming',       label: 'Incoming' },
          { id: 'dir-outgoing',       label: 'Outgoing' },
          { id: 'dir-callback',       label: 'Callback' },
          { id: 'dir-queue-transfer', label: 'Queue Transfer' },
        ],
      },
      {
        id: 'cd-result',
        label: 'Result',
        options: [
          { id: 'res-handled',             label: 'Handled' },
          { id: 'res-internal-transfer',   label: 'Internal Transfer' },
          { id: 'res-external-transfer',   label: 'External Transfer' },
          { id: 'res-abandoned-ivr',       label: 'Abandoned (in IVR)' },
          { id: 'res-abandoned-no-agents', label: 'Abandoned (agents unavailable)' },
          { id: 'res-abandoned-queue',     label: 'Abandoned (in queue)' },
          { id: 'res-abandoned-greeting',  label: 'Abandoned (missed call greeting)' },
          { id: 'res-abandoned-hours',     label: 'Abandoned (business hours)' },
          { id: 'res-voicemail-no-agents', label: 'Voicemail (agents unavailable)' },
          { id: 'res-voicemail-hours',     label: 'Voicemail (business hours)' },
        ],
      },
      { id: 'cd-duration',       label: 'Duration',          type: 'numeric-range', min: 0, max: 60, step: 1, unit: 'min', maxLabel: '60+' },
      { id: 'cd-queue-duration', label: 'Queue Duration',    type: 'numeric-range', min: 0, max: 30, step: 1, unit: 'min', maxLabel: '30+' },
      { id: 'cd-oncall-duration',label: 'On Call Duration',  type: 'numeric-range', min: 0, max: 60, step: 1, unit: 'min', maxLabel: '60+' },
    ],
  },

  // ── 3. People ─────────────────────────────────────────────────
  // Customer and agent — both dynamic in production.
  {
    id: 'cd-people',
    label: 'People',
    icon: 'group',
    tiers: [
      {
        id: 'cd-customer',
        label: 'Customer',
        options: [
          { id: 'cust-dyn-1',   label: 'Jane Smith' },
          { id: 'cust-dyn-2',   label: 'Robert Johnson' },
          { id: 'cust-dyn-3',   label: 'Maria Garcia' },
          { id: 'cust-dyn-4',   label: 'David Lee' },
          { id: 'cust-unknown', label: 'Unknown Caller' },
        ],
      },
      {
        id: 'cd-agent',
        label: 'Agent',
        options: [
          { id: 'agt-sarah-chen',    label: 'Sarah Chen' },
          { id: 'agt-marcus-hayes',  label: 'Marcus Hayes' },
          { id: 'agt-priya-patel',   label: 'Priya Patel' },
          { id: 'agt-james-okonkwo', label: 'James Okonkwo' },
          { id: 'agt-linda-reyes',   label: 'Linda Reyes' },
          { id: 'agt-derek-wu',      label: 'Derek Wu' },
        ],
      },
    ],
  },

  // ── 4. Features ───────────────────────────────────────────────
  {
    id: 'cd-features',
    label: 'Features',
    icon: 'tune',
    tiers: [
      {
        id: 'cd-ai-agent',
        label: 'AI Agent',
        options: [
          { id: 'ai-yes', label: 'Has AI Agent' },
          { id: 'ai-no',  label: 'No AI Agent' },
        ],
      },
      {
        id: 'cd-call-notes',
        label: 'Call Notes',
        options: [
          { id: 'notes-yes', label: 'Has call notes' },
          { id: 'notes-no',  label: 'No call notes' },
        ],
      },
      {
        id: 'cd-recording',
        label: 'Recording',
        options: [
          { id: 'rec-yes', label: 'Has recording' },
          { id: 'rec-no',  label: 'No recording' },
        ],
      },
    ],
  },

  // ── 5. Routing ────────────────────────────────────────────────
  // Queue and district — both dynamic in production.
  {
    id: 'cd-routing',
    label: 'Routing',
    icon: 'account_tree',
    tiers: [
      {
        id: 'cd-queue',
        label: 'Queue',
        options: [
          { id: 'cdq-general',        label: 'General Inquiries' },
          { id: 'cdq-enrollment',     label: 'Enrollment' },
          { id: 'cdq-transportation', label: 'Transportation' },
          { id: 'cdq-special-ed',     label: 'Special Education' },
          { id: 'cdq-nutrition',      label: 'Nutrition Services' },
          { id: 'cdq-hr',             label: 'Human Resources' },
          { id: 'cdq-tech',           label: 'Technology Support' },
        ],
      },
      {
        id: 'cd-district',
        label: 'District Number',
        options: [
          { id: 'dist-1001', label: 'Northside Unified',      sublabel: '1001' },
          { id: 'dist-1002', label: 'Westfield Elementary',   sublabel: '1002' },
          { id: 'dist-1003', label: 'Lakeview Middle School', sublabel: '1003' },
          { id: 'dist-1004', label: 'Central High School',    sublabel: '1004' },
          { id: 'dist-1005', label: 'Riverside District',     sublabel: '1005' },
        ],
      },
    ],
  },

  // ── 6. Topic ──────────────────────────────────────────────────
  // Hierarchical: categories (tiers) → topics (options).
  // All content is district-customized — placeholders represent realistic examples.
  {
    id: 'topic',
    label: 'Topic',
    icon: 'layers',
    tiers: [
      {
        id: 'topic-academics',
        label: 'Academics',
        options: [
          { id: 'top-grades',     label: 'Grades & Report Cards' },
          { id: 'top-curriculum', label: 'Curriculum Questions' },
          { id: 'top-special-ed', label: 'Special Education' },
          { id: 'top-testing',    label: 'Standardized Testing' },
        ],
      },
      {
        id: 'topic-enrollment',
        label: 'Enrollment & Attendance',
        options: [
          { id: 'top-enroll',     label: 'Enrollment Process' },
          { id: 'top-withdrawal', label: 'Withdrawal / Transfer' },
          { id: 'top-attendance', label: 'Attendance Questions' },
          { id: 'top-tardies',    label: 'Tardies & Absences' },
        ],
      },
      {
        id: 'topic-facilities',
        label: 'Facilities & Safety',
        options: [
          { id: 'top-facility',  label: 'Facility Concern' },
          { id: 'top-safety',    label: 'Safety / Bullying' },
          { id: 'top-food',      label: 'Food Services' },
          { id: 'top-transport', label: 'Transportation' },
        ],
      },
      {
        id: 'topic-tech',
        label: 'Technology',
        options: [
          { id: 'top-device', label: 'Device Issue' },
          { id: 'top-login',  label: 'Login / Password Reset' },
          { id: 'top-app',    label: 'App / Software Access' },
          { id: 'top-wifi',   label: 'Wi-Fi / Connectivity' },
        ],
      },
    ],
  },

];

// ── Call Center — Agent Status filter groups ──────────────────
const FILTER_GROUPS_CALL_CENTER_AGENT_STATUS = [

  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Status ─────────────────────────────────────────────────
  {
    id: 'as-status-group',
    label: 'Status',
    icon: 'circle',
    tiers: [
      {
        id: 'as-status',
        label: 'Status',
        options: [
          { id: 'as-status-offline',     label: 'Offline' },
          { id: 'as-status-unavailable', label: 'Unavailable' },
          { id: 'as-status-available',   label: 'Available' },
          { id: 'as-status-engaged',     label: 'Engaged' },
        ],
      },
      {
        id: 'as-changed-by',
        label: 'Status Changed By',
        options: [
          { id: 'changed-by-agent',  label: 'Agent' },
          { id: 'changed-by-admin',  label: 'Admin' },
          { id: 'changed-by-system', label: 'System' },
        ],
      },
    ],
  },

  // ── 3. Agents ─────────────────────────────────────────────────
  // Dynamic — populated from client agent roster in production.
  {
    id: 'as-agent',
    label: 'Agents',
    icon: 'group',
    options: [
      { id: 'agt-sarah-chen',    label: 'Sarah Chen' },
      { id: 'agt-marcus-hayes',  label: 'Marcus Hayes' },
      { id: 'agt-priya-patel',   label: 'Priya Patel' },
      { id: 'agt-james-okonkwo', label: 'James Okonkwo' },
      { id: 'agt-linda-reyes',   label: 'Linda Reyes' },
      { id: 'agt-derek-wu',      label: 'Derek Wu' },
    ],
  },

];

// ── Fees filter groups ────────────────────────────────────────
const FILTER_GROUPS_FEES = [
  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'fee-dates',
    label: 'Date',
    icon: 'calendar_today',
    tiers: [
      { id: 'date-created',      label: 'Created Date',      type: 'date-range' },
      { id: 'date-last-updated', label: 'Last Updated Date', type: 'date-range' },
    ],
  },

  // ── 2. Fee ───────────────────────────────────────────────────
  {
    id: 'fee',
    label: 'Fee',
    icon: 'receipt',
    tiers: [
      { id: 'fee-name', label: 'Fee Name', type: 'text-match' },
      {
        id: 'fee-type',
        label: 'Fee Type',
        options: [
          { id: 'ft-parts', label: 'Parts' },
          { id: 'ft-fee',   label: 'Fee' },
        ],
      },
      {
        id: 'fee-status',
        label: 'Status',
        options: [
          { id: 'fs-open',        label: 'Open' },
          { id: 'fs-pending',     label: 'Pending' },
          { id: 'fs-paid',        label: 'Paid' },
          { id: 'fs-waived',      label: 'Waived' },
          { id: 'fs-overdue',     label: 'Overdue' },
          { id: 'fs-partial',     label: 'Partially Paid' },
          { id: 'fs-refunded',    label: 'Refunded' },
          { id: 'fs-collections', label: 'Sent to Collections' },
        ],
      },
      {
        id: 'fee-notes',
        label: 'Notes',
        options: [
          { id: 'notes-has',  label: 'Has notes' },
          { id: 'notes-none', label: 'No notes' },
        ],
      },
    ],
  },

  // ── 3. Identifiers ───────────────────────────────────────────
  {
    id: 'fee-identifiers',
    label: 'Identifiers',
    icon: 'tag',
    tiers: [
      { id: 'fee-ticket-number',  label: 'Ticket Number',  type: 'text-match' },
      { id: 'fee-id',             label: 'Fee ID',          type: 'text-match' },
      { id: 'fee-transaction-id', label: 'Transaction ID', type: 'text-match' },
    ],
  },

  // ── 4. Transaction ───────────────────────────────────────────
  {
    id: 'transaction',
    label: 'Transaction',
    icon: 'paid',
    tiers: [
      {
        id: 'fee-amount',
        label: 'Amount',
        type: 'cost-range',
        min: 0,
        max: 500,
        step: 10,
      },
      {
        id: 'fee-department',
        label: 'Department',
        options: [
          { id: 'dept-technology',     label: 'Technology' },
          { id: 'dept-library',        label: 'Library & Media' },
          { id: 'dept-food-services',  label: 'Food Services' },
          { id: 'dept-athletics',      label: 'Athletics' },
          { id: 'dept-activities',     label: 'Student Activities' },
          { id: 'dept-transportation', label: 'Transportation' },
          { id: 'dept-registrar',      label: 'Registrar' },
          { id: 'dept-administration', label: 'Administration' },
        ],
      },
    ],
  },

];

// ── Custom Reports ────────────────────────────────────────────
const FILTER_GROUPS_CUSTOM_REPORTS = [
  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'report-dates',
    label: 'Date',
    icon: 'calendar_today',
    tiers: [
      { id: 'date-created',      label: 'Created Date',      type: 'date-range' },
      { id: 'date-last-updated', label: 'Last Updated Date', type: 'date-range' },
    ],
  },

  // ── 2. Report ─────────────────────────────────────────────────
  {
    id: 'report',
    label: 'Report',
    icon: 'summarize',
    tiers: [
      { id: 'report-name', label: 'Report Name', type: 'text-match' },
      {
        id: 'report-type',
        label: 'Type',
        options: [
          { id: 'rt-tickets',     label: 'Tickets'     },
          { id: 'rt-assets',      label: 'Assets'      },
          { id: 'rt-call-center', label: 'Call Center' },
          { id: 'rt-topics',      label: 'Topics'      },
        ],
      },
      {
        id: 'report-format',
        label: 'Format',
        options: [
          { id: 'rf-pdf',   label: 'PDF'   },
          { id: 'rf-excel', label: 'Excel' },
          { id: 'rf-csv',   label: 'CSV'   },
        ],
      },
    ],
  },
];

// ── Inbox ─────────────────────────────────────────────────────
const FILTER_GROUPS_INBOX = [

  // ── 1. Date ───────────────────────────────────────────────────
  {
    id: 'dates',
    label: 'Date',
    icon: 'calendar_today',
    type: 'date-preset',
    options: [
      { id: 'dp-today',               label: 'Today' },
      { id: 'dp-last-7-days',         label: 'Last 7 days' },
      { id: 'dp-last-30-days',        label: 'Last 30 days' },
      { id: 'dp-last-90-days',        label: 'Last 90 days' },
      { id: 'dp-this-week',           label: 'This week' },
      { id: 'dp-this-month',          label: 'This month' },
      { id: 'dp-current-school-year', label: 'Current school year' },
      { id: 'dp-last-school-year',    label: 'Last school year' },
    ],
  },

  // ── 2. Ticket ─────────────────────────────────────────────────
  {
    id: 'ticket',
    label: 'Ticket',
    icon: 'confirmation_number',
    tiers: [
      { id: 'inbox-subject',     label: 'Subject',     type: 'text-match' },
      { id: 'inbox-description', label: 'Description', type: 'text-match' },
      {
        id: 'ticket-type',
        label: 'Ticket Type',
        options: [
          { id: 'tt-question',   label: 'Question' },
          { id: 'tt-comment',    label: 'Comment' },
          { id: 'tt-suggestion', label: 'Suggestion' },
          { id: 'tt-concern',    label: 'Concern' },
          { id: 'tt-compliment', label: 'Compliment' },
        ],
      },
      {
        id: 'ticket-status',
        label: 'Ticket Status',
        options: [
          { id: 'ts-critical',  label: 'Critical' },
          { id: 'ts-p1-high',   label: 'P1 High' },
          { id: 'ts-p2-normal', label: 'P2 Normal' },
          { id: 'ts-p3-low',    label: 'P3 Low' },
        ],
      },
      {
        id: 'ticket-age',
        label: 'Ticket Age',
        type: 'numeric-range',
        min: 0,
        max: 32,
        step: 1,
        unit: 'days',
        maxLabel: '32+',
      },
      {
        id: 'cx-score',
        label: 'CX Score',
        type: 'numeric-range',
        min: 0,
        max: 10,
        step: 1,
        unit: '',
      },
      {
        id: 'ticket-owner',
        label: 'Ticket Owner',
        options: [
          { id: 'to-sarah-chen',    label: 'Sarah Chen' },
          { id: 'to-marcus-hayes',  label: 'Marcus Hayes' },
          { id: 'to-priya-patel',   label: 'Priya Patel' },
          { id: 'to-james-okonkwo', label: 'James Okonkwo' },
          { id: 'to-linda-reyes',   label: 'Linda Reyes' },
          { id: 'to-derek-wu',      label: 'Derek Wu' },
          { id: 'to-unassigned',    label: 'Unassigned' },
        ],
      },
      {
        id: 'inbox-agents',
        label: 'Assigned Agents',
        options: [
          { id: 'agt-sarah-chen',    label: 'Sarah Chen' },
          { id: 'agt-marcus-hayes',  label: 'Marcus Hayes' },
          { id: 'agt-priya-patel',   label: 'Priya Patel' },
          { id: 'agt-james-okonkwo', label: 'James Okonkwo' },
          { id: 'agt-linda-reyes',   label: 'Linda Reyes' },
          { id: 'agt-derek-wu',      label: 'Derek Wu' },
        ],
      },
      {
        id: 'svc-tags',
        label: 'Tags',
        options: [
          { id: 'stag-escalated',    label: 'Escalated' },
          { id: 'stag-follow-up',    label: 'Follow-up Required' },
          { id: 'stag-after-hours',  label: 'After Hours' },
          { id: 'stag-parent-cb',    label: 'Parent Callback' },
          { id: 'stag-data-request', label: 'Data Request' },
          { id: 'stag-tech-issue',   label: 'Tech Issue' },
          { id: 'stag-transport',    label: 'Transportation' },
          { id: 'stag-covid',        label: 'COVID-Related' },
        ],
      },
    ],
  },

  // ── 3. Customer ───────────────────────────────────────────────
  {
    id: 'customer',
    label: 'Customer',
    icon: 'person',
    tiers: [
      { id: 'inbox-customer-name', label: 'Customer Name', type: 'text-match' },
      {
        id: 'customer-type',
        label: 'Customer Type',
        options: [
          { id: 'ct-student',   label: 'Student' },
          { id: 'ct-employee',  label: 'Employee' },
          { id: 'ct-parent',    label: 'Parent / Guardian' },
          { id: 'ct-community', label: 'Community Member' },
          { id: 'ct-other',     label: 'Other' },
          { id: 'ct-volunteer', label: 'Volunteer' },
          { id: 'ct-vendor',    label: 'Vendor' },
          { id: 'ct-board',     label: 'Board Member' },
        ],
      },
      {
        id: 'language',
        label: 'Language',
        options: [
          { id: 'lang-ar', label: 'Arabic' },
          { id: 'lang-zh', label: 'Chinese (Simplified)' },
          { id: 'lang-en', label: 'English' },
          { id: 'lang-fr', label: 'French' },
          { id: 'lang-hi', label: 'Hindi' },
          { id: 'lang-pl', label: 'Polish' },
          { id: 'lang-ru', label: 'Russian' },
          { id: 'lang-so', label: 'Somali' },
          { id: 'lang-es', label: 'Spanish' },
          { id: 'lang-uk', label: 'Ukrainian' },
          { id: 'lang-ur', label: 'Urdu' },
        ],
      },
    ],
  },

  // ── 4. Topic ──────────────────────────────────────────────────
  {
    id: 'topic',
    label: 'Topic',
    icon: 'layers',
    tiers: [
      {
        id: 'topic-academics',
        label: 'Academics',
        options: [
          { id: 'top-grades',     label: 'Grades & Report Cards' },
          { id: 'top-curriculum', label: 'Curriculum Questions' },
          { id: 'top-hw-help',    label: 'Homework Help' },
          { id: 'top-testing',    label: 'Standardized Testing' },
          { id: 'top-special-ed', label: 'Special Education' },
        ],
      },
      {
        id: 'topic-enrollment',
        label: 'Enrollment & Attendance',
        options: [
          { id: 'top-enroll',     label: 'Enrollment Process' },
          { id: 'top-withdrawal', label: 'Withdrawal / Transfer' },
          { id: 'top-attendance', label: 'Attendance Questions' },
          { id: 'top-tardies',    label: 'Tardies & Absences' },
        ],
      },
      {
        id: 'topic-facilities',
        label: 'Facilities & Safety',
        options: [
          { id: 'top-facility',  label: 'Facility Concern' },
          { id: 'top-safety',    label: 'Safety / Bullying' },
          { id: 'top-food',      label: 'Food Services' },
          { id: 'top-transport', label: 'Transportation' },
        ],
      },
      {
        id: 'topic-tech',
        label: 'Technology',
        options: [
          { id: 'top-device',    label: 'Device Issue' },
          { id: 'top-login',     label: 'Login / Password Reset' },
          { id: 'top-app',       label: 'App / Software Access' },
          { id: 'top-wifi',      label: 'Wi-Fi / Connectivity' },
        ],
      },
    ],
  },

  // ── 5. Routing ────────────────────────────────────────────────
  {
    id: 'routing',
    label: 'Routing',
    icon: 'route',
    tiers: [
      {
        id: 'entry-point',
        label: 'Entry Point',
        options: [
          { id: 'ep-website',   label: 'District Website' },
          { id: 'ep-email',     label: 'Email' },
          { id: 'ep-phone',     label: 'Phone' },
          { id: 'ep-recorder',  label: 'Recorder' },
          { id: 'ep-cx-app',    label: 'Customer App' },
          { id: 'ep-text',      label: 'Text' },
          { id: 'ep-chatbot',   label: 'Chatbot' },
          { id: 'ep-live-chat', label: 'Live Chat' },
          { id: 'ep-global',    label: 'Global Ticket' },
          { id: 'ep-portal',    label: 'Customer Portal' },
        ],
      },
      {
        id: 'landing-page',
        label: 'Landing Page',
        options: [
          { id: 'lp-home',      label: 'Homepage' },
          { id: 'lp-it',        label: 'IT Support' },
          { id: 'lp-hr',        label: 'Human Resources' },
          { id: 'lp-registrar', label: 'Registrar' },
          { id: 'lp-finance',   label: 'Finance' },
          { id: 'lp-nutrition', label: 'Nutrition Services' },
          { id: 'lp-transport', label: 'Transportation' },
          { id: 'lp-comm',      label: 'Communications' },
        ],
      },
      {
        id: 'tab',
        label: 'Tab',
        options: [
          { id: 'tab-general',    label: 'General' },
          { id: 'tab-academic',   label: 'Academic' },
          { id: 'tab-it',         label: 'IT / Tech Support' },
          { id: 'tab-hr',         label: 'HR' },
          { id: 'tab-facilities', label: 'Facilities' },
          { id: 'tab-parents',    label: 'Parents' },
        ],
      },
    ],
  },

  // ── 6. Actions ────────────────────────────────────────────────
  {
    id: 'actions',
    label: 'Actions',
    icon: 'task_alt',
    tiers: [
      {
        id: 'action-taken',
        label: 'Action Taken',
        options: [
          { id: 'act-phone',      label: 'Phone Call' },
          { id: 'act-blog',       label: 'Blog Post' },
          { id: 'act-email',      label: 'Email' },
          { id: 'act-letter',     label: 'Letter' },
          { id: 'act-meeting',    label: 'In-Person Meeting' },
          { id: 'act-newsletter', label: 'Newsletter' },
          { id: 'act-oped',       label: 'Op Ed' },
          { id: 'act-speech',     label: 'Speech' },
          { id: 'act-other',      label: 'Other' },
          { id: 'act-none',       label: 'None' },
        ],
      },
    ],
  },

];

// ── Context configuration ─────────────────────────────────────
const CONTEXTS = {
  inbox:                { label: 'Inbox',                groups: FILTER_GROUPS_INBOX,                  savedSetsKey: 'onflo-filter-sets-inbox'            },
  assets:               { label: 'Assets Table',        groups: FILTER_GROUPS_ASSETS,                savedSetsKey: 'onflo-filter-sets-assets'           },
  service:              { label: 'Service Overview',     groups: FILTER_GROUPS_SERVICE_OVERVIEW,       savedSetsKey: 'onflo-filter-sets-service'          },
  'chatbot-overview':   { label: 'Chatbot Overview',     groups: FILTER_GROUPS_CHATBOT_OVERVIEW,       savedSetsKey: 'onflo-filter-sets-chatbot-overview' },
  'chatbot-optimization':{ label: 'Chatbot Optimization',groups: FILTER_GROUPS_CHATBOT_OPTIMIZATION,  savedSetsKey: 'onflo-filter-sets-chatbot-optim'    },
  'chatbot-chat-logs':  { label: 'Chat Logs',            groups: FILTER_GROUPS_CHATBOT_CHAT_LOGS,      savedSetsKey: 'onflo-filter-sets-chatbot-logs'     },
  'call-center-overview':     { label: 'Call Center Overview',     groups: FILTER_GROUPS_CALL_CENTER_CSAT,     savedSetsKey: 'onflo-filter-sets-call-center-overview'     },
  'call-center-csat':         { label: 'Call Center CSAT',         groups: FILTER_GROUPS_CALL_CENTER_CSAT, savedSetsKey: 'onflo-filter-sets-call-center-csat'         },
  'call-center-call-metrics': { label: 'Call Center Call Metrics', groups: FILTER_GROUPS_CALL_CENTER_CSAT, savedSetsKey: 'onflo-filter-sets-call-center-call-metrics'  },
  'call-center-call-details':   { label: 'Call Details',             groups: FILTER_GROUPS_CALL_DETAILS,                savedSetsKey: 'onflo-filter-sets-call-details'                },
  'call-center-agent-status':  { label: 'Agent Status',             groups: FILTER_GROUPS_CALL_CENTER_AGENT_STATUS, savedSetsKey: 'onflo-filter-sets-call-center-agent-status'   },
  'comparison-categories':     { label: 'Comparison — Categories',  groups: FILTER_GROUPS_SERVICE_OVERVIEW,         savedSetsKey: 'onflo-filter-sets-comparison-categories'      },
  'comparison-topics':         { label: 'Comparison — Topics',      groups: FILTER_GROUPS_SERVICE_OVERVIEW,         savedSetsKey: 'onflo-filter-sets-comparison-topics'          },
  'comparison-users':          { label: 'Comparison — Users',       groups: FILTER_GROUPS_SERVICE_OVERVIEW,         savedSetsKey: 'onflo-filter-sets-comparison-users'           },
  fees:                        { label: 'Fees',                      groups: FILTER_GROUPS_FEES,                     savedSetsKey: 'onflo-filter-sets-fees'                        },
  'custom-reports':            { label: 'Custom Reports',            groups: FILTER_GROUPS_CUSTOM_REPORTS,           savedSetsKey: 'onflo-filter-sets-custom-reports'              },
};

let activeContext     = 'service';
let activeFilterGroups = CONTEXTS[activeContext].groups;
let boundOverlay = null;

// ── Build flat option lookup ──────────────────────────────────
// optionId -> { groupId, groupLabel, tierId, tierLabel, label }
function buildOptionMeta(groups) {
  const map = new Map();
  groups.forEach(group => {
    if (group.options) {
      group.options.forEach(opt => {
        map.set(opt.id, {
          groupId: group.id, groupLabel: group.label,
          tierId: null, tierLabel: null,
          label: opt.label,
        });
      });
    } else if (group.tiers) {
      group.tiers.forEach(tier => {
        if (!tier.options) return; // date-range / cost-range tiers have no static options
        tier.options.forEach(opt => {
          map.set(opt.id, {
            groupId: group.id, groupLabel: group.label,
            tierId: tier.id, tierLabel: tier.label,
            label: opt.label,
          });
        });
      });
    }
  });
  return map;
}

let OPTION_META = buildOptionMeta(activeFilterGroups);

// ── Application state ─────────────────────────────────────────
const BUCKET_AUTO_COLLAPSE_THRESHOLD = 4;

const state = {
  activeGroupId:  activeFilterGroups[0]?.id ?? null,
  searchQuery:    '',
  // Set<optionId>
  selected:       new Set(),
  // Set<bucketKey> — tierId (or groupId for flat groups) whose selections are excluded
  excludedBuckets: new Set(),
  // Set<tierId> — which tiers are collapsed
  collapsedTiers: new Set(),
  // Set<groupId> — search result groups expanded beyond SEARCH_GROUP_LIMIT
  expandedSearchGroups: new Set(),
  // Set<bucketKey> — manually collapsed selected-panel buckets
  collapsedSelectedBuckets: new Set(),
  // Set<bucketKey> — explicitly expanded by user (overrides auto-collapse threshold)
  expandedSelectedBuckets:  new Set(),
  // Field-specific date range pickers (Dates + Loans groups)
  // keyed by tier.id → { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
  fieldDateDrafts: {},
  // Cost range draft (Financial › Total Cost)
  costRangeDraft: { min: null, max: null },
  // Numeric range drafts (Service Overview: CX Score, Ticket Age)
  // keyed by tier.id → { min: number | null, max: number | null }
  numericRangeDrafts: {},
  // Time range drafts — keyed by tier.id → { min: number | null, max: number | null } (minutes 0–1439)
  timeRangeDrafts: {},
  // Text match drafts — keyed by tier.id → { operator: string, value: string }
  textMatchDrafts: {},
  // Whether the custom date range picker is expanded in the date-preset group
  datePresetCustomOpen: false,
  // Custom date range picker (legacy — kept for Service Overview reuse)
  dateRangeDraft:      { start: null, end: null },
  datePickerViewYear:  new Date().getFullYear(),
  datePickerViewMonth: new Date().getMonth(),
  datePickerMode:      'range',   // 'range' | 'single'
  calendarOpen:        false,     // calendar panel visible
  activeDateInput:     'start',   // 'start' | 'end' — which input the calendar updates
  // Saved filter sets
  activeFilterSetId:   null,      // ID of the currently loaded saved set, or null
  savedSetsOpen:       false,     // whether the saved sets panel is visible
};

// ── Portal state — floating text-match operator dropdown ──────
let _tmFloating = null; // { tierId, el: HTMLElement, trigger: HTMLElement }

// ── Committed snapshot — restored when modal is cancelled ─────
let _committedSnapshot = null;

function _snapshotSelectionState() {
  return {
    selected:            new Set(state.selected),
    excludedBuckets:     new Set(state.excludedBuckets),
    fieldDateDrafts:     JSON.parse(JSON.stringify(state.fieldDateDrafts)),
    costRangeDraft:      { ...state.costRangeDraft },
    numericRangeDrafts:  JSON.parse(JSON.stringify(state.numericRangeDrafts)),
    timeRangeDrafts:     JSON.parse(JSON.stringify(state.timeRangeDrafts)),
    textMatchDrafts:     JSON.parse(JSON.stringify(state.textMatchDrafts)),
    dateRangeDraft:      { ...state.dateRangeDraft },
    datePickerMode:      state.datePickerMode,
    datePresetCustomOpen: state.datePresetCustomOpen,
    activeFilterSetId:   state.activeFilterSetId,
  };
}

function _restoreSelectionState(snapshot) {
  state.selected            = new Set(snapshot.selected);
  state.excludedBuckets     = new Set(snapshot.excludedBuckets);
  state.fieldDateDrafts     = JSON.parse(JSON.stringify(snapshot.fieldDateDrafts));
  state.costRangeDraft      = { ...snapshot.costRangeDraft };
  state.numericRangeDrafts  = JSON.parse(JSON.stringify(snapshot.numericRangeDrafts));
  state.timeRangeDrafts     = JSON.parse(JSON.stringify(snapshot.timeRangeDrafts));
  state.textMatchDrafts     = JSON.parse(JSON.stringify(snapshot.textMatchDrafts));
  state.dateRangeDraft      = { ...snapshot.dateRangeDraft };
  state.datePickerMode      = snapshot.datePickerMode;
  state.datePresetCustomOpen = snapshot.datePresetCustomOpen;
  state.activeFilterSetId   = snapshot.activeFilterSetId;
}

// ── DOM refs ──────────────────────────────────────────────────
// DOM refs — assigned in filterModalInit()
let overlay;
let modal;
let navEl;
let optionsEl;
let selectedEmpty;
let selectedList;
let searchInput;
let searchClearBtn;
let headerClearBtn;
let footerSummary;
let savedSetsPanel;
let savedSetsBody;
let activeSetChip;
let activeSetNameEl;
let updateSetBtnEl;


// ── Utility ───────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightMatch(text, query) {
  if (!query) return esc(text);
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return esc(text);
  return (
    esc(text.slice(0, i)) +
    `<mark class="search-match">${esc(text.slice(i, i + query.length))}</mark>` +
    esc(text.slice(i + query.length))
  );
}

function getGroupCount(groupId) {
  let n = 0;
  state.selected.forEach(id => {
    const m = OPTION_META.get(id);
    if (m && m.groupId === groupId) n++;
  });
  return n;
}

function getTierCount(tierId) {
  let n = 0;
  state.selected.forEach(id => {
    const m = OPTION_META.get(id);
    if (m && m.tierId === tierId) n++;
  });
  return n;
}

function getBreadcrumb(meta) {
  return meta.tierLabel
    ? `${meta.groupLabel} › ${meta.tierLabel}`
    : meta.groupLabel;
}

function getBucketKey(meta) {
  return meta.tierId ?? meta.groupId;
}

// Build 3 invisible spacers for the last row of a flex-wrap grid
const GRID_SPACERS = Array.from({ length: 3 }, () =>
  '<div class="filter-card-spacer" aria-hidden="true"></div>'
).join('');


// ── Date range picker constants ───────────────────────────────

const MONTH_NAMES_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW_ABBR          = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ── Date utilities ────────────────────────────────────────────

function dateToKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function keyToDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateLabel(d) {
  const yr = d.getFullYear();
  const suffix = yr !== new Date().getFullYear() ? `, ${yr}` : '';
  return `${MONTH_NAMES_SHORT[d.getMonth()]} ${d.getDate()}${suffix}`;
}

function formatDateRangeLabel(start, end) {
  if (dateToKey(start) === dateToKey(end)) return formatDateLabel(start);
  return `${formatDateLabel(start)} – ${formatDateLabel(end)}`;
}

// Format Date → MM/DD/YYYY string for display in text inputs
function formatDateInput(d) {
  return String(d.getMonth() + 1).padStart(2, '0') + '/' +
         String(d.getDate()).padStart(2, '0') + '/' +
         d.getFullYear();
}

// Parse MM/DD/YYYY text → Date, or null if invalid
function parseDateInput(s) {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const mo = +m[1], dy = +m[2], yr = +m[3];
  if (mo < 1 || mo > 12 || dy < 1 || dy > 31 || yr < 1900 || yr > 2100) return null;
  const d = new Date(yr, mo - 1, dy);
  return d.getMonth() === mo - 1 && d.getDate() === dy ? d : null;
}

// ── Field-specific date range helpers ─────────────────────────

const ISO_MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatISODateLabel(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${ISO_MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

function formatFieldDateRangeLabel(from, to) {
  if (from && to)  return `${formatISODateLabel(from)} – ${formatISODateLabel(to)}`;
  if (from)        return `From ${formatISODateLabel(from)}`;
  if (to)          return `Until ${formatISODateLabel(to)}`;
  return '';
}

// ── Cost range helpers ─────────────────────────────────────────

function formatCostLabel(min, max, tierMin, tierMax) {
  if (min === tierMin && max === tierMax) return 'Any cost';
  if (min === tierMin) return `Up to $${max.toLocaleString()}`;
  if (max === tierMax) return `$${min.toLocaleString()} and up`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

// ── Numeric range helpers ──────────────────────────────────────

function formatNumericRangeLabel(min, max, tierMin, tierMax, unit, maxLabel) {
  const u      = unit ? ` ${unit}` : '';
  const maxStr = (max === tierMax && maxLabel) ? maxLabel : String(max);
  if (min === tierMin && max === tierMax) return unit ? `Any ${unit}` : 'Any';
  return `${min}–${maxStr}${u}`;
}

// ── Time range helpers ────────────────────────────────────────

function formatTime(minutes) {
  const h    = Math.floor(minutes / 60) % 12 || 12;
  const m    = minutes % 60;
  const ampm = minutes < 720 ? 'AM' : 'PM';
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatTimeRangeLabel(min, max, tierMin, tierMax) {
  if (min === tierMin && max === tierMax) return 'Any time';
  return `${formatTime(min)} – ${formatTime(max)}`;
}

// ── Text match helpers ────────────────────────────────────────

const TEXT_MATCH_OPERATORS = [
  { value: 'contains',     label: 'Contains' },
  { value: 'not-contains', label: 'Does not contain' },
  { value: 'equals',       label: 'Equals' },
  { value: 'not-equals',   label: 'Does not equal' },
  { value: 'begins-with',  label: 'Begins with' },
  { value: 'ends-with',    label: 'Ends with' },
  { value: 'blank',        label: 'Blank' },
  { value: 'not-blank',    label: 'Not blank' },
];

function formatTextMatchLabel(operator, value) {
  const op = TEXT_MATCH_OPERATORS.find(o => o.value === operator);
  const label = op ? op.label : operator;
  if (operator === 'blank' || operator === 'not-blank') return label;
  return `${label}: “${value}”`;
}

// Sync the two text inputs from draft state (used after full re-render would stomp them)
function syncInputsFromState() {
  const { start, end } = state.dateRangeDraft;
  const startEl = document.querySelector('[data-date-input="start"]');
  const endEl   = document.querySelector('[data-date-input="end"]');
  if (startEl) startEl.value = start ? formatDateInput(start) : '';
  if (endEl)   endEl.value   = end   ? formatDateInput(end)   : '';
}

// Refresh only the Add button state without a full re-render
function updateDatePickerButtons() {
  const { start, end } = state.dateRangeDraft;
  const canAdd = state.datePickerMode === 'single' ? !!start : !!(start && end);
  const addBtn = document.querySelector('[data-add-date-range]');
  if (addBtn) addBtn.disabled = !canAdd;
}

// ── Date calendar builder ─────────────────────────────────────

function buildDateCalendar(year, month, side) {
  const { start, end } = state.dateRangeDraft;
  const todayKey   = dateToKey(new Date());
  const firstDay   = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow   = firstDay.getDay();

  const dowHeaders = DOW_ABBR.map(d =>
    `<div class="date-cal__dow">${d}</div>`
  ).join('');

  let cells = '';
  for (let i = 0; i < startDow; i++) {
    cells += '<div class="date-cal__cell date-cal__cell--empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const key  = dateToKey(date);

    const isStart = start && dateToKey(start) === key;
    const isEnd   = end   && dateToKey(end)   === key;
    const isSame  = isStart && isEnd;

    const inRange      = start && end && date > start && date < end;
    const isRangeStart = start && end && isStart && !isSame;
    const isRangeEnd   = start && end && isEnd   && !isSame;

    let cellCls = 'date-cal__cell';
    if (inRange)      cellCls += ' date-cal__cell--in-range';
    if (isRangeStart) cellCls += ' date-cal__cell--range-start';
    if (isRangeEnd)   cellCls += ' date-cal__cell--range-end';

    let btnCls = 'date-cal__day';
    if (isStart || isEnd) btnCls += ' date-cal__day--endpoint';
    if (key === todayKey) btnCls += ' date-cal__day--today';

    cells += `<div class="${cellCls}"><button class="${btnCls}" data-date="${key}" type="button" aria-label="${esc(formatDateLabel(date))}">${d}</button></div>`;
  }

  // 'left' = prev only, 'right' = next only, 'both' = single calendar with both
  const prevBtn = (side === 'left' || side === 'both')
    ? `<button class="ds-icon-button ds-icon-button--icon ds-icon-button--sm date-cal__nav" data-cal-prev type="button" aria-label="Previous month"><span class="ds-icon">chevron_left</span></button>`
    : `<div class="date-cal__nav-placeholder"></div>`;

  const nextBtn = (side === 'right' || side === 'both')
    ? `<button class="ds-icon-button ds-icon-button--icon ds-icon-button--sm date-cal__nav" data-cal-next type="button" aria-label="Next month"><span class="ds-icon">chevron_right</span></button>`
    : `<div class="date-cal__nav-placeholder"></div>`;

  return `
    <div class="date-calendar">
      <div class="date-cal__header">
        ${prevBtn}
        <span class="date-cal__month-label">${MONTH_NAMES_FULL[month]} ${year}</span>
        ${nextBtn}
      </div>
      <div class="date-cal__grid">
        ${dowHeaders}
        ${cells}
      </div>
    </div>`;
}

// ── Date range picker section ─────────────────────────────────

function buildDateRangePicker(opts = {}) {
  const { start, end } = state.dateRangeDraft;
  const mode     = state.datePickerMode;
  const year     = state.datePickerViewYear;
  const month    = state.datePickerViewMonth;
  const calOpen  = state.calendarOpen;
  const activeIn = state.activeDateInput;

  const startVal = start ? formatDateInput(start) : '';
  const endVal   = end   ? formatDateInput(end)   : '';
  const canAdd = mode === 'single' ? !!start : !!(start && end);

  // ── Mode toggle (segmented control) ──
  const modeToggle = `
    <div class="date-mode-toggle" role="group" aria-label="Date selection mode">
      <button
        class="date-mode-toggle__btn${mode === 'range' ? ' date-mode-toggle__btn--active' : ''}"
        data-date-mode="range" type="button" aria-pressed="${mode === 'range'}"
      ><span class="ds-icon ds-icon--sm ds-icon--filled" aria-hidden="true">date_range</span>Date Range</button>
      <button
        class="date-mode-toggle__btn${mode === 'single' ? ' date-mode-toggle__btn--active' : ''}"
        data-date-mode="single" type="button" aria-pressed="${mode === 'single'}"
      ><span class="ds-icon ds-icon--sm ds-icon--filled" aria-hidden="true">event</span>Single Date</button>
    </div>`;

  // Calendar panel is rendered as a fixed overlay via renderCalendarPanel().

  // mat-datepicker-toggle equivalent — trailing icon button opens/closes the calendar
  const calToggle = `
    <button
      class="ds-input__action filter-date-range-field__cal-btn${calOpen ? ' filter-date-range-field__cal-btn--open' : ''}"
      type="button"
      data-toggle-calendar
      aria-label="${calOpen ? 'Close calendar' : 'Open calendar'}"
      aria-expanded="${calOpen}"
    ><span class="ds-icon ds-icon--sm">calendar_today</span></button>`;

  let inputsHtml;
  if (mode === 'single') {
    inputsHtml = `
      <div class="date-picker-field-group">
        <div class="filter-date-range-field${calOpen ? ' filter-date-range-field--open' : ''}">
          <div class="filter-date-range-field__row">
            <input
              type="text"
              class="filter-date-range-field__input"
              maxlength="10"
              inputmode="numeric"
              data-date-input="start"
              value="${esc(startVal)}"
              aria-label="Date"
            >
            ${calToggle}
          </div>
        </div>
        <span class="date-picker-field-hint">MM/DD/YYYY</span>
      </div>`;
  } else {
    inputsHtml = `
      <div class="date-picker-field-group">
        <div class="filter-date-range-field${calOpen ? ' filter-date-range-field--open' : ''}">
          <div class="filter-date-range-field__row">
            <input
              type="text"
              class="filter-date-range-field__input${calOpen && activeIn === 'start' ? ' filter-date-range-field__input--active' : ''}"
              placeholder="Start date"
              maxlength="10"
              inputmode="numeric"
              data-date-input="start"
              value="${esc(startVal)}"
              aria-label="Start date"
            >
            <span class="filter-date-range-field__sep" aria-hidden="true">–</span>
            <input
              type="text"
              class="filter-date-range-field__input${calOpen && activeIn === 'end' ? ' filter-date-range-field__input--active' : ''}"
              placeholder="End date"
              maxlength="10"
              inputmode="numeric"
              data-date-input="end"
              value="${esc(endVal)}"
              aria-label="End date"
            >
            ${calToggle}
          </div>
        </div>
        <span class="date-picker-field-hint">MM/DD/YYYY – MM/DD/YYYY</span>
      </div>`;
  }

  const calendarHtml = '';

  // ── Chips for already-added custom dates / ranges ──
  const customRangeChips = Array.from(state.selected)
    .filter(id => id.startsWith('custom-dr-'))
    .map(id => {
      const meta = OPTION_META.get(id);
      if (!meta) return '';
      const icon = meta.dateMode === 'single' ? 'event' : 'date_range';
      return `
        <div class="ds-chip">
          <span class="ds-icon ds-icon--sm ds-chip__icon" aria-hidden="true">${icon}</span>
          <span class="ds-chip__label">${esc(meta.label)}</span>
          <button class="ds-chip__remove" data-remove-id="${id}" type="button" aria-label="Remove ${esc(meta.label)}">
            <span class="ds-icon ds-icon--xs">close</span>
          </button>
        </div>`;
    }).join('');

  const addLabel = mode === 'single' ? 'Add Date' : 'Add Range';
  const addIcon  = mode === 'single' ? 'event' : 'date_range';

  return `
    <div class="date-range-picker" id="date-range-picker">
      ${modeToggle}
      ${inputsHtml}
      ${calendarHtml}

      <div class="date-range-picker__actions">
        <button
          class="ds-button ds-button--filled ds-button--xs"
          data-add-date-range
          type="button"
          ${canAdd ? '' : 'disabled'}
        >${addLabel}</button>
      </div>

      ${!opts.suppressChips && customRangeChips ? `
        <div class="date-range-picker__chips">
          <span class="date-range-picker__chips-label">Added dates</span>
          ${customRangeChips}
        </div>` : ''}
    </div>`;
}

// ── Native date range picker (matches preview HTML — no custom calendar) ──

function buildNativeDateRangePicker(opts = {}) {
  const { start, end } = state.dateRangeDraft;
  const nativeFrom = start ? start.toISOString().slice(0, 10) : '';
  const nativeTo   = end   ? end.toISOString().slice(0, 10)   : '';
  const canAdd     = !!(start && end);

  const customRangeChips = Array.from(state.selected)
    .filter(id => id.startsWith('custom-dr-'))
    .map(id => {
      const meta = OPTION_META.get(id);
      if (!meta) return '';
      return `
        <div class="ds-chip">
          <span class="ds-icon ds-icon--sm ds-chip__icon" aria-hidden="true">date_range</span>
          <span class="ds-chip__label">${esc(meta.label)}</span>
          <button class="ds-chip__remove" data-remove-id="${id}" type="button" aria-label="Remove ${esc(meta.label)}">
            <span class="ds-icon ds-icon--xs">close</span>
          </button>
        </div>`;
    }).join('');

  return `
    <div class="date-range-picker" id="date-range-picker">
      <div class="filter-date-field__row" style="margin-bottom:8px">
        <div class="filter-date-field__group">
          <label class="filter-date-field__label" for="dr-preset-start">Start date</label>
          <div class="dp-demo-field">
            <input type="date" id="dr-preset-start" data-native-date-start value="${nativeFrom}">
            <button class="dp-demo-field__icon-btn" type="button" aria-label="Open date picker" data-open-picker="dr-preset-start">
              <span class="ds-icon ds-icon--sm" aria-hidden="true">calendar_today</span>
            </button>
          </div>
        </div>
        <div class="filter-date-field__group">
          <label class="filter-date-field__label" for="dr-preset-end">End date</label>
          <div class="dp-demo-field">
            <input type="date" id="dr-preset-end" data-native-date-end value="${nativeTo}">
            <button class="dp-demo-field__icon-btn" type="button" aria-label="Open date picker" data-open-picker="dr-preset-end">
              <span class="ds-icon ds-icon--sm" aria-hidden="true">calendar_today</span>
            </button>
          </div>
        </div>
      </div>
      <div class="date-range-picker__actions">
        <button class="ds-button ds-button--filled ds-button--xs" data-add-native-date-range type="button"${canAdd ? '' : ' disabled'}>Add Range</button>
      </div>
      ${!opts.suppressChips && customRangeChips ? `
        <div class="date-range-picker__chips">
          <span class="date-range-picker__chips-label">Added dates</span>
          ${customRangeChips}
        </div>` : ''}
    </div>`;
}

// ── Date range preview (no full re-render) ────────────────────

function updateCalendarPreview(hoverKey) {
  const picker = document.getElementById('date-range-picker');
  if (!picker) return;
  const { start } = state.dateRangeDraft;
  if (!start) return;

  const hoverDate  = keyToDate(hoverKey);
  const rangeStart = hoverDate < start ? hoverDate : start;
  const rangeEnd   = hoverDate < start ? start      : hoverDate;
  const rsKey      = dateToKey(rangeStart);
  const reKey      = dateToKey(rangeEnd);
  const same       = rsKey === reKey;

  picker.querySelectorAll('.date-cal__cell').forEach(cell => {
    const btn = cell.querySelector('[data-date]');
    if (!btn) return;
    const date = keyToDate(btn.dataset.date);
    const key  = btn.dataset.date;

    const isRs = key === rsKey;
    const isRe = key === reKey;
    const inR  = !same && date > rangeStart && date < rangeEnd;

    cell.classList.toggle('date-cal__cell--preview-range', inR);
    cell.classList.toggle('date-cal__cell--preview-start', isRs && !same);
    cell.classList.toggle('date-cal__cell--preview-end',   isRe && !same);
    btn.classList.toggle('date-cal__day--preview-endpoint', isRs || isRe);
  });
}

function clearCalendarPreview() {
  const picker = document.getElementById('date-range-picker');
  if (!picker) return;
  picker.querySelectorAll(
    '.date-cal__cell--preview-range, .date-cal__cell--preview-start, .date-cal__cell--preview-end'
  ).forEach(el => el.classList.remove(
    'date-cal__cell--preview-range', 'date-cal__cell--preview-start', 'date-cal__cell--preview-end'
  ));
  picker.querySelectorAll('.date-cal__day--preview-endpoint').forEach(el =>
    el.classList.remove('date-cal__day--preview-endpoint')
  );
}


// ── HTML builders ─────────────────────────────────────────────

function buildCard(opt, query = '') {
  const selected = state.selected.has(opt.id);
  const hasSublabel = !!opt.sublabel;
  const inner = hasSublabel
    ? `<span class="filter-card__body">
         <span class="filter-card__label">${highlightMatch(opt.label, query)}</span>
         <span class="filter-card__sublabel">${highlightMatch(opt.sublabel, query)}</span>
       </span>`
    : `<span>${highlightMatch(opt.label, query)}</span>`;
  return `
    <button
      class="filter-card${hasSublabel ? ' filter-card--has-sublabel' : ''}${selected ? ' filter-card--selected' : ''}"
      data-option-id="${opt.id}"
      aria-pressed="${selected}"
    >
      ${inner}
      <span class="ds-icon ds-icon--sm filter-card__check" aria-hidden="true">check</span>
    </button>`;
}

function buildTierSection(tier) {
  const collapsed = state.collapsedTiers.has(tier.id);

  // ── Date-range tier ──────────────────────────────────────────
  if (tier.type === 'date-range') {
    const appliedId   = 'dr-' + tier.id;
    const applied = state.selected.has(appliedId);
    const draft   = state.fieldDateDrafts[tier.id] || { from: '', to: '' };
    const canApply    = !!(draft.from || draft.to);
    const badge       = collapsed && applied
      ? `<span class="filter-tier__badge" aria-label="1 selected">1</span>` : '';

    const body = collapsed ? '' : `
      <div class="filter-tier__body">
        <div class="filter-date-field" data-tier-id="${tier.id}">
          <div class="filter-date-field__row">
            <div class="filter-date-field__group">
              <label class="filter-date-field__label" for="dff-from-${tier.id}">From</label>
              <div class="ds-input"><div class="ds-input__field">
                <input class="ds-input__control" type="date" id="dff-from-${tier.id}"
                  data-date-field-from="${tier.id}" value="${esc(draft.from)}">
              </div></div>
            </div>
            <div class="filter-date-field__group">
              <label class="filter-date-field__label" for="dff-to-${tier.id}">To</label>
              <div class="ds-input"><div class="ds-input__field">
                <input class="ds-input__control" type="date" id="dff-to-${tier.id}"
                  data-date-field-to="${tier.id}" value="${esc(draft.to)}">
              </div></div>
            </div>
          </div>
          <div class="filter-date-field__actions">
            <button class="ds-button ds-button--filled ds-button--xs"
              data-apply-date-field="${tier.id}" type="button" ${canApply ? '' : 'disabled'}>Add</button>
          </div>
        </div>
      </div>`;

    return `
      <div class="filter-tier" data-tier-id="${tier.id}">
        <div class="filter-tier__top-row">
          <button class="filter-tier__header" aria-expanded="${!collapsed}" data-tier-toggle="${tier.id}">
            <span>${esc(tier.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${badge}</span>
          </button>
        </div>
        ${body}
      </div>`;
  }

  // ── Cost-range tier ──────────────────────────────────────────
  if (tier.type === 'cost-range') {
    const appliedId = 'cr-' + tier.id;
    const applied   = state.selected.has(appliedId);
    const tierMin   = tier.min ?? 0;
    const tierMax   = tier.max ?? 5000;
    const step      = tier.step ?? 50;
    const curMin    = state.costRangeDraft.min !== null ? state.costRangeDraft.min : tierMin;
    const curMax    = state.costRangeDraft.max !== null ? state.costRangeDraft.max : tierMax;
    const minPct    = ((curMin - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const maxPct    = ((curMax - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const badge     = collapsed && applied
      ? `<span class="filter-tier__badge" aria-label="1 selected">1</span>` : '';

    const body = collapsed ? '' : `
      <div class="filter-tier__body">
        <div class="filter-cost-range" data-tier-id="${tier.id}">
          <div class="filter-cost-range__values">
            <span class="filter-cost-range__value" id="cr-min-val-${tier.id}">$${curMin.toLocaleString()}</span>
            <span class="filter-cost-range__dash">–</span>
            <span class="filter-cost-range__value" id="cr-max-val-${tier.id}">$${curMax.toLocaleString()}</span>
          </div>
          <div class="filter-cost-range__slider-wrap" id="cr-wrap-${tier.id}"
               style="--cr-min:${minPct}%;--cr-max:${maxPct}%">
            <div class="filter-cost-range__track" aria-hidden="true">
              <div class="filter-cost-range__fill"></div>
            </div>
            <input type="range" class="filter-cost-range__thumb filter-cost-range__thumb--min"
              id="cr-thumb-min-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMin}"
              data-cost-min data-cost-tier="${tier.id}"
              data-cost-tier-min="${tierMin}" data-cost-tier-max="${tierMax}"
              aria-label="Minimum ${esc(tier.label)}">
            <input type="range" class="filter-cost-range__thumb filter-cost-range__thumb--max"
              id="cr-thumb-max-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMax}"
              data-cost-max data-cost-tier="${tier.id}"
              data-cost-tier-min="${tierMin}" data-cost-tier-max="${tierMax}"
              aria-label="Maximum ${esc(tier.label)}">
          </div>
          <div class="filter-cost-range__bounds">
            <span>$${tierMin.toLocaleString()}</span>
            <span>$${tierMax.toLocaleString()}</span>
          </div>
          <div class="filter-cost-range__actions">
            <button class="ds-button ds-button--filled ds-button--xs"
              data-apply-cost-range="${tier.id}" type="button">Add</button>
          </div>
        </div>
      </div>`;

    return `
      <div class="filter-tier" data-tier-id="${tier.id}">
        <div class="filter-tier__top-row">
          <button class="filter-tier__header" aria-expanded="${!collapsed}" data-tier-toggle="${tier.id}">
            <span>${esc(tier.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${badge}</span>
          </button>
        </div>
        ${body}
      </div>`;
  }

  // ── Numeric-range tier ───────────────────────────────────────
  if (tier.type === 'numeric-range') {
    const appliedId  = 'nr-' + tier.id;
    const applied    = state.selected.has(appliedId);
    const tierMin    = tier.min ?? 0;
    const tierMax    = tier.max ?? 100;
    const step       = tier.step ?? 1;
    const draft      = state.numericRangeDrafts[tier.id];
    const curMin     = draft?.min !== null && draft?.min !== undefined ? draft.min : tierMin;
    const curMax     = draft?.max !== null && draft?.max !== undefined ? draft.max : tierMax;
    const minPct     = ((curMin - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const maxPct     = ((curMax - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const u          = tier.unit ? ` ${tier.unit}` : '';
    const maxBound   = tier.maxLabel ?? String(tierMax);
    const curMaxDisp = curMax === tierMax && tier.maxLabel ? tier.maxLabel : String(curMax);
    const badge      = collapsed && applied
      ? `<span class="filter-tier__badge" aria-label="1 selected">1</span>` : '';

    const body = collapsed ? '' : `
      <div class="filter-tier__body">
        <div class="filter-numeric-range" data-tier-id="${tier.id}">
          <div class="filter-numeric-range__values">
            <span class="filter-numeric-range__value" id="nr-min-val-${tier.id}">${curMin}${u}</span>
            <span class="filter-numeric-range__dash">–</span>
            <span class="filter-numeric-range__value" id="nr-max-val-${tier.id}">${curMaxDisp}${u}</span>
          </div>
          <div class="filter-numeric-range__slider-wrap" id="nr-wrap-${tier.id}"
               style="--cr-min:${minPct}%;--cr-max:${maxPct}%">
            <div class="filter-numeric-range__track" aria-hidden="true">
              <div class="filter-numeric-range__fill"></div>
            </div>
            <input type="range" class="filter-numeric-range__thumb filter-numeric-range__thumb--min"
              id="nr-thumb-min-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMin}"
              data-nr-min data-nr-tier="${tier.id}"
              data-nr-tier-min="${tierMin}" data-nr-tier-max="${tierMax}"
              aria-label="Minimum ${esc(tier.label)}">
            <input type="range" class="filter-numeric-range__thumb filter-numeric-range__thumb--max"
              id="nr-thumb-max-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMax}"
              data-nr-max data-nr-tier="${tier.id}"
              data-nr-tier-min="${tierMin}" data-nr-tier-max="${tierMax}"
              aria-label="Maximum ${esc(tier.label)}">
          </div>
          <div class="filter-numeric-range__bounds">
            <span>${tierMin}${u}</span>
            <span>${maxBound}${u}</span>
          </div>
          <div class="filter-numeric-range__actions">
            <button class="ds-button ds-button--filled ds-button--xs"
              data-apply-nr="${tier.id}" type="button">Add</button>
          </div>
        </div>
      </div>`;

    return `
      <div class="filter-tier" data-tier-id="${tier.id}">
        <div class="filter-tier__top-row">
          <button class="filter-tier__header" aria-expanded="${!collapsed}" data-tier-toggle="${tier.id}">
            <span>${esc(tier.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${badge}</span>
          </button>
        </div>
        ${body}
      </div>`;
  }

  // ── Text-match tier ──────────────────────────────────────────
  if (tier.type === 'text-match') {
    const appliedId = 'tm-' + tier.id;
    const applied   = state.selected.has(appliedId);
    const draft     = state.textMatchDrafts[tier.id] || { operator: 'contains', value: '' };
    const op        = draft.operator;
    const val       = draft.value;
    const noValue   = op === 'blank' || op === 'not-blank';
    const canApply  = noValue || val.trim().length > 0;
    const badge     = collapsed && applied ? `<span class="filter-tier__badge" aria-label="1 selected">1</span>` : '';

    const currentOpLabel = TEXT_MATCH_OPERATORS.find(o => o.value === op)?.label ?? 'Contains';

    const body = collapsed ? '' : `
      <div class="filter-tier__body">
        <div class="filter-text-match" data-tier-id="${tier.id}">
          <div class="ds-select">
            <div class="ds-select__field-row">
              <button class="ds-select__field" type="button"
                      data-tm-trigger="${tier.id}"
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      aria-controls="tm-floating-${tier.id}">
                <span class="ds-select__value" id="tm-label-${tier.id}">${esc(currentOpLabel)}</span>
                <span class="ds-icon ds-icon--sm ds-select__arrow" aria-hidden="true">arrow_drop_down</span>
              </button>
            </div>
          </div>
          <div class="ds-input" ${noValue ? 'hidden' : ''}>
            <div class="ds-input__field">
              <input class="ds-input__control"
                     type="text"
                     placeholder="Enter text…"
                     value="${esc(val)}"
                     data-tm-value="${tier.id}"
                     aria-label="${esc(tier.label)} value"
                     ${noValue ? 'disabled' : ''} />
            </div>
          </div>
          <div class="filter-numeric-range__actions">
            <button class="ds-button ds-button--filled ds-button--xs"
              data-apply-tm="${tier.id}" type="button"
              ${canApply ? '' : 'disabled'}>Add</button>
          </div>
        </div>
      </div>`;

    return `
      <div class="filter-tier" data-tier-id="${tier.id}">
        <div class="filter-tier__top-row">
          <button class="filter-tier__header" aria-expanded="${!collapsed}" data-tier-toggle="${tier.id}">
            <span>${esc(tier.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${badge}</span>
          </button>
        </div>
        ${body}
      </div>`;
  }

  // ── Time-range tier ───────────────────────────────────────────
  if (tier.type === 'time-range') {
    const appliedId = 'tr-' + tier.id;
    const applied   = state.selected.has(appliedId);
    const tierMin   = tier.min ?? 0;
    const tierMax   = tier.max ?? 1439;
    const step      = tier.step ?? 15;
    const draft     = state.timeRangeDrafts[tier.id];
    const curMin    = draft?.min !== null && draft?.min !== undefined ? draft.min : tierMin;
    const curMax    = draft?.max !== null && draft?.max !== undefined ? draft.max : tierMax;
    const minPct    = ((curMin - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const maxPct    = ((curMax - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
    const badge     = collapsed && applied
      ? `<span class="filter-tier__badge" aria-label="1 selected">1</span>` : '';

    const body = collapsed ? '' : `
      <div class="filter-tier__body">
        <div class="filter-numeric-range" data-tier-id="${tier.id}">
          <div class="filter-numeric-range__values">
            <span class="filter-numeric-range__value" id="tr-min-val-${tier.id}">${formatTime(curMin)}</span>
            <span class="filter-numeric-range__dash">–</span>
            <span class="filter-numeric-range__value" id="tr-max-val-${tier.id}">${formatTime(curMax)}</span>
          </div>
          <div class="filter-numeric-range__slider-wrap" id="tr-wrap-${tier.id}"
               style="--cr-min:${minPct}%;--cr-max:${maxPct}%">
            <div class="filter-numeric-range__track" aria-hidden="true">
              <div class="filter-numeric-range__fill"></div>
            </div>
            <input type="range" class="filter-numeric-range__thumb filter-numeric-range__thumb--min"
              id="tr-thumb-min-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMin}"
              data-tr-min data-tr-tier="${tier.id}"
              data-tr-tier-min="${tierMin}" data-tr-tier-max="${tierMax}"
              aria-label="Start time">
            <input type="range" class="filter-numeric-range__thumb filter-numeric-range__thumb--max"
              id="tr-thumb-max-${tier.id}"
              min="${tierMin}" max="${tierMax}" step="${step}" value="${curMax}"
              data-tr-max data-tr-tier="${tier.id}"
              data-tr-tier-min="${tierMin}" data-tr-tier-max="${tierMax}"
              aria-label="End time">
          </div>
          <div class="filter-numeric-range__bounds">
            <span>12:00 AM</span>
            <span>11:59 PM</span>
          </div>
          <div class="filter-numeric-range__actions">
            <button class="ds-button ds-button--filled ds-button--xs"
              data-apply-tr="${tier.id}" type="button">Add</button>
          </div>
        </div>
      </div>`;

    return `
      <div class="filter-tier" data-tier-id="${tier.id}">
        <div class="filter-tier__top-row">
          <button class="filter-tier__header" aria-expanded="${!collapsed}" data-tier-toggle="${tier.id}">
            <span>${esc(tier.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${badge}</span>
          </button>
        </div>
        ${body}
      </div>`;
  }

  // ── Standard card-grid tier ──────────────────────────────────
  const cards       = tier.options.map(opt => buildCard(opt)).join('');
  const allIds      = tier.options.map(o => o.id).join(',');
  const allSelected = tier.options.every(o => state.selected.has(o.id));
  const addAllLabel   = allSelected ? 'Remove all' : 'Add all';
  const addAllVariant = allSelected ? 'ds-button--destructive' : 'ds-button--text';
  const tierCount     = getTierCount(tier.id);
  const tierBadge   = collapsed && tierCount > 0
    ? `<span class="filter-tier__badge" aria-label="${tierCount} selected">${tierCount}</span>`
    : '';

  return `
    <div class="filter-tier" data-tier-id="${tier.id}">
      <div class="filter-tier__top-row">
        <button
          class="filter-tier__header"
          aria-expanded="${!collapsed}"
          data-tier-toggle="${tier.id}"
        >
          <span>${esc(tier.label)}</span>
          <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
          <span class="filter-tier__end">${tierBadge}</span>
        </button>
        <div class="ds-tooltip-wrapper">
          <button
            class="ds-button ds-button--xs ds-button--leading-icon ${addAllVariant}"
            data-add-all="${allIds}"
            aria-label="${addAllLabel} ${esc(tier.label)} filters"
          ><span class="ds-icon" aria-hidden="true">${allSelected ? 'remove' : 'add'}</span> All</button>
          <div class="ds-tooltip" role="tooltip">${addAllLabel}</div>
        </div>
      </div>
      ${collapsed ? '' : `
        <div class="filter-tier__body">
          <div class="filter-cards-grid">${cards}${GRID_SPACERS}</div>
        </div>
      `}
    </div>`;
}

function buildDatePresetOptions(group) {
  const presetItems = group.options.map(opt => {
    const sel = state.selected.has(opt.id);
    return `
      <button
        class="filter-preset-pill${sel ? ' filter-preset-pill--selected' : ''}"
        data-date-preset="${opt.id}"
        aria-pressed="${sel}"
      >${esc(opt.label)}</button>`;
  }).join('');

  const customCount = Array.from(state.selected).filter(id => id.startsWith('custom-dr-')).length;
  const customOpen  = state.datePresetCustomOpen;
  const badgeHtml   = customCount > 0
    ? `<span class="filter-preset-option__badge">${customCount}</span>` : '';

  const customToggle = `
    <button
      class="filter-preset-custom-toggle${customOpen ? ' filter-preset-custom-toggle--open' : ''}"
      data-date-preset-custom
      aria-expanded="${customOpen}"
    >
      <span class="filter-preset-custom-toggle__label">Custom dates${badgeHtml}</span>
      <span class="ds-icon ds-icon--sm filter-preset-custom-toggle__chevron" aria-hidden="true">expand_more</span>
    </button>`;

  const customPicker = customOpen
    ? `<div class="filter-preset-custom-picker">${buildNativeDateRangePicker({ suppressChips: true })}</div>`
    : '';

  return `<div class="filter-preset-list"><div class="filter-preset-pill-grid">${presetItems}</div>${customToggle}${customPicker}</div>`;
}

function buildGroupOptions(groupId) {
  const group = activeFilterGroups.find(g => g.id === groupId);
  if (!group) return '';

  // Date-preset group: single-select preset list + optional custom range picker
  if (group.type === 'date-preset') {
    return buildDatePresetOptions(group);
  }

  if (group.options) {
    const tierId      = group.id;
    const collapsed   = state.collapsedTiers.has(tierId);
    const allIds      = group.options.map(o => o.id).join(',');
    const allSelected = group.options.every(o => state.selected.has(o.id));
    const addAllLabel   = allSelected ? 'Remove all' : 'Add all';
    const addAllVariant = allSelected ? 'ds-button--destructive' : 'ds-button--text';
    const cards       = group.options.map(opt => buildCard(opt)).join('');
    const selCount    = group.options.filter(o => state.selected.has(o.id)).length;
    const tierBadge   = collapsed && selCount > 0
      ? `<span class="filter-tier__badge" aria-label="${selCount} selected">${selCount}</span>`
      : '';
    return `
      <div class="filter-tier" data-tier-id="${tierId}">
        <div class="filter-tier__top-row">
          <button
            class="filter-tier__header"
            aria-expanded="${!collapsed}"
            data-tier-toggle="${tierId}"
          >
            <span>${esc(group.label)}</span>
            <span class="ds-icon ds-icon--sm ds-icon--filled filter-tier__chevron" aria-hidden="true">arrow_drop_down</span>
            <span class="filter-tier__end">${tierBadge}</span>
          </button>
          <div class="ds-tooltip-wrapper">
            <button
              class="ds-button ds-button--xs ds-button--leading-icon ${addAllVariant}"
              data-add-all="${allIds}"
              aria-label="${addAllLabel} ${esc(group.label)} filters"
            ><span class="ds-icon" aria-hidden="true">${allSelected ? 'remove' : 'add'}</span> All</button>
            <div class="ds-tooltip" role="tooltip">${addAllLabel}</div>
          </div>
        </div>
        ${collapsed ? '' : `
          <div class="filter-tier__body">
            <div class="filter-cards-grid">${cards}${GRID_SPACERS}</div>
          </div>
        `}
      </div>`;
  }

  return group.tiers.map(tier => buildTierSection(tier)).join('');
}

// Max results shown per group before "Show N more" appears
const SEARCH_GROUP_LIMIT = 6;

// Score match quality: 0 = starts-with, 1 = word-boundary, 2 = contains
function rankMatch(label, q) {
  const lower = label.toLowerCase();
  if (lower.startsWith(q)) return 0;
  if (lower.split(/[\s/(–\-]+/).some(word => word.startsWith(q))) return 1;
  return 2;
}

function buildSearchResults(rawQuery) {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return buildGroupOptions(state.activeGroupId);

  // Collect matches. For tiered groups each tier becomes its own result group so users
  // can find e.g. "Asset Status" as a section and see all its options at once.
  // sectionMatch = true when the group/tier NAME itself matched (not just individual options).
  const grouped = new Map(); // key → { displayGroup, hits, sectionMatch }

  activeFilterGroups.forEach(group => {
    if (group.type === 'date-preset') return;

    const groupLabelMatch = group.label.toLowerCase().includes(q);

    if (group.options) {
      // Flat group — section match when the group label matches
      const isSectionMatch = groupLabelMatch;
      const hits = [];
      if (isSectionMatch) {
        group.options.forEach(opt => hits.push({ opt, rank: -1 }));
      } else {
        group.options.forEach(opt => {
          const matchLabel    = opt.label.toLowerCase().includes(q);
          const matchSublabel = opt.sublabel && opt.sublabel.toLowerCase().includes(q);
          if (matchLabel || matchSublabel)
            hits.push({ opt, rank: matchSublabel && !matchLabel ? 2 : rankMatch(opt.label, q) });
        });
        hits.sort((a, b) => a.rank - b.rank || a.opt.label.localeCompare(b.opt.label));
      }
      if (hits.length)
        grouped.set(group.id, { displayGroup: group, hits, sectionMatch: isSectionMatch });
    } else if (group.tiers) {
      // Tiered group — evaluate each tier independently so tier-name matches surface correctly
      group.tiers.forEach(tier => {
        if (!tier.options) return; // date-range / cost-range / numeric-range tiers — skip
        const tierLabelMatch = tier.label.toLowerCase().includes(q);
        const isSectionMatch = groupLabelMatch || tierLabelMatch;

        const hits = [];
        if (isSectionMatch) {
          tier.options.forEach(opt => hits.push({ opt, rank: -1 }));
        } else {
          tier.options.forEach(opt => {
            if (opt.label.toLowerCase().includes(q))
              hits.push({ opt, rank: rankMatch(opt.label, q) });
          });
          hits.sort((a, b) => a.rank - b.rank || a.opt.label.localeCompare(b.opt.label));
        }
        if (hits.length)
          grouped.set(tier.id, { displayGroup: tier, hits, sectionMatch: isSectionMatch });
      });
    }
  });

  if (!grouped.size) {
    return `
      <div class="ds-empty-state">
        <div class="ds-empty-state__graphic" aria-hidden="true"><span class="ds-icon ds-icon--xl">search_off</span></div>
        <div class="ds-empty-state__body">
          <p class="ds-empty-state__heading">No results for &ldquo;${esc(rawQuery)}&rdquo;</p>
          <p class="ds-empty-state__description">Try a different search term.</p>
        </div>
      </div>`;
  }

  // Section matches float to the top
  const sorted = Array.from(grouped.values()).sort((a, b) => {
    if (a.sectionMatch && !b.sectionMatch) return -1;
    if (!a.sectionMatch && b.sectionMatch) return 1;
    return 0;
  });

  const totalHits = sorted.reduce((s, g) => s + g.hits.length, 0);
  const header = `<div class="search-results-header">
    ${totalHits} result${totalHits !== 1 ? 's' : ''} for <strong>"${esc(rawQuery)}"</strong>
  </div>`;

  const groups = sorted.map(({ displayGroup, hits, sectionMatch }) => {
    const isExpanded  = state.expandedSearchGroups.has(displayGroup.id);
    // Section matches always show all options — no truncation needed
    const visible     = (sectionMatch || isExpanded) ? hits : hits.slice(0, SEARCH_GROUP_LIMIT);
    const remaining   = hits.length - visible.length;
    const allHitIds   = hits.map(h => h.opt.id).join(',');
    const allSelected = hits.every(h => state.selected.has(h.opt.id));
    const addAllLabel   = allSelected ? 'Remove all' : 'Add all';
    const addAllVariant = allSelected ? 'ds-button--destructive' : 'ds-button--text';

    // Highlight the section name itself when it matched; don't highlight option cards
    // (all options are shown so there's nothing to call out on individual cards)
    const groupLabelHtml = sectionMatch
      ? highlightMatch(displayGroup.label, rawQuery)
      : esc(displayGroup.label);

    const cards = visible.map(({ opt }) => buildCard(opt, sectionMatch ? '' : rawQuery)).join('');
    const showMore = remaining > 0
      ? `<button class="ds-button ds-button--text ds-button--sm search-show-more" data-expand-group="${displayGroup.id}">
           <span class="ds-icon ds-icon--sm" aria-hidden="true">expand_more</span>
           Show ${remaining} more in ${esc(displayGroup.label)}
         </button>`
      : '';

    return `
      <div class="search-result-group${sectionMatch ? ' search-result-group--section' : ''}">
        <div class="search-result-group__label">
          <span>${groupLabelHtml}</span>
          <span class="search-result-group__count">${hits.length}</span>
          <div class="ds-tooltip-wrapper">
            <button
              class="ds-button ds-button--xs ds-button--leading-icon ${addAllVariant}"
              data-add-all="${allHitIds}"
              aria-label="${addAllLabel} ${esc(displayGroup.label)} results"
            ><span class="ds-icon" aria-hidden="true">${allSelected ? 'remove' : 'add'}</span> All</button>
            <div class="ds-tooltip" role="tooltip">${addAllLabel}</div>
          </div>
        </div>
        <div class="filter-cards-grid">${cards}${GRID_SPACERS}</div>
        ${showMore}
      </div>`;
  }).join('');

  return header + groups;
}

function buildSelectedBuckets() {
  const buckets = new Map(); // bucketKey -> { meta, items: [optId] }

  state.selected.forEach(optId => {
    const meta = OPTION_META.get(optId);
    if (!meta) return;
    const key = getBucketKey(meta);
    if (!buckets.has(key)) buckets.set(key, { meta, items: [] });
    buckets.get(key).items.push(optId);
  });

  return Array.from(buckets.values()).map(({ meta, items }) => {
    const key        = getBucketKey(meta);
    const excluded   = state.excludedBuckets.has(key);
    const crumb      = getBreadcrumb(meta);
    const isCollapsed = state.collapsedSelectedBuckets.has(key) ||
      (items.length > BUCKET_AUTO_COLLAPSE_THRESHOLD && !state.expandedSelectedBuckets.has(key));

    const itemsHtml = items.map(optId => {
      const m = OPTION_META.get(optId);
      return `
        <div class="selected-bucket__item">
          <span class="selected-bucket__item-label">${esc(m.label)}</span>
          <button
            class="ds-icon-button ds-icon-button--icon ds-icon-button--sm selected-bucket__item-remove"
            aria-label="Remove ${esc(m.label)}"
            data-remove-id="${optId}"
          >
            <span class="ds-icon ds-icon--sm">close</span>
          </button>
        </div>`;
    }).join('');

    return `
      <li class="selected-bucket${excluded ? ' selected-bucket--excluded' : ''}${isCollapsed ? ' selected-bucket--collapsed' : ''}">
        <div class="selected-bucket__header">
          <div class="selected-bucket__header-top">
            <button
              class="selected-bucket__collapse-btn"
              data-collapse-bucket="${key}"
              aria-expanded="${!isCollapsed}"
              aria-label="${isCollapsed ? 'Expand' : 'Collapse'} ${esc(crumb)}"
            >
              <span class="selected-bucket__crumb">${esc(crumb)}</span>
              <span class="ds-icon ds-icon--sm ds-icon--filled selected-bucket__chevron" aria-hidden="true">arrow_drop_down</span>
            </button>
            <div class="ds-tooltip-wrapper">
              <button
                class="ds-icon-button ds-icon-button--icon ds-icon-button--sm selected-bucket__remove-btn"
                aria-label="Remove all ${esc(crumb)} filters"
                data-remove-bucket="${key}"
              >
                <span class="ds-icon ds-icon--sm">delete</span>
              </button>
              <div class="ds-tooltip" role="tooltip">Remove all</div>
            </div>
          </div>
          <div class="selected-bucket__header-bottom">
            <div class="ds-tooltip-wrapper">
              <label
                class="filter-toggle"
                data-exclude-bucket="${key}"
              >
                <input
                  class="filter-toggle__control"
                  type="checkbox"
                  role="switch"
                  aria-checked="${excluded}"
                  aria-label="${excluded ? 'Disable' : 'Enable'} exclude for ${esc(crumb)}"
                  ${excluded ? 'checked' : ''}
                />
                <span class="filter-toggle__track">
                  <span class="filter-toggle__thumb"></span>
                </span>
                <span class="filter-toggle__label">Exclude</span>
              </label>
              <div class="ds-tooltip" role="tooltip">${excluded ? 'Currently excluding — click to include' : 'Exclude these values'}</div>
            </div>
            <span class="selected-bucket__count">${items.length} ${items.length === 1 ? 'filter' : 'filters'}</span>
          </div>
        </div>
        <div class="selected-bucket__items">${itemsHtml}</div>
      </li>`;
  }).join('');
}


// ── Render ────────────────────────────────────────────────────

function renderNav() {
  const isSearching = state.searchQuery.trim().length > 0;

  const searchResultsItem = isSearching
    ? `<button class="filter-nav-item filter-nav-item--active" aria-pressed="true" aria-current="true">Search Results</button>`
    : '';

  const groupItems = activeFilterGroups.map(group => {
    const active = !isSearching && group.id === state.activeGroupId;
    const count  = getGroupCount(group.id);
    const badge  = count > 0
      ? `<span class="filter-nav-item__badge" aria-label="${count} selected">${count}</span>`
      : '';
    return `
      <button
        class="filter-nav-item${active ? ' filter-nav-item--active' : ''}"
        data-nav-group="${group.id}"
        aria-pressed="${active}"
      >${esc(group.label)}${badge}</button>`;
  }).join('');

  navEl.innerHTML = searchResultsItem + groupItems;
}

function applyCardLabelTooltips(container) {
  container.querySelectorAll('.filter-card > span:first-child').forEach(span => {
    const card = span.closest('.filter-card');
    const existing = card.querySelector('.ds-tooltip');
    if (span.scrollWidth > span.offsetWidth) {
      if (existing) {
        existing.textContent = span.textContent;
      } else {
        const tooltip = document.createElement('span');
        tooltip.className = 'ds-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = span.textContent;
        card.appendChild(tooltip);
        card.classList.add('ds-tooltip-wrapper');
      }
    } else if (existing) {
      existing.remove();
      card.classList.remove('ds-tooltip-wrapper');
    }
  });
}

function renderOptions() {
  optionsEl.innerHTML = state.searchQuery.trim()
    ? buildSearchResults(state.searchQuery)
    : buildGroupOptions(state.activeGroupId);
  applyCardLabelTooltips(optionsEl);
}

function renderSelected() {
  const count = state.selected.size;

  if (count === 0) {
    selectedEmpty.hidden  = false;
    selectedList.hidden   = true;
    selectedList.innerHTML = '';
    headerClearBtn.hidden = true;
    footerSummary.textContent = '';
    return;
  }

  selectedEmpty.hidden  = true;
  selectedList.hidden   = false;
  headerClearBtn.hidden = false;
  footerSummary.textContent = `${count} filter${count !== 1 ? 's' : ''} selected`;

  selectedList.innerHTML = buildSelectedBuckets();
}

function renderCalendarPanel() {
  const existing = document.getElementById('ds-cal-panel-float');
  if (!state.calendarOpen) {
    existing?.remove();
    return;
  }
  const field = document.querySelector('.filter-date-range-field');
  if (!field) { existing?.remove(); return; }

  const rect = field.getBoundingClientRect();
  const panel = existing || document.createElement('div');
  if (!existing) {
    panel.id = 'ds-cal-panel-float';
    panel.className = 'filter-date-range-field__cal-panel';
    document.body.appendChild(panel);
  }
  panel.style.top      = `${rect.bottom + 4}px`;
  panel.style.left     = `${rect.left}px`;
  panel.style.minWidth = `${rect.width}px`;
  panel.innerHTML = buildDateCalendar(
    state.datePickerViewYear, state.datePickerViewMonth, 'both'
  );
}

function render() {
  renderNav();
  renderOptions();
  renderSelected();
  renderCalendarPanel();
  updateActiveSetChip();
  updateSavedSetsToggleBtn();
  if (state.savedSetsOpen) renderSavedSetsPanel();
}


// ── Saved Filter Sets ─────────────────────────────────────────

function getSavedSetsKey() {
  return CONTEXTS[activeContext]?.savedSetsKey ?? `onflo-filter-sets-${activeContext}`;
}

function getSavedSets() {
  try { return JSON.parse(localStorage.getItem(getSavedSetsKey()) || '[]'); }
  catch { return []; }
}

function persistSets(sets) {
  localStorage.setItem(getSavedSetsKey(), JSON.stringify(sets));
}

function hasActiveSetChanges() {
  if (!state.activeFilterSetId) return false;
  const set = getSavedSets().find(s => s.id === state.activeFilterSetId);
  if (!set) return false;
  const currentSelected = [...state.selected]
    .filter(id => !isDynamicId(id))
    .sort();
  const savedSelected = [...set.selected].sort();
  if (currentSelected.length !== savedSelected.length) return true;
  if (currentSelected.some((id, i) => id !== savedSelected[i])) return true;
  const currentExcluded = [...state.excludedBuckets].sort();
  const savedExcluded = [...set.excludedBuckets].sort();
  if (currentExcluded.length !== savedExcluded.length) return true;
  return currentExcluded.some((k, i) => k !== savedExcluded[i]);
}

function updateActiveSetChip() {
  if (!state.activeFilterSetId) {
    activeSetChip.hidden = true;
    updateSetBtnEl.hidden = true;
    return;
  }
  const set = getSavedSets().find(s => s.id === state.activeFilterSetId);
  if (set) {
    activeSetNameEl.textContent = set.name;
    activeSetChip.hidden = false;
    updateSetBtnEl.hidden = !hasActiveSetChanges();
  } else {
    activeSetChip.hidden = true;
    updateSetBtnEl.hidden = true;
    state.activeFilterSetId = null;
  }
}

function updateSavedSetsToggleBtn() {
  const btn = document.getElementById('saved-sets-toggle-btn');
  if (!btn) return;
  const showSave = state.selected.size > 0 &&
    (!state.activeFilterSetId || hasActiveSetChanges());
  if (showSave) {
    btn.innerHTML = '<span class="ds-icon" aria-hidden="true">bookmark_add</span>Save Filters';
  } else {
    btn.innerHTML = '<span class="ds-icon" aria-hidden="true">bookmark</span>Load Filters';
  }
}

function renderSavedSetsPanel() {
  const sets = getSavedSets();
  const hasFilters = state.selected.size > 0;
  const hasChanges = hasActiveSetChanges();

  const saveForm = `
    <div class="saved-sets-save-form">
      <p class="saved-sets-save-form__label">Save current filters as new set</p>
      <div class="saved-sets-save-form__row">
        <div class="ds-input saved-sets-save-form__input-wrap">
          <div class="ds-input__field">
            <input
              class="ds-input__control"
              type="text"
              id="save-set-name-input"
              placeholder="Name this filter set…"
              maxlength="60"
              autocomplete="off"
              ${!hasFilters ? 'disabled' : ''}
              aria-label="Filter set name"
            >
          </div>
        </div>
        <button
          class="ds-button ds-button--filled"
          id="confirm-save-set-btn"
          ${!hasFilters ? 'disabled' : ''}
        >Save</button>
      </div>
      ${!hasFilters ? '<p class="saved-sets-save-form__hint">Select filters first to save a set.</p>' : ''}
    </div>`;

  const listHtml = sets.length === 0
    ? `<div class="ds-empty-state ds-empty-state--sm">
         <div class="ds-empty-state__graphic" aria-hidden="true"><span class="ds-icon ds-icon--xl">bookmark_border</span></div>
         <div class="ds-empty-state__body">
           <p class="ds-empty-state__heading">No saved filter sets yet.</p>
         </div>
       </div>`
    : sets.slice().reverse().sort((a, b) => {
        const aActive = a.id === state.activeFilterSetId ? 0 : 1;
        const bActive = b.id === state.activeFilterSetId ? 0 : 1;
        return aActive - bActive;
      }).map(set => {
        const isActive = set.id === state.activeFilterSetId;
        const date = new Date(set.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const count = set.selected.length;
        const inlineAction = isActive
          ? (hasChanges
            ? `<button
                class="ds-button ds-button--text ds-button--sm saved-set-item__update-btn"
                data-update-set="${esc(set.id)}"
                aria-label="Update ${esc(set.name)}"
              ><span class="ds-icon ds-icon--sm">sync</span></button>`
            : '')
          : `<button
              class="ds-button ds-button--text ds-button--sm saved-set-item__delete-btn"
              data-delete-set="${esc(set.id)}"
              aria-label="Delete ${esc(set.name)}"
            ><span class="ds-icon ds-icon--sm">delete</span></button>`;
        return `
          <div class="saved-set-item${isActive ? ' saved-set-item--active' : ''}">
            <div class="saved-set-item__info">
              <span class="saved-set-item__name">${esc(set.name)}</span>
              <span class="saved-set-item__meta">${count} filter${count !== 1 ? 's' : ''} · ${esc(date)}</span>
            </div>
            <div class="saved-set-item__actions">
              <button
                class="ds-button ds-button--text ds-button--sm"
                data-load-set="${esc(set.id)}"
                ${isActive ? 'disabled' : ''}
              >${isActive ? 'Loaded' : 'Load'}</button>
              ${inlineAction}
            </div>
          </div>`;
      }).join('');

  const backBtn = `
    <div class="saved-sets-back-row">
      <button class="ds-button ds-button--xs ds-button--text ds-button--leading-icon saved-sets-back-btn" id="saved-sets-back-btn">
        <span class="ds-button__icon ds-button__icon--leading" aria-hidden="true"><span class="ds-icon">arrow_back</span></span>
        Back to filters
      </button>
    </div>`;

  savedSetsBody.innerHTML = backBtn + saveForm + `<div class="saved-sets-list">${listHtml}</div>`;

  // Auto-focus name input if filters are already selected
  if (hasFilters) {
    requestAnimationFrame(() => {
      const input = document.getElementById('save-set-name-input');
      const wrap = input?.closest('.saved-sets-save-form__input-wrap');
      if (wrap) wrap.setAttribute('data-mouse-focus', '');
      input?.focus();
    });
  }
}

function openSavedSetsPanel() {
  state.savedSetsOpen = true;
  savedSetsPanel.hidden = false;
  document.getElementById('saved-sets-toggle-btn').setAttribute('aria-pressed', 'true');
  renderSavedSetsPanel();
}

function closeSavedSetsPanel() {
  state.savedSetsOpen = false;
  savedSetsPanel.hidden = true;
  document.getElementById('saved-sets-toggle-btn').setAttribute('aria-pressed', 'false');
  document.getElementById('saved-sets-toggle-btn').focus();
}

function saveCurrentSet(name) {
  const trimmed = name.trim();
  if (!trimmed || state.selected.size === 0) return null;
  const sets = getSavedSets();
  const newSet = {
    id: `fs-${Date.now()}`,
    name: trimmed,
    savedAt: new Date().toISOString(),
    selected: [...state.selected].filter(id => !isDynamicId(id)),
    excludedBuckets: [...state.excludedBuckets],
  };
  sets.push(newSet);
  persistSets(sets);
  state.activeFilterSetId = newSet.id;
  updateActiveSetChip();
  return newSet.id;
}

function updateCurrentSet() {
  if (!state.activeFilterSetId) return;
  const sets = getSavedSets();
  const idx = sets.findIndex(s => s.id === state.activeFilterSetId);
  if (idx < 0) return;
  sets[idx] = {
    ...sets[idx],
    savedAt: new Date().toISOString(),
    selected: [...state.selected].filter(id => !isDynamicId(id)),
    excludedBuckets: [...state.excludedBuckets],
  };
  persistSets(sets);
  updateActiveSetChip();
  renderSavedSetsPanel();
}

function loadSavedSet(id) {
  const set = getSavedSets().find(s => s.id === id);
  if (!set) return;
  // Clear dynamic (date field / cost range / custom date) entries from previous session
  state.selected.forEach(optId => {
    if (isDynamicId(optId)) OPTION_META.delete(optId);
  });
  state.fieldDateDrafts      = {};
  state.costRangeDraft       = { min: null, max: null };
  state.numericRangeDrafts   = {};
  state.datePresetCustomOpen = false;
  state.selected             = new Set(set.selected);
  state.excludedBuckets  = new Set(set.excludedBuckets);
  state.collapsedSelectedBuckets.clear();
  state.expandedSelectedBuckets.clear();
  state.activeFilterSetId = id;
  closeSavedSetsPanel();
  updateActiveSetChip();
  render();
}

function deleteSavedSet(id) {
  const sets = getSavedSets().filter(s => s.id !== id);
  persistSets(sets);
  if (state.activeFilterSetId === id) {
    state.activeFilterSetId = null;
    updateActiveSetChip();
  }
  renderSavedSetsPanel();
}

function detachFilterSet() {
  state.activeFilterSetId = null;
  updateActiveSetChip();
  if (state.savedSetsOpen) renderSavedSetsPanel();
}


// ── Actions ───────────────────────────────────────────────────

function toggleFilter(optionId) {
  if (state.selected.has(optionId)) {
    state.selected.delete(optionId);
    // Clean up excludedBuckets if no items remain in this bucket
    const meta = OPTION_META.get(optionId);
    if (meta) {
      const key = getBucketKey(meta);
      const hasMore = Array.from(state.selected).some(id => {
        const m = OPTION_META.get(id);
        return m && getBucketKey(m) === key;
      });
      if (!hasMore) state.excludedBuckets.delete(key);
    }
  } else {
    state.selected.add(optionId);
  }
  render();
}

function toggleBucketExclude(bucketKey) {
  if (state.excludedBuckets.has(bucketKey)) {
    state.excludedBuckets.delete(bucketKey);
  } else {
    state.excludedBuckets.add(bucketKey);
  }
  render();
}

function toggleBucketCollapse(bucketKey, isCurrentlyExpanded) {
  if (isCurrentlyExpanded) {
    // Currently expanded → collapse
    state.expandedSelectedBuckets.delete(bucketKey);
    state.collapsedSelectedBuckets.add(bucketKey);
  } else {
    // Currently collapsed → expand
    state.collapsedSelectedBuckets.delete(bucketKey);
    state.expandedSelectedBuckets.add(bucketKey);
  }
  render();
}

function handleDateCellClick(dateKey) {
  const clicked = keyToDate(dateKey);
  const { start, end } = state.dateRangeDraft;

  if (state.datePickerMode === 'single') {
    if (start && dateToKey(start) === dateKey) {
      state.dateRangeDraft = { start: null, end: null };
    } else {
      state.dateRangeDraft = { start: clicked, end: clicked };
      state.calendarOpen   = false; // close after single selection
    }
  } else {
    if (!start || end) {
      // Fresh: set start, advance active target to end input
      state.dateRangeDraft  = { start: clicked, end: null };
      state.activeDateInput = 'end';
    } else {
      // Set end — normalize so start ≤ end, close when range is complete
      state.dateRangeDraft  = clicked <= start
        ? { start: clicked, end: start }
        : { start, end: clicked };
      state.activeDateInput = 'start';
      state.calendarOpen    = false;
    }
  }
  render();

  // After render, if the calendar is still open (range mid-selection), focus the next input
  if (state.calendarOpen && state.datePickerMode === 'range') {
    document.querySelector(`[data-date-input="${state.activeDateInput}"]`)?.focus();
  }
}

function addDateRange() {
  const { start, end } = state.dateRangeDraft;
  if (!start || !end) return;

  const id    = `custom-dr-${Date.now()}`;
  const label = formatDateRangeLabel(start, end);

  // Resolve the date group — handles both assets (tiers) and service overview (date-preset)
  const dateGroup  = activeFilterGroups.find(g => g.id === 'dates');
  const groupId    = dateGroup?.id    ?? 'dates';
  const groupLabel = dateGroup?.label ?? 'Dates';

  // In date-preset context, clear any selected preset AND any previous custom range.
  // The date group is strictly OR — only one selection (preset or custom) at a time.
  if (dateGroup?.type === 'date-preset') {
    dateGroup.options.forEach(opt => state.selected.delete(opt.id));
    Array.from(state.selected).forEach(id => {
      if (id.startsWith('custom-dr-')) {
        const meta = OPTION_META.get(id);
        if (meta && meta.groupId === groupId) {
          state.selected.delete(id);
          OPTION_META.delete(id);
        }
      }
    });
  }

  OPTION_META.set(id, {
    groupId,
    groupLabel,
    tierId:    null,
    tierLabel: null,
    label,
    dateMode: state.datePickerMode,
  });

  state.selected.add(id);
  state.dateRangeDraft  = { start: null, end: null };
  state.calendarOpen    = false;
  state.activeDateInput = 'start';
  render();
}

function clearDateDraft() {
  state.dateRangeDraft = { start: null, end: null };
  render();
}

// ── Field-specific date range actions ─────────────────────────

function findTierMeta(tierId) {
  for (const group of activeFilterGroups) {
    if (!group.tiers) continue;
    const tier = group.tiers.find(t => t.id === tierId);
    if (tier) return { group, tier };
  }
  return null;
}

function applyDateField(tierId) {
  const draft = state.fieldDateDrafts[tierId];
  if (!draft || (!draft.from && !draft.to)) return;
  const found = findTierMeta(tierId);
  if (!found) return;
  const { group, tier } = found;
  const id = 'dr-' + tierId;
  OPTION_META.set(id, {
    groupId: group.id, groupLabel: group.label,
    tierId, tierLabel: tier.label,
    label: formatFieldDateRangeLabel(draft.from, draft.to),
    fromISO: draft.from,
    toISO:   draft.to,
  });
  state.selected.add(id);
  state.fieldDateDrafts[tierId] = { from: '', to: '' };
  render();
}

function clearDateField(tierId) {
  const id = 'dr-' + tierId;
  state.selected.delete(id);
  OPTION_META.delete(id);
  state.fieldDateDrafts[tierId] = { from: '', to: '' };
  state.excludedBuckets.delete(tierId);
  render();
}

// ── Cost range actions ─────────────────────────────────────────

function applyCostRange(tierId) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { group, tier } = found;
  const tierMin = tier.min ?? 0;
  const tierMax = tier.max ?? 5000;
  const min = state.costRangeDraft.min !== null ? state.costRangeDraft.min : tierMin;
  const max = state.costRangeDraft.max !== null ? state.costRangeDraft.max : tierMax;
  const id = 'cr-' + tierId;
  OPTION_META.set(id, {
    groupId: group.id, groupLabel: group.label,
    tierId, tierLabel: tier.label,
    label: formatCostLabel(min, max, tierMin, tierMax),
  });
  state.selected.add(id);
  state.costRangeDraft = { min: null, max: null };
  render();
}

function clearCostRange(tierId) {
  const id = 'cr-' + tierId;
  state.selected.delete(id);
  OPTION_META.delete(id);
  state.costRangeDraft = { min: null, max: null };
  state.excludedBuckets.delete(tierId);
  render();
}

// ── Numeric range actions ──────────────────────────────────────

function applyNumericRange(tierId) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { group, tier } = found;
  const tierMin = tier.min ?? 0;
  const tierMax = tier.max ?? 100;
  const draft   = state.numericRangeDrafts[tierId];
  const min     = draft?.min !== null && draft?.min !== undefined ? draft.min : tierMin;
  const max     = draft?.max !== null && draft?.max !== undefined ? draft.max : tierMax;
  const id      = 'nr-' + tierId;
  OPTION_META.set(id, {
    groupId: group.id, groupLabel: group.label,
    tierId, tierLabel: tier.label,
    label: formatNumericRangeLabel(min, max, tierMin, tierMax, tier.unit, tier.maxLabel),
  });
  state.selected.add(id);
  state.numericRangeDrafts[tierId] = { min: null, max: null };
  render();
}

function clearNumericRange(tierId) {
  const id = 'nr-' + tierId;
  state.selected.delete(id);
  OPTION_META.delete(id);
  state.numericRangeDrafts[tierId] = { min: null, max: null };
  state.excludedBuckets.delete(tierId);
  render();
}

function updateNumericRangeDOM(tierId, minVal, maxVal) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { tier } = found;
  const tierMax = tier.max ?? 100;

  if (!state.numericRangeDrafts[tierId]) state.numericRangeDrafts[tierId] = {};
  state.numericRangeDrafts[tierId].min = minVal;
  state.numericRangeDrafts[tierId].max = maxVal;

  const tierMin    = tier.min ?? 0;
  const minPct     = ((minVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
  const maxPct     = ((maxVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
  const u          = tier.unit ? ` ${tier.unit}` : '';
  const maxDisp    = maxVal === tierMax && tier.maxLabel ? tier.maxLabel : String(maxVal);

  const wrap   = document.getElementById(`nr-wrap-${tierId}`);
  const minEl  = document.getElementById(`nr-min-val-${tierId}`);
  const maxEl  = document.getElementById(`nr-max-val-${tierId}`);
  if (wrap)  { wrap.style.setProperty('--cr-min', `${minPct}%`); wrap.style.setProperty('--cr-max', `${maxPct}%`); }
  if (minEl) minEl.textContent = `${minVal}${u}`;
  if (maxEl) maxEl.textContent = `${maxDisp}${u}`;
}

// ── Time range DOM update ──────────────────────────────────────

function updateTimeRangeDOM(tierId, minVal, maxVal) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { tier } = found;
  const tierMin = tier.min ?? 0;
  const tierMax = tier.max ?? 1439;

  if (!state.timeRangeDrafts[tierId]) state.timeRangeDrafts[tierId] = {};
  state.timeRangeDrafts[tierId].min = minVal;
  state.timeRangeDrafts[tierId].max = maxVal;

  const minPct = ((minVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
  const maxPct = ((maxVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);

  const wrap  = document.getElementById(`tr-wrap-${tierId}`);
  const minEl = document.getElementById(`tr-min-val-${tierId}`);
  const maxEl = document.getElementById(`tr-max-val-${tierId}`);
  if (wrap)  { wrap.style.setProperty('--cr-min', `${minPct}%`); wrap.style.setProperty('--cr-max', `${maxPct}%`); }
  if (minEl) minEl.textContent = formatTime(minVal);
  if (maxEl) maxEl.textContent = formatTime(maxVal);
}

// ── Text match actions ─────────────────────────────────────────

function closeAllTmDropdowns() {
  if (!_tmFloating) return;
  _tmFloating.el.remove();
  _tmFloating.trigger?.setAttribute('aria-expanded', 'false');
  _tmFloating = null;
}

function openTmDropdown(tierId, triggerEl) {
  closeAllTmDropdowns();

  const rect = triggerEl.getBoundingClientRect();
  const op   = state.textMatchDrafts[tierId]?.operator ?? 'contains';

  const menu = document.createElement('div');
  menu.className = 'ds-menu';
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('id', `tm-floating-${tierId}`);
  menu.dataset.tmFloating = tierId;
  menu.style.cssText = `position:fixed;top:${rect.bottom + 4}px;left:${rect.left}px;width:${rect.width}px;z-index:9999;overflow-y:auto;max-height:256px;`;

  TEXT_MATCH_OPERATORS.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'ds-menu__item' + (o.value === op ? ' ds-menu__item--selected' : '');
    btn.setAttribute('role', 'option');
    btn.setAttribute('aria-selected', String(o.value === op));
    btn.setAttribute('type', 'button');
    btn.textContent = o.label;
    btn.addEventListener('mousedown', e => e.preventDefault()); // keep trigger focused
    btn.addEventListener('click', () => selectTmOperator(tierId, o.value));
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  triggerEl.setAttribute('aria-expanded', 'true');
  _tmFloating = { tierId, el: menu, trigger: triggerEl };
}

function selectTmOperator(tierId, opValue) {
  if (!state.textMatchDrafts[tierId]) state.textMatchDrafts[tierId] = { operator: 'contains', value: '' };
  state.textMatchDrafts[tierId].operator = opValue;
  const noValue = opValue === 'blank' || opValue === 'not-blank';

  const labelEl = document.getElementById(`tm-label-${tierId}`);
  const opLabel = TEXT_MATCH_OPERATORS.find(o => o.value === opValue)?.label ?? opValue;
  if (labelEl) labelEl.textContent = opLabel;

  const container = document.querySelector(`.filter-text-match[data-tier-id="${tierId}"]`);
  const inputWrap = container?.querySelector('.ds-input');
  const inputEl   = container?.querySelector('[data-tm-value]');
  const applyBtn  = container?.querySelector('[data-apply-tm]');
  if (inputWrap) inputWrap.hidden  = noValue;
  if (inputEl)   inputEl.disabled  = noValue;
  if (applyBtn)  applyBtn.disabled = !noValue && !state.textMatchDrafts[tierId].value.trim();

  closeAllTmDropdowns();
}

function applyTextMatch(tierId) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { group, tier } = found;
  const draft   = state.textMatchDrafts[tierId] || { operator: 'contains', value: '' };
  const noValue = draft.operator === 'blank' || draft.operator === 'not-blank';
  if (!noValue && !draft.value.trim()) return;
  const id = 'tm-' + tierId;
  OPTION_META.set(id, {
    groupId: group.id, groupLabel: group.label,
    tierId, tierLabel: tier.label,
    label: formatTextMatchLabel(draft.operator, draft.value),
  });
  state.selected.add(id);
  state.textMatchDrafts[tierId] = { operator: 'contains', value: '' };
  render();
}

function clearTextMatch(tierId) {
  const id = 'tm-' + tierId;
  state.selected.delete(id);
  OPTION_META.delete(id);
  state.textMatchDrafts[tierId] = { operator: 'contains', value: '' };
  render();
}

// ── Time range actions ─────────────────────────────────────────

function applyTimeRange(tierId) {
  const found = findTierMeta(tierId);
  if (!found) return;
  const { group, tier } = found;
  const tierMin = tier.min ?? 0;
  const tierMax = tier.max ?? 1439;
  const draft   = state.timeRangeDrafts[tierId];
  const min     = draft?.min !== null && draft?.min !== undefined ? draft.min : tierMin;
  const max     = draft?.max !== null && draft?.max !== undefined ? draft.max : tierMax;
  const id      = 'tr-' + tierId;
  OPTION_META.set(id, {
    groupId: group.id, groupLabel: group.label,
    tierId, tierLabel: tier.label,
    label: formatTimeRangeLabel(min, max, tierMin, tierMax),
  });
  state.selected.add(id);
  state.timeRangeDrafts[tierId] = { min: null, max: null };
  render();
}

function clearTimeRange(tierId) {
  const id = 'tr-' + tierId;
  state.selected.delete(id);
  OPTION_META.delete(id);
  state.timeRangeDrafts[tierId] = { min: null, max: null };
  render();
}

// ── Date preset actions ────────────────────────────────────────

function selectDatePreset(optionId) {
  const group = activeFilterGroups.find(g => g.type === 'date-preset');
  if (!group) return;

  const wasSelected = state.selected.has(optionId);

  // Clear all preset selections in this group
  group.options.forEach(opt => state.selected.delete(opt.id));

  // Clear any custom date range entries for this group
  Array.from(state.selected).forEach(id => {
    if (id.startsWith('custom-dr-')) {
      const meta = OPTION_META.get(id);
      if (meta && meta.groupId === group.id) {
        state.selected.delete(id);
        OPTION_META.delete(id);
      }
    }
  });

  // Close custom picker and clear its draft
  state.datePresetCustomOpen = false;
  state.dateRangeDraft  = { start: null, end: null };
  state.calendarOpen    = false;

  // Toggle: if not previously selected, select it now
  if (!wasSelected) state.selected.add(optionId);

  render();
}

function toggleDatePresetCustom() {
  // Opening: clear any preset selection so only custom will be active
  if (!state.datePresetCustomOpen) {
    const group = activeFilterGroups.find(g => g.type === 'date-preset');
    if (group) group.options.forEach(opt => state.selected.delete(opt.id));
  } else {
    // Closing: clear the draft and calendar
    state.dateRangeDraft = { start: null, end: null };
    state.calendarOpen   = false;
  }
  state.datePresetCustomOpen = !state.datePresetCustomOpen;
  render();
}

// ── Cost range real-time DOM update (no full re-render) ────────

function updateCostRangeDOM(tierId, minVal, maxVal) {
  const found = findTierMeta(tierId);
  const tierMin = found?.tier.min ?? 0;
  const tierMax = found?.tier.max ?? 5000;

  // Clamp and enforce ordering
  if (minVal > maxVal) return;
  state.costRangeDraft = { min: minVal, max: maxVal };

  const minPct = ((minVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);
  const maxPct = ((maxVal - tierMin) / (tierMax - tierMin) * 100).toFixed(1);

  const wrap   = document.getElementById(`cr-wrap-${tierId}`);
  const minEl  = document.getElementById(`cr-min-val-${tierId}`);
  const maxEl  = document.getElementById(`cr-max-val-${tierId}`);
  if (wrap)  { wrap.style.setProperty('--cr-min', `${minPct}%`); wrap.style.setProperty('--cr-max', `${maxPct}%`); }
  if (minEl) minEl.textContent = `$${minVal.toLocaleString()}`;
  if (maxEl) maxEl.textContent = `$${maxVal.toLocaleString()}`;
}

function setDatePickerMode(mode) {
  if (state.datePickerMode === mode) return;
  state.datePickerMode  = mode;
  state.dateRangeDraft  = { start: null, end: null }; // Reset draft on mode switch
  render();
}

function navigateDatePicker(direction) {
  let m = state.datePickerViewMonth + direction;
  let y = state.datePickerViewYear;
  if (m < 0)  { m = 11; y--; }
  if (m > 11) { m = 0;  y++; }
  state.datePickerViewMonth = m;
  state.datePickerViewYear  = y;
  render();
}

function removeFilter(optionId) {
  state.selected.delete(optionId);
  const meta = OPTION_META.get(optionId);
  if (meta) {
    const key = getBucketKey(meta);
    const hasMore = Array.from(state.selected).some(id => {
      const m = OPTION_META.get(id);
      return m && getBucketKey(m) === key;
    });
    if (!hasMore) state.excludedBuckets.delete(key);
  }
  if (isDynamicId(optionId)) {
    OPTION_META.delete(optionId);
    if (optionId.startsWith('dr-')) state.fieldDateDrafts[optionId.slice(3)] = { from: '', to: '' };
    if (optionId.startsWith('cr-')) state.costRangeDraft = { min: null, max: null };
    if (optionId.startsWith('nr-')) state.numericRangeDrafts[optionId.slice(3)] = { min: null, max: null };
  }
  render();
}

function isDynamicId(id) {
  return id.startsWith('custom-dr-') || id.startsWith('dr-') || id.startsWith('cr-') || id.startsWith('nr-');
}

function removeBucket(bucketKey) {
  state.selected.forEach(optId => {
    const m = OPTION_META.get(optId);
    if (m && getBucketKey(m) === bucketKey) {
      state.selected.delete(optId);
      if (isDynamicId(optId)) {
        OPTION_META.delete(optId);
        // Also clear the corresponding draft state
        if (optId.startsWith('dr-')) state.fieldDateDrafts[optId.slice(3)] = { from: '', to: '' };
        if (optId.startsWith('cr-')) state.costRangeDraft = { min: null, max: null };
        if (optId.startsWith('nr-')) state.numericRangeDrafts[optId.slice(3)] = { min: null, max: null };
      }
    }
  });
  state.excludedBuckets.delete(bucketKey);
  state.collapsedSelectedBuckets.delete(bucketKey);
  state.expandedSelectedBuckets.delete(bucketKey);
  render();
}

function clearAll() {
  state.selected.forEach(id => {
    if (isDynamicId(id)) OPTION_META.delete(id);
  });
  state.selected.clear();
  state.excludedBuckets.clear();
  state.collapsedSelectedBuckets.clear();
  state.expandedSelectedBuckets.clear();
  state.dateRangeDraft       = { start: null, end: null };
  state.fieldDateDrafts      = {};
  state.costRangeDraft       = { min: null, max: null };
  state.numericRangeDrafts   = {};
  state.datePresetCustomOpen = false;
  state.calendarOpen         = false;
  state.activeFilterSetId    = null;
  render();
}

function addAllOptions(optionIds) {
  const allSelected = optionIds.every(id => state.selected.has(id));
  if (allSelected) {
    optionIds.forEach(id => state.selected.delete(id));
    // Clean up excluded buckets whose entire bucket is now empty
    optionIds.forEach(id => {
      const meta = OPTION_META.get(id);
      if (!meta) return;
      const key = getBucketKey(meta);
      const hasMore = Array.from(state.selected).some(sid => {
        const m = OPTION_META.get(sid);
        return m && getBucketKey(m) === key;
      });
      if (!hasMore) state.excludedBuckets.delete(key);
    });
  } else {
    optionIds.forEach(id => state.selected.add(id));
  }
  render();
}

function setActiveGroup(groupId) {
  state.activeGroupId = groupId;
  optionsEl.scrollTop = 0;
  render();
}

function setSearch(query) {
  state.searchQuery = query;
  state.expandedSearchGroups.clear();
  searchClearBtn.hidden = !query;
  render();
}

function toggleTier(tierId) {
  if (state.collapsedTiers.has(tierId)) {
    state.collapsedTiers.delete(tierId);
  } else {
    state.collapsedTiers.add(tierId);
  }
  render();
}

function openModal() {
  _committedSnapshot = _snapshotSelectionState();
  render();
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  // Focus search on open — mark as mouse-focus to suppress the ADA focus ring
  requestAnimationFrame(() => {
    searchInput.closest('.ds-input').setAttribute('data-mouse-focus', '');
    searchInput.focus();
  });
  window.dispatchEvent(new CustomEvent('filterModalOpen'));
}

function closeModal() {
  if (!overlay || overlay.hidden) return;
  closeAllTmDropdowns();
  if (_committedSnapshot) {
    _restoreSelectionState(_committedSnapshot);
    _committedSnapshot = null;
  }
  overlay.hidden = true;
  document.body.style.overflow = '';
  window.dispatchEvent(new CustomEvent('filterModalClose'));
}

function renderAppliedBar() {
  const bar      = document.getElementById('filter-applied-bar');
  const cardsEl  = document.getElementById('filter-applied-cards');

  if (!bar) return;

  if (state.selected.size === 0) {
    bar.hidden = true;
    return;
  }

  // Build one bucket entry per section (tierId for tiered, groupId for flat)
  const buckets = new Map();
  state.selected.forEach(id => {
    const meta = OPTION_META.get(id);
    if (!meta) return;
    const key = getBucketKey(meta);
    if (!buckets.has(key)) buckets.set(key, { meta, items: [] });
    buckets.get(key).items.push(meta.label);
  });

  cardsEl.innerHTML = Array.from(buckets.entries()).map(([key, { meta, items }]) => {
    const excluded     = state.excludedBuckets.has(key);
    const crumb        = getBreadcrumb(meta);
    const excludedCls = excluded ? ' filter-applied-card--excluded' : '';

    const itemsHtml   = items.map(esc).join(', ');
    const tooltipHtml = `<span class="filter-applied-card__tooltip" role="tooltip">${items.map(esc).join(', ')}</span>`;

    const iconName = excluded ? 'filter_alt_off' : 'filter_alt';

    return `
      <div class="ds-card-item ds-card-item--interactive${excludedCls}"
           role="button"
           tabindex="0"
           aria-label="${esc(crumb)}: ${items.length} filter${items.length !== 1 ? 's' : ''} selected${excluded ? ', excluded' : ''}. Click to edit."
           data-group-id="${esc(meta.groupId)}">
        <div class="ds-card-item__leading" aria-hidden="true">
          <span class="ds-icon ds-icon--filled ds-icon--xs">${iconName}</span>
        </div>
        <div class="ds-card-item__body">
          <span class="ds-card-item__primary">${esc(crumb)}</span>
          <span class="ds-card-item__secondary">${itemsHtml}</span>
        </div>
        ${tooltipHtml}
        <div class="ds-card-item__action">
          <button class="filter-applied-card__remove"
                  type="button"
                  aria-label="Remove all ${esc(crumb)} filters"
                  data-remove-bucket="${esc(key)}">
            <span class="ds-icon ds-icon--sm" aria-hidden="true">close</span>
          </button>
        </div>
      </div>`;
  }).join('');

  // Unhide first so elements have real dimensions, then prune tooltips
  // from cards whose text is not actually clamped
  bar.hidden = false;

  cardsEl.querySelectorAll('.ds-card-item').forEach(card => {
    const secondary = card.querySelector('.ds-card-item__secondary');
    const tooltip   = card.querySelector('.filter-applied-card__tooltip');
    if (!tooltip) return;
    if (secondary.scrollHeight <= secondary.clientHeight) {
      tooltip.remove();
    }
  });
}

function updateFilterBadge() {
  const badge = document.getElementById('filter-count-badge');
  const btn   = document.getElementById('filter-toggle-btn');
  const count = state.selected.size;
  if (count > 0) {
    if (badge) { badge.textContent = count > 99 ? '99+' : String(count); badge.hidden = false; }
    if (btn) btn.setAttribute('aria-label', `Toggle filters, ${count} applied`);
  } else {
    if (badge) badge.hidden = true;
    if (btn) btn.setAttribute('aria-label', 'Toggle filters');
  }
}

function applyFilters() {
  renderAppliedBar();
  updateFilterBadge();
  _committedSnapshot = null; // commit — don't restore on close
  closeModal();
  const hasDateFilter = Array.from(state.selected).some(id => id.startsWith('dp-') || id.startsWith('custom-dr-') || id.startsWith('dr-'));
  window.dispatchEvent(new CustomEvent('filterApplied', { detail: { count: state.selected.size, hasDateFilter } }));
}



// ── Angular integration ──────────────────────────────────────────
window.filterModalInit = function(context) {
  if (context && context !== activeContext) {
    activeContext = context;
    if (CONTEXTS[context]) {
      activeFilterGroups = CONTEXTS[context].groups;
      OPTION_META        = buildOptionMeta(activeFilterGroups);
    } else {
      activeFilterGroups = [];
      OPTION_META        = new Map();
    }
    state.activeGroupId             = activeFilterGroups[0]?.id ?? null;
    state.searchQuery               = '';
    state.selected.clear();
    state.excludedBuckets.clear();
    state.collapsedTiers.clear();
    state.expandedSearchGroups.clear();
    state.collapsedSelectedBuckets.clear();
    state.expandedSelectedBuckets.clear();
    state.dateRangeDraft            = { start: null, end: null };
    state.fieldDateDrafts           = {};
    state.costRangeDraft            = { min: null, max: null };
    state.numericRangeDrafts        = {};
    state.datePresetCustomOpen      = false;
    state.datePickerViewYear        = new Date().getFullYear();
    state.datePickerViewMonth       = new Date().getMonth();
    state.calendarOpen              = false;
    state.activeDateInput           = 'start';
    state.activeFilterSetId         = null;
    state.savedSetsOpen             = false;
    _committedSnapshot              = null;
  }
  // Assign DOM refs
  overlay        = document.getElementById('filter-overlay');
  const freshDOM = overlay !== boundOverlay;
  if (freshDOM) boundOverlay = overlay;
  modal          = document.getElementById('filter-modal');
  navEl          = document.getElementById('filter-nav');
  optionsEl      = document.getElementById('filter-options');
  selectedEmpty  = document.getElementById('selected-empty');
  selectedList   = document.getElementById('selected-list');
  searchInput    = document.getElementById('filter-search-input');
  searchClearBtn = document.getElementById('search-clear-btn');
  headerClearBtn     = document.getElementById('header-clear-btn');
  footerSummary      = document.getElementById('footer-summary');
  savedSetsPanel     = document.getElementById('saved-sets-panel');
  savedSetsBody      = document.getElementById('saved-sets-body');
  activeSetChip      = document.getElementById('active-set-chip');
  activeSetNameEl    = document.getElementById('active-set-name');
  updateSetBtnEl     = document.getElementById('update-set-btn');

  // ── Events — attached once per DOM lifetime ──────────────────
  if (freshDOM) {

  // Event delegation on modal body
  modal.addEventListener('click', e => {
    // Field-specific date picker: Apply
    const applyDateFieldBtn = e.target.closest('[data-apply-date-field]');
    if (applyDateFieldBtn && !applyDateFieldBtn.hasAttribute('disabled')) {
      applyDateField(applyDateFieldBtn.dataset.applyDateField);
      return;
    }
  
    // Field-specific date picker: Clear
    const clearDateFieldBtn = e.target.closest('[data-clear-date-field]');
    if (clearDateFieldBtn) {
      clearDateField(clearDateFieldBtn.dataset.clearDateField);
      return;
    }
  
    // Date preset: select a preset option (single-select)
    const datePresetBtn = e.target.closest('[data-date-preset]');
    if (datePresetBtn && optionsEl.contains(datePresetBtn)) {
      selectDatePreset(datePresetBtn.dataset.datePreset);
      return;
    }
  
    // Date preset: toggle the custom date range picker
    const datePresetCustomBtn = e.target.closest('[data-date-preset-custom]');
    if (datePresetCustomBtn && optionsEl.contains(datePresetCustomBtn)) {
      toggleDatePresetCustom();
      return;
    }
  
    // Numeric range: Apply
    const applyNrBtn = e.target.closest('[data-apply-nr]');
    if (applyNrBtn) {
      applyNumericRange(applyNrBtn.dataset.applyNr);
      return;
    }
  
    // Numeric range: Clear
    const clearNrBtn = e.target.closest('[data-clear-nr]');
    if (clearNrBtn) {
      clearNumericRange(clearNrBtn.dataset.clearNr);
      return;
    }

    // Text match: operator dropdown trigger — opens portal above the modal
    const tmTrigger = e.target.closest('[data-tm-trigger]');
    if (tmTrigger) {
      const tierId  = tmTrigger.dataset.tmTrigger;
      const isOpen  = _tmFloating?.tierId === tierId;
      closeAllTmDropdowns();
      if (!isOpen) openTmDropdown(tierId, tmTrigger);
      return;
    }

    // Text match: Apply
    const applyTmBtn = e.target.closest('[data-apply-tm]');
    if (applyTmBtn && !applyTmBtn.hasAttribute('disabled')) {
      applyTextMatch(applyTmBtn.dataset.applyTm);
      return;
    }

    // Text match: Clear
    const clearTmBtn = e.target.closest('[data-clear-tm]');
    if (clearTmBtn) {
      clearTextMatch(clearTmBtn.dataset.clearTm);
      return;
    }

    // Time range: Apply
    const applyTrBtn = e.target.closest('[data-apply-tr]');
    if (applyTrBtn) {
      applyTimeRange(applyTrBtn.dataset.applyTr);
      return;
    }

    // Time range: Clear
    const clearTrBtn = e.target.closest('[data-clear-tr]');
    if (clearTrBtn) {
      clearTimeRange(clearTrBtn.dataset.clearTr);
      return;
    }

    // Cost range: Apply
    const applyCostBtn = e.target.closest('[data-apply-cost-range]');
    if (applyCostBtn) {
      applyCostRange(applyCostBtn.dataset.applyCostRange);
      return;
    }
  
    // Cost range: Clear
    const clearCostBtn = e.target.closest('[data-clear-cost-range]');
    if (clearCostBtn) {
      clearCostRange(clearCostBtn.dataset.clearCostRange);
      return;
    }
  
    // Date range picker: calendar day
    const dayBtn = e.target.closest('[data-date]');
    if (dayBtn && optionsEl.contains(dayBtn)) {
      handleDateCellClick(dayBtn.dataset.date);
      return;
    }
  
    // Date range picker: prev/next month
    const calPrev = e.target.closest('[data-cal-prev]');
    if (calPrev) { navigateDatePicker(-1); return; }
    const calNext = e.target.closest('[data-cal-next]');
    if (calNext) { navigateDatePicker(1);  return; }
  
    // Date range picker: add range
    const addRangeBtn = e.target.closest('[data-add-date-range]');
    if (addRangeBtn && !addRangeBtn.hasAttribute('disabled')) { addDateRange(); return; }

    // Date range picker: clear draft
    const clearDraftBtn = e.target.closest('[data-clear-date-draft]');
    if (clearDraftBtn) { clearDateDraft(); return; }

    // Native date range picker: open browser picker
    const openPickerBtn = e.target.closest('[data-open-picker]');
    if (openPickerBtn) {
      const inputEl = document.getElementById(openPickerBtn.dataset.openPicker);
      if (inputEl) { try { inputEl.showPicker(); } catch (_) { inputEl.focus(); } }
      return;
    }

    // Native date range picker: add range
    const addNativeRangeBtn = e.target.closest('[data-add-native-date-range]');
    if (addNativeRangeBtn && !addNativeRangeBtn.hasAttribute('disabled')) {
      state.datePickerMode = 'range';
      addDateRange();
      return;
    }

    // Native date range picker: clear draft
    const clearNativeDraftBtn = e.target.closest('[data-clear-native-date-draft]');
    if (clearNativeDraftBtn) { clearDateDraft(); return; }
  
    // Date range picker: mode toggle
    const modeBtn = e.target.closest('[data-date-mode]');
    if (modeBtn) { setDatePickerMode(modeBtn.dataset.dateMode); return; }
  
    // Date range picker: trailing icon toggles the calendar
    const calToggleBtn = e.target.closest('[data-toggle-calendar]');
    if (calToggleBtn) {
      state.calendarOpen = !state.calendarOpen;
      render();
      if (state.calendarOpen) {
        document.querySelector(`[data-date-input="${state.activeDateInput}"]`)?.focus();
      }
      return;
    }
  
    // Add all / remove all
    const addAllBtn = e.target.closest('[data-add-all]');
    if (addAllBtn && optionsEl.contains(addAllBtn)) {
      const ids = addAllBtn.dataset.addAll.split(',').filter(Boolean);
      addAllOptions(ids);
      return;
    }
  
    // Filter card
    const card = e.target.closest('[data-option-id]');
    if (card && optionsEl.contains(card)) {
      toggleFilter(card.dataset.optionId);
      return;
    }
  
    // Nav group
    const navItem = e.target.closest('[data-nav-group]');
    if (navItem) {
      state.searchQuery = '';
      searchInput.value = '';
      searchClearBtn.hidden = true;
      setActiveGroup(navItem.dataset.navGroup);
      return;
    }
  
    // Expand search group
    const expandBtn = e.target.closest('[data-expand-group]');
    if (expandBtn) {
      state.expandedSearchGroups.add(expandBtn.dataset.expandGroup);
      render();
      return;
    }
  
    // Tier toggle
    const tierToggle = e.target.closest('[data-tier-toggle]');
    if (tierToggle) {
      toggleTier(tierToggle.dataset.tierToggle);
      return;
    }
  
    // Collapse/expand selected bucket
    const collapseBtn = e.target.closest('[data-collapse-bucket]');
    if (collapseBtn) {
      const isExpanded = collapseBtn.getAttribute('aria-expanded') === 'true';
      toggleBucketCollapse(collapseBtn.dataset.collapseBucket, isExpanded);
      return;
    }
  
    // Exclude toggle (bucket-level)
    const excludeBtn = e.target.closest('[data-exclude-bucket]');
    if (excludeBtn) {
      toggleBucketExclude(excludeBtn.dataset.excludeBucket);
      return;
    }
  
    // Remove entire bucket/section
    const removeBucketBtn = e.target.closest('[data-remove-bucket]');
    if (removeBucketBtn) {
      removeBucket(removeBucketBtn.dataset.removeBucket);
      return;
    }
  
    // Remove filter
    const removeBtn = e.target.closest('[data-remove-id]');
    if (removeBtn) {
      removeFilter(removeBtn.dataset.removeId);
      return;
    }
  
    // Saved sets: toggle panel open/close
    if (e.target.closest('#saved-sets-toggle-btn')) {
      state.savedSetsOpen ? closeSavedSetsPanel() : openSavedSetsPanel();
      return;
    }
  
    // Saved sets: back button — close panel and return to filters
    if (e.target.closest('#saved-sets-back-btn')) {
      closeSavedSetsPanel();
      return;
    }
  
    // Active set: update button — save current filters into the loaded set
    if (e.target.closest('#update-set-btn')) {
      updateCurrentSet();
      return;
    }
  
    // Saved sets: save new set
    if (e.target.closest('#confirm-save-set-btn')) {
      const input = document.getElementById('save-set-name-input');
      if (input && input.value.trim()) {
        saveCurrentSet(input.value);
        renderSavedSetsPanel();
      }
      return;
    }
  
    // Saved sets: update existing set
    const updateSetBtn = e.target.closest('[data-update-set]');
    if (updateSetBtn) {
      updateCurrentSet();
      return;
    }
  
    // Saved sets: load a set
    const loadBtn = e.target.closest('[data-load-set]');
    if (loadBtn) {
      loadSavedSet(loadBtn.dataset.loadSet);
      return;
    }
  
    // Saved sets: delete a set
    const deleteBtn = e.target.closest('[data-delete-set]');
    if (deleteBtn) {
      deleteSavedSet(deleteBtn.dataset.deleteSet);
      return;
    }
  });
  
  // Click delegation for the floating calendar panel (outside the modal element)
  document.addEventListener('click', e => {
    const floatPanel = document.getElementById('ds-cal-panel-float');
    if (!floatPanel || !floatPanel.contains(e.target)) return;
  
    const dayBtn  = e.target.closest('[data-date]');
    if (dayBtn) { handleDateCellClick(dayBtn.dataset.date); return; }
  
    const calPrev = e.target.closest('[data-cal-prev]');
    if (calPrev) { navigateDatePicker(-1); return; }
  
    const calNext = e.target.closest('[data-cal-next]');
    if (calNext) { navigateDatePicker(1); return; }
  });
  
  // Date range picker hover preview
  function handleCalendarHover(e) {
    const { start, end } = state.dateRangeDraft;
    if (state.datePickerMode !== 'range') return;
    if (!start || end) return;
    const dayBtn = e.target.closest('[data-date]');
    if (dayBtn) updateCalendarPreview(dayBtn.dataset.date);
  }
  
  optionsEl.addEventListener('mouseover', handleCalendarHover);
  optionsEl.addEventListener('mouseleave', clearCalendarPreview);
  
  // Position add-all tooltips using fixed coords so they escape the scroll container clip.
  // Called on mouseover (hover) and focusin (keyboard) — both fire before the browser repaints,
  // so the tooltip appears at the correct position on its first visible frame.
  function positionAddAllTooltip(btn) {
    const wrapper = btn.closest('.ds-tooltip-wrapper');
    const tip = wrapper?.querySelector('.ds-tooltip');
    if (!wrapper || !tip) return;
    const rect = btn.getBoundingClientRect();
    const tipH = tip.offsetHeight || 24;
    wrapper.style.setProperty('--add-all-tip-top',  `${rect.top - tipH - 8}px`);
    wrapper.style.setProperty('--add-all-tip-left', `${rect.left + rect.width / 2}px`);
  }
  optionsEl.addEventListener('mouseover', e => {
    const wrapper = e.target.closest('.ds-tooltip-wrapper');
    if (!wrapper) return;
    const btn = wrapper.querySelector('[data-add-all]');
    if (btn) positionAddAllTooltip(btn);
  });
  optionsEl.addEventListener('focusin', e => {
    const btn = e.target.closest('[data-add-all]');
    if (btn) positionAddAllTooltip(btn);
  });
  
  // Position tooltips inside the selected-body using fixed coords — same escape pattern.
  // JS writes --sel-tip-top / --sel-tip-left on the wrapper and
  // --sel-card-tip-top / --sel-card-tip-left on the card element.
  function positionSelectedTip(wrapper) {
    const tip = wrapper.querySelector('.ds-tooltip');
    if (!tip) return;
    const trigger = wrapper.querySelector('button, input, label') ?? wrapper.firstElementChild;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const tipH = tip.offsetHeight || 24;
    const below = tip.classList.contains('ds-tooltip--below');
    wrapper.style.setProperty('--sel-tip-top',  below ? `${rect.bottom + 8}px` : `${rect.top - tipH - 8}px`);
    wrapper.style.setProperty('--sel-tip-left', `${rect.left + rect.width / 2}px`);
  }
  function positionSelectedCardTip(card) {
    const tip = card.querySelector('.filter-applied-card__tooltip');
    if (!tip) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--sel-card-tip-top',  `${rect.bottom + 6}px`);
    card.style.setProperty('--sel-card-tip-left', `${rect.left + rect.width / 2}px`);
  }
  const selectedBodyEl = document.getElementById('selected-body');
  selectedBodyEl.addEventListener('mouseover', e => {
    const wrapper = e.target.closest('.ds-tooltip-wrapper');
    if (wrapper) positionSelectedTip(wrapper);
    const card = e.target.closest('.ds-card-item');
    if (card) positionSelectedCardTip(card);
  });
  selectedBodyEl.addEventListener('focusin', e => {
    const wrapper = e.target.closest('.ds-tooltip-wrapper');
    if (wrapper) positionSelectedTip(wrapper);
    const card = e.target.closest('.ds-card-item');
    if (card) positionSelectedCardTip(card);
  });
  
  document.addEventListener('mouseover', e => {
    const floatPanel = document.getElementById('ds-cal-panel-float');
    if (floatPanel && floatPanel.contains(e.target)) handleCalendarHover(e);
  });
  document.addEventListener('mouseleave', e => {
    const floatPanel = document.getElementById('ds-cal-panel-float');
    if (floatPanel && e.target === floatPanel) clearCalendarPreview();
  });
  
  // Native date range picker inputs — update dateRangeDraft state
  optionsEl.addEventListener('change', e => {
    const startEl = e.target.closest('[data-native-date-start]');
    const endEl   = e.target.closest('[data-native-date-end]');
    if (!startEl && !endEl) return;

    const value = (startEl || endEl).value;
    const parsed = value ? new Date(value + 'T12:00:00') : null;
    if (startEl) state.dateRangeDraft.start = parsed;
    else         state.dateRangeDraft.end   = parsed;

    const addBtn = document.querySelector('[data-add-native-date-range]');
    if (addBtn) addBtn.disabled = !(state.dateRangeDraft.start && state.dateRangeDraft.end);
  });

  // Field-specific date inputs — update draft without re-render
  optionsEl.addEventListener('input', e => {
    const fromEl = e.target.closest('[data-date-field-from]');
    const toEl   = e.target.closest('[data-date-field-to]');
    if (fromEl || toEl) {
      const tierId = fromEl ? fromEl.dataset.dateFieldFrom : toEl.dataset.dateFieldTo;
      if (!state.fieldDateDrafts[tierId]) state.fieldDateDrafts[tierId] = { from: '', to: '' };
      if (fromEl) state.fieldDateDrafts[tierId].from = fromEl.value;
      else        state.fieldDateDrafts[tierId].to   = toEl.value;
      // Enable/disable Apply button in place — no re-render
      const draft  = state.fieldDateDrafts[tierId];
      const canApply = !!(draft.from || draft.to);
      const applyBtn = e.target.closest('.filter-date-field')
        ?.querySelector('[data-apply-date-field]');
      if (applyBtn) applyBtn.disabled = !canApply;
      return;
    }
  });
  
  // Cost range sliders — update DOM in place without re-render
  optionsEl.addEventListener('input', e => {
    const minInput = e.target.closest('[data-cost-min]');
    const maxInput = e.target.closest('[data-cost-max]');
    if (!minInput && !maxInput) return;
  
    const tierId  = (minInput || maxInput).dataset.costTier;
    const wrap    = document.getElementById(`cr-wrap-${tierId}`);
    const tierMin = Number((minInput || maxInput).dataset.costTierMin);
    const tierMax = Number((minInput || maxInput).dataset.costTierMax);
    const minThumb = document.getElementById(`cr-thumb-min-${tierId}`);
    const maxThumb = document.getElementById(`cr-thumb-max-${tierId}`);
    if (!minThumb || !maxThumb) return;
  
    let minVal = Number(minThumb.value);
    let maxVal = Number(maxThumb.value);
  
    // Prevent thumbs from crossing
    if (minInput && minVal > maxVal) { minVal = maxVal; minThumb.value = minVal; }
    if (maxInput && maxVal < minVal) { maxVal = minVal; maxThumb.value = maxVal; }
  
    updateCostRangeDOM(tierId, minVal, maxVal);
  });
  
  // Numeric range sliders — update DOM in place without re-render
  optionsEl.addEventListener('input', e => {
    const minInput = e.target.closest('[data-nr-min]');
    const maxInput = e.target.closest('[data-nr-max]');
    if (!minInput && !maxInput) return;

    const tierId   = (minInput || maxInput).dataset.nrTier;
    const minThumb = document.getElementById(`nr-thumb-min-${tierId}`);
    const maxThumb = document.getElementById(`nr-thumb-max-${tierId}`);
    if (!minThumb || !maxThumb) return;

    let minVal = Number(minThumb.value);
    let maxVal = Number(maxThumb.value);

    if (minInput && minVal > maxVal) { minVal = maxVal; minThumb.value = minVal; }
    if (maxInput && maxVal < minVal) { maxVal = minVal; maxThumb.value = maxVal; }

    updateNumericRangeDOM(tierId, minVal, maxVal);
  });

  // Time range sliders — update DOM in place without re-render
  optionsEl.addEventListener('input', e => {
    const minInput = e.target.closest('[data-tr-min]');
    const maxInput = e.target.closest('[data-tr-max]');
    if (!minInput && !maxInput) return;

    const tierId   = (minInput || maxInput).dataset.trTier;
    const minThumb = document.getElementById(`tr-thumb-min-${tierId}`);
    const maxThumb = document.getElementById(`tr-thumb-max-${tierId}`);
    if (!minThumb || !maxThumb) return;

    let minVal = Number(minThumb.value);
    let maxVal = Number(maxThumb.value);

    if (minInput && minVal > maxVal) { minVal = maxVal; minThumb.value = minVal; }
    if (maxInput && maxVal < minVal) { maxVal = minVal; maxThumb.value = maxVal; }

    updateTimeRangeDOM(tierId, minVal, maxVal);
  });

  // Close portal if the options panel scrolls (trigger moves, portal would misalign)
  optionsEl.addEventListener('scroll', () => closeAllTmDropdowns(), { passive: true });

  // Close the portal dropdown when clicking outside the trigger or the portal itself
  document.addEventListener('pointerdown', e => {
    if (!_tmFloating) return;
    if (e.target.closest('[data-tm-trigger]')) return;
    if (_tmFloating.el.contains(e.target)) return;
    closeAllTmDropdowns();
  });

  // Mouse-focus suppression — prevents ADA ring on pointer interactions
  optionsEl.addEventListener('pointerdown', e => {
    const selectWrap = e.target.closest('.ds-select');
    if (selectWrap && selectWrap.querySelector('[data-tm-trigger]')) {
      selectWrap.setAttribute('data-mouse-focus', '');
    }
    const inputWrap = e.target.closest('.ds-input');
    if (inputWrap && inputWrap.querySelector('[data-tm-value]')) {
      inputWrap.setAttribute('data-mouse-focus', '');
    }
  });

  optionsEl.addEventListener('focusout', e => {
    const selectWrap = e.target.closest('.ds-select');
    if (selectWrap && !selectWrap.contains(e.relatedTarget)) {
      selectWrap.removeAttribute('data-mouse-focus');
    }
    const inputWrap = e.target.closest('.ds-input');
    if (inputWrap && !inputWrap.contains(e.relatedTarget)) {
      inputWrap.removeAttribute('data-mouse-focus');
    }
  });

  // Text match value input — enable/disable Apply
  optionsEl.addEventListener('input', e => {
    const textInput = e.target.closest('[data-tm-value]');
    if (!textInput) return;
    const tierId = textInput.dataset.tmValue;
    if (!state.textMatchDrafts[tierId]) state.textMatchDrafts[tierId] = { operator: 'contains', value: '' };
    state.textMatchDrafts[tierId].value = textInput.value;
    const container = textInput.closest('.filter-text-match');
    const applyBtn  = container?.querySelector('[data-apply-tm]');
    if (applyBtn) applyBtn.disabled = !textInput.value.trim();
  });

  // Date inputs: typing a valid date updates state + calendar without re-rendering inputs
  optionsEl.addEventListener('input', e => {
    const inputEl = e.target.closest('[data-date-input]');
    if (!inputEl) return;
  
    const which  = inputEl.dataset.dateInput; // 'start' | 'end'
    const parsed = parseDateInput(inputEl.value);
  
    if (parsed) {
      if (which === 'start') {
        state.dateRangeDraft.start = parsed;
        if (state.datePickerMode === 'single') state.dateRangeDraft.end = parsed;
      } else {
        state.dateRangeDraft.end = parsed;
      }
      // Navigate calendar to show the typed month
      state.datePickerViewYear  = parsed.getFullYear();
      state.datePickerViewMonth = parsed.getMonth();
  
      // Partial re-render: update only the calendar grid (inputs untouched)
      const calPanel = document.querySelector('.filter-date-range-field__cal-panel');
      if (calPanel) {
        calPanel.innerHTML = buildDateCalendar(
          state.datePickerViewYear, state.datePickerViewMonth, 'both'
        );
      }
      updateDatePickerButtons();
  
      // Auto-advance to end input in range mode
      if (which === 'start' && state.datePickerMode === 'range') {
        state.activeDateInput = 'end';
        const endInput = document.querySelector('[data-date-input="end"]');
        if (endInput) { endInput.focus(); endInput.select(); }
      }
    } else if (!inputEl.value) {
      // Field cleared — reset that side of the draft
      if (which === 'start') {
        state.dateRangeDraft.start = null;
        if (state.datePickerMode === 'single') state.dateRangeDraft.end = null;
      } else {
        state.dateRangeDraft.end = null;
      }
      const calPanel = document.querySelector('.filter-date-range-field__cal-panel');
      if (calPanel) {
        calPanel.innerHTML = buildDateCalendar(
          state.datePickerViewYear, state.datePickerViewMonth, 'both'
        );
      }
      updateDatePickerButtons();
    }
  });
  
  // Clicking a date input records it as the active target for calendar clicks.
  // Uses direct DOM manipulation so the typed value isn't stomped by a re-render.
  optionsEl.addEventListener('focusin', e => {
    const inputEl = e.target.closest('[data-date-input]');
    if (!inputEl) return;
  
    const which = inputEl.dataset.dateInput;
    if (state.activeDateInput === which) return;
    state.activeDateInput = which;
  
    if (state.calendarOpen) {
      document.querySelectorAll('[data-date-input]').forEach(el => {
        el.classList.toggle('filter-date-range-field__input--active',
          state.datePickerMode === 'range' && el.dataset.dateInput === which);
      });
    }
  });
  
  // Restore invalid partial text when the user leaves an input
  optionsEl.addEventListener('focusout', e => {
    const inputEl = e.target.closest('[data-date-input]');
    if (!inputEl || !inputEl.value) return;
    if (!parseDateInput(inputEl.value)) {
      const which = inputEl.dataset.dateInput;
      const d = which === 'start' ? state.dateRangeDraft.start : state.dateRangeDraft.end;
      inputEl.value = d ? formatDateInput(d) : '';
    }
  });
  
  // Close calendar when clicking outside the date range picker or the floating panel
  document.addEventListener('pointerdown', e => {
    if (!state.calendarOpen) return;
    const picker     = document.getElementById('date-range-picker');
    const floatPanel = document.getElementById('ds-cal-panel-float');
    if (!picker) return;
    if (picker.contains(e.target) || floatPanel?.contains(e.target)) return;
  
    state.calendarOpen = false;
    floatPanel?.remove();
    const field = picker.querySelector('.filter-date-range-field');
    if (field) field.classList.remove('filter-date-range-field--open');
    picker.querySelector('[data-toggle-calendar]')
      ?.setAttribute('aria-label', 'Open calendar');
    picker.querySelector('[data-toggle-calendar]')
      ?.setAttribute('aria-expanded', 'false');
    picker.querySelector('[data-toggle-calendar]')
      ?.classList.remove('filter-date-range-field__cal-btn--open');
  
    syncInputsFromState();
  }, true);
  
  // Saved sets: Enter key submits the save form
  savedSetsBody.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const input = e.target.closest('#save-set-name-input');
    if (!input || !input.value.trim()) return;
    saveCurrentSet(input.value);
    renderSavedSetsPanel();
  });

  // Mouse-focus suppression for save-set name input
  savedSetsBody.addEventListener('pointerdown', e => {
    const inputWrap = e.target.closest('.saved-sets-save-form__input-wrap');
    if (inputWrap) inputWrap.setAttribute('data-mouse-focus', '');
  });
  savedSetsBody.addEventListener('focusout', e => {
    if (e.target.id === 'save-set-name-input') {
      e.target.closest('.saved-sets-save-form__input-wrap')?.removeAttribute('data-mouse-focus');
    }
  });
  
  // Search
  searchInput.addEventListener('input', e => setSearch(e.target.value));

  // Mouse-focus tracking — suppresses focus ring for mouse/pointer clicks
  const searchWrapper = searchInput.closest('.ds-input');
  searchWrapper.addEventListener('pointerdown', () => { searchWrapper.setAttribute('data-mouse-focus', ''); });
  searchInput.addEventListener('blur', () => { searchWrapper.removeAttribute('data-mouse-focus'); });
  
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    setSearch('');
  });
  
  // Header clear button (selected panel)
  headerClearBtn.addEventListener('click', clearAll);
  
  // Footer actions
  document.getElementById('apply-btn').addEventListener('click', applyFilters);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  
  // Open modal
  
  // Applied filters bar — remove-section and click-to-edit
  document.getElementById('filter-applied-cards').addEventListener('click', e => {
    // Remove entire bucket when the X button is clicked
    const removeBtn = e.target.closest('[data-remove-bucket]');
    if (removeBtn) {
      removeBucket(removeBtn.dataset.removeBucket);
      renderAppliedBar();
      updateFilterBadge();
      const hasDateFilter = Array.from(state.selected).some(id => id.startsWith('dp-') || id.startsWith('custom-dr-') || id.startsWith('dr-'));
      window.dispatchEvent(new CustomEvent('filterApplied', { detail: { count: state.selected.size, hasDateFilter } }));
      return;
    }
    // Click anywhere else on the card → open modal at that group
    const card = e.target.closest('.ds-card-item');
    if (card) {
      setActiveGroup(card.dataset.groupId);
      openModal();
    }
  });
  
  document.getElementById('filter-applied-cards').addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.ds-card-item[role="button"]');
    if (card && e.target === card) {
      e.preventDefault();
      setActiveGroup(card.dataset.groupId);
      openModal();
    }
  });
  
  // Close on scrim click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  
  // Close on Escape — closes open tm dropdowns first, then the modal
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const openDropdown = document.querySelector('.ds-select__dropdown.is-open');
    if (openDropdown) { closeAllTmDropdowns(); return; }
    if (!overlay.hidden) closeModal();
  });

  } // end freshDOM guard

  // ── Context switcher ─────────────────────────────────────────
  function switchContext(contextKey) {
    if (!CONTEXTS[contextKey] || contextKey === activeContext) return;
  
    // Close modal without applying pending changes
    if (!overlay.hidden) closeModal();
  
    activeContext      = contextKey;
    activeFilterGroups = CONTEXTS[contextKey].groups;
    OPTION_META        = buildOptionMeta(activeFilterGroups);
  
    // Reset all filter state
    state.activeGroupId             = activeFilterGroups[0]?.id ?? null;
    state.searchQuery               = '';
    state.selected.clear();
    state.excludedBuckets.clear();
    state.collapsedTiers.clear();
    state.expandedSearchGroups.clear();
    state.collapsedSelectedBuckets.clear();
    state.expandedSelectedBuckets.clear();
    state.dateRangeDraft            = { start: null, end: null };
    state.fieldDateDrafts           = {};
    state.costRangeDraft            = { min: null, max: null };
    state.numericRangeDrafts        = {};
    state.datePresetCustomOpen      = false;
    state.datePickerViewYear        = new Date().getFullYear();
    state.datePickerViewMonth       = new Date().getMonth();
    state.calendarOpen              = false;
    state.activeDateInput           = 'start';
    state.activeFilterSetId         = null;
    state.savedSetsOpen             = false;
  
    // Reset search input
    searchInput.value = '';
  
    // Re-render filter UI and applied bar
    render();
    updateSavedSetsToggleBtn();
  
    // Clear applied filters bar
    applyFilters();
  }
  


  // ── Init ──────────────────────────────────────────────────────
  render();
  renderAppliedBar();
  updateFilterBadge();
  updateSavedSetsToggleBtn();
};

window.filterModalOpen  = function() { if (overlay) openModal(); };
window.filterModalClose = function() { if (overlay) closeModal(); };

// Clears only date-related selections (presets + custom ranges) and re-applies.
// Called by the dashboard date dropdown when the user picks a date there instead.
window.filterModalClearDates = function() {
  Array.from(state.selected).forEach(id => {
    if (id.startsWith('dp-') || id.startsWith('custom-dr-') || id.startsWith('dr-')) {
      state.selected.delete(id);
      OPTION_META.delete(id);
    }
  });
  state.datePresetCustomOpen = false;
  state.dateRangeDraft  = { start: null, end: null };
  state.fieldDateDrafts = {};
  renderAppliedBar();
  updateFilterBadge();
  if (overlay) render();
  window.dispatchEvent(new CustomEvent('filterApplied', { detail: { count: state.selected.size, hasDateFilter: false } }));
};

// ── Standalone date range picker (Service Overview custom date) ──────────────
// Opens the same calendar UI used inside the filter modal as a standalone dialog.
// Dispatches a 'dateRangeSelected' CustomEvent on window when the user confirms,
// with detail: { label: string, start: Date, end: Date, mode: 'range'|'single' }.
window.openDateRangePicker = function() {
  // Reset shared draft state
  state.dateRangeDraft  = { start: null, end: null };
  state.calendarOpen    = false;
  state.activeDateInput = 'start';
  state.datePickerMode  = 'range';

  // Build backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'ds-dialog-backdrop';
  backdrop.setAttribute('role', 'presentation');

  // Build dialog shell
  const dialog = document.createElement('div');
  dialog.className = 'ds-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'sdp-title');

  const dialogBody = document.createElement('div');
  dialogBody.className = 'ds-dialog__body';
  dialogBody.innerHTML = '<h2 id="sdp-title" class="ds-dialog__title">Custom Date Range</h2>';

  const pickerWrap = document.createElement('div');
  pickerWrap.className = 'standalone-date-picker__body';
  dialogBody.appendChild(pickerWrap);

  const dialogDivider = document.createElement('div');
  dialogDivider.className = 'ds-dialog__divider';

  const dialogActions = document.createElement('div');
  dialogActions.className = 'ds-dialog__actions';
  dialogActions.innerHTML = '<button class="ds-button ds-button--text" data-sdp-cancel type="button">Cancel</button>';

  dialog.append(dialogBody, dialogDivider, dialogActions);
  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);

  function renderPicker() {
    pickerWrap.innerHTML = buildDateRangePicker({ suppressChips: true });
    renderCalendarPanel();
    syncInputsFromState();
    updateDatePickerButtons();
  }
  renderPicker();

  function closeStandalone() {
    state.calendarOpen = false;
    document.getElementById('ds-cal-panel-float')?.remove();
    state.dateRangeDraft = { start: null, end: null };
    document.removeEventListener('click', floatClickHandler);
    document.removeEventListener('keydown', escHandler);
    backdrop.remove();
  }

  // Backdrop click-outside closes
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeStandalone(); });

  // Dialog interactions
  dialog.addEventListener('click', e => {
    if (e.target.closest('[data-sdp-cancel]')) { closeStandalone(); return; }

    const modeBtn = e.target.closest('[data-date-mode]');
    if (modeBtn) { setDatePickerMode(modeBtn.dataset.dateMode); renderPicker(); return; }

    const calToggle = e.target.closest('[data-toggle-calendar]');
    if (calToggle) {
      state.calendarOpen = !state.calendarOpen;
      renderPicker();
      if (state.calendarOpen) pickerWrap.querySelector(`[data-date-input="${state.activeDateInput}"]`)?.focus();
      return;
    }

    if (e.target.closest('[data-cal-prev]')) { navigateDatePicker(-1); renderPicker(); return; }
    if (e.target.closest('[data-cal-next]')) { navigateDatePicker(1);  renderPicker(); return; }

    const dayBtn = e.target.closest('[data-date]');
    if (dayBtn) { handleDateCellClick(dayBtn.dataset.date); renderPicker(); return; }

    const addBtn = e.target.closest('[data-add-date-range]');
    if (addBtn && !addBtn.hasAttribute('disabled')) {
      const { start, end } = state.dateRangeDraft;
      const effectiveEnd = end ?? start;
      if (!start) return;
      window.dispatchEvent(new CustomEvent('dateRangeSelected', {
        detail: { label: formatDateRangeLabel(start, effectiveEnd), start, end: effectiveEnd, mode: state.datePickerMode }
      }));
      closeStandalone();
      return;
    }

    if (e.target.closest('[data-clear-date-draft]')) { clearDateDraft(); renderPicker(); return; }
  });

  // Floating calendar panel clicks
  function floatClickHandler(e) {
    const panel = document.getElementById('ds-cal-panel-float');
    if (!panel?.contains(e.target)) return;
    const dayBtn = e.target.closest('[data-date]');
    if (dayBtn) { handleDateCellClick(dayBtn.dataset.date); renderPicker(); return; }
    if (e.target.closest('[data-cal-prev]')) { navigateDatePicker(-1); renderPicker(); return; }
    if (e.target.closest('[data-cal-next]')) { navigateDatePicker(1);  renderPicker(); return; }
  }
  document.addEventListener('click', floatClickHandler);

  // Text input changes
  dialog.addEventListener('input', e => {
    const input = e.target.closest('[data-date-input]');
    if (!input) return;
    const which  = input.dataset.dateInput;
    const parsed = parseDateInput(input.value);
    if (which === 'start') {
      state.dateRangeDraft.start = parsed;
      if (parsed && state.datePickerMode === 'range') {
        state.activeDateInput = 'end';
        state.calendarOpen    = true;
        renderPicker();
        syncInputsFromState();
        return;
      }
    } else {
      state.dateRangeDraft.end = parsed;
    }
    if (state.calendarOpen) renderCalendarPanel();
    updateDatePickerButtons();
  });

  dialog.addEventListener('focusin', e => {
    const input = e.target.closest('[data-date-input]');
    if (!input) return;
    state.activeDateInput = input.dataset.dateInput;
    if (state.calendarOpen) renderCalendarPanel();
  });

  function escHandler(e) {
    if (e.key === 'Escape') closeStandalone();
  }
  document.addEventListener('keydown', escHandler);
};

// ── Saved-view integration ────────────────────────────────────────────────

window.filterModalGetState = function() {
  const snap = _snapshotSelectionState();
  return {
    selected:           Array.from(snap.selected),
    excludedBuckets:    Array.from(snap.excludedBuckets),
    fieldDateDrafts:    JSON.parse(JSON.stringify(snap.fieldDateDrafts)),
    costRangeDraft:     { ...snap.costRangeDraft },
    numericRangeDrafts: JSON.parse(JSON.stringify(snap.numericRangeDrafts)),
    timeRangeDrafts:    JSON.parse(JSON.stringify(snap.timeRangeDrafts)),
    textMatchDrafts:    JSON.parse(JSON.stringify(snap.textMatchDrafts)),
    dateRangeDraft:     { ...snap.dateRangeDraft },
    datePickerMode:     snap.datePickerMode,
    context:            activeContext,
  };
};

window.filterModalSetState = function(savedState) {
  if (!savedState) return;
  _restoreSelectionState({
    selected:             new Set(savedState.selected ?? []),
    excludedBuckets:      new Set(savedState.excludedBuckets ?? []),
    fieldDateDrafts:      savedState.fieldDateDrafts ?? {},
    costRangeDraft:       savedState.costRangeDraft ?? { min: null, max: null },
    numericRangeDrafts:   savedState.numericRangeDrafts ?? {},
    timeRangeDrafts:      savedState.timeRangeDrafts ?? {},
    textMatchDrafts:      savedState.textMatchDrafts ?? {},
    dateRangeDraft:       savedState.dateRangeDraft ?? { start: null, end: null },
    datePickerMode:       savedState.datePickerMode ?? 'single',
    datePresetCustomOpen: false,
    activeFilterSetId:    null,
  });
};

window.filterModalApplySilent = function() {
  renderAppliedBar();
  const hasDateFilter = Array.from(state.selected).some(
    id => id.startsWith('dp-') || id.startsWith('custom-dr-') || id.startsWith('dr-')
  );
  window.dispatchEvent(new CustomEvent('filterApplied', {
    detail: { count: state.selected.size, hasDateFilter }
  }));
};

window.filterModalReset = function() {
  state.activeGroupId        = activeFilterGroups[0]?.id ?? null;
  state.searchQuery          = '';
  state.selected.clear();
  state.excludedBuckets.clear();
  state.collapsedTiers.clear();
  state.expandedSearchGroups.clear();
  state.collapsedSelectedBuckets.clear();
  state.expandedSelectedBuckets.clear();
  state.dateRangeDraft       = { start: null, end: null };
  state.fieldDateDrafts      = {};
  state.costRangeDraft       = { min: null, max: null };
  state.numericRangeDrafts   = {};
  state.timeRangeDrafts      = {};
  state.textMatchDrafts      = {};
  state.datePresetCustomOpen = false;
  state.activeFilterSetId    = null;
  state.savedSetsOpen        = false;
  _committedSnapshot         = null;
  renderAppliedBar();
  window.dispatchEvent(new CustomEvent('filterApplied', {
    detail: { count: 0, hasDateFilter: false }
  }));
};
