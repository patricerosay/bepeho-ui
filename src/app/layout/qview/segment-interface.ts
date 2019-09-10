export interface Video {
   id: string;
   src: string;
   img: string;
}

export interface Audio {
   id: string;
   src: string;
}

export interface Segment {
   id: string;
   videos: Video[];
   audios: Audio[];
}

export interface QviewParameters {
   segments: Segment[];
}
