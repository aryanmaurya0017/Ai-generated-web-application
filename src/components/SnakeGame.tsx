import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlitchedText } from './GlitchedText';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export const SnakeGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const spawnFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    setFood(newFood);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const next = s + 10;
          onScoreUpdate(next);
          return next;
        });
        spawnFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, spawnFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = useCallback((timestamp: number) => {
    const speed = Math.max(50, 150 - Math.floor(score / 100) * 10);
    if (timestamp - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, score]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setGameStarted(true);
    lastUpdateRef.current = performance.now();
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative flex flex-col items-center gap-6 w-full max-w-[440px]">
      <div className="relative w-full aspect-square bg-black rounded-xl overflow-hidden border-2 border-white/5 shadow-inner">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }} 
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className="absolute rounded-[4px]"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              backgroundColor: i === 0 ? 'var(--color-neon-lime)' : 'rgba(57, 255, 20, 0.4)',
              boxShadow: i === 0 ? '0 0 15px var(--color-neon-lime)' : 'none',
              zIndex: i === 0 ? 10 : 1,
            }}
            initial={false}
            animate={{ scale: 1 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute bg-neon-pink rounded-full"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            boxShadow: '0 0 15px var(--color-neon-pink)'
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center"
            >
              <GlitchedText text="SYSTEM ACTIVE" className="text-3xl font-bold mb-4" />
              <p className="text-xs opacity-70 mb-8 max-w-[200px]">CONTROL THE SNAKE PROTOCOL USING ARROW KEYS</p>
              <button 
                onClick={() => setGameStarted(true)}
                className="px-8 py-3 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold tracking-widest uppercase text-sm"
              >
                INITIALIZE
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 text-center border-2 border-neon-pink shadow-[0_0_30px_rgba(255,0,234,0.3)]"
            >
              <GlitchedText text="NODE CRITICAL" glow={false} className="text-3xl font-bold mb-2 text-neon-pink" />
              <div className="mb-8">
                <p className="text-[10px] opacity-50 uppercase tracking-[0.4em] mb-1 font-mono">Final Score</p>
                <p className="text-5xl font-mono font-bold text-white tracking-tighter">{score}</p>
              </div>
              <button 
                onClick={restartGame}
                className="px-10 py-4 bg-neon-pink text-white hover:brightness-125 transition-all font-bold tracking-widest uppercase text-xs rounded-full shadow-[0_0_15px_rgba(255,0,234,0.4)]"
              >
                REINITIALIZE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-[9px] font-mono opacity-30 uppercase tracking-[0.4em]">
        <span>Nav_Keys_Detect</span>
        <span>•</span>
        <span>Freq_{score}Hz</span>
      </div>
    </div>
  );
};
