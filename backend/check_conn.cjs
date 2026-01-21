const http = require("http");

console.log("Testing connectivity...");

function check(url, label) {
  const req = http.request(url, { method: "HEAD", timeout: 3000 }, (res) => {
    console.log(`${label}: Status ${res.statusCode}`);
  });
  req.on("error", (e) => {
    console.log(`${label}: Error - ${e.message}`);
  });
  req.on("timeout", () => {
    req.destroy();
    console.log(`${label}: Timeout`);
  });
  req.end();
}

check("http://localhost:4000/dolar", "Localhost");
check("http://10.200.100.89:4000/dolar", "Remote IP");
