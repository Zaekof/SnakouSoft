<template>
  <div class="row mt-2 bg-dark" style="height: 40px;">
    <div class="col-6 text-left">
      <p>
        <a href="#!" style="line-height: 40px" class="text-white" @click="open('https://twitter.com/mastersnakou')">
          <i class="fab fa-twitter"></i> @MasterSnakou
        </a>
        <a href="#!" style="line-height: 40px" class="text-white ml-2" @click="open('https://twitch.tv/mastersnakou')">
          <i class="fab fa-twitch"></i> @MasterSnakou
        </a>
        <a href="#!" style="line-height: 40px" class="text-white ml-2" @click="open('https://youtube.com/mastersnakou')">
          <i class="fab fa-youtube"></i> @MasterSnakou
        </a>       
      </p>
    </div>  
    <div class="col-6 text-right">
      <span style="line-height: 40px">
        <a v-if="update" class="text-white" href="#" @click="open(updateLink)" role="button"><i class="fas fa-download"></i> </a>
        <a v-if="audio" class="text-white ml-2" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-up"></i> </a>
        <a v-else-if="!audio" class="text-white ml-2" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-mute"></i></a>
        <a v-if="notification" class="text-white ml-2" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell"></i></a>
        <a v-else-if="!notification" class="text-white ml-2" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell-slash"></i></a>
      </span>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Store from 'electron-store'
import { clearInterval } from 'timers';
  const store = new Store()
  const notifier = require('node-notifier')

  export default {
    name: 'headerView', 
    data: () => {
      return {
        audio: false,
        update: false,
        updateLink: null,
        notification: false,
        updateNotification: false,
        updateInter: null,
        version: 1.3
      }
    },
    methods: {
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
    },
  }
</script>

<style scoped>
  a[role='button'], {
    cursor: pointer;
  }
</style>

