"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL_API } from "@/lib/constants";
import styles from "@/app/style/createUser.module.css";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

type Material = {
  materialId: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: number;
  acquisitionDate: string;
  guarantee: string;
};

type User = {
  id: number;
  email: string;
};

const formSchema = z.object({
  requestDate: z.string().min(1, "Date requise"),
  status: z.enum(["PENDING", "IN_PROGRESS", "FINISH"]),
  priority: z.enum(["URGENT", "WAIT"]),
  materials: z.array(
    z.object({
      materialId: z.number(),
      name: z.string(),
      type: z.string(),
      brand: z.string(),
      model: z.string(),
      serialNumber: z.number(),
      acquisitionDate: z.string(),
      guarantee: z.string(),
    }),
  ),
  description: z.string().min(1, "Description invalide"),
  idUser: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateRequestIntervention() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [materialsList, setMaterialsList] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestDate: "",
      status: "PENDING",
      priority: "WAIT",
      materials: [],
      description: "",
      idUser: 0,
    },
  });

  const getLocalDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // en ms
    const localISOTime = new Date(now.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const res = await fetch(`${BASE_URL_API}/material`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des matériels");
        const data: Material[] = await res.json();
        setMaterialsList(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMaterials();
  }, []);

  useEffect(() => {
    const userEmail = sessionStorage.getItem("user");
    if (!userEmail) return;

    async function fetchUsers() {
      try {
        const res = await fetch(
          `${BASE_URL_API}/users/email?email=${userEmail}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );
        if (!res.ok)
          throw new Error("Erreur lors du chargement des utilisateurs");
        const data: User = await res.json();
        setValue("idUser", data.id);
      } catch (error) {
        console.error(error);
      }
    }

    setValue("status", "PENDING");
    setValue("requestDate", getLocalDateTime());
    fetchUsers();
  }, [setValue]);

  const handleMaterialCheck = (material: Material, checked: boolean) => {
    let updated: Material[];
    if (checked) {
      updated = [...watch("materials"), material];
    } else {
      updated = watch("materials").filter(
        (m) => m.materialId !== material.materialId,
      );
    }
    setValue("materials", updated);
  };

  const filteredMaterials = materialsList.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirst, indexOfLast);

  const onSubmit = async (data: FormValues) => {
    data.requestDate = getLocalDateTime();
    data.status = "PENDING";

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Échec de la création de la demande");
      router.push("/user-ministere/request-intervention");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de la création de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          style={{ marginTop: "4%" }}
        >
          <FaArrowLeft />
        </button>

        <Image
          alt="Logo Intervention"
          src="/materiel4.png"
          height={600}
          width={600}
          className={styles.logo}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          style={{ marginTop: "20px" }}
        >
          <div className={styles.grid}>
            <div className={styles.column}>
              <label className={styles.label}>Priorité</label>
              <select {...register("priority")} className={styles.input}>
                <option value="URGENT">Urgente</option>
                <option value="WAIT">Pas urgent</option>
              </select>
              {errors.priority && (
                <p className={styles.error}>{errors.priority.message}</p>
              )}

              <label className={styles.label}>Description</label>
              <textarea
                {...register("description")}
                className={styles.input}
                rows={7}
              />
              {errors.description && (
                <p className={styles.error}>{errors.description.message}</p>
              )}
            </div>

            <div className={styles.column}>
              <label className={styles.label}>Matériels à signaler</label>
              <div className={styles.input} style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Rechercher un matériel..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    marginBottom: 8,
                    width: "100%",
                    padding: "6px 8px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    outline: "none",
                  }}
                />
                <details open style={{ width: "100%" }}>
                  <summary
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      background: "#fff",
                    }}
                  >
                    {watch("materials").length > 0
                      ? `${watch("materials").length} matériel(s) sélectionné(s)`
                      : "Sélectionner les matériels"}
                  </summary>
                  <div
                    style={{
                      marginTop: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      padding: "8px",
                      background: "#f9f9f9",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {currentMaterials.map((material) => (
                      <label
                        key={material.materialId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "4px 0",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={watch("materials").some(
                            (m) => m.materialId === material.materialId,
                          )}
                          onChange={(e) =>
                            handleMaterialCheck(material, e.target.checked)
                          }
                          style={{ accentColor: "#0070f3" }}
                        />
                        <span>
                          {material.name} ({material.type})
                        </span>
                      </label>
                    ))}
                    {currentMaterials.length === 0 && (
                      <div style={{ color: "#888", padding: "8px" }}>
                        Aucun matériel trouvé.
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: "2px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      Précédent
                    </button>
                    <span style={{ alignSelf: "center" }}>
                      Page {currentPage} / {totalPages || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      style={{
                        padding: "2px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        background: "#fff",
                        cursor:
                          currentPage === totalPages || totalPages === 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      Suivant
                    </button>
                  </div>
                </details>
              </div>
              {errors.materials && (
                <p className={styles.error}>{errors.materials.message}</p>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? "Chargement..." : "Créer la demande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
