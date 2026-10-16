"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Car } from "@/lib/types"; // همون تایپی که ساختیم

interface InsertCarProps {
  car: Car | null; // اگه در حالت ویرایش باشه
  onAddSuccess: () => void; // تابعی که بعد از ثبت موفق صدا زده میشه (fetchCars)
  onUpdateSuccess: () => void; // تابعی که بعد از ویرایش موفق صدا زده میشه
}

export default function InsertCar({ car, onAddSuccess, onUpdateSuccess }: InsertCarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // استیت فرم
  const [formData, setFormData] = useState<Car>({
    title: "",
    image: "",
    description: "",
  });

  // اگر خودرویی برای ویرایش انتخاب شد، فرم را پر کن و مودال را باز کن
useEffect(() => {
  const initializeForm = async () => {
    if (car) {
      setFormData(car);
      // با یک تاخیر خیلی کوچیک مودال رو باز می‌کنیم تا ارور نده
      setTimeout(() => setIsOpen(true), 0);
    } else {
      setFormData({ title: "", image: "", description: "" });
    }
  };

  initializeForm();
}, [car]);

  // هندل کردن تایپ در فیلدها
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // هندل کردن ثبت (چه برای Add و چه برای Update)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = car ? "PUT" : "POST";
      const id = car?._id || car?.id;
      const url = car ? `/api/cars/${id}` : "/api/cars";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("مشکلی در ذخیره‌سازی پیش آمد");

      // 1. بستن مودال (طبق خواسته استاد)
      setIsOpen(false);
      
      // 2. پاک کردن فرم
      setFormData({ title: "", image: "", description: "" });

      // 3. رفرش لیست
      if (car) {
        onUpdateSuccess();
      } else {
        onAddSuccess();
      }
      
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت اطلاعات");
    } finally {
      setLoading(false);
    }
  };
  return (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Button className="w-full bg-blue-600 hover:bg-blue-700">
        {car ? "ویرایش خودرو" : "افزودن خودروی جدید"}
      </Button>
    </DialogTrigger>
    
    <DialogContent className="sm:max-w-md">
      <div dir="rtl">
        <DialogHeader>
          <DialogTitle>{car ? "ویرایش اطلاعات خودرو" : "ثبت خودروی جدید"}</DialogTitle>
          <DialogDescription>
            اطلاعات خودرو را وارد کنید و دکمه ثبت را بزنید.
          </DialogDescription>
        </DialogHeader>

        {/* 👇 این بخش فرم رو دوباره اضافه کنید 👇 */}
        <div className="grid gap-4 py-4 text-right">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">عنوان</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" placeholder="مثلاً: پورشه 911" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">لینک تصویر</Label>
            <Input id="image" name="image" value={formData.image} onChange={handleChange} className="col-span-3" placeholder="https://..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">توضیحات</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" placeholder="توضیحات..." />
          </div>
        </div>
        {/* 👆 پایان بخش فرم 👆 */}

        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "در حال ذخیره..." : (car ? "ثبت ویرایش" : "ثبت نهایی")}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);
}

