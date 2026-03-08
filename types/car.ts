export interface Brand {
    name: string;
}

export interface CarModel {
    name: string;
    slug?: string | null;
    brand: Brand;
    category: string;
    imageUrl: string;
    aiScore?: number;
    reliability?: number;
    maintCost?: number;
}

export interface Specs {
    moteur: {
        energie: string;
        motorisation: string;
        puissanceDynamique: string | null;
        transmission: string;
        boiteAVitesse: string;
        emplacement: string;
        fiscalPower: number;
        cylindree: string;
        coupleMax: string;
        palettesVolant: boolean;
        powerThermique: string;
        powerElec: string;
        batteryCapacity: string;
    };
    consoPerformances: {
        consoMixte: string | null;
        co2Emission: string | null;
        vitesseMax: string | null;
        acceleration: string | null;
        consoCity: string;
        consoRoad: string;
    };
    dimensions: {
        places: number;
        volumeCoffre: number;
        volumeReservoir: number;
        poids: string;
        longueur: string;
        largeur: string;
        hauteur: string;
        empattement: string;
    };
    securite: {
        airbags: number;
        abs: boolean;
        esp: boolean;
        isofix: boolean;
        antipatinage: boolean;
        aideFreinageUrgence: boolean;
        antidemarrage: boolean;
        aideDemarrageCote: boolean;
        modeConduite: boolean;
        detecteurFatigue: boolean;
        maintienVoie: boolean;
        detecteurAngleMort: boolean;
        detecteurSousGonflage: boolean;
        fermetureAuto: boolean;
        pharesAntibrouillard: boolean;
        alarme: boolean;
    };
    confort: {
        climatisation: string;
        systemeAudio: string;
        ordinateurBord: boolean;
        startStop: boolean;
        regulateurVitesse: boolean;
        detecteurPluie: boolean;
        allumageAutoFeux: boolean;
        freinMainElectrique: boolean;
        ecranTactile: boolean;
        cockpitDigital: boolean;
        reconnaissancePanneaux: boolean;
        affichageTeteHaute: boolean;
        cameraRecul: boolean;
        radarStationnement: boolean;
        parkAssist: boolean;
        commandesVolant: boolean;
        commandesVocales: boolean;
        volantReglable: boolean;
        vitresElectriques: boolean;
        retrosElectriques: boolean;
        retrosRabattables: boolean;
        coffreElectrique: boolean;
        mainsLibres: boolean;
        siegesElectriques: boolean;
        siegesMemoire: boolean;
        banquetteRabattable: boolean;
        navigationGps: boolean;
        wifi: boolean;
        bluetooth: boolean;
        appleCarplay: boolean;
        chargeurSansFil: boolean;
    };
    esthetique: {
        jantesAlu: boolean;
        sellerie: string;
        volantCuir: boolean;
        followMeHome: boolean;
        lumiereAmbiance: boolean;
        feuxJour: boolean;
        phares: string;
        toit: string;
        barresToit: boolean;
        vitresSurteintees: boolean;
    };
}

export interface Car {
    id: string;
    slug?: string | null;
    name: string;
    price: number;
    isPromoted?: boolean;
    promotionalPrice?: number | null;
    promoStartDate?: string | null;
    promoEndDate?: string | null;
    images: string[];
    image?: string | null;
    model: CarModel;
    specs: Specs;
}
