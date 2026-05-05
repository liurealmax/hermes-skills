import request from '@/utils/request'

// ============================================================================
// LIST OPERATIONS
// ============================================================================

// Get list of items
export function getItems(params) {
  return request({
    url: '/items',
    method: 'get',
    params
  })
}

// Get recent items
export function getRecentItems(params) {
  return request({
    url: '/items/recent',
    method: 'get',
    params
  })
}

// ============================================================================
// DETAIL OPERATIONS
// ============================================================================

// Get item by ID
export function getItem(id) {
  return request({
    url: `/items/${id}`,
    method: 'get'
  })
}

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

// Create new item
export function createItem(data) {
  return request({
    url: '/items',
    method: 'post',
    data
  })
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

// Update item by ID
export function updateItem(id, data) {
  return request({
    url: `/items/${id}`,
    method: 'put',
    data
  })
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

// Delete item by ID
export function deleteItem(id) {
  return request({
    url: `/items/${id}`,
    method: 'delete'
  })
}

// ============================================================================
// CHECK OPERATIONS
// ============================================================================

// Check single item
export function checkItem(value) {
  return request({
    url: '/items/check',
    method: 'get',
    params: { value }
  })
}

// Check IP
export function checkIP(ip) {
  return request({
    url: '/items/check/ip',
    method: 'get',
    params: { ip }
  })
}

// Check domain
export function checkDomain(domain) {
  return request({
    url: '/items/check/domain',
    method: 'get',
    params: { domain }
  })
}

// Check URL
export function checkURL(url) {
  return request({
    url: '/items/check/url',
    method: 'get',
    params: { url }
  })
}

// Check hash
export function checkHash(hash) {
  return request({
    url: '/items/check/hash',
    method: 'get',
    params: { hash }
  })
}

// Check email
export function checkEmail(email) {
  return request({
    url: '/items/check/email',
    method: 'get',
    params: { email }
  })
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

// Batch check items
export function checkBatch(data) {
  return request({
    url: '/items/check/batch',
    method: 'post',
    data
  })
}

// ============================================================================
// SEARCH OPERATIONS
// ============================================================================

// Global search
export function search(params) {
  return request({
    url: '/search',
    method: 'get',
    params
  })
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Get list with pagination
const response = await getItems({
  page: 1,
  per_page: 20,
  status: 'active'
})

// Example 2: Create new item
const response = await createItem({
  name: 'Item Name',
  description: 'Item description',
  status: 'active'
})

// Example 3: Update item
const response = await updateItem(1, {
  name: 'Updated Name',
  status: 'inactive'
})

// Example 4: Delete item
const response = await deleteItem(1)

// Example 5: Check IP
const response = await checkIP('192.168.1.1')

// Example 6: Batch check
const response = await checkBatch({
  items: [
    { type: 'IP', value: '192.168.1.1' },
    { type: 'domain', value: 'example.com' }
  ]
})

// Example 7: Search
const response = await search({
  q: 'search keyword',
  type: 'all'
})
*/
