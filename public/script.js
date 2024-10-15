let accessToken;
let correctTrack;
let options = [];

// Função para obter o token de acesso do Spotify
async function getSpotifyToken() {
const response = await fetch('/spotify-token');
const data = await response.json();
accessToken = data.access_token;
}

// Função para buscar músicas aleatórias de uma playlist
async function getRandomTrack() {
const playlistId = '37i9dQZF1DWXRqgorJj26U'; // coloque o código de uma playlist popular aqui
let trackFound = false;

while (!trackFound) {
const response = await
fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
headers: {
Authorization: `Bearer ${accessToken}`
}
});
const data = await response.json();

const randomIndex = Math.floor(Math.random() *
data.items.length);
correctTrack = data.items[randomIndex].track;

// Verifica se a música tem um preview disponível
if (correctTrack.preview_url) {
trackFound = true; // Encontrou uma música com preview
options = [correctTrack];




// Adiciona mais 3 opções aleatórias
while (options.length < 4) {
const randomOption =
data.items[Math.floor(Math.random() * data.items.length)].track;
if (!options.includes(randomOption)) {
options.push(randomOption);
}
}

// Embaralha as opções
options.sort(() => Math.random() - 0.5);

displayQuestion();
} else {
console.log('Música sem preview, buscando outra...');
}
}
}

// Exibe o trecho da música e as opções de resposta
function displayQuestion() {

const albumImage = document.getElementById('albumImage');
const audioPlayer = document.getElementById('audioPlayer');

audioPlayer.src = correctTrack.preview_url; // Exibe o preview da música
albumImage.src = correctTrack.album.images[0].url;
albumImage.style.display = 'block';

audioPlayer.style.display = 'block';
audioPlayer.play();

const optionsDiv = document.getElementById('options');
optionsDiv.innerHTML = ''; // Limpa as opções anteriores
options.forEach(option => {
const button = document.createElement('button');
button.innerText = option.name; // Nome da música
button.onclick = () => checkAnswer(option);
optionsDiv.appendChild(button);
});
}

let a = 0 , b = 0;
// Verifica se a resposta está correta
function checkAnswer(selected) {
const resultDiv = document.getElementById('result');
if (selected.name === correctTrack.name) {
    a++;
    resultDiv.innerHTML = `<p>Correto! Acertos ${a} Erros ${b}</p>`;
} else {
    b++;
    resultDiv.innerHTML = `<p>Incorreto! A música correta era: ${correctTrack.name}. Acertos ${a} Erros ${b}</p>`;
}

document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"

}

document.getElementById('nextButton').onclick = () => {
document.getElementById('result').innerHTML = ''; // Limpa o resultado
document.getElementById('nextButton').style.display = 'none'; // Esconde o botão "Próximo"
getRandomTrack(); // Inicia uma nova rodada
};

// Obtém o token e começa o jogo
getSpotifyToken().then(() => {
getRandomTrack();
});