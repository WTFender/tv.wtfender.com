<script>
import { SHA256, enc } from 'crypto-js';
export default {
  data() {
    return {
      url: 'https://nx3lvp6p7v2mehji6x3bbkrojq0whehl.lambda-url.us-west-2.on.aws/',
      authError: false,
      password: '',
    };
  },
  emits: ['playlist', 'raw'],
  computed: {
    passwordHash() {
      return SHA256(this.password).toString(enc.Hex);
    },
  },
  watch: {
    password(s) {
      if (s.length > 5) {
        this.getPlaylist();
      }
    },
  },
  methods: {
    validatePlaylist(text) {
      const playlist = this.parsePlaylist(text);
      if (!playlist) {
        this.authError = true;
      }
      this.$emit('playlist', playlist);
      this.$emit('raw', text);
      return playlist
    },
    parsePlaylist(text) {
      if (!text.startsWith('#EXTM3U')) {
        return false;
      }
      const playlist = []
      
      text.split('\n').forEach(line => {
        if (line.startsWith('#EXTINF')) {
          const rex = /#EXTINF.*tvg-id="(?<id>.*)"\stvg-name="(?<name>.*)"\stvg-logo="(?<logo>.*)\"\sgroup-title="(?<group>.*)"\,.*(?<time>\d{2}:\d{2}\s(AM|PM)\s(\w+)).*\((?<date>.*)\)$/;
          const { groups: { id, name, group, time, date } } = rex.exec(line)
          
          playlist.push({
            id,
            name,
            group,
            time,
            date,
            dt: new Date(`${date} ${time}`),
          });
        }
      });
      return playlist;
    },
    getPlaylist() {
      fetch(this.url, {
        headers: {Authorization: this.passwordHash}
      })
      .then(resp => resp.text())
      .then(resp => this.validatePlaylist(resp))
      .catch((e) => {
        this.authError = true;
        console.log(e);
      });
    },
  },
};
</script>

<template>
  <Password
    v-model="password"
    :feedback="false"
    :invalid="authError"
    :disabled="false"
  />
</template>
<style scoped>
</style>
