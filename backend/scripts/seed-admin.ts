import bcrypt from "bcrypt";
import { supabase } from "../src/lib/supabase";
import { env } from "../src/config/env";

async function seedAdmin() {
  console.log("==========================================");
  console.log("[SEEDER] Administrator Account Setup");
  console.log("==========================================");
  console.log(`Username Target : ${env.ADMIN_USERNAME}`);
  console.log(`Email Target    : ${env.ADMIN_EMAIL}`);

  try {
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id, username, email, role, is_active, user_code")
      .or(`username.eq.${env.ADMIN_USERNAME},email.eq.${env.ADMIN_EMAIL}`)
      .maybeSingle();

    if (findError) {
      console.error("[ERROR] Failed to query existing users:", findError.message);
      process.exit(1);
    }

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

    if (existingUser) {
      console.log(`\n[INFO] User with username '${existingUser.username}' / email '${existingUser.email}' already exists.`);
      
      const { data: updatedAdmin, error: updateError } = await supabase
        .from("users")
        .update({
          role: "admin",
          password_hash: passwordHash,
          is_active: true,
        })
        .eq("id", existingUser.id)
        .select("id, username, email, role, is_active, user_code")
        .single();

      if (updateError) {
        console.error("[ERROR] Failed to update admin user:", updateError.message);
        process.exit(1);
      }

      console.log("==========================================");
      console.log("[SUCCESS] Existing account updated to Admin!");
      console.log(`User ID   : ${updatedAdmin.id}`);
      console.log(`User Code : ${updatedAdmin.user_code || "N/A"}`);
      console.log(`Username  : ${updatedAdmin.username}`);
      console.log(`Email     : ${updatedAdmin.email}`);
      console.log(`Role      : ${updatedAdmin.role}`);
      console.log("==========================================");
      return;
    }

    const { data: newAdmin, error: insertError } = await supabase
      .from("users")
      .insert({
        username: env.ADMIN_USERNAME,
        email: env.ADMIN_EMAIL,
        password_hash: passwordHash,
        full_name: "System Administrator",
        role: "admin",
        is_active: true,
      })
      .select("id, username, email, role, is_active, user_code")
      .single();

    if (insertError || !newAdmin) {
      console.error("[ERROR] Failed to create Admin account:", insertError?.message);
      process.exit(1);
    }

    console.log("==========================================");
    console.log("[SUCCESS] New Admin account created!");
    console.log(`User ID   : ${newAdmin.id}`);
    console.log(`User Code : ${newAdmin.user_code}`);
    console.log(`Username  : ${newAdmin.username}`);
    console.log(`Email     : ${newAdmin.email}`);
    console.log(`Role      : ${newAdmin.role}`);
    console.log("==========================================");

  } catch (err: any) {
    console.error("[FATAL ERROR] Admin seeder execution failed:", err.message);
    process.exit(1);
  }
}

seedAdmin();
