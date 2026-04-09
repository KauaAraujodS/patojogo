import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function escapeCsv(value) {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function toCsv(rows) {
  const headers = [
    "id",
    "full_name",
    "email",
    "phone",
    "progress_step",
    "score",
    "created_at",
    "updated_at",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(","),
    ),
  ];

  return `${lines.join("\n")}\n`;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from("profiles")
  .select(
    "id, full_name, email, phone, progress_step, score, created_at, updated_at",
  )
  .order("created_at", { ascending: true });

if (error) {
  throw error;
}

const participants = data ?? [];
const timestamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
const exportRoot = path.resolve("exports", "participants", timestamp);
const peopleDir = path.join(exportRoot, "people");

await mkdir(peopleDir, { recursive: true });

await writeFile(
  path.join(exportRoot, "participants.json"),
  `${JSON.stringify(participants, null, 2)}\n`,
  "utf8",
);

await writeFile(
  path.join(exportRoot, "participants.csv"),
  toCsv(participants),
  "utf8",
);

for (const participant of participants) {
  const filename = `${slugify(participant.full_name) || "participant"}-${participant.id}.json`;
  await writeFile(
    path.join(peopleDir, filename),
    `${JSON.stringify(participant, null, 2)}\n`,
    "utf8",
  );
}

console.log(`Exported ${participants.length} participants to ${exportRoot}`);
