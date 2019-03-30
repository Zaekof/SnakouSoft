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
        <a v-if="audio" class="text-white" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-up"></i> </a>
        <a v-else-if="!audio" class="text-white" href="#" @click="changeAudio()" role="button"><i class="fas fa-volume-mute"></i></a>
        <a v-if="notification" class="text-white ml-2" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell"></i></a>
        <a v-else-if="!notification" class="text-white ml-2" href="#" @click="changeNotif()" role="button"><i class="fas fa-bell-slash"></i></a>
      </span>
    </div>
  </div>
</template>

<script>
  import Store from 'electron-store'
  const store = new Store()

  export default {
    name: 'headerView', 
    data: () => {
      return {
        audio: false,
        notification: false
      }
    },
    methods: {
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

