import { useEffect, useState } from "react";
import { BlockTypes, createBot } from "botui";
import { nanoid } from "nanoid";
import {
  BotUI,
  BotUIAction,
  BotUIMessageList,
  BotUIActionSelectButtonsReturns,
} from "@botui/react";
import "./bot.scss";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

const lexClient = new LexRuntimeV2Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_ACCESS_KEY_SECRET,
  },
});

// create bot instance
const botui = createBot();

// a random unique session id for every client
const sessionId = nanoid(10);

const getNdSetLexRes = async () => {
  const { value } = await botui.action.set({}, { actionType: "input" });

  const lexCmd = new RecognizeTextCommand({
    botId: import.meta.env.VITE_BOT_ID,
    botAliasId: import.meta.env.VITE_BOT_ALIAS_ID,
    localeId: "en_US",
    sessionId,
    text: value,
  });

  botui.wait();

  const lexRes = await lexClient.send(lexCmd);

  lexRes.messages?.forEach(async (msg) => {
    await botui.message.add({ text: msg.content });
  });

  // call it again to keep the conversation going
  getNdSetLexRes();
};

const setupBot = async () => {
  // botui.onChange(BlockTypes.MESSAGE, (e) => {
  //   console.log(e);
  // });
  await botui.wait({ waitTime: 500 });
  await botui.message.add({ text: `Hey there my friend 👋` });

  await botui.wait({ waitTime: 500 });
  await botui.message.add({ text: `How can I help you today?` });
  await botui.message.add(
    {
      links: [
        {
          text: "Apply for internship",
          href: "https://docs.google.com/forms/d/e/1FAIpQLSe4muh7BGiz-3Ol-n6ViPfMdT9UW75IEGreZx74JAPkot-T0A/viewform",
        },
      ],
    },
    { messageType: "links" }
  );

  await botui.message.add({
    text: `To book an industrial visit type: Book a visit`,
  });
  getNdSetLexRes();
};

function App() {
  useEffect(() => {
    setupBot();
  }, []);

  return (
    <div>
      <BotUI bot={botui}>
        <BotUIMessageList />
        <BotUIAction />
      </BotUI>
    </div>
  );
}

export default App;
