# SoPra FS24 - GPTuessr

## Introduction

GPTuessr is an innovative online multiplayer game that blends the classic fun of drawing and guessing games with cutting-edge AI-driven art generation. Inspired by popular games like "skribbl", GPTuessr is designed to provide an engaging platform for groups of friends to connect and have fun remotely. At the heart of GPTuessr is the use of OpenAI's DALL-E, which generates real-time images based on players' descriptions, offering a unique twist to traditional hand-drawn approaches.
Our motivation stems from the exciting potential to merge art with technology, enhancing user experience by integrating advanced AI capabilities. The game features user authentication, dynamic lobby management, and intelligent game logic, all supported by the APIs of DALL-E and ChatGPT. As a web application, GPTuessr ensures broad accessibility and ease of use across various devices, facilitating seamless real-time communication and interaction among players. This project not only aims to entertain but also to pioneer new ways of experiencing art and gaming in a digital landscape.

## Technologies

- [Node.js](https://nodejs.org/en) - JavaScript runtime environemt
- [React](https://react.dev) - JavaScript Frontend Framework
- [Google Cloud](https://cloud.google.com/gcp) - Deployment of application
- [RESTful](https://restfulapi.net) - Web service for user control
- [Websocket](https://spring.io/guides/gs/messaging-stomp-websocket) - Real-time bidirectional communication between client and server
- [DALL-E API](https://platform.openai.com/docs/guides/images/image-generation) - Image Generation API
- [ChatGPT API](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) - ChatGPT API for Similary Check

## High-level components

### Image Generation

The [image generation view](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/src/components/views/GameCreate.tsx) is only shown to the player whose turn it is to generate the image with DAll-E in each round. In this view, the "creator" can enter an image description for an image that he wants to create.

### Description Guessing

The [description guessing view](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/src/components/views/GameGuess.tsx) is shown to all other players except the image creator. In this view once the image is created in the [image generation view](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/src/components/views/GameCreate.tsx) by the "creator" the image than gets displayed to the users that have a specific time limit (set in the [lobby settings](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/src/components/views/LobbyCreate.tsx)) to guess the correct image description.

### Scoreboard

The [scoreboard view](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/src/components/views/Scoreboard.tsx) is displayed to all players after each creation and guessing turn. In the scoreboard the correct image description is revealed and the players see the points they received and the other guesses and points of the players in the lobby.

## Launch & Deployment

Before you start your application for the first time, run this command to install all other dependencies, including React:

`npm install`

Next, you can start the app with:

`npm run dev`

Make sure you also started the application in the backend. For this view the README.md file in the [server](https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-server)

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use a Chrome-based browser)

The deployed webapplication on Google Cloud can be found here: [https://sopra-fs24-group-32-client.oa.r.appspot.com/](https://sopra-fs24-group-32-client.oa.r.appspot.com/)

## Illustrations

### Home

After register or log in to the game, players land on the home screen, where they can view the game rules and decide between creating or joining a lobby.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/HomeScreen.png"/> <br/>
</p>

### Create Lobby

When creating a lobby the player/host first has to specify the game settings, which can be also changed later in the lobby.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/LobbySettings.png"/> <br/>
</p>

### Join Lobby

Players that want to join a lobby created by a host, they can either type in the lobby-code manually or scan the QR-Code displayed in the lobby.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/JoinLobby.png"/> <br/>
</p>

### Lobby

In the lobby players wait for the game to be started by the host. In addition the game settings can be viewed, lobby can be left again and a host can kick players from the lobby.

Host View:

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/LobbyHost.png"/> <br/>
</p>

Joined Players View:

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/LobbyJoined.png"/> <br/>
</p>

### Image Generation

The player with the turn to provide an image description can type in a description for an image to be created by DALL-E.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/ImageCreateScreen.png"/> <br/>
</p>

### Description Guessing

Once the image is created and loaded it will be displayed and the players with the turn to guess can type in guess of the correct image description.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/ImageGuessScreen.png"/> <br/>
</p>

### Scoreboard

In the scoreboard players see the correct image description, points received and guesses/points of the other players in the lobby.

<p align="center>
    <img alt="GTPuessr" src="https://github.com/sopra-fs24-group-32/sopra-fs24-group-32-client/blob/main/docImages/Scoreboard.png"/> <br/>
</p>

## Roadmap

## Authors and Acknowledgment

### Authors

This game was brought to life by a group of five dedicated students who designed and implemented it as part of the Software Engineering Lab course at the University of Zurich during the spring semester of 2024.

- Roger Jeasy Bavibidila- [rogerjeasy](https://github.com/rogerjeasy)
- Eduard Gash - [eduard54](https://github.com/eduard54)
- Nicolas Huber - [nicolasHuber3](https://github.com/nicolasHuber3)
- Nicolas Schärer - [NlcoIas](https://github.com/NlcoIas)
- Eric Rudischhauser - [Ericode99](https://github.com/Ericode99)

### Acknowledgment

We are grateful to Fengjiao Ji ([feji08](https://github.com/feji08)) for her consistently helpful guidance and insightful comments.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details
