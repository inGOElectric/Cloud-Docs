// Test script to create a job card

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY3OTM3MDE5LCJleHAiOjE3Njc5NjU4MTl9.kIcOh9NRJS1IlqS0hPuxIuqcfxV856g_O693cNE8wZ4';

const response = await fetch('http://localhost:4000/job-cards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token,
  },
  body: JSON.stringify({
    customer: {
      name: 'John Doe',
      mobileNumber: '9998887777',
    },
    vehicle: {
      vinNumber: 'VIN-001',
      model: 'Scooter X',
    },
    jobCard: {
      serviceType: 'GENERAL',
      serviceInDatetime: new Date().toISOString(),
      remarks: 'Initial service',
    },
  }),
});

const data = await response.json();

console.log('Status:', response.status);
console.log('Response:', JSON.stringify(data, null, 2));
