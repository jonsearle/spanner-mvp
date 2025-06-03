'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
// import { createBooking } from '@/lib/api/bookings'; // No longer used on client

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
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6edf4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0c151d]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path></svg>
            </div>
            <h2 className="text-[#0c151d] text-lg font-bold leading-tight tracking-[-0.015em]">Spanner</h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#0c151d] tracking-light text-[32px] font-bold leading-tight min-w-72">When would you like to book?</p>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {days.map(date => {
                const isBooked = bookedDates.includes(date);
                const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
                return (
                  <button
                    key={date}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 ${isBooked ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#e6edf4] text-[#0c151d] hover:bg-[#d1dce8]'}`}
                    disabled={isBooked || loading}
                    onClick={() => handleBook(date)}
                  >
                    <p className="text-lg font-medium leading-normal">{isBooked ? `${dayName} - Unavailable` : dayName}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#e6edf4] text-[#0c151d] text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleClear}
                disabled={loading}
              >
                <span className="truncate">Clear</span>
              </button>
            </div>
            {message && <div className="mt-4 text-center text-lg font-semibold">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
} 