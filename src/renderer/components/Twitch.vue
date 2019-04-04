<template></template>

<script>
  import axios from 'axios'
  import Store from 'electron-store'
  import fs from 'fs'

  const store = new Store()
  const notifier = require('node-notifier')
  const {Howl, Howler} = require('howler')

  export default {
    name: 'twitch',
    data: () => {
      return {
        status: false,
        inter: null,
        url: 'https://zapi.z-api.fr/api/twitch/status'
      }
    },
    methods: {
      notification (type, id) {
        let _this = this
        if (type == 'twitch') {
          notifier.notify(
            {
              title: 'Twitch',
              message: 'Snakou est en stream !',
              wait: true,
              open: 'https://twitch.tv/mastersnakou'
            },
            function(err, response) {
              console.log(response)
            }
          )

          notifier.on('click', function(notifierObject, options) {
            _this.$electron.shell.openExternal(options.open)
          })          
        }

      },
      async main () {
        this.status = await this.getStream()

        if (this.status) {
          if (!store.get('TwitchStatus')) {
            this.$emit('TwitchStatusEvent', true)
            store.set('TwitchStatus', true)

            if (store.get('notification')) {
              this.notification('twitch')
                if (store.get('audio')) {
                  let url = require('path').join(__static, '/notif.mp3')
                  let sound = new Howl({
                    src: [''+url+''],
                    autoplay: true,
                    loop: false,
                    volume: 0.1,
                  }) 
                }
            }
          }
        } else if (!this.status) {
          if (store.get('TwitchStatus')) {
            this.$emit('TwitchStatusEvent', false)
            store.set('TwitchStatus', false)
          }
        }
      },
      interval () {
        let _this = this
        this.inter = setInterval(function () {
          _this.main()
        }, 60000)
      },
      async getStream () {
        try {
          let _this = this

          const response = await axios.get( _this.url, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type' : 'application/x-www-form-urlencoded',
              'token': 'dlkd75sdfh45fdfdkjfk0465'
            },
          })

          if (response.status === 200) {
            return response.data
          } else {
            clearInterval(this.inter)
            this.interval()
            return false
          }
        } catch (error) {
          console.log(error)
          clearInterval(this.inter)
          this.interval()
          return false
        }
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted() {
      this.main()
      this.interval()   
    },
    created() {
      if (typeof(store.get('TwitchStatus')) === typeof(undefined)) {
        store.set('TwitchStatus', false)
      }
    }
  }
</script>

<style></style>
