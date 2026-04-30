import { useState } from "react";
import { IconPlus, IconLogout } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useLobbies } from "../hooks/useLobbies";
import { useTables } from "../hooks/useTables";
import LobbyCard from "../components/Lobby/LobbyCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import EmptyState from "../components/Common/EmptyState";
import type { Lobby, TableData } from "../types";
import TableEditForm from "../components/Table/TableEditForm";

// Komponen modal sederhana (bisa dipisah ke file terpisah)
function LobbyModal({
  isOpen,
  onClose,
  onSave,
  initialName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
}) {
  const [name, setName] = useState(initialName || "");
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">
            {initialName ? "Edit Lobi" : "Tambah Lobi"}
          </h2>
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

function TableFormModal({
  isOpen,
  onClose,
  onSave,
  lobbies,
  preselectedLobbyId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lobbies: Lobby[];
  preselectedLobbyId?: string;
}) {
  const [lobbyId, setLobbyId] = useState(
    preselectedLobbyId || lobbies[0]?.id || "",
  );
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState(4);
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;
    onSave({
      lobby_id: lobbyId,
      number: number.trim(),
      seats,
      status: "available",
      reserved: false,
    });
    setNumber("");
    setSeats(4);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Tambah Meja</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <select
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          >
            {lobbies.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Nomor Meja"
            className="w-full border rounded-xl px-4 py-2"
            required
          />
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value))}
            className="w-full border rounded-xl px-4 py-2"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-xl py-2"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-xl py-2"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { userRole, signOut } = useAuth();
  const {
    lobbies,
    loading: lobbiesLoading,
    addLobby,
    updateLobby,
  } = useLobbies();
  const {
    tables,
    loading: tablesLoading,
    addTable,
    updateTable,
    updateTableStatus,
    deleteTable,
  } = useTables(userRole);

  const [showLobbyForm, setShowLobbyForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingLobby, setEditingLobby] = useState<Lobby | null>(null);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [selectedLobbyId, setSelectedLobbyId] = useState<string | undefined>();
  const [showEditTableForm, setShowEditTableForm] = useState(false);

  const isLoading = lobbiesLoading || tablesLoading;

  const handleEditLobby = (lobby: Lobby) => {
    setEditingLobby(lobby);
    setShowLobbyForm(true);
  };

  const handleSaveLobby = async (name: string) => {
    if (editingLobby) {
      await updateLobby(editingLobby.id, name);
      setEditingLobby(null);
    } else {
      await addLobby(name);
    }
    setShowLobbyForm(false);
  };

  const handleAddTable = async (data: any) => {
    await addTable(data);
    setShowTableForm(false);
    setSelectedLobbyId(undefined);
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case "editor":
        return {
          text: "🚀 Editor: Anda dapat menambah / edit lobi & meja, serta memindahkan meja antar lobi.",
          color: "border-blue-500",
        };
      case "helper":
        return {
          text: "🛠️ Helper: Anda dapat mengubah status meja (terisi / kosong / dipesan).",
          color: "border-green-500",
        };
      default:
        return {
          text: "👀 Umum: Anda hanya dapat melihat, tidak dapat mengubah apapun.",
          color: "border-gray-500",
        };
    }
  };
  const roleInfo = getRoleInfo();

  if (isLoading) return <LoadingSpinner />;

  // Handler untuk update table
  const handleUpdateTable = async (id: string, updates: Partial<TableData>) => {
    await updateTable(id, updates);
    setShowEditTableForm(false);
    setEditingTable(null);
  };

  // Handler untuk delete table
  const handleDeleteTable = async (id: string) => {
    await deleteTable(id);
    setShowEditTableForm(false);
    setEditingTable(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🍜 Gacoan · Table Occupancy
          </h1>
          <p className="text-gray-500 text-sm">
            BJMAHM System — Kelola meja & lobi
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-gray-100 rounded-xl px-4 py-2 text-sm flex items-center gap-2">
            <span className="font-medium">
              {userRole === "editor"
                ? "Editor Mode"
                : userRole === "helper"
                  ? "Helper Mode"
                  : "Umum Mode"}
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-red-500 text-sm hover:underline"
          >
            <IconLogout size={16} /> Logout
          </button>
        </div>
      </div>

      <div
        className={`bg-blue-50 border-l-4 ${roleInfo.color} p-3 rounded-r-xl mb-6 text-sm`}
      >
        <span>{roleInfo.text}</span>
      </div>

      {userRole === "editor" && (
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setEditingLobby(null);
              setShowLobbyForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <IconPlus size={16} /> Tambah Lobi
          </button>
          <button
            onClick={() => setShowTableForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <IconPlus size={16} /> Tambah Meja
          </button>
        </div>
      )}

      {lobbies.length === 0 ? (
        <EmptyState
          icon="🏠"
          title="Belum ada lobi"
          description={
            userRole === "editor"
              ? 'Klik tombol "Tambah Lobi" untuk memulai'
              : "Belum ada data, hubungi editor untuk menambahkan lobi"
          }
        />
      ) : (
        <div className="space-y-6">
          {lobbies.map((lobby) => (
            <LobbyCard
              key={lobby.id}
              lobby={lobby}
              tables={tables}
              role={userRole}
              onEditLobby={handleEditLobby}
              onEditTable={setEditingTable}
              onStatusChange={updateTableStatus}
              onAddTable={(lobbyId) => {
                setSelectedLobbyId(lobbyId);
                setShowTableForm(true);
              }}
            />
          ))}
        </div>
      )}

      <LobbyModal
        isOpen={showLobbyForm}
        onClose={() => {
          setShowLobbyForm(false);
          setEditingLobby(null);
        }}
        onSave={handleSaveLobby}
        initialName={editingLobby?.name}
      />
      <TableFormModal
        isOpen={showTableForm}
        onClose={() => {
          setShowTableForm(false);
          setSelectedLobbyId(undefined);
        }}
        onSave={handleAddTable}
        lobbies={lobbies}
        preselectedLobbyId={selectedLobbyId}
      />
      <TableEditForm
        isOpen={showEditTableForm}
        table={editingTable}
        lobbies={lobbies}
        onClose={() => {
          setShowEditTableForm(false);
          setEditingTable(null);
        }}
        onSave={handleUpdateTable}
        onDelete={handleDeleteTable}
      />
    </div>
  );
}
