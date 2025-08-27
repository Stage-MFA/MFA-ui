"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/style/dashboard.module.css";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { BASE_URL_API } from "@/lib/constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className={styles.chartContainer}>
    <h2 className={styles.chartTitle}>{title}</h2>
    <div className={styles.chartContent}>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [variationData, setVariationData] = useState<any>(null);

  const MONTH_LABELS = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  // Récupère les années possibles
  useEffect(() => {
    fetch(`${BASE_URL_API}/request/years-possibles`)
      .then((res) => res.json())
      .then((data) => {
        setYears(data);
        if (data.includes(new Date().getFullYear())) {
          setSelectedYear(new Date().getFullYear());
        } else {
          setSelectedYear(data[0]);
        }
      })
      .catch((err) => console.error("Erreur fetch years:", err));
  }, []);

  // Récupère les variations de l’année sélectionnée
  useEffect(() => {
    if (!selectedYear) return;
    fetch(`${BASE_URL_API}/request/variation-by-years?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data) => setVariationData(data))
      .catch((err) => console.error("Erreur fetch variation:", err));
  }, [selectedYear]);

  // 📊 Transforme les données par mois (au lieu de par jour)
  const demandeInterventionTotal = variationData
    ? (() => {
        const monthlyData = Array(12).fill(0);

        Object.entries(variationData.variation).forEach(
          ([date, values]: [string, any]) => {
            const monthIndex = new Date(date).getMonth(); // 0 = Janvier
            const totalForDay = (Object.values(values) as number[]).reduce(
              (a, b) => a + b,
              0
            );
            monthlyData[monthIndex] += totalForDay;
          }
        );

        return {
          labels: MONTH_LABELS,
          datasets: [
            {
              label: `Demandes ${selectedYear}`,
              data: monthlyData,
              backgroundColor: "#fa8789",
            },
          ],
        };
      })()
    : { labels: MONTH_LABELS, datasets: [] };

  // --- Données statiques ---
  const repartitionSexe = {
    labels: ["Hommes", "Femmes"],
    datasets: [
      {
        data: [52, 48],
        backgroundColor: ["#57fa90", "#fa8789"],
      },
    ],
  };

  const tauxIntervention = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Taux d'intervention",
        data: [2.1, 2.3, 2.2, 2.4],
        borderColor: "#22c55e",
        backgroundColor: "#bbf7d0",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const tauxInterventionResolu = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Taux de mortalité",
        data: [0.9, 1.0, 0.8, 0.7],
        borderColor: "#ef4444",
        backgroundColor: "#fecaca",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const croissanceMensuelle = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: "Croissance mensuelle (%)",
        data: [
          0.2, 0.3, 0.25, 0.28, 0.3, 0.32, 0.31, 0.29, 0.3, 0.33, 0.34, 0.35,
        ],
        borderColor: "#22c55e",
        backgroundColor: "#bbf7d0",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const user = {
    labels: ["0-14", "15-24", "25-54", "55-64", "65+"],
    datasets: [
      {
        label: "Employé par post",
        data: [30, 18, 35, 10, 7],
        backgroundColor: [
          "#fa8789",
          "#bbf7d0",
          "#ef4444",
          "#22c55e",
          "#bbf7d0",
        ],
      },
    ],
  };

  const previsions = {
    labels: ["2025", "2026", "2027", "2028"],
    datasets: [
      {
        label: "Prévisions intervention",
        data: [32000, 33500, 35000, 36500],
        backgroundColor: "#fa8789",
      },
    ],
  };

  const interventionPartechnicien = {
    labels: ["Analamanga", "Atsinanana", "Boeny", "Haute Matsiatra", "SAVA"],
    datasets: [
      {
        label: "Intervention par employé",
        data: [90, 75, 60, 80, 55],
        backgroundColor: "#57fa90",
      },
    ],
  };

  const maintenanvePerTechnicien = {
    labels: ["Analamanga", "Atsinanana", "Boeny", "Haute Matsiatra", "SAVA"],
    datasets: [
      {
        label: "Maintenances par technicien",
        data: [3200, 1800, 1400, 2000, 1600],
        backgroundColor: "#ef4444",
      },
    ],
  };

  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        <ChartContainer title="Taux intervention en cours">
          <Line data={tauxIntervention} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Taux intervention résolu">
          <Line data={tauxInterventionResolu} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Prévisions intervention">
          <Bar data={previsions} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title={`Demande intervention (${selectedYear})`}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px" }}>Année :</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Bar data={demandeInterventionTotal} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Maintenances">
          <Line data={croissanceMensuelle} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Maintenance par technicien">
          <Bar data={maintenanvePerTechnicien} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Intervention par technicien">
          <Bar data={interventionPartechnicien} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Répartition par sexe">
          <Pie
            data={repartitionSexe}
            options={{
              ...smallChartOptions,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </ChartContainer>

        <ChartContainer title="Répartition employé">
          <Doughnut
            data={user}
            options={{
              ...smallChartOptions,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;
