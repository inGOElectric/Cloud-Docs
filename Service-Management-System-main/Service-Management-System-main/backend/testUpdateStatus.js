// Test script for updating job card status

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY3OTM3MDE5LCJleHAiOjE3Njc5NjU4MTl9.kIcOh9NRJS1IlqS0hPuxIuqcfxV856g_O693cNE8wZ4';
const jobCardId = 1; // change this to a valid job card ID in your DB

const response = await fetch(`http://localhost:4000/job-cards/${jobCardId}/status`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({
    status: 'IN_PROGRESS', // try OPEN, IN_PROGRESS, CLOSED
  }),
});

const data = await response.json();

console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
