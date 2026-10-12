'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function ModalPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">صفحه Modal</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button>باز کردن مودال</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>سلام!</DialogTitle>
            <DialogDescription>این یک مودال ساخته‌شده با shadcn هست.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
