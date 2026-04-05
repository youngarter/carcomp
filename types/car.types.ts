import { Prisma } from "../app/generated/prisma";

// ==========================================
// 1. TYPAGE STRICT DES CHAMPS JSON (JSONB)
// ==========================================

// ==========================================
// 1. TYPAGE STRICT DES CHAMPS JSON (JSONB)
// ==========================================

// ==========================================
// 1. TYPAGE STRICT DES CHAMPS JSON (JSONB)
// ==========================================

export interface SafetyFeatures {
    abs?: boolean;
    esp?: boolean;
    tractionControl?: boolean;      // Antipatinage
    emergencyBraking?: boolean;     // Aide au freinage d'urgence
    immobilizer?: boolean;          // Antidémarrage
    hillStartAssist?: boolean;      // Aide au démarrage en côte
    fatigueDetection?: boolean;     // Détecteur de fatigue
    laneAssist?: boolean;           // Maintien de voie
    blindSpotMonitor?: boolean;     // Détecteur d'angle mort
    tirePressureMonitor?: boolean;  // Détecteur de sous-gonflage
    autoDoorLock?: boolean;         // Fermeture automatique
    isofix?: boolean;               // Fixations ISOFIX
    fogLights?: boolean;            // Phares antibrouillard
    alarm?: boolean;                // Alarme
    airbags?: number;               // Nombre d'airbags
    trafficSignRecognition?: boolean; // Reconnaissance des panneaux
}

export interface ComfortFeatures {
    airConditioning?: string;       // Climatisation (Manuelle, Auto, Bi-zone...)
    audioSystem?: string;           // Système audio
    onBoardComputer?: boolean;      // Ordinateur de bord
    startStop?: boolean;            // Start & Stop
    cruiseControl?: string;         // Régulateur de vitesse (Standard, Adaptatif)
    rainSensor?: boolean;           // Détecteur de pluie
    autoHeadlights?: boolean;       // Allumage auto des feux
    electricParkingBrake?: boolean; // Frein à main électrique
    touchScreen?: boolean;          // Écran tactile
    digitalCockpit?: boolean;       // Cockpit digital
    headUpDisplay?: boolean;        // Affichage tête haute
    rearCamera?: boolean;           // Caméra de recul
    parkingSensors?: string;        // Radars de stationnement (Arrière, Avant/Arrière)
    parkAssist?: boolean;           // Park Assist
    steeringWheelControls?: boolean;// Commandes au volant
    voiceCommands?: boolean;        // Commandes vocales
    adjustableSteeringWheel?: string; // Volant réglable
    electricWindows?: string;       // Vitres électriques
    electricMirrors?: boolean;      // Rétroviseurs électriques
    foldingMirrors?: boolean;       // Rétroviseurs rabattables
    electricTrunk?: boolean;        // Coffre électrique
    keylessEntry?: boolean;         // Accès et démarrage sans clé (Mains libres)
    electricSeats?: boolean;        // Sièges électriques
    memorySeats?: boolean;          // Sièges à mémoire
    foldingRearSeats?: string;      // Banquette rabattable
    navigationGps?: boolean;        // Navigation GPS
    wifi?: boolean;                 // Wi-Fi
    bluetooth?: boolean;            // Bluetooth
    appleCarplay?: boolean;         // Apple CarPlay
    androidAuto?: boolean;          // Android Auto
    wirelessCharging?: boolean;     // Chargeur sans fil
    steeringPaddles?: boolean;      // Palettes au volant (Transféré ici !)
}

export interface AestheticFeatures {
    alloyWheels?: string;           // Jantes Alu (ex: "18 pouces")
    upholstery?: string;            // Sellerie (Tissu, Cuir, Alcantara...)
    leatherSteeringWheel?: boolean; // Volant cuir
    followMeHome?: boolean;         // Follow me home
    ambientLighting?: boolean;      // Lumière d'ambiance
    daytimeRunningLights?: string;  // Feux de jour (Halogène, LED...)
    headlights?: string;            // Phares (Xénon, Full LED, Matrix...)
    roof?: string;                  // Toit (Panoramique, Ouvrant...)
    roofRails?: boolean;            // Barres de toit
    tintedWindows?: boolean;        // Vitres surteintées
}

// ==========================================
// 2. DEFINITION DES REQUÊTES PRISMA (PAYLOADS)
// ==========================================

// Payload complet d'une Finition
export const finitionWithDetails = Prisma.validator<Prisma.FinitionDefaultArgs>()({
    include: {
        carModel: {
            include: { brand: true }
        },
        generation: true,
        technicalSpecs: true,
        priceHistory: {
            orderBy: { createdAt: "desc" as const },
            take: 1,
        }
    },
});

// Payload d'un Modèle (Complet)
export const carModelWithDetails = Prisma.validator<Prisma.CarModelDefaultArgs>()({
    include: {
        brand: true,
        generations: true,
        finitions: {
            select: {
                id: true,
                name: true,
                basePrice: true,
                technicalSpecs: {
                    select: { fuelType: true, transmission: true, dinPower: true }
                }
            }
        }
    },
});

// Select Payload pour les listes (Card)
export const finitionCardSelect = Prisma.validator<Prisma.FinitionSelect>()({
    id: true,
    slug: true,
    name: true,
    basePrice: true,
    images: true,
    isPromoted: true,
    carModel: {
        select: {
            name: true,
            category: true,
            aiScore: true,
            image: true,
            reliability: true,
            brand: {
                select: { name: true, logo: true, slug: true }
            }
        }
    },
    technicalSpecs: {
        select: { fuelType: true, transmission: true, dinPower: true, consoMixed: true }
    },
    priceHistory: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
        select: { promotionalPrice: true, startDate: true, endDate: true }
    }
});

// ==========================================
// 3. TYPES EXPORTÉS POUR L'APPLICATION
// ==========================================

export type FinitionComplete = Omit<
    Prisma.FinitionGetPayload<typeof finitionWithDetails>,
    'safetyFeatures' | 'comfortFeatures' | 'aestheticFeatures'
> & {
    safetyFeatures: SafetyFeatures;
    comfortFeatures: ComfortFeatures;
    aestheticFeatures: AestheticFeatures;
};

export type FinitionCard = Prisma.FinitionGetPayload<{ select: typeof finitionCardSelect }>;

export type CarModelComplete = Prisma.CarModelGetPayload<typeof carModelWithDetails>;
export type Brand = Prisma.BrandGetPayload<{}>;
export type TechnicalSpec = Prisma.TechnicalSpecGetPayload<{}>;
