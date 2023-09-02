import {Component} from '@angular/core';
import {Observable} from "rxjs";
import * as moment from "moment/moment";
import {files} from "src/app/data/data"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  eventStatus=''
  mutedBut:boolean
  volumeValue = 0.5
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
  columnNames = ['ID','Title song','Artist', 'Song type', 'Name']

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

  open(url: string, name: string) {
    this.streamObserver(url, name).subscribe()
  }

  setVolume(event: Event) {
    this.volumeValue = this.audioObj.volume = Number((event.target as HTMLTextAreaElement).value)
  }

  streamObserver(url: string, name: string) {
    return new Observable(() => {
      this.audioObj.src = url
      this.activeName = name
      this.audioObj.load()
      this.audioObj.play().then()

      const handler = (event:Event) => {
        console.log(event)
        this.eventStatus = event.type
        console.log(this.eventStatus)
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
    console.log(this.audioObj.muted)
  }
  unmute(){
    this.mutedBut = this.audioObj.muted = false
  }
}
