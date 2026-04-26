import React, { useState, useMemo, useRef, useEffect, Suspense } from 'react';
import { 
  Trees, 
  Waves, 
  Building2, 
  Eraser, 
  Info, 
  RefreshCcw, 
  Zap, 
  Wind, 
  Droplets,
  LayoutDashboard,
  MessageSquareText,
  ChevronRight,
  Map as MapIcon,
  Thermometer,
  Target,
  Lock,
  Landmark,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  ArrowRight,
  Settings,
  Activity,
  Box,
  BarChart3,
  Cpu,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { analyzeCityDesign } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CITIES, generateOptimalGrid, generateInitialGrid } from './constants';
import { TileType, CityDistrict } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { LandingPage } from './components/LandingPage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRID_SIZE_DEFAULT = 10;

function City3DView({ grid, theme: globalTheme, size }: { grid: TileType[][], theme: 'light' | 'dark', size: number }) {
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(globalTheme);

  const toggleLocalTheme = () => setLocalTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={cn(
      "w-full h-full relative transition-colors duration-500",
      localTheme === 'dark' ? "bg-[#0B1220]" : "bg-[#f0f2f5]"
    )}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[size * 1.5, size * 1.5, size * 1.5]} fov={50} />
          <OrbitControls 
            enablePan={true} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={5} 
            maxDistance={size * 4}
          />
          
          <ambientLight intensity={localTheme === 'dark' ? 0.2 : 0.7} />
          <directionalLight 
            position={[10, 20, 10]} 
            intensity={localTheme === 'dark' ? 0.5 : 1.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-10, 10, -10]} intensity={localTheme === 'dark' ? 0.2 : 0.5} />

          <group position={[-(size / 2) + 0.5, 0, -(size / 2) + 0.5]}>
            {grid.map((row, r) => row.map((tile, c) => (
              <Block key={`${r}-${c}`} r={r} c={c} type={tile} theme={localTheme} />
            )))}
          </group>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[size * 2, size * 2]} />
            <meshStandardMaterial color={localTheme === 'dark' ? "#1a1a1a" : "#ffffff"} />
          </mesh>
          
          <gridHelper 
            args={[size * 2, size * 2, localTheme === 'dark' ? 0x3b82f6 : 0x2563eb, localTheme === 'dark' ? 0x1e293b : 0xe2e8f0]} 
            position={[0, 0.01, 0]} 
          />
          
          <ContactShadows position={[0, 0, 0]} opacity={localTheme === 'dark' ? 0.4 : 0.2} scale={size * 2} blur={2} far={4.5} />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 premium-card p-3 backdrop-blur-md flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-blue-400">Eco-City Simulation Core</p>
          <p className="text-[8px] font-mono opacity-50 mt-1">L-Click: Orbit • R-Click: Pan • Scroll: Zoom</p>
        </div>
        
        <div className="pt-2 border-t border-glass flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-tighter text-text-secondary opacity-60">Ecological Index</span>
          <button 
            onClick={toggleLocalTheme}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-brand/10 hover:bg-brand/20 transition-colors border border-brand/20"
            title={localTheme === 'dark' ? "Switch to Day" : "Switch to Night"}
          >
            {localTheme === 'dark' ? (
              <Sun size={12} className="text-yellow-400" />
            ) : (
              <Moon size={12} className="text-blue-600" />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-brand">
              {localTheme === 'dark' ? 'Day' : 'Night'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Block({ r, c, type, theme }: { r: number, c: number, type: TileType, theme: 'light' | 'dark' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const BASE_HEIGHT = 0.2;
  
  const height = useMemo(() => {
    if (type === 'H') return 1.5 + Math.random() * 2;
    if (type === 'P') return 1.2;
    if (type === 'G') return 0.6 + Math.random() * 0.8; 
    if (type === 'B') return BASE_HEIGHT * 0.5; // Water is at 50% height
    return 0.1;
  }, [type, BASE_HEIGHT]);

  const structureHeight = height;
  const totalHeight = structureHeight + (type === 'B' ? 0 : BASE_HEIGHT);

  const treePositions = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 0.7,
      z: (Math.random() - 0.5) * 0.7,
      s: 0.4 + Math.random() * 0.6,
      w: 0.1 + Math.random() * 0.1
    }));
  }, []);

  const color = useMemo(() => {
    if (type === 'H') return theme === 'dark' ? '#78350f' : '#bc6c25'; 
    if (type === 'G') return '#059669';
    if (type === 'B') return '#0077be'; 
    if (type === 'P') return '#f59e0b';
    return '#ffffff';
  }, [type, theme]);

  const groundColor = useMemo(() => {
    if (type === 'B') return '#005a9e';
    if (type === 'G') return '#059669'; // Grass green for base
    if (type === 'H' || type === 'P') return theme === 'dark' ? '#3f3f46' : '#a1a1aa'; // Pavement grey
    return theme === 'dark' ? '#171717' : '#f5f5f5';
  }, [type, theme]);

  const pType = useMemo(() => Math.floor(Math.random() * 3), []); 

  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScale(1);
      setOpacity(1);
    }, (r + c) * 30);
    return () => clearTimeout(timer);
  }, [r, c]);

  const windows = useMemo(() => {
    if (type !== 'H') return [];
    const windowList = [];
    const floors = Math.floor(height * 2.5);
    const windowsPerRow = 2;
    
    for (let f = 0; f < floors; f++) {
      for (let side = 0; side < 4; side++) {
        for (let w = 0; w < windowsPerRow; w++) {
          if (Math.random() > 0.15) {
            windowList.push({
              id: `${f}-${side}-${w}`,
              side,
              y: (f + 0.5) / 2.5 - height / 2,
              x: (w - (windowsPerRow - 1) / 2) * 0.35,
              lit: Math.random() > 0.6
            });
          }
        }
      }
    }
    return windowList;
  }, [type, height]);

  if (type === '.') return null;

  return (
    <group position={[c, (totalHeight * scale) / 2, r]} scale={[1, scale, 1]}>
      {/* Universal Base Platform - Level with Water */}
      {type !== 'B' && (
        <mesh position={[0, -totalHeight/2 + BASE_HEIGHT/2, 0]} receiveShadow>
          <boxGeometry args={[1, BASE_HEIGHT, 1]} />
          <meshStandardMaterial color={groundColor} />
        </mesh>
      )}

      {/* Main Building Body / Water / Tree / Heritage */}
      {type === 'B' ? (
        <group position={[0, -totalHeight/2 + height/2, 0]}>
          {/* Water Volume */}
          <mesh>
            <boxGeometry args={[1.0, height, 1.0]} />
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.6} 
              metalness={0.8}
              roughness={0.1}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
          {/* Water Surface */}
          <mesh position={[0, height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.0, 1.0, 32, 32]} />
            <MeshDistortMaterial
              color={color}
              speed={3}
              distort={0.3}
              radius={1}
              transparent
              opacity={0.9}
              metalness={1}
              roughness={0}
              emissive="#7dd3fc"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ) : type === 'G' ? (
        <group position={[0, -totalHeight/2 + BASE_HEIGHT, 0]}>
          {treePositions.map((pos, idx) => (
            <Float key={idx} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={0.2} position={[pos.x, 0, pos.z]}>
              <mesh position={[0, structureHeight * 0.1 * pos.s, 0]}>
                <cylinderGeometry args={[0.02, 0.03, structureHeight * 0.25 * pos.s]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0, structureHeight * 0.4 * pos.s, 0]} castShadow>
                <sphereGeometry args={[pos.w, 8, 8]} />
                <meshStandardMaterial color={color} roughness={0.9} />
              </mesh>
            </Float>
          ))}
        </group>
      ) : type === 'H' ? (
        <group position={[0, -totalHeight/2 + BASE_HEIGHT + structureHeight/2, 0]}>
          {/* Main Housing Body sitting on pavement */}
          <RoundedBox args={[0.75, structureHeight, 0.75]} radius={0.02} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
          </RoundedBox>
          
          {/* Realistic Balconies on all sides */}
          {structureHeight > 1.2 && Array.from({ length: Math.floor(structureHeight) }).map((_, i) => (
            <group key={i} position={[0, (i / Math.floor(structureHeight)) * structureHeight - structureHeight/2 + 0.6, 0]}>
              {[0, 1, 2, 3].map((side) => (
                <group key={side} rotation={[0, (side * Math.PI) / 2, 0]}>
                  {/* Balcony Platform */}
                  <mesh position={[0.38, 0, 0]}>
                    <boxGeometry args={[0.15, 0.04, 0.5]} />
                    <meshStandardMaterial color={color} />
                  </mesh>
                  {/* Railing */}
                  <mesh position={[0.45, 0.08, 0]}>
                    <boxGeometry args={[0.02, 0.12, 0.51]} />
                    <meshStandardMaterial color={color} opacity={0.8} transparent />
                  </mesh>
                  {/* Side Railings */}
                  <mesh position={[0.4, 0.08, 0.25]}>
                    <boxGeometry args={[0.1, 0.12, 0.02]} />
                    <meshStandardMaterial color={color} opacity={0.8} transparent />
                  </mesh>
                  <mesh position={[0.4, 0.08, -0.25]}>
                    <boxGeometry args={[0.1, 0.12, 0.02]} />
                    <meshStandardMaterial color={color} opacity={0.8} transparent />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
        </group>
      ) : type === 'P' ? (
        <group position={[0, -totalHeight/2 + BASE_HEIGHT, 0]}>
          {pType === 0 ? (
            /* Heritage Pagoda */
            <group>
              <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.8, 0.2, 0.8]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0, 0.4, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.3, 0.5, 0.4, 4]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, 0.7, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.2, 0.4, 0.3, 4]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, 0.9, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0, 0.2, 0.3, 4]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
          ) : pType === 1 ? (
            /* Heritage Temple / Dome */
            <group>
              <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[0.8, 0.4, 0.8]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0, 0.4, 0]} castShadow>
                <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={color} metalness={0.4} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.02, 0.05, 0.3]} />
                <meshStandardMaterial color="#d97706" />
              </mesh>
            </group>
          ) : (
            /* Heritage Gate / Arch */
            <group>
              <mesh position={[-0.25, 0.4, 0]} castShadow>
                <boxGeometry args={[0.2, 0.8, 0.2]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0.25, 0.4, 0]} castShadow>
                <boxGeometry args={[0.2, 0.8, 0.2]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0, 0.85, 0]} castShadow>
                <boxGeometry args={[0.8, 0.15, 0.3]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[0, 1.05, 0]} castShadow>
                <boxGeometry args={[0.6, 0.15, 0.2]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </group>
          )}
          {/* Base for all heritage */}
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.9]} />
            <meshStandardMaterial color="#57534e" />
          </mesh>
        </group>
      ) : (
        <mesh castShadow receiveShadow ref={meshRef}>
          <boxGeometry args={[0.9, height, 0.9]} />
          <meshStandardMaterial 
            color={color} 
            roughness={0.4} 
            metalness={0.2}
            transparent={true}
            opacity={opacity}
          />
        </mesh>
      )}

      {/* Windows for Buildings */}
      {(type === 'H') && windows.map((win) => (
        <group key={win.id} rotation={[0, (win.side * Math.PI) / 2, 0]} position={[0, -totalHeight/2 + BASE_HEIGHT + structureHeight/2, 0]}>
          <mesh position={[win.x, win.y, 0.4]}>
            <planeGeometry args={[0.15, 0.2]} />
            <meshStandardMaterial 
              color={theme === 'dark' && win.lit ? "#fef08a" : "#1e293b"} 
              emissive={theme === 'dark' && win.lit ? "#fef08a" : "#000000"}
              emissiveIntensity={theme === 'dark' && win.lit ? 2 : 0}
              metalness={0.8}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function App() {
  const [flowState, setFlowState] = useState<'landing' | 'city-select' | 'level-select' | 'dashboard'>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingCaption, setLoadingCaption] = useState('Synchronizing Ecosystem Data...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const captions = [
      'Analyzing Terrain Contours...',
      'Simulating Thermal Flux...',
      'Mapping Ecological Corridors...',
      'Optimizing Urban Density...',
      'Ready for Planning.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < captions.length) {
        setLoadingCaption(captions[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsInitialLoading(false), 800);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict>(CITIES[0].districts[0]);
  const [viewMode, setViewMode] = useState<'map' | 'editor' | '3d'>('map');
  const [completedDistricts, setCompletedDistricts] = useState<Record<string, boolean>>({});
  const [grid, setGrid] = useState<TileType[][]>(() => 
    CITIES[0].districts[0].initialGrid 
      ? JSON.parse(JSON.stringify(CITIES[0].districts[0].initialGrid)) 
      : Array(CITIES[0].districts[0].gridSize).fill(null).map(() => Array(CITIES[0].districts[0].gridSize).fill('.'))
  );
  const [selectedTool, setSelectedTool] = useState<TileType>('H');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimal, setShowOptimal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorFlash, setErrorFlash] = useState<TileType | null>(null);
  const mapConstraintsRef = useRef(null);

  const stats = useMemo(() => {
    const size = selectedDistrict.gridSize;
    let greenCount = 0;
    let blueCount = 0;
    let buildingCount = 0;
    let heritageCount = 0;
    let totalTiles = size * size;

    // For distribution check: divide grid into 4 quadrants
    const quadrants = [0, 0, 0, 0]; // [top-left, top-right, bottom-left, bottom-right]
    const mid = size / 2;

    grid.forEach((row, r) => {
      row.forEach((tile, c) => {
        const qIdx = (r < mid ? 0 : 2) + (c < mid ? 0 : 1);
        if (tile === 'G' || tile === 'B') quadrants[qIdx]++;

        if (tile === 'G') greenCount++;
        if (tile === 'B') blueCount++;
        if (tile === 'H') buildingCount++;
        if (tile === 'P') heritageCount++;
      });
    });

    const greenery = Math.round((greenCount / totalTiles) * 100);
    const water = Math.round((blueCount / totalTiles) * 100);
    const density = Math.round(((buildingCount + heritageCount) / totalTiles) * 100);

    // Distribution Penalty: If one quadrant has significantly less eco-tiles than others
    const avgEcoPerQuad = quadrants.reduce((a, b) => a + b, 0) / 4;
    const variance = quadrants.reduce((a, b) => a + Math.pow(b - avgEcoPerQuad, 2), 0) / 4;
    const distributionPenalty = Math.min(20, Math.sqrt(variance) * 2);

    // Spatial Analysis for AQI and LST
    let heatIslandEffect = 0;
    let coolingEfficiency = 0;
    let urbanEcoProximity = 0; // Bonus for green/blue next to urban

    grid.forEach((row, r) => {
      row.forEach((tile, c) => {
        if (tile === 'H' || tile === 'P') {
          // Check neighbors for heat island effect and cooling
          const neighbors = [
            [r-1, c], [r+1, c], [r, c-1], [r, c+1]
          ];
          neighbors.forEach(([nr, nc]) => {
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              const nTile = grid[nr][nc];
              if (nTile === 'H' || nTile === 'P') heatIslandEffect += 0.2;
              if (nTile === 'G' || nTile === 'B') {
                coolingEfficiency += 0.4;
                urbanEcoProximity += 1;
              }
            }
          });
        }
      });
    });

    // AQI: Base + Density impact - Greenery/Water impact + Stagnation penalty
    const aqi = Math.max(10, 35 + (buildingCount * 5) + (heritageCount * 2) - (greenCount * 6) - (blueCount * 3) - coolingEfficiency);
    
    // LST: Base + Density impact - Cooling impact + Heat Island penalty
    const lst = 25 + (buildingCount * 0.5) + (heritageCount * 0.2) - (greenCount * 0.6) - (blueCount * 0.8) + heatIslandEffect - (coolingEfficiency * 0.2);

    const req = selectedDistrict.requirements;
    const greenDiff = Math.abs(greenery - req.targetGreenery);
    const waterDiff = Math.abs(water - req.targetWater);
    const densityDiff = Math.abs(density - req.targetDensity);
    
    // Minimum Placement check
    let minPlacementPenalty = 0;
    if (req.minPlacement) {
      if (greenCount < (req.minPlacement.G || 0)) minPlacementPenalty += 10;
      if (blueCount < (req.minPlacement.B || 0)) minPlacementPenalty += 10;
      if (buildingCount + heritageCount < (req.minPlacement.H || 0)) minPlacementPenalty += 10;
    }

    // Proximity Bonus: Reward placing eco-tiles near urban tiles
    const proximityBonus = Math.min(10, urbanEcoProximity * 0.5);
    
    const baseScore = Math.max(0, 100 - (greenDiff + waterDiff + densityDiff));
    const score = Math.min(100, Math.max(0, Math.round(baseScore - distributionPenalty + proximityBonus - minPlacementPenalty)));

    return { greenery, water, density, score, aqi, lst };
  }, [grid, selectedDistrict]);

  const blockConstraints = useMemo(() => {
    const req = selectedDistrict.requirements;
    const size = selectedDistrict.gridSize;
    return {
      G: Math.round((req.targetGreenery / 100) * (size * size)) + 5,
      B: Math.round((req.targetWater / 100) * (size * size)) + 5,
      H: Math.round((req.targetDensity / 100) * (size * size)) + 5
    };
  }, [selectedDistrict]);

  const currentCounts = useMemo(() => {
    let G = 0, B = 0, H = 0;
    grid.forEach(row => row.forEach(tile => {
      if (tile === 'G') G++;
      if (tile === 'B') B++;
      if (tile === 'H' || tile === 'P') H++;
    }));
    return { G, B, H };
  }, [grid]);

  const updateTile = (r: number, c: number) => {
    // Cannot edit tiles that were part of the initial template
    if (selectedDistrict.initialGrid && selectedDistrict.initialGrid[r][c] !== '.') return;

    const currentTile = grid[r][c];
    if (selectedTool === currentTile) return;

    // Check constraints for non-erase tools
    if (selectedTool !== '.') {
      const type = selectedTool as 'G' | 'B' | 'H';
      if (currentCounts[type] >= blockConstraints[type]) {
        setErrorFlash(type);
        setTimeout(() => setErrorFlash(null), 1000);
        return;
      }
    }

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[r] = [...newGrid[r]];
      newGrid[r][c] = selectedTool;
      return newGrid;
    });
  };

  const handleReset = () => {
    const size = selectedDistrict.gridSize;
    setGrid(selectedDistrict.initialGrid ? JSON.parse(JSON.stringify(selectedDistrict.initialGrid)) : Array(size).fill(null).map(() => Array(size).fill('.')));
    setAnalysis(null);
  };

  const handleRandomizeCurrentGrid = () => {
    const size = selectedDistrict.gridSize;
    const newGrid: TileType[][] = Array(size).fill(null).map(() => Array(size).fill('.'));
    
    // Maintain initial grid if it exists
    if (selectedDistrict.initialGrid) {
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          if (selectedDistrict.initialGrid[r][c] !== '.') {
            newGrid[r][c] = selectedDistrict.initialGrid[r][c] as TileType;
          }
        }
      }
    }

    // Fill with random noise up to a reasonable density
    const noiseDensity = 0.15;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '.' && Math.random() < noiseDensity) {
          const types: TileType[] = ['G', 'B', 'H', 'P'] as TileType[];
          const randomType = types[Math.floor(Math.random() * types.length)];
          newGrid[r][c] = randomType;
        }
      }
    }
    setGrid(newGrid);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeCityDesign(grid, stats, selectedDistrict.name, selectedCity.name);
    setAnalysis(result || "No analysis available.");
    setIsAnalyzing(false);
    
    if (stats.score >= 85) {
      setCompletedDistricts(prev => ({ ...prev, [selectedDistrict.id]: true }));
    }
  };

  const handleDistrictSelect = (district: CityDistrict) => {
    setSelectedDistrict(district);
    setGrid(district.initialGrid ? JSON.parse(JSON.stringify(district.initialGrid)) : Array(district.gridSize).fill(null).map(() => Array(district.gridSize).fill('.')));
    setAnalysis(null);
    setFlowState('dashboard');
    setViewMode('editor');
  };

  const handleGreenField = () => {
    const size = Math.floor(Math.random() * 7) + 8; // Random size 8-14
    const totalTiles = size * size;
    
    const greenFieldDistrict: CityDistrict = {
      id: 'green-field',
      name: 'Green Field Project',
      gridSize: size,
      requirements: {
        targetGreenery: 35,
        targetWater: 20,
        targetDensity: 30,
        minPlacement: { 
          G: Math.floor(totalTiles * 0.15), 
          B: Math.floor(totalTiles * 0.08), 
          H: Math.floor(totalTiles * 0.15) 
        },
        description: "A blank slate. No existing structures. Design a sustainable city from scratch.",
        difficulty: 'Easy',
        type: "Pristine Land"
      },
      position: { x: 50, y: 50 },
      initialGrid: Array(size).fill(null).map(() => Array(size).fill('.'))
    };
    greenFieldDistrict.optimalGrid = generateOptimalGrid(greenFieldDistrict.initialGrid as TileType[][], greenFieldDistrict.requirements, size);
    handleDistrictSelect(greenFieldDistrict);
  };

  const handleRandomized = () => {
    const size = Math.floor(Math.random() * 6) + 10; 
    const totalTiles = size * size;
    
    const randomDistrict: CityDistrict = {
      id: 'random-chaos',
      name: 'Chaos Matrix',
      gridSize: size,
      requirements: {
        targetGreenery: Math.floor(Math.random() * 30) + 10,
        targetWater: Math.floor(Math.random() * 20) + 10,
        targetDensity: Math.floor(Math.random() * 40) + 20,
        minPlacement: { 
          G: Math.floor(totalTiles * (Math.random() * 0.1 + 0.05)), 
          B: Math.floor(totalTiles * (Math.random() * 0.08 + 0.02)), 
          H: Math.floor(totalTiles * (Math.random() * 0.15 + 0.05)) 
        },
        description: "An unstable simulation with randomized parameters. Adapt and optimize.",
        difficulty: Math.random() > 0.5 ? 'Hard' : 'Extreme',
        type: "Random Simulation"
      },
      position: { x: 50, y: 50 }
    };
    
    const initialGrid: TileType[][] = Array(size).fill(null).map(() => Array(size).fill('.'));
    const noiseDensity = 0.15;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (Math.random() < noiseDensity) {
          const types: TileType[] = ['G', 'B', 'P'] as TileType[];
          initialGrid[r][c] = types[Math.floor(Math.random() * types.length)];
        }
      }
    }
    randomDistrict.initialGrid = initialGrid;
    randomDistrict.optimalGrid = generateOptimalGrid(initialGrid, randomDistrict.requirements, size);
    handleDistrictSelect(randomDistrict);
  };

  const handleCityChange = (cityName: string) => {
    const city = CITIES.find(c => c.name === cityName) || CITIES[0];
    setSelectedCity(city);
    handleDistrictSelect(city.districts[0]);
  };

  const handleLevelChange = (districtId: string) => {
    const district = selectedCity.districts.find(d => d.id === districtId);
    if (district) {
      handleDistrictSelect(district);
    }
  };

  const handleGridSizeChange = (newSize: number) => {
    const updatedDistrict = { 
      ...selectedDistrict, 
      gridSize: newSize,
      initialGrid: generateInitialGrid(selectedDistrict.requirements.type, selectedDistrict.id, newSize),
    };
    updatedDistrict.optimalGrid = generateOptimalGrid(updatedDistrict.initialGrid as TileType[][], updatedDistrict.requirements, newSize);
    
    setSelectedDistrict(updatedDistrict);
    setGrid(updatedDistrict.initialGrid as TileType[][]);
    setAnalysis(null);
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence mode="wait">
      {flowState === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage 
            onStart={() => setFlowState('city-select')} 
            onGreenField={handleGreenField}
            onRandomized={handleRandomized}
            theme={theme}
            toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </motion.div>
      ) : flowState === 'city-select' ? (
        <motion.div
          key="city-select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="min-h-screen bg-dashboard-bg flex flex-col items-center justify-center p-8 transition-colors duration-300"
        >
          <div className="w-full px-6 md:px-12 lg:px-20 py-8 relative">
            <button 
              onClick={() => setFlowState('landing')}
              className="absolute top-8 left-8 p-3 glass-pill text-text-secondary hover:text-brand transition-all flex items-center gap-2 group z-50 backdrop-blur-md"
              title="Return to Terminal"
            >
              <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">BACK</span>
            </button>

            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Global Network
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-4">Select Operations Base</h2>
              <p className="text-text-secondary font-medium text-lg">Choose a metropolitan hub to begin your architectural initiative.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {CITIES.map((city, i) => (
                <motion.div 
                  key={city.name}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="premium-card group cursor-pointer relative overflow-hidden flex flex-col h-[400px]"
                  onClick={() => {
                    setSelectedCity(city);
                    setFlowState('level-select');
                  }}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={city.heroImage} 
                      alt={city.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-surface-elevated/20 to-transparent" />
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow relative z-10 -mt-10">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-3xl font-black tracking-tight group-hover:text-brand transition-colors">{city.name}</h3>
                       <div className="p-2 rounded-xl bg-brand/10 border border-brand/20">
                          <Globe size={20} className="text-brand" />
                       </div>
                    </div>
                    <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6">
                      {city.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-glass">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">04 Territories Active</span>
                      <div className="flex items-center gap-2 text-brand font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                        Enter City <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={() => setFlowState('landing')}
                className="text-text-secondary hover:text-text-primary text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowRight size={14} className="rotate-180" /> Back to Terminal
              </button>
            </div>
          </div>
        </motion.div>
      ) : flowState === 'level-select' ? (
        <motion.div
          key="level-select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="min-h-screen bg-dashboard-bg flex flex-col items-center justify-center p-8 transition-colors duration-300"
        >
          <div className="w-full px-6 md:px-12 lg:px-20 py-8 relative">
            <button 
              onClick={() => setFlowState('city-select')}
              className="absolute top-8 left-8 p-3 glass-pill text-text-secondary hover:text-brand transition-all flex items-center gap-2 group z-50 backdrop-blur-md"
              title="Back to City Selection"
            >
              <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">BACK</span>
            </button>

            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Environmental Directives
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">{selectedCity.name} Territories</h2>
              <p className="text-text-secondary font-medium text-lg">Choose a territory to initialize urban simulation parameters.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedCity.districts.map((district, i) => (
                <motion.div 
                  key={district.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-8 group hover:border-brand/50 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
                  onClick={() => handleDistrictSelect(district)}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 -rotate-45 translate-x-8 translate-y--8 group-hover:bg-brand/20 transition-all" />
                  <div className="relative z-10 flex flex-col h-full">
                    <p className="text-[9px] font-black text-brand uppercase tracking-widest mb-2 opacity-60">Node {i+1}</p>
                    <h4 className="text-xl font-black mb-1 group-hover:text-brand transition-colors text-text-primary">{district.name}</h4>
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-6">{district.requirements.type}</p>
                    
                    <p className="text-xs text-text-secondary font-medium mb-8 flex-grow line-clamp-3">
                      {district.requirements.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-glass mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-text-secondary uppercase">Complexity</span>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          district.requirements.difficulty === 'Hard' ? "text-amber-500" : 
                          district.requirements.difficulty === 'Extreme' ? "text-rose-500" : "text-emerald-500"
                        )}>{district.requirements.difficulty}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-glass flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <button 
                onClick={() => setFlowState('city-select')}
                className="text-text-secondary hover:text-text-primary text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowRight size={14} className="rotate-180" /> Back to City Selection
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-dashboard-bg text-text-primary font-sans selection:bg-brand/30 overflow-x-hidden flex flex-col"
        >
          {/* Top Navigation / Filters Bar */}
          <nav className="h-20 border-b border-glass bg-dashboard-bg/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setFlowState('landing')}
                className="flex items-center gap-2 pr-4 border-r border-glass hover:opacity-80 transition-opacity group"
                title="Return to Landing"
              >
                <ArrowRight size={18} className="rotate-180 text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors hidden sm:block">Back</span>
              </button>

              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFlowState('landing')}
              >
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
                  <Trees size={22} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight hidden sm:inline-block">EcoCity <span className="text-brand">Dashboard</span></span>
              </div>
              
              <div className="h-8 w-[1px] bg-glass hidden md:block" />
              
              <div className="flex items-center gap-3">
                {!(selectedDistrict.id === 'green-field' || selectedDistrict.id === 'random-chaos') ? (
                  <>
                    <div className="glass-pill px-4 py-2 flex items-center gap-2 text-sm font-medium">
                      <MapIcon size={16} className="text-brand-muted" />
                      <select 
                        className="bg-transparent outline-none cursor-pointer font-bold"
                        value={selectedCity.name}
                        onChange={(e) => handleCityChange(e.target.value)}
                      >
                        {CITIES.map(city => (
                          <option key={city.name} value={city.name} className="bg-surface-elevated text-text-primary">{city.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="glass-pill px-4 py-2 flex items-center gap-2 text-sm font-medium">
                      <Target size={16} className="text-brand-muted" />
                      <select 
                        className="bg-transparent outline-none cursor-pointer font-bold"
                        value={selectedDistrict.id}
                        onChange={(e) => handleLevelChange(e.target.value)}
                      >
                        {selectedCity.districts.map(district => (
                          <option key={district.id} value={district.id} className="bg-surface-elevated text-text-primary">{district.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="glass-pill px-4 py-2 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-text-primary">{selectedDistrict.name}</span>
                    <span className="text-[10px] font-bold text-text-secondary opacity-50 font-mono">[{selectedDistrict.gridSize}x{selectedDistrict.gridSize}]</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 glass-pill text-text-secondary hover:text-text-primary transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={() => setViewMode(viewMode === '3d' ? 'editor' : '3d')}
                className={cn(
                  "p-2.5 rounded-xl transition-all border border-glass",
                  viewMode === '3d' ? "bg-brand text-white shadow-lg shadow-brand/20 border-brand" : "glass-pill text-text-secondary hover:text-text-primary"
                )}
                title="Toggle 3D Visualization"
              >
                <Box size={20} />
              </button>
              
              <div className="h-8 w-[1px] bg-glass mx-2" />
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 glass-pill text-text-secondary hover:text-brand transition-all"
                title="Settings"
              >
                <Settings size={20} />
              </button>

              <div className="flex items-center gap-3 ml-4 bg-white/5 border border-glass pl-3 pr-1.5 py-1.5 rounded-full">
                <span className="text-xs font-semibold text-text-secondary">Architect-01</span>
                <div className="w-9 h-9 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-xs">
                  ME
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 md:gap-10 mx-auto w-full min-h-0 px-4 md:px-8 lg:px-12 max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-10 w-full min-h-0">
            {/* Left Column: Editor & Main Charts */}
            <div className="flex flex-col gap-8 md:gap-10 min-w-0">
              
              {/* Header Stats / KPI Blocks */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-1">
                    <KPIBlock label="Target District" value={selectedDistrict.name} subValue="ID: BKC-4-ECO" icon={Target} color="text-brand" />
                    <KPIBlock label="Simulation Year" value="2026 / Q2" subValue="Real-time Cycle" icon={Activity} color="text-amber-500" />
                    <KPIBlock label="Ecosystem" value={`${stats.score}%`} subValue="Ecological Confidence" icon={Trees} color="text-emerald-500" />
                    <KPIBlock label="Urban State" value="Optimized" subValue="Adaptive Grid" icon={Globe} color="text-purple-500" />
                  </div>
                  
                  {/* Global Ranking Badge */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="hidden xl:flex items-center gap-4 premium-card px-6 py-4 border-brand/20 ml-6"
                  >
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-brand/20">
                      <Globe size={20} className="text-brand" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-0.5">Global Rank</p>
                      <p className="text-sm font-black text-text-primary whitespace-nowrap">TOP 5% <span className="text-[10px] opacity-40 font-bold ml-1">#402/12.4K</span></p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Main Content Area: Map/Editor/3D */}
              <div className="flex-1 min-h-[550px] flex flex-col gap-8">
                <div className="premium-card flex-1 relative overflow-hidden flex flex-col">
                  {/* Toolbar */}
                  <div className="h-auto min-h-16 border-b border-glass px-4 md:px-6 py-4 md:py-0 flex items-center justify-between bg-white/[0.02] flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex bg-dashboard-bg p-1 rounded-xl border border-glass shadow-inner overflow-x-auto no-scrollbar">
                        {[
                          { id: 'H', icon: Building2, label: 'Urban' },
                          { id: 'G', icon: Trees, label: 'Eco' },
                          { id: 'B', icon: Waves, label: 'Water' },
                          { id: '.', icon: Eraser, label: 'Erase' },
                        ].map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => setSelectedTool(tool.id as TileType)}
                            className={cn(
                              "px-3 md:px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all whitespace-nowrap",
                              selectedTool === tool.id 
                                ? "bg-brand text-white shadow-lg shadow-brand/20" 
                                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                            )}
                          >
                            <tool.icon size={14} />
                            <span className="hidden sm:inline">{tool.label}</span>
                            {tool.id !== '.' && selectedDistrict.requirements.minPlacement && (
                              <span className={cn(
                                "ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-black/20",
                                currentCounts[tool.id as keyof typeof currentCounts] < (selectedDistrict.requirements.minPlacement[tool.id as 'G' | 'B' | 'H'] || 0)
                                  ? "text-red-400"
                                  : "text-emerald-400"
                              )}>
                                {currentCounts[tool.id as keyof typeof currentCounts]}/{selectedDistrict.requirements.minPlacement[tool.id as 'G' | 'B' | 'H'] || 0}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 py-2 md:py-0">
                      <button 
                        onClick={handleRandomizeCurrentGrid}
                        className="p-2 glass-pill text-brand hover:bg-brand/10"
                        title="Randomize Current Grid"
                      >
                        <RefreshCcw size={16} />
                      </button>
                      <button 
                        onClick={handleReset}
                        className="p-2 glass-pill text-text-secondary hover:text-text-primary"
                        title="Reset Grid"
                      >
                        <Eraser size={16} />
                      </button>
                      <button 
                        onClick={() => setShowOptimal(!showOptimal)}
                        className={cn(
                          "px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all border border-glass whitespace-nowrap",
                          showOptimal ? "bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/20" : "glass-pill text-text-secondary"
                        )}
                      >
                        {showOptimal ? "Hide Optimal" : "Show Optimal"}
                      </button>
                      <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="px-4 md:px-8 py-1.5 bg-brand hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-[10px] md:text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-95 whitespace-nowrap"
                      >
                        {isAnalyzing ? "Processing..." : "Analyze"}
                        {!isAnalyzing && <ArrowRight size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-dashboard-bg/50 overflow-auto min-h-[400px]">
                    {viewMode === '3d' ? (
                      <City3DView grid={grid} theme={theme} size={selectedDistrict.gridSize} />
                    ) : (
                      <div className="relative group p-4 scale-[0.85] sm:scale-100 transition-transform origin-center flex flex-col items-center">
                        {isAnalyzing && (
                          <>
                            {/* Scanning Line */}
                            <motion.div 
                              initial={{ top: '0%' }}
                              animate={{ top: '100%' }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent z-20 shadow-[0_0_15px_rgba(59,130,246,0.8)] pointer-events-none"
                            />
                            {/* Scanning Glow Pulse */}
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.1, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute inset-0 bg-brand/5 z-10 pointer-events-none rounded-xl md:rounded-[24px]"
                            />
                            {/* Digital Grid Overlay during Scan */}
                            <div className="absolute inset-0 z-10 pointer-events-none rounded-xl md:rounded-[24px] overflow-hidden opacity-20">
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            </div>
                          </>
                        )}
                        <div 
                          className="inline-grid border border-glass bg-surface-elevated/40 rounded-xl md:rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-sm gap-0 mx-auto select-none"
                          style={{ 
                            gridTemplateColumns: `repeat(${selectedDistrict.gridSize}, minmax(0, 1fr))` 
                          }}
                          onMouseLeave={() => setIsDragging(false)}
                          onMouseUp={() => setIsDragging(false)}
                        >
                          {(showOptimal ? selectedDistrict.optimalGrid : grid)?.map((row, r) => (
                            row.map((tile, c) => (
                              <button
                                key={`${r}-${c}`}
                                onMouseDown={(e) => {
                                  if (e.button === 0) {
                                    setIsDragging(true);
                                    updateTile(r, c);
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (isDragging) updateTile(r, c);
                                }}
                                className={cn(
                                  "w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-9 lg:h-9 xl:w-11 xl:h-11 border-r border-b border-glass transition-all duration-300 flex items-center justify-center relative",
                                  c === selectedDistrict.gridSize - 1 && "border-r-0",
                                  r === selectedDistrict.gridSize - 1 && "border-b-0",
                                  tile === 'H' && "bg-slate-700 text-white hover:bg-slate-600 shadow-inner",
                                  tile === 'G' && "bg-emerald-500 text-white hover:bg-emerald-400 shadow-inner",
                                  tile === 'B' && "bg-blue-600 text-white hover:bg-blue-500 shadow-inner",
                                  tile === 'P' && "bg-amber-600 text-white hover:bg-amber-500 shadow-inner",
                                  tile === '.' ? (theme === 'dark' ? "bg-transparent hover:bg-white/[0.03]" : "bg-transparent hover:bg-black/[0.03]") : "",
                                  selectedDistrict.initialGrid && selectedDistrict.initialGrid[r][c] !== '.' && "cursor-not-allowed"
                                )}
                              >
                                {tile === 'H' && <Building2 className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />}
                                {tile === 'G' && <Trees className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />}
                                {tile === 'B' && <Waves className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />}
                                {tile === 'P' && <Landmark className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />}
                                
                                {selectedDistrict.initialGrid && selectedDistrict.initialGrid[r][c] !== '.' && (
                                  <div className="absolute top-0.5 right-0.5 opacity-40">
                                    <Lock size={8} className="xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5" />
                                  </div>
                                )}
                                <div className="absolute inset-0 opacity-0 hover:opacity-10 bg-white dark:bg-black transition-opacity" />
                              </button>
                            ))
                          ))}
                        </div>

                        {/* Symbol Legend */}
                        <div className="mt-8 flex flex-wrap justify-center gap-6 px-4">
                          {[
                            { id: 'H', icon: Building2, label: 'Urban Zone', color: 'bg-slate-700' },
                            { id: 'G', icon: Trees, label: 'Eco Filter', color: 'bg-emerald-500' },
                            { id: 'B', icon: Waves, label: 'Hydrologic Tile', color: 'bg-blue-600' },
                            { id: 'P', icon: Landmark, label: 'Heritage Anchor', color: 'bg-amber-600' },
                          ].map(item => (
                            <div key={item.id} className="flex items-center gap-3 group">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 shadow-sm transition-transform group-hover:scale-110",
                                item.color
                              )}>
                                <item.icon size={14} className="text-white" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-primary whitespace-nowrap">{item.label}</span>
                                <span className="text-[8px] font-bold text-text-secondary uppercase opacity-60">ID: {item.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Expert Analysis Sidebar */}
            <aside className="flex flex-col gap-6 md:gap-8 min-w-0">
              <div className="premium-card p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand/[0.02] group-hover:bg-brand/[0.04] transition-colors" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-1">Live Simulation Status</h3>
                      <p className="text-[10px] font-mono font-bold text-text-secondary opacity-50">SYNC_ID: {selectedDistrict.name.toUpperCase()}_NODE</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Sustainability Score</p>
                        <p className="text-[10px] font-black text-brand">{stats.score}%</p>
                      </div>
                      <div className="h-1.5 bg-white/5 dark:bg-black/20 rounded-full overflow-hidden border border-glass">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.score}%` }}
                          className="h-full bg-gradient-to-r from-brand to-emerald-500" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-dashboard-bg/50 rounded-2xl border border-glass">
                        <p className="text-[8px] text-text-secondary uppercase font-black mb-1 tracking-widest leading-none">VITALITY</p>
                        <p className="text-xl font-black">{stats.score}<span className="text-[8px] opacity-40 ml-1">pts</span></p>
                      </div>
                      <div className="p-4 bg-dashboard-bg/50 rounded-2xl border border-glass">
                        <p className="text-[8px] text-text-secondary uppercase font-black mb-1 tracking-widest leading-none">AQI STATUS</p>
                        <p className={cn("text-xl font-black", stats.aqi < 100 ? "text-emerald-500" : "text-amber-500")}>
                          {stats.aqi}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-glass-muted">
                       <Info size={14} className="text-brand shrink-0" />
                       <p className="text-[10px] text-text-secondary leading-tight font-medium">
                          {selectedDistrict.requirements.description.split('.')[0]}.
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Constraints */}
              <div className="premium-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck size={20} className="text-brand" />
                  <h2 className="font-bold uppercase tracking-widest text-xs">Deployment Constraints</h2>
                </div>
                {selectedDistrict.requirements.minPlacement ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'G', icon: Trees, label: 'Eco', value: selectedDistrict.requirements.minPlacement?.G, color: 'text-emerald-500' },
                        { type: 'B', icon: Waves, label: 'Water', value: selectedDistrict.requirements.minPlacement?.B, color: 'text-blue-500' },
                        { type: 'H', icon: Building2, label: 'Urban', value: selectedDistrict.requirements.minPlacement?.H, color: 'text-slate-400' },
                      ].map((item) => (
                        <div key={item.type} className="p-3 bg-white/5 border border-glass rounded-xl flex flex-col items-center gap-1">
                          <item.icon size={14} className={item.color} />
                          <span className="text-[10px] font-black">{item.value}+</span>
                          <span className="text-[8px] font-bold text-text-secondary uppercase">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] text-text-secondary font-medium leading-relaxed italic opacity-70">
                      *Minimum placement of functional tiles required for synchronization.
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-text-secondary opacity-50 italic">No specific deployment constraints for this node.</p>
                )}
              </div>
            </aside>
          </div>

          {/* Architectural Logic: Bottom Section */}
          <div className="w-full px-4 md:px-8 lg:px-12 pb-12">
            <div className="premium-card w-full flex flex-col min-h-[300px]">
              <div className="p-8 border-b border-glass flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <MessageSquareText size={20} className="text-brand" />
                  <h2 className="font-bold uppercase tracking-widest text-xs">Architectural Logic</h2>
                </div>
                {isAnalyzing && <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />}
              </div>
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {analysis ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary font-medium leading-relaxed">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-center opacity-40 gap-6">
                    <Globe size={56} className="text-brand" />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-text-primary mb-2">Awaiting Computation</p>
                      <p className="text-xs font-semibold text-text-secondary max-w-[400px] mx-auto">Click "Run Ecological Analysis" to generate expert feedback for your current city layout.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

          {/* Settings Modal */}
          <AnimatePresence>
            {isSettingsOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSettingsOpen(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative premium-card p-8 w-full max-w-md bg-surface-elevated z-10 border border-brand/20 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20">
                        <Settings size={20} className="text-brand" />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight">Project Config</h2>
                    </div>
                    <button 
                      onClick={() => setIsSettingsOpen(false)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-text-secondary" />
                    </button>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Grid Dimension</label>
                        <span className="text-sm font-black text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/20">{selectedDistrict.gridSize}x{selectedDistrict.gridSize}</span>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {[5, 6, 7, 8, 9, 10].map((size) => (
                          <button
                            key={size}
                            onClick={() => handleGridSizeChange(size)}
                            className={cn(
                              "aspect-square rounded-xl text-xs font-black transition-all border",
                              selectedDistrict.gridSize === size 
                                ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                                : "bg-white/5 border-glass text-text-secondary hover:border-brand/40 hover:text-text-primary"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] text-text-secondary mt-4 font-medium italic opacity-60 leading-relaxed">
                        Note: Altering the grid dimension will perform a complete reset of the current simulation buffer.
                      </p>
                    </div>

                    <div className="pt-8 border-t border-glass">
                      <button 
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full py-4 bg-brand text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 transition-all active:scale-95"
                      >
                        Commit Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KPIBlock({ label, value, subValue, icon: Icon, color }: { label: string, value: string, subValue: string, icon: any, color: string }) {
  return (
    <div className="premium-card p-6 group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{label}</p>
        <div className={cn("p-2 rounded-lg bg-white/5 border border-glass", color)}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-xl font-black text-text-primary mb-1">{value}</p>
      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tight">{subValue}</p>
    </div>
  )
}


