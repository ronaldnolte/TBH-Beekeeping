# Free Tier Capacity Analysis
## How Many Users Can TBH Beekeeper Support on Free Tiers?

---

## 📊 Free Tier Limits Summary

### Supabase Free Tier
| Resource | Limit |
|----------|-------|
| **Database Size** | 500 MB |
| **Bandwidth (Egress)** | 10 GB/month (5 GB cached + 5 GB uncached) |
| **File Storage** | 1 GB |
| **Monthly Active Users (MAU)** | 50,000 |
| **API Requests** | Unlimited |
| **Projects** | 2 active projects |
| **Edge Functions** | 1,000 invocations/day |
| **Inactivity Pause** | After 1 week |

### Vercel Hobby (Free) Tier
| Resource | Limit |
|----------|-------|
| **Bandwidth** | 100 GB/month |
| **Serverless Function CPU Time** | 4 hours/month |
| **Serverless Invocations** | 1,000,000/month |
| **Function Duration** | 300 seconds max |
| **Build Time** | 45 minutes max per deployment |
| **Deployments** | 100/day |
| **Projects** | 200 |
| **Use Case** | Personal/non-commercial only |

---

## 🎯 Bottleneck Analysis

Based on your app architecture (PWA with WatermelonDB sync), here's how each limit applies:

---

## 1️⃣ **DATABASE SIZE** (Supabase: 500 MB)

### Your Database Growth Rate
From `DATABASE_SIZE_CALCULATOR.md`:
- **100 users** = ~9.8 MB/year
- **500 users** = ~49 MB/year
- **1,000 users** = ~98 MB/year

### Calculations

**Without Cleanup:**
```
500 MB ÷ 9.8 MB per 100 users per year = 51 × 100 users = 5,100 users (Year 1)
500 MB ÷ 19.6 MB per 100 users (2 years) = 25.5 × 100 users = 2,550 users (Year 2)
500 MB ÷ 29.4 MB per 100 users (3 years) = 17 × 100 users = 1,700 users (Year 3)
```

**With Cleanup (reduces growth by ~35%):**
```
Effective growth: ~6.4 MB per 100 users per year
500 MB ÷ 6.4 MB = 78 × 100 users = 7,800 users (Year 1)
500 MB ÷ 12.8 MB (2 years) = 39 × 100 users = 3,900 users (Year 2)
500 MB ÷ 19.2 MB (3 years) = 26 × 100 users = 2,600 users (Year 3)
```

### **Verdict: DATABASE SIZE**
✅ **Year 1:** **~5,000-7,800 users**  
⚠️ **Year 2:** **~2,500-3,900 users**  
⚠️ **Year 3:** **~1,700-2,600 users**

**This is likely your PRIMARY bottleneck.**

---

## 2️⃣ **BANDWIDTH** (Supabase: 10 GB/month, Vercel: 100 GB/month)

### Bandwidth Consumption Breakdown

**Typical User Activity Assumptions:**
- Average user opens app **2x per day**
- WatermelonDB sync on each open
- Each sync pulls/pushes data for their hives (3.5 hives avg)

**Data Transfer Per User Per Month:**

#### Initial Load (First Time User)
```
User data: 111 bytes
Apiaries (1): 228 bytes
Hives (3.5): 3 KB
Recent inspections (last 3 months): ~6 inspections × 563 bytes = 3.4 KB
Recent snapshots (last 3 months): ~6 snapshots × 998 bytes = 6 KB
Tasks (10 active): 3.5 KB
Total initial: ~16 KB
```

#### Regular Sync (Daily Active User)
```
Check for updates: ~1 KB (metadata)
Pull new/updated records: ~500 bytes avg (minimal changes)
Push local changes: ~500 bytes avg
Total per sync: ~2 KB
```

**Monthly Per Active User:**
```
Initial load: 16 KB (one time)
Daily syncs: 2 syncs/day × 30 days × 2 KB = 120 KB
Static assets (PWA): ~200 KB (one-time, cached)
Total: ~336 KB per active user per month
```

### Bandwidth Calculations

**Supabase Egress (10 GB/month):**
```
10 GB = 10,240 MB
10,240 MB ÷ 0.336 MB per user = 30,476 active users
```

**Vercel Bandwidth (100 GB/month):**
```
100 GB = 102,400 MB
102,400 MB ÷ 0.336 MB per user = 304,762 active users
```

### **Verdict: BANDWIDTH**
✅ **Supabase:** **~30,000 active users/month**  
✅ **Vercel:** **~300,000 active users/month**

**Not a bottleneck until very high scale.**

---

## 3️⃣ **SERVERLESS FUNCTIONS** (Vercel: 1M invocations, 4 hours CPU)

### Function Invocations

**Your app likely makes:**
- Sync API calls to Supabase (handled by Supabase, not Vercel functions)
- Weather API calls for forecasts
- Authentication checks

**Estimated Usage:**
- WatermelonDB syncs directly to Supabase (no Vercel function)
- Weather API: 1 call per hive per day (if checking forecast)
  - 100 users × 3.5 hives × 30 days = 10,500 calls/month
  - 1,000 users = 105,000 calls/month

**CPU Time:**
- Next.js SSR/ISR pages: ~50ms per render
- 4 hours = 14,400 seconds = 288,000 page renders

### **Verdict: SERVERLESS FUNCTIONS**
✅ **Invocations:** **~10,000 users** (assuming 100 calls/user/month)  
✅ **CPU Time:** **Very unlikely to be a bottleneck**

**Not a bottleneck for typical usage.**

---

## 4️⃣ **MONTHLY ACTIVE USERS** (Supabase: 50,000 MAU)

This is Supabase's authentication limit.

### **Verdict: SUPABASE MAU**
✅ **50,000 monthly active users**

**Very generous, won't be a bottleneck.**

---

## 🏆 FINAL ANSWER: Maximum Users on Free Tier

### **Primary Bottleneck: DATABASE SIZE**

| Timeframe | Conservative (No Cleanup) | Optimistic (With Cleanup) |
|-----------|--------------------------|---------------------------|
| **Year 1** | **~5,000 users** | **~7,800 users** |
| **Year 2** | **~2,500 users** | **~3,900 users** |
| **Year 3** | **~1,700 users** | **~2,600 users** |

### Other Limits (Less Critical)
- ✅ Bandwidth: 30,000 active users/month (Supabase)
- ✅ MAU: 50,000 users (Supabase)
- ✅ Vercel bandwidth: 300,000+ users

---

## 💡 Recommendations

### To Maximize Free Tier Capacity

1. **Implement Aggressive Cleanup** ✅ (You already have the scripts!)
   - Archive old snapshots (2+ years)
   - Delete old completed tasks (6+ months)
   - Soft-delete inactive users (12+ months)
   - **Impact:** Extends capacity by ~50%

2. **Optimize Heavy Tables**
   - **Snapshots** are your largest records (~1 KB each)
   - Consider reducing bar JSONB size if possible
   - Could you store bars more efficiently?
     - Current: `{position: 1, status: "brood", detailedStatus: "B"}`
     - Optimized: Store as string: `"1:B"` (saves ~80% space)

3. **Retention Policies**
   - Keep only 1 year of snapshots (vs 2+ years)
   - Archive inspections older than 18 months

4. **Monitor Growth**
   - Run `database_health_monitor.sql` monthly
   - Set up Supabase alerts at 400 MB (80% capacity)

---

## 💰 When to Upgrade?

### Supabase Pro Tier ($25/month)
**Includes:**
- **8 GB database** (16x larger) → ~80,000 users Year 1
- 250 GB bandwidth
- 100 GB file storage
- No inactivity pausing
- Daily backups

**Break-even:** If you exceed 5,000 users in Year 1, upgrade is worth it.

### Vercel Pro ($20/month)
**Includes:**
- 1 TB bandwidth
- Commercial use allowed
- Team collaboration

**Break-even:** Only needed if you want commercial use or exceed bandwidth.

### **Total Cost at Scale:**
- **5,000-10,000 users:** $25/month (Supabase Pro only)
- **10,000-50,000 users:** $45/month (Supabase Pro + Vercel Pro)
- **50,000+ users:** $45/month + overage fees (~$0.125/GB database)

---

## 📈 Growth Milestones

| Users | Year 1 DB Size | Action Required |
|-------|----------------|-----------------|
| 100 | 10 MB | ✅ Stay on free tier |
| 500 | 49 MB | ✅ Stay on free tier |
| 1,000 | 98 MB | ✅ Stay on free tier |
| 2,500 | 245 MB | ✅ Stay on free tier |
| **5,000** | **490 MB** | ⚠️ **Near limit, implement cleanup** |
| **5,100** | **500 MB** | ❌ **FREE TIER LIMIT REACHED** |
| 10,000 | 980 MB | 💰 Supabase Pro ($25/month) |

---

## 🎯 Summary

### **How many users before hitting free tier limits?**

**Conservative estimate:** **~5,000 users in Year 1**  
**With cleanup:** **~7,800 users in Year 1**

**Your PRIMARY constraint is Supabase database size (500 MB).**

All other limits (bandwidth, MAU, serverless functions) are much more generous and won't be an issue until you're well into paid tiers anyway.

### **Good News:**
1. Your database design is **very efficient**
2. Cleanup strategies can extend capacity significantly
3. Upgrade costs are **very reasonable** ($25/month for 16x capacity)
4. You have a **clear growth path** without major refactoring

### **Action Items:**
1. ✅ Implement the cleanup scripts you now have
2. ✅ Set up monthly monitoring with `database_health_monitor.sql`
3. ✅ Add Supabase size alerts at 400 MB (80%)
4. 🎯 Budget for Supabase Pro when you hit ~4,000 users
