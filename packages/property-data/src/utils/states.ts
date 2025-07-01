/**
 * US State code to full name mapping
 * Includes all 50 states plus DC and common territories
 */
export const STATE_CODE_TO_NAME: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  // Common territories
  PR: "Puerto Rico",
  VI: "Virgin Islands",
  GU: "Guam",
  AS: "American Samoa",
  MP: "Northern Mariana Islands",
} as const;

/**
 * Get the full state name from a state code
 * @param stateCode - Two-letter state code (e.g., "FL", "CA")
 * @returns Full state name (e.g., "Florida", "California")
 * @throws Error if state code is not found
 */
export function getStateFullName(stateCode: string): string {
  const upperCode = stateCode.toUpperCase();
  const fullName = STATE_CODE_TO_NAME[upperCode];
  if (!fullName) {
    throw new Error(`Unknown state code: ${stateCode}`);
  }
  return fullName;
}

/**
 * Check if a state code is valid
 * @param stateCode - Two-letter state code to validate
 * @returns true if the state code exists in the mapping
 */
export function isValidStateCode(stateCode: string): boolean {
  return stateCode.toUpperCase() in STATE_CODE_TO_NAME;
}
