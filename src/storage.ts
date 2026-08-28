import type { CsvData, FieldMapping, Recipe } from './types';

const DATABASE = 'csv-import-cleanroom';
const DEMO_DATABASE = 'demo:csv-import-cleanroom';
const VERSION = 1;
let databaseName = DATABASE;

/** Keep demonstration data in a database that normal work never reads. */
export function useDemoStorage(enabled: boolean): void {
  databaseName = enabled ? DEMO_DATABASE : DATABASE;
}

interface Draft {
  id: 'active';
  source: CsvData | null;
  target: CsvData | null;
  mappings: FieldMapping[];
  updatedAt: string;
}

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('recipes')) db.createObjectStore('recipes', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact<T>(storeName: 'drafts' | 'recipes', mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const request = action(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export function saveDraft(source: CsvData | null, target: CsvData | null, mappings: FieldMapping[]): Promise<IDBValidKey> {
  const draft: Draft = { id: 'active', source, target, mappings: structuredClone(mappings), updatedAt: new Date().toISOString() };
  return transact('drafts', 'readwrite', store => store.put(draft));
}

export async function loadDraft(): Promise<Draft | null> {
  return (await transact<Draft | undefined>('drafts', 'readonly', store => store.get('active'))) ?? null;
}

export function clearDraft(): Promise<undefined> {
  return transact('drafts', 'readwrite', store => store.delete('active'));
}

export function saveRecipe(recipe: Recipe): Promise<IDBValidKey> {
  return transact('recipes', 'readwrite', store => store.put(recipe));
}

export function deleteRecipe(id: string): Promise<undefined> {
  return transact('recipes', 'readwrite', store => store.delete(id));
}

export function listRecipes(): Promise<Recipe[]> {
  return transact<Recipe[]>('recipes', 'readonly', store => store.getAll());
}

/** Delete only the active storage namespace, used by Reset demo. */
export function clearWorkspace(): Promise<void> {
  const name = databaseName;
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}
