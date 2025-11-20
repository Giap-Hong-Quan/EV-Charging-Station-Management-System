import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function ViewStation({
  open,
  onOpenChange,
  title,
  children,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>

        {/* Overlay */}
        <DialogOverlay onClick={() => onOpenChange(false)} className="fixed inset-0 animate-fadeIn z-40" />

        {/* Drawer Panel – KHÔNG DÙNG DialogContent */}
        <div
          className="
            fixed right-0 top-0 h-full bg-white shadow-xl
            animate-slideInDrawer
            w-full sm:w-[40vw] lg:w-[35vw]
            max-w-[600px]
            z-50
          "
        >
          {/* HEADER */}
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto h-[calc(100%-70px)]">
            {children}
          </div>
        </div>

      </DialogPortal>
    </Dialog>
  );
}
