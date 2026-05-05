---
name: api-integration-verification
description: Systematic workflow for verifying frontend-backend API consistency, implementing missing APIs, and synchronizing documentation
---

# API Integration Verification

## Overview

This skill provides a systematic workflow for verifying frontend-backend API consistency, implementing missing APIs, and synchronizing documentation. It ensures that frontend and backend implementations match exactly and that documentation accurately reflects the actual code.

## When to Use

Use this skill when:
- Frontend and backend API implementations may have diverged
- Documentation claims different API counts than actual code
- Need to verify complete API coverage across all modules
- Implementing missing APIs after discovering gaps
- Updating documentation to match actual implementation

## Prerequisites

- Backend API routes are implemented
- Frontend API files exist
- Access to both backend and frontend codebases
- Ability to run grep/terminal commands

## Workflow

### Phase 1: API Count Verification

**Step 1: Count Backend APIs**

```bash
# Count APIs by module
cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  count=$(grep -c "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "0")
  echo "$dir: $count"
done

# Total count
grep -h "@.*\.route" */routes.py | wc -l
```

**Step 2: Count Frontend APIs**

```bash
# Count APIs by module
cd frontend/src/api
for file in auth.js threats.js methods.js guides.js incidents.js alerts.js stats.js users.js search.js; do
  echo "$file: $(grep -c "export function" "$file")"
done

# Total count
grep -h "export function" *.js | wc -l
```

**Step 3: Compare and Identify Gaps**

Create a comparison table:

| Module | Backend | Frontend | Status |
|--------|---------|---------|--------|
| auth | 5 | 5 | ✅ |
| threats | 12 | 11 | ⚠️ Missing 1 |
| methods | 4 | 4 | ✅ |

Identify:
- Modules with mismatched counts
- Specific missing APIs
- Which backend endpoints lack frontend implementations

### Phase 2: Implement Missing APIs

**Step 4: Implement Missing Functions**

For each missing API:
1. Check backend route implementation
2. Add matching function to frontend API file
3. Follow existing patterns in the file
4. Ensure proper request/response handling

**Step 5: Update API Exports**

Update `frontend/src/api/index.js`:
```javascript
// API模块统一导出
export * from './auth'
export * from './threats'
export * from './methods'
// ... add new modules
export * from './search'  // Example: new module
```

### Phase 3: Documentation Synchronization

**Step 6: Update Documentation**

Update all documentation files:
- API count totals
- API descriptions for new functions
- Usage examples
- Code examples

**Step 7: Create Verification Report**

Create a comprehensive report showing:
- Verification overview
- Before/after comparison
- All changes made
- 100% completion confirmation

### Phase 4: Frontend-Backend Integration Debugging

**Step 8: Debug Data Loading Issues**

When users report data inconsistency (e.g., admin can't see new users):

1. **Check component data loading**:
   ```bash
   grep -n "const load" frontend/src/views/Users.vue
   ```

2. **Verify API calls are used**:
   - Look for hardcoded mock data
   - Check if `import { getUsers } from '@/api/users'` is present
   - Verify async/await pattern is used

3. **Check response handling**:
   ```bash
   grep -A 10 "response.success" frontend/src/views/Users.vue
   ```

**Step 9: Debug Response Code Issues**

When operations succeed but show error messages:

1. **Check request interceptor**:
   ```bash
   grep -A 5 "if (res.code" frontend/src/utils/request.js
   ```

2. **Verify success code handling**:
   - Should handle `code=200` (OK)
   - Should handle `code=201` (Created)
   - Should handle `code=204` (No Content)

3. **Test with actual response**:
   - Check browser Network tab
   - Verify backend returns correct code
   - Compare with frontend expectations

## Common Patterns

### Standard API Function Pattern

```javascript
import request from '@/utils/request'

// GET request with params
export function getItems(params) {
  return request({
    url: '/items',
    method: 'get',
    params
  })
}

// POST request with data
export function createItem(data) {
  return request({
    url: '/items',
    method: 'post',
    data
  })
}

// PUT request with id and data
export function updateItem(id, data) {
  return request({
    url: `/items/${id}`,
    method: 'put',
    data
  })
}

// DELETE request with id
export function deleteItem(id) {
  return request({
    url: `/items/${id}`,
    method: 'delete'
  })
}
```

### Batch Check Pattern

```javascript
// Batch operations accept array of items
export function checkBatch(data) {
  return request({
    url: '/items/check/batch',
    method: 'post',
    data  // { items: [{ type, value }, ...] }
  })
}
```

### Search Pattern

```javascript
// Search accepts query and optional type filter
export function search(params) {
  return request({
    url: '/search',
    method: 'get',
    params  // { q: 'keyword', type: 'all' }
  })
}
```

## References

For detailed debugging commands and common frontend-backend integration issues, see:
- `references/frontend-backend-integration-debugging.md` - Quick debugging commands, common issues, and solutions

## Pitfalls

### Documentation Drift

**Problem**: Documentation claims different API counts than actual code.

**Solution**: Always verify actual code counts before updating documentation.

**Detection**: Compare grep counts with documented totals.

**Example**:
- Documentation says: "40 APIs"
- Actual code has: 39 APIs
- Action: Verify which API is missing before updating docs

### Missing Exports

**Problem**: New API files created but not exported in index.js.

**Solution**: Always update index.js when creating new API files.

**Detection**: Check that all files in api/ directory are exported.

**Example**:
```javascript
// Missing export for search.js
// index.js has: export * from './auth', './threats', ...
// But not: export * from './search'
```

### Inconsistent Naming

**Problem**: Frontend function names don't match backend endpoint patterns.

**Solution**: Use consistent naming conventions (get*, create*, update*, delete*, check*).

**Detection**: Review function names against backend routes.

**Example**:
- Backend: `POST /api/v1/threats/check/batch`
- Frontend: `checkBatch(data)` ✅
- Frontend: `batchCheck(data)` ⚠️ (inconsistent)

### Incomplete Implementation

**Problem**: Only some functions in a module are implemented.

**Solution**: Implement all required functions for each module.

**Detection**: Compare per-module counts, not just totals.

**Example**:
- Backend threats module: 12 APIs
- Frontend threats.js: 11 functions
- Missing: `checkBatch` function

### Response Code Handling in Request Interceptors

**Problem**: Frontend request interceptor only handles `code=200` but backend returns other success codes (e.g., `code=201` for created resources).

**Solution**: Handle all success HTTP status codes in the response interceptor.

**Detection**: Registration/creation operations succeed but show error messages.

**Example**:
```javascript
// ❌ Only handles 200
if (res.code === 200) {
  return { success: true, data: res.data, message: res.message }
}

// ✅ Handles 200 and 201
if (res.code === 200 || res.code === 201) {
  return { success: true, data: res.data, message: res.message }
}
```

**Common Success Codes**:
- `200` - OK (GET, PUT, DELETE)
- `201` - Created (POST)
- `204` - No Content (DELETE)

### Mock Data vs Real API Calls

**Problem**: Frontend components use hardcoded mock data instead of calling real APIs, causing data inconsistency.

**Solution**: Replace mock data with real API calls in component data loading functions.

**Detection**: Admin users can't see newly registered users, or data doesn't update after changes.

**Example**:
```javascript
// ❌ Hardcoded mock data
const loadUsers = () => {
  users.value = [
    { id: 1, username: 'admin', ... },
    { id: 2, username: 'user1', ... }
  ]
}

// ✅ Real API call
const loadUsers = async () => {
  try {
    const response = await getUsers({ page: 1, per_page: 100 })
    if (response.success) {
      users.value = response.data.items || []
    }
  } catch (error) {
    ElMessage.error('加载失败')
  }
}
```

## User Preferences

### Workflow Order

**Preference**: Complete implementation first, then update documentation.

**User Request**: "先把缺少的2个api写好，完成对接，然后再更新api文档"

**Implementation**:
1. Implement all missing APIs
2. Verify all APIs work
3. Then update documentation
4. Do not update docs until code is complete

### Documentation Format

**Preference**: Use tables for API listings.

**Format**:
- Include: module, file, count, status
- Show before/after comparisons
- Use checkmarks (✅) for completed items
- Use warnings (⚠️) for incomplete items

**Example**:
```markdown
| 模块 | 后端API | 前端API | 状态 |
|------|---------|---------|------|
| 认证模块 | 5 | 5 | ✅ 一致 |
| 威胁情报模块 | 12 | 12 | ✅ 一致 |
```

### Verification Reports

**Preference**: Create comprehensive verification reports.

**Report Contents**:
- Verification overview
- Comparison tables
- List of all changes made
- 100% completion confirmation
- File statistics

**Example**:
```markdown
## 📋 验证概述

**验证时间**: 2026-05-03
**验证状态**: ✅ 100%完成
**前后端API数量**: 41个（完全一致）
```

## Verification Checklist

- [ ] Backend API count verified per module
- [ ] Frontend API count verified per module
- [ ] Comparison table created
- [ ] Missing APIs identified
- [ ] Missing functions implemented
- [ ] API exports updated
- [ ] Documentation counts updated
- [ ] API descriptions added
- [ ] Usage examples added
- [ ] Verification report created
- [ ] Final consistency confirmed
- [ ] Response code handling verified (200, 201, 204)
- [ ] Component data loading checked for mock data
- [ ] Real API calls verified in components
- [ ] Frontend-backend integration tested

## Example: Complete Workflow

### Step 1: Verify Backend APIs

```bash
cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  count=$(grep -c "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "0")
  echo "$dir: $count"
done
```

Output:
```
auth: 5
threats: 12
methods: 4
guides: 5
incidents: 4
alerts: 2
search: 1
stats: 3
users: 5
Total: 41
```

### Step 2: Verify Frontend APIs

```bash
cd frontend/src/api
for file in auth.js threats.js methods.js guides.js incidents.js alerts.js stats.js users.js search.js; do
  echo "$file: $(grep -c "export function" "$file")"
done
```

Output:
```
auth.js: 5
threats.js: 11  ⚠️ Missing 1
methods.js: 4
guides.js: 5
incidents.js: 4
alerts.js: 2
search.js: 0  ⚠️ Missing 1
stats.js: 3
users.js: 5
Total: 39  ⚠️ Missing 2
```

### Step 3: Identify Missing APIs

Comparison:
- threats.js: Backend has 12, frontend has 11 → Missing `checkBatch`
- search.js: Backend has 1, frontend has 0 → Missing entire file

### Step 4: Implement Missing APIs

Add to `threats.js`:
```javascript
// 批量威胁检查
export function checkBatch(data) {
  return request({
    url: '/threats/check/batch',
    method: 'post',
    data
  })
}
```

Create `search.js`:
```javascript
import request from '@/utils/request'

// 全局搜索
export function search(params) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}
```

Update `index.js`:
```javascript
export * from './search'
```

### Step 5: Update Documentation

Update all documentation files with correct counts and new API descriptions.

### Step 6: Create Verification Report

Create comprehensive report showing 100% completion.

## Best Practices

1. **Always verify before implementing**: Count APIs on both sides before making changes
2. **Implement first, document second**: Complete code changes before updating docs
3. **Use systematic verification**: Count per module, not just totals
4. **Create comparison tables**: Show before/after for clarity
5. **Document all changes**: Keep track of what was changed and why
6. **Test after implementation**: Verify new APIs work correctly
7. **Update all documentation**: Don't leave any docs with old counts

## Lessons Learned

1. **Documentation drift is common**: Docs often claim different counts than actual code
2. **Per-module verification is essential**: Total counts can hide missing APIs in specific modules
3. **Implementation before documentation**: User prefers complete implementation before doc updates
4. **Verification reports provide confidence**: Comprehensive reports confirm 100% completion
5. **Systematic counting prevents errors**: Use grep commands, don't count manually
6. **Response code handling matters**: Frontend interceptors must handle all success codes (200, 201, 204), not just 200
7. **Mock data causes data inconsistency**: Hardcoded mock data in components prevents real data from being displayed
8. **Debug data loading systematically**: Check imports, API calls, and response handling when data doesn't update

## Related Skills

- `api-optimization-after-model-changes` - For updating APIs after model changes
- `database-model-optimization-and-api-sync` - For database-driven API updates
- `threat-intelligence-platform-development` - For project-specific workflow
- `api-testing-with-curl` - For testing API implementations
