"use client";

import React, { useEffect, useState } from "react";
import styles from "@/app/style/dashboard.module.css";
import { Pie, Line, Doughnut } from "react-chartjs-2";
import { BASE_URL_API, BASE_URL_FRONTEND } from "@/lib/constants";
import RapportTelecharge from "../stats/Rapport";
import { FiClock, FiLoader, FiCheckCircle } from "react-icons/fi";
import AnimatedNumber from "../animation/Animation";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
);

type request = {
  requestTotal: number;
  pending: number;
  progress: number;
  finish: number;
};

type intervention = {
  interventionTotal: number;
  pending: number;
  progress: number;
  finish: number;
};

type maintenances = {
  maintenancesTotal: number;
  progress: number;
  finish: number;
};

type gender = {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  users: number;
  technicians: number;
  managers: number;
};

interface VariationDayValues {
  [key: string]: number;
}

interface VariationData {
  variation: {
    [date: string]: VariationDayValues;
  };
}

const ChartContainer: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className={styles.chartContainer}>
    <h2 className={styles.chartTitle}>{title}</h2>
    <div className={styles.chartContent}>{children}</div>
  </div>
);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [variationData, setVariationData] = useState<VariationData | null>(
    null,
  );

  const [yearInterventions, setyearInterventions] = useState<number[]>([]);
  const [selectedInterventions, setSelectedInterventions] = useState<number>(
    new Date().getFullYear(),
  );
  const [variationDataInterventions, setVariationDataInterventions] =
    useState<VariationData | null>(null);

  const [yearMaintenances, setyearMaintenances] = useState<number[]>([]);
  const [selectedMaintenances, setSelectedMaintenances] = useState<number>(
    new Date().getFullYear(),
  );
  const [variationDataMaintenances, setVariationDataMaintenances] =
    useState<VariationData | null>(null);

  useEffect(() => {
    router.prefetch(`${BASE_URL_FRONTEND}/admin-ministere/`);
    setTimeout(() => setIsLoading(false), 500);
  });

  useEffect(() => {
    fetch(`${BASE_URL_API}/maintenances/years-possibles`)
      .then((res) => res.json())
      .then((data: number[]) => {
        setyearMaintenances(data);
        setSelectedMaintenances(
          data.includes(new Date().getFullYear())
            ? new Date().getFullYear()
            : data[0],
        );
      })
      .catch((err) => console.error("Erreur fetch years:", err));
  }, []);

  useEffect(() => {
    if (!selectedMaintenances) return;
    fetch(
      `${BASE_URL_API}/maintenances/variation-by-years?year=${selectedMaintenances}`,
    )
      .then((res) => res.json())
      .then((data: VariationData) => setVariationDataMaintenances(data))
      .catch((err) => console.error("Erreur fetch variation:", err));
  }, [selectedMaintenances]);

  useEffect(() => {
    fetch(`${BASE_URL_API}/interventions/years-possibles`)
      .then((res) => res.json())
      .then((data: number[]) => {
        setyearInterventions(data);
        setSelectedInterventions(
          data.includes(new Date().getFullYear())
            ? new Date().getFullYear()
            : data[0],
        );
      })
      .catch((err) => console.error("Erreur fetch years:", err));
  }, []);

  useEffect(() => {
    if (!selectedInterventions) return;
    fetch(
      `${BASE_URL_API}/interventions/variation-by-years?year=${selectedInterventions}`,
    )
      .then((res) => res.json())
      .then((data: VariationData) => setVariationDataInterventions(data))
      .catch((err) => console.error("Erreur fetch variation:", err));
  }, [selectedInterventions]);

  const router = useRouter();
  const [requestData, setRequestData] = useState<request | null>(null);
  const [interventionData, setInterventionData] = useState<intervention | null>(
    null,
  );
  const [maintenancesData, setMaintenancesData] = useState<maintenances | null>(
    null,
  );

  useEffect(() => {
    async function fetchRequestDate() {
      const res = await fetch(`${BASE_URL_API}/request/statistics`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      setRequestData(data);
    }
    fetchRequestDate();
  }, []);

  useEffect(() => {
    async function fetchInterventionDate() {
      const res = await fetch(`${BASE_URL_API}/interventions/statistics`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      setInterventionData(data);
    }
    fetchInterventionDate();
  }, []);

  useEffect(() => {
    async function fetchMaintenanceData() {
      const res = await fetch(`${BASE_URL_API}/maintenances/statistics`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      setMaintenancesData(data);
    }
    fetchMaintenanceData();
  }, []);

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

  useEffect(() => {
    fetch(`${BASE_URL_API}/request/years-possibles`)
      .then((res) => res.json())
      .then((data: number[]) => {
        setYears(data);
        setSelectedYear(
          data.includes(new Date().getFullYear())
            ? new Date().getFullYear()
            : data[0],
        );
      })
      .catch((err) => console.error("Erreur fetch years:", err));
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    fetch(`${BASE_URL_API}/request/variation-by-years?year=${selectedYear}`)
      .then((res) => res.json())
      .then((data: VariationData) => setVariationData(data))
      .catch((err) => console.error("Erreur fetch variation:", err));
  }, [selectedYear]);

  const demandeInterventionTotal = variationData
    ? (() => {
        const monthlyData = Array(12).fill(0);
        Object.entries(variationData.variation).forEach(
          ([date, values]: [string, VariationDayValues]) => {
            const monthIndex = new Date(date).getMonth();
            const totalForDay = Object.values(values).reduce(
              (a, b) => a + b,
              0,
            );
            monthlyData[monthIndex] += totalForDay;
          },
        );

        return {
          labels: MONTH_LABELS,
          datasets: [
            {
              label: `Demandes ${selectedYear}`,
              data: monthlyData,
              borderColor: "#8aed66",
              backgroundColor: "#e5f5df",
            },
          ],
        };
      })()
    : { labels: MONTH_LABELS, datasets: [] };

  const tauxIntervention = variationDataInterventions
    ? (() => {
        const monthlyData = Array(12).fill(0);
        Object.entries(variationDataInterventions.variation).forEach(
          ([date, values]: [string, VariationDayValues]) => {
            const monthIndex = new Date(date).getMonth();
            const totalForDay = Object.values(values).reduce(
              (a, b) => a + b,
              0,
            );
            monthlyData[monthIndex] += totalForDay;
          },
        );

        return {
          labels: MONTH_LABELS,
          datasets: [
            {
              label: `Interventons ${selectedInterventions}`,
              data: monthlyData,
              borderColor: "#fa8966",
              backgroundColor: "#fecaca",
            },
          ],
        };
      })()
    : { labels: MONTH_LABELS, datasets: [] };

  const tauxMaintenances = variationDataMaintenances
    ? (() => {
        const monthlyData = Array(12).fill(0);
        Object.entries(variationDataMaintenances.variation).forEach(
          ([date, values]: [string, VariationDayValues]) => {
            const monthIndex = new Date(date).getMonth();
            const totalForDay = Object.values(values).reduce(
              (a, b) => a + b,
              0,
            );
            monthlyData[monthIndex] += totalForDay;
          },
        );

        return {
          labels: MONTH_LABELS,
          datasets: [
            {
              label: `Maintenances ${selectedMaintenances}`,
              data: monthlyData,
              borderColor: "#fcf94e",
              backgroundColor: "#faf7b9",
            },
          ],
        };
      })()
    : { labels: MONTH_LABELS, datasets: [] };

  const [userRepartion, setUserRepartition] = useState<gender>();

  useEffect(() => {
    async function fetchUserRepartition() {
      const res = await fetch(`${BASE_URL_API}/users/statistics`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      setUserRepartition(data);
    }
    fetchUserRepartition();
  }, []);

  const user = {
    labels: [
      "Total utilisateur",
      "Responsable",
      "Téchnicien",
      "Utilisateur simple",
    ],
    datasets: [
      {
        label: "Total",
        data: [
          { value: userRepartion?.totalUsers },
          { value: userRepartion?.managers },
          { value: userRepartion?.technicians },
          {
            value: userRepartion?.users,
          },
        ],
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
  const repartitionSexe = {
    labels: ["Hommes", "Femmes"],
    datasets: [
      {
        label: "Total",
        data: [
          { value: userRepartion?.maleUsers },
          { value: userRepartion?.femaleUsers },
        ],
        backgroundColor: ["#57fa90", "#fa8789"],
      },
    ],
  };
  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.grid}>
          {[...Array(3)].map((_, i) => (
            <div
              key={`card-${i}`}
              className={`${styles.skeleton} ${styles.skeletonCard}`}
            />
          ))}
          {[...Array(7)].map((_, i) => (
            <div
              key={`chart-${i}`}
              className={`${styles.skeleton} ${styles.skeletonChart}`}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {requestData && (
          <div className={styles.cards}>
            <div className={styles.cardTitle}>
              <Image
                alt="Logo Ministère"
                src="/demande.png"
                width={100}
                height={50}
                style={{
                  display: "block",
                  margin: "0 auto",
                  height: "auto",
                }}
              />
              <div>
                <h1>Demande Intervention</h1>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={requestData.requestTotal} />
                </span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div>
                <div className={styles.cardIcons}>
                  <FiClock className={`${styles.icon} ${styles.waiting}`} />
                  <h1> En attente</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={requestData.pending} />
                </span>
              </div>
              <div>
                <div className={styles.cardIcons}>
                  <FiLoader className={`${styles.icon} ${styles.inProgress}`} />
                  <h1>En cours</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={requestData.progress} />
                </span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardIcons}>
                  <FiCheckCircle
                    className={`${styles.icon} ${styles.finished}`}
                  />
                  <h1>Términer</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={requestData.finish} />
                </span>
              </div>
            </div>
          </div>
        )}

        {interventionData && (
          <div className={styles.cards}>
            <div className={styles.cardTitle}>
              <Image
                alt="Logo Ministère"
                src="/materiel4.png"
                width={100}
                height={50}
                style={{
                  display: "block",
                  margin: "0 auto",
                  height: "auto",
                }}
              />
              <div>
                <h1>Intervention</h1>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={interventionData.interventionTotal} />
                </span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div>
                <div className={styles.cardIcons}>
                  <FiClock className={`${styles.icon} ${styles.waiting}`} />
                  <h1> En attente</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={interventionData?.pending} />
                </span>
              </div>
              <div>
                <div className={styles.cardIcons}>
                  <FiLoader className={`${styles.icon} ${styles.inProgress}`} />
                  <h1>En cours</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={interventionData?.progress} />
                </span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardIcons}>
                  <FiCheckCircle
                    className={`${styles.icon} ${styles.finished}`}
                  />
                  <h1>Términer</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={interventionData?.finish} />
                </span>
              </div>
            </div>
          </div>
        )}

        {maintenancesData && (
          <div className={styles.cards}>
            <div className={styles.cardTitle}>
              <Image
                alt="Logo Ministère"
                src="/maintenances.png"
                width={200}
                height={100}
                style={{
                  display: "block",
                  margin: "0 auto",
                  height: "auto",
                }}
              />
              <div>
                <h1>Maintenances</h1>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={maintenancesData.maintenancesTotal} />
                </span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div>
                <div className={styles.cardIcons}>
                  <FiLoader className={`${styles.icon} ${styles.inProgress}`} />
                  <h1>En cours</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={maintenancesData.progress} />
                </span>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardIcons}>
                  <FiCheckCircle
                    className={`${styles.icon} ${styles.finished}`}
                  />
                  <h1>Términer</h1>
                </div>
                <span className={styles.cardValues}>
                  <AnimatedNumber value={maintenancesData.finish} />
                </span>
              </div>
            </div>
          </div>
        )}

        <ChartContainer title="Répartition Utilisateur">
          <Doughnut
            data={user}
            options={{
              ...smallChartOptions,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </ChartContainer>
        <ChartContainer
          title={`Demande intervention par ans  (${selectedYear})`}
        >
          <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>Année :</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ outline: "none" }}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Line data={demandeInterventionTotal} options={smallChartOptions} />
        </ChartContainer>
        <RapportTelecharge />

        <ChartContainer title={`Taux maintenances par ans (${selectedYear})`}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>Année :</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedMaintenances(Number(e.target.value))}
              style={{ outline: "none" }}
            >
              {yearMaintenances.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Line data={tauxMaintenances} options={smallChartOptions} />
        </ChartContainer>

        <ChartContainer title="Répartition par sexe utilisateur ">
          <Pie
            data={repartitionSexe}
            options={{
              ...smallChartOptions,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </ChartContainer>

        <ChartContainer title={`Taux intervention par ans (${selectedYear})`}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>Année :</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedInterventions(Number(e.target.value))}
              style={{ outline: "none" }}
            >
              {yearInterventions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Line data={tauxIntervention} options={smallChartOptions} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;
