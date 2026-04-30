import { useState, useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import type { Lobby, TableData } from "../../types";

interface TableFormProps {
  isOpen: boolean;
  editTable: TableData | null;
  lobbies: Lobby[];
  onClose: () => void;
  onSave: (id: string, updates: Partial<TableData>) => Promise<void>;
}

export default function TableForm({
  isOpen,
  editTable,
  lobbies,
  onClose,
  onSave,
}: TableFormProps) {
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState(4);
  const [lobbyId, setLobbyId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTable && isOpen) {
      setNumber(editTable.number);
      setSeats(editTable.seats);
      setLobbyId(editTable.lobby_id);
    }
  }, [editTable, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTable) return;
    if (!number.trim()) return;

    setLoading(true);
    try {
      await onSave(editTable.id, {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">Edit Meja</h2>
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
        </form>
      </div>
    </div>
  );
}
