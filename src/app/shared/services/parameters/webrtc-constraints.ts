export abstract class WebRTCConstraints {
    static readonly constraints = [
        {
            label: 'default: Very low bandwidth',
            uploadkbps: 80,
            downloadkbps: 100,
            localCameraCaptureFps: 5,
            constraints: {
                audio: true,
                video: {
                    frameRate: { min: 5, max: 5, ideal: 5 },
                    width: { min: '80', max: '80', ideal: '80' },
                    height: { min: '60', max: '60', ideal: '60' }
                }
            }
        },
        {
            label: 'Low Bandwidth configuration',
            uploadkbps: 150,
            downloadkbps: 300,
            localCameraCaptureFps: 10,
            constraints: {
                audio: true,
                video: {
                    frameRate: { min: 10, max: 10, ideal: 10 },
                    width: { min: '320', max: '320', ideal: '320' },
                    height: { min: '240', max: '240', ideal: '240' }
                }
            }
        },
        {
            label: 'Fair Bandwidth configuration',
            uploadkbps: 300,
            downloadkbps: 600,
            localCameraCaptureFps: 20,
            constraints: {
                audio: true,
                video: {
                    frameRate: { min: 20, max: 20, ideal: 20 },
                    width: { min: '640', max: '640', ideal: '640' },
                    height: { min: '480', max: '480', ideal: '480' }
                }
            }
        },
        {
            label: 'Good',
            uploadkbps: 600,
            downloadkbps: 900,
            localCameraCaptureFps: 25,
            constraints: {
                audio: true,
                video: {
                    frameRate: { min: 25, max: 25, ideal: 25 },
                    width: { min: '640', max: '640', ideal: '640' },
                    height: { min: '360', max: '360', ideal: '360' }
                }
            }
        },
        // {
        //     label: 'Very Good',
        //     uploadkbps: 1000,
        //     downloadkbps: 1300,
        //     localCameraCaptureFps: 25,
        //     constraints: {
        //         audio: true,
        //         video: {
        //             frameRate: { min: 25, max: 25, ideal: 25 },
        //             width: { min: '960', max: '960', ideal: '960' },
        //             height: { min: '720', max: '720', ideal: '720' }
        //         }
        //     }
        // }
    ];
}