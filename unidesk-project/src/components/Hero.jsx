import { useState, useEffect } from "react";
import "./Hero.css";

const FULL_TEXT = "Studying has become simpler.";
const YELLOW_WORD = "simpler.";
const TYPING_SPEED = 60;
const REPEAT_DELAY = 5000;

export function Hero() {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let timeout;
    let index = 0;

    const type = () => {
      if (index <= FULL_TEXT.length) {
        setDisplayed(FULL_TEXT.slice(0, index));
        index++;
        timeout = setTimeout(type, TYPING_SPEED);
      } else {
        timeout = setTimeout(() => {
          index = 0;
          type();
        }, REPEAT_DELAY);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  const yellowStart = FULL_TEXT.indexOf(YELLOW_WORD);
  const beforeYellow = displayed.slice(0, yellowStart);
  const yellowPart = displayed.slice(yellowStart);

  return (
    <section className="hero">
      <h1>
        <span className="hero-brand">UniDesk</span>
        <br />
        {beforeYellow}
        {yellowPart && <span className="hero-yellow">{yellowPart}</span>}
        <span className="cursor">|</span>
      </h1>
    </section>
  );
}