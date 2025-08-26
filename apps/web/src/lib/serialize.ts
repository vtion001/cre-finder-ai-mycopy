export function serializeData(data: any): any {
  if (data === null || data === undefined) return data;
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map((item) => serializeData(item));
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const key in data) {
      const val = (data as any)[key];
      if (typeof val === 'function' || typeof val === 'symbol') continue;
      result[key] = serializeData(val);
    }
    return result;
  }
  return data; // primitives
}


