"use client";
import React from "react";
import styles from '@/app/Style/dashboard.module.css';
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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

const Card: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardValue}>{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const populationTotale = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [{
      label: "Population totale",
      data: [25000, 27000, 29000, 31000],
      backgroundColor: "#fa8789",
    }],
  };

  const repartitionSexe = {
    labels: ["Hommes", "Femmes"],
    datasets: [{
      data: [52, 48],
      backgroundColor: ["#57fa90", "#fa8789"],
    }],
  };

  const tauxNatalite = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [{
      label: "Taux de natalité",
      data: [2.1, 2.3, 2.2, 2.4],
      borderColor: "#22c55e",
      backgroundColor: "#bbf7d0",
      fill: true,
      tension: 0.4,
    }],
  };

  const tauxMortalite = {
    labels: ["2021", "2022", "2023", "2024"],
    datasets: [{
      label: "Taux de mortalité",
      data: [0.9, 1.0, 0.8, 0.7],
      borderColor: "#ef4444",
      backgroundColor: "#fecaca",
      fill: true,
      tension: 0.4,
    }],
  };

  const croissanceMensuelle = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [{
      label: "Croissance mensuelle (%)",
      data: [0.2, 0.3, 0.25, 0.28, 0.3, 0.32, 0.31, 0.29, 0.3, 0.33, 0.34, 0.35],
      borderColor: "#22c55e",
      backgroundColor: "#bbf7d0",
      fill: true,
      tension: 0.4,
    }],
  };

  const trancheAge = {
    labels: ["0-14", "15-24", "25-54", "55-64", "65+"],
    datasets: [{
      label: "Répartition par âge",
      data: [30, 18, 35, 10, 7],
      backgroundColor: ["#fa8789", "#bbf7d0", "#ef4444", "#22c55e", "#bbf7d0"],
    }],
  };

  const previsions = {
    labels: ["2025", "2026", "2027", "2028"],
    datasets: [{
      label: "Prévisions démographiques",
      data: [32000, 33500, 35000, 36500],
      backgroundColor: "#fa8789",
    }],
  };

  const communesParProvince = {
    labels: ["Analamanga", "Atsinanana", "Boeny", "Haute Matsiatra", "SAVA"],
    datasets: [{
      label: "Nombre de communes",
      data: [90, 75, 60, 80, 55],
      backgroundColor: "#57fa90",
    }],
  };

  const populationParProvince = {
    labels: ["Analamanga", "Atsinanana", "Boeny", "Haute Matsiatra", "SAVA"],
    datasets: [{
      label: "Population (en milliers)",
      data: [3200, 1800, 1400, 2000, 1600],
      backgroundColor: "#ef4444",
    }],
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
        <ChartContainer title="Population totale">
          <Bar data={populationTotale} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Répartition par sexe">
          <Pie
            data={repartitionSexe}
            options={{ ...smallChartOptions, plugins: { legend: { position: "bottom" } } }}
          />
        </ChartContainer>

        <ChartContainer title="Taux de natalité">
          <Line data={tauxNatalite} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Taux de mortalité">
          <Line data={tauxMortalite} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Taux de croissance mensuelle">
          <Line data={croissanceMensuelle} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Répartition par tranche d’âge">
          <Doughnut
            data={trancheAge}
            options={{ ...smallChartOptions, plugins: { legend: { position: "bottom" } } }}
          />
        </ChartContainer>

        <ChartContainer title="Prévisions démographiques">
          <Bar data={previsions} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Communes par province">
          <Bar data={communesParProvince} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Population par province">
          <Bar data={populationParProvince} options={smallChartOptions} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;