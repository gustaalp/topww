const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const videoContainer = document.getElementById('videoContainer');
const video = document.getElementById('video');
let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        videoContainer.style.display = 'block';
        startButton.style.display = 'none';

        // Iniciar a gravação
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = []; // zera o array antes de começar nova gravação
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        mediaRecorder.start();

        // Continuar gravando mesmo se o usuário sair do site
        window.addEventListener('beforeunload', () => {
            mediaRecorder.stop();
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            // Aqui você pode enviar o blob para um servidor ou armazená-lo localmente
            console.log('Gravação salva:', url);
        });
    } catch (error) {
        console.error('Erro ao acessar a câmera: ', error);
    }
});

stopButton.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }

    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.srcObject = null;
    videoContainer.style.display = 'none';
    startButton.style.display = 'block';
});
