import catalog from '../../data/apps.json'
import type { AppItem } from '../types/app.ts'

export const fallbackApps = catalog as AppItem[]
