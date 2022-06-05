const axios = require('axios').default;

async function tts(text, voice) {
    let audio = undefined;
    await axios({
        method: 'post',
        url: 'https://streamlabs.com/polly/speak',
        data: {
            service: 'Polly',
            text,
            voice
        }
    }).then( response => {
        audio = response.data.speak_url;
    }).catch(err => {
        audio = null;
    });
    return audio;
}

module.exports = { tts };