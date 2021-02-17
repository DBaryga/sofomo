<template>
  <div id="main-wrapper" class="w-full">
    <transition-group name="slide-fade">
      <img v-for="(photo, index) in photosArray" :key="photo.id" v-show="checkIfActivePhoto(index)" :class="'photo-cover ' + determineSideOfPicture(index)"
           :src="returnPhotoSrc(photo.name)" alt="primary_photo_cover">
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
      activeSecondaryPhoto: 1,
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
      return index === this.activePrimaryPhoto || index === this.activeSecondaryPhoto;
    },
    startTimer() {
      setTimeout(this.changePictures, 7000);
    },
    changePictures() {
      if (this.isMobile){
        this.activePrimaryPhoto == (this.photosArray.length-1) ? this.activePrimaryPhoto = 0 : this.activePrimaryPhoto++;
      }else{
        this.activePrimaryPhoto == (this.photosArray.length-2) ? this.activePrimaryPhoto = 0 : this.activePrimaryPhoto+=2;
        this.activeSecondaryPhoto == (this.photosArray.length-1) ? this.activeSecondaryPhoto = 1 : this.activeSecondaryPhoto+=2;
      }
      this.startTimer();
    },
    returnPhotoSrc(photo_name) {
      return "dist/assets/" + photo_name;
    },
    determineSideOfPicture(index){
      return index % 2 === 0 ? 'left-0' : 'right-0';
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