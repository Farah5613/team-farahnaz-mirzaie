'use client';

import { Car } from '@/lib/types';
import { useEffect, useState } from 'react';
import InsertCar from './components/InsertCar';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State to manage the editing state (currently editing car)
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Function to fetch cars (Read)
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) {
        throw new Error(`Failed to fetch cars: ${res.status}`);
      }
      const data = await res.json();
      setCars(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCars = async () => {
      await fetchCars(); // This line should be inside the function
    };
    loadCars(); // Here we execute the function
  }, []);

  // Function to delete a car (Delete)
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete car');
      }
      fetchCars();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  // Function to select a car for editing (Update)
  const handleEdit = (car: Car) => {
    setEditingCar(car);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSuccess = () => {
    setEditingCar(null);
    fetchCars();
  };

  if (loading) return <div className="p-8 text-center">Loading cars...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Luxury & Sports Car Gallery</h1>

      {/* Car registration or editing form */}
      <div className="mb-8">
        <InsertCar
          car={editingCar}
          onUpdateSuccess={handleUpdateSuccess}
          onAddSuccess={fetchCars}
        />
      </div>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500">No cars found in the database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cars.map((car: Car) => (
            <div
              key={car._id || car.id}
              className="border p-4 rounded-lg shadow bg-white group hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Edit and delete buttons on the card */}
              <div className="absolute top-3 right-3 flex gap-2 bg-white/80 p-1 rounded-md shadow-sm">
                <button
                  onClick={() => handleEdit(car)}
                  className="px-2.5 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(String(car._id || car.id))}
                  className="px-2.5 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
              {car.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}

              <h2 className="text-xl font-semibold text-gray-800">{car.title}</h2>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{car.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
