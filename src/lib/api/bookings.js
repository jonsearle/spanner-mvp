import { supabase } from '@/lib/supabaseClient';
import { sendConfirmationEmail } from '@/lib/email/sendConfirmation';


export async function createBooking({ date }) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ date }])
    .select()
    .single();

  if (error) throw error;

  console.log('Booking insert succeeded')

  await sendConfirmationEmail(date);
  return data;
} 