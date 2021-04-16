import logo from "./logo.svg";
import "./App.css";
import { Widget, addResponseMessage, renderCustomComponent} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import axios from "axios";
import { useEffect, useState, useCallback, Component, ReactDOM } from "react";
import Sentiment from "sentiment";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import { render } from "@testing-library/react";

const containerStyle = {
      width: "400px",
      height: "400px"
    };
const coords = {
      lat: 49.94107923700716,
      lng: -119.39582816629222
    }
const markerCoords = {
  lat: 49.94107923700716, 
  lng: -119.39582816629222 
}
class Image extends Component{
  render(){
    return <img alt="placeholder" src={this.props.src}></img>;
  };
}

class Map extends Component{
  render() {
    return (
      <LoadScript
        googleMapsApiKey="AIzaSyA7qQ86gLstwURXzCBEODbz2HBpItylO-Q"
      >
        <GoogleMap
          mapContainerStyle={this.props.mapContainerStyle}
          center={this.props.center}
          zoom={16}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          <Marker
            position={this.props.position}
          />
        </GoogleMap>
      </LoadScript>
    )
  }
}

function App() {
  const id = Math.random();
  //initalize sentiment
  const sentiment = new Sentiment();

  
  const streetView = "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=49.94082994210937,-119.39593115975003&fov=120&heading=0&pitch=0&key=AIzaSyA7qQ86gLstwURXzCBEODbz2HBpItylO-Q&signature=5fxn-EII73FIFdqPjlIAfr39vwI=";

 
 
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
          if (say.text == "Appointment Booked!"){
              renderCustomComponent(Image, {src: streetView});
              renderCustomComponent(Map, {mapContainerStyle: containerStyle,center: coords,position: markerCoords});
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
