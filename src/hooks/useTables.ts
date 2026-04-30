import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import type { TableData } from "../types";

export function useTables() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTables = async () => {
    const { data, error } = await supabase
      .from("tables")
      .select("*, lobbies(name)")
      .order("created_at");

    if (error) {
      toast.error("Gagal memuat meja");
      console.error(error);
    } else {
      setTables(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTables();
  }, []);

  // ========== PERBAIKAN: Tambahkan status dan reserved default ==========
  const addTable = async (
    tableData: Omit<TableData, "id" | "created_at" | "updated_at">,
  ) => {
    const { data, error } = await supabase
      .from("tables")
      .insert({
        ...tableData,
        status: "available", // ← Default status
        reserved: false, // ← Default reserved
      })
      .select()
      .single();

    if (error) {
      toast.error("Gagal menambah meja");
      throw error;
    }
    setTables([...tables, data]);
    toast.success("Meja berhasil ditambahkan");
    return data;
  };

  const updateTable = async (id: string, updates: Partial<TableData>) => {
    const { error } = await supabase
      .from("tables")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengupdate meja");
      throw error;
    }
    setTables(tables.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    toast.success("Meja berhasil diupdate");
  };

  const updateTableStatus = async (
    id: string,
    status: "available" | "occupied",
    reserved: boolean = false,
  ) => {
    const { error } = await supabase
      .from("tables")
      .update({ status, reserved })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengupdate status meja");
      throw error;
    }
    setTables(
      tables.map((t) => (t.id === id ? { ...t, status, reserved } : t)),
    );
    toast.success("Status meja diupdate");
  };

  const deleteTable = async (id: string) => {
    const { error } = await supabase.from("tables").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus meja");
      throw error;
    }
    setTables(tables.filter((t) => t.id !== id));
    toast.success("Meja berhasil dihapus");
  };

  return {
    tables,
    loading,
    addTable,
    updateTable,
    updateTableStatus,
    deleteTable,
  };
}
