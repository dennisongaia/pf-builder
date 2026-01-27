import { Layout } from "./components/layout/Layout";
import { useSteps } from "./hooks/useSteps";

function App() {
  const {
    steps,
    layers,
    resist,
    addStep,
    deleteStep,
    reorderSteps,
    updateDepositStep,
    updatePatternStep,
    updateEtchStep,
  } = useSteps();

  return (
    <Layout
      steps={steps}
      layers={layers}
      resist={resist}
      onAddStep={addStep}
      onDeleteStep={deleteStep}
      onReorderSteps={reorderSteps}
      onUpdateDeposit={updateDepositStep}
      onUpdatePattern={updatePatternStep}
      onUpdateEtch={updateEtchStep}
    />
  );
}

export default App;
