'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Car } from '@/lib/types'; // The model we created

interface InsertCarProps {
  car: Car | null; // If currently editing
  onAddSuccess: () => void; // Function called after successful add (fetchCars)
  onUpdateSuccess: () => void; // Function called after successful update
}

export default function InsertCar({ car, onAddSuccess, onUpdateSuccess }: InsertCarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Car>({
    title: '',
    image: '',
    description: '',
  });

  // If a car is selected for editing, fill the form and open the modal
  useEffect(() => {
    const initializeForm = async () => {
      if (car) {
        setFormData(car);
        // We open the modal with a very small delay to avoid errors
        setTimeout(() => setIsOpen(true), 0);
      } else {
        setFormData({ title: '', image: '', description: '' });
      }
    };

    initializeForm();
  }, [car]);

  // Handle typing in fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (for both Add and Update)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = car ? 'PUT' : 'POST';
      const id = car?._id || car?.id;
      const url = car ? `/api/cars/${id}` : '/api/cars';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('A problem occurred while saving');

      // 1. Close modal (even in case of error)
      setIsOpen(false);

      // 2. Clear form
      setFormData({ title: '', image: '', description: '' });

      // 3. Call function
      if (car) {
        onUpdateSuccess();
      } else {
        onAddSuccess();
      }
    } catch (error) {
      console.error(error);
      alert('Error saving information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          {car ? 'Edit Car' : 'Add New Car'}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <div dir="ltr">
          <DialogHeader>
            <DialogTitle>{car ? 'Edit Car Information' : 'Add New Car'}</DialogTitle>
            <DialogDescription>Enter the car information to save it.</DialogDescription>
          </DialogHeader>

          {/* This section fills the form 👇 */}
          <div className="grid gap-4 py-4 text-left">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-left">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g. BMW M4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-left">
                Image URL
              </Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="col-span-3"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-left">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Enter car details..."
              />
            </div>
          </div>

          {/* Bottom section of the form 👇 */}
          <DialogFooter>
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : car ? 'Save Changes' : 'Submit'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
