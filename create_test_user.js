import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^"|'|"$|'$/g, '');
      return [key, value];
    })
);

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const email = `test_user_${Date.now()}@duoloot.com`;
  const password = 'TestPassword123!';

  console.log('Signing up user:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Jogador Teste',
        nickname: 'tester_pro'
      }
    }
  });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data.user?.id);
  }
}

main();
