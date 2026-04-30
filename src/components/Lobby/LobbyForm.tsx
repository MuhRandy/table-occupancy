import { useState, useEffect } from "react";
import { IconX } from "@tabler/icons-react";

export default function LobbyForm({ isOpen, editLobby, onClose, onSave }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editLobby) {
      setName(editLobby.name);
    } else {
      setName("");
    }
  }, [editLobby, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editLobby) {
      onSave(editLobby.id, name.trim());
    } else {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">
            {editLobby ? "Edit Lobi" : "Tambah Lobi Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Lobi"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
            autoFocus
            required
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-xl py-2 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
