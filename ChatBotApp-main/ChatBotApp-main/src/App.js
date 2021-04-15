import logo from "./logo.svg";
import "./App.css";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Sentiment from "sentiment";

function App() {
  const id = Math.random();
  //initalize sentiment
  const sentiment = new Sentiment();

  //set state to keep track sentiment score
  const [sentimentScore, setSentiment] = useState(null);

  //respone from twilio to start sentiment analysis
  let responseInit = false;

  //analysis on the responseMsg
  function findSentiment(msg) {
    const result = sentiment.analyze(msg);
    console.log(result);
    setSentiment(result.score);
    responseInit = false;
  }

  useEffect(() => {
    addResponseMessage("Welcome!");
  }, []);

  //inject sentiment score to twilio using axios
  const handleNewUserMessage2 = (message) => {
    console.log(message);
    if (responseInit == true) {
      findSentiment(message);
    }
    axios
      .post("https://chatbot-service-9775.twil.io/chat", {
        message,
        id,
      })
      .then((response) => {
        response.data.response.says.forEach((say) => {
          addResponseMessage(say.text);
          if (say.text == "How was our services today?") {
            responseInit = true;
          }
        });
      });
  }; //

  return (
    <div className="App">
      <header className="App-header">
        <Widget
          handleNewUserMessage={handleNewUserMessage2}
          title="Appointments Chat Bot"
          subtitle="Ask this bot questions about products and appointments."
        />
        <h1>ChatBot Widget App</h1>

        <p>Sentiment Score For the Bot : {sentimentScore}</p>
      </header>
    </div>
  );
}

export default App;
