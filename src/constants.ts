import { CityTemplate, TileType, DistrictRequirements, CityDistrict } from './types';

export const generateInitialGrid = (type: string, districtId: string, size: number): TileType[][] => {
  const grid: TileType[][] = Array(size).fill(null).map(() => Array(size).fill('.'));
  
  // Locality-Specific Geographic Signatures
  // Visakhapatnam RK Beach: Bay curve on left
  if (districtId === 'v-rkbeach') {
    for (let r = 0; r < size; r++) {
      const beachDepth = Math.floor(Math.sin(r * 0.5) * 2) + 2;
      for (let c = 0; c < beachDepth; c++) grid[r][c] = 'B';
    }
  }
  // Visakhapatnam Kailasagiri: Hill plateau in center
  else if (districtId === 'v-kailasagiri') {
    const mid = Math.floor(size / 2);
    for (let r = mid - 2; r <= mid + 2; r++) {
      for (let c = mid - 2; c <= mid + 2; c++) {
        if (r >= 0 && r < size && c >= 0 && c < size) grid[r][c] = 'G';
      }
    }
  }
  // Vijayawada Riverfront: Krishna River curve
  else if (districtId === 'vj-riverfront') {
    for (let c = 0; c < size; c++) {
      const r = Math.floor(Math.sin(c * 0.4) * 2) + Math.floor(size / 2);
      if (r >= 0 && r < size) grid[r][c] = 'B';
      if (r + 1 < size) grid[r+1][c] = 'B';
    }
  }
  // Anantapur Solar: Specific diagonal arrays
  else if (districtId === 'atp-solar') {
    for (let i = 0; i < size; i += 3) {
      for (let j = 0; j < size; j++) {
        if ((i + j) % 4 === 0) grid[i][j] = 'G';
      }
    }
  }
  // Eluru Kolleru Edge: Heavy water on right
  else if (districtId === 'e-lake') {
    for (let r = 0; r < size; r++) {
      for (let c = size - 3; c < size; c++) grid[r][c] = 'B';
    }
  }
  // Rajahmundry Bridge: River with heritage bridge piers
  else if (districtId === 'r-bridge') {
    const mid = Math.floor(size / 2);
    for (let c = 0; c < size; c++) {
      grid[mid][c] = 'B';
      grid[mid-1][c] = 'B';
      if (c % 4 === 0) grid[mid][c] = 'P'; // Bridge piers
    }
  }
  // Kurnool Fort: Central bastion
  else if (districtId === 'k-fort') {
    const mid = Math.floor(size / 2);
    grid[mid][mid] = 'P';
    grid[mid-1][mid] = 'P';
    grid[mid+1][mid] = 'P';
    grid[mid][mid-1] = 'P';
    grid[mid][mid+1] = 'P';
  }
  // Nellore: Meandering Penna River
  else if (districtId === 'n-penna') {
    for (let r = 0; r < size; r++) {
      const c = Math.floor(Math.cos(r * 0.6) * 2) + Math.floor(size / 2);
      if (c >= 0 && c < size) grid[r][c] = 'B';
    }
  }
  // Kadapa Mining: Jagged industrial excavated pits
  else if (districtId === 'kd-mining') {
    for (let i = 0; i < size; i += 4) {
      grid[i][i] = 'P';
      if (i + 1 < size) grid[i+1][i+1] = 'B';
    }
  }
  // Chittoor Temple: Eco Valley (Green surrounding center)
  else if (districtId === 'ctr-hills') {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const dist = Math.sqrt(Math.pow(r - size/2, 2) + Math.pow(c - size/2, 2));
        if (dist > size/3) grid[r][c] = 'G';
      }
    }
  }
  // Vizianagaram Fort: Circular symmetry
  else if (districtId === 'vn-fort') {
    const mid = Math.floor(size / 2);
    grid[mid-1][mid-1] = 'P'; grid[mid-1][mid+1] = 'P';
    grid[mid+1][mid-1] = 'P'; grid[mid+1][mid+1] = 'P';
  }
  // Srikakulam Vamsadhara: Forest-dense river basin
  else if (districtId === 's-north') {
    for (let r = 0; r < size; r++) {
      if (r % 2 === 0) grid[r][0] = 'B';
      if (r % 3 === 0) grid[r][size-1] = 'G';
    }
  }
  // Ongole Coastal: Rocky granite outcrops along the sea
  else if (districtId === 'o-coast') {
    for (let r = 0; r < size; r++) {
      grid[r][0] = 'B';
      if (r % 4 === 0) grid[r][1] = 'P'; // "Granite" rocks
    }
  }
  // Guntur Core: Academic campus symmetry
  else if (districtId === 'g-core') {
    const mid = Math.floor(size / 2);
    for (let i = 0; i < size; i++) {
        if (i === mid) continue;
        grid[i][mid] = 'G';
        grid[mid][i] = 'G';
    }
  }
  // Default Generic Terrain
  else if (type === 'coastal') {
    for (let r = 0; r < size; r++) {
      grid[r][0] = 'B';
      if (Math.random() > 0.6 && size > 1) grid[r][1] = 'B';
    }
  } else if (type === 'river') {
    const mid = Math.floor(size / 2);
    for (let c = 0; c < size; c++) grid[mid][c] = 'B';
  } else if (type === 'inland') {
    // Sparse greenery patches for inland
    for (let i = 0; i < 3; i++) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      grid[r][c] = 'G';
    }
  }

  // Common Heritage anchors for specific districts
  if (districtId.includes('core') || districtId.includes('fort') || districtId.includes('temple')) {
    const mid = Math.floor(size / 2);
    if (grid[mid][mid] === '.') grid[mid][mid] = 'P';
  }

  return grid;
};

export const generateOptimalGrid = (initialGrid: TileType[][], req: DistrictRequirements, size: number): TileType[][] => {
  const grid: TileType[][] = JSON.parse(JSON.stringify(initialGrid));
  const totalTiles = size * size;
  
  // Calculate exact counts needed
  let gTarget = Math.round((req.targetGreenery / 100) * totalTiles);
  let bTarget = Math.round((req.targetWater / 100) * totalTiles);
  let hTarget = Math.round((req.targetDensity / 100) * totalTiles);

  // Subtract pre-existing counts
  grid.forEach(row => row.forEach(tile => {
    if (tile === 'G') gTarget--;
    if (tile === 'B') bTarget--;
    if (tile === 'H' || tile === 'P') hTarget--;
  }));

  // Distribute tiles quadrant by quadrant for perfect balance
  const mid = Math.floor(size / 2);
  const quadrants = [
    { r: [0, mid], c: [0, mid] },
    { r: [0, mid], c: [mid, size] },
    { r: [mid, size], c: [0, mid] },
    { r: [mid, size], c: [mid, size] }
  ];

  quadrants.forEach(q => {
    let qG = Math.floor(gTarget / 4);
    let qB = Math.floor(bTarget / 4);
    let qH = Math.floor(hTarget / 4);

    // Fill quadrant in a checkerboard pattern for maximum interleaving (cooling efficiency)
    for (let r = q.r[0]; r < q.r[1]; r++) {
      for (let c = q.c[0]; c < q.c[1]; c++) {
        if (grid[r][c] !== '.') continue;

        // Priority: Interleave H with G/B
        if ((r + c) % 2 === 0) {
          if (qH > 0) { grid[r][c] = 'H'; qH--; hTarget--; }
          else if (qG > 0) { grid[r][c] = 'G'; qG--; gTarget--; }
          else if (qB > 0) { grid[r][c] = 'B'; qB--; bTarget--; }
        } else {
          if (qG > 0) { grid[r][c] = 'G'; qG--; gTarget--; }
          else if (qB > 0) { grid[r][c] = 'B'; qB--; bTarget--; }
          else if (qH > 0) { grid[r][c] = 'H'; qH--; hTarget--; }
        }
      }
    }
  });

  // Final pass for any remaining tiles due to floor() or pre-existing constraints
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '.') {
        if (hTarget > 0) { grid[r][c] = 'H'; hTarget--; }
        else if (gTarget > 0) { grid[r][c] = 'G'; gTarget--; }
        else if (bTarget > 0) { grid[r][c] = 'B'; bTarget--; }
      }
    }
  }

  return grid;
};

const createDistrict = (id: string, name: string, x: number, y: number, type: string, size: number, req: DistrictRequirements): CityDistrict => {
  const initial = generateInitialGrid(type, id, size);
  return {
    id,
    name,
    gridSize: size,
    position: { x, y },
    initialGrid: initial,
    optimalGrid: generateOptimalGrid(initial, req, size),
    requirements: req
  };
};

export const CITIES: CityTemplate[] = [
  {
    name: "Visakhapatnam",
    description: "The City of Destiny. A major port city with a unique blend of coastal beauty and eastern ghats topography.",
    heroImage: "https://picsum.photos/seed/vizag/600/400",
    districts: [
      createDistrict("v-rkbeach", "RK Beach Front", 40, 50, 'coastal', 10, {
        targetGreenery: 30,
        targetWater: 40,
        targetDensity: 30,
        minPlacement: { G: 20, B: 30, H: 20 },
        description: "The Bay of Bengal forms a natural curve here. Integrate urban zones within the protected coastline.",
        difficulty: 'Medium',
        type: "Coastal Tourism"
      }),
      createDistrict("v-kailasagiri", "Kailasagiri Hills", 60, 30, 'inland', 12, {
        targetGreenery: 50,
        targetWater: 10,
        targetDensity: 20,
        minPlacement: { G: 45, B: 5, H: 10 },
        description: "A high-altitude plateau. Preserve the central peak while managing new development.",
        difficulty: 'Hard',
        type: "Hilltop Eco"
      })
    ]
  },
  {
    name: "Vijayawada",
    description: "The Place of Victory. A bustling commercial hub and political center situated on the banks of the Krishna River.",
    heroImage: "https://picsum.photos/seed/vjw/600/400",
    districts: [
      createDistrict("vj-riverfront", "Krishna Riverfront", 50, 45, 'river', 10, {
        targetGreenery: 25,
        targetWater: 45,
        targetDensity: 30,
        minPlacement: { G: 15, B: 35, H: 20 },
        description: "The Krishna River curves through the heart of the city. Manage the riparian ecosystem.",
        difficulty: 'Medium',
        type: "Riparian Core"
      }),
      createDistrict("vj-benton", "B_town Commercial", 55, 60, 'inland', 12, {
        targetGreenery: 15,
        targetWater: 10,
        targetDensity: 65,
        minPlacement: { G: 10, B: 5, H: 60 },
        description: "Densely packed commercial zone requiring extreme cooling solutions.",
        difficulty: 'Hard',
        type: "Dense Commerce"
      })
    ]
  },
  {
    name: "Guntur",
    description: "Capital of Chillies and Tobacco. A critical agricultural and academic hub of Andhra Pradesh.",
    heroImage: "https://picsum.photos/seed/guntur/600/400",
    districts: [
      createDistrict("g-core", "Education City", 45, 40, 'inland', 10, {
        targetGreenery: 35,
        targetWater: 15,
        targetDensity: 40,
        minPlacement: { G: 25, B: 10, H: 30 },
        description: "A symmetrical academic grid. Balance institutional structures with green learning corridors.",
        difficulty: 'Medium',
        type: "Academic Hub"
      })
    ]
  },
  {
    name: "Nellore",
    description: "The City of Penna River and Coastal Beauty. Known for its historical significance and agriculture.",
    heroImage: "https://picsum.photos/seed/nellore/600/400",
    districts: [
      createDistrict("n-penna", "Penna Basin", 50, 50, 'river', 10, {
        targetGreenery: 25,
        targetWater: 50,
        targetDensity: 25,
        minPlacement: { G: 20, B: 40, H: 15 },
        description: "The Penna River meanders vertically through this zone. Harmonize urban flow with the water basin.",
        difficulty: 'Medium',
        type: "Waterfront Delta"
      })
    ]
  },
  {
    name: "Kurnool",
    description: "The Gateway to the South. Known for its historic Konda Reddy Fort and proximity to Srisailam.",
    heroImage: "https://picsum.photos/seed/kurnool/600/400",
    districts: [
      createDistrict("k-fort", "Fort Heritage District", 40, 45, 'inland', 8, {
        targetGreenery: 20,
        targetWater: 10,
        targetDensity: 50,
        minPlacement: { G: 10, B: 5, H: 40 },
        description: "The historic Konda Reddy Fort is the central anchor. Build eco-buffers around the bastion.",
        difficulty: 'Easy',
        type: "Heritage Core"
      })
    ]
  },
  {
    name: "Kadapa",
    description: "Known for its mining history and rugged terrain. A city with deep historical roots and industrial spirit.",
    heroImage: "https://picsum.photos/seed/kadapa/600/400",
    districts: [
      createDistrict("kd-mining", "Mining Legacy Zone", 55, 60, 'inland', 10, {
        targetGreenery: 15,
        targetWater: 15,
        targetDensity: 60,
        minPlacement: { G: 10, B: 10, H: 50 },
        description: "Jagged industrial pits define this landscape. Convert mining excavations into sustainable reservoirs.",
        difficulty: 'Medium',
        type: "Industrial Rediff"
      })
    ]
  },
  {
    name: "Anantapur",
    description: "The land of silks and dry-lands. A pioneer in solar energy and drought-resistant urbanism.",
    heroImage: "https://picsum.photos/seed/anantapur/600/400",
    districts: [
      createDistrict("atp-solar", "Solar Park District", 60, 70, 'inland', 12, {
        targetGreenery: 30,
        targetWater: 10,
        targetDensity: 40,
        minPlacement: { G: 25, B: 5, H: 30 },
        description: "Linear grid signatures represent massive solar arrays. Optimize for clear-sky energy capture.",
        difficulty: 'Hard',
        type: "Renewable Hub"
      })
    ]
  },
  {
    name: "Chittoor",
    description: "A city of hills and temples. A serene gateway to Tirumala and eastern ghat treasures.",
    heroImage: "https://picsum.photos/seed/chittoor/600/400",
    districts: [
      createDistrict("ctr-hills", "Temple Valley", 40, 35, 'inland', 10, {
        targetGreenery: 45,
        targetWater: 20,
        targetDensity: 20,
        minPlacement: { G: 40, B: 15, H: 10 },
        description: "The spiritual core is nestled in an eco-valley. Protect the temple center with a lush green perimeter.",
        difficulty: 'Medium',
        type: "Spiritual Eco"
      })
    ]
  },
  {
    name: "Rajahmundry",
    description: "The Cultural Capital. Known for the mighty Godavari bridge and artistic heritage.",
    heroImage: "https://picsum.photos/seed/rajah/600/400",
    districts: [
      createDistrict("r-bridge", "Godavari Sprawl", 50, 50, 'river', 12, {
        targetGreenery: 25,
        targetWater: 35,
        targetDensity: 30,
        minPlacement: { G: 20, B: 30, H: 20 },
        description: "The mighty bridge piers are permanent heritage anchors. Weave urban life across the Godavari.",
        difficulty: 'Hard',
        type: "Cultural Riverfront"
      })
    ]
  },
  {
    name: "Ongole",
    description: "Famous for its livestock and granite mining. A quiet coastal city with a rugged edge.",
    heroImage: "https://picsum.photos/seed/ongole/600/400",
    districts: [
      createDistrict("o-coast", "Granite Coast", 70, 75, 'coastal', 10, {
        targetGreenery: 20,
        targetWater: 30,
        targetDensity: 40,
        minPlacement: { G: 15, B: 25, H: 30 },
        description: "Rocky granite outcrops are scattered along this shoreline. Navigate the rugged geology for urban development.",
        difficulty: 'Medium',
        type: "Marine Rugged"
      })
    ]
  },
  {
    name: "Srikakulam",
    description: "The northern tip of Coastal AP. Rich in temple architecture and tribal art forms.",
    heroImage: "https://picsum.photos/seed/srika/600/400",
    districts: [
      createDistrict("s-north", "Vamsadhara Basin", 30, 20, 'river', 10, {
        targetGreenery: 40,
        targetWater: 30,
        targetDensity: 20,
        minPlacement: { G: 35, B: 25, H: 10 },
        description: "A dense tribal forest meets the Vamsadhara river. Implement high-density eco-urbanism.",
        difficulty: 'Medium',
        type: "Forest Native"
      })
    ]
  },
  {
    name: "Vizianagaram",
    description: "The City of Victory. A princely city known for its historic fort and cultural patronage.",
    heroImage: "https://picsum.photos/seed/vnag/600/400",
    districts: [
      createDistrict("vn-fort", "Fort Promenade", 40, 30, 'inland', 8, {
        targetGreenery: 30,
        targetWater: 15,
        targetDensity: 45,
        minPlacement: { G: 20, B: 10, H: 30 },
        description: "The princely fort layout is perfectly symmetrical. Preserve the historic radial architecture.",
        difficulty: 'Easy',
        type: "Princely Restoration"
      })
    ]
  },
  {
    name: "Eluru",
    description: "The city between two rivers. Gateway to the largest freshwater lake, Kolleru.",
    heroImage: "https://picsum.photos/seed/eluru/600/400",
    districts: [
      createDistrict("e-lake", "Kolleru Edge", 60, 45, 'river', 10, {
        targetGreenery: 45,
        targetWater: 40,
        targetDensity: 15,
        minPlacement: { G: 40, B: 35, H: 5 },
        description: "The edge of Kolleru freshwater lake dominates this grid. Protect the sanctuary from urban runoff.",
        difficulty: 'Medium',
        type: "Wetland Haven"
      })
    ]
  }
];
