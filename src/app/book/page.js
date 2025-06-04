'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
// import { createBooking } from '@/lib/api/bookings'; // No longer used on client
import Image from 'next/image';
import Link from 'next/link';

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return days;
}

export default function BookPage() {
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const days = getNext7Days();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('date');
      if (error) {
        setMessage('Error loading bookings');
        setBookedDates([]);
      } else {
        setBookedDates(data.map(b => b.date));
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleBook = async (date) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Booking failed');
      setMessage(`Booking confirmed for ${date}!`);
      setBookedDates(prev => [...prev, date]);
    } catch (error) {
      setMessage('Booking failed.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase
      .from('bookings')
      .delete()
      .not('id', 'is', null); // proper "delete all"
    if (error) {
      setMessage('Failed to clear bookings.');
    } else {
      setMessage('All bookings cleared.');
      setBookedDates([]);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#d14f3f] overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6edf4] px-10 py-3">
        <div className="flex items-center gap-4 text-[#0c151d]">
          <Image src="/spannr-logo.png" alt="spannr logo" width={36} height={36} />
          <h2 className="text-[#fff7e6] text-lg font-bold leading-tight tracking-[-0.015em]">Spannr</h2>
        </div>
        <Link href="/" className="text-[#fff7e6] text-sm font-semibold hover:underline">Home</Link>
      </header>
      <div className="flex flex-col items-center flex-1 px-4 py-12">
        <div className="w-full max-w-2xl bg-white shadow rounded-lg p-8 mt-8">
          <h1 className="text-2xl font-bold mb-6 text-[#d14f3f]">When would you like to book?</h1>
          <div className="flex gap-3 p-3 flex-wrap pr-4 mb-6">
            {days.map(date => {
              const isBooked = bookedDates.includes(date);
              const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
              return (
                <button
                  key={date}
                  className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-6 pr-6 ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-[#222] hover:bg-gray-200'} text-lg font-bold`}
                  disabled={isBooked || loading}
                  onClick={() => handleBook(date)}
                >
                  {isBooked ? `${dayName} - Unavailable` : dayName}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-gray-100 text-[#222] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200"
              onClick={handleClear}
              disabled={loading}
            >
              <span className="truncate">Clear</span>
            </button>
          </div>
          {message && <div className="mt-4 text-center text-lg font-semibold text-[#d14f3f]">{message}</div>}
        </div>
      </div>
    </div>
  );
} 