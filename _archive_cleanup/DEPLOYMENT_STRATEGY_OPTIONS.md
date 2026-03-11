# Deployment Strategy Options for TBH Beekeeper
## Managing Beta Testing vs. Production Environments

**Context:** You now have official testing volunteers and need to protect their environment from breaking changes while continuing active development.

**Date:** December 28, 2025  
**Prepared for:** Management Decision

---

## Executive Summary

**Current Situation:**
- Single production environment
- All commits to `main` branch auto-deploy to live site
- No isolation between development and testing

**Business Risk:**
- Breaking changes immediately affect testers
- No rollback strategy
- Can't test changes before releasing to testers
- Database changes could corrupt tester data

**Recommended Solution:** **Option 2A - Git Branch Strategy with Vercel Preview (FREE)**

**Timeline to Implement:** 1-2 hours  
**Additional Cost:** $0/month  
**Risk Mitigation:** High

---

## Option 1: Multi-Environment Vercel Projects (Enterprise Approach)

### Description
Create separate Vercel projects for each environment:
- **Development** - Your active coding environment
- **Staging/Beta** - Testing environment for volunteers
- **Production** - Stable public release (future)

### Architecture
```
GitHub Branches          Vercel Projects           URLs
─────────────────────   ──────────────────────   ─────────────────────────
develop branch     →    dev.vercel.app      →    dev.tbhbeekeeper.com
staging branch     →    staging.vercel.app  →    beta.tbhbeekeeper.com
main branch        →    production.vercel   →    tbhbeekeeper.com
```

### Pros
✅ Complete isolation between environments  
✅ Industry standard for mature products  
✅ Each environment can have different configs  
✅ Easy to understand and maintain  
✅ Can use different Supabase projects per environment  
✅ Professional workflow

### Cons
❌ Requires 3 Vercel projects (2 free + 1 paid)  
❌ Need separate Supabase projects (or branches)  
❌ More complex deployment workflow  
❌ Higher costs at scale  
❌ Need to manage 3 sets of environment variables

### Cost Analysis
| Service | Development | Staging | Production | Monthly Total |
|---------|-------------|---------|------------|---------------|
| **Vercel** | Free (Hobby) | Free (Hobby) | $20 (Pro)* | $20 |
| **Supabase** | Free | Free | $25 (Pro) | $25 |
| **Custom Domains** | N/A | N/A | $12/year | $1 |
| **Total** | - | - | - | **$46/month** |

*Hobby plan doesn't support commercial use; you'd need Pro for production

### Implementation Time
- **Setup:** 3-4 hours
- **Learning curve:** Medium
- **Ongoing maintenance:** Low

---

## Option 2: Git Branch Strategy with Vercel Preview (RECOMMENDED)

### Option 2A: Simple Two-Branch Strategy (FREE)

#### Description
Use Git branches with Vercel's built-in preview deployments:
- **`main` branch** - Stable environment for testers (auto-deploys)
- **`develop` branch** - Your active development (preview deployments)
- **PR-based previews** - Auto-generated URLs for each feature

#### Architecture
```
GitHub Workflow              Vercel Deployments
─────────────────           ───────────────────────────────
develop branch         →    preview-xyz.vercel.app (auto)
  ↓ (Pull Request)
     Review & Test     →    pr-123.vercel.app (auto)
  ↓ (Merge to main)
main branch            →    tbhbeekeeper.com (production)
```

#### Workflow
1. **Development:** Work on `develop` branch
   - Auto-creates preview URL: `develop-tbhbeekeeper.vercel.app`
   - You can test here without affecting testers

2. **Feature branches:** Create feature branches from `develop`
   - Each PR gets its own preview URL
   - Test specific features in isolation

3. **Release to testers:** Merge `develop` → `main`
   - Only when features are tested and ready
   - Testers always use the stable `main` deployment

4. **Hotfixes:** Create from `main`, merge back to `main` and `develop`

#### Pros
✅ **FREE** on Vercel Hobby plan  
✅ Automatic preview URLs for every branch  
✅ Testers get stable environment  
✅ You can develop/test freely  
✅ Simple to understand and implement  
✅ Standard industry practice  
✅ No additional infrastructure  
✅ Easy rollback (revert commit)  
✅ Can still use single Supabase project

#### Cons
⚠️ Shared Supabase database (could be issue for testing)  
⚠️ Preview URLs change with each deployment  
⚠️ Hobby plan = non-commercial only (need Pro at launch)

#### Cost Analysis
| Service | Cost | Notes |
|---------|------|-------|
| **Vercel** | $0/month | Hobby plan (upgrade to Pro $20 at launch) |
| **Supabase** | $0/month | Free tier sufficient for testing phase |
| **Total** | **$0/month** | Until commercial launch |

#### Implementation Time
- **Setup:** 30 minutes - 1 hour
- **Learning curve:** Low
- **Ongoing maintenance:** Very low

---

### Option 2B: Branch Strategy + Supabase Branching (Better Data Isolation)

Same as 2A, but use Supabase's **Branching** feature (Pro plan required):

#### Additional Benefits
✅ Each Git branch gets its own database branch  
✅ Prevents accidentally corrupting tester data  
✅ Can test database migrations safely  
✅ Automatic sync between dev and production

#### Additional Costs
| Service | Cost | Notes |
|---------|------|-------|
| **Supabase Pro** | $25/month | Required for branching feature |
| **Total** | **$25/month** | Vercel still free |

---

## Option 3: Feature Flags / Canary Deployments

### Description
Deploy all code to production, but use feature flags to control what users see:
- Library like **LaunchDarkly**, **Unleash**, or custom flags
- Toggle features on/off for specific users
- Gradual rollouts (10% → 50% → 100%)

### Example
```typescript
if (featureFlags.isEnabled('smart-bar-cycling', user.id)) {
    // New smart cycling logic
} else {
    // Old cycling logic
}
```

### Pros
✅ Deploy continuously without breaking things  
✅ Granular control over who sees what  
✅ Can do A/B testing  
✅ Gradual rollouts reduce risk  
✅ Single codebase, single deployment

### Cons
❌ Code complexity increases  
❌ Technical debt (old + new code)  
❌ Requires feature flag service ($)  
❌ Need to clean up flags after rollout  
❌ Not suitable for database changes

### Cost Analysis
| Service | Cost | Notes |
|---------|------|-------|
| **LaunchDarkly** | Starts at $10/month | Full-featured |
| **Unleash (self-hosted)** | Free | Requires hosting |
| **Custom solution** | Free | Time to build/maintain |

### Implementation Time
- **Setup:** 4-8 hours (custom) or 2-3 hours (LaunchDarkly)
- **Learning curve:** Medium-High
- **Ongoing maintenance:** Medium (flag cleanup)

**Verdict:** Overkill for your current stage, but valuable at scale.

---

## Option 4: Monorepo with Multiple Apps (Advanced)

### Description
Split your codebase into multiple apps:
- `apps/web-prod` - Production version (stable)
- `apps/web-beta` - Beta version (active dev)
- Shared `packages/` for common code

### Pros
✅ Complete code isolation  
✅ Can have different dependencies  
✅ Very safe

### Cons
❌ Code duplication  
❌ Harder to maintain  
❌ Merge conflicts between versions  
❌ Not standard practice

**Verdict:** Not recommended - anti-pattern.

---

## Recommended Implementation: Option 2A (Free Branch Strategy)

### Why This Is Best For You

1. **Zero cost** during testing phase
2. **Industry standard** Git workflow
3. **Easy to implement** in 30-60 minutes
4. **Scalable** - upgrade to Option 1 or 2B later if needed
5. **Vercel handles everything** automatically
6. **Protects your testers** from breaking changes

### Step-by-Step Implementation Plan

#### Phase 1: Setup Branch Strategy (30 minutes)

1. **Create `develop` branch from `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b develop
   git push -u origin develop
   ```

2. **Configure Vercel branch deployments:**
   - Go to Vercel Dashboard → Your Project → Settings → Git
   - Set "Production Branch" to `main`
   - Enable "Preview Deployments" for all branches
   - **Result:** 
     - `main` deploys to `tbhbeekeeper.com` (testers)
     - `develop` deploys to `develop-tbhbeekeeper.vercel.app` (you)

3. **Update GitHub branch protection:**
   - Protect `main` branch
   - Require pull requests for merging
   - Optional: Require review before merge

#### Phase 2: Update Workflow (Ongoing)

**Your Daily Workflow:**
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/smart-cycling

# Make changes, commit frequently
git add .
git commit -m "feat: add smart cycling"
git push origin feature/smart-cycling

# Create Pull Request on GitHub: feature/smart-cycling → develop
# Review preview URL, test thoroughly

# Once tested, merge PR → develop
# Test on develop preview URL

# When ready for testers, create PR: develop → main
# Merge to deploy to production (testers' environment)
```

**Emergency Hotfix Workflow:**
```bash
# Critical bug in production
git checkout main
git checkout -b hotfix/fix-crash

# Fix bug
git add .
git commit -m "fix: resolve crash on login"

# Create PR: hotfix → main
# Merge when ready

# Also merge back to develop
git checkout develop
git merge main
git push origin develop
```

#### Phase 3: Communication with Testers

**Tester Instructions:**
- **Production URL:** `https://tbhbeekeeper.com` (or your custom domain)
- **Update frequency:** Weekly or bi-weekly releases
- **Announcement:** Email/Slack notification before each release
- **Rollback plan:** If issues arise, revert main branch immediately

**Beta Tester Program (Optional Later):**
- Offer "early access" to `develop` environment
- Get feedback before releasing to all testers

---

## Upgrade Path: When to Move to Paid Tiers

### Triggers for Upgrading

| Milestone | Action | Cost Impact |
|-----------|--------|-------------|
| **50+ active testers** | Upgrade Supabase to Pro ($25) | +$25/month |
| **Need database branching** | Add Supabase branching | Included in Pro |
| **Commercial launch** | Upgrade Vercel to Pro ($20) | +$20/month |
| **1000+ users** | Review tier limits | Variable |
| **Multiple team members** | Vercel Team plan ($20/user) | +$20/user |

### Expected Timeline
- **Now - 3 months:** FREE (testing phase)
- **3-6 months:** $25/month (Supabase Pro for scaling)
- **6-12 months:** $45/month (Add Vercel Pro for commercial)
- **12+ months:** Review based on user growth

---

## Alternative Considerations

### Mobile App Deployment

Your PWA is wrapped in an Android app via Expo. Considerations:

**Current State:**
- Mobile app points to web URL
- Web updates = instant mobile updates
- No app store approval needed for web changes

**Future Strategy:**
- Keep same approach (PWA benefits)
- Or: Build separate beta app pointing to `develop` environment
  - Google Play allows beta tracks
  - Testers opt into beta channel

---

## Decision Matrix

| Criterion | Option 1 (Multi-Project) | **Option 2A (Branches)** ★ | Option 3 (Feature Flags) |
|-----------|-------------------------|----------------------------|------------------------|
| **Cost (Year 1)** | $552/year | **$0/year** | $120+/year |
| **Complexity** | Medium | **Low** | High |
| **Setup Time** | 3-4 hours | **30-60 min** | 4-8 hours |
| **Tester Safety** | High | **High** | Medium |
| **Developer Experience** | Good | **Excellent** | Good |
| **Scalability** | Excellent | **Good** | Excellent |
| **Data Isolation** | Excellent | Medium* | Low |
| **Industry Standard** | Yes | **Yes** | Yes (at scale) |

*Can upgrade to Option 2B (+$25/month) for better data isolation

---

## Recommended Action Plan

### Immediate (This Week)
1. ✅ Implement **Option 2A** - Git Branch Strategy
2. ✅ Set `main` as protected production branch
3. ✅ Create `develop` branch for active development
4. ✅ Configure Vercel preview deployments
5. ✅ Test workflow with one feature

### Short Term (Next Month)
1. Document branching strategy for future contributors
2. Set up release schedule (e.g., weekly beta releases)
3. Create tester communication plan
4. Monitor Supabase/Vercel usage for tier planning

### Medium Term (3-6 Months)
1. Evaluate if Supabase branching needed ($25/month)
2. Consider beta tester program for `develop` environment
3. Plan commercial launch (Vercel Pro upgrade)
4. Review database size and plan for scaling

### Long Term (6-12 Months)
1. Assess feature flag strategy for gradual rollouts
2. Consider CI/CD automation (GitHub Actions)
3. Implement automated testing in preview deployments
4. Plan for multi-region deployment if needed

---

## Questions for Management Decision

1. **Budget:** Is $0/month acceptable for testing phase, with $25-45/month at launch?
2. **Timeline:** When do you expect to transition from testing to commercial launch?
3. **Risk tolerance:** How critical is database isolation during testing? (affects Option 2A vs 2B)
4. **Team growth:** Do you expect to onboard additional developers within 6 months?
5. **Beta program:** Would you like a formal beta tester group with early access?

---

## Conclusion

**Recommendation: Implement Option 2A immediately.**

**Rationale:**
- Zero cost during testing phase
- Industry-standard workflow
- Easy to implement (< 1 hour)
- Protects testers from broken deployments
- Scalable to more sophisticated approaches later
- No vendor lock-in

**Next Steps:**
1. Approve this strategy
2. Allocate 1 hour for implementation
3. Test workflow with smart-cycling feature
4. Communicate new release process to testers

**Risk Assessment:** LOW - Standard industry practice, no cost, easy rollback.

---

**Prepared by:** Antigravity AI  
**Review Status:** Pending Management Approval  
**Implementation Owner:** Development Lead (you)
