const API_KEY = "ADD YOUR API HEREE";
const MODEL = "text-davinci-003";
const messages = [];

async function generateResponse(input) {
  let response;
  while (!response) {
    try {
      response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          prompt: `You are AI DOCTOR have all knowledge of medicines you will only reply medicines , you are professional so you list down recommended medicines and their usage ,if its something serious say call the ambulance! after writing medicines or saying call the ambulance , write down something that explains their situation in a new line. Human:"+ ${input}\nAI:`,
          max_tokens: 1000,
          n: 1,
          stop: "\n"
        })
      });
      if (!response.ok) {
        throw new Error("Failed to get response");
        retry(generateResponse(input));
      }
    } catch (error) {
      console.log(error);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const data = await response.json();
  const answer = data.choices[0].text.trim();
  messages.push({ user: input, ai: answer });
  displayMessages();
}

function displayMessages() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  messages.forEach(message => {
    const userMessage = `<div class="user-message">${message.user}</div>`;
    const aiMessage = `<div class="ai-message">${message.ai}</div>`;
    chatBox.innerHTML += userMessage + aiMessage;
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.getElementById("user-input").value;
  if (input) {
    document.getElementById("user-input").value = "";
    generateResponse(input);
  }
}


