<template>
  <div class="mt-2 mb-2" id="wrapper">

    <iframe id="ytplayer" type="text/html" v-for="video in videos" :key="video.id" width="100%" height="100%" 
      v-bind:src="`https://www.youtube.com/embed/${video}?playlist=&version=3&cc_load_policy=1&enablejsapi=1&modestbranding=1&playsinline=1&start=0&color=white`"
      frameborder="0" allowfullscreen />
  
  </div>
</template>

<script>
  import axios from 'axios'
  import Store from 'electron-store'
  import fs from 'fs'
  import notifier from 'node-notifier'

  const {Howl, Howler} = require('howler')
  const store = new Store()

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
        url: 'https://zapi.z-api.fr/api/youtube/lastvideo'
      }
    },
    methods: {
      notification (id) {
        let _this = this
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
      },
      async main () {
        let videos = await this.getVids()

        if (this.videos.length <= 0) {
          videos.forEach(async (video, cpt) => {
            let videoId = video.snippet.resourceId.videoId
            this.videos.push(videoId)
          })

        } else if (this.videos.length >= 10) {
          videos.forEach(async (video, cpt) => {
            let videoId = video.snippet.resourceId.videoId

            if (videoId !== this.videos[cpt]) {
              this.videos.pop()
              this.videos.push(videoId)
            }
          })
        }

        let firstVideo = this.videos[0]
        if (store.get('LastVideo') !== firstVideo) {
          store.set('LastVideo', firstVideo)

          if (store.get('notification')) {
            this.notification(firstVideo)
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
        this.firstRun = false
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
    height: 250px;

    float: left;
    opacity: 0;
    animation: 1.5s opacityVideo 1.5s forwards;
  }

  @keyframes opacityVideo {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media screen and (min-width: 1000px) and (max-width: 1200px) {
    #wrapper iframe {
      height: 350px;
    }
  }  
  @media screen and (min-width: 1200px) {
    #wrapper iframe {
      height: 500px;
    }
  }  
</style>
