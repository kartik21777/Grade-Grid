import fetch from 'node-fetch';

async function testSubmit() {
  const payload = {
    graded: true,
    status: 'Submitted',
    score: { code: 25, func: 50, doc: 25 },
    feedback: 'great'
  };

  try {
    // We assume CS-101 and assignment ID 1 exists
    const res = await fetch('http://localhost:5000/api/submissions/CS-101/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', data);
  } catch (err) {
    console.log('Error:', err);
  }
}

testSubmit();
