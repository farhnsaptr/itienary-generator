import fs from "fs";
import path from "path";
import { uploadToR2 } from "../src/lib/r2Client";
import { env } from "../src/config/env";

async function runR2UploadTest() {
  console.log("==========================================");
  console.log("🚀 CLOUDFLARE R2 UPLOAD TEST");
  console.log("==========================================");
  console.log(`📦 Target Bucket : ${env.R2_BUCKET_NAME}`);
  console.log(`🆔 Account ID    : ${env.R2_ACCOUNT_ID}`);
  console.log(`🌐 Public URL Base: ${env.R2_PUBLIC_URL}`);

  const imagePath = path.resolve(__dirname, "./upload/test.jpeg");

  if (!fs.existsSync(imagePath)) {
    console.error(`\n❌ Error: File gambar tidak ditemukan pada path:\n   ${imagePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const fileSize = (fileBuffer.length / 1024).toFixed(2);
  console.log(`\n📄 File Lokal  : ${imagePath} (${fileSize} KB)`);
  console.log(`📁 Folder R2    : tes/`);

  try {
    const startTime = Date.now();
    console.log("\n⏳ Sedang mengunggah file ke Cloudflare R2...");
    
    // Perform upload to folder 'tes'
    const result = await uploadToR2(fileBuffer, "image/jpeg", "tes");
    const duration = Date.now() - startTime;

    console.log("\n==========================================");
    console.log("🎉 UPLOAD KETIDAK-ADAAN KENDALA (BERHASIL!)");
    console.log("==========================================");
    console.log(`🔑 R2 Object Key : ${result.key}`);
    console.log(`🔗 R2 Public URL : ${result.url}`);
    console.log(`⏱️  Waktu Upload  : ${duration} ms`);
    console.log("==========================================");

    // Verify public accessibility
    console.log("\n🔍 Memeriksa apakah URL publik dapat diakses via HTTP...");
    try {
      const response = await fetch(result.url, { method: "HEAD" });
      if (response.ok) {
        console.log(`✅ VERIFIKASI HTTP OK! Gambar siap dibuka di browser (${response.status} OK)`);
      } else {
        console.log(`⚠️ File berhasil diunggah ke R2, tetapi URL publik mengembalikan HTTP ${response.status}.`);
        console.log(`   Pastikan R2 Public Domain (r2.dev / custom domain) di Cloudflare Dashboard sudah diaktifkan.`);
      }
    } catch (httpErr: any) {
      console.log(`⚠️ File diunggah ke R2, tetapi verifikasi HTTP gagal: ${httpErr.message}`);
    }

  } catch (error: any) {
    console.log("\n==========================================");
    console.log("❌ GAGAL MENGUNGGAH KE CLOUDFLARE R2");
    console.log("==========================================");
    console.log(`Pesan Error : ${error.message}`);
    if (error.$metadata) {
      console.log(`HTTP Status : ${error.$metadata.httpStatusCode}`);
    }
    console.log("==========================================");
    console.log("\n💡 TIPS SOLUSI:");
    if (error.$metadata?.httpStatusCode === 404) {
      console.log("👉 Error 404 (Bucket Not Found): Nama bucket pada R2_BUCKET_NAME di backend/.env tidak persis sama dengan nama bucket di Cloudflare Dashboard R2.");
    } else if (error.$metadata?.httpStatusCode === 403) {
      console.log("👉 Error 403 (Access Denied): R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY salah, atau Token API tidak memiliki izin 'Object Read & Write'.");
    }
    process.exit(1);
  }
}

runR2UploadTest();
