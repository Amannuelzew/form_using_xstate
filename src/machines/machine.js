import { assign, setup } from "xstate";

export const machine = setup({}).createMachine({
  initial: "idle",
  context: {
    message: "",
  },
  states: {
    idle: {
      on: {
        open: {
          target: "form",
        },
      },
    },
    form: {
      on: {
        close: {
          target: "idle",
        },
        good: {
          target: "thanks",
        },
        bad: {
          target: "badform",
        },
      },
    },
    badform: {
      on: {
        close: {
          target: "idle",
        },
        back: {
          target: "form",
        },
        submit: {
          target: "thanks",
        },
        "change value": {
          actions: assign({
            message: ({ event }) => event.message,
          }),
        },
      },
    },
    thanks: {
      on: {
        close: {
          target: "idle",
        },
      },
    },
  },
});
