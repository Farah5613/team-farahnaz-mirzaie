'use client';

import { FormEvent, useState } from 'react';

export default function InsertCar() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create car');
      }

      setTitle('');
      setDescription('');
      setImage('');
      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to create car');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
      >
        Insert a Car
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Insert a Car</h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Car title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={4}
                className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
              />

              <input
                type="url"
                placeholder="Image URL"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                required
                className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Inserting...' : 'Insert Car'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
