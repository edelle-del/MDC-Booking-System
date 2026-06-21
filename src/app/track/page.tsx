'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';

function TrackContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async (id: string) => {
    setIsSearching(true);
    setError(null);
    setBooking(null);

    try {
      const { data, error: sbError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (sbError) {
        if (sbError.code === 'PGRST116') {
          setError("No booking found with this ID.");
        } else if (sbError.message.includes('fetch')) {
          // Mock data for demo if no backend connected
          if (id.startsWith('mock')) {
             setBooking({
                id: id,
                event_name: 'Mock Event',
                status: 'pending',
                created_at: new Date().toISOString()
             });
          } else {
              setError("Database connection error.");
          }
        } else {
          throw sbError;
        }
      } else {
        setBooking(data);
      }
    } catch (err: any) {
      setError("An error occurred while fetching status.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('id')) {
      fetchStatus(searchParams.get('id')!);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      fetchStatus(trackingId.trim());
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-xl text-center">
        <h1 className="text-4xl font-bold mb-sm tracking-tighter">Track Request</h1>
        <p className="text-secondary">Enter your Tracking ID to view the real-time status of your proposal.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-sm mb-xl">
        <input 
          type="text" 
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID..." 
          className="input-field flex-1 font-mono text-sm"
          required
        />
        <button type="submit" disabled={isSearching} className="btn btn-primary">
          {isSearching ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-md rounded-md mb-lg text-sm text-center">
          {error}
        </div>
      )}

      {booking && (
        <div className="card animate-fade-in">
          <div className="flex justify-between items-start border-b border-gray-800 pb-md mb-md">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-xs">Event Name</p>
              <h2 className="text-xl font-bold">{booking.event_name}</h2>
            </div>
            <span className={`badge badge-${booking.status}`}>
              {booking.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-md text-sm">
            <div>
              <p className="text-muted mb-xs">Submitted On</p>
              <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted mb-xs">Tracking ID</p>
              <p className="font-mono text-xs truncate" title={booking.id}>{booking.id.substring(0,8)}...</p>
            </div>
          </div>
          
          {booking.status === 'pending' && (
            <div className="mt-md p-sm bg-tertiary rounded-md text-sm text-secondary text-center border border-gray-800">
              Your proposal is currently in the queue for board review.
            </div>
          )}
          {booking.status === 'approved' && (
            <div className="mt-md p-sm bg-green-900/20 rounded-md text-sm text-green-200 text-center border border-green-800/50">
              Congratulations! Your proposal has been approved. An officer will contact you shortly to coordinate.
            </div>
          )}
          {booking.status === 'declined' && (
            <div className="mt-md p-sm bg-tertiary rounded-md text-sm text-secondary text-center border border-gray-800">
              Unfortunately, we cannot accept this booking due to schedule conflicts or misalignment with our current priorities.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <main className="min-h-screen container py-xl animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-lg mb-lg">
        <Link href="/" className="text-secondary hover:text-white text-sm flex items-center gap-sm transition-fast">
          &larr; Back to Home
        </Link>
      </div>
      <Suspense fallback={<div className="text-secondary">Loading tracking module...</div>}>
        <TrackContent />
      </Suspense>
    </main>
  );
}
