export interface Brand {
    id?: string;
    slug: string;
    name: string;
    origin?: string | null;
    image?: string | null;
    imageAlt?: string | null;
    logo?: string | null;
    logoAlt?: string | null;
    description?: string | null;
    models?: CarModel[];
}

export interface CarModel {
    id?: string;
    slug: string;
    name: string;
    brandId?: string;
    brand: Brand;
    category: string;
    image?: string | null;
    aiScore?: number | null;
    reliability?: number | null;
    maintCost?: number | null;
    startPrice?: number | null;
    endPrice?: number | null;
}

export interface Specs {
    moteur: {
        motorisation?: string | null;
        emplacementMoteur?: string | null;
        energie?: string | null;
        puissanceFiscale?: number | null;
        transmission?: string | null;
        boiteAVitesse?: string | null;
        puissanceDynamique?: string | null;
        cylindree?: number | null;
        coupleMax?: number | null;
        palettesVolant?: string | null;
        puissanceThermique?: number | null;
        puissanceElectrique?: number | null;
        capaciteBatterie?: number | null;
    };
    consoPerformances: {
        consoVille?: number | null;
        consoRoute?: number | null;
        consoMixte?: number | null;
        co2Emission?: number | null;
        vitesseMax?: string | number | null;
        acceleration?: string | number | null;
    };
    dimensions: {
        places?: number | null;
        weight?: number | null;
        length?: number | null;
        width?: number | null;
        height?: number | null;
        wheelbase?: number | null;
        tankVolume?: number | null;
        trunkVolume?: number | null;
        volumeCoffre?: number | null;
        volumeReservoir?: number | null;
        poids?: number | null;
        longueur?: number | null;
        largeur?: number | null;
        hauteur?: number | null;
        empattement?: number | null;
    };
    securite: {
        airbags?: number | null;
        abs?: boolean;
        esp?: boolean;
        antipatinage?: boolean;
        aideFreinageUrgence?: boolean;
        antidemarrage?: boolean;
        aideDemarrageCote?: boolean;
        modeConduite?: boolean;
        detecteurFatigue?: boolean;
        maintienVoie?: boolean;
        detecteurAngleMort?: boolean;
        detecteurSousGonflage?: boolean;
        fermetureAuto?: boolean;
        isofix?: boolean;
        pharesAntibrouillard?: boolean;
        alarme?: boolean;
    };
    confort: {
        climatisation?: string | null;
        systemeAudio?: string | null;
        ordinateurBord?: boolean;
        startStop?: boolean;
        regulateurVitesse?: boolean;
        detecteurPluie?: boolean;
        allumageAutoFeux?: boolean;
        freinMainElectrique?: boolean;
        ecranTactile?: boolean;
        cockpitDigital?: boolean;
        reconnaissancePanneaux?: boolean;
        affichageTeteHaute?: boolean;
        cameraRecul?: boolean;
        radarStationnement?: string | null;
        parkAssist?: boolean;
        commandesVolant?: boolean;
        commandesVocales?: boolean;
        volantReglable?: string | null;
        vitresElectriques?: string | null;
        retrosElectriques?: boolean;
        retrosRabattables?: boolean;
        coffreElectrique?: boolean;
        mainsLibres?: boolean;
        siegesElectriques?: boolean;
        siegesMemoire?: boolean;
        banquetteRabattable?: string | null;
        navigationGps?: boolean;
        wifi?: boolean;
        bluetooth?: boolean;
        appleCarplay?: boolean;
        androidAuto?: boolean;
        chargeurSansFil?: boolean;
    };
    esthetique: {
        jantesAlu?: string | null;
        sellerie?: string | null;
        volantCuir?: boolean;
        followMeHome?: boolean;
        lumiereAmbiance?: boolean;
        feuxJour?: string | null;
        phares?: string | null;
        toit?: string | null;
        barresToit?: boolean;
        vitresSurteintees?: boolean;
    };
}

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roleId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ActivityLog {
    id: string;
    userId: string;
    user?: User;
    action: string;
    details?: string | null;
    createdAt: Date;
}

export interface Car {
    id: string;
    slug: string;
    name: string;
    price: number;
    isPromoted?: boolean;
    promotionalPrice?: number | null;
    images: string[];
    image?: string | null;
    model: CarModel;
    specs: Specs;
}
