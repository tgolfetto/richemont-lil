import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is missing.");
  process.exit(1);
}

const outputDir = path.resolve(process.cwd(), "public/course-mocks");
await fs.mkdir(outputDir, { recursive: true });

const prompts = [
  "Luxury jewelry learning card image, Cartier-inspired aesthetic, soft light blue backdrop, high-end editorial composition",
  "Luxury watch and jewelry training visual, polished metal texture, elegant shadows, premium retail style",
  "Boutique leadership learning cover image, refined luxury objects, minimalist composition, pale blue palette",
  "Luxury craftsmanship detail visual, macro jewelry components, clean background, corporate training style",
  "Clienteling course cover image, luxury boutique atmosphere, elegant neutral tones, modern editorial photography",
  "High-end retail learning banner image, premium accessories composition, white and light blue scene",
  "Luxury management training visual, abstract jewelry forms, sophisticated composition, clean and minimal",
  "Luxury brand storytelling course image, elegant jewelry arrangement, soft studio lighting, polished look"
];

for (let index = 0; index < prompts.length; index += 1) {
  const prompt = prompts[index];
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024"
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Image generation failed (${response.status}): ${text}`);
  }

  const payload = await response.json();
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("No image payload returned.");
  }

  const filePath = path.join(outputDir, `luxury-${String(index + 1).padStart(2, "0")}.png`);
  await fs.writeFile(filePath, Buffer.from(b64, "base64"));
  console.log(`Saved ${filePath}`);
}

console.log("Done.");
