export class IVideo {
   id: string;
   channel: string;
   src: string;
   img: string;
}

export class IAudio {
   id: string;
   channel: string;
   src: string;
}

export class ISegment {
   id: string;
   videos: IVideo[];
   audios: IAudio[];
}

export class IQviewParameters {
   segments: ISegment[];
}
