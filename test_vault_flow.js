import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read Env
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
  const email = `vault_test_${Math.floor(Math.random() * 10000)}@duoloot.com`;
  const password = 'VaultPassword123!';

  console.log('1. Signing up:', email);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Vault Tester',
        nickname: 'vault_runner'
      }
    }
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    process.exit(1);
  }
  
  console.log('User signed up successfully:', authData.user?.id);
  // Wait a second for trigger to complete just in case
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n2. Fetching Active Vault Event...');
  const { data: eventData, error: eventError } = await supabase
    .from('vault_events')
    .select('*')
    .eq('status', 'active')
    .limit(1)
    .single();

  if (eventError || !eventData) {
    console.error('Event Error:', eventError?.message || 'No active event');
    process.exit(1);
  }
  console.log('Active Event Found:', eventData.title);

  console.log('\n3. Joining Vault Event...');
  const { data: joinData, error: joinError } = await supabase
    .from('vault_participants')
    .insert([{ event_id: eventData.id, player_id: authData.user.id }])
    .select()
    .single();

  if (joinError) {
    console.error('Join Error:', joinError.message);
  } else {
    console.log('Joined Vault Event successfully!');
  }

  console.log('\n4. Fetching Tasks...');
  const { data: tasksData, error: tasksError } = await supabase
    .from('vault_tasks')
    .select('*')
    .eq('event_id', eventData.id)
    .limit(1)
    .single();

  if (tasksError || !tasksData) {
    console.error('Tasks Error:', tasksError?.message || 'No tasks found');
    process.exit(1);
  }
  console.log('Task Found:', tasksData.title);

  console.log('\n5. Claiming Vault Winner (Attempt 1)...');
  const { data: claimData1, error: claimError1 } = await supabase.rpc('claim_vault_winner', {
    p_event_id: eventData.id,
    p_task_id: tasksData.id,
    p_payload: { source: 'test_script' }
  });

  if (claimError1) {
    console.error('Claim 1 Error:', claimError1.message);
  } else {
    console.log('Claim 1 Success! Response:', claimData1);
  }

  console.log('\n6. Claiming Vault Winner (Attempt 2)...');
  const { data: claimData2, error: claimError2 } = await supabase.rpc('claim_vault_winner', {
    p_event_id: eventData.id,
    p_task_id: tasksData.id,
    p_payload: { source: 'test_script_2' }
  });

  if (claimError2) {
    console.log('Claim 2 properly blocked. Error:', claimError2.message);
  } else {
    console.error('Claim 2 Success? This should not happen!', claimData2);
  }
}

main();
