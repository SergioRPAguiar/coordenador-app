import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_URL } from "@/context/AuthContext";

interface Horario {
  time: string;
  available: boolean;
}

export const useHorarios = (
  selectedDate: string,
  token: string | null,
  periodSlots: string[]
) => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchHorarios = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${API_URL}/schedule/available/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedHorarios = periodSlots.map((time) => ({
        time,
        available: response.data.some(
          (h: any) => h.timeSlot === time && h.available
        ),
      }));

      setHorarios(updatedHorarios);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar horários");
      console.error("Erro ao buscar horários:", err);
    }
  }, [selectedDate, token, periodSlots]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  return {
    horarios,
    error,
    refresh: fetchHorarios,
    updateLocal: setHorarios,
  };
};
