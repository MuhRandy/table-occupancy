import { useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import { useLobbies } from "../hooks/useLobbies";
import { useTables } from "../hooks/useTables";
import LobbyCard from "../components/Lobby/LobbyCard";
import LobbyForm from "../components/Lobby/LobbyForm";
import TableForm from "../components/Table/TableForm";
import TableEditForm from "../components/Table/TableEditForm";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import EmptyState from "../components/Common/EmptyState";
import type { Lobby, TableData } from "../types";

export default function Dashboard() {
  const { userRole, signOut } = useAuth();
  const {
    lobbies,
    loading: lobbiesLoading,
    addLobby,
    updateLobby,
    deleteLobby,
  } = useLobbies();
  const {
    tables,
    loading: tablesLoading,
    addTable,
    updateTable,
    updateTableStatus,
    deleteTable,
  } = useTables();

  const [showLobbyForm, setShowLobbyForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showEditTableForm, setShowEditTableForm] = useState(false);
  const [editingLobby, setEditingLobby] = useState<Lobby | null>(null);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [selectedLobbyId, setSelectedLobbyId] = useState<string | undefined>();

  const isLoading = lobbiesLoading || tablesLoading;

  // ========== PERBAIKAN: Handler untuk update dan delete ==========
  const handleUpdateLobby = async (id: string, name: string) => {
    await updateLobby(id, name);
  };

  const handleDeleteLobby = async (id: string) => {
    if (
      confirm(
        "Yakin ingin menghapus lobi ini? Semua meja di dalamnya juga akan terhapus.",
      )
    ) {
      await deleteLobby(id);
    }
  };

  const handleAddTable = async (data: any) => {
    await addTable(data);
  };

  const handleUpdateTable = async (id: string, updates: Partial<TableData>) => {
    await updateTable(id, updates);
  };

  const handleDeleteTable = async (id: string) => {
    if (confirm("Yakin ingin menghapus meja ini?")) {
      await deleteTable(id);
    }
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case "editor":
        return {
          text: "🚀 Editor: Anda dapat menambah / edit / hapus lobi & meja, serta mengubah status meja.",
          color: "border-blue-500",
        };
      case "helper":
        return {
          text: "🛠️ Helper: Anda hanya dapat mengubah status meja (terisi / kosong / dipesan).",
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm"
          >
            + Tambah Lobi
          </button>
          <button
            onClick={() => setShowTableForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm"
          >
            + Tambah Meja
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
              onEditLobby={(lobby) => {
                setEditingLobby(lobby);
                setShowLobbyForm(true);
              }}
              onDeleteLobby={handleDeleteLobby}
              onEditTable={(table) => {
                setEditingTable(table);
                setShowEditTableForm(true);
              }}
              onDeleteTable={handleDeleteTable}
              onStatusChange={updateTableStatus}
              onAddTable={(lobbyId) => {
                setSelectedLobbyId(lobbyId);
                setShowTableForm(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <LobbyForm
        isOpen={showLobbyForm}
        editLobby={editingLobby}
        onClose={() => {
          setShowLobbyForm(false);
          setEditingLobby(null);
        }}
        onSave={editingLobby ? handleUpdateLobby : addLobby}
      />
      <TableForm
        isOpen={showTableForm}
        lobbies={lobbies}
        preselectedLobbyId={selectedLobbyId}
        onClose={() => {
          setShowTableForm(false);
          setSelectedLobbyId(undefined);
        }}
        onSave={handleAddTable}
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
