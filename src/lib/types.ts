export type ChiffreAffaires = "< 200K" | "200K-500K" | "500K-1M" | "> 1M";

export type FreinCroissance =
  | "Acquisition clients"
  | "Rentabilité"
  | "Équipe & délégation"
  | "Systèmes & organisation";

export type Secteur =
  | "Dentiste"
  | "Médecin-Santé"
  | "Avocat-Notaire"
  | "Expert-comptable"
  | "Architecte"
  | "BTP"
  | "Plombier-Électricien"
  | "Promoteur immobilier"
  | "E-commerce"
  | "Commerce physique"
  | "Franchise"
  | "Coach-Formateur"
  | "Consultant"
  | "Agence marketing"
  | "Autre";

export interface ProfilProspect {
  prenom: string;
  email: string;
  telephone?: string;
  ca: ChiffreAffaires;
  frein: FreinCroissance;
  secteur: Secteur;
}

export type Programme = "MM" | "3M";

export interface Video {
  id: string;
  titre: string;
  description: string;
  wistia_url: string;
  frein_cible: FreinCroissance[];
  ca_cible: ChiffreAffaires[];
  plan: number[];
  programme?: Programme; // MM = MentorMax (tous niveaux), 3M = MaxMastermind (200K+)
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Temoignage {
  id: string;
  prenom: string;
  secteur_display: string;
  secteur_cible: Secteur[];
  resultat_chiffre: string;
  citation: string;
  video_url: string;
  haute_emotion: boolean;
  plan: number[];
}

export interface Newsletter {
  id: string;
  titre: string;
  extrait: string;
  contenu: string;
  theme: FreinCroissance[];
  lien: string;
}

export interface ContentData {
  videos: Video[];
  temoignages: Temoignage[];
  newsletters: Newsletter[];
}

export interface Etape {
  titre: string;
  description: string;
  type: "video" | "lecture" | "action";
}

export interface Chemin {
  titre: string;
  horizon: string;
  icon: string;
  couleur: "blue" | "gold" | "purple";
  recommande?: boolean;
  rdv?: boolean;
  bullets: string[];
  resultat: string;
  etapes: Etape[];
}

export interface DiagnosticPoints {
  p1: string;
  p2: string;
  p3: string;
  p4?: string;
  p5?: string;
}

export interface PersonalisationResult {
  diagnostic: DiagnosticPoints;
  chemins: {
    plan1: Chemin;
    plan2: Chemin;
    plan3: Chemin;
  };
  contenu: {
    video_principale: Video | null;
    videos_supplementaires: Video[]; // jusqu'à 2 vidéos additionnelles
    temoignages: Temoignage[];
    lecture: Newsletter | null;
    etapes: Etape[];
  };
}

export interface Progression {
  sessionId: string;
  plan: 1 | 2 | 3;
  etape_courante: number;
  video_watched: boolean;
  plan_choisi: boolean;
  score: number;
  updatedAt: string;
}

export interface SessionData extends ProfilProspect {
  sessionId: string;
  clerkUserId?: string;
  createdAt: string;
}
