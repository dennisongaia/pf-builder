# Process Flow Builder

A React application for visualizing semiconductor wafer fabrication processes including deposition, patterning, and etching operations.

## Live Demo

[View Live Demo](https://pf-builder.vercel.app/)

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://https://github.com/dennisongaia/pf-builder.git
cd pf-builder

# Install dependencies
npm install

# Start development server
npm run dev
```
## Architecture & Design Decisions

### 3D Visualization

While the assignment only required a 2D visualizer, I chose to implement a 3D version using React Three Fiber. This provides a more practical tool for real-world scenarios where users might need to inspect layer geometry from multiple angles—not just a fixed side view. The 3D approach is also more useful for more complicated patterning beyond just left/right.

### Data Flow

Steps are the single source of truth.The user defines a sequence of process steps (deposit, pattern, etch), and everything else is computed from this sequence. This makes the data flow predictable and eliminates sync issues between state and visualization.

### Performance Considerations

- **`useMemo`** for expensive computations (layer calculation, validation)
- **`useCallback`** for stable function references passed to children
- **`memo`** on 3D components to prevent unnecessary re-renders
- **Stable keys** (UUIDs) for React reconciliation in lists and 3D scenes

### State Management

A single custom hook (`useSteps`) encapsulates all core logic

### Types

Used TypeScript discriminated unions for type-safe step handling

