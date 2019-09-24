export interface IVideo {
   id: string;
   channel: string;
   src: string;
   img: string;
}

export interface IAudio {
   id: string;
   channel: string;
   src: string;
}

export interface ISegment {
   id: string;
   videos: IVideo[];
   audios: IAudio[];
}

export interface IQviewParameters {
   segments: ISegment[];
}
