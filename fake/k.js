const text = "mess_oak_9311039309";

// Convert string to Base64
const encoded = Buffer.from(text, "utf8").toString("base64");

console.log("Encoded:", encoded); // "SGVsbG8sIFdvcmxkIQ=="
