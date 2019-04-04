<template>
  <div class="row mt-2 bg-dark" style="height: 40px;">
    <div class="col-2 text-left">
      <p>
        <a href="#!" style="line-height: 40px" class="text-white" @click="open('https://twitter.com/mastersnakou')">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#!" style="line-height: 40px" class="text-white ml-3" @click="open('https://twitch.tv/mastersnakou')">
          <i class="fab fa-twitch"></i>
        </a>
        <a href="#!" style="line-height: 40px" class="text-white ml-3" @click="open('https://youtube.com/mastersnakou')">
          <i class="fab fa-youtube"></i>
        </a>
      </p>
    </div>
    <div class="col-8 text-center">
      <span style="line-height: 40px">
        <a v-if="StatutStream" class="text-white ml-5" href="#" @click="open('https://twitch.tv/mastersnakou')" role="button"><i class="fab fa-twitch"></i> SNAKOU EN STREAM !</a>
      </span>
    </div>
    <div class="col-2 text-right">
      <span style="line-height: 40px">
        <a class="text-white" href="#" @click="help()" role="button"><i class="fas fa-info"></i> </a>
        <a v-if="update" class="text-white" href="#" @click="open(updateLink)" role="button"><i class="fas fa-download"></i> </a>
        <a v-if="audio" class="text-white ml-3" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-up"></i> </a>
        <a v-else-if="!audio" class="text-white ml-3" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-mute"></i></a>
        <a v-if="notification" class="text-white ml-3" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell"></i></a>
        <a v-else-if="!notification" class="text-white ml-3" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell-slash"></i></a>
      </span>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Store from 'electron-store'
  import Swal from 'sweetalert2'
  const store = new Store()
  const notifier = require('node-notifier')

  export default {
    name: 'headerView',
    props: ['bus'],
    data: () => {
      return {
        audio: false,
        update: false,
        updateLink: null,
        notification: false,
        updateNotification: false,
        updateInter: null,
        version: 1.5,
        StatutStream: false
      }
    },
    methods: {
      help: function () {
        Swal.fire({
          title: '<strong>Aide</strong>',
          type: 'info',
          html:
            '<ul> <h3>Vidéo non disponible</h3>' +
            "<li style='text-align:left; width: 320px; margin-left: 110px'>Malheureusement pour le moment pas le choix, s'il vous arrive de tomber sur une vidéo non disponible, il vous faut l'ouvrir sur votre navigateur.</li>" +
            '</ul>' +            
            '<ul> <h3>Si vous rencontrez avez des problèmes</h3>' +
            "<li style='text-align:left; width: 320px; margin-left: 110px'>Pour me remonter les bugs, merci de directement me contacter <a href='https://twitter.com/zaekof' target='_blank'>ici</a>, Ou de faire une Issue <a href='https://github.com/Zaekof/SnakouApplication/issues' target='_blank'>ici</a>." +
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
      },
      updateInterval: function () {
        if (this.updateInter !== null) {
          clearInterval(this.updateInter)
          this.updateInter = null
        }
        let _this = this
        this.updateInter = setInterval(function () {
          _this.checkUpdate()
        }, 80000)
      },
      checkUpdate: async function () {
        let _this = this
        try {
          const response = await axios.get('https://api.github.com/repos/Zaekof/SnakouApplication/tags')

          if (response.status === 200 && response.data) {
            let GitVersion = response.data[response.data.length - 1].name
            GitVersion = parseFloat(GitVersion)
            if (GitVersion > this.version) {
              this.update = true
              this.updateLink = 'https://github.com/Zaekof/SnakouApplication/releases/tag/'+GitVersion
              if (!this.updateNotification) {
                this.updateNotification = true
                notifier.notify(
                  {
                    title: 'Snakou Application',
                    message: 'Nouvelle mise à jour disponible !',
                    wait: true,
                    open: 'https://github.com/Zaekof/SnakouApplication/releases/tag/'+GitVersion
                  },
                  function(err, response) {
                    console.log(response)
                  }
                )

                notifier.on('click', function(notifierObject, options) {
                  _this.open(options.open)
                })
              }
            } else {
              this.update = false
              this.updateNotification = false
            }
          } else {
            clearInterval(this.updateInter)
            this.updateInterval()
            return false
          }
        } catch (error) {
          console.log(error)
          clearInterval(this.updateInter)
          this.updateInterval()
          return false
        }        
      },      
      changeAudio: function () {
        this.audio = !this.audio

        this.$emit('settingsAudio', this.audio)
      },
      changeNotif: function () {
        this.notification = !this.notification

        this.$emit('settingsNotif', this.notification)
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted() {
      this.checkUpdate()
      this.updateInterval()
      this.audio = store.get('audio')
      this.notification = store.get('notification')

      this.bus.$on('TwitchEventBus', (data) => {
        this.StatutStream = data
        console.log(this.StatutStream)
      })
    },
  }
</script>

<style scoped>
  a[role='button'] {
    cursor: pointer;
  }
  a i:hover {
    transition: 0.5s;
    color: aqua;
  }
</style>

