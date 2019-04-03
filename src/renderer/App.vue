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
  import fse from 'fs-extra'
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
      }, 
      updateNotif: function (data) {
        this.notification = data
        store.set('notification', this.notification)
      },
      downloadAudio: function () {
        let url = require('path').join(__static, '/notif.mp3')    
        if (!fs.existsSync('Settings')) {
          fs.mkdirSync('Settings')
          fse.copySync(url, 'Settings/notif.mp3')
        }
      }
    },
    created() {
      this.downloadAudio()
      if (typeof(store.get('firstRunCheck')) === typeof(undefined)) {
        this.firstRunCheck = false
        store.set('firstRunCheck', false)
        Swal.fire({
          title: '<strong>Premier lancement</strong>',
          type: 'info',
          html:
            '<ul> <h3>A quoi sert ce logiciel ?</h3>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Regardez les dernières vidéos de Snakou.</li>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Recevoir des notifications lorsque Snakou sort une nouvelle vidéo ou lance un streaming en direct.</li>' +
            '</ul>' +
            '<ul> <h3>Si vous rencontrez avez des problèmes</h3>' +
            '<li style="text-align:left; width: 320px; margin-left: 110px">Contactez-moi sur Twitter <a target="_blank" href="https://twitter.com/zaekof">@Zaekof</a></li>' +
            '</ul>',            
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Génial!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            'Fermer',
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

  document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
      require('remote').getCurrentWindow().toggleDevTools()
    } else if (e.which === 116) {
      location.reload()
    } else if (e.which === 82) {
      store.delete('firstRunCheck')
    }
  })     
</script>

<style>
  /* CSS */
</style>
