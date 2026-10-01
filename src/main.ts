import './style.css'
import Tetris from './Tetris';

const canv: HTMLCanvasElement = document.getElementById('canv') as HTMLCanvasElement;

const tetris = new Tetris(canv);
tetris.start();
tetris.loop();