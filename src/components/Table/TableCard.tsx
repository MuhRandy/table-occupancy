import {
  IconEdit,
  IconTrash,
  IconUsers,
  IconArmchair,
  IconCalendar,
} from "@tabler/icons-react";
import type { TableData, UserRole } from "../../types";

interface TableCardProps {
  table: TableData;
  role: UserRole | null;
  onEdit: () => void;
  onDelete: () => void; // ← PERBAIKAN: tambahkan prop onDelete
  onStatusChange: (
    id: string,
    status: "available" | "occupied",
    reserved: boolean,
  ) => void;
}

export default function TableCard({
  table,
  role,
  onEdit,
  onDelete,
  onStatusChange,
}: TableCardProps) {
  const getStatusInfo = () => {
    if (table.reserved)
      return {
        text: "Dipesan",
        color: "bg-purple-100 text-purple-700",
        icon: <IconCalendar size={14} className="mr-1" />,
      };
    if (table.status === "occupied")
      return {
        text: "Terisi",
        color: "bg-orange-100 text-orange-700",
        icon: <IconUsers size={14} className="mr-1" />,
      };
    return {
      text: "Kosong",
      color: "bg-green-100 text-green-700",
      icon: <IconArmchair size={14} className="mr-1" />,
    };
  };

  const statusInfo = getStatusInfo();
  const isEditor = role === "editor";
  const isHelper = role === "helper";

  return (
    <div
      className={`bg-gray-50 rounded-xl p-3 border shadow-sm transition-all hover:shadow-md ${table.reserved ? "border-purple-300" : table.status === "occupied" ? "border-orange-300" : "border-gray-200"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-gray-800">Meja {table.number}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <IconUsers size={12} /> {table.seats} kursi
          </div>
        </div>
        {/* ========== PERBAIKAN: Tambahkan tombol edit dan delete untuk editor ========== */}
        {isEditor && (
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-600"
            >
              <IconEdit size={14} />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <IconTrash size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-2 flex-wrap gap-1">
        <span
          className={`text-xs px-2 py-0.5 rounded-full flex items-center ${statusInfo.color}`}
        >
          {statusInfo.icon}
          {statusInfo.text}
        </span>

        {isHelper && !table.reserved && table.status === "available" && (
          <div className="flex gap-1">
            <button
              onClick={() => onStatusChange(table.id, "occupied", false)}
              className="text-xs px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600"
            >
              Isi Meja
            </button>
            <button
              onClick={() => onStatusChange(table.id, "available", true)}
              className="text-xs px-2 py-1 rounded bg-purple-500 text-white hover:bg-purple-600"
            >
              Pesan
            </button>
          </div>
        )}

        {isHelper && table.status === "occupied" && !table.reserved && (
          <button
            onClick={() => onStatusChange(table.id, "available", false)}
            className="text-xs px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Kosongkan
          </button>
        )}

        {isHelper && table.reserved && (
          <button
            onClick={() => onStatusChange(table.id, "available", false)}
            className="text-xs px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Batalkan Pesanan
          </button>
        )}
      </div>
    </div>
  );
}
