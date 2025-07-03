export interface UseCode {
  displayName: string;
  title: string;
}

export function getUseCodeName(useCode: number): string {
  const codeData = codes[useCode];
  return codeData?.displayName ?? "Other";
}

export const codes: Record<number, UseCode> = {
  0: {
    displayName: "Unknown",
    title: "UNKNOWN",
  },
  101: {
    displayName: "Dairy Farm",
    title: "DAIRY FARM",
  },
  102: {
    displayName: "Desert/Barren Land",
    title: "DESERT OR BARREN LAND",
  },
  103: {
    displayName: "Farm Crops",
    title: "FARM, CROPS (**)",
  },
  104: {
    displayName: "Feedlots",
    title: "FEEDLOTS",
  },
  105: {
    displayName: "Farm",
    title: "FARM (IRRIGATED OR DRY)",
  },
  106: {
    displayName: "Horticulture",
    title: "HORTICULTURE, ORNAMENTAL(AGRICULTURAL)",
  },
  107: {
    displayName: "Irrigation",
    title: "IRRIGATION, FLOOD CONTROL",
  },
  108: {
    displayName: "Livestock",
    title: "LIVESTOCK, ANIMALS",
  },
  109: {
    displayName: "Farm Structures",
    title: "MISCELLANEOUS STRUCTURES - RANCH, FARM FIXTURES",
  },
  110: {
    displayName: "Orchard",
    title: "ORCHARD (FRUIT, NUT)",
  },
  111: {
    displayName: "Orchards/Groves",
    title: "ORCHARDS, GROVES  (**)",
  },
  112: {
    displayName: "Pasture",
    title: "PASTURE",
  },
  113: {
    displayName: "Poultry Farm",
    title: "POULTRY FARM (CHICKEN, TURKEY, FISH, BEES, RABBITS)",
  },
  114: {
    displayName: "Ranch",
    title: "RANCH",
  },
  115: {
    displayName: "Reservoir",
    title: "RESERVOIR, WATER SUPPLY",
  },
  116: {
    displayName: "Rural Improved",
    title: "RURAL IMPROVED / NON-RESIDENTIAL",
  },
  117: {
    displayName: "Range Land",
    title: "RANGE LAND (GRAZING)",
  },
  118: {
    displayName: "Agricultural",
    title: "AGRICULTURAL/RURAL (GENERAL)",
  },
  119: {
    displayName: "Truck Crops",
    title: "TRUCK CROPS",
  },
  120: {
    displayName: "Timberland",
    title: "TIMBERLAND, FOREST, TREES",
  },
  121: {
    displayName: "Vineyard",
    title: "VINEYARD",
  },
  122: {
    displayName: "Well Site",
    title: "WELL SITE (AGRICULTURAL)",
  },
  123: {
    displayName: "Wildlife Refuge",
    title: "WILDLIFE (REFUGE)",
  },
  124: {
    displayName: "Convenience Store",
    title: "CONVENIENCE STORE (7-11)",
  },
  125: {
    displayName: "Appliance Store",
    title: "APPLIANCE STORE (CIRCUIT CITY, GOODS BUYS, BEST BUY)",
  },
  126: {
    displayName: "Auto Repair",
    title: "AUTO REPAIR, GARAGE",
  },
  127: {
    displayName: "Vehicle Sales",
    title: "VEHICLE SALES, VEHICLE RENTALS (AUTO/TRUCK/RV/BOAT/ETC)",
  },
  128: {
    displayName: "Bakery",
    title: "BAKERY",
  },
  129: {
    displayName: "Bar/Tavern",
    title: "BAR, TAVERN",
  },
  130: {
    displayName: "Commercial Building",
    title: "COMMERCIAL BUILDING, MAIL ORDER, SHOW ROOM (NON-AUTO), WAREHOUSE",
  },
  131: {
    displayName: "Bed & Breakfast",
    title: "BED & BREAKFAST",
  },
  132: {
    displayName: "Casino",
    title: "CASINO",
  },
  133: {
    displayName: "Cemetery/Funeral",
    title: "CEMETERY, FUNERAL HOME, MORTUARY (COMMERCIAL)",
  },
  134: {
    displayName: "Commercial Common Area",
    title: "COMMON AREA (COMMERCIAL, NOT SHOPPING CENTER)",
  },
  135: {
    displayName: "Commercial",
    title: "COMMERCIAL (GENERAL)",
  },
  136: {
    displayName: "Commercial Office",
    title: "COMMERCIAL OFFICE (GENERAL)",
  },
  137: {
    displayName: "Gas Station Store",
    title: "CONVENIENCE STORE (W/FUEL PUMP)",
  },
  138: {
    displayName: "Commercial Condo",
    title: "COMMERCIAL CONDOMINIUM (NOT OFFICES)",
  },
  139: {
    displayName: "Condo Offices",
    title: "CONDOMINIUM OFFICES",
  },
  140: {
    displayName: "Mixed Use Store/Office",
    title: "STORE/OFFICE (MIXED USE)",
  },
  141: {
    displayName: "Department Store",
    title: "DEPARTMENT STORE (APPAREL, HOUSEHOLD GOODS, FURNITURE)",
  },
  142: {
    displayName: "Dental Building",
    title: "DENTAL BUILDING",
  },
  143: {
    displayName: "Multi-Story Dept Store",
    title: "DEPARTMENT STORE (MULTI-STORY)",
  },
  144: {
    displayName: "Garden Center",
    title: "GARDEN CENTER, HOME IMPROVEMENT (DO-IT-YOURSELF)",
  },
  145: {
    displayName: "Pharmacy",
    title: "DRUG STORE, PHARMACY",
  },
  146: {
    displayName: "Fast Food",
    title: "DRIVE-THRU RESTAURANT, FAST FOOD (**)",
  },
  147: {
    displayName: "Dry Cleaner",
    title: "DRY CLEANER",
  },
  148: {
    displayName: "Restaurant",
    title: "RESTAURANT",
  },
  149: {
    displayName: "Farm Supply",
    title: "FARM SUPPLY & EQUIPMENT (COMMERCIAL)",
  },
  150: {
    displayName: "Financial Building",
    title: "FINANCIAL BUILDING",
  },
  151: {
    displayName: "Grocery Store",
    title: "GROCERY, SUPERMARKET",
  },
  152: {
    displayName: "Private Hospital",
    title: "HOSPITAL - PRIVATE",
  },
  153: {
    displayName: "Hotel/Motel",
    title: "HOTEL/MOTEL",
  },
  154: {
    displayName: "Resort Hotel",
    title: "HOTEL-RESORT",
  },
  155: {
    displayName: "Hotel",
    title: "HOTEL",
  },
  156: {
    displayName: "Kennel",
    title: "KENNEL",
  },
  157: {
    displayName: "Laundromat",
    title: "LAUNDROMAT (SELF-SERVICE)",
  },
  158: {
    displayName: "Liquor Store",
    title: "LIQUOR STORE",
  },
  159: {
    displayName: "Mobile Commercial",
    title: "MOBILE COMMERCIAL UNITS",
  },
  160: {
    displayName: "Medical Building",
    title: "MEDICAL BUILDING (**)",
  },
  161: {
    displayName: "Mixed Commercial/Industrial",
    title: "MIXED USE (COMMERCIAL/INDUSTRIAL) (**)",
  },
  162: {
    displayName: "Mobile Home Park",
    title: "MOBILE HOME PARK, TRAILER PARK",
  },
  163: {
    displayName: "Motel",
    title: "MOTEL",
  },
  164: {
    displayName: "Commercial Multi-Parcel",
    title: "COMMERCIAL MULTI-PARCEL MISCELLANEOUS (**)",
  },
  165: {
    displayName: "Commercial Misc",
    title: "COMMERCIAL MISCELLANEOUS (**)",
  },
  166: {
    displayName: "Nightclub",
    title: "NIGHTCLUB (COCKTAIL LOUNGE)",
  },
  167: {
    displayName: "Shopping Center",
    title: "NEIGHBORHOOD: SHOPPING CENTER, STRIP CENTER, ENTERPRISE ZONE",
  },
  168: {
    displayName: "Nursery/Greenhouse",
    title: "NURSERY, GREENHOUSE, FLORIST (RETAIL, WHOLESALE)",
  },
  169: {
    displayName: "Office Building",
    title: "OFFICE BUILDING",
  },
  170: {
    displayName: "Multi-Story Office",
    title: "OFFICE BUILDING (MULTI-STORY)",
  },
  171: {
    displayName: "Mixed Office/Residential",
    title: "COMMERCIAL OFFICE/RESIDENTIAL (MIXED USE)",
  },
  172: {
    displayName: "Parking Garage",
    title: "PARKING GARAGE, PARKING STRUCTURE",
  },
  173: {
    displayName: "Print Shop",
    title: "PRINTER - RETAIL (PIP, QWIKCOPY, ETC)",
  },
  174: {
    displayName: "Parking Lot",
    title: "PARKING LOT",
  },
  175: {
    displayName: "Day Care",
    title: "DAY CARE, PRE-SCHOOL (COMMERCIAL)",
  },
  176: {
    displayName: "Professional Building",
    title: "PROFESSIONAL BUILDING (MULTI-STORY)",
  },
  177: {
    displayName: "Professional Building",
    title: "PROFESSIONAL BUILDING (LEGAL, INSURANCE, REAL ESTATE, BUSINESS)",
  },
  178: {
    displayName: "Retail Stores",
    title: "RETAIL STORES (PERSONAL SERVICES, PHOTOGRAPHY, TRAVEL)",
  },
  179: {
    displayName: "Regional Mall",
    title: "REGIONAL: SHOPPING CENTER, MALL (W/ANCHOR)",
  },
  180: {
    displayName: "Gas Station",
    title: "GAS STATION",
  },
  181: {
    displayName: "Single Family Residential",
    title: "SINGLE FAMILY RESIDENTIAL (**)",
  },
  182: {
    displayName: "Shopping Center Common Area",
    title: "SHOPPING CENTER COMMON AREA (PARKING ETC)",
  },
  183: {
    displayName: "Community Shopping Center",
    title: "COMMUNITY: SHOPPING CENTER, MINI-MALL",
  },
  184: {
    displayName: "Skyscraper",
    title: "SKYSCRAPER/HIGH-RISE (COMMERCIAL OFFICES)",
  },
  185: {
    displayName: "Service Station with Store",
    title: "SERVICE STATION W/CONVENIENCE STORE (FOOD MART)",
  },
  186: {
    displayName: "Full Service Station",
    title: "SERVICE STATION (FULL SERVICE)",
  },
  187: {
    displayName: "Stores & Apartments",
    title: "STORES & APARTMENTS (**)",
  },
  188: {
    displayName: "Retail Store",
    title: "STORE, RETAIL OUTLET",
  },
  189: {
    displayName: "Take-Out Restaurant",
    title: "TAKE-OUT RESTAURANT (FOOD PREPARATION)",
  },
  190: {
    displayName: "Truck Stop",
    title: "TRUCK STOP (FUEL AND DINER)",
  },
  191: {
    displayName: "Service Shop",
    title: "SERVICE SHOP (TV, RADIO, ELECTRIC, PLUMBING)",
  },
  192: {
    displayName: "Veterinary Hospital",
    title: "VETERINARY, ANIMAL HOSPITAL",
  },
  193: {
    displayName: "Car Wash",
    title: "CAR WASH",
  },
  194: {
    displayName: "Wholesale Outlet",
    title: "WHOLESALE OUTLET, DISCOUNT STORE (FRANCHISE)",
  },
  195: {
    displayName: "Assembly Plant",
    title: "ASSEMBLY (LIGHT INDUSTRIAL)",
  },
  196: {
    displayName: "Bulk Storage",
    title: "BULK STORAGE, TANKS (GASOLINE, FUEL, ETC)",
  },
  197: {
    displayName: "Cannery",
    title: "CANNERY",
  },
  198: {
    displayName: "Construction Services",
    title: "CONSTRUCTION/CONTRACTING SERVICES (INDUSTRIAL)",
  },
  199: {
    displayName: "Chemical Plant",
    title: "CHEMICAL",
  },
  200: {
    displayName: "Industrial Common Area",
    title: "COMMON AREA (INDUSTRIAL)",
  },
  201: {
    displayName: "Industrial Condos",
    title: "CONDOMINIUMS (INDUSTRIAL)",
  },
  202: {
    displayName: "Cold Storage",
    title: "COLD STORAGE",
  },
  203: {
    displayName: "Distillery/Brewery",
    title: "DISTILLERY, BREWERY, BOTTLING",
  },
  204: {
    displayName: "Dump Site",
    title: "DUMP SITE",
  },
  205: {
    displayName: "Factory",
    title: "FACTORY (APPAREL, TEXTILE, LEATHER, MEDIUM MFG)",
  },
  206: {
    displayName: "Food Processing",
    title: "FOOD PROCESSING",
  },
  207: {
    displayName: "Foundry",
    title: "FOUNDRY, INDUSTRIAL PLANT (METAL, RUBBER, PLASTIC)",
  },
  208: {
    displayName: "Food Packing Plant",
    title: "FOOD PACKING, PACKING PLANT (FRUIT, VEGETABLE, MEAT, DAIRY)",
  },
  209: {
    displayName: "Grain Elevator",
    title: "GRAIN ELEVATOR",
  },
  210: {
    displayName: "Heavy Industrial",
    title: "HEAVY INDUSTRIAL (GENERAL)",
  },
  211: {
    displayName: "Heavy Manufacturing",
    title: "HEAVY MANUFACTURING",
  },
  212: {
    displayName: "Industrial",
    title: "INDUSTRIAL (GENERAL)",
  },
  213: {
    displayName: "Industrial Park",
    title: "INDUSTRIAL PARK",
  },
  214: {
    displayName: "Labor Camps",
    title: "LABOR CAMPS (INDUSTRIAL)",
  },
  215: {
    displayName: "Light Industrial",
    title: "LIGHT INDUSTRIAL (10% IMPROVED OFFICE SPACE; MACHINE SHOP)",
  },
  216: {
    displayName: "Industrial Loft",
    title: "INDUSTRIAL LOFT BUILDING, LOFT BUILDING",
  },
  217: {
    displayName: "Lumberyard",
    title: "LUMBERYARD, BUILDING MATERIALS",
  },
  218: {
    displayName: "Lumber Manufacturing",
    title: "LUMBER & WOOD PRODUCT MFG (INCLUDING FURNITURE)",
  },
  219: {
    displayName: "Marine Facility",
    title: "MARINE FACILITY/BOARD REPAIRS (SMALL CRAFT, SAILBOAT)",
  },
  220: {
    displayName: "Light Manufacturing",
    title: "MANUFACTURING (LIGHT)",
  },
  221: {
    displayName: "Mill",
    title: "MILL (FEED, GRAIN, PAPER, LUMBER, TEXTILE, PULP",
  },
  222: {
    displayName: "Mining/Quarries",
    title: "MINING, MINERAL, QUARRIES (**)",
  },
  223: {
    displayName: "Industrial Misc",
    title: "INDUSTRIAL MISCELLANEOUS (**)",
  },
  224: {
    displayName: "Multi-Tenant Industrial",
    title: "MULTI-TENANT INDUSTRIAL BUILDING",
  },
  225: {
    displayName: "Paper Manufacturing",
    title: "PAPER PRODUCT MFG & RELATED PRODUCTS",
  },
  226: {
    displayName: "Refinery",
    title: "REFINERY, PETROLEUM PRODUCTS",
  },
  227: {
    displayName: "Printing/Publishing",
    title: "PRINTING * PUBLISHING (LIGHT INDUSTRIAL)",
  },
  228: {
    displayName: "Processing Plant",
    title: "PROCESSING PLANT (MINERALS, CEMENT, ROCK, GRAVEL, GLASS, CLAY)",
  },
  229: {
    displayName: "Mini-Warehouse",
    title: "MINI-WAREHOUSE, STORAGE",
  },
  230: {
    displayName: "Quarries",
    title: "QUARRIES (SAND, GRAVEL, ROCK)",
  },
  231: {
    displayName: "R&D Facility",
    title:
      "R&D FACILITY, LABORATORY, RESEARCH FACILITY, COSMETICS, PHARMACEUTICAL",
  },
  232: {
    displayName: "Recycling",
    title: "RECYCLING (METAL, PAPER, GLASS)",
  },
  233: {
    displayName: "Shipyard",
    title: "SHIPYARD - BUILT OR REPAIRED (SEAGOING VESSELS)",
  },
  234: {
    displayName: "Slaughter House",
    title: "SLAUGHTER HOUSE, STOCKYARD",
  },
  235: {
    displayName: "Storage Yard",
    title: "STORAGE YARD (JUNK, AUTO WRECKING, SALVAGE)",
  },
  236: {
    displayName: "Open Storage",
    title: "STORAGE YARD, OPEN STORAGE (LIGHT EQUIPMENT, MATERIAL)",
  },
  237: {
    displayName: "Sugar Refinery",
    title: "SUGAR REFINERY",
  },
  238: {
    displayName: "Warehouse",
    title: "WAREHOUSE, STORAGE",
  },
  239: {
    displayName: "Winery",
    title: "WINERY",
  },
  240: {
    displayName: "Waste Disposal",
    title: "WASTE DISPOSAL, SEWAGE (PROCESSING, DISPOSAL, STORAGE, TREATMENT)",
  },
  241: {
    displayName: "Common Area",
    title: "COMMON AREA (MISC) (**)",
  },
  242: {
    displayName: "Easement",
    title: "EASEMENT (MISC) (**)",
  },
  243: {
    displayName: "Homestead",
    title: "HOMESTEAD (MISC) (**)",
  },
  244: {
    displayName: "Leasehold Rights",
    title: "LEASEHOLD RIGHTS (MISC) (**)",
  },
  245: {
    displayName: "Oil & Gas Wells",
    title: "PETROLEUM & GAS WELLS (MISC) (**)",
  },
  246: {
    displayName: "Pipeline",
    title: "PIPELINE OR RIGHT-OF-WAY",
  },
  247: {
    displayName: "Possessory Interest",
    title: "POSSESSORY INTEREST (MISC) (**)",
  },
  248: {
    displayName: "Railroad",
    title: "RAIL (RIGHT-OF-WAY & TRACK)",
  },
  249: {
    displayName: "Road",
    title: "ROAD (RIGHT-OF-WAY)",
  },
  250: {
    displayName: "Royalty Interest",
    title: "ROYALTY INTEREST",
  },
  251: {
    displayName: "Right-of-Way",
    title: "RIGHT-OF-WAY (NOT RAIL, ROAD OR UTILITY)",
  },
  252: {
    displayName: "Sub-Surface Rights",
    title: "SUB-SURFACE RIGHTS (MINERAL)",
  },
  253: {
    displayName: "Surface Rights",
    title: "SURFACE RIGHTS (GRAZING, TIMBER, COAL, ETC.)",
  },
  254: {
    displayName: "Unknown",
    title: "UNKNOWN (**)",
  },
  255: {
    displayName: "Utilities",
    title: "UTILITIES (RIGHT-OF-WAY ONLY)",
  },
  256: {
    displayName: "Water Rights",
    title: "WATER RIGHTS (MISC)",
  },
  257: {
    displayName: "Working Interest",
    title: "WORKING INTEREST",
  },
  258: {
    displayName: "Airport",
    title: "AIRPORT & RELATED",
  },
  259: {
    displayName: "Arcades",
    title: "ARCADES (AMUSEMENT)",
  },
  260: {
    displayName: "Arena/Convention Center",
    title: "ARENA, CONVENTION CENTER",
  },
  261: {
    displayName: "Auditorium",
    title: "AUDITORIUM",
  },
  262: {
    displayName: "Outdoor Recreation",
    title: "OUTDOOR RECREATION: BEACH, MOUNTAIN, DESERT",
  },
  263: {
    displayName: "Pool Hall",
    title: "POOL HALL, BILLIARD PARLOR",
  },
  264: {
    displayName: "Bowling Alley",
    title: "BOWLING ALLEY",
  },
  265: {
    displayName: "Bus Terminal",
    title: "BUS TERMINAL",
  },
  266: {
    displayName: "Auto Transportation",
    title: "COMMERCIAL AUTO TRANSPORTATION/STORAGE",
  },
  267: {
    displayName: "Country Club",
    title: "COUNTRY CLUB",
  },
  268: {
    displayName: "Centrally Assessed",
    title: "CENTRALLY ASSESSED",
  },
  269: {
    displayName: "Charitable Organization",
    title: "CHARITABLE ORGANIZATION, FRATERNAL",
  },
  270: {
    displayName: "Clubs/Lodges",
    title: "CLUBS, LODGES, PROFESSIONAL ASSOCIATIONS",
  },
  271: {
    displayName: "Community Center",
    title: "COMMUNITY CENTER (EXEMPT)",
  },
  272: {
    displayName: "Communications",
    title: "COMMUNICATIONS",
  },
  273: {
    displayName: "Campground",
    title: "CAMPGROUND, RV PARK",
  },
  274: {
    displayName: "Private College",
    title: "COLLEGE, UNIVERSITY, VOCATIONAL SCHOOL - PRIVATE",
  },
  275: {
    displayName: "Crematorium",
    title: "CREMATORIUM, MORTUARY (EXEMPT)",
  },
  276: {
    displayName: "Cable TV Station",
    title: "CABLE TV STATION",
  },
  277: {
    displayName: "Municipal Property",
    title: "CITY, MUNICIPAL, TOWN, VILLAGE OWNED (EXEMPT)",
  },
  278: {
    displayName: "County Property",
    title: "COUNTY OWNED (EXEMPT)",
  },
  279: {
    displayName: "Dance Hall",
    title: "DANCE HALL",
  },
  280: {
    displayName: "Distribution Warehouse",
    title: "DISTRIBUTION WAREHOUSE (REGIONAL)",
  },
  281: {
    displayName: "Drive-In Theater",
    title: "DRIVE-IN THEATER",
  },
  282: {
    displayName: "Cemetery",
    title: "CEMETERY (EXEMPT)",
  },
  283: {
    displayName: "Emergency Services",
    title: "EMERGENCY (POLICE, FIRE, RESCUE, SHELTERS, ANIMAL SHELTER)",
  },
  284: {
    displayName: "Exempt Property",
    title: "EXEMPT (FULL OR PARTIAL)",
  },
  285: {
    displayName: "Fairgrounds",
    title: "FAIRGROUNDS",
  },
  286: {
    displayName: "Federal Property",
    title: "FEDERAL PROPERTY (EXEMPT)",
  },
  287: {
    displayName: "Fish Camps",
    title: "FISH CAMPS, GAME CLUB TARGET SHOOTING",
  },
  288: {
    displayName: "Forest/Park",
    title: "FOREST (PARK, RESERVE, RECREATION, CONSERVATION)",
  },
  289: {
    displayName: "Freeways",
    title: "FREEWAYS, STATE HWYS",
  },
  290: {
    displayName: "Driving Range",
    title: "DRIVING RANGE (GOLF)",
  },
  291: {
    displayName: "Transportation",
    title: "TRANSPORTATION (GENERAL)",
  },
  292: {
    displayName: "Go-Carts/Mini Golf",
    title: "GO-CARTS, MINIATURE GOLD, WATER SLIDES",
  },
  293: {
    displayName: "Golf Course",
    title: "GOLF COURSE",
  },
  294: {
    displayName: "Government Property",
    title: "GOVERNMENTAL / PUBLIC USE (GENERAL)",
  },
  295: {
    displayName: "Government Office",
    title: "GOVT. ADMINISTRATIVE OFFICE (FEDERAL, STATE, LOCAL, COURT HOUSE)",
  },
  296: {
    displayName: "Gym/Health Spa",
    title: "GYM, HEALTH SPA",
  },
  297: {
    displayName: "Historical District",
    title: "HISTORICAL DISTRICT",
  },
  298: {
    displayName: "Cultural/Historical",
    title: "CULTURAL, HISTORICAL (MONUMENTS, HOMES, MUSEUMS, OTHER)",
  },
  299: {
    displayName: "Historical Lodging",
    title: "HISTORICAL TRANSIENT LODGING (HOTEL, MOTEL)",
  },
  300: {
    displayName: "Harbor/Marine Transport",
    title: "HARBOR & MARINE TRANSPORTATION",
  },
  301: {
    displayName: "Historical Office",
    title: "HISTORICAL OFFICE",
  },
  302: {
    displayName: "Public Hospital",
    title: "HOSPITAL - PUBLIC",
  },
  303: {
    displayName: "Historical Park",
    title: "HISTORICAL PARK, SITE, MISC.",
  },
  304: {
    displayName: "Historical Private",
    title: "HISTORICAL - PRIVATE (GENERAL)",
  },
  305: {
    displayName: "Historical Recreation",
    title: "HISTORICAL RECREATION, ENTERTAINMENT",
  },
  306: {
    displayName: "Historical Residence",
    title: "HISTORICAL RESIDENCE",
  },
  307: {
    displayName: "Historical Retail",
    title: "HISTORICAL RETAIL",
  },
  308: {
    displayName: "Historical Warehouse",
    title: "HISTORICAL WAREHOUSE",
  },
  309: {
    displayName: "Indian Lands",
    title: "INDIAN LANDS (**)",
  },
  310: {
    displayName: "Institutional",
    title: "INSTITUTIONAL (GENERAL)",
  },
  311: {
    displayName: "Marina/Yacht Club",
    title: "MARINA, BOAT SLIPS, YACHT CLUB, BOAT LANDING",
  },
  312: {
    displayName: "Medical Clinic",
    title: "MEDICAL CLINIC",
  },
  313: {
    displayName: "Microwave",
    title: "MICROWAVE",
  },
  314: {
    displayName: "Military",
    title:
      "MILITARY (OFFICE, BASE, POST, PORT, RESERVE, WEAPON RANGE, TEST SITES)",
  },
  315: {
    displayName: "Miscellaneous",
    title: "MISCELLANEOUS (GENERAL)",
  },
  316: {
    displayName: "Museum/Library",
    title: "MUSEUM, LIBRARY, ART GALLERY (RECREATIONAL)",
  },
  317: {
    displayName: "Natural Resources",
    title: "NATURAL RESOURCES",
  },
  318: {
    displayName: "Recreational Non-Taxable",
    title: "RECREATIONAL NON-TAXABLE (CAMPS, BOY SCOUTS)",
  },
  319: {
    displayName: "Correctional Facility",
    title: "CORRECTIONAL FACILITY, JAILS, PRISONS, INSANE ASYLUM",
  },
  320: {
    displayName: "Children's Home",
    title: "CHILDRENS HOME, ORPHANAGE",
  },
  321: {
    displayName: "Public Health Care",
    title: "PUBLIC HEALTH CARE FACILITY (EXEMPT)",
  },
  322: {
    displayName: "Park/Playground",
    title: "PARK, PLAYGROUND, PICNIC AREA",
  },
  323: {
    displayName: "Piers/Wharf",
    title: "PIERS, WHARF (RECREATION)",
  },
  324: {
    displayName: "Pollution Control",
    title: "POLLUTION CONTROL",
  },
  325: {
    displayName: "Post Office",
    title: "POST OFFICE",
  },
  326: {
    displayName: "Public Swimming Pool",
    title: "PUBLIC SWIMMING POOL",
  },
  327: {
    displayName: "Amusement Park",
    title: "AMUSEMENT PARK, TOURIST ATTRACTION",
  },
  328: {
    displayName: "Private School",
    title: "PAROCHIAL SCHOOL, PRIVATE SCHOOL",
  },
  329: {
    displayName: "Public Utility",
    title: "PUBLIC UTILITY (ELECTRIC, WATER, GAS, ETC.)",
  },
  330: {
    displayName: "Railroad",
    title: "RAILROAD & RELATED",
  },
  331: {
    displayName: "Racquet/Tennis Court",
    title: "RACQUET COURT, TENNIS COURT",
  },
  332: {
    displayName: "Recreational Center",
    title: "RECREATIONAL CENTER",
  },
  333: {
    displayName: "Tax Abatement",
    title: "REGULATING DISTRICTS & ASSESSMENTS; TAX ABATEMENT",
  },
  334: {
    displayName: "Recreation/Entertainment",
    title: "RECREATIONAL/ENTERTAINMENT (GENERAL)",
  },
  335: {
    displayName: "Redevelopment Zone",
    title: "REDEVELOPMENT AGENCY OR ZONE",
  },
  336: {
    displayName: "Religious/Church",
    title: "RELIGIOUS, CHURCH, WORSHIP (SYNAGOGUE, TEMPLE, PARSONAGE)",
  },
  337: {
    displayName: "Riding Stable",
    title: "RIDING STABLE, TRAILS",
  },
  338: {
    displayName: "Roads/Bridges",
    title: "ROADS, STREETS, BRIDGES",
  },
  339: {
    displayName: "Care Homes",
    title: "HOMES (RETIRED, HANDICAP, REST, CONVALESCENT, NURSING)",
  },
  340: {
    displayName: "Radio/TV Station",
    title: "RADIO OR TV STATION",
  },
  341: {
    displayName: "Special Assessments",
    title: "SBE - SPECIAL ASSESSMENTS (**)",
  },
  342: {
    displayName: "Public School",
    title: "PUBLIC SCHOOL (ADMINISTRATION, CAMPUS, DORMS, INSTRUCTION)",
  },
  343: {
    displayName: "Skating Rink",
    title: "SKATING RINK, ICE SKATING, ROLLER SKATING",
  },
  344: {
    displayName: "State Property",
    title: "STATE OWNED (EXEMPT)",
  },
  345: {
    displayName: "Special Purpose",
    title: "SPECIAL PURPOSE",
  },
  346: {
    displayName: "Stadium",
    title: "STADIUM",
  },
  347: {
    displayName: "Telegraph/Telephone",
    title: "TELEGRAPH, TELEPHONE",
  },
  348: {
    displayName: "Movie Theater",
    title: "THEATER (MOVIE)",
  },
  349: {
    displayName: "Transportation",
    title: "TRANSPORTATION (AIR, RAIL, BUS) (**)",
  },
  350: {
    displayName: "Race Track",
    title: "RACE TRACK (AUTO, DOG, HORSE)",
  },
  351: {
    displayName: "Truck Terminal",
    title: "TRUCK TERMINAL (MOTOR FREIGHT)",
  },
  352: {
    displayName: "Public University",
    title: "COLLEGES, UNIVERSITY - PUBLIC",
  },
  353: {
    displayName: "Private Utility",
    title: "PRIVATE UTILITY (ELECTRIC, WATER, GAS, ETC.)",
  },
  354: {
    displayName: "Welfare/Social Service",
    title: "WELFARE, SOCIAL SERVICE, LOW INCOME HOUSING (EXEMPT)",
  },
  355: {
    displayName: "Zoo",
    title: "ZOO",
  },
  356: {
    displayName: "Other Exempt",
    title: "OTHER EXEMPT PROPERTY",
  },
  357: {
    displayName: "Garden Apartments",
    title: "GARDEN APT, COURT APT (5+ UNITS)",
  },
  358: {
    displayName: "High-Rise Apartments",
    title: "HIGH-RISE APARTMENTS",
  },
  359: {
    displayName: "Large Apartment Complex",
    title: "APARTMENT HOUSE (100+ UNITS)",
  },
  360: {
    displayName: "Apartments",
    title: "APARTMENTS (GENERIC)",
  },
  361: {
    displayName: "Apartment House",
    title: "APARTMENT HOUSE (5+ UNITS)",
  },
  362: {
    displayName: "Boarding House",
    title: "BOARDING/ROOMING HOUSE, APT HOTEL",
  },
  363: {
    displayName: "Bungalow",
    title: "BUNGALOW (RESIDENTIAL)",
  },
  364: {
    displayName: "Cluster Home",
    title: "CLUSTER HOME",
  },
  365: {
    displayName: "Residential Common Area",
    title: "COMMON AREA (RESIDENTIAL) (**)",
  },
  366: {
    displayName: "Condominium",
    title: "CONDOMINIUM (**)",
  },
  367: {
    displayName: "Cooperative",
    title: "COOPERATIVE (**)",
  },
  368: {
    displayName: "Dormitory",
    title: "DORMITORY, GROUP QUARTERS (RESIDENTIAL)",
  },
  369: {
    displayName: "Duplex",
    title: "DUPLEX (2 UNITS, ANY COMBINATION)",
  },
  370: {
    displayName: "Fraternity/Sorority House",
    title: "FRATERNITY HOUSE, SORORITY HOUSE",
  },
  371: {
    displayName: "Manufactured Home",
    title: "MANUFACTURED, MODULAR, PRE-FABRICATED HOMES",
  },
  372: {
    displayName: "Multi-Family Dwelling",
    title: "MULTI-FAMILY DWELLINGS (GENERIC, ANY COMBINATION)",
  },
  373: {
    displayName: "Mobile Home",
    title: "MOBILE HOME",
  },
  374: {
    displayName: "Residential Multi-Parcel",
    title: "RESIDENTIAL MULTI-PARCEL MISCELLANEOUS",
  },
  375: {
    displayName: "Residential Misc",
    title: "MISCELLANEOUS (RESIDENTIAL) (**)",
  },
  376: {
    displayName: "Patio Home",
    title: "PATIO HOME",
  },
  377: {
    displayName: "Planned Unit Development",
    title: "PLANNED UNIT DEVELOPMENT (PUD)",
  },
  378: {
    displayName: "Quadplex",
    title: "QUADPLEX (4 UNITS, ANY COMBINATION)",
  },
  379: {
    displayName: "Condo Development",
    title: "CONDOMINIUM DEVELOPMENT (ASSOCIATION ASSESSMENT) (**)",
  },
  380: {
    displayName: "Single Family Residential",
    title: "RESIDENTIAL (GENERAL/SINGLE)",
  },
  381: {
    displayName: "Multi-Family Residential",
    title: "RESIDENTIAL INCOME (GENERAL/MULTI-FAMILY)",
  },
  382: {
    displayName: "Row House",
    title: "ROW HOUSE",
  },
  383: {
    displayName: "Rural Residence",
    title: "RURAL RESIDENCE",
  },
  384: {
    displayName: "Vacation Residence",
    title: "SEASONAL, CABIN, VACATION RESIDENCE",
  },
  385: {
    displayName: "Single Family Residence",
    title: "SINGLE FAMILY RESIDENCE",
  },
  386: {
    displayName: "Townhouse",
    title: "TOWNHOUSE",
  },
  387: {
    displayName: "Timeshare",
    title: "TIMESHARE",
  },
  388: {
    displayName: "Triplex",
    title: "TRIPLEX (3 UNITS, ANY COMBINATION)",
  },
  389: {
    displayName: "Vacant Land",
    title: "VACANT LAND",
  },
  390: {
    displayName: "Zero Lot Line",
    title: "ZERO LOT LINE (RESIDENTIAL)",
  },
  391: {
    displayName: "Abandoned/Contaminated Site",
    title: "ABANDONED SITE, CONTAMINATED SITE",
  },
  392: {
    displayName: "Agricultural Vacant",
    title: "AGRICULTURAL (UNIMPROVED) - VACANT LAND (**)",
  },
  393: {
    displayName: "Vacant Commercial",
    title: "VACANT COMMERCIAL",
  },
  394: {
    displayName: "Government Vacant",
    title: "GOVERNMENT - VACANT LAND",
  },
  395: {
    displayName: "Industrial Vacant",
    title: "INDUSTRIAL - VACANT LAND",
  },
  396: {
    displayName: "Institutional Vacant",
    title: "INSTITUTIONAL - VACANT LAND",
  },
  397: {
    displayName: "Vacant Miscellaneous",
    title: "VACANT MISCELLANEOUS (**)",
  },
  398: {
    displayName: "Multi-Family Vacant",
    title: "MULTI-FAMILY - VACANT LAND",
  },
  399: {
    displayName: "Private Preserve",
    title: "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
  },
  400: {
    displayName: "Recreational Vacant",
    title: "RECREATIONAL - VACANT LAND",
  },
  401: {
    displayName: "Residential Vacant",
    title: "RESIDENTIAL - VACANT LAND",
  },
  402: {
    displayName: "Under Construction",
    title: "UNDER CONSTRUCTION",
  },
  403: {
    displayName: "Unusable Land",
    title: "UNUSABLE LAND (REMNANT, STEEP, ETC.)",
  },
  404: {
    displayName: "Waste Land",
    title: "WASTE LAND, MARSH, SWAMP, SUBMERGED - VACANT LAND",
  },
  406: {
    displayName: "Water Area",
    title: "WATER AREA (LAKES, RIVER, SHORE) - VACANT LAND",
  },
  407: {
    displayName: "Common Area",
    title: "COMMON AREA (MISC.)",
  },
  408: {
    displayName: "Temporary Structures",
    title: "TEMPORARY STRUCTURES",
  },
  409: {
    displayName: "Vacant Land Exempt",
    title: "VACANT LAND - EXEMPT",
  },
  410: {
    displayName: "Sports Complex",
    title: "SPORTS COMPLEX",
  },
  411: {
    displayName: "Personal Property",
    title: "PERSONAL PROPERTY (GENERAL)",
  },
  412: {
    displayName: "Pet Boarding",
    title: "PET BOARDING & GROOMING",
  },
  413: {
    displayName: "Crops in Ground",
    title: "CROPS (IN GROUND)",
  },
  414: {
    displayName: "Structures",
    title: "STRUCTURES (GENERAL)",
  },
  415: {
    displayName: "Aircraft",
    title: "AIRCRAFT",
  },
  416: {
    displayName: "Landominium",
    title: "LANDOMINIUM",
  },
  417: {
    displayName: "Surface Rights",
    title: "SURFACE RIGHTS (GRAZING, TIMBER, COAL, ETC.) (**)",
  },
  418: {
    displayName: "Residential Parking",
    title: "RESIDENTIAL PARKING GARAGE",
  },
  419: {
    displayName: "Inventory",
    title: "INVENTORY",
  },
  420: {
    displayName: "Motor Vehicles",
    title: "MOTOR VEHICLES (CARS, TRUCKS, ETC.)",
  },
  421: {
    displayName: "Residential Condo Building",
    title: "CONDOMINIUM BUILDING (RESIDENTIAL)",
  },
  422: {
    displayName: "Misc Structures",
    title: "MISC STRUCTURES NOT OTHERWISE CLASSED (BILLBOARDS, ETC.)",
  },
  423: {
    displayName: "Barndominium",
    title: "BARNDOMINIUM",
  },
  424: {
    displayName: "Sub-Surface Rights",
    title: "SUB-SURFACE RIGHTS (MINERAL) (**)",
  },
  425: {
    displayName: "Goods in Transit",
    title: "GOODS IN TRANSIT",
  },
  426: {
    displayName: "Right-of-Way",
    title: "RIGHT-OF-WAY (NOT RAIL, ROAD OR UTILITY) (**)",
  },
  427: {
    displayName: "Spacecraft",
    title: "SPACECRAFT",
  },
  428: {
    displayName: "Rail Right-of-Way",
    title: "RAIL (RIGHT-OF-WAY & TRACK) (**)",
  },
  429: {
    displayName: "Structures on Leased Land",
    title: "STRUCTURES ON LEASED LAND",
  },
  430: {
    displayName: "Royalty Interest",
    title: "ROYALTY INTEREST (**)",
  },
  431: {
    displayName: "Possessory Interest",
    title: "POSSESSORY INTEREST (MISC.)",
  },
  432: {
    displayName: "Watercraft",
    title: "WATERCRAFT (SHIPS, BOATS, PWCS, ETC.)",
  },
  433: {
    displayName: "Self-Serve Car Wash",
    title: "CAR WASH - SELF-SERVE",
  },
  434: {
    displayName: "Rolling Stock",
    title: "ROLLING STOCK (RAILROAD)",
  },
  435: {
    displayName: "Water Rights",
    title: "WATER RIGHTS (MISC.)",
  },
  436: {
    displayName: "Misc Personal Property",
    title: "MISC PERSONAL PROPERTY NOT OTHERWISE CLASSED",
  },
  437: {
    displayName: "Intangible Property",
    title: "INTANGIBLE PERSONAL PROPERTY",
  },
  438: {
    displayName: "Leasehold Rights",
    title: "LEASEHOLD RIGHTS (MISC.)",
  },
  439: {
    displayName: "Misc Business Property",
    title: "MISC. BUSINESS PERSONAL PROPERTY NOT OTHERWISE CLASSED",
  },
  440: {
    displayName: "Homestead",
    title: "HOMESTEAD (MISC.)",
  },
  441: {
    displayName: "Vehicles",
    title: "VEHICLES (GENERAL)",
  },
  442: {
    displayName: "Utilities Right-of-Way",
    title: "UTILITIES (RIGHT-OF-WAY ONLY) (**)",
  },
  443: {
    displayName: "Pipeline",
    title: "PIPELINE OR RIGHT-OF-WAY (**)",
  },
  444: {
    displayName: "Misc Vehicles",
    title: "MISC VEHICLES NOT OTHERWISE CLASSED (ANTIQUES, ETC.)",
  },
  445: {
    displayName: "Business Personal Property",
    title: "BUSINESS PERSONAL PROPERTY (GENERAL)",
  },
  446: {
    displayName: "Harvested Crops",
    title: "CROPS (HARVESTED)",
  },
  447: {
    displayName: "Tiny House",
    title: "TINY HOUSE",
  },
  448: {
    displayName: "Residential Storage",
    title: "RESIDENTIAL STORAGE SPACE",
  },
  449: {
    displayName: "Roadside Market",
    title: "ROADSIDE MARKET",
  },
  450: {
    displayName: "Cannabis Grow Facility",
    title: "CANNABIS GROW FACILITY",
  },
  451: {
    displayName: "Cellular",
    title: "CELLULAR",
  },
  452: {
    displayName: "Garden Home",
    title: "GARDEN HOME",
  },
  453: {
    displayName: "Destroyed/Uninhabitable",
    title: "VACANT LAND - DESTROYED/UNINHABITABLE IMPROVEMENT",
  },
  454: {
    displayName: "Road Right-of-Way",
    title: "ROAD (RIGHT-OF-WAY) (**)",
  },
  455: {
    displayName: "Equipment/Supplies",
    title: "EQUIPMENT / SUPPLIES",
  },
  456: {
    displayName: "Petroleum/Gas Wells",
    title: "PETROLEUM & GAS WELLS (MISC.)",
  },
  457: {
    displayName: "Working Interest",
    title: "WORKING INTEREST (**)",
  },
  458: {
    displayName: "Automated Car Wash",
    title: "CAR WASH - AUTOMATED",
  },
  459: {
    displayName: "Cannabis Dispensary",
    title: "CANNABIS DISPENSARY",
  },
  460: {
    displayName: "Recreational Vehicles",
    title: "RECREATIONAL VEHICLES / TRAVEL TRAILERS",
  },
  461: {
    displayName: "Residential Cooperative",
    title: "COOPERATIVE BUILDING (RESIDENTIAL)",
  },
  462: {
    displayName: "Unspecified Improvement",
    title: "VACANT LAND - UNSPECIFIED IMPROVEMENT",
  },
  463: {
    displayName: "Unspecified Use",
    title: "PARCELS WITH IMPROVEMENTS, USE NOT SPECIFIED",
  },
  464: {
    displayName: "Barber/Hair Salon",
    title: "BARBER/HAIR SALON",
  },
  465: {
    displayName: "Easement",
    title: "EASEMENT (MISC.)",
  },
  466: {
    displayName: "Livestock",
    title: "LIVESTOCK (ANIMALS, FISH, BIRDS, ETC.)",
  },
  1010: {
    displayName: "Residential Common Area",
    title: "RESIDENTIAL COMMON AREA (CONDO/PUD/ETC.)",
  },
  1023: {
    displayName: "Accessory Dwelling Unit",
    title: "ACCESSORY DWELLING UNIT (ADU)",
  },
  1114: {
    displayName: "Residential Condo Development",
    title: "RESIDENTIAL CONDOMINIUM DEVELOPMENT (ASSOCIATION ASSESSMENT)",
  },
  2013: {
    displayName: "Fast Food Drive-Thru",
    title: "Fast Food Restaurant / Drive-thru",
  },
  6003: {
    displayName: "Mining Facility",
    title: "Mining facility (oil; gas; mineral, precious metals)",
  },
  7004: {
    displayName: "Crop Land",
    title: "CROP LAND, FIELD CROPS, ROW CROPS (ALL SOIL CLASSES)",
  },
  7014: {
    displayName: "Agricultural Grove",
    title: "GROVE (AGRICULTURAL)",
  },
  8008: {
    displayName: "Rural/Agricultural Vacant",
    title: "Rural/Agricultural-Vacant Land",
  },
  8501: {
    displayName: "State Board Assessments",
    title: "STATE BOARD OF EQUALIZATION - SPECIAL ASSESSMENTS",
  },
  9001: {
    displayName: "Native American Lands",
    title: "Native American Lands / American Indian Lands",
  },
};
