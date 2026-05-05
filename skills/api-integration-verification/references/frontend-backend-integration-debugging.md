# Frontend-Backend Integration Debugging

## Quick Debugging Commands

### Check Component Data Loading

```bash
# Find data loading functions in a component
grep -n "const load" frontend/src/views/Users.vue

# Check for mock data patterns
grep -n "users.value = \[" frontend/src/views/Users.vue

# Verify API imports
grep -n "import.*from '@/api" frontend/src/views/Users.vue
```

### Check Response Code Handling

```bash
# Check request interceptor success code handling
grep -A 5 "if (res.code" frontend/src/utils/request.js

# Verify all success codes are handled
grep -n "code === 200\|code === 201\|code === 204" frontend/src/utils/request.js
```

### Verify API Implementation

```bash
# Count backend APIs by module
cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  count=$(grep -c "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "0")
  echo "$dir: $count"
done

# Count frontend APIs by module
cd frontend/src/api
for file in auth.js threats.js methods.js guides.js incidents.js alerts.js stats.js users.js search.js; do
  echo "$file: $(grep -c "export function" "$file")"
done
```

## Common Issues and Solutions

### Issue 1: Registration succeeds but shows error

**Symptoms**:
- User registration completes successfully
- Backend returns 201 Created
- Frontend shows error message

**Root Cause**: Request interceptor only handles `code=200`

**Solution**:
```javascript
// frontend/src/utils/request.js
if (res.code === 200 || res.code === 201) {
  return { success: true, data: res.data, message: res.message }
}
```

### Issue 2: Admin can't see new users

**Symptoms**:
- New user registers successfully
- New user can login
- Admin user management page doesn't show new user

**Root Cause**: Component uses hardcoded mock data instead of real API

**Solution**:
```javascript
// ❌ Before: Hardcoded mock data
const loadUsers = () => {
  users.value = [
    { id: 1, username: 'admin', ... },
    { id: 2, username: 'user1', ... }
  ]
}

// ✅ After: Real API call
const loadUsers = async () => {
  try {
    loading.value = true
    const response = await getUsers({ page: 1, per_page: 100 })
    if (response.success) {
      users.value = response.data.items || []
    }
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}
```

### Issue 3: Data doesn't update after changes

**Symptoms**:
- User creates/updates data
- Data saves successfully
- List doesn't show new data

**Root Cause**: Component doesn't reload data after successful operation

**Solution**:
```javascript
const handleCreate = async () => {
  try {
    const response = await createUser(data)
    if (response.success) {
      ElMessage.success('创建成功')
      loadUsers()  // Reload data
    }
  } catch (error) {
    ElMessage.error('创建失败')
  }
}
```

## HTTP Status Codes Reference

### Success Codes (2xx)

| Code | Meaning | Common Use |
|------|---------|-------------|
| 200 | OK | GET, PUT, DELETE operations |
| 201 | Created | POST operations that create resources |
| 204 | No Content | DELETE operations with no response body |

### Client Error Codes (4xx)

| Code | Meaning | Common Use |
|------|---------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (username/email exists) |

### Server Error Codes (5xx)

| Code | Meaning | Common Use |
|------|---------|-------------|
| 500 | Internal Server Error | Unexpected server error |

## Debugging Workflow

1. **Identify the symptom**: What's not working?
2. **Check the data flow**: From API → Response → Component → Display
3. **Verify each layer**:
   - Backend: Does the API return correct data?
   - Network: Is the response code correct?
   - Interceptor: Is the response handled correctly?
   - Component: Is the data loaded and displayed?
4. **Fix the issue**: Apply the appropriate solution
5. **Test the fix**: Verify the issue is resolved

## Testing Checklist

- [ ] Backend API returns correct data
- [ ] Backend returns correct HTTP status code
- [ ] Frontend interceptor handles the status code
- [ ] Frontend component calls the API
- [ ] Frontend component handles the response
- [ ] Data is displayed correctly in the UI
- [ ] Data updates after changes
