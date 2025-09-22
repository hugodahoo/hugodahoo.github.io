#!/usr/bin/env python3
"""
Manually fix the data.js file by recreating it with proper JSON syntax
"""

import os
import json

def get_projects_with_media():
    """Scan media folder and return list of project IDs that have media files"""
    media_dir = "site/media"
    projects_with_media = set()
    
    if not os.path.exists(media_dir):
        print("Media directory not found!")
        return projects_with_media
    
    # Get all directories in media folder
    for item in os.listdir(media_dir):
        item_path = os.path.join(media_dir, item)
        if os.path.isdir(item_path) and item != "extra_ignore":
            # Check if directory has any media files
            has_media = False
            for file in os.listdir(item_path):
                file_path = os.path.join(item_path, file)
                if os.path.isfile(file_path):
                    # Check if it's a media file
                    ext = os.path.splitext(file)[1].lower()
                    if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.tif', '.tiff']:
                        has_media = True
                        break
            
            if has_media:
                projects_with_media.add(item)
                print(f"✓ {item} - has media files")
            else:
                print(f"✗ {item} - no media files")
    
    return projects_with_media

def create_clean_data_js(projects_with_media):
    """Create a clean data.js file with proper JSON syntax"""
    
    # Define the projects data with hasMedia property
    projects = [
        {
            "id": "spectral-subjects",
            "title": "SPECTRAL SUBJECTS",
            "year": None,
            "client": "Rafael Lozano-Hemmer / MOCA Jacksonville",
            "role": None,
            "technologies": None,
            "description": "Thermographic cameras, projection mapping, Développement d'une carte thermique interactive de l'espace",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "spectral-subjects" in projects_with_media
        },
        {
            "id": "climate-parliament",
            "title": "CLIMATE PARLIAMENT",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Rice University",
            "role": None,
            "technologies": None,
            "description": "Audio-reactive lighting, interactive sound installation, Développement d'une installation sonore et lumineuse interactive",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "climate-parliament" in projects_with_media
        },
        {
            "id": "field-atmosphonia",
            "title": "FIELD ATMOSPHONIA",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Artis – Naples",
            "role": None,
            "technologies": None,
            "description": "Audio-reactive lighting, immersive sound environment, Développement d'un environnement sonore immersif",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "field-atmosphonia" in projects_with_media
        },
        {
            "id": "kristallstimmen",
            "title": "KRISTALLSTIMMEN",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Swarovski Crystal Worlds",
            "role": None,
            "technologies": None,
            "description": "Interactive audio installation, Développement d'une installation audio interactive",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "kristallstimmen" in projects_with_media
        },
        {
            "id": "shadow-tuner",
            "title": "SHADOW TUNER",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Abu Dhabi",
            "role": None,
            "technologies": None,
            "description": "Interactive projection, real-time audio-reactive visuals, Développement d'une projection interactive",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "shadow-tuner" in projects_with_media
        },
        {
            "id": "collider",
            "title": "COLLIDER",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Lulu Island",
            "role": None,
            "technologies": None,
            "description": "Real-time data visualization, cosmic radiation detection, Développement d'une visualisation en temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "collider" in projects_with_media
        },
        {
            "id": "recurrent-first-dream",
            "title": "RECURRENT FIRST DREAM",
            "year": None,
            "client": "Rafael Lozano-Hemmer / ZONAMACO ARTFAIR",
            "role": None,
            "technologies": None,
            "description": "Oeuvre d'art générative",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "recurrent-first-dream" in projects_with_media
        },
        {
            "id": "translation-island",
            "title": "TRANSLATION ISLAND",
            "year": None,
            "client": "Rafael Lozano-Hemmer / ABU DHABI",
            "role": None,
            "technologies": None,
            "description": "Parcours d'art en extérieur",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "translation-island" in projects_with_media
        },
        {
            "id": "atmospheric-memory",
            "title": "ATMOSPHERIC MEMORY",
            "year": None,
            "client": "Rafael Lozano-Hemmer / Sydney",
            "role": None,
            "technologies": None,
            "description": "Exposition immersive",
            "impact": None,
            "media": ["https://www.instagram.com/ey_global/"],
            "instagram": ["https://www.instagram.com/ey_global/"],
            "cover": None,
            "hasMedia": "atmospheric-memory" in projects_with_media
        },
        {
            "id": "sync",
            "title": "SYNC",
            "year": None,
            "client": "Rafael Lozano-Hemmer / SAN FRANCISCO",
            "role": None,
            "technologies": None,
            "description": "Performance audio réactive",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "sync" in projects_with_media
        },
        {
            "id": "a-generative-movement",
            "title": "A GENERATIVE MOVEMENT",
            "year": None,
            "client": "Rafael Lozano-Hemmer & bitforms gallery / SAN FRANCISCO",
            "role": None,
            "technologies": None,
            "description": "Exposition solo",
            "impact": None,
            "media": ["https://www.instagram.com/bitforms/"],
            "instagram": ["https://www.instagram.com/bitforms/"],
            "cover": None,
            "hasMedia": "a-generative-movement" in projects_with_media
        },
        {
            "id": "techs-mechs",
            "title": "TECHS MECHS",
            "year": None,
            "client": "Rafael Lozano-Hemmer & Gray Area / SAN FRANCISCO",
            "role": None,
            "technologies": None,
            "description": "Exposition solo",
            "impact": None,
            "media": ["https://www.instagram.com/grayareaorg/"],
            "instagram": ["https://www.instagram.com/grayareaorg/"],
            "cover": None,
            "hasMedia": "techs-mechs" in projects_with_media
        },
        {
            "id": "biometric-theatre",
            "title": "BIOMETRIC THEATRE",
            "year": None,
            "client": "Rafael Lozano-Hemmer / HONG KONG",
            "role": None,
            "technologies": None,
            "description": "Exposition solo",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "biometric-theatre" in projects_with_media
        },
        {
            "id": "thermal-drift",
            "title": "THERMAL DRIFT",
            "year": None,
            "client": "Rafael Lozano-Hemmer / NYC ARMORY ARTFAIR",
            "role": None,
            "technologies": None,
            "description": "Oeuvre d'art interactive",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "thermal-drift" in projects_with_media
        },
        {
            "id": "listening-forest",
            "title": "LISTENING FOREST",
            "year": None,
            "client": "Rafael Lozano-Hemmer / CRYSTAL BRIDGES MUSEUM - ARKANSAS",
            "role": None,
            "technologies": None,
            "description": "Parcours d'art en extérieur",
            "impact": None,
            "media": ["https://www.instagram.com/crystalbridgesmuseum/"],
            "instagram": ["https://www.instagram.com/crystalbridgesmuseum/"],
            "cover": None,
            "hasMedia": "listening-forest" in projects_with_media
        },
        {
            "id": "excuse-you",
            "title": "EXCUSE YOU",
            "year": None,
            "client": "Rafael Lozano-Hemmer & Wilde Gallery / BASEL",
            "role": None,
            "technologies": None,
            "description": "Exposition solo",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "excuse-you" in projects_with_media
        },
        {
            "id": "haciendo-agua",
            "title": "HACIENDO AGUA",
            "year": None,
            "client": "Rafael Lozano-Hemmer & Max Estrella Gallery / MADRID",
            "role": None,
            "technologies": None,
            "description": "Exposition solo",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "haciendo-agua" in projects_with_media
        },
        {
            "id": "caudales",
            "title": "CAUDALES",
            "year": None,
            "client": "Rafael Lozano-Hemmer / MADRID CASA DE MEXICO",
            "role": None,
            "technologies": None,
            "description": "Exposition d'oeuvres génératives et interactives",
            "impact": None,
            "media": ["https://www.instagram.com/casademexicoenespana/"],
            "instagram": ["https://www.instagram.com/casademexicoenespana/"],
            "cover": None,
            "hasMedia": "caudales" in projects_with_media
        },
        {
            "id": "hormonium",
            "title": "HORMONIUM",
            "year": None,
            "client": "Rafael Lozano-Hemmer / MADRID",
            "role": None,
            "technologies": None,
            "description": "Oeuvre d'art générative",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "hormonium" in projects_with_media
        },
        {
            "id": "lcs-opening-ceremony",
            "title": "LCS OPENING CEREMONY",
            "year": None,
            "client": "Moment Factory / LOS ANGELES",
            "role": None,
            "technologies": None,
            "description": "Réalité augmentée en direct",
            "impact": None,
            "media": ["https://www.instagram.com/lolesports/"],
            "instagram": ["https://www.instagram.com/lolesports/"],
            "cover": None,
            "hasMedia": "lcs-opening-ceremony" in projects_with_media
        },
        {
            "id": "ecosystemes",
            "title": "ECOSYSTEMES",
            "year": None,
            "client": "MAPP MTL - Aude Guivarch / MONTREAL",
            "role": None,
            "technologies": None,
            "description": "Mapping",
            "impact": None,
            "media": ["https://www.instagram.com/audemaeva/"],
            "instagram": ["https://www.instagram.com/audemaeva/"],
            "cover": None,
            "hasMedia": "ecosystemes" in projects_with_media
        },
        {
            "id": "animistic-imagery",
            "title": "ANIMISTIC IMAGERY",
            "year": None,
            "client": "Moment Factory / BEIJING",
            "role": None,
            "technologies": None,
            "description": "Déambulatoire interactif",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "animistic-imagery" in projects_with_media
        },
        {
            "id": "my-morning-jacket-album-launch",
            "title": "MY MORNING JACKET ALBUM LAUNCH",
            "year": None,
            "client": "Moment Factory / DIFFUSION WEB",
            "role": None,
            "technologies": None,
            "description": "Création de contenu",
            "impact": None,
            "media": ["https://www.instagram.com/mymorningjacket/"],
            "instagram": ["https://www.instagram.com/mymorningjacket/"],
            "cover": None,
            "hasMedia": "my-morning-jacket-album-launch" in projects_with_media
        },
        {
            "id": "billie-eilish-2020-world-tour",
            "title": "BILLIE EILISH 2020 WORLD TOUR",
            "year": None,
            "client": "Moment Factory / WORLD",
            "role": None,
            "technologies": None,
            "description": "Création de contenu temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/billieeilish/"],
            "instagram": ["https://www.instagram.com/billieeilish/"],
            "cover": None,
            "hasMedia": "billie-eilish-2020-world-tour" in projects_with_media
        },
        {
            "id": "panasonic-augmented-basketball-court",
            "title": "PANASONIC AUGMENTED BASKETBALL COURT",
            "year": None,
            "client": "Moment Factory / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "R&D",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "panasonic-augmented-basketball-court" in projects_with_media
        },
        {
            "id": "ocean-park-illumination",
            "title": "OCEAN PARK ILLUMINATION",
            "year": None,
            "client": "Moment Factory / HONG KONG",
            "role": None,
            "technologies": None,
            "description": "Installation interactive",
            "impact": None,
            "media": ["https://www.instagram.com/hkoceanpark/"],
            "instagram": ["https://www.instagram.com/hkoceanpark/"],
            "cover": None,
            "hasMedia": "ocean-park-illumination" in projects_with_media
        },
        {
            "id": "avett-brothers-tour",
            "title": "AVETT BROTHERS TOUR",
            "year": None,
            "client": "Moment Factory /",
            "role": None,
            "technologies": None,
            "description": "Création de contenu",
            "impact": None,
            "media": ["https://www.instagram.com/theavettbrothers/"],
            "instagram": ["https://www.instagram.com/theavettbrothers/"],
            "cover": None,
            "hasMedia": "avett-brothers-tour" in projects_with_media
        },
        {
            "id": "halsey-world-tour",
            "title": "HALSEY WORLD TOUR",
            "year": None,
            "client": "Moment Factory / LOS ANGELES",
            "role": None,
            "technologies": None,
            "description": "Création de contenu",
            "impact": None,
            "media": ["https://www.instagram.com/iamhalsey/"],
            "instagram": ["https://www.instagram.com/iamhalsey/"],
            "cover": None,
            "hasMedia": "halsey-world-tour" in projects_with_media
        },
        {
            "id": "breathless-london-art-now",
            "title": "BREATHLESS : LONDON ART NOW",
            "year": None,
            "client": "Ca' Pesaro Galleria Internazionale d'Arte Moderna & Ed Fornieles / VENEZIA",
            "role": None,
            "technologies": None,
            "description": "Programmation Unity et intégration",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "breathless-london-art-now" in projects_with_media
        },
        {
            "id": "hines-louisiana",
            "title": "HINES LOUISIANA",
            "year": None,
            "client": "Float4 / MONTRÉAL-HOUSTON",
            "role": None,
            "technologies": None,
            "description": "Contenu génératif",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "hines-louisiana" in projects_with_media
        },
        {
            "id": "rock-in-rio",
            "title": "ROCK IN RIO",
            "year": None,
            "client": "Moment Factory / MONTRÉAL-RIO",
            "role": None,
            "technologies": None,
            "description": "Mapping + Tracking en temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "rock-in-rio" in projects_with_media
        },
        {
            "id": "halte-00-îles-de-boucherville",
            "title": "HALTE 00 ÎLES-DE-BOUCHERVILLE",
            "year": None,
            "client": "SÉPAQ / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Architecture + Interactivité",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "halte-00-îles-de-boucherville" in projects_with_media
        },
        {
            "id": "d-vernissage-calder",
            "title": "D-VERNISSAGE CALDER",
            "year": None,
            "client": "Musée des Beaux-Arts / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Installation laser/lumière",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "d-vernissage-calder" in projects_with_media
        },
        {
            "id": "le-choeur-de-géants",
            "title": "LE CHOEUR DE GÉANTS",
            "year": None,
            "client": "Les Univers Givrés / SHAWINIGAN",
            "role": None,
            "technologies": None,
            "description": "Installation interactive",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "le-choeur-de-géants" in projects_with_media
        },
        {
            "id": "dead-obies-doo-wop",
            "title": "DEAD OBIES DOO WOP",
            "year": None,
            "client": "Telescope Production / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Performance laser",
            "impact": None,
            "media": ["https://www.instagram.com/deadobies/"],
            "instagram": ["https://www.instagram.com/deadobies/"],
            "cover": None,
            "hasMedia": "dead-obies-doo-wop" in projects_with_media
        },
        {
            "id": "rymz-gta",
            "title": "RYMZ GTA",
            "year": None,
            "client": "Joy Ride Records / MONTREAL",
            "role": None,
            "technologies": None,
            "description": "Set-Design",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "rymz-gta" in projects_with_media
        },
        {
            "id": "refractions",
            "title": "REFRACTIONS",
            "year": None,
            "client": "Galerie Never Apart / MONTRÉAL - TORONTO",
            "role": None,
            "technologies": None,
            "description": "Oeuvre laser",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "refractions" in projects_with_media
        },
        {
            "id": "d-s-destiny",
            "title": "D.S DESTINY",
            "year": None,
            "client": "Moment Factory / NEW-YORK",
            "role": None,
            "technologies": None,
            "description": "Custom photobooth and game development",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "d-s-destiny" in projects_with_media
        },
        {
            "id": "festival-mode-design",
            "title": "FESTIVAL MODE & DESIGN",
            "year": None,
            "client": "Vincent d'Amérique / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Live generative visuals",
            "impact": None,
            "media": ["https://www.instagram.com/madfestivalofficiel/"],
            "instagram": ["https://www.instagram.com/madfestivalofficiel/"],
            "cover": None,
            "hasMedia": "festival-mode-design" in projects_with_media
        },
        {
            "id": "colors-of-bangkok",
            "title": "COLORS OF BANGKOK",
            "year": None,
            "client": "Moment Factory / BANGKOK",
            "role": None,
            "technologies": None,
            "description": "Visuel en temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "colors-of-bangkok" in projects_with_media
        },
        {
            "id": "ed-fornieles-the-finiliar",
            "title": "ED FORNIELES' THE FINILIAR",
            "year": None,
            "client": "Rosenkranz Foundation / NEW-YORK",
            "role": None,
            "technologies": None,
            "description": "Visualisation de données",
            "impact": None,
            "media": ["https://www.instagram.com/eddfornieles/"],
            "instagram": ["https://www.instagram.com/eddfornieles/"],
            "cover": None,
            "hasMedia": "ed-fornieles-the-finiliar" in projects_with_media
        },
        {
            "id": "sound-tracer",
            "title": "SOUND TRACER",
            "year": None,
            "client": "Moment Factory / NEW YORK",
            "role": None,
            "technologies": None,
            "description": "Audiovisual instrument for kids",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "sound-tracer" in projects_with_media
        },
        {
            "id": "renault-annual-meeting",
            "title": "RENAULT ANNUAL MEETING",
            "year": None,
            "client": "Moment Factory / PARIS",
            "role": None,
            "technologies": None,
            "description": "Capture de mouvement + Visuel en temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/renaultgroup/"],
            "instagram": ["https://www.instagram.com/renaultgroup/"],
            "cover": None,
            "hasMedia": "renault-annual-meeting" in projects_with_media
        },
        {
            "id": "arcade-fire-infinite-content-tour",
            "title": "ARCADE FIRE INFINITE CONTENT TOUR",
            "year": None,
            "client": "Moment Factory / WORLD",
            "role": None,
            "technologies": None,
            "description": "Système de contrôle + visuel en temps réel",
            "impact": None,
            "media": ["https://www.instagram.com/arcadefire/"],
            "instagram": ["https://www.instagram.com/arcadefire/"],
            "cover": None,
            "hasMedia": "arcade-fire-infinite-content-tour" in projects_with_media
        },
        {
            "id": "kontinuum",
            "title": "KONTINUUM",
            "year": None,
            "client": "Moment Factory / OTTAWA",
            "role": None,
            "technologies": None,
            "description": "Parcours immersif et installations interactives",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "kontinuum" in projects_with_media
        },
        {
            "id": "orchestre-symphonique-de-montréal",
            "title": "ORCHESTRE SYMPHONIQUE DE MONTRÉAL",
            "year": None,
            "client": "Moment Factory / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Visuel en temps réel + Danseur",
            "impact": None,
            "media": ["https://www.instagram.com/osmconcerts/"],
            "instagram": ["https://www.instagram.com/osmconcerts/"],
            "cover": None,
            "hasMedia": "orchestre-symphonique-de-montréal" in projects_with_media
        },
        {
            "id": "universal-studios",
            "title": "UNIVERSAL STUDIOS",
            "year": None,
            "client": "Moment Factory / ORLANDO",
            "role": None,
            "technologies": None,
            "description": "R&D Détection de mouvement et installations interactives",
            "impact": None,
            "media": ["https://www.instagram.com/universalorlando/"],
            "instagram": ["https://www.instagram.com/universalorlando/"],
            "cover": None,
            "hasMedia": "universal-studios" in projects_with_media
        },
        {
            "id": "ey-innovation-realized",
            "title": "EY INNOVATION REALIZED",
            "year": None,
            "client": "Moment Factory / SAN FRANCISCO",
            "role": None,
            "technologies": None,
            "description": "Visuel en temps réel + Danseur",
            "impact": None,
            "media": ["https://www.instagram.com/ey_global/"],
            "instagram": ["https://www.instagram.com/ey_global/"],
            "cover": None,
            "hasMedia": "ey-innovation-realized" in projects_with_media
        },
        {
            "id": "tabegami-sama",
            "title": "TABEGAMI SAMA",
            "year": None,
            "client": "Moment Factory / TOKYO",
            "role": None,
            "technologies": None,
            "description": "Exposition interactive",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "tabegami-sama" in projects_with_media
        },
        {
            "id": "ozone",
            "title": "OZONE",
            "year": None,
            "client": "Biennale de Montréal @ Le Livart / MONTREAL",
            "role": None,
            "technologies": None,
            "description": "Installation interactive",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "ozone" in projects_with_media
        },
        {
            "id": "red-hot-chili-peppers-getaway-tour",
            "title": "RED HOT CHILI PEPPERS GETAWAY TOUR",
            "year": None,
            "client": "Moment Factory / WORLD",
            "role": None,
            "technologies": None,
            "description": "Visuel en temps réel + Éclairage cinétique",
            "impact": None,
            "media": ["https://www.instagram.com/chilipeppers/"],
            "instagram": ["https://www.instagram.com/chilipeppers/"],
            "cover": None,
            "hasMedia": "red-hot-chili-peppers-getaway-tour" in projects_with_media
        },
        {
            "id": "nova-lumina",
            "title": "NOVA LUMINA",
            "year": None,
            "client": "Moment Factory / CHANDLER",
            "role": None,
            "technologies": None,
            "description": "Parcours immersif et installation interactive",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "nova-lumina" in projects_with_media
        },
        {
            "id": "aura",
            "title": "AURA",
            "year": None,
            "client": "MONTRÉAL EN LUMIÈRES / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Espace extérieur immersif. Projection architecturale",
            "impact": None,
            "media": ["https://www.instagram.com/momentfactory/"],
            "instagram": ["https://www.instagram.com/momentfactory/"],
            "cover": None,
            "hasMedia": "aura" in projects_with_media
        },
        {
            "id": "en-route-vers-les-jutras",
            "title": "EN ROUTE VERS LES JUTRAS",
            "year": None,
            "client": "Société des arts technologiques / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Vjing",
            "impact": None,
            "media": ["https://www.instagram.com/sat_montreal/"],
            "instagram": ["https://www.instagram.com/sat_montreal/"],
            "cover": None,
            "hasMedia": "en-route-vers-les-jutras" in projects_with_media
        },
        {
            "id": "basel-2022",
            "title": "BASEL 2022 PROJECTS",
            "year": "2022",
            "client": "Rafael Lozano-Hemmer / Basel",
            "role": None,
            "technologies": None,
            "description": "Thermal imaging and interactive installations",
            "impact": None,
            "media": ["https://www.instagram.com/lozanohemmer/"],
            "instagram": ["https://www.instagram.com/lozanohemmer/"],
            "cover": None,
            "hasMedia": "basel-2022" in projects_with_media
        },
        {
            "id": "halte-0-sepaq-iles-de-boucherville",
            "title": "HALTE 0 SÉPAQ ÎLES-DE-BOUCHERVILLE",
            "year": None,
            "client": "SÉPAQ / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "Architecture + Interactivité",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "halte-0-sepaq-iles-de-boucherville" in projects_with_media
        },
        {
            "id": "interactive-basketball",
            "title": "INTERACTIVE BASKETBALL",
            "year": None,
            "client": "Moment Factory / MONTRÉAL",
            "role": None,
            "technologies": None,
            "description": "High Speed Tracking - Using Panasonic high speed projector and tracking system",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "interactive-basketball" in projects_with_media
        },
        {
            "id": "my-morning-jacket",
            "title": "MY MORNING JACKET",
            "year": None,
            "client": "YouTube / WORLD",
            "role": None,
            "technologies": None,
            "description": "Video frame extraction from live performance",
            "impact": None,
            "media": [],
            "instagram": [],
            "cover": None,
            "hasMedia": "my-morning-jacket" in projects_with_media
        }
    ]
    
    # Create the new data.js content
    content = "window.projects = " + json.dumps(projects, indent=4, ensure_ascii=False) + ";"
    
    # Write to file
    with open("site/data.js", "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✓ Created clean data.js with {len(projects)} projects")
    return len(projects)

def update_index_html():
    """Update index.html to filter out projects without media"""
    
    # Read current index.html
    with open("site/index.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if filter script already exists
    if "Filter projects to only show those with media" in content:
        print("✓ Filter script already exists in index.html")
        return
    
    # Add script to filter projects
    filter_script = """
    <script>
    // Filter projects to only show those with media
    document.addEventListener('DOMContentLoaded', function() {
        if (window.projects) {
            // Filter out projects without media
            const originalCount = window.projects.length;
            window.projects = window.projects.filter(project => project.hasMedia === true);
            console.log(`Filtered projects: ${originalCount} -> ${window.projects.length} (showing only those with media)`);
        }
    });
    </script>
    """
    
    # Insert before the closing body tag
    if "</body>" in content:
        content = content.replace("</body>", filter_script + "\n</body>")
        
        # Write back to file
        with open("site/index.html", "w", encoding="utf-8") as f:
            f.write(content)
        
        print("✓ Updated index.html to filter projects without media")
    else:
        print("✗ Could not find </body> tag in index.html")

def main():
    """Main function"""
    print("=== UPDATING PROJECT MEDIA STATUS ===")
    
    # Get projects with media
    projects_with_media = get_projects_with_media()
    print(f"\nFound {len(projects_with_media)} projects with media files")
    
    # Create clean data.js
    total_projects = create_clean_data_js(projects_with_media)
    
    # Update index.html
    update_index_html()
    
    print(f"\n=== UPDATE COMPLETE ===")
    print(f"Total projects: {total_projects}")
    print(f"Projects with media: {len(projects_with_media)}")
    print(f"Projects to hide: {total_projects - len(projects_with_media)}")
    print("Projects without media will now be hidden from the main page")

if __name__ == "__main__":
    main()
