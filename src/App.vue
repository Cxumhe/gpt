<script setup>
import ChatMain from "./components/ChatMain.vue";
import ChatHistoryContainer from "./components/ChatHistoryContainer.vue";

import { provide, ref } from "vue";

const currentChat = ref(localStorage.key(0));
const ChatList = ref([]);
const toactivateDisplaytext = ref(true);
const historyCleanIndicator = ref(true);

provide("changeChat", changeChat);
provide("toactivateDisplaytext", toactivateDisplaytext);
provide("currentChat", currentChat);
provide("historyCleanIndicator", historyCleanIndicator);

function getChatList() {
    ChatList.value = [];
    for (let i = 0; i < localStorage.length; i++) {
        ChatList.value.push(localStorage.key(i));
    }
}
getChatList();

console.log(ChatList.value);

function clearLocalStorage() {
    localStorage.clear();
    localStorage.setItem("data0", JSON.stringify([]));
    currentChat.value = localStorage.key(0);
    getChatList();
    //指示ChatMain已经清除
    historyCleanIndicator.value = !historyCleanIndicator.value;
}

function addNewChat() {
    console.log(ChatList.value);
    ChatList.value.push(`data${ChatList.value.length}`);
    localStorage.setItem(
        `data${ChatList.value.length - 1}`,
        JSON.stringify([])
    );
    changeChat(ChatList.value[ChatList.value.length - 1]);
}

function changeChat(chat) {
    console.log(chat);
    currentChat.value = chat;
}

function toactivateDisplaytextHandler() {
    toactivateDisplaytext.value = !toactivateDisplaytext.value;
}
</script>
<template>
    <main>
        <ChatHistoryContainer
            :ChatList="ChatList"
            @addNewChat="addNewChat"
            @clearLocalStorage="clearLocalStorage"
        ></ChatHistoryContainer>
        <ChatMain
            :currentChat="currentChat"
            @toactivateDisplaytextHandler="toactivateDisplaytextHandler"
        ></ChatMain>
    </main>
</template>
<style scoped>
main {
    display: flex;
    flex-direction: row;
}
</style>
