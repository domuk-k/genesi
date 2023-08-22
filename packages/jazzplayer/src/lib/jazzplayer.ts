import { piano } from './piano';

// const midiFilePath = './assets/peacepiece.mid';

document.addEventListener('keyup', (e) => {
  piano.triggerAttack('C3', 0, 1);
});
