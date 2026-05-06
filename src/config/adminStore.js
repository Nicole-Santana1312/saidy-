const bcrypt = require("bcrypt");
const env = require("./env");
const { getSupabase } = require("./database");

const SALT_ROUNDS = 12;

let adminUser = null;

const ADMIN_SELECT =
  "id, email, password_hash, role, creado_en, actualizado_en";

async function initializeAdmin() {
  try {
    const supabase = getSupabase();

    // Check if admin already exists
    const { data: admins, error } = await supabase
      .from("admins")
      .select(ADMIN_SELECT)
      .eq("email", env.adminEmail)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is expected if admin doesn't exist yet
      console.error("Error checking admin:", error);
      return;
    }

    if (!admins) {
      // Create admin if doesn't exist
      const passwordHash = await bcrypt.hash(env.adminPassword, SALT_ROUNDS);
      const { data: newAdmin, error: insertError } = await supabase
        .from("admins")
        .insert([
          {
            email: env.adminEmail,
            password_hash: passwordHash,
            role: "super_admin",
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating admin:", insertError);
        return;
      }

      adminUser = newAdmin;
    } else if (admins.role !== "super_admin") {
      const { data: promotedAdmin, error: updateError } = await supabase
        .from("admins")
        .update({ role: "super_admin", actualizado_en: new Date().toISOString() })
        .eq("id", admins.id)
        .select(ADMIN_SELECT)
        .single();

      if (updateError) {
        console.error("Error promoting initial admin:", updateError);
        adminUser = admins;
        return;
      }

      adminUser = promotedAdmin;
    } else {
      adminUser = admins;
    }
  } catch (error) {
    console.error("Error initializing admin:", error);
  }
}

async function findAdminByEmail(email) {
  try {
    const supabase = getSupabase();
    const { data: admin, error } = await supabase
      .from("admins")
      .select(ADMIN_SELECT)
      .eq("email", email.toLowerCase())
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error finding admin:", error);
      return null;
    }

    if (!admin) {
      return null;
    }

    if (admin.email.toLowerCase() === env.adminEmail.toLowerCase()) {
      return { ...admin, role: "super_admin" };
    }

    return admin;
  } catch (error) {
    console.error("Error finding admin by email:", error);
    return null;
  }
}

async function listAdmins() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("admins")
    .select("id, email, role, creado_en, actualizado_en")
    .order("creado_en", { ascending: false });

  if (error) {
    throw new Error(`Error listing admins: ${error.message}`);
  }

  return data || [];
}

async function findAdminById(id) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("admins")
    .select("id, email, role, creado_en, actualizado_en")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error finding admin: ${error.message}`);
  }

  return data || null;
}

async function createAdmin(adminData) {
  const supabase = getSupabase();
  const passwordHash = await bcrypt.hash(adminData.password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from("admins")
    .insert([
      {
        email: adminData.email.toLowerCase(),
        password_hash: passwordHash,
        role: adminData.role || "admin",
      },
    ])
    .select("id, email, role, creado_en, actualizado_en")
    .single();

  if (error) {
    throw new Error(`Error creating admin: ${error.message}`);
  }

  return data;
}

async function deleteAdmin(id) {
  const supabase = getSupabase();

  const { error } = await supabase.from("admins").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting admin: ${error.message}`);
  }

  return true;
}

module.exports = {
  initializeAdmin,
  findAdminByEmail,
  listAdmins,
  findAdminById,
  createAdmin,
  deleteAdmin,
};
