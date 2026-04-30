import { type JSX } from "react";
import { IconDoor, IconEdit, IconPlus } from "@tabler/icons-react";
import TableCard from "../Table/TableCard";
import type { Lobby, TableData, UserRole } from "../../types";

interface LobbyCardProps {
  lobby: Lobby;
  tables: TableData[];
  role: UserRole | null;
  onEditLobby: (lobby: Lobby) => void;
  onEditTable: (table: TableData) => void;
  onStatusChange: (
    id: string,
    status: "available" | "occupied",
    reserved: boolean,
  ) => void;
  onAddTable: (lobbyId: string) => void;
}

export default function LobbyCard({
  lobby,
  tables,
  role,
  onEditLobby,
  onEditTable,
  onStatusChange,
  onAddTable,
}: LobbyCardProps): JSX.Element {
  const lobbyTables = tables.filter((t) => t.lobby_id === lobby.id);
  const isEditor = role === "editor";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconDoor size={18} className="text-gray-500" />
          <h2 className="font-semibold text-gray-800">{lobby.name}</h2>
          <span className="text-xs text-gray-400">
            {lobbyTables.length} meja
          </span>
        </div>
        <div className="flex gap-2">
          {isEditor && (
            <>
              <button
                onClick={() => onAddTable(lobby.id)}
                className="text-gray-400 hover:text-green-600 text-sm"
              >
                <IconPlus size={16} />
              </button>
              <button
                onClick={() => onEditLobby(lobby)}
                className="text-gray-400 hover:text-blue-600 text-sm"
              >
                <IconEdit size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {lobbyTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            role={role}
            onEdit={onEditTable}
            onStatusChange={onStatusChange}
          />
        ))}
        {lobbyTables.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-sm py-4">
            Belum ada meja. {isEditor && "Klik + untuk menambah"}
          </div>
        )}
      </div>
    </div>
  );
}
