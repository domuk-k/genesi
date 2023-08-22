import * as Tone from 'tone';
import { Midi, Track } from '@tonejs/midi';

const midiFilePath = './assets/in-the-hall.mid';

const midi = await Midi.fromUrl(midiFilePath);
const now = Tone.now() + 0.5;
const synth = new Tone.Synth({
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.3,
    release: 1,
  },
}).toDestination();

document.addEventListener('click', () => {
  midi.tracks.forEach((track: Track) => {
    track.notes.forEach((note) => {
      synth.triggerAttackRelease(
        note.name,
        note.duration,
        note.time + now,
        note.velocity
      );
    });
  });

  Tone.Transport.start();
});
