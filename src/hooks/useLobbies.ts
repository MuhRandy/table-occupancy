import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import type { Lobby } from "../types";

export function useLobbies() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLobbies();
  }, []);

  const loadLobbies = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Gagal memuat lobi");
      console.error(error);
    } else {
      setLobbies(data || []);
    }
    setLoading(false);
  };

  const addLobby = async (name: string) => {
    const { data, error } = await supabase
      .from("lobbies")
      .insert({ name })
      .select()
      .single();

    if (error) {
      toast.error("Gagal menambah lobi");
      throw error;
    }
    setLobbies([...lobbies, data]);
    toast.success("Lobi berhasil ditambahkan");
    return data;
  };

  const updateLobby = async (id: string, name: string) => {
    const { error } = await supabase
      .from("lobbies")
      .update({ name })
      .eq("id", id);

    if (error) {
      toast.error("Gagal mengupdate lobi");
      throw error;
    }
    setLobbies(lobbies.map((l) => (l.id === id ? { ...l, name } : l)));
    toast.success("Lobi berhasil diupdate");
  };

  return { lobbies, loading, addLobby, updateLobby };
}
