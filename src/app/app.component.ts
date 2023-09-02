import {Component} from '@angular/core';
import {Observable} from "rxjs";
import * as moment from "moment/moment";
import {files} from "src/app/data/data"
import {File} from "./models/flles";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  eventStatus = ''
  mutedBut: boolean
  volumeValue = 0.5
  activeSongId: number
  activeName: string
  audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ]
  files = files
  currentTime = '00:00:00'
  duration = '00:00:00'
  durationSec = 0
  seek = 0
  columnNames = ['ID', 'Title song', 'Artist', 'Song type', 'Name']

  play() {
    this.audioObj.play().then()
  }

  pause() {
    this.audioObj.pause()
  }

  stop() {
    this.audioObj.pause()
    this.audioObj.currentTime = 0
  }

  open(file:File) {
    this.streamObserver(file).subscribe()
  }

  setVolume(event: Event) {
    this.volumeValue = this.audioObj.volume = Number((event.target as HTMLTextAreaElement).value)
  }

  streamObserver(file:File) {
    return new Observable(() => {
      this.audioObj.src = file.url
      this.activeName = file.name
      this.activeSongId = file.id
      this.audioObj.load()
      this.audioObj.play().then()

      const handler = (event: Event) => {
        this.eventStatus = event.type
        this.currentTime = this.timeFormat(this.audioObj.currentTime)
        this.duration = this.timeFormat(this.audioObj.duration)
        this.durationSec = this.audioObj.duration
        this.seek = this.audioObj.currentTime
      };
      this.addEvent(this.audioObj, this.audioEvents, handler);
      return () => {
        this.audioObj.pause()
        this.audioObj.currentTime = 0
        this.removeEvent(this.audioObj, this.audioEvents, handler)
      }
    })
  }

  timeFormat(time: number, format = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format)
  }

  goTo(event: Event) {
    this.audioObj.currentTime = Number((event.target as HTMLTextAreaElement).value)
  }

  addEvent(obj: HTMLAudioElement, events: string[], handler: any) {
    events.forEach((ev: string) => {
      obj.addEventListener(ev, handler)
    })
  }

  removeEvent(obj: HTMLAudioElement, events: string[], handler: any) {
    events.forEach((ev: string) => {
      obj.removeEventListener(ev, handler)
    })
  }

  mute() {
    this.mutedBut = this.audioObj.muted = true
  }

  unmute() {
    this.mutedBut = this.audioObj.muted = false
  }

  getNextSong() {
    let i = this.files.findIndex(el => el.id === this.activeSongId)
    if (this.files && i > -1 && i < this.files.length - 1) {
      const nextSong = this.files[i + 1]
      this.open(nextSong)
      return nextSong
    } else {
      return null
    }
  }

  getPreviousSong() {
    let i = this.files.findIndex(el => el.id === this.activeSongId)
    if (this.files && i > 0 && i < this.files.length) {
      const previousSong = this.files[i - 1]
      this.open(previousSong)
      return previousSong
    } else {
      return null
    }
  }
}
