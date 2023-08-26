import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import * as _ from 'lodash';
import { Piano } from './piano';

const midiFilePath = './assets/peacepiece.mid';

const midi = await Midi.fromUrl(midiFilePath);
const notes = midi.tracks[0].notes;

// const pianos = midi.tracks.map(() => new Piano());
const piano = new Piano();
// console.log('piano set up', pianos);

document.querySelector('textarea')?.addEventListener('keydown', (e) => {
  // eslint-disable-next-line no-constant-condition
  console.log('starting...');
  console.log('Tone.context.state', Tone.context.state);

  //create a synth for each track
  // const piano = pianos[index];
  const note = noteGenerator.next().value;
  console.log(note);

  if (note) {
    piano.triggerAttackRelease(
      [note.name],
      [note.duration * 1.2, '4'],
      Tone.now(),
      note.velocity
    );
  }
});

const noteGenerator = NoteGenerator();
function* NoteGenerator() {
  while (notes.length) {
    yield notes.shift();
  }
}
