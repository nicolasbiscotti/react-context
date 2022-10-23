import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "./App.css";

type useStoreReturnType = ReturnType<typeof useStore>;

type State = { first: string; last: string };

const StoreContext = createContext<useStoreReturnType | null>(null);

function useStore() {
  const state = { current: { first: "", last: "" } };

  const listeners = new Set<() => void>();

  function onStateChange(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(nextState: Partial<State>) {
    state.current = { ...state.current, ...nextState };
    listeners.forEach((listener) => listener());
  }

  return { state, onStateChange, setState };
}

function Provider({
  value,
  children,
}: {
  value: useStoreReturnType;
  children: ReactNode;
}) {
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function useStoreData(label: "first" | "last") {
  const { state, onStateChange, setState } = useContext(StoreContext)!;
  const [value, setValue] = useState(state.current[label]);

  const handleChange = useCallback(() => setValue(state.current[label]), []);

  useEffect(() => {
    const unsuscribe = onStateChange(handleChange);
    return () => {
      unsuscribe();
    };
  }, []);

  return { value, setState };
}

function TextInput({ label }: { label: "first" | "last" }) {
  const { value, setState } = useStoreData(label);
  return (
    <div>
      <label>
        {label}:{" "}
        <input
          type="text"
          value={value}
          onChange={(e) => setState({ [label]: e.target.value })}
        />
      </label>
    </div>
  );
}

function Display({ label }: { label: "first" | "last" }) {
  const { value } = useStoreData(label);

  return (
    <div>
      {/* in heare i want to use ---> getState()[label] */}
      {label}: {value}
    </div>
  );
}

function FormContainer() {
  return (
    <div>
      <h2>FormContainer</h2>
      <div>
        <form>
          <TextInput label="first" />
          <TextInput label="last" />
        </form>
      </div>
    </div>
  );
}

function DisplayContainer() {
  return (
    <div>
      <h2>DisplayContainer</h2>
      <div>
        <Display label="first" />
        <Display label="last" />
      </div>
    </div>
  );
}

function ContentContainer() {
  return (
    <div>
      <h2>ContentContainer</h2>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
}

function App() {
  const store = useStore();

  return (
    <Provider value={store}>
      <div>
        <h2>App</h2>
        <ContentContainer />
      </div>
    </Provider>
  );
}
export default App;
