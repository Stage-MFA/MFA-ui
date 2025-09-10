import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { StatsResponse } from "./types";

export async function generateDailyReportExcel(data: StatsResponse) {
  const workbook = new ExcelJS.Workbook();
  const s = data.stat;
  const sheet = workbook.addWorksheet("Rapport Journalier");

  sheet.addRow(["Rapport Journalier de Maintenance"]);
  sheet.mergeCells("A1:B1");
  sheet.getCell("A1").font = { bold: true, size: 14 };

  sheet.addRow(["Date", data.date]);
  sheet.addRow(["Version", "v1.0.0"]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques des Utilisateurs"]);
  sheet.getCell("A5").font = { bold: true };
  sheet.addRow(["Indicateur", "Valeur"]);
  sheet.addRows([
    ["Total utilisateurs", s.userStatistics.totalUsers],
    ["Hommes", s.userStatistics.maleUsers],
    ["Femmes", s.userStatistics.femaleUsers],
    ["Utilisateurs actifs", s.userStatistics.users],
    ["Techniciens", s.userStatistics.technicians],
    ["Gestionnaires", s.userStatistics.managers],
  ]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques des Techniciens"]);
  sheet.getCell(`A${sheet.rowCount}`).font = { bold: true };
  sheet.addRow(["Indicateur", "Valeur"]);
  sheet.addRows([
    ["Total techniciens", s.technicianStatistics.technicianTotal],
    ["Hommes", s.technicianStatistics.maleUsers],
    ["Femmes", s.technicianStatistics.femaleUsers],
  ]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques des Demandes"]);
  sheet.getCell(`A${sheet.rowCount}`).font = { bold: true };
  sheet.addRow(["Statut", "Valeur"]);
  sheet.addRows([
    ["Total", s.requestStatistics.requestTotal],
    ["En attente", s.requestStatistics.pending],
    ["En cours", s.requestStatistics.progress],
    ["Terminées", s.requestStatistics.finish],
  ]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques des Interventions"]);
  sheet.getCell(`A${sheet.rowCount}`).font = { bold: true };
  sheet.addRow(["Statut", "Valeur"]);
  sheet.addRows([
    ["Total", s.interventionStatistics.interventionTotal],
    ["En attente", s.interventionStatistics.pending],
    ["En cours", s.interventionStatistics.progress],
    ["Terminées", s.interventionStatistics.finish],
  ]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques des Maintenances"]);
  sheet.getCell(`A${sheet.rowCount}`).font = { bold: true };
  sheet.addRow(["Statut", "Valeur"]);
  sheet.addRows([
    ["Total", s.maintenancesStatistics.maintenancesTotal],
    ["En cours", s.maintenancesStatistics.progress],
    ["Terminées", s.maintenancesStatistics.finish],
  ]);
  sheet.addRow([]);

  sheet.addRow(["Statistiques Organisationnelles"]);
  sheet.getCell(`A${sheet.rowCount}`).font = { bold: true };
  sheet.addRow(["Indicateur", "Valeur"]);
  sheet.addRows([
    ["Directions", s.organisationStatistics.directionTotal],
    ["Spécialités", s.organisationStatistics.specialityTotal],
    ["Matériels", s.organisationStatistics.materialTotal],
  ]);

  sheet.columns.forEach((col) => {
    col.width = 30;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `rapport_maintenance_${data.date}.xlsx`);
}
