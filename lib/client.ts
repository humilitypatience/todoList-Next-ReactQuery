import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL: any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY: any = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export { client as supabaseClient };