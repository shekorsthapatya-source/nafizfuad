import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const CONFIRM_TEXT = "I wanna delete this";

const DeleteConfirmDialog = ({ open, onClose, onConfirm, itemName }: DeleteConfirmDialogProps) => {
  const [input, setInput] = useState("");

  const handleConfirm = () => {
    if (input === CONFIRM_TEXT) {
      onConfirm();
      setInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setInput(""); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete "{itemName}"?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Type <strong className="text-foreground">{CONFIRM_TEXT}</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={CONFIRM_TEXT}
            className="w-full px-3 py-2 bg-transparent border border-border rounded text-foreground focus:border-destructive focus:outline-none text-sm"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { onClose(); setInput(""); }}
              className="px-4 py-2 border border-border text-sm rounded hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={input !== CONFIRM_TEXT}
              className="px-4 py-2 bg-destructive text-destructive-foreground text-sm rounded hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
