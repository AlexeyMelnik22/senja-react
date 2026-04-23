import React, { useEffect, useRef, useState } from 'react';
import { FadeInSection } from './components/FadeInSection.jsx';
import Header from "./components/Header.jsx";
import {Link} from "react-router-dom";


const layers = [
    { src: "./layer_sun.svg", class:"layer layer_sun", speed: 300, initY: 0, initX: 0, zIndex: -6, moveX: true, moveY: true},
    { src: "./layer_1.svg", class:"layer layer_1", speed: 70, initY: 10, initX: 0, zIndex: 1, moveX: false, moveY: true},
    { src: "./layer_2.svg", class:"layer layer_2", speed: 40, initY: 3, initX: 0, zIndex: 0, moveX: false, moveY: true},
    { src: "./layer_light.svg", class:"layer layer_2--light", speed: 45, initX: 0, initY: 20 , zIndex: 0, moveX: false, moveY: true},
    { src: "./layer_3.svg", class:"layer layer_3", speed: 30, initY: 10, initX: 0, zIndex: -1 , moveX: false, moveY: true},
    { src: "./layer_light.svg", class:"layer layer_3--light", speed: 40, initX: 0, initY: 0, zIndex: -1, moveX: false, moveY: true },
    { src: "./layer_4.svg", class:"layer layer_4", speed: 35, initY: -25, initX: 0, zIndex: -2, moveX: false, moveY: true },
    { src: "./layer_5.svg", class:"layer layer_5", speed: 45, initY: -38, initX: 0, zIndex: -3, moveX: false, moveY: true },
    { src: "./layer_claude_1.svg", class:"layer layer_claude", width: "25%", top: "-3%", left: "-12%", speed: 45, initY: 0, initX: 0, zIndex: -4, moveX: true, moveY: true },
    { src: "./layer_claude_2.svg", class:"layer layer_claude", width: "15%", top: "5%", left: "6%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_3.svg", class:"layer layer_claude", width: "12%", top: "2%", left: "25%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_4.svg", class:"layer layer_claude", width: "25%", top: "1%", left: "45%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_5.svg", class:"layer layer_claude", width: "15%", top: "9%", left: "55%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_6.svg", class:"layer layer_claude", width: "24%", top: "7%", right: "-8%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_7.svg", class:"layer layer_claude", width: "20%", top: "18%", left: "10%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_8.svg", class:"layer layer_claude", width: "10%", top: "19%", left: "23%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_9.svg", class:"layer layer_claude", width: "15%", top: "30%", left: "40%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_10.svg", class:"layer layer_claude", width: "20%", top: "23%", right: "12%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_claude_11.svg", class:"layer layer_claude", width: "15%", top: "23%", right: "8%", speed: 45, initY: 0, initX: 0, zIndex: -5, moveX: true, moveY: true },
    { src: "./layer_lines_1.svg", class:"layer layer_lines", width: "40%", top: "6%", left: "22%", speed: 45, initY: 0, initX: 0, zIndex: -3, moveX: true, moveY: true },
    { src: "./layer_lines_2.svg", class:"layer layer_lines", width: "70%", top: "15%", left: "-10%", speed: 45, initY: 0, initX: 0, zIndex: -3, moveX: true, moveY: true },
    { src: "./layer_lines_3.svg", class:"layer layer_lines", width: "70%", top: "25%", right: "-10%", speed: 45, initY: 0, initX: 0, zIndex: -3, moveX: true, moveY: true },
    { src: "./layer_lines_4.svg", class:"layer layer_lines", width: "40%", top: "25%", left: "-30%", speed: 45, initY: 0, initX: 0, zIndex: -4, moveX: true, moveY: true },
];

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}


function App() {
    const refs = useRef([]);
    const zoneRef = useRef(null); // ref на зону активації
    const current = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);
    const ease = 0.05;

    // Стан для Хедера: false = ми на першій секції, true = ми проскролили нижче
    const [isScrolled, setIsScrolled] = useState(false);


    useEffect(() => {
        const handleMouseMove = (e) => {
            const rect = zoneRef.current?.getBoundingClientRect();
            if (!rect) return;

            const insideZone =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top  &&
                e.clientY <= rect.bottom;

            if (insideZone) {
                // Рахуємо центр зони активації
                const zoneCenterX = rect.left + rect.width / 2;
                const zoneCenterY = rect.top + rect.height / 2;

                // ОНОВЛЕНО: Тепер обчислюємо цільову позицію і для X, і для Y
                target.current.x = zoneCenterX - e.clientX;
                target.current.y = zoneCenterY - e.clientY;
            } else {
                // Якщо курсор вийшов за межі — скидаємо обидві осі в 0
                target.current.x = 0;
                target.current.y = 0;
            }
        };

        const animate = () => {
            current.current.x = lerp(current.current.x, target.current.x, ease);
            current.current.y = lerp(current.current.y, target.current.y, ease);


            refs.current.forEach((el, i) => {
                if (!el) return;

                // ОНОВЛЕНО: Дістаємо прапорці moveX та moveY
                const { speed, initX, initY, moveX = true, moveY = true } = layers[i];

                // ОНОВЛЕНО: Перевіряємо, чи дозволено рух по відповідній осі
                const offsetX = moveX ? current.current.x / speed : 0;
                const offsetY = moveY ? current.current.y / speed : 0;

                // Додаємо зміщення до початкової позиції (в тебе там відсотки `translateX(${x}%)`)
                // Важливо: переконайся, що ділення px на speed коректно виглядає у відсотках,
                // або заміни `%` на `px`, якщо значення виходять завеликими/замалими.
                const x = initX + offsetX;
                const y = initY + offsetY;
                el.style.transform = `translateX(${x}%) translateY(${y}%)`;
            });

            rafId.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId.current);
        };
    }, []);
  return (
      <div className="app">
          <Header isScrolled={isScrolled} />
          <main className="main">
              {/* 2. Вішаємо відстежування ТІЛЬКИ на ПЕРШУ секцію */}
              <FadeInSection className="section hero" ref={zoneRef} onVisibilityChange={(visible) => {
                  // Якщо першу секцію видно -> isScrolled = false
                  // Якщо перша секція зникла -> isScrolled = true
                  setIsScrolled(!visible);
              }}>
                  {layers.map((layer, i) => (
                      <img
                          key={i}
                          ref={(el) => (refs.current[i] = el)}
                          src={layer.src}
                          className={layer.class}
                          alt=""
                          style={{
                              left: layer.left ,
                              right: layer.right ,
                              top: layer.top,
                              width: layer.width,
                              transform: `translateX(${layer.initX}%) translateY(${layer.initY}%)`,
                              zIndex: layer.zIndex
                          }}
                      />
                  ))}
                  <h1 className="h1 hero__title">SENJA</h1>
                  <div className="hero__info">
                      <h3 className="h3 hero__text">
                          Discover a new journey with <strong>Senja</strong>, we give best experience for our costumer
                      </h3>
                      <div className="hero__button">
                          <button className="btn btn__primary">BOOK NOW</button>
                      </div>
                  </div>
              </FadeInSection>
              <FadeInSection className="section blocks">
                  <div className="container blocks__inner">
                      <h4 className="blocks__title">
                          Grab A Cup Of Coffee With Senja
                      </h4>
                      <div className="blocks__column">
                          <Link className="blocks__block" to="/">
                              <img src="./block-img_1.png" alt=""/>
                          </Link>
                          <Link className="blocks__block" to="/">
                              <img src="./block-img_2.png" alt=""/>
                          </Link>
                          <Link className="blocks__block" to="/">
                              <img src="./block-img_3.png" alt=""/>
                          </Link>
                      </div>
                  </div>
              </FadeInSection>
          </main>
      </div>
  )
}

export default App
