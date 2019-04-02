<template>
  <div class="mt-2 mb-2" id="wrapper">
      <!--<a href="#!" @click="remove()">remove</a>-->
      <iframe v-for="video in videos" :key="video.id" width="100%" height="100%" v-bind:src="`https://www.youtube-nocookie.com/embed/${video}`"
        frameborder="0" allowfullscreen>
      </iframe>

  </div>
</template>

<script>
  import axios from 'axios'
  import Store from 'electron-store'
  import fs from 'fs'
  import {Howl, Howler} from 'howler'

  const store = new Store()
  const notifier = require('node-notifier')

  export default {
    name: 'youtube',
    data: () => {
      return {
        firstRun: false,
        show: true,
        videos: [],
        inter: null,
        key: 'AIzaSyCEBAOKZyqFEsauVZWIJY07CdTv6-WdFdk',
        linksPlaylist: 'https://www.googleapis.com/youtube/v3/playlistItems',
        playlistId: 'UUOhP0t6arWMXqmcroJjMJ7A',
        maxResult: '12',
        url: 'http://z-api.fr:8080/api/youtube/lastvideo'
      }
    },
    methods: {
      notification (type, id) {
        let _this = this
        if (type == 'youtube') {
          notifier.notify(
            {
              title: 'Youtube',
              message: 'Nouvelle vidéo de Snakou!',
              wait: true,
              open: 'https://www.youtube.com/watch?v='+id
            },
            function(err, response) {
              console.log(response)
            }
          )

          notifier.on('click', function(notifierObject, options) {
            _this.$electron.shell.openExternal(options.open)
          })
        } else if (type == 'twitch') {
          notifier.notify(
            {
              title: 'Twitch',
              message: 'Snakou lance un stream !',
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
        let videos = await this.getVids()
        let tmpVideos = []
        videos.forEach(async (video, cpt) => {
          let videoId = video.snippet.resourceId.videoId

          if (videoId !== this.videos[cpt]) {
            this.videos.push(videoId)
          }
        })

        if (store.get('LastVideo') !== this.videos[0]) {
          store.set('LastVideo', this.videos[0])

          if (store.get('notification')) {
            this.notification('youtube', this.videos[0])
            if (store.get('audio')) {
              if (fs.existsSync('Settings/notif.mp3')) {
                let sound = new Howl({
                  src: ['Settings/notif.mp3'],
                  autoplay: true,
                  loop: false,
                  volume: 0.1,
                })
              }
            }
          }
        }
        this.firstRun = false
      },
      remove () {
        //store.delete('LastVideo')
        store.delete('TwitchStatus')
      },
      interval () {
        let _this = this
        this.inter = setInterval(function () {
          _this.main()
        }, 60000)
      },
      async getVids () {
        try {
          let _this = this

          const response = await axios.get( _this.url, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type' : 'application/x-www-form-urlencoded',
              'token': 'dlkd75sdfh45fdfdkjfk0465'
            },
          })

          if (response.status === 200 && response.data) {
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
      let _this = this

      if (typeof(store.get('LastVideo')) === typeof(undefined)) {
        store.set('LastVideo', '')
        this.firstRun = true
      }

      this.main()
      this.interval()   
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    float: left;
  }
  #wrapper iframe {
    width: 50%;
    height: calc(50vh - 50px);

    float: left;
    opacity: 0;
    animation: 1s opacityVideo 1s forwards;
  }

  @keyframes opacityVideo {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
