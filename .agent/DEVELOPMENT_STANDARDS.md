# Development Standards

## Database Changes

### Rule: Never Write Schema/Policies From Scratch

**When creating dev/test databases:**

1. **ALWAYS export from production first**
   - Never assume or write policies manually
   - Use production as the source of truth
   - Export schema, policies, triggers, and functions

2. **Required steps for database setup:**
   ```sql
   -- Step 1: Get production policies
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   
   -- Step 2: Get production functions
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public';
   
   -- Step 3: Export each function definition
   -- Step 4: Apply to dev/test database
   ```

3. **Verification:**
   - Test the same operations in both environments
   - If it works in production but not dev, the issue is dev setup, not code

### Rule: Production is Always Right

- If something works in production, don't fix it
- If something fails in dev but works in production, fix dev
- Never deploy database changes that haven't been tested in production first

## Testing Process

### Beta Testing Workflow

1. **Report issue**
2. **Verify in production** - Does this work in production?
3. **If yes:** Fix dev environment to match production
4. **If no:** Fix the code, test in dev, then deploy
5. **Deploy to beta**
6. **Verify fix**

## Git Workflow

### Commit Standards

- Commit messages must be clear and specific
- Include what was changed and why
- Format:
  ```
  Fix: Brief description
  
  - Specific change 1
  - Specific change 2
  - Root cause explanation
  ```

### Deployment

- Always test locally or on beta before production
- One fix per commit when possible
- Push to develop branch for beta deployment

## Communication Standards

### Instructions Format

**Always use:**
- Numbered steps
- Clear section headers
- Expected results stated upfront
- No instructions embedded in paragraphs

**Example:**
```
## Steps

### 1. Do First Thing
- Sub-step A
- Sub-step B

### 2. Do Second Thing
- Expected result: X happens
```

### Decision Making

- Think first, act second
- State assumptions clearly
- If unsure, verify before proceeding
- No "let's try this simpler approach" backtracking

## Code Standards

### UI Consistency

- All list components use same patterns:
  - Delete button position (left)
  - Delete confirmation modal (red button)
  - Button styling consistent
- Document patterns in component library

### Error Handling

- Always capture and display errors to user
- Log errors to console
- Provide actionable error messages

## Files to Reference

- `/scripts/fix_dev_policies_to_match_production.sql` - How to properly sync dev to production
- `UI_STANDARDIZATION.md` - UI pattern standards
- This file - Development process standards
