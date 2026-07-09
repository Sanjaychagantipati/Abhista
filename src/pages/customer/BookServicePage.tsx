import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../services/booking/bookingService';
import { CustomerPageShell } from '../../components/customer/CustomerPageShell';

export function BookServicePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const providerId = searchParams.get('providerId') || '';
  const categoryId = Number(searchParams.get('categoryId') || 1);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await bookingApi.createBooking({
        providerId,
        categoryId,
        preferredDate: date,
        preferredTime: time,
        customerAddress: address,
        city,
        state,
        notes,
        estimatedBudget: budget ? Number(budget) : null,
      });

      setMessage(`Success! Booking request ${response.bookingNumber} created successfully.`);
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerPageShell>
      <div className="mx-auto max-w-xl bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Request Service Booking</h1>
        <p className="mt-2 text-sm text-stone-500">Provide schedule and location details for your service request.</p>

        {message && (
          <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Preferred Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Preferred Time Slot</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
            >
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Address Details</label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 104, Jubilee Hills"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Estimated Budget (Optional)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Job Notes</label>
            <textarea
              placeholder="Describe your work requirements here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow disabled:opacity-50"
          >
            {loading ? 'Submitting request...' : 'Confirm Request Booking'}
          </button>
        </form>
      </div>
    </CustomerPageShell>
  );
}
