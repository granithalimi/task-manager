import "./App.css";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";

function App() {
  const [tasks, setTasks] = useState({});
  const [finished, setFinished] = useState({});
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick(e);
  };

  const handleClick = () => {
    const task = inputRef.current.value.trim();
    if (!task) return;

    if (tasks.length > 0)
      setTasks((p) => [...p, { id: tasks.length, content: task }]);
    else setTasks([{ id: 0, content: task }]);

    inputRef.current.value = "";
    inputRef.current.focus();
  };

  const handleClose = (_, t_id) => {
    setTasks((p) => {
      let res = p.filter((t) => t.id !== t_id);
      return res;
    });
  };
  const handleFinishedClose = (_, f_id) => {
    setFinished((p) => {
      let res = p.filter((t) => t.id !== f_id);
      return res;
    });
  };

  const handleCheck = (_, t_id) => {
    const task = tasks.filter((p) => p.id === t_id);
    if (finished.length > 0)
      setFinished((p) => [
        ...p,
        { id: finished.length, content: task[0].content },
      ]);
    else setFinished([{ id: 0, content: task[0].content }]);

    setTasks((p) => {
      let res = p.filter((t) => t.id !== t_id);
      return res;
    });
  };

  const handleUp = (_, ind) => {
    if (ind === 0) return;
    setTasks((p) => {
      let res = [...p];
      const tmp = res[ind];
      res[ind] = res[ind - 1];
      res[ind - 1] = tmp;
      return res;
    });
  };
  const handleDown = (_, ind) => {
    if (ind === tasks.length - 1) return;
    setTasks((p) => {
      let res = [...p];
      const tmp = res[ind];
      res[ind] = res[ind + 1];
      res[ind + 1] = tmp;
      return res;
    });
  };

  const handleTwentie = (e) => {
    setTime(1200);
  };
  const handleFifty = (e) => {
    setTime(3000);
  };

  useEffect(() => {
    if (started === true && time > 0) {
      var inter = setInterval(() => {
          setTime((p) => p - 1);
      }, 1000);
    } else if (started === true && time === 0) {
      const audio = new Audio("sounds/alarm.mp3");
      audio.play();
    }

    return () => {
      clearInterval(inter);
    };
  }, [started]);

  const stopClicked = (e) => {
    setStarted((p) => false);
  };

  return (
    <div className="w-full min-h-screen bg-[#1E1E2F] overflow-hidden">
      <header className="w-full h-20 flex items-center justify-center">
        <h1 className="text-3xl text-center montserrat-title text-[#FFFFFF]">
          Task Manager
        </h1>
      </header>
      {/* Pomodoro session */}
      <div className="w-full flex flex-col items-center gap-5 pb-10">
        {/* buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => handleTwentie(e)}
            className="px-4 py-1 rounded-lg text-white font-extrabold bg-[#FF6B6B] hover:bg-red-600 duration-300"
          >
            20:5
          </button>
          <button
            onClick={(e) => handleFifty(e)}
            className="px-4 py-1 rounded-lg text-white font-extrabold bg-[#FF6B6B] hover:bg-red-600 duration-300"
          >
            50:10
          </button>
        </div>
        <div className="flex flex-col bg-white rounded-xl px-32 py-10">
          <div>
            <h1 className=" text-4xl font-extrabold">
              00:
              {time / 60 < 10
                ? `0${Math.trunc(time / 60)}`
                : Math.trunc(time / 60)}
              :{time % 60 < 10 ? `0${time % 60}` : time % 60}
            </h1>
          </div>
          <div className="flex gap-3 justify-center items-center">
            {started ? (
              <button
                onClick={(e) => stopClicked((p) => false)}
                className="text-white font-extrabold px-3 py-1 rounded-lg bg-red-400"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={(e) => setStarted((p) => true)}
                className="text-white font-extrabold px-3 py-1 rounded-lg bg-green-400"
              >
                Start
              </button>
            )}
            <button
              onClick={(e) => setTime((p) => 0)}
              className="text-white font-extrabold px-3 py-1 rounded-lg bg-blue-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="w-full h-24 flex justify-center gap-3 items-center">
        <input
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Add Tasks"
          className="md:w-10/12 md:h-2/3 h-12 ps-3 rounded-lg md:ps-10 text-xl text-white bg-white/10"
        />
        <button
          onClick={(e) => handleClick(e)}
          className="md:text-xl text-white px-3 py-1 bg-[#FF6B6B] rounded-lg montserrat-title hover:bg-[#FFD93D] hover:text-black duration-300"
        >
          Add
        </button>
      </div>

      {/* Tasks */}
      <div className="w-full flex flex-col justify-center gap-3 items-center py-10">
        {finished && finished.length > 0 && (
          <>
            <h1 className="text-white text-3xl montserrat-title">
              Finished Tasks
            </h1>
            {finished.map((f, ind) => (
              <div
                key={ind}
                className="w-11/12 min-h-20 bg-[#FF6B6B] rounded-xl flex items-center duration-300"
              >
                <div className="w-7/12 md:w-9/12 h-full flex items-center justify-center">
                  <h1 className="text-center text-white text-xl montserrat-title text-wrap whitespace-normal break-words">
                    {f.content}
                  </h1>
                </div>
                <div className="w-5/12 h-full md:w-3/12 flex justify-center items-center gap-5">
                  <IoCloseCircle
                    onClick={(e) => handleFinishedClose(e, f.id)}
                    className="text-4xl text-[#FFD93D] cursor-pointer hover:text-[#FF9F1C] duration-300"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {tasks && tasks.length > 0 && (
          <>
            <h1 className="text-white text-3xl montserrat-title">Tasks</h1>
            {tasks.map((t, ind) => (
              <div
                key={ind}
                className="w-11/12 min-h-20 bg-[#FF6B6B] rounded-xl flex items-center duration-300"
              >
                <div className="w-7/12 md:w-9/12 h-full flex items-center justify-center">
                  <h1 className="text-center text-white text-xl montserrat-title">
                    {t.content}
                  </h1>
                </div>
                <div className="w-5/12 h-full md:w-3/12 flex justify-center items-center gap-5">
                  <FaArrowAltCircleUp
                    onClick={(e) => handleUp(e, ind)}
                    className="text-3xl text-[#FFD93D] cursor-pointer hover:text-[#FF9F1C] duration-300"
                  />
                  <FaArrowAltCircleDown
                    onClick={(e) => handleDown(e, ind)}
                    className="text-3xl text-[#FFD93D] cursor-pointer hover:text-[#FF9F1C] duration-300"
                  />
                  <IoCloseCircle
                    onClick={(e) => handleClose(e, t.id)}
                    className="text-4xl text-[#FFD93D] cursor-pointer hover:text-[#FF9F1C] duration-300"
                  />
                  <FaCheckCircle
                    onClick={(e) => handleCheck(e, t.id)}
                    className="text-3xl text-[#FFD93D] cursor-pointer hover:text-[#FF9F1C] duration-300"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
