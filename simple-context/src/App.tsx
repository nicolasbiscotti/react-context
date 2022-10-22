import { createContext, useContext, useState } from "react";
import "./App.css";

function useStore() {
  return useState({ first: "", last: "" });
}

type useStoreReturnType = ReturnType<typeof useStore>;

const StoreContext = createContext<useStoreReturnType | null>(null);

function TextInput({ label }: { label: "first" | "last" }) {
  const [store, setStore] = useContext(StoreContext)!;
  return (
    <div>
      <label>
        {label}:{" "}
        <input
          type="text"
          value={store[label]}
          onChange={(e) => setStore({ ...store, [label]: e.target.value })}
        />
      </label>
    </div>
  );
}

function Display({ label }: { label: "first" | "last" }) {
  const [store] = useContext(StoreContext)!;
  return (
    <div>
      {/* in heare i want to use ---> getState()[label] */}
      {label}: {store[label]}
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
    <StoreContext.Provider value={store}>
      <div>
        <h2>App</h2>
        <ContentContainer />
      </div>
    </StoreContext.Provider>
  );
}
export default App;
