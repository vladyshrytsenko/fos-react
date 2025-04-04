class StorageService {
    private isBrowser: boolean;
  
    constructor() {
      this.isBrowser = typeof window !== 'undefined';
    }
  
    public getItem(key: string): string | null {
      return this.isBrowser ? localStorage.getItem(key) : null;
    }
  
    public getJwtToken(): string | null {
      return this.getItem('jwtToken');
    }
  
    public setItem(key: string, value: string): void {
      if (this.isBrowser) {
        localStorage.setItem(key, value);
      }
    }
  
    public removeItem(key: string): void {
      if (this.isBrowser) {
        localStorage.removeItem(key);
      }
    }
  
    public removeJwtToken(): void {
      this.removeItem('jwtToken');
    }
  }
  
  export default new StorageService();
  