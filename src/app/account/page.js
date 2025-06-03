'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Garage Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Business Hours & Booking Slots</h2>
          
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="border-b pb-4 last:border-b-0">
                <h3 className="font-medium mb-3">{day}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Open Time
                    </label>
                    <input
                      type="time"
                      value={businessHours[day].openTime}
                      onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
  