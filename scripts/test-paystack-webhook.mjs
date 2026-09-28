import crypto from "node:crypto";

const secretKey = process.env.PAYSTACK_SECRET_KEY;

if (!secretKey) {
  console.error("PAYSTACK_SECRET_KEY is not available.");
  process.exit(1);
}

const payload = JSON.stringify({
  event: "charge.success",
  data: {
    reference: "test_webhook_reference",
    amount: 1000000,
    currency: "NGN",
    status: "success",
  },
});

const signature = crypto
  .createHmac("sha512", secretKey)
  .update(payload)
  .digest("hex");

console.log("Payload:");
console.log(payload);

console.log("\nSignature:");
console.log(signature);

console.log("\nRun this curl command:");
console.log(`
curl -X POST http://localhost:3000/api/webhooks/paystack \\
  -H "Content-Type: application/json" \\
  -H "x-paystack-signature: ${signature}" \\
  -d '${payload}'
`);