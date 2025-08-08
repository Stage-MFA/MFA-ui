import SpecialityList from "@/app/components/speciality/SpecialityList";
import DirectionList from "@/app/components/direction/DirectionList";
import styles from "@/app/style/specialityDirection.module.css";

export default function SpecialityPage() {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Direction</h2>
        <DirectionList />
      </div>
      <div className={styles.section}>
        <h2>Spécialité</h2>
        <SpecialityList />
      </div>
    </div>
  );
}
