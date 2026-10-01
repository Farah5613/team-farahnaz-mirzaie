import Image from 'next/image';
import InsertCar from './components/InsertCar';

type Car = {
  _id?: string;
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
            <div key={car._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={car.image}
                  alt={car.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              </div>

              <div className="p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{car.title}</h2>
                <p className="text-gray-600 text-sm">{car.description}</p>

                <div className="flex items-center justify-end gap-2 mt-4">
                  <button 
                    onClick={async () => {
                      const newTitle = prompt("Enter new title:", car.title);
                      const newDescription = prompt("Enter new description:", car.description);
                      
                      if (newTitle && newDescription) {
                        await fetch(`http://localhost:3000/api/cars/${car._id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            title: newTitle,
                            description: newDescription,
                            image: car.image,
                            _rev: car._rev
                          }),
                        });
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>

                  <button 
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this car?")) {
                        await fetch(`http://localhost:3000/api/cars/${car._id}`, {
                          method: 'DELETE',
                        });
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}