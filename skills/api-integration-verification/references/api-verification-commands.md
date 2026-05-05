# API Verification Commands

## Backend API Counting

### Count All Backend APIs
```bash
cd backend/app
grep -h "@.*\.route" */routes.py | wc -l
```

### Count APIs by Module
```bash
cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  count=$(grep -c "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "0")
  echo "$dir: $count"
done
```

### List All Backend Routes
```bash
cd backend/app
grep -h "@.*\.route" */routes.py
```

### List Routes by Module
```bash
cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  echo "=== $dir ==="
  grep "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "No routes"
  echo ""
done
```

## Frontend API Counting

### Count All Frontend APIs
```bash
cd frontend/src/api
grep -h "export function" *.js | wc -l
```

### Count APIs by File
```bash
cd frontend/src/api
for file in auth.js threats.js methods.js guides.js incidents.js alerts.js stats.js users.js search.js; do
  echo "$file: $(grep -c "export function" "$file")"
done
```

### List All Frontend Functions
```bash
cd frontend/src/api
grep -h "export function" *.js
```

### List Functions by File
```bash
cd frontend/src/api
for file in auth.js threats.js methods.js guides.js incidents.js alerts.js stats.js users.js search.js; do
  echo "=== $file ==="
  grep "export function" "$file" 2>/dev/null || echo "No functions"
  echo ""
done
```

## Comparison Commands

### Compare Backend and Frontend Counts
```bash
echo "=== Backend vs Frontend API Comparison ==="
echo ""
echo "Backend:"
cd backend/app && grep -h "@.*\.route" */routes.py | wc -l
echo ""
echo "Frontend:"
cd ../frontend/src/api && grep -h "export function" *.js | wc -l
```

### Create Comparison Table
```bash
echo "| Module | Backend | Frontend | Status |"
echo "|--------|---------|---------|--------|"

cd backend/app
for dir in auth threats methods guides incidents alerts search stats users; do
  backend_count=$(grep -c "@.*\.route" "${dir}/routes.py" 2>/dev/null || echo "0")
  frontend_count=$(cd ../../frontend/src/api && grep -c "export function" "${dir}.js" 2>/dev/null || echo "0")
  
  if [ "$backend_count" -eq "$frontend_count" ]; then
    status="✅"
  else
    status="⚠️"
  fi
  
  echo "| $dir | $backend_count | $frontend_count | $status |"
done
```

## Verification Commands

### Verify All API Files Exist
```bash
cd frontend/src/api
ls -1 *.js | wc -l
```

### Verify API Exports
```bash
cd frontend/src/api
cat index.js
```

### Check for Missing Exports
```bash
cd frontend/src/api
for file in *.js; do
  if [ "$file" != "index.js" ]; then
    module_name="${file%.js}"
    if ! grep -q "from './$module_name'" index.js; then
      echo "Missing export: $file"
    fi
  fi
done
```

## File Statistics

### Count Lines in API Files
```bash
cd frontend/src/api
for file in *.js; do
  lines=$(wc -l < "$file")
  echo "$file: $lines lines"
done
```

### Total Lines in All API Files
```bash
cd frontend/src/api
wc -l *.js | tail -1
```

## Quick Verification Script

```bash
#!/bin/bash
# Quick API verification script

echo "=== API Verification ==="
echo ""

# Backend count
cd backend/app
backend_total=$(grep -h "@.*\.route" */routes.py | wc -l)
echo "Backend APIs: $backend_total"

# Frontend count
cd ../frontend/src/api
frontend_total=$(grep -h "export function" *.js | wc -l)
echo "Frontend APIs: $frontend_total"

# Comparison
if [ "$backend_total" -eq "$frontend_total" ]; then
  echo "Status: ✅ Consistent"
else
  echo "Status: ⚠️ Inconsistent (difference: $((backend_total - frontend_total)))"
fi
```
