// app/page.tsx
import InsertCar from './components/InsertCar';
import CarCard from './components/CarCard';

type Car = {
  _id?: string;
  id?: string;
  key?: string;
  _rev?: string;
  title: string;
  description: string;
  image: string;
};

async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch('http://localhost:3000/api/cars', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch cars: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('getCars error:', error);
    return [];
  }
}

export default async function Home() {
  const carsData = await getCars();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Luxury & Sports Car Gallery</h1>
          <InsertCar />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {carsData.map((car) => (
            <CarCard key={car._id || car.id || car.key} car={car} />
          ))}
        </div>
      </div>
    </main>
  );
}
