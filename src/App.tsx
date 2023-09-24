import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import info from "../data.json";
import { username, hostname, path, symbol } from "../constants";

type Input = {
  prompt: string;
};

const options = info.options.map((option) => option.label);

function App() {
  const [history, setHistory] = useState([
    {
      command: "help",
      output:
        "Here are the available commands: <br />" + options.join("<br />"),
    },
  ]);

  const executeCommand = (command: Input["prompt"]) => {
    command = command.trim().toLowerCase();

    if (options.includes(command)) {
      let output = info.options.find(
        (option) => option.label === command
      )!.value;

      // check if 'data' exists within the options
      if (info.options.find((option) => option.label === command)?.data) {
        console.log("data exists");
        // append to output
        const data = info.options.find(
          (option) => option.label === command
        )!.data;

        output += data?.map((item) => {
          return `<br /><br />
          <strong>${item.label}</strong> <br /> 
          ${item.value}`;
        });
      }

      setHistory((history) => [
        ...history,
        {
          command,
          output,
        },
      ]);
    } else {
      if (command === "help") {
        setHistory((history) => [
          ...history,
          {
            command: command,
            output:
              "Here are the available commands: <br />" +
              options.join("<br />"),
          },
        ]);
      } else if (command === "clear") {
        setHistory([]);
      } else {
        setHistory((history) => [
          ...history,
          {
            command: command,
            output: "command not found",
          },
        ]);
      }
    }
  };

  const { register, handleSubmit, reset } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => {
    executeCommand(data.prompt);
    reset();
  };

  return (
    <div className='font-bold text-xl p-2'>
      {
        /* History */
        history.map((history) => (
          <div className=' mb-2'>
            <Prompt />
            <span>{history.command}</span> <br />
            <span dangerouslySetInnerHTML={{ __html: history.output }} />
          </div>
        ))
      }
      {/* Prompt */}
      <div className='flex'>
        <Prompt />
        <span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              className='bg-transparent outline-none'
              autoFocus
              {...register("prompt")}
              autoComplete='off'
            />
          </form>
        </span>
      </div>
    </div>
  );
}

const Prompt = () => {
  return (
    <span className='mr-1'>
      <span className='text-green-800 '>
        {username}@{hostname}
      </span>
      :<span className='text-blue-700'>{path}</span>
      {symbol}
    </span>
  );
};

export default App;
