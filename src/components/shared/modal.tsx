"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Modal = ({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: ModalProps) => {
  useEffect(() => {
    return () => {
      const body = document.body;

      // clear inline style
      body.removeAttribute("style");

      // fallback เผื่อยังค้าง
      body.style.overflow = "auto";
      body.style.pointerEvents = "auto";
      body.style.position = "static";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle> {title} </DialogTitle>
          <DialogDescription> {description} </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
