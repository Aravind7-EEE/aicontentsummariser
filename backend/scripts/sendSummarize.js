import fs from 'fs';

const content = fs.readFileSync(new URL('../tmp_content.txt', import.meta.url), 'utf8');

(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    const json = await res.json();
    console.log('Status:', res.status);
    console.log(JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('Request failed:', err.message);
  }
})();
