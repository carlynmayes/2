const API_URL = 'http://localhost:5555/api'

const token = localStorage.getItem('token')

if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token')
}

function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'index.html'
})

async function getMemberships() {
  const res = await fetch(`${API_URL}/memberships`, {
    method: 'GET',
    headers: authHeader()
  })

  const memberships = await res.json()

  if (!res.ok) {
    document.getElementById('membershipsList').textContent = memberships.message || 'Failed to load memberships'
    return
  }

  renderMemberships(memberships)
}

function renderMemberships(memberships) {
  const container = document.getElementById('membershipsList')
  container.innerHTML = ''

  if (memberships.length === 0) {
    container.textContent = 'No memberships found.'
    return
  }

  memberships.forEach(membership => {
    const div = document.createElement('div')
    div.classList.add('membership-card')

    div.innerHTML = `
      <h3>${membership.name}</h3>
      <p><strong>MongoDB _id:</strong> ${membership._id}</p>
      <p><strong>ID:</strong> ${membership.id}</p>
      <p><strong>Name:</strong> ${membership.name}</p>
      <p><strong>Price:</strong> $${membership.price}</p>
      <p><strong>Recurring:</strong> ${membership.recurring} days</p>
      <p><strong>Discount:</strong> ${membership.discount}%</p>
      <p><strong>Active:</strong> ${membership.active}</p>
    `

    container.appendChild(div)
  })
}

document.getElementById('displayAllBtn').addEventListener('click', () => {
  getMemberships()
})

document.getElementById('createMembershipForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const res = await fetch(`${API_URL}/memberships`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({
      id: Number(document.getElementById('membershipId').value),
      name: document.getElementById('name').value,
      price: Number(document.getElementById('price').value),
      recurring: Number(document.getElementById('recurring').value),
      discount: Number(document.getElementById('discount').value),
      active: document.getElementById('active').value === 'true'
    })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('createMsg').style.color = 'red'
    document.getElementById('createMsg').textContent = data.message || 'Failed to create membership'
    return
  }

  document.getElementById('createMsg').style.color = 'green'
  document.getElementById('createMsg').textContent = 'Membership created!'

  document.getElementById('createMembershipForm').reset()
  getMemberships()
})

document.getElementById('updateMembershipForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const mongoId = document.getElementById('updateMongoId').value

  const res = await fetch(`${API_URL}/memberships/${mongoId}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({
      id: Number(document.getElementById('updateMembershipId').value),
      name: document.getElementById('updateName').value,
      price: Number(document.getElementById('updatePrice').value),
      recurring: Number(document.getElementById('updateRecurring').value),
      discount: Number(document.getElementById('updateDiscount').value),
      active: document.getElementById('updateActive').value === 'true'
    })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('updateMsg').style.color = 'red'
    document.getElementById('updateMsg').textContent = data.message || 'Failed to update membership'
    return
  }

  document.getElementById('updateMsg').style.color = 'green'
  document.getElementById('updateMsg').textContent = 'Membership updated!'

  document.getElementById('updateMembershipForm').reset()
  getMemberships()
})

document.getElementById('deleteMembershipForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const mongoId = document.getElementById('deleteMongoId').value

  const res = await fetch(`${API_URL}/memberships/${mongoId}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('deleteMsg').style.color = 'red'
    document.getElementById('deleteMsg').textContent = data.message || 'Failed to delete membership'
    return
  }

  document.getElementById('deleteMsg').style.color = 'green'
  document.getElementById('deleteMsg').textContent = 'Membership deleted!'

  document.getElementById('deleteMembershipForm').reset()
  getMemberships()
})

getMemberships()