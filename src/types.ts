export type TileType = 'G' | 'B' | 'H' | '.' | 'P';

export interface DistrictRequirements {
  targetGreenery: number;
  targetWater: number;
  targetDensity: number;
  minPlacement?: {
    G?: number;
    B?: number;
    H?: number;
  };
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  type: string;
}

export interface CityDistrict {
  id: string;
  name: string;
  gridSize: number;
  requirements: DistrictRequirements;
  initialGrid?: TileType[][];
  optimalGrid?: TileType[][];
  position: { x: number; y: number }; // Percentage 0-100
  isCompleted?: boolean;
}

export interface CityTemplate {
  name: string;
  description: string;
  heroImage: string;
  districts: CityDistrict[];
}

export interface CityStats {
  greenery: number;
  water: number;
  density: number;
  score: number;
  aqi: number;
  lst: number;
}
