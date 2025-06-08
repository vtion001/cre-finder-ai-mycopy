export function parseLocationCode(code: string) {
  const parts = code.toLowerCase().split("-");
  const [type, state, ...nameParts] = parts;

  const name = nameParts.map(capitalize).join(" ");

  if ((type !== "c" && type !== "n") || !state || !name) {
    throw new Error("Invalid location code");
  }

  return {
    state: state.toUpperCase(),
    city: type === "c" ? name : undefined,
    county: type === "n" ? name : undefined,
  };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
