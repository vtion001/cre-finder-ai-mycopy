#!/usr/bin/env tsx

import * as fs from "node:fs";
import * as path from "node:path";
import archiver from "archiver";

/**
 * Script to compress MJML email templates into zip files
 * Each MJML file is renamed to index.mjml inside the zip
 * The zip file keeps the original template name
 */

const EMAIL_TEMPLATES_DIR = path.join(__dirname, "..", "email-templates");

async function compressEmailTemplate(mjmlFilePath: string): Promise<void> {
  const fileName = path.basename(mjmlFilePath, ".mjml");
  const zipFilePath = path.join(EMAIL_TEMPLATES_DIR, `${fileName}.zip`);

  console.log(`📦 Compressing ${fileName}.mjml...`);

  return new Promise((resolve, reject) => {
    // Create a file to stream archive data to
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Listen for all archive data to be written
    output.on("close", () => {
      console.log(`✅ Created ${fileName}.zip (${archive.pointer()} bytes)`);
      resolve();
    });

    // Handle errors
    archive.on("error", (err) => {
      console.error(`❌ Error creating ${fileName}.zip:`, err);
      reject(err);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add the MJML file to the archive with the name 'index.mjml'
    archive.file(mjmlFilePath, { name: "index.mjml" });

    // Finalize the archive
    archive.finalize();
  });
}

async function compressAllEmailTemplates(): Promise<void> {
  console.log("🚀 Starting email template compression...\n");

  try {
    // Read all files in the email-templates directory
    const files = fs.readdirSync(EMAIL_TEMPLATES_DIR);

    // Filter for MJML files
    const mjmlFiles = files.filter((file) => file.endsWith(".mjml"));

    if (mjmlFiles.length === 0) {
      console.log("⚠️  No MJML files found in email-templates directory");
      return;
    }

    console.log(`Found ${mjmlFiles.length} MJML template(s):`);
    mjmlFiles.forEach((file) => console.log(`  - ${file}`));
    console.log("");

    // Compress each MJML file
    for (const mjmlFile of mjmlFiles) {
      const mjmlFilePath = path.join(EMAIL_TEMPLATES_DIR, mjmlFile);
      await compressEmailTemplate(mjmlFilePath);
    }

    console.log("\n🎉 All email templates compressed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Upload the zip files to Loops.so dashboard");
    console.log("2. Create email templates using the uploaded files");
    console.log("3. Update template IDs in your environment variables");
  } catch (error) {
    console.error("❌ Error compressing email templates:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  compressAllEmailTemplates();
}

export { compressAllEmailTemplates, compressEmailTemplate };
