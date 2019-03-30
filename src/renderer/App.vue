<template>
  <div class="container-fluid" id="app">
    <div class="row">
      <div class="col-12 bg-secondary">
        <headerView @settingsAudio="updateAudio" @settingsNotif="updateNotif"></headerView>
      </div>
    </div>

    <div class="row">
      <div class="col-12 bg-secondary">
        <youtubeView></youtubeView>  
        <twitchView></twitchView>
      </div>
    </div>
  </div>
</template>

<script>
  import headerView from './components/header'
  import youtubeView from './components/youtube'
  import twitchView from './components/twitch'
  import Store from 'electron-store'
  import fs from 'fs'
  import download from 'download'

  const store = new Store()

  export default {
    name: 'Snakou', 
    components: {headerView, youtubeView, twitchView},
    data: () => {
      return {
        audio: false,
        notification: false
      }
    },
    methods: {
      updateAudio: function (data) {
        this.audio = data
        store.set('audio', this.audio)
        console.log(store.get('audio'))
      }, 
      updateNotif: function (data) {
        this.notification = data
        store.set('notification', this.notification)
        console.log(store.get('notification'))
      },
      firstRun: function () {       
        if (!fs.existsSync('Settings')) {
          fs.mkdirSync('Settings')
          download('https://snakou.loicnogier.fr/notif.mp3').pipe(fs.createWriteStream('Settings/notif.mp3'));
        }

      }
    },
    mounted() {
      this.firstRun()
      if (typeof(store.get('audio')) === typeof(undefined)) {
        this.firstRun()
        this.updateAudio(false)
      }
      if (typeof(store.get('notification')) === typeof(undefined)) {
        this.updateNotif(false)
      }
    },
  }
</script>

<style>
  /* CSS */
</style>
