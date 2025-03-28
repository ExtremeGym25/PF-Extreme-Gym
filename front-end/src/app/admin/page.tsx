"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import Chart from "./components/Chart";
import { Users, DollarSign, BarChart as ChartIcon } from "lucide-react";
import { getDashboardAdmin } from "../servicios/admin";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    ingresosMensuales: 0,
    membresiasActivas: 0,
    graficos: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardAdmin();
        setStats(data);
      } catch (error) {
        console.error("Error cargando las estadísticas", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen py-2 bg-azul1">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-xl font-semibold text-[#F2F2F2] mb-4">
            Resumen del Gimnasio
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <StatsCard
              title="Usuarios Registrados"
              value={stats.totalUsuarios}
              icon={<Users />}
              color="bg-[#58D68D]"
            />
            <StatsCard
              title="Ingresos Mensuales"
              value={`$${stats.ingresosMensuales}`}
              icon={<DollarSign />}
              color="bg-[#FF6F3C]"
            />
            <StatsCard
              title="Membresías Activas"
              value={stats.membresiasActivas}
              icon={<ChartIcon />}
              color="bg-[#2C2C2C]"
            />
          </div>
          <div className="mt-6">
            <Chart data={stats.graficos} />
          </div>
        </main>
      </div>
    </div>
  );
}
