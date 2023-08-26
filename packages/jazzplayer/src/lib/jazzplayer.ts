import * as Tone from 'tone';
import { Midi, Track } from '@tonejs/midi';

import { Piano } from './piano';

const midiFilePath = './assets/peacepiece.mid';

/**
 * 한 번에 트리거에 한 번에 스케줄링할 tick 차이의 기준을 설정합니다.
 * 100으로 설정하면 100 tick 이하의 차이가 있는 노트들은 한 번에 트리거에 스케줄링됩니다.
 */
const CHORD_THRESHOLD = 110;

const notes = await Midi.fromUrl(midiFilePath).then(
  (midi) => midi.tracks[0].notes
);

const arrangedNotes = rearrangeNotes(notes);

const piano = new Piano();

let index = 0;
document.querySelector('textarea')?.addEventListener('keyup', (e) => {
  if (e.key === 'Backspace') {
    index -= 1;
  } else {
    playNote(arrangedNotes[index++]);
  }
});

function playNote(notes: Note[]) {
  if (notes) {
    notes.forEach((note) => {
      piano.triggerAttackRelease(
        note.name,
        note.duration,
        Tone.now() + note.time
      );
    });
  }
}

type Note = Track['notes'][0];

function rearrangeNotes(notes: Note[]) {
  // 빈 배열을 생성하여 결과를 저장할 준비를 합니다.
  const rearrangedNotes = [];

  // 현재 묶음으로 처리 중인 배열을 저장할 변수와 초기 tick 값을 설정합니다.
  let currentGroup: Note[] = [];
  let currentTick = notes[0].ticks;

  // notes 배열을 순회하며 tick 차이가 100 이하인 경우 묶어주고, 그렇지 않은 경우 새로운 묶음을 시작합니다.
  for (const note of notes) {
    if (note.ticks - currentTick <= CHORD_THRESHOLD) {
      currentGroup.push(note);
    } else {
      rearrangedNotes.push(currentGroup);
      currentGroup = [note];
      currentTick = note.ticks;
    }
  }

  // 마지막으로 남은 묶음을 결과에 추가합니다.
  if (currentGroup.length > 0) {
    console.log(currentGroup);
    rearrangedNotes.push(currentGroup);
  }

  rearrangedNotes.map((notes) => {
    const firstNoteTime = notes[0].time;

    return notes.map((note) =>
      Object.assign(note, {
        time: (note.time - firstNoteTime) * 1.4,
      })
    );
  });

  return rearrangedNotes;
}
