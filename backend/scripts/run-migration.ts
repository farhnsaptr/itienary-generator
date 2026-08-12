import fs from "fs";
import path from "path";
import { supabase } from "../src/lib/supabase";

async function runMigration() {
  console.log("==========================================");
  console.log("[MIGRATION] Applying Database Schema Migration");
  console.log("==========================================");

  const sqlPath = path.resolve(__dirname, "../src/database/migration/migration_fix_activity_time_range_constraint.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log("Executing SQL statements on Supabase...");

  try {
    // Attempt 1: Using RPC exec_sql or query if available
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });
    if (!error) {
      console.log("[SUCCESS] Migration executed via RPC exec_sql!");
      console.log("==========================================");
      return;
    }
    console.log("[INFO] RPC exec_sql error/not found:", error.message);
  } catch (e: any) {
    console.log("[INFO] RPC exception:", e.message);
  }

  // Attempt 2: Direct REST SQL endpoint with Service Role Key
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey!,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (res.ok) {
      console.log("[SUCCESS] Migration executed successfully via REST!");
      return;
    }

    const resText = await res.text();
    console.log(`[INFO] REST SQL endpoint status ${res.status}:`, resText);
  } catch (err: any) {
    console.log("[INFO] REST SQL exception:", err.message);
  }

  console.log("\n==========================================");
  console.log("[NOTICE] Supabase requires raw SQL migrations to be executed via SQL Editor.");
  console.log("SQL script path: backend/src/database/migration/migration_add_user_code_and_invitations.sql");
  console.log("==========================================");
}

runMigration();
