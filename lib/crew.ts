/**
 * Avatares en PNG: guárdalos en `public/crew/` y pon aquí la ruta, ej. `/crew/medel.png`.
 * Si `avatarSrc` está vacío, se muestra la inicial del nombre hasta que agregues la imagen.
 */
export type CrewMember = {
  id: string;
  nombre: string;
  /** Shortcode del reel para https://www.instagram.com/reel/{code}/embed/ */
  reelShortCode: string | null;
  /** Ruta bajo `public`, ej. `/crew/medel.png` */
  avatarSrc: string;
};

export const CREW: CrewMember[] = [
  {
    id: "medel",
    nombre: "Medel",
    reelShortCode: "DWYB3YVtJCk",
    avatarSrc: "/crew/medel.JPEG",
  },
  { id: "woo", nombre: "Manu Woo", reelShortCode: "DWVe8RvtG6-", avatarSrc: "/crew/woo.JPEG" },
  { id: "lepato", nombre: "Lepato", reelShortCode: "DWLNlEQtBlp", avatarSrc: "/crew/lepato.JPEG" },
  { id: "yir", nombre: "Yahir", reelShortCode: "DWanNAdt-LQ", avatarSrc: "/crew/yir.JPEG" },
  { id: "pipon", nombre: "Pipo", reelShortCode: "", avatarSrc: "/crew/pipon.JPEG" },
  { id: "franco", nombre: "Franco", reelShortCode: "DWSyrpCN7t9", avatarSrc: "/crew/franco.JPEG" },
  { id: "franq", nombre: "Franq", reelShortCode: "DWNuJ7Lt53L", avatarSrc: "/crew/franq.JPEG" },
  { id: "gustambo", nombre: "Gustambo", reelShortCode: "", avatarSrc: "/crew/gustambo.JPEG" },
  { id: "josue", nombre: "Josue", reelShortCode: "DWQUo5ItlFM", avatarSrc: "/crew/josue.JPEG" },
];
