import React, { useState } from "react";
import websocket from 'websocket';
import {Client, Message} from '@stomp/stompjs';
Object.assign(global, {Websocket: websocket.w3cwesocket});

//new try

import SockJS from "sockjs-client/dist/sockjs"
import { over } from 'stompjs';

let stompClient = null;

const onError = (error) => {
    console.log("Error:", error);
}

const onConnect = () => {
    console.log("Connected to WebSocket");
    const subscription = stompClient.subscribe("/game/public", onMessageReceived);
    console.log("Subscribed to /game/public:", subscription);
}

const onMessageReceived = (payload) => {
    console.log("Message received:", payload.body);
}

export function setUpConnection() {
    const sock = new SockJS("http://localhost:8080/ws");
    const stomp = over(sock);
    stompClient = stomp;

    stomp.connect({}, onConnect, onError);
}

export function joinLobby() {
    console.log("Joining lobby");
    const message = {
        username: "john",
    };
    stompClient.send("/game/lobby/join", {}, JSON.stringify(message));
}

/*
import React from "react";
const net = require('net');

//import stuff for stomp and websocket
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

//DETERMINE BEHAVIOUR ONCONNECT AND ONERROR
var stompClient=null;


export function setUpConnection(username){
    //ADD USER AS WEBSOCKET
    let Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, onConnect(username), onError());
}

const onConnect = (username) => {
  stompClient.subscribe('lobby/public', onMessageReceived());
  //SUBSCRIBE TO OTHER ENDPOINTS NEEDED
  //like: need to subscribe to some personal socket for in game -> e.g. 'game/"username"/'

  userJoin();
}

const onError = () => {}

const userJoin = () => {
  var message = {
    username: username,
    status: "JOIN"
  }
  stompClient.send("/game/lobby/join", {}, JSON.stringify(message));
}

const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload);
    console.log(payloadData);
}




//END OF WS BEHAVIOUR//
*/