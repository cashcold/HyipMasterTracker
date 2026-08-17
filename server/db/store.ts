import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  IUser,
  IProject,
  IMonitor,
  IReview,
  IEvent,
  IWatchlist,
  INotification,
  IAdvertisement,
  IProjectSubmission,
  IAuditLog,
  IContactMessage,
  ISiteSettings,
  ProjectStatus,
} from '../types.ts';

export const UNSPLASH_CRYPTO_IMAGES = [
  'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80', // Ethereum Hologram & Smart Contracts
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80', // Golden Bitcoin Coin Macro
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80', // 3D Blockchain Cyber Nodes Matrix
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80', // Futuristic AI Trading Sphere
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80', // Deep Learning Neural Crypto Network
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80', // Crypto Exchange Candlestick Charts
  'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80', // Golden Crypto Coins Stack
  'https://images.unsplash.com/photo-1622979135240-caa6648190b6?w=600&auto=format&fit=crop&q=80', // Cyber Green Blockchain Node
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80', // Neon Digital Waves & Liquidity Orbit
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', // Gold Circuit Board & Quantum Node
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80', // Crypto Market Volatility & Trading Charts
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', // DeFi Yield Waves 3D Flow
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80', // Crypto Financial Liquidity Dashboard
  'https://images.unsplash.com/photo-1644088379091-d574269d422f?w=600&auto=format&fit=crop&q=80', // Cyber High-Speed Crypto Protocol Data
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80', // Analytics Telemetry Data Terminal
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80', // Crypto Staking Ledger & Coins
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', // Corporate Crypto Security Ledger
  'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=600&auto=format&fit=crop&q=80', // Dark Tech Crypto Multi-Tokens
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&auto=format&fit=crop&q=80', // Golden Bitcoin Vault Storage
];

export function getRandomCryptoImage(seed?: number | string): string {
  if (seed !== undefined) {
    const num = typeof seed === 'number' ? seed : seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return UNSPLASH_CRYPTO_IMAGES[Math.abs(num) % UNSPLASH_CRYPTO_IMAGES.length];
  }
  const idx = Math.floor(Math.random() * UNSPLASH_CRYPTO_IMAGES.length);
  return UNSPLASH_CRYPTO_IMAGES[idx];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface IDatabase {
  users: IUser[];
  projects: IProject[];
  monitors: IMonitor[];
  reviews: IReview[];
  events: IEvent[];
  watchlists: IWatchlist[];
  notifications: INotification[];
  advertisements: IAdvertisement[];
  submissions: IProjectSubmission[];
  auditLogs: IAuditLog[];
  contactMessages: IContactMessage[];
  settings: ISiteSettings;
}

class Store {
  private db: IDatabase = {
    users: [],
    projects: [],
    monitors: [],
    reviews: [],
    events: [],
    watchlists: [],
    notifications: [],
    advertisements: [],
    submissions: [],
    auditLogs: [],
    contactMessages: [],
    settings: {
      websiteName: 'HyipMasterTracker',
      tagline: 'Track. Compare. Research.',
      contactEmail: 'support@hyipmastertracker.com',
      defaultRiskThresholds: {
        criticalMax: 2.9,
        highMax: 4.9,
        moderateMax: 6.9,
        goodMax: 8.9,
      },
      requireReviewApproval: true,
      allowUserRegistrations: true,
      maintenanceMode: false,
      disclaimerNotice:
        'HYIPs are extremely high-risk speculative programs. HyipMasterTracker does not operate, endorse, or guarantee any listed investment platform. Information is gathered from independent monitor reports and community submissions.',
    },
  };

  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Always populate baseline seed data first from code definition
      this.seedInitialData();

      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, 'utf-8');
          const savedDb: IDatabase = JSON.parse(raw);

          if (savedDb) {
            // Merge custom registered users
            if (savedDb.users && savedDb.users.length > 0) {
              const seedUserUsernames = new Set(this.db.users.map((u) => u.username.toLowerCase()));
              const customUsers = savedDb.users.filter((u) => !seedUserUsernames.has(u.username.toLowerCase()));
              this.db.users.push(...customUsers);
            }

            // Merge any runtime created projects not present in code seed
            if (savedDb.projects && savedDb.projects.length > 0) {
              const seedProjIds = new Set(this.db.projects.map((p) => p.id));
              const runtimeProjects = savedDb.projects.filter((p) => !seedProjIds.has(p.id));
              this.db.projects.push(...runtimeProjects);
            }

            // Merge dynamic reviews
            if (savedDb.reviews && savedDb.reviews.length > 0) {
              const seedReviewIds = new Set(this.db.reviews.map((r) => r.id));
              const customReviews = savedDb.reviews.filter((r) => !seedReviewIds.has(r.id));
              this.db.reviews.push(...customReviews);
            }

            if (savedDb.watchlists && savedDb.watchlists.length > 0) {
              this.db.watchlists = savedDb.watchlists;
            }

            if (savedDb.notifications && savedDb.notifications.length > 0) {
              this.db.notifications = savedDb.notifications;
            }

            if (savedDb.advertisements && savedDb.advertisements.length > 0) {
              const seedAdIds = new Set(this.db.advertisements.map((a) => a.id));
              const customAds = savedDb.advertisements.filter((a) => !seedAdIds.has(a.id));
              this.db.advertisements.push(...customAds);
            }
          }
        } catch (e) {
          console.warn('[Store] Could not read saved DB, using fresh seed data:', e);
        }
      }

      // Ensure admin user password is guaranteed to be admin12345@
      const adminUser = this.db.users?.find(
        (u) => u.username.toLowerCase() === 'admin' || u.email.toLowerCase() === 'admin@hyipmastertracker.com'
      );
      if (adminUser) {
        const salt = bcrypt.genSaltSync(10);
        adminUser.passwordHash = bcrypt.hashSync('admin12345@', salt);
        adminUser.role = 'SUPER_ADMIN';
      }

      this.alignDynamicTimestamps();
      this.persist();
      this.isLoaded = true;
    } catch (err) {
      console.error('[Store] Error initializing database:', err);
      this.seedInitialData();
    }
  }

  public alignDynamicTimestamps() {
    const now = Date.now();
    const minutesAgo = (m: number) => new Date(now - m * 60000).toISOString();
    const hoursAgo = (h: number) => new Date(now - h * 3600000).toISOString();
    const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

    // Re-anchor events to fresh current-day timestamps
    if (this.db.events && this.db.events.length > 0) {
      const eventMinuteOffsets = [12, 35, 78, 145, 230, 380, 520];
      this.db.events.forEach((evt, idx) => {
        const offset = eventMinuteOffsets[idx % eventMinuteOffsets.length];
        evt.createdAt = minutesAgo(offset);
      });
    }

    // Re-anchor reviews to fresh recent dates (Today, Yesterday, etc.)
    if (this.db.reviews && this.db.reviews.length > 0) {
      const reviewHourOffsets = [3, 20, 48, 96, 168];
      this.db.reviews.forEach((rev, idx) => {
        const offset = reviewHourOffsets[idx % reviewHourOffsets.length];
        rev.createdAt = hoursAgo(offset);
        rev.updatedAt = hoursAgo(offset);
      });
    }

    // Re-anchor project dates & preserve high-fidelity images
    if (this.db.projects && this.db.projects.length > 0) {
      const cryptoLogos = [
        'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80', // Ethereum Hologram & Smart Contracts
        'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80', // Golden Bitcoin Coin Macro
        'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80', // Futuristic AI Trading Sphere
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', // Gold Circuit Board & Quantum Node
        'https://images.unsplash.com/photo-1622979135240-caa6648190b6?w=600&auto=format&fit=crop&q=80', // Cyber Green Blockchain Node
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80', // Neon Digital Waves & Liquidity Orbit
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', // Corporate Crypto Security Ledger
        'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80', // Golden Crypto Coins Stack
      ];

      const cryptoScreenshots = [
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80', // 3D Blockchain Cyber Nodes Matrix
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80', // Crypto Exchange Candlestick Charts
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80', // Deep Learning Neural Crypto Network
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80', // Crypto Market Volatility & Trading Charts
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80', // Crypto Financial Liquidity Dashboard
        'https://images.unsplash.com/photo-1644088379091-d574269d422f?w=1000&auto=format&fit=crop&q=80', // Cyber High-Speed Crypto Protocol Data
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80', // Analytics Telemetry Data Terminal
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80', // DeFi Yield Waves 3D Flow
      ];

      this.db.projects.forEach((p, idx) => {
        const lifetime = p.lifetimeDays || 1;
        p.dateAdded = p.dateAdded || daysAgo(lifetime);
        p.lastUpdated = minutesAgo(25);
        p.createdAt = p.createdAt || daysAgo(lifetime);
        p.updatedAt = minutesAgo(25);

        // Assign dedicated crypto unsplash images for project logos and screenshots if not set
        p.logo = p.logo || cryptoLogos[idx % cryptoLogos.length];
        p.screenshot = p.screenshot || cryptoScreenshots[idx % cryptoScreenshots.length];

        if (p.monitorStatuses) {
          p.monitorStatuses.forEach((ms, i) => {
            ms.reportedAt = minutesAgo(15 + i * 30);
          });
        }
      });
    }

    // Re-anchor monitors
    if (this.db.monitors && this.db.monitors.length > 0) {
      this.db.monitors.forEach((m, idx) => {
        m.lastUpdate = minutesAgo(5 + idx * 10);
      });
    }

    // Re-anchor notifications
    if (this.db.notifications && this.db.notifications.length > 0) {
      this.db.notifications.forEach((n, idx) => {
        n.createdAt = minutesAgo(30 + idx * 60);
      });
    }

    this.persist();
  }

  public persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Failed to write db.json:', err);
    }
  }

  // Getters
  get users() {
    return this.db.users;
  }
  get projects() {
    return this.db.projects;
  }
  get monitors() {
    return this.db.monitors;
  }
  get reviews() {
    return this.db.reviews;
  }
  get events() {
    return this.db.events;
  }
  get watchlists() {
    return this.db.watchlists;
  }
  get notifications() {
    return this.db.notifications;
  }
  get advertisements() {
    return this.db.advertisements;
  }
  get submissions() {
    return this.db.submissions;
  }
  get auditLogs() {
    return this.db.auditLogs;
  }
  get contactMessages() {
    return this.db.contactMessages;
  }
  get settings() {
    return this.db.settings;
  }
  set settings(newSettings: ISiteSettings) {
    this.db.settings = newSettings;
    this.persist();
  }

  // Auto-seed method with high-fidelity realistic fictional data
  public seedInitialData() {
    const salt = bcrypt.genSaltSync(10);
    const adminPass = bcrypt.hashSync('admin12345@', salt);
    const modPass = bcrypt.hashSync('Mod@123456', salt);
    const userPass = bcrypt.hashSync('User@123456', salt);

    const now = new Date();
    const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

    const users: IUser[] = [
      {
        id: 'usr-admin-1',
        name: 'System Admin',
        username: 'admin',
        email: 'admin@hyipmastertracker.com',
        passwordHash: adminPass,
        role: 'SUPER_ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        isSuspended: false,
        createdAt: daysAgo(300),
        updatedAt: daysAgo(1),
      },
      {
        id: 'usr-mod-1',
        name: 'Verification Officer',
        username: 'mod_alex',
        email: 'mod@hyipmastertracker.com',
        passwordHash: modPass,
        role: 'MODERATOR',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        isSuspended: false,
        createdAt: daysAgo(200),
        updatedAt: daysAgo(2),
      },
      {
        id: 'usr-demo-1',
        name: 'David Vance',
        username: 'dvance_crypto',
        email: 'investor@example.com',
        passwordHash: userPass,
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        isSuspended: false,
        createdAt: daysAgo(120),
        updatedAt: daysAgo(5),
      },
      {
        id: 'usr-demo-2',
        name: 'Elena Rostova',
        username: 'elena_research',
        email: 'elena@example.com',
        passwordHash: userPass,
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isVerified: true,
        isSuspended: false,
        createdAt: daysAgo(90),
        updatedAt: daysAgo(10),
      },
    ];

    const monitors: IMonitor[] = [
      {
        id: 'mon-1',
        name: 'GoldPoll Monitor',
        website: 'https://goldpoll-monitor.example.com',
        logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80',
        trustScore: 8.8,
        description: 'Established independent multi-chain investment telemetry monitor since 2018.',
        status: 'Active',
        lastUpdate: hoursAgo(1),
        projectsReported: 142,
        createdAt: daysAgo(365),
      },
      {
        id: 'mon-2',
        name: 'InvestScan Radar',
        website: 'https://investscan.example.com',
        logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
        trustScore: 8.4,
        description: 'Real-time blockchain payout confirmation tracker and scam detector.',
        status: 'Active',
        lastUpdate: hoursAgo(2),
        projectsReported: 118,
        createdAt: daysAgo(300),
      },
      {
        id: 'mon-3',
        name: 'HyipScope Global',
        website: 'https://hyipscope.example.com',
        logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&auto=format&fit=crop&q=80',
        trustScore: 7.9,
        description: 'Automated deposit return test suite and payout velocity aggregator.',
        status: 'Active',
        lastUpdate: hoursAgo(4),
        projectsReported: 95,
        createdAt: daysAgo(240),
      },
      {
        id: 'mon-4',
        name: 'CryptoAudit Watch',
        website: 'https://cryptoaudit-watch.example.com',
        logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=100&auto=format&fit=crop&q=80',
        trustScore: 9.1,
        description: 'Strict on-chain liquidity auditor verifying cold wallets and transaction IDs.',
        status: 'Active',
        lastUpdate: hoursAgo(1),
        projectsReported: 76,
        createdAt: daysAgo(210),
      },
      {
        id: 'mon-5',
        name: 'CoinTracker Monitor',
        website: 'https://cointrack-hyip.example.com',
        logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=100&auto=format&fit=crop&q=80',
        trustScore: 7.2,
        description: 'Community-driven multi-monitor payout reporting aggregation.',
        status: 'Active',
        lastUpdate: hoursAgo(6),
        projectsReported: 88,
        createdAt: daysAgo(180),
      },
    ];

    const projects: IProject[] = [
      {
        id: 'proj-goldbod-pro',
        name: 'GoldBod Pro',
        slug: 'goldbod-pro',
        domain: 'gold-bod-pro.vercel.app',
        websiteUrl: 'https://gold-bod-pro.vercel.app',
        logo: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1000&auto=format&fit=crop&q=80',
        description:
          'Advertised as an institutional-grade crypto investment and high-tech cloud mining platform hosted on Vercel. Features high-yield automated daily plans, 100% principal capital return, zero hidden fees, and instant payouts under 8 minutes.',
        country: 'United States',
        category: 'Cloud Mining & Investment',
        status: 'PAYING',
        riskScore: 8.2,
        riskLevel: 'Good',
        rating: 8.9,
        dateAdded: daysAgo(13),
        lastUpdated: hoursAgo(1),
        lifetimeDays: 13,
        minInvestment: 50,
        maxInvestment: 2500,
        ourInvestment: 25000,
        referralPercentage: '10% - 5% - 2% - 1%',
        paymentMethods: ['USDT (TRC20)', 'USDT (BEP20)', 'USDT (ERC20)', 'Bitcoin', 'Ethereum', 'Mobile Money'],
        withdrawalMethods: 'Instant (Avg < 8 Minutes)',
        plans: [
          {
            id: 'plan-gb-1',
            name: 'Starter Plan',
            advertisedReturn: '+5% Total Net Profit',
            duration: '24 Hours',
            minInvestment: 50,
            maxInvestment: 399,
            type: 'After Term',
          },
          {
            id: 'plan-gb-2',
            name: 'Silver Plan',
            advertisedReturn: '+12% Total Net Profit',
            duration: '3 Days',
            minInvestment: 400,
            maxInvestment: 999,
            type: 'After Term',
          },
          {
            id: 'plan-gb-3',
            name: 'Gold Plan',
            advertisedReturn: '+15% Total Net Profit',
            duration: '5 Days',
            minInvestment: 1000,
            maxInvestment: 1700,
            type: 'After Term',
          },
          {
            id: 'plan-gb-4',
            name: 'Diamond Plan',
            advertisedReturn: '+20% Total Net Profit',
            duration: '7 Days',
            minInvestment: 1700,
            maxInvestment: 2500,
            type: 'After Term',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-gb-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            monitorLogo: monitors[0].logo,
            status: 'PAYING',
            rating: 9.0,
            notes: 'Test payout batch verified instantly via USDT TRC20.',
            reportedAt: hoursAgo(1),
          },
          {
            id: 'mr-gb-2',
            monitorId: 'mon-2',
            monitorName: 'InvestScan Radar',
            monitorLogo: monitors[1].logo,
            status: 'PAYING',
            rating: 8.8,
            notes: 'Consistent daily capital returns and instant processing confirmed.',
            reportedAt: hoursAgo(3),
          },
          {
            id: 'mr-gb-3',
            monitorId: 'mon-4',
            monitorName: 'CryptoAudit Watch',
            monitorLogo: monitors[3].logo,
            status: 'PAYING',
            rating: 8.9,
            notes: 'Verified operational uptime and active reserve funds.',
            reportedAt: hoursAgo(1),
          },
        ],
        isFeatured: true,
        isSponsored: true,
        isApproved: true,
        viewsCount: 5420,
        reviewCount: 2840,
        createdAt: daysAgo(13),
        updatedAt: hoursAgo(1),
      },
      {
      id: 'proj-cloudminex',
      name: 'CloudMineX',
      slug: 'cloudminex',
      domain: 'cloud-mine-x.vercel.app',
      websiteUrl: 'https://cloud-mine-x.vercel.app',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
      description:
        'Automated enterprise-grade cloud hash rate protocol hosted on Vercel, offering high-density cloud mining and daily yield generation. Features automated instant payouts via Mobile Money (MTN, Telecel, AT) and USDT crypto, plus a GHS 50.00 free welcome credit for new registrations.',
      country: 'Ghana',
      category: 'Cloud Mining & Investment',
      status: 'PAYING',
      riskScore: 8.0,
      riskLevel: 'Good',
      rating: 8.8,
      dateAdded: daysAgo(13),
      lastUpdated: hoursAgo(1),
      lifetimeDays: 13,
      minInvestment: 100,
      maxInvestment: 20000,
      ourInvestment: 20000,
      referralPercentage: '7%',
      paymentMethods: ['Mobile Money (MTN, Telecel, AT)', 'USDT (Crypto)'],
      withdrawalMethods: 'Instant / Automated 24/7 Gateway',
      plans: [
    {
      id: 'plan-cmx-1',
      name: 'Starter Miner',
      advertisedReturn: '5.0% Daily',
      duration: '7 Days',
      minInvestment: 100,
      maxInvestment: 100,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-2',
      name: 'Basic Miner',
      advertisedReturn: '6.0% Daily',
      duration: '14 Days',
      minInvestment: 300,
      maxInvestment: 300,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-3',
      name: 'Pro Miner',
      advertisedReturn: '7.0% Daily',
      duration: '30 Days',
      minInvestment: 700,
      maxInvestment: 700,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-4',
      name: 'Advanced Miner',
      advertisedReturn: '8.0% Daily',
      duration: '60 Days',
      minInvestment: 1500,
      maxInvestment: 1500,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-5',
      name: 'Premium Miner',
      advertisedReturn: '9.0% Daily',
      duration: '90 Days',
      minInvestment: 3000,
      maxInvestment: 3000,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-6',
      name: 'VIP Miner',
      advertisedReturn: '10.0% Daily',
      duration: '90 Days',
      minInvestment: 5000,
      maxInvestment: 5000,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-7',
      name: 'Enterprise Miner',
      advertisedReturn: '11.0% Daily',
      duration: '120 Days',
      minInvestment: 10000,
      maxInvestment: 10000,
      type: 'Daily',
    },
    {
      id: 'plan-cmx-8',
      name: 'Titan Rig Miner',
      advertisedReturn: '12.0% Daily',
      duration: '180 Days',
      minInvestment: 20000,
      maxInvestment: 20000,
      type: 'Daily',
    },
  ],
  monitorStatuses: [
    {
      id: 'mr-cmx-1',
      monitorId: 'mon-1',
      monitorName: 'GoldPoll Monitor',
      monitorLogo: monitors[0].logo,
      status: 'PAYING',
      rating: 8.9,
      notes: 'Automated test payouts processed via Mobile Money and USDT.',
      reportedAt: hoursAgo(1),
    },
    {
      id: 'mr-cmx-2',
      monitorId: 'mon-2',
      monitorName: 'InvestScan Radar',
      monitorLogo: monitors[1].logo,
      status: 'PAYING',
      rating: 8.7,
      notes: 'Verified daily reward distribution and instant network settlement.',
      reportedAt: hoursAgo(3),
    },
    {
      id: 'mr-cmx-3',
      monitorId: 'mon-4',
      monitorName: 'CryptoAudit Watch',
      monitorLogo: monitors[3].logo,
      status: 'PAYING',
      rating: 8.8,
      notes: 'Confirmed uptime SLA and smooth instant withdrawal processing.',
      reportedAt: hoursAgo(1),
    },
      ],
      isFeatured: true,
      isSponsored: false,
      isApproved: true,
      viewsCount: 3890,
      reviewCount: 42,
      createdAt: daysAgo(13),
      updatedAt: hoursAgo(1),
    },
      {
        id: 'proj-1',
        name: 'AlphaYield Protocol',
        slug: 'alphayield-protocol',
        domain: 'alphayield.io',
        websiteUrl: 'https://alphayield.example.io',
        logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1000&auto=format&fit=crop&q=80',
        description:
          'Advertised as an automated algorithmic arbitrage liquidity protocol. Operating since early 2026. Consistent daily payout reports across primary monitor test deposits.',
        country: 'United Kingdom',
        category: 'Arbitrage & DeFi',
        status: 'PAYING',
        riskScore: 7.6,
        riskLevel: 'Good',
        rating: 8.4,
        dateAdded: daysAgo(128),
        lastUpdated: hoursAgo(2),
        lifetimeDays: 128,
        minInvestment: 25,
        maxInvestment: 25000,
        ourInvestment: 7500,
        referralPercentage: '5% - 2% - 1%',
        paymentMethods: ['USDT (TRC20)', 'Bitcoin', 'Ethereum', 'TRON', 'Litecoin'],
        withdrawalMethods: 'Instant (Under $1,000) / Manual up to 12h',
        plans: [
          {
            id: 'plan-1-1',
            name: 'Standard Liquidity Tier',
            advertisedReturn: '2.5% Daily',
            duration: '30 Calendar Days',
            minInvestment: 25,
            maxInvestment: 2500,
            type: 'Daily',
          },
          {
            id: 'plan-1-2',
            name: 'Advanced Arbitrage Pool',
            advertisedReturn: '3.8% Daily',
            duration: '45 Calendar Days',
            minInvestment: 2500,
            maxInvestment: 25000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-1-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            monitorLogo: monitors[0].logo,
            status: 'PAYING',
            rating: 8.6,
            notes: 'Test withdrawal batch #412 processed in 14 minutes.',
            reportedAt: hoursAgo(2),
          },
          {
            id: 'mr-1-2',
            monitorId: 'mon-2',
            monitorName: 'InvestScan Radar',
            monitorLogo: monitors[1].logo,
            status: 'PAYING',
            rating: 8.4,
            notes: 'On-chain payout address active with stable tx outflow.',
            reportedAt: hoursAgo(4),
          },
          {
            id: 'mr-1-3',
            monitorId: 'mon-4',
            monitorName: 'CryptoAudit Watch',
            monitorLogo: monitors[3].logo,
            status: 'PAYING',
            rating: 8.8,
            notes: 'Verified 12 consecutive payouts to monitoring wallets.',
            reportedAt: hoursAgo(1),
          },
        ],
        isFeatured: true,
        isSponsored: false,
        isApproved: true,
        viewsCount: 4230,
        reviewCount: 14,
        createdAt: daysAgo(128),
        updatedAt: hoursAgo(2),
      },
      {
        id: 'proj-2',
        name: 'NovaCapital Group',
        slug: 'novacapital-group',
        domain: 'novacapital.net',
        websiteUrl: 'https://novacapital.example.net',
        logo: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
        description:
          'Claims to trade forex pairs and AI high-frequency markets. Recently experienced selective payout delays on larger withdrawals above $500.',
        country: 'Switzerland',
        category: 'Forex Trading',
        status: 'PROBLEM',
        riskScore: 3.8,
        riskLevel: 'High Risk',
        riskOverrideReason: 'Multiple monitors reported pending withdrawals exceeding 48h SLA.',
        rating: 5.1,
        dateAdded: daysAgo(84),
        lastUpdated: hoursAgo(3),
        lifetimeDays: 84,
        minInvestment: 50,
        maxInvestment: 50000,
        ourInvestment: 4000,
        referralPercentage: '7% - 3%',
        paymentMethods: ['USDT (ERC20)', 'USDT (TRC20)', 'BTC', 'ePayCore'],
        withdrawalMethods: 'Manual within 24-48 Hours',
        plans: [
          {
            id: 'plan-2-1',
            name: 'Forex Explorer',
            advertisedReturn: '4.2% Daily',
            duration: '20 Days',
            minInvestment: 50,
            maxInvestment: 1000,
            type: 'Daily',
          },
          {
            id: 'plan-2-2',
            name: 'Institutional Yield',
            advertisedReturn: '120% After 15 Days',
            duration: '15 Days',
            minInvestment: 1000,
            maxInvestment: 50000,
            type: 'After Plan',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-2-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'PROBLEM',
            rating: 3.5,
            notes: 'Withdrawal request $350 pending for 52 hours.',
            reportedAt: hoursAgo(3),
          },
          {
            id: 'mr-2-2',
            monitorId: 'mon-2',
            monitorName: 'InvestScan Radar',
            status: 'PROBLEM',
            rating: 4.0,
            notes: 'Users in community reporting support unresponsive.',
            reportedAt: hoursAgo(6),
          },
          {
            id: 'mr-2-3',
            monitorId: 'mon-3',
            monitorName: 'HyipScope Global',
            status: 'PAYING',
            rating: 6.0,
            notes: 'Small $10 payout cleared, larger amounts stalled.',
            reportedAt: hoursAgo(8),
          },
        ],
        isFeatured: false,
        isSponsored: false,
        isApproved: true,
        viewsCount: 2950,
        reviewCount: 9,
        createdAt: daysAgo(84),
        updatedAt: hoursAgo(3),
      },
      {
        id: 'proj-3',
        name: 'QuantumEarn AI',
        slug: 'quantumearn-ai',
        domain: 'quantumearn.tech',
        websiteUrl: 'https://quantumearn.example.tech',
        logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80',
        description:
          'Newly launched project claiming proprietary quantitative neural network models. Monitoring test deposits verified paying without delay.',
        country: 'Estonia',
        category: 'AI Quant Trading',
        status: 'PAYING',
        riskScore: 6.9,
        riskLevel: 'Moderate',
        rating: 7.8,
        dateAdded: daysAgo(14),
        lastUpdated: hoursAgo(1),
        lifetimeDays: 14,
        minInvestment: 10,
        maxInvestment: 15000,
        ourInvestment: 5000,
        referralPercentage: '4% - 1%',
        paymentMethods: ['USDT (BEP20)', 'BTC', 'BNB', 'Solana', 'DOGE'],
        withdrawalMethods: 'Instant API payouts',
        plans: [
          {
            id: 'plan-3-1',
            name: 'Neural Starter',
            advertisedReturn: '2.0% Daily Forever',
            duration: 'Lifetime (Principal included)',
            minInvestment: 10,
            maxInvestment: 500,
            type: 'Daily',
          },
          {
            id: 'plan-3-2',
            name: 'Quantum Velocity',
            advertisedReturn: '3.0% Daily for 60 Days',
            duration: '60 Days',
            minInvestment: 500,
            maxInvestment: 15000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-3-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'PAYING',
            rating: 8.2,
            notes: 'Test batch 14 received instantaneously.',
            reportedAt: hoursAgo(1),
          },
          {
            id: 'mr-3-2',
            monitorId: 'mon-4',
            monitorName: 'CryptoAudit Watch',
            status: 'PAYING',
            rating: 8.0,
            notes: 'Valid smart contract event emits for micro withdrawals.',
            reportedAt: hoursAgo(2),
          },
        ],
        isFeatured: true,
        isSponsored: true,
        isApproved: true,
        viewsCount: 3120,
        reviewCount: 6,
        createdAt: daysAgo(14),
        updatedAt: hoursAgo(1),
      },
      {
        id: 'proj-4',
        name: 'VertexFunds Global',
        slug: 'vertexfunds-global',
        domain: 'vertexfunds.biz',
        websiteUrl: 'https://vertexfunds.example.biz',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80',
        description:
          'Completely ceased payments across all monitors. Withdrawal requests rejected or left queued indefinitely. Admin unresponsive.',
        country: 'Panama',
        category: 'Commodities & Gold',
        status: 'NOT PAID',
        riskScore: 1.2,
        riskLevel: 'Critical Risk',
        rating: 1.9,
        dateAdded: daysAgo(160),
        lastUpdated: daysAgo(1),
        lifetimeDays: 160,
        minInvestment: 100,
        maxInvestment: 100000,
        ourInvestment: 2500,
        referralPercentage: '10%',
        paymentMethods: ['BTC', 'ETH', 'USDT'],
        withdrawalMethods: 'Disabled / Stalled',
        plans: [
          {
            id: 'plan-4-1',
            name: 'Gold Speculator',
            advertisedReturn: '5.0% Daily',
            duration: '25 Days',
            minInvestment: 100,
            maxInvestment: 5000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-4-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'NOT PAID',
            rating: 1.0,
            notes: 'Zero payouts observed in last 7 days.',
            reportedAt: daysAgo(1),
          },
          {
            id: 'mr-4-2',
            monitorId: 'mon-2',
            monitorName: 'InvestScan Radar',
            status: 'NOT PAID',
            rating: 1.0,
            notes: 'Scam warning issued on forum channels.',
            reportedAt: daysAgo(1),
          },
        ],
        isFeatured: false,
        isSponsored: false,
        isApproved: true,
        viewsCount: 1850,
        reviewCount: 12,
        createdAt: daysAgo(160),
        updatedAt: daysAgo(1),
      },
      {
        id: 'proj-5',
        name: 'ZenithCore Energy',
        slug: 'zenithcore-energy',
        domain: 'zenithcore.org',
        websiteUrl: 'https://zenithcore.example.org',
        logo: 'https://images.unsplash.com/photo-1622979135240-caa6648190b6?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80',
        description:
          'Long-standing conservative yield platform claiming green hydrogen and renewable cloud computing revenue streams.',
        country: 'Germany',
        category: 'Green Tech Yield',
        status: 'PAYING',
        riskScore: 8.3,
        riskLevel: 'Good',
        rating: 9.1,
        dateAdded: daysAgo(210),
        lastUpdated: hoursAgo(5),
        lifetimeDays: 210,
        minInvestment: 20,
        maxInvestment: 10000,
        ourInvestment: 6000,
        referralPercentage: '3% - 1%',
        paymentMethods: ['USDT (TRC20)', 'Bitcoin', 'Litecoin', 'Dash', 'BNB'],
        withdrawalMethods: 'Manual within 6-12 hours',
        plans: [
          {
            id: 'plan-5-1',
            name: 'Solar Baseline',
            advertisedReturn: '1.2% Daily',
            duration: '180 Days (Principal Back)',
            minInvestment: 20,
            maxInvestment: 1500,
            type: 'Daily',
          },
          {
            id: 'plan-5-2',
            name: 'Hydrogen Master',
            advertisedReturn: '1.8% Daily',
            duration: '120 Days (Principal Back)',
            minInvestment: 1500,
            maxInvestment: 10000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-5-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'PAYING',
            rating: 9.2,
            notes: 'Consistent daily disbursements confirmed.',
            reportedAt: hoursAgo(5),
          },
          {
            id: 'mr-5-2',
            monitorId: 'mon-4',
            monitorName: 'CryptoAudit Watch',
            status: 'PAYING',
            rating: 9.0,
            notes: 'Low volatility, steady reserve management.',
            reportedAt: hoursAgo(6),
          },
        ],
        isFeatured: true,
        isSponsored: false,
        isApproved: true,
        viewsCount: 5120,
        reviewCount: 19,
        createdAt: daysAgo(210),
        updatedAt: hoursAgo(5),
      },
      {
        id: 'proj-6',
        name: 'OrbitProfit Network',
        slug: 'orbitprofit-network',
        domain: 'orbitprofit.cc',
        websiteUrl: 'https://orbitprofit.example.cc',
        logo: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?w=1000&auto=format&fit=crop&q=80',
        description:
          'High-yield short duration hourly program. Inherently high volatility and fast cycle turnover.',
        country: 'Seychelles',
        category: 'Fast HYIP',
        status: 'WAITING',
        riskScore: 4.5,
        riskLevel: 'High Risk',
        rating: 6.2,
        dateAdded: daysAgo(2),
        lastUpdated: hoursAgo(1),
        lifetimeDays: 2,
        minInvestment: 15,
        maxInvestment: 5000,
        ourInvestment: 2500,
        referralPercentage: '6%',
        paymentMethods: ['USDT (TRC20)', 'TRX', 'DOGE'],
        withdrawalMethods: 'Instant',
        plans: [
          {
            id: 'plan-6-1',
            name: 'Hourly Boost',
            advertisedReturn: '0.25% Hourly for 96 Hours',
            duration: '4 Days (124% Total)',
            minInvestment: 15,
            maxInvestment: 1000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-6-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'WAITING',
            rating: 6.0,
            notes: 'Awaiting initial cycle completion.',
            reportedAt: hoursAgo(1),
          },
        ],
        isFeatured: false,
        isSponsored: false,
        isApproved: true,
        viewsCount: 940,
        reviewCount: 3,
        createdAt: daysAgo(2),
        updatedAt: hoursAgo(1),
      },
      {
        id: 'proj-7',
        name: 'BluePeak Securities',
        slug: 'bluepeak-securities',
        domain: 'bluepeaksec.com',
        websiteUrl: 'https://bluepeaksec.example.com',
        logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
        description:
          'Project closed its doors following severe liquidity run. Domain now displays archived status message.',
        country: 'Cyprus',
        category: 'Derivatives',
        status: 'CLOSED',
        riskScore: 0.5,
        riskLevel: 'Critical Risk',
        rating: 2.1,
        dateAdded: daysAgo(280),
        lastUpdated: daysAgo(40),
        lifetimeDays: 240,
        minInvestment: 50,
        maxInvestment: 20000,
        ourInvestment: 2500,
        referralPercentage: '5%',
        paymentMethods: ['BTC', 'ETH'],
        withdrawalMethods: 'Closed',
        plans: [],
        monitorStatuses: [
          {
            id: 'mr-7-1',
            monitorId: 'mon-2',
            monitorName: 'InvestScan Radar',
            status: 'CLOSED',
            rating: 1.0,
            notes: 'Platform confirmed sunsetting operations.',
            reportedAt: daysAgo(40),
          },
        ],
        isFeatured: false,
        isSponsored: false,
        isApproved: true,
        viewsCount: 1400,
        reviewCount: 8,
        createdAt: daysAgo(280),
        updatedAt: daysAgo(40),
      },
      {
        id: 'proj-8',
        name: 'PrimeGrowth Yield',
        slug: 'primegrowth-yield',
        domain: 'primegrowth.finance',
        websiteUrl: 'https://primegrowth.example.finance',
        logo: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&auto=format&fit=crop&q=80',
        screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
        description:
          'Smart contract based yield aggregator targeting multi-pool LP rewards on BNB Chain and Polygon. Tested consistently paying for over 60 days.',
        country: 'Singapore',
        category: 'DeFi LP Farms',
        status: 'PAYING',
        riskScore: 7.9,
        riskLevel: 'Good',
        rating: 8.7,
        dateAdded: daysAgo(64),
        lastUpdated: hoursAgo(3),
        lifetimeDays: 64,
        minInvestment: 30,
        maxInvestment: 30000,
        ourInvestment: 4500,
        referralPercentage: '4% - 2%',
        paymentMethods: ['USDT (BEP20)', 'USDC', 'MATIC', 'BNB'],
        withdrawalMethods: 'Automated Instant API',
        plans: [
          {
            id: 'plan-8-1',
            name: 'LP Staking Alpha',
            advertisedReturn: '2.8% Daily for 40 Days',
            duration: '40 Days',
            minInvestment: 30,
            maxInvestment: 5000,
            type: 'Daily',
          },
        ],
        monitorStatuses: [
          {
            id: 'mr-8-1',
            monitorId: 'mon-1',
            monitorName: 'GoldPoll Monitor',
            status: 'PAYING',
            rating: 8.8,
            notes: 'Rapid automated batch payouts.',
            reportedAt: hoursAgo(3),
          },
          {
            id: 'mr-8-2',
            monitorId: 'mon-3',
            monitorName: 'HyipScope Global',
            status: 'PAYING',
            rating: 8.6,
            notes: 'Test wallet payout confirmed.',
            reportedAt: hoursAgo(4),
          },
        ],
        isFeatured: true,
        isSponsored: false,
        isApproved: true,
        viewsCount: 3890,
        reviewCount: 11,
        createdAt: daysAgo(64),
        updatedAt: hoursAgo(3),
      },
    ];

    const events: IEvent[] = [
      {
        id: 'evt-1',
        projectId: 'proj-2',
        projectName: 'NovaCapital Group',
        projectSlug: 'novacapital-group',
        type: 'STATUS_CHANGED',
        oldStatus: 'PAYING',
        newStatus: 'PROBLEM',
        message: 'Status degraded from PAYING to PROBLEM due to multiple pending withdrawal reports over 48h.',
        monitorId: 'mon-1',
        monitorName: 'GoldPoll Monitor',
        createdAt: hoursAgo(3),
      },
      {
        id: 'evt-2',
        projectId: 'proj-3',
        projectName: 'QuantumEarn AI',
        projectSlug: 'quantumearn-ai',
        type: 'PAYMENT_REPORTED',
        oldStatus: 'PAYING',
        newStatus: 'PAYING',
        message: 'Live test payout #118 verified on-chain via BNB Smart Chain explorer.',
        monitorId: 'mon-4',
        monitorName: 'CryptoAudit Watch',
        createdAt: hoursAgo(4),
      },
      {
        id: 'evt-3',
        projectId: 'proj-6',
        projectName: 'OrbitProfit Network',
        projectSlug: 'orbitprofit-network',
        type: 'PROJECT_ADDED',
        newStatus: 'WAITING',
        message: 'New high-yield project submitted and initialized into monitoring test queue.',
        createdBy: 'admin',
        createdAt: daysAgo(2),
      },
      {
        id: 'evt-4',
        projectId: 'proj-4',
        projectName: 'VertexFunds Global',
        projectSlug: 'vertexfunds-global',
        type: 'NOT_PAID',
        oldStatus: 'PROBLEM',
        newStatus: 'NOT PAID',
        message: 'Escalated to NOT PAID following comprehensive monitoring consensus failure.',
        monitorId: 'mon-2',
        monitorName: 'InvestScan Radar',
        createdAt: daysAgo(1),
      },
      {
        id: 'evt-5',
        projectId: 'proj-1',
        projectName: 'AlphaYield Protocol',
        projectSlug: 'alphayield-protocol',
        type: 'RISK_CHANGED',
        message: 'Risk indicator recalculated to 7.6 / 10 following 120-day milestone and high monitor consensus.',
        createdBy: 'system_algorithm',
        createdAt: daysAgo(4),
      },
    ];

    const reviews: IReview[] = [
      {
        id: 'rev-1',
        projectId: 'proj-1',
        projectName: 'AlphaYield Protocol',
        projectSlug: 'alphayield-protocol',
        userId: 'usr-demo-1',
        userName: 'David Vance',
        userAvatar: users[2].avatar,
        rating: 9,
        title: 'Smooth instant TRC20 payouts for over 2 months',
        content:
          'I have been tracking and testing AlphaYield with modest deposits. So far, daily interest is credited punctually at 00:00 UTC and withdrawal requests under $500 arrive in about 15 minutes.',
        category: 'Payment Experience',
        status: 'Approved',
        helpfulCount: 14,
        helpfulVoters: ['usr-demo-2'],
        reports: [],
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
      },
      {
        id: 'rev-2',
        projectId: 'proj-2',
        projectName: 'NovaCapital Group',
        projectSlug: 'novacapital-group',
        userId: 'usr-demo-2',
        userName: 'Elena Rostova',
        userAvatar: users[3].avatar,
        rating: 3,
        title: 'Pending withdrawal since yesterday afternoon',
        content:
          'Requested a $420 USDT withdrawal on Tuesday. Still marked as "Pending" in backoffice. Support bot replied with canned message about network congestion. Exercise extreme caution.',
        category: 'Withdrawal Experience',
        status: 'Approved',
        helpfulCount: 22,
        helpfulVoters: ['usr-demo-1'],
        reports: [],
        createdAt: hoursAgo(18),
        updatedAt: hoursAgo(18),
      },
      {
        id: 'rev-3',
        projectId: 'proj-5',
        projectName: 'ZenithCore Energy',
        projectSlug: 'zenithcore-energy',
        userId: 'usr-demo-1',
        userName: 'David Vance',
        userAvatar: users[2].avatar,
        rating: 9,
        title: 'Realistic conservative return model',
        content:
          'Unlike flash 5% daily sites that collapse in two weeks, ZenithCore has stayed at 1.2% daily and maintained steady reserve management for 200+ days.',
        category: 'Positive',
        status: 'Approved',
        helpfulCount: 9,
        helpfulVoters: [],
        reports: [],
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25),
      },
    ];

    const watchlists: IWatchlist[] = [
      {
        id: 'w-1',
        userId: 'usr-demo-1',
        projectId: 'proj-1',
        createdAt: daysAgo(15),
      },
      {
        id: 'w-2',
        userId: 'usr-demo-1',
        projectId: 'proj-2',
        createdAt: daysAgo(10),
      },
      {
        id: 'w-3',
        userId: 'usr-demo-1',
        projectId: 'proj-5',
        createdAt: daysAgo(20),
      },
    ];

    const notifications: INotification[] = [
      {
        id: 'notif-1',
        userId: 'usr-demo-1',
        type: 'warning',
        title: 'Status Alert: NovaCapital Group',
        message: 'Your watched project "NovaCapital Group" was updated from PAYING to PROBLEM.',
        projectId: 'proj-2',
        projectSlug: 'novacapital-group',
        isRead: false,
        createdAt: hoursAgo(3),
      },
      {
        id: 'notif-2',
        userId: 'usr-demo-1',
        type: 'success',
        title: 'Payout Verified: AlphaYield Protocol',
        message: 'New monitoring test payment was verified for AlphaYield Protocol.',
        projectId: 'proj-1',
        projectSlug: 'alphayield-protocol',
        isRead: true,
        createdAt: daysAgo(1),
      },
    ];

    const advertisements: IAdvertisement[] = [
      {
        id: 'ad-1',
        title: 'CryptAudit Pro: Automated On-Chain HYIP Verification',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
        targetUrl: 'https://example.com/cryptaudit-pro',
        position: 'Homepage Hero',
        startDate: daysAgo(10),
        endDate: daysAgo(-20),
        status: 'Active',
        priority: 1,
        impressions: 12400,
        clicks: 842,
        createdAt: daysAgo(10),
      },
      {
        id: 'ad-2',
        title: 'Secure Ledger Vault: Cold Storage Solutions',
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=400&auto=format&fit=crop&q=80',
        targetUrl: 'https://example.com/vault-hardware',
        position: 'Sidebar',
        startDate: daysAgo(15),
        endDate: daysAgo(-15),
        status: 'Active',
        priority: 2,
        impressions: 8900,
        clicks: 410,
        createdAt: daysAgo(15),
      },
    ];

    this.db.users = users;
    this.db.monitors = monitors;
    this.db.projects = projects;
    this.db.events = events;
    this.db.reviews = reviews;
    this.db.watchlists = watchlists;
    this.db.notifications = notifications;
    this.db.advertisements = advertisements;
  }
}

export const store = new Store();
