export class Cache {
  constructor(ttl = 60000) { // Default 60 seconds TTL
    this.store = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}
