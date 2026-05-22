const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY3OTM3MDE5LCJleHAiOjE3Njc5NjU4MTl9.kIcOh9NRJS1IlqS0hPuxIuqcfxV856g_O693cNE8wZ4';

const res = await fetch('http://localhost:4000/api/reports/warranty', {
  headers: { Authorization: 'Bearer ' + token },
});

const data = await res.json();
console.log('Status:', res.status);
console.log('Response:', data);
