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
  import Swal from 'sweetalert2'

  const store = new Store()

  export default {
    name: 'Snakou', 
    components: {headerView, youtubeView, twitchView},
    data: () => {
      return {
        audio: false,
        notification: false,
        firstRunCheck: true
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
      downloadAudio: function () {       
        if (!fs.existsSync('Settings')) {
          fs.mkdirSync('Settings')
          download('https://snakou.loicnogier.fr/notif.mp3').pipe(fs.createWriteStream('Settings/notif.mp3'));
        }

      }
    },
    created() {    
      this.downloadAudio()
      if (typeof(store.get('firstRunCheck')) === typeof(undefined)) {
        this.firstRunCheck = false
        store.set('firstRunCheck', false)
        Swal.fire({
          title: '<strong>First launch</strong>',
          type: 'info',
          html:
            '<ul> <h3>What is this software for?</h3>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Watch the latest videos of Snakou.</li>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Receive notifications when Snakou releases a new video or start live stream.</li>' +
            '</ul>' +
            '<ul> <h3>If you have any problems</h3>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Contact me on Twitter <a target="_blank" href="https://twitter.com/zaekof">@Zaekof</a></li>' +
            '</ul>',            
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            'Close',
        })          
      }
      if (typeof(store.get('audio')) === typeof(undefined)) {
        this.updateAudio(false)
      }
      if (typeof(store.get('notification')) === typeof(undefined)) {
        this.updateNotif(false)
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
