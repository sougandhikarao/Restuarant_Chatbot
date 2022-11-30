class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            recordButton: document.querySelector('.record__button')
        }

        this.state = false;
        this.messages = [];
    }


    display() {
        const {openButton, chatBox, sendButton, recordButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        recordButton.addEventListener('click', () => this.startRecording(chatBox))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

     startRecording(chatbox){

        var speech = true;
        window.SpeechRecognition = window.SpeechRecognition
                        || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        const words = document.querySelector('#voice-text');
//        const words = document.getElementById('p');
        words.innerHTML=p;


        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')

            document.querySelector(".voice-text").value = transcript;
            console.log(transcript);
        });

        if (speech == true) {
            recognition.start();
            recognition.addEventListener('end', recognition.start);
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        var text1 = textField.value
        if (text1 === "") {
            return ;
        }

         function getVoices() {
          let voices = speechSynthesis.getVoices();
          if(!voices.length){
                 // some time the voice will not be initialized so we can call spaek with empty string
                // this will initialize the voices
          let utterance = new SpeechSynthesisUtterance("");
          speechSynthesis.speak(utterance);
          voices = speechSynthesis.getVoices();
           }
           return voices;
           }

          function speak(text, voice, rate, pitch, volume) {
              // create a SpeechSynthesisUtterance to configure the how text to be spoken
              let speakData = new SpeechSynthesisUtterance();
              speakData.volume = volume; // From 0 to 1
              speakData.rate = rate; // From 0.1 to 10
              speakData.pitch = pitch; // From 0 to 2
              speakData.text = text;
              speakData.lang = 'en';
              speakData.voice = voice;

              // pass the SpeechSynthesisUtterance to speechSynthesis.speak to start speaking
              speechSynthesis.speak(speakData);

         }

        var msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);


        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {

          var img = document.getElementById('image');


          if ((r.answer).startsWith('static')){
            img.src=r.answer;
            this.updateChatText(chatbox);
            img.style.display='block';
            textField.value = '';

          }
            else{
              let msg2 = { name: "Sam", message: r.answer };
              this.messages.push(msg2);
              this.updateChatText(chatbox);
              img.style.display='none';
              textField.value = '';

              if ('speechSynthesis' in window) {
                 let voices = getVoices();
                 let rate = 1, pitch = 2, volume = 1;
                 let text =  r.answer;

//                 speak(text, voices[1], rate, pitch, volume);

                 }
              else{
                     alert(' Speech Synthesis Not Supported 😞');
                }

          }


        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }

          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

    }
}


const chatbox = new Chatbox();
chatbox.display();

//
//document.getElementById("voice-text").scrollIntoView({ block: "end", behavior: "smooth" });