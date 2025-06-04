'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import Link from 'next/link';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function AccountPage() {
  const [businessHours, setBusinessHours] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: {
        openTime: '09:00',
        closeTime: '17:00',
        slotCount: 8,
      },
    }), {})
  );

  const handleTimeChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Attempting to save settings:', {
        email: 'test@example.com',
        hours: businessHours
      });

      const { data, error } = await supabase
        .from('garage_settings')
        .upsert({
          email: 'test@example.com',
          hours: businessHours
        })
        .select();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Success! Saved data:', data);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Error saving settings: ${error.message}`);
    }
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
          <h1 className="text-2xl font-bold mb-6 text-[#d14f3f]">Garage Settings</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[#d14f3f]">Business Hours & Booking Slots</h2>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-3 text-[#d14f3f]">{day}</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Open Time
                        </label>
                        <input
                          type="time"
                          value={businessHours[day].openTime}
                          onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#d14f3f] focus:ring-[#d14f3f]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Close Time
                        </label>
                        <input
                          type="time"
                          value={businessHours[day].closeTime}
                          onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#d14f3f] focus:ring-[#d14f3f]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Daily Slots
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={businessHours[day].slotCount}
                          onChange={(e) => handleTimeChange(day, 'slotCount', parseInt(e.target.value))}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#d14f3f] focus:ring-[#d14f3f]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#d14f3f] text-white px-6 py-2 rounded-full font-bold hover:bg-[#b53e2e] focus:outline-none focus:ring-2 focus:ring-[#d14f3f] focus:ring-offset-2 transition"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
  