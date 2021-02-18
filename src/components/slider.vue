<template>
  <div id="main-wrapper" class="w-full">
    <img @click="nextPicture('left')" id="arrow-left" src="dist/assets/arrow.svg" alt="arrow_left">
    <img @click="nextPicture('right')" id="arrow-right" src="dist/assets/arrow.svg" alt="arrow_right">

    <transition-group :name="direction">
      <img v-for="(photo, index) in photosArray" :key="photo.id" v-show="checkIfActivePhoto(index)"
           :class="'photo-cover ' + determineSideOfPicture(index)"
           :src="returnPhotoSrc(photo.name)" alt="primary_photo_cover">
    </transition-group>
    <slot></slot>
    <div id="pagination">
      <span v-for="index in this.photosLength" v-if="(!isMobile && index % 2 === 0)" @click="changePage(index-2)"
            :class="[{'circle-active' : activePrimaryPhoto === index - 2}]" class="circle"></span>
      <span v-for="index in this.photosLength" v-if="isMobile" @click="changePage(index-1)"
            :class="[{'circle-active' : activePrimaryPhoto === index - 1}]" class="circle"></span>
    </div>
    <div id="progress-bar-wrapper">
      <p id="progress-bar" :style="'width:' + progressBarWidth + '%'">s</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "slider",
  props: {
    photosJson: String
  },

  data() {
    return {
      photosArray: [],
      isMobile: false,
      activePrimaryPhoto: 0,
      activeSecondaryPhoto: 1,
      timer: null,
      progressTimer: null,
      progressBarWidth: 0,
      direction: 'right',
    }
  },

  computed: {
    photosLength() {
      return this.photosArray.length;
    }
  },

  methods: {
    // --- initial only ---
    convertJsonToArray() {
      const json = JSON.parse(this.photosJson);
      for (let i = 0; i < json.length; i++) {
        this.photosArray.push({
          id: i,
          name: json[i].name,
          alt: json[i].alt
        })
      }
    },

    listenForScreenResizing() {
      window.addEventListener('resize', this.checkIfMobile)
    },
    // --- end of initial only ---

    checkIfMobile() {
      window.innerWidth < 1024 ? this.isMobile = true : this.isMobile = false;
      this.resetActivePictures();
      this.restartTimer();
    },

    restartTimer() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.changePicturesInLoop, 7000);
      this.restartProgressBar();
    },

    restartProgressBar(){
      clearInterval(this.progressTimer);
      this.progressBarWidth = 0;
      this.progressTimer = setInterval(this.changeProgressBarWidth, 70)
    },

    checkIfActivePhoto(index) {
      if (this.isMobile) return index === this.activePrimaryPhoto;
      return index === this.activePrimaryPhoto || index === this.activeSecondaryPhoto;
    },

    nextPicture(direction) {
      direction === 'left' ? this.direction = 'left' : this.direction = 'right';
      this.changePicturesInLoop();
    },

    changePage(item_index) {
      item_index < this.activePrimaryPhoto ? this.nextPicture('left') : this.nextPicture('right');
      this.activePrimaryPhoto = item_index;
      this.activeSecondaryPhoto = item_index + 1;
    },

    changePicturesInLoop() {
      if (this.isMobile) {
        if (this.direction === 'left') {
          this.activePrimaryPhoto === 0 ? this.activePrimaryPhoto = (this.photosLength - 1) : this.activePrimaryPhoto--;
        } else {
          this.activePrimaryPhoto === (this.photosLength - 1) ? this.activePrimaryPhoto = 0 : this.activePrimaryPhoto++;
        }
      } else {
        if (this.direction === 'left') {
          this.activePrimaryPhoto === 0 ? this.activePrimaryPhoto = this.photosLength - 2 : this.activePrimaryPhoto -= 2;
          this.activeSecondaryPhoto === 1 ? this.activeSecondaryPhoto = this.photosLength - 1 : this.activeSecondaryPhoto -= 2;
        } else {
          this.activePrimaryPhoto === (this.photosLength - 2) ? this.activePrimaryPhoto = 0 : this.activePrimaryPhoto += 2;
          this.activeSecondaryPhoto === (this.photosLength - 1) ? this.activeSecondaryPhoto = 1 : this.activeSecondaryPhoto += 2;
        }
      }
      this.restartTimer();
    },

    resetActivePictures(){
      this.activePrimaryPhoto = 0;
      this.activeSecondaryPhoto = 1;
    },

    determineSideOfPicture(index) {
      return index % 2 === 0 ? 'photo-cover-left-0' : 'photo-cover-right-0';
    },

    returnPhotoSrc(photo_name) {
      return "dist/assets/" + photo_name;
    },

    changeProgressBarWidth(){
      if (this.progressBarWidth < 100) {
        this.progressBarWidth++
      }
    }
  },

  beforeMount() {
    this.convertJsonToArray();
  },

  mounted() {
    this.listenForScreenResizing();
    this.checkIfMobile();
    this.restartTimer();
  }
}
</script>