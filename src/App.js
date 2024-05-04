import { createActor, fromTransition } from "xstate";
import "./styles.css";
import { useActor, useActorRef, useMachine, useSelector } from "@xstate/react";
import { machine } from "./machines/machine";
//actors can send a message
//recevie a message
//spawn a child
//can have thier own state
const countLogic = fromTransition(
  (state, event) => {
    if (event.type == "reset") return { count: 0 };
    if (event.type == "inc") return { count: state.count + 1 };
    if (event.type == "dec") return { count: state.count - 1 };
    if (event.type == "incby") return { count: state.count + event.value };
    return state;
  },
  { count: 0 },
);
const countActor = createActor(countLogic);
export default function App() {
  const coutRef = useActorRef(countLogic);
  const count = useSelector(coutRef, (state) => state.context.count);
  const [state, send] = useMachine(machine);
  const handleOpen = () => {
    send({ type: "open" });
  };
  const handleClose = () => {
    send({ type: "close" });
  };
  const handleGood = () => {
    send({ type: "good" });
  };
  const handleBad = () => {
    send({ type: "bad" });
  };
  const handleBack = () => {
    send({ type: "back" });
  };
  const handleSubmit = () => {
    send({ type: "submit" });
  };
  return (
    <div className="App">
      <h1>{JSON.stringify(state.value)}</h1>
      {state.matches("form") ? (
        <>
          <div style={{ padding: "1rem" }}>
            <h1>what is your feed back</h1>
            <button onClick={handleGood}>Good</button>
            <button onClick={handleBad}>Bad</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      ) : state.matches("thanks") ? (
        <>
          <div style={{ padding: "1rem" }}>
            <h1>Thanks for your feedback</h1>
            <h4>{state.context.message}</h4>
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      ) : state.matches("badform") ? (
        <>
          <div style={{ padding: "1rem" }}>
            <h3>what can we do better</h3>
            <textarea
              placeholder="write something...."
              onChange={(e) => {
                send({ type: "change value", message: e.target.value });
                console.log(state.context.message);
              }}
              cols="30"
              rows="5"
            ></textarea>
            <br />
            <button
              disabled={state.context.message.trim() == ""}
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button onClick={handleBack}>Back</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </>
      ) : (
        <button onClick={handleOpen}>open feedback</button>
      )}
      <h4>{count}</h4>
      <button onClick={() => coutRef.send({ type: "reset" })}>reset</button>
      <button onClick={() => coutRef.send({ type: "inc" })}>inc</button>
      <button onClick={() => coutRef.send({ type: "dec" })}>dec</button>
      <button onClick={() => coutRef.send({ type: "incby", value: 5 })}>
        by
      </button>
    </div>
  );
}
