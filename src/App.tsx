import { Layout } from "./components/layout/Layout";
import { useSteps } from "./hooks/useSteps";

function App() {
  const {
    steps,
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
