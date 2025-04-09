"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import Chart from "./components/Chart";
import { Users, DollarSign, BarChart as ChartIcon, User } from "lucide-react";
import { getDashboardAdmin, getStats } from "../servicios/admin";
import { toast } from "react-toastify";
interface UsuarioMensual {
  month: string;
  registered: number;
  count: number;
}
interface Stats {
  totalUsuarios: number;
  usuariosFree: number;
  usuariosPremium: number;
  ingresosMensualesPremiumEstimado: number;
  usuariosRegistradosMensual: UsuarioMensual[];
  reservasMensuales: any[];
  publicacionesMensuales: any[];
}
export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsuarios: 0,
    usuariosFree: 0,
    usuariosPremium: 0,
    ingresosMensualesPremiumEstimado: 0,
    usuariosRegistradosMensual: [],
    reservasMensuales: [],
    publicacionesMensuales: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log;
        if (!token) {
          toast.error("No hay token disponible");
          return;
        }
        const data = await getStats(token);
        console.log(data, "RESPUESTA");
        setStats(data);
      } catch (error) {
        console.error("Error cargando las estadísticas", error);
      }
    };

    fetchStats();
  }, []);
  const chartData = stats.usuariosRegistradosMensual.map((item) => ({
    mes: item.month,
    membresias: item.count,
  }));

  return (
    <div className="flex min-h-screen py-2 bg-fondo">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Resumen del Gimnasio
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <StatsCard
              title="Total Usuarios "
              value={stats.totalUsuarios}
              icon={<Users />}
              color="bg-verde"
            />
            <StatsCard
              title="Usuarios Free"
              value={stats.usuariosFree}
              icon={<Users />}
              color="bg-[#A3D8F4]"
            />
            <StatsCard
              title="Usuarios Premium"
              value={stats.usuariosPremium}
              icon={<Users />}
              color="bg-[#FFD700]"
            />
            <StatsCard
              title="Ingresos Estimados"
              value={`$${stats.ingresosMensualesPremiumEstimado}`}
              icon={<DollarSign />}
              color="bg-verde"
            />
            <StatsCard
              title="Publicaciones Mensuales"
              value={stats.publicacionesMensuales.length}
              icon={<Users />}
              color="bg-[#A3D8F4]"
            />
            <StatsCard
              title="Reserva Mensual"
              value={stats.reservasMensuales.length}
              icon={<Users />}
              color="bg-[#FFD700]"
            />
          </div>
          <div className="mt-6">
            <Chart data={chartData} />
          </div>
        </main>
      </div>
    </div>
  );
}
