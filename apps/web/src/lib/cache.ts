interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private store = new Map<string, CacheEntry<any>>()
  private maxSize: number

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize
    this.startCleanup()
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey) {
        this.store.delete(oldestKey)
      }
    }

    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    
    if (!entry) return null
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key)
      return null
    }
    
    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  size(): number {
    return this.store.size
  }

  keys(): string[] {
    return Array.from(this.store.keys())
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.store.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.store.delete(key)
        }
      }
    }, 60 * 1000) // Clean up every minute
  }
}

// Global cache instance
export const cache = new Cache()

// Cache decorator for functions
export function cached<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl: number = 5 * 60 * 1000
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : `${fn.name}-${JSON.stringify(args)}`
    
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }
    
    const result = fn(...args)
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(data => {
        cache.set(key, data, ttl)
        return data
      })
    }
    
    cache.set(key, result, ttl)
    return result
  }) as T
}

// Database query cache
export const queryCache = {
  campaigns: new Cache(100),
  records: new Cache(200),
  integrations: new Cache(50),
  users: new Cache(50)
}

// API response cache
export const apiCache = new Cache(500)

// Utility functions
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')
  
  return `${prefix}:${sortedParams}`
}

export function invalidateCache(pattern: string): void {
  // Get all keys and filter by pattern
  const keys = cache.keys()
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
}
