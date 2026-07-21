const fetch = require('node-fetch');
async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/products/1/hard', { method: 'DELETE' });
    console.log(res.status);
  } catch (e) {
    console.error("Crash!", e);
  }
}
run();
