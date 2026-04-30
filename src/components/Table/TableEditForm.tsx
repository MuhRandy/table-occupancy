import { useState, useEffect } from "react";
import { IconX, IconTrash } from "@tabler/icons-react";
import type { Lobby, TableData } from "../../types";

interface TableEditFormProps {
  isOpen: boolean;
  table: TableData | null;
  lobbies: Lobby[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<TableData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TableEditForm({
  isOpen,
  table,
  lobbies,
  onClose,
  onSave,
  onDelete,
}: TableEditFormProps) {
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState(4);
  const [lobbyId, setLobbyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (table && isOpen) {
      setNumber(table.number);
      setSeats(table.seats);
      setLobbyId(table.lobby_id);
    }
  }, [table, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!table) return;
    if (!number.trim()) return;

    setLoading(true);
    try {
      await onSave(table.id, {
        number: number.trim(),
        seats,
        lobby_id: lobbyId,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!table) return;
    setLoading(true);
    try {
      await onDelete(table.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">✏️ Edit Meja</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Lobi
            </label>
            <select
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            >
              {lobbies.map((lobby) => (
                <option key={lobby.id} value={lobby.id}>
                  {lobby.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Meja
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Kursi
            </label>
            <input
              type="number"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              min={1}
              max={20}
              className="w-full border border-gray-300 rounded-xl px-4 py-2"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-xl py-2 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm py-2"
              >
                <IconTrash size={16} />
                Hapus Meja
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-600 text-center">
                  Yakin ingin menghapus meja ini? Tindakan ini tidak dapat
                  dibatalkan.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border border-gray-300 rounded-lg py-1.5 text-sm hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white rounded-lg py-1.5 text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Menghapus..." : "Ya, Hapus"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
