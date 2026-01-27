export const CONTENT = {
  main: {
    title: "Process Flow UI Builder",
    subtitle: "Visual flow builder for semiconductor processes",
  },
  sidebar: {
    title: "Process Steps",
    addStep: "Add Step",
    emptyState: {
      title: "No steps yet",
      description: "Add a step to get started",
    },
    summary: {
      totalSteps: "Total Steps",
      totalLayers: "Total Layers",
      maxHeight: "Max Height",
    },
  },
  viewer: {
    viewLabel: "View:",
    views: {
      side: "Side",
      top: "Top",
      threeD: "3D",
    },
    resetCamera: "Reset Camera",
  },
  steps: {
    stepType: "Step Type",
    deposit: "Deposit",
    etch: "Etch",
    pattern: "Pattern",
    patternLeft: "Pattern Left",
    patternRight: "Pattern Right",
    duration: "Duration (seconds)",
  },
  material: {
    material: "Material",
    materialA: "Material A",
    materialB: "Material B",
    materialC: "Material C",
    layers: "Layers",
  },
} as const;
