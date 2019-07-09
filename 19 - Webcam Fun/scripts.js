const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            // video.src = window.URL.createObjectURL(localMediaStream);// deprecated, instead use next line
            video.srcObject=localMediaStream;
            video.play();
        })
        .catch( err => {
            console.error(`Oh no!!`, err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.height = height;
    canvas.width = width;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); // Sends video to complete screen
        // take the pixels out
        let pixels = ctx.getImageData(0,0, width, height);
        
        // Mess with the pixels
        // pixels = redEffect(pixels); // Primera función
        
        // pixels = rgbSplit(pixels); // Segunda función
        // ctx.globalAlpha = 0.1; // ghost effect

        pixels = greenScreen(pixels); // Tercera función

        // put them back
        console.log(pixels);
        // debugger; // so script stops loading here
        ctx.putImageData(pixels, 0, 0); 
    }, 16);

    console.log(width, height);
}

function takePhoto() {
    //plauyed the sound
    snap.currentTime = 0;
    snap.play();

    // Take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    // console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome man">`;
    // link.textContent = 'Download image';
    strip.insertBefore(link, strip.firsChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100// red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // green
        pixels.data[i + 2] = pixels.data[i + 2] + 0.5 // blue
    }

    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0] // red
        pixels.data[i + 500] = pixels.data[i + 1] // green
        pixels.data[i - 150] = pixels.data[i + 2] // blue
    }

    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    // console.log(levels);

    for ( i = 0; i < pixels.data.length; i+=4){
        red = pixels.data[i + 0]; 
        green = pixels.data[i + 1]; 
        blue = pixels.data[i + 2]; 
        alpha = pixels.data[i + 3]; 

        if ( red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                // take it out
                pixels.data[i + 3] = 0;
            }
    }

    return pixels;
}


getVideo();
// paintToCanvas();


video.addEventListener('canplay', paintToCanvas);