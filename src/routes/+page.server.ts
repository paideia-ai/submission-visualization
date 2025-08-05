import type { PageServerLoad } from './$types';
import type { VisualizationData } from '$lib/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const load: PageServerLoad = async () => {
  try {
    const dataPath = join(process.cwd(), '..', 'visualization_data_enhanced.json');
    const data = await readFile(dataPath, 'utf-8');
    const visualizationData: VisualizationData = JSON.parse(data);
    
    return {
      data: visualizationData
    };
  } catch (error) {
    console.error('Error loading visualization data:', error);
    return {
      data: null,
      error: 'Failed to load visualization data'
    };
  }
};