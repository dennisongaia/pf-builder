export type Material = "A" | "B" | "C";

export interface MaterialProps {
  name: string;
  thickness: number; // nm/layer
  etchRate: number; // nm/s
  color: string;
  metalness: number; // 0.0 to 1.0
  roughness: number; // 0.0 (shiny) to 1.0 (matte)
}

export const MATERIALS: Record<Material, MaterialProps> = {
  A: {
    name: "Material A",
    thickness: 1.0,
    etchRate: 0.5,
    color: "#60a5fa",
    metalness: 0.7,
    roughness: 0.2,
  },
  B: {
    name: "Material B",
    thickness: 1.5,
    etchRate: 1.0,
    color: "#22c55e",
    metalness: 0.1,
    roughness: 0.7,
  },
  C: {
    name: "Material C",
    thickness: 2.0,
    etchRate: 1.5,
    color: "#f97316",
    metalness: 0.5,
    roughness: 0.4,
  },
};

export type ResistPosition = "left" | "right" | null;

export interface Layer {
  id: string;
  material: Material;
  leftBottom: number; // nm from substrate
  leftTop: number; // nm from substrate
  rightBottom: number; // nm from substrate
  rightTop: number;
}
