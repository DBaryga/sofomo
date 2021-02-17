<template>
  <div id="main-wrapper" class="w-full">
    <transition-group name="slide-fade">
      <img v-for="(photo, index) in photosArray" :key="photo.id" v-show="checkIfActivePhoto(index)" class="primary-photo-cover"
           :src="returnPrimaryPhotoSrc(photo.name)" alt="primary_photo_cover">
    </transition-group>
    <slot></slot>
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
      isMobile: false,
      activePrimaryPhoto: 0,
      photosArray: []
    }
  },
  methods: {
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
    checkIfMobile() {
      window.innerWidth < 1024 ? this.isMobile = true : this.isMobile = false;
    },
    checkIfActivePhoto(index) {
      return index === this.activePrimaryPhoto;
    },
    startTimer() {
      setTimeout(this.changePictures, 7000);
    },
    changePictures() {
      this.activePrimaryPhoto == (this.photosArray.length-1) ? this.activePrimaryPhoto = 0 : this.activePrimaryPhoto++;
      this.startTimer();
    },
    returnPrimaryPhotoSrc(photo_name) {
      return "dist/assets/" + photo_name;
    }
  },
  mounted() {
    this.convertJsonToArray();
    this.listenForScreenResizing();
    this.checkIfMobile();
    this.startTimer();
  }
}
</script>