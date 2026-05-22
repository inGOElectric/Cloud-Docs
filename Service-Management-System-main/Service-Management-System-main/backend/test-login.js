// Test script for user login

const response = await fetch('http://localhost:4000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@service.com',   // must match DB
    password: 'admin123',
  }),
});

const data = await response.json();

console.log('Status:', response.status);
console.log('Response:', data);

if (data.token) {
  console.log('\n✅ Login successful!');
  console.log('Token:', data.token);
  console.log('\nUse this token for protected routes:');
  console.log('Authorization: Bearer ' + data.token);
} else {
  console.log('\n❌ Login failed');
}
