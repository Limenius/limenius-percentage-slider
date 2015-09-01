'use strict';

function LimperSlider() {
}

LimperSlider.prototype.play = function(song) {
  this.currentlyPlayingSong = song;
  this.isPlaying = true;
};

